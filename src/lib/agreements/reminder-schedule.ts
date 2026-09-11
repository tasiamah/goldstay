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

// 24h, 48h, 72h, then days 7, 14, 21 and 30, then a human on day 31.
//
// Front-loaded hard, because signature intent decays fast: a client who
// has not signed within a day has usually lost the email rather than
// decided against it, and that is the cheapest possible save. Three
// daily emails catch almost all of those.
//
// The long tail is there because these are worth closing. A management
// agreement is a multi-year relationship, so a client who goes quiet
// for a month and then signs is a good outcome, not a nuisance — and
// four spaced emails is a bounded tail rather than a drip, which is
// what keeps it off the sending domain's reputation. The distinction
// that matters is not how many emails but whether the sequence ends:
// this one does, on day 30, and then a person takes over.
//
// On the step numbers, which are not in chronological order and cannot
// be. They are persisted, they are half of the unique index the runner
// claims against, and a number that changes meaning silently
// reinterprets rows already written — a step-5 row recorded when 5 was
// the handover would be read as "the day-14 email already went out",
// skipping it and never escalating. So 1 to 4 keep the meaning they
// have always had, 5 stays the handover with only its timing moved, 6
// is retired rather than reused, and each email added since has taken
// the next free number: 7, 8, 9. Ordering comes from this array, never
// from the numbers.
export const REMINDER_LADDER: readonly ReminderStep[] = [
  { step: 1, afterHours: 24 * HOURS, kind: "EMAIL" },
  { step: 2, afterHours: 48 * HOURS, kind: "EMAIL" },
  { step: 3, afterHours: 72 * HOURS, kind: "EMAIL" },
  // A gap after three consecutive days. A fourth on day 4 would read
  // as a malfunction rather than as diligence, and the weekend falls
  // in here for most agreements.
  { step: 4, afterHours: 7 * DAYS, kind: "EMAIL" },
  { step: 7, afterHours: 14 * DAYS, kind: "EMAIL" },
  { step: 8, afterHours: 21 * DAYS, kind: "EMAIL" },
  // The one email allowed to name the calendar, because at a month
  // "it has been a month" is the message rather than decoration. Its
  // copy is pinned to this timing by a test, so moving this step tells
  // you which sentence starts lying.
  { step: 9, afterHours: 30 * DAYS, kind: "EMAIL" },
  // The day after the last email, not a week after it. By this point
  // the property has been off the market for a month and the remaining
  // question is not whether to chase but who does it.
  { step: 5, afterHours: 31 * DAYS, kind: "ESCALATION" },
];

// The last email in the sequence, for the copy that has to know it is
// the last one. Not a threshold: the email steps are 1, 2, 3, 4, 7, 8,
// 9 and the escalation sits at 5 in between them, so anything asking
// "is this an email" has to ask the ladder rather than compare numbers.
export const LAST_EMAIL_STEP = 9;
export const ESCALATION_STEP = 5;

export function isEmailStep(step: number): boolean {
  return REMINDER_LADDER.some((s) => s.step === step && s.kind === "EMAIL");
}

// "3 of 6", for an audit line a human reads. The step number is not the
// position any more — step 7 is the fifth email — so anything phrased
// as "reminder N of M" has to be given the position rather than the
// identifier, or the timeline claims we sent a seventh of six.
export function emailStepLabel(step: number): string {
  const emails = REMINDER_LADDER.filter((s) => s.kind === "EMAIL");
  const index = emails.findIndex((s) => s.step === step);
  return index === -1 ? `step ${step}` : `${index + 1} of ${emails.length}`;
}

// After the handover, a task a week until somebody closes it.
//
// Tasks rather than more email, which is the other half of the same
// decision. Chasing weekly by email looks free and is not: this is the
// domain that sends monthly statements and payout confirmations, and
// repeated unopened mail to a non-responder is exactly what degrades
// reputation at Gmail and Outlook. An unsigned agreement costs one
// onboarding. Statements in spam costs every client's confidence in
// the platform, and takes months to repair.
//
// A weekly task keeps the pressure and moves the judgement to a human,
// who can see that a client has gone quiet for a reason and close it —
// something a cron will never do.
export const FOLLOW_UP_INTERVAL_HOURS = 7 * DAYS;

// Starts at 20 rather than 9, leaving a gap above the emails. Step 6
// was briefly the first follow-up before the weekly emails were added
// and is retired rather than recycled, and the gap means another email
// can be slotted into the sequence later without colliding with a
// follow-up number already written to a row.
export const FIRST_FOLLOW_UP_STEP = 20;

// A year of weekly tasks. Not a real cadence decision — nobody is
// signing in week 53 — but the generator below needs a bound, and an
// unbounded loop over an agreement someone forgot to archive is a
// worse failure than a ladder that quietly runs out.
export const MAX_FOLLOW_UPS = 52;

// The weekly follow-ups, as ladder steps, for those that have come due.
//
// Generated rather than listed because "every week until someone deals
// with it" has no last entry. Step numbers continue upward from
// FIRST_FOLLOW_UP_STEP and are never reused, which matters because they
// are the primary key the runner claims against.
export function followUpStepsDue(
  anchor: Date,
  now: Date,
): readonly ReminderStep[] {
  const escalation = REMINDER_LADDER.find((s) => s.kind === "ESCALATION");
  if (!escalation) return [];

  const out: ReminderStep[] = [];
  for (let n = 1; n <= MAX_FOLLOW_UPS; n += 1) {
    const afterHours = escalation.afterHours + n * FOLLOW_UP_INTERVAL_HOURS;
    if (!hasElapsed(anchor, afterHours, now)) break;
    out.push({
      step: FIRST_FOLLOW_UP_STEP + n - 1,
      afterHours,
      kind: "ESCALATION",
    });
  }
  return out;
}

// Whether a step number is one of the weekly follow-ups rather than a
// member of the fixed ladder. The runner needs this because a step
// above the array still has to be treated as an escalation; defaulting
// it to EMAIL would look for copy that does not exist and fail the row.
export function isFollowUpStep(step: number): boolean {
  return step >= FIRST_FOLLOW_UP_STEP;
}

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
  const dueSteps = [
    ...REMINDER_LADDER.filter((s) => hasElapsed(anchor, s.afterHours, input.now)),
    ...followUpStepsDue(anchor, input.now),
  ];
  if (dueSteps.length === 0) {
    return { action: "wait", reason: "no-step-due" };
  }

  const outstanding = dueSteps.filter((s) => isOutstanding(byStep.get(s.step)));
  if (outstanding.length === 0) {
    // Every due step is done, exhausted or deliberately skipped.
    //
    // That is usually not the end any more: the weekly follow-ups mean
    // there is another step coming next week, so the normal answer here
    // is "nothing due yet" rather than "finished". Genuinely finished
    // only happens once the last follow-up the generator will ever
    // produce has been dealt with.
    const lastDue = dueSteps[dueSteps.length - 1];
    const exhausted =
      lastDue.step === FIRST_FOLLOW_UP_STEP + MAX_FOLLOW_UPS - 1;
    return {
      action: "wait",
      reason: exhausted ? "ladder-complete" : "no-step-due",
    };
  }

  // Normally the most advanced due step, which is what stops a
  // recovered cron sending the whole ladder at once.
  //
  // The exception is the handover. Nothing can follow up on a handover
  // that never happened, so if the escalation is still outstanding it
  // wins even when later weeks are also due. Without this, an
  // agreement that sat unchased for a month — a broken cron, or a
  // backlog — would open with "Week 3: still has not signed" for a
  // client nobody has contacted once, and skip the email that tells
  // ops automated chasing has stopped.
  const target =
    outstanding.find((s) => s.step === ESCALATION_STEP) ??
    outstanding[outstanding.length - 1];

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
    // Everything else that came due while nothing was running. Filtered
    // rather than sliced off the front, because the target is not
    // always the last entry any more: when the handover is chosen over
    // a later week, the weeks after it have to be settled too or the
    // next three hourly runs raise a task each.
    supersede: outstanding
      .filter((s) => s.step !== target.step)
      .map((s) => s.step),
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
  return `${emails.join(", ")}, then a WhatsApp task at ${formatHours(
    escalation?.afterHours ?? 0,
  )} and weekly after that`;
}

export function formatHours(hours: number): string {
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  return days === 1 ? "1 day" : `${days} days`;
}
