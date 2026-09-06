// When to chase a client who has not signed their management
// agreement, and when to stop chasing and pick up the phone.
//
// Pure: no Prisma, no Resend, no clock of its own. Every decision the
// reminder cron makes is computed here from values passed in, so the
// cadence can be tested at pinned timestamps instead of by waiting a
// fortnight and watching an inbox.
//
// The ladder is deliberately finite. Chasing weekly forever is worse
// than it looks: after four unanswered emails a fifth does not convert,
// and repeated unopened mail to a non-responder produces the spam
// complaints and low engagement that degrade a sending domain. It is
// the same domain that sends monthly statements and payout
// confirmations, and those are the emails that genuinely must not land
// in spam. So the ladder ends by handing the client to a human, which
// converts better anyway for someone who has already ignored four
// emails about a contract.

import type { AgreementStatus, Country } from "@prisma/client";

export type ReminderStepKind = "EMAIL" | "ESCALATION";

export type ReminderStep = {
  /** Stable identifier. Persisted, so these numbers must not be reused. */
  step: number;
  /** Hours after the agreement was sent (or after rollout — see anchorFor). */
  afterHours: number;
  kind: ReminderStepKind;
};

const HOURS = 1;
const DAYS = 24 * HOURS;

// 1 day, 3 days, 7 days, 14 days, then a human at 21 days.
//
// Front-loaded because signature intent decays fast: a client who has
// not signed within a day has usually lost the email rather than
// decided against it, and that is the cheapest possible save. The gaps
// then widen so the later ones read as diligence rather than nagging.
export const REMINDER_LADDER: readonly ReminderStep[] = [
  { step: 1, afterHours: 1 * DAYS, kind: "EMAIL" },
  { step: 2, afterHours: 3 * DAYS, kind: "EMAIL" },
  { step: 3, afterHours: 7 * DAYS, kind: "EMAIL" },
  { step: 4, afterHours: 14 * DAYS, kind: "EMAIL" },
  // A week after the final email. Long enough that the final notice
  // has had a fair chance to work before we spend someone's afternoon
  // on a phone call.
  { step: 5, afterHours: 21 * DAYS, kind: "ESCALATION" },
];

export const LAST_EMAIL_STEP = 4;
export const ESCALATION_STEP = 5;

// Local hours during which a client-facing reminder may be sent. A
// contract nudge that arrives at 03:00 is deleted on sight or reported,
// and it makes us look automated at exactly the moment we are asking
// for a signature on a document about trust.
//
// Applies to client email only. Escalation is an internal task and an
// email to our own inbox, so it fires whenever it comes due.
export const SEND_WINDOW = { startHour: 8, endHour: 18 } as const;

// No weekday gate on purpose. Skipping weekends would stretch the
// 24-hour reminder to 72 hours for anything issued on a Friday, which
// is the exact case the first reminder exists to catch, and reviewing a
// management agreement on a Saturday morning is if anything more likely
// than during a working week.

// Goldstay operates in two countries and the Client model carries no
// timezone, so it is derived from country. Kenya is UTC+3 year round
// and Ghana is UTC+0; neither observes daylight saving, but the IANA
// names are used rather than fixed offsets so this stays correct if
// that ever changes.
const ZONE_BY_COUNTRY: Record<Country, string> = {
  KE: "Africa/Nairobi",
  GH: "Africa/Accra",
};

export function timeZoneForCountry(country: Country): string {
  return ZONE_BY_COUNTRY[country] ?? "Africa/Nairobi";
}

export function localHourIn(when: Date, timeZone: string): number {
  const part = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    // h23 rather than hour12:false, which renders midnight as "24" on
    // some ICU builds and would put every midnight outside the window
    // by accident rather than by decision.
    hourCycle: "h23",
  })
    .formatToParts(when)
    .find((p) => p.type === "hour")?.value;
  const hour = Number(part);
  return Number.isFinite(hour) ? hour : 12;
}

export function isWithinSendWindow(when: Date, timeZone: string): boolean {
  const hour = localHourIn(when, timeZone);
  return hour >= SEND_WINDOW.startHour && hour < SEND_WINDOW.endHour;
}

// Reminders went live after the platform already had unsigned
// agreements sitting in it, some of them weeks old. Anchoring their
// ladder on sentAt would have the first cron run open with a final
// notice, or skip straight to a phone-call task, for clients we have
// never once chased. So the clock starts at whichever is later: when we
// sent the agreement, or when reminders became a thing. An old
// agreement therefore gets a gentle first reminder 24 hours after
// rollout, which is what we would have sent had this existed.
export function remindersLiveFrom(): Date {
  const override = process.env.AGREEMENT_REMINDERS_LIVE_FROM;
  if (override) {
    const parsed = new Date(override);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return DEFAULT_LIVE_FROM;
}

// Deploy date of the reminder cron. Left as a constant rather than a
// required env var so a forgotten variable cannot silently turn the
// backlog guard off, which is the failure mode that emails everybody.
const DEFAULT_LIVE_FROM = new Date("2026-09-06T00:00:00Z");

export function anchorFor(sentAt: Date, liveFrom: Date): Date {
  return sentAt > liveFrom ? sentAt : liveFrom;
}

export type ReminderRecord = {
  step: number;
  status: "QUEUED" | "SENT" | "FAILED" | "SKIPPED";
  attempts: number;
};

// Attempts allowed per step before we stop retrying it. A transient
// Resend outage should not cost the client a reminder; a permanently
// undeliverable address should not be retried hourly forever.
export const MAX_ATTEMPTS_PER_STEP = 3;

export type ReminderPlan =
  | {
      action: "send";
      step: number;
      kind: ReminderStepKind;
      /** Steps that came due while nothing was running. Recorded as
       *  skipped rather than sent, so a backlog produces one email. */
      supersede: number[];
    }
  | { action: "wait"; reason: WaitReason };

export type WaitReason =
  | "not-awaiting-signature"
  | "never-sent"
  | "no-step-due"
  | "outside-send-window"
  | "ladder-complete";

export type PlanInput = {
  status: AgreementStatus;
  sentAt: Date | null;
  /** Existing reminder rows for this agreement, any order. */
  history: readonly ReminderRecord[];
  timeZone: string;
  now: Date;
  liveFrom?: Date;
};

export function planAgreementReminder(input: PlanInput): ReminderPlan {
  // SENT is the only status a client can act on. DRAFT is deliberately
  // excluded: it was never emailed to anyone, so chasing a signature on
  // it would reference a message the client never received. Unsent
  // drafts are an internal omission and already surface in the admin
  // attention queue.
  if (input.status !== "SENT") {
    return { action: "wait", reason: "not-awaiting-signature" };
  }
  if (!input.sentAt) {
    return { action: "wait", reason: "never-sent" };
  }

  const anchor = anchorFor(input.sentAt, input.liveFrom ?? remindersLiveFrom());
  const byStep = new Map(input.history.map((r) => [r.step, r]));

  // Walk the ladder from the far end. The most advanced due step is the
  // one to act on, because sending steps 1 through 4 in a burst is what
  // a stalled cron would otherwise do the moment it recovered.
  const dueSteps = REMINDER_LADDER.filter((s) =>
    hasElapsed(anchor, s.afterHours, input.now),
  );
  if (dueSteps.length === 0) {
    return { action: "wait", reason: "no-step-due" };
  }

  const outstanding = dueSteps.filter((s) => isOutstanding(byStep.get(s.step)));
  if (outstanding.length === 0) {
    // Every due step is done, exhausted or deliberately skipped. If
    // that includes the escalation there is nothing left to do at all.
    const escalation = byStep.get(ESCALATION_STEP);
    return {
      action: "wait",
      reason:
        escalation && !isOutstanding(escalation)
          ? "ladder-complete"
          : "no-step-due",
    };
  }

  const target = outstanding[outstanding.length - 1];

  // Quiet hours apply to the client-facing emails only.
  if (
    target.kind === "EMAIL" &&
    !isWithinSendWindow(input.now, input.timeZone)
  ) {
    return { action: "wait", reason: "outside-send-window" };
  }

  return {
    action: "send",
    step: target.step,
    kind: target.kind,
    supersede: outstanding.slice(0, -1).map((s) => s.step),
  };
}

function hasElapsed(anchor: Date, afterHours: number, now: Date): boolean {
  return now.getTime() - anchor.getTime() >= afterHours * 60 * 60 * 1000;
}

// A step still needs doing if it has never been attempted, or was
// attempted and failed but has retries left. QUEUED counts as
// outstanding so a run that died between claiming and sending is
// retried rather than silently swallowing that reminder.
function isOutstanding(record: ReminderRecord | undefined): boolean {
  if (!record) return true;
  if (record.status === "SENT" || record.status === "SKIPPED") return false;
  return record.attempts < MAX_ATTEMPTS_PER_STEP;
}

// Human-readable cadence, for the admin UI and the ops escalation
// email, so the schedule is never described in two places that drift.
export function describeLadder(): string {
  const emails = REMINDER_LADDER.filter((s) => s.kind === "EMAIL").map((s) =>
    formatHours(s.afterHours),
  );
  const escalation = REMINDER_LADDER.find((s) => s.kind === "ESCALATION");
  return `${emails.join(", ")}, then a call task at ${formatHours(
    escalation?.afterHours ?? 0,
  )}`;
}

export function formatHours(hours: number): string {
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  return days === 1 ? "1 day" : `${days} days`;
}
