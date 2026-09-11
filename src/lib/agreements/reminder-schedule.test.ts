import { describe, expect, it } from "vitest";
import {
  anchorFor,
  ESCALATION_STEP,
  FIRST_FOLLOW_UP_STEP,
  followUpStepsDue,
  isFollowUpStep,
  isWithinSendWindow,
  LAST_EMAIL_STEP,
  localHourIn,
  MAX_ATTEMPTS_PER_STEP,
  MAX_FOLLOW_UPS,
  planAgreementReminder,
  REMINDER_LADDER,
  timeZoneForCountry,
  type ReminderRecord,
} from "./reminder-schedule";

// Everything is pinned to explicit timestamps. 10:00 UTC is inside the
// send window for both countries (13:00 in Nairobi, 10:00 in Accra),
// which keeps the cadence tests free of quiet-hours interference.
const LIVE_FROM = new Date("2026-01-01T00:00:00Z");
const SENT_AT = new Date("2026-03-02T10:00:00Z");
const NAIROBI = "Africa/Nairobi";

function hoursAfterSent(hours: number): Date {
  return new Date(SENT_AT.getTime() + hours * 60 * 60 * 1000);
}

function plan(
  now: Date,
  history: ReminderRecord[] = [],
  overrides: Partial<Parameters<typeof planAgreementReminder>[0]> = {},
) {
  return planAgreementReminder({
    status: "SENT",
    sentAt: SENT_AT,
    history,
    timeZone: NAIROBI,
    now,
    liveFrom: LIVE_FROM,
    ...overrides,
  });
}

const sent = (step: number): ReminderRecord => ({
  step,
  status: "SENT",
  attempts: 1,
});

describe("the ladder itself", () => {
  it("stops emailing after four, however long it runs on", () => {
    // The load-bearing invariant of the whole design. The weekly
    // follow-ups after the handover are tasks, and they have to stay
    // tasks: this is the domain that sends statements and payout
    // confirmations, and an open-ended email drip to people who never
    // open it spends that domain's reputation on the clients least
    // likely to respond. A regression that made any step past the
    // handover an EMAIL is the one to catch here.
    const emails = REMINDER_LADDER.filter((s) => s.kind === "EMAIL");
    expect(emails).toHaveLength(4);
    expect(REMINDER_LADDER[REMINDER_LADDER.length - 1].kind).toBe("ESCALATION");

    const anchor = new Date("2026-01-01T00:00:00Z");
    const aYearLater = new Date("2027-01-01T00:00:00Z");
    const followUps = followUpStepsDue(anchor, aYearLater);
    expect(followUps.length).toBeGreaterThan(40);
    for (const s of followUps) {
      expect(s.kind, `step ${s.step}`).toBe("ESCALATION");
    }
  });

  it("runs 24h, 48h, 72h, 7 days then a human on day 8", () => {
    expect(REMINDER_LADDER.map((s) => s.afterHours)).toEqual([
      24, 48, 72, 168, 192,
    ]);
    for (let i = 1; i < REMINDER_LADDER.length; i++) {
      expect(REMINDER_LADDER[i].afterHours).toBeGreaterThan(
        REMINDER_LADDER[i - 1].afterHours,
      );
    }
  });

  it("uses stable step numbers, since they are persisted", () => {
    // Reusing or renumbering a step would make the unique constraint
    // match rows that describe a different message.
    expect(REMINDER_LADDER.map((s) => s.step)).toEqual([1, 2, 3, 4, 5]);
    expect(LAST_EMAIL_STEP).toBe(4);
    // The follow-ups continue upward from the fixed ladder rather than
    // recycling its numbers, for the same reason.
    expect(FIRST_FOLLOW_UP_STEP).toBeGreaterThan(ESCALATION_STEP);
    expect(isFollowUpStep(ESCALATION_STEP)).toBe(false);
    expect(isFollowUpStep(FIRST_FOLLOW_UP_STEP)).toBe(true);
  });

  it("spaces the follow-ups a week apart, starting a week after handover", () => {
    const anchor = new Date("2026-01-01T00:00:00Z");
    const hours = (h: number) =>
      new Date(anchor.getTime() + h * 60 * 60 * 1000);

    // Day 8 is the handover; the first follow-up is day 15.
    expect(followUpStepsDue(anchor, hours(192 + 167))).toHaveLength(0);
    expect(followUpStepsDue(anchor, hours(192 + 168))).toEqual([
      { step: FIRST_FOLLOW_UP_STEP, afterHours: 360, kind: "ESCALATION" },
    ]);
    expect(followUpStepsDue(anchor, hours(192 + 168 * 3)).map((s) => s.step)).toEqual([
      FIRST_FOLLOW_UP_STEP,
      FIRST_FOLLOW_UP_STEP + 1,
      FIRST_FOLLOW_UP_STEP + 2,
    ]);
  });

  it("bounds the follow-ups rather than generating forever", () => {
    // An agreement nobody archived must not turn into an unbounded
    // loop every hour for the life of the database.
    const anchor = new Date("2020-01-01T00:00:00Z");
    const wayLater = new Date("2030-01-01T00:00:00Z");
    expect(followUpStepsDue(anchor, wayLater)).toHaveLength(MAX_FOLLOW_UPS);
  });
});

describe("planAgreementReminder cadence", () => {
  it("sends nothing before the first step comes due", () => {
    expect(plan(hoursAfterSent(1))).toEqual({
      action: "wait",
      reason: "no-step-due",
    });
    expect(plan(hoursAfterSent(23.9))).toEqual({
      action: "wait",
      reason: "no-step-due",
    });
  });

  it("sends the first reminder exactly at 24 hours", () => {
    expect(plan(hoursAfterSent(24))).toEqual({
      action: "send",
      step: 1,
      kind: "EMAIL",
      supersede: [],
    });
  });

  it("walks one step at a time as each becomes due", () => {
    expect(plan(hoursAfterSent(48), [sent(1)])).toMatchObject({
      action: "send",
      step: 2,
    });
    expect(plan(hoursAfterSent(72), [sent(1), sent(2)])).toMatchObject({
      action: "send",
      step: 3,
    });
    expect(
      plan(hoursAfterSent(168), [sent(1), sent(2), sent(3)]),
    ).toMatchObject({ action: "send", step: 4 });
  });

  it("waits between steps instead of resending the last one", () => {
    expect(plan(hoursAfterSent(36), [sent(1)])).toEqual({
      action: "wait",
      reason: "no-step-due",
    });
  });

  it("hands over to a human after the final email, not a fifth email", () => {
    const history = [sent(1), sent(2), sent(3), sent(4)];
    expect(plan(hoursAfterSent(192), history)).toEqual({
      action: "send",
      step: ESCALATION_STEP,
      kind: "ESCALATION",
      supersede: [],
    });
  });

  it("raises a task a week after the handover, never another email", () => {
    // The cadence deliberately does not end at the handover any more,
    // but what continues is a task. Weekly email to a non-responder is
    // the thing this design refuses to do.
    const history = [sent(1), sent(2), sent(3), sent(4), sent(5)];

    // Nothing between the handover and the first weekly follow-up.
    expect(plan(hoursAfterSent(192), history)).toEqual({
      action: "wait",
      reason: "no-step-due",
    });
    expect(plan(hoursAfterSent(300), history)).toEqual({
      action: "wait",
      reason: "no-step-due",
    });

    const week1 = plan(hoursAfterSent(360), history);
    expect(week1).toEqual({
      action: "send",
      step: FIRST_FOLLOW_UP_STEP,
      kind: "ESCALATION",
      supersede: [],
    });

    const week2 = plan(hoursAfterSent(528), [
      ...history,
      sent(FIRST_FOLLOW_UP_STEP),
    ]);
    expect(week2).toMatchObject({
      step: FIRST_FOLLOW_UP_STEP + 1,
      kind: "ESCALATION",
    });
  });

  it("finally stops once the last follow-up has been dealt with", () => {
    const everything = [
      sent(1),
      sent(2),
      sent(3),
      sent(4),
      sent(5),
      ...Array.from({ length: MAX_FOLLOW_UPS }, (_, i) =>
        sent(FIRST_FOLLOW_UP_STEP + i),
      ),
    ];
    const wellPastTheEnd = hoursAfterSent(192 + MAX_FOLLOW_UPS * 168 + 1000);
    expect(plan(wellPastTheEnd, everything)).toEqual({
      action: "wait",
      reason: "ladder-complete",
    });
  });
});

describe("catching up after nothing ran", () => {
  it("sends one email, not four, when several steps are overdue", () => {
    // A cron that has been broken for a week must not apologise by
    // sending the entire ladder in one minute.
    const result = plan(hoursAfterSent(168));
    expect(result).toEqual({
      action: "send",
      step: 4,
      kind: "EMAIL",
      supersede: [1, 2, 3],
    });
  });

  it("supersedes only the steps that were actually missed", () => {
    const result = plan(hoursAfterSent(72), [sent(1)]);
    expect(result).toEqual({
      action: "send",
      step: 3,
      kind: "EMAIL",
      supersede: [2],
    });
  });

  it("goes straight to the human when the whole ladder is overdue", () => {
    // Eight days unsigned and never chased: email is not the right
    // instrument any more, so it hands over and marks the emails
    // missed.
    const result = plan(hoursAfterSent(192));
    expect(result).toEqual({
      action: "send",
      step: ESCALATION_STEP,
      kind: "ESCALATION",
      supersede: [1, 2, 3, 4],
    });
  });

  it("does the handover first even when later weeks are also overdue", () => {
    // A month of downtime on a never-chased agreement. "Week 3: still
    // has not signed" would be the wrong task to raise for a client
    // nobody has contacted once, and it would skip the email that
    // tells ops automated chasing has stopped. The later weeks are
    // settled in the same pass so the next three hourly runs do not
    // each raise a task.
    const result = plan(hoursAfterSent(192 + 168 * 3));
    expect(result).toMatchObject({
      action: "send",
      step: ESCALATION_STEP,
      kind: "ESCALATION",
    });
    expect(result).toHaveProperty("supersede");
    if (result.action !== "send") return;
    expect(result.supersede).toContain(1);
    expect(result.supersede).toContain(FIRST_FOLLOW_UP_STEP);
    expect(result.supersede).toContain(FIRST_FOLLOW_UP_STEP + 2);
    expect(result.supersede).not.toContain(ESCALATION_STEP);
  });
});

describe("the rollout backlog guard", () => {
  it("anchors on the later of sentAt and go-live", () => {
    const liveFrom = new Date("2026-06-01T00:00:00Z");
    const old = new Date("2026-01-15T00:00:00Z");
    const fresh = new Date("2026-07-01T00:00:00Z");
    expect(anchorFor(old, liveFrom)).toEqual(liveFrom);
    expect(anchorFor(fresh, liveFrom)).toEqual(fresh);
  });

  it("does not final-notice an agreement that predates the feature", () => {
    // This is the day-one hazard. Five agreements were already sitting
    // unsigned when reminders shipped; anchoring on sentAt would have
    // opened with "final notice" or a phone-call task for clients we
    // had never once chased.
    const liveFrom = new Date("2026-09-06T00:00:00Z");
    const sentLongAgo = new Date("2026-05-01T00:00:00Z");
    const oneHourAfterRollout = new Date("2026-09-06T01:00:00Z");

    expect(
      plan(oneHourAfterRollout, [], {
        sentAt: sentLongAgo,
        liveFrom,
      }),
    ).toEqual({ action: "wait", reason: "no-step-due" });

    // And when it does start, it starts gently at step 1.
    const dayAfterRollout = new Date("2026-09-07T10:00:00Z");
    expect(
      plan(dayAfterRollout, [], { sentAt: sentLongAgo, liveFrom }),
    ).toEqual({ action: "send", step: 1, kind: "EMAIL", supersede: [] });
  });
});

describe("quiet hours", () => {
  it("knows the local hour in both operating countries", () => {
    const at2230Utc = new Date("2026-09-06T22:30:00Z");
    expect(localHourIn(at2230Utc, "Africa/Nairobi")).toBe(1);
    expect(localHourIn(at2230Utc, "Africa/Accra")).toBe(22);
  });

  it("renders midnight as hour 0, not 24", () => {
    // hour12:false yields "24" on some ICU builds, which would put
    // every midnight outside the window by accident.
    expect(localHourIn(new Date("2026-09-06T21:00:00Z"), NAIROBI)).toBe(0);
  });

  it("opens at 08:00 and closes at 18:00 local", () => {
    const at = (iso: string) => isWithinSendWindow(new Date(iso), NAIROBI);
    expect(at("2026-09-06T04:59:00Z")).toBe(false); // 07:59 EAT
    expect(at("2026-09-06T05:00:00Z")).toBe(true); // 08:00 EAT
    expect(at("2026-09-06T14:59:00Z")).toBe(true); // 17:59 EAT
    expect(at("2026-09-06T15:00:00Z")).toBe(false); // 18:00 EAT
  });

  it("holds a due reminder rather than emailing at 03:00", () => {
    // 00:00 UTC is 03:00 in Nairobi.
    const middleOfNight = new Date("2026-03-04T00:00:00Z");
    expect(plan(middleOfNight)).toEqual({
      action: "wait",
      reason: "outside-send-window",
    });
  });

  it("sends it once the window opens", () => {
    const sameMorning = new Date("2026-03-04T06:00:00Z"); // 09:00 EAT
    expect(plan(sameMorning)).toMatchObject({ action: "send", step: 1 });
  });

  it("applies quiet hours per country, not per server", () => {
    // 06:30 UTC is 09:30 in Nairobi but 06:30 in Accra, so the same
    // instant is sendable for a Kenyan client and not for a Ghanaian.
    const at0630Utc = new Date("2026-03-04T06:30:00Z");
    expect(isWithinSendWindow(at0630Utc, "Africa/Nairobi")).toBe(true);
    expect(isWithinSendWindow(at0630Utc, "Africa/Accra")).toBe(false);
  });

  it("does not delay the internal escalation for quiet hours", () => {
    // Escalation is a task plus an email to our own inbox. Holding it
    // until morning would delay the handover for no one's benefit.
    // 00:00 UTC is 03:00 EAT, and this is past the day-8 step.
    const middleOfNight = new Date("2026-03-11T00:00:00Z");
    expect(
      plan(middleOfNight, [sent(1), sent(2), sent(3), sent(4)]),
    ).toMatchObject({ action: "send", kind: "ESCALATION" });
  });

  it("maps each country to its own zone", () => {
    expect(timeZoneForCountry("KE")).toBe("Africa/Nairobi");
    expect(timeZoneForCountry("GH")).toBe("Africa/Accra");
  });
});

describe("agreement status gates", () => {
  it("never chases a signed agreement", () => {
    expect(plan(hoursAfterSent(504), [], { status: "SIGNED" })).toEqual({
      action: "wait",
      reason: "not-awaiting-signature",
    });
  });

  it("never chases a cancelled agreement", () => {
    expect(plan(hoursAfterSent(504), [], { status: "CANCELLED" })).toEqual({
      action: "wait",
      reason: "not-awaiting-signature",
    });
  });

  it("never chases a draft, which the client has never seen", () => {
    // Reminding someone about a document we never sent them would
    // reference an email that does not exist. Unsent drafts are our
    // omission and belong in the admin queue instead.
    expect(plan(hoursAfterSent(504), [], { status: "DRAFT" })).toEqual({
      action: "wait",
      reason: "not-awaiting-signature",
    });
  });

  it("declines to guess when sentAt is missing", () => {
    expect(plan(hoursAfterSent(504), [], { sentAt: null })).toEqual({
      action: "wait",
      reason: "never-sent",
    });
  });
});

describe("retries and exhaustion", () => {
  it("retries a failed step while attempts remain", () => {
    const history: ReminderRecord[] = [
      { step: 1, status: "FAILED", attempts: 1 },
    ];
    expect(plan(hoursAfterSent(24), history)).toMatchObject({
      action: "send",
      step: 1,
    });
  });

  it("gives up on a step once attempts are exhausted", () => {
    // A permanently undeliverable address must not be retried hourly
    // forever.
    const history: ReminderRecord[] = [
      { step: 1, status: "FAILED", attempts: MAX_ATTEMPTS_PER_STEP },
    ];
    expect(plan(hoursAfterSent(24), history)).toEqual({
      action: "wait",
      reason: "no-step-due",
    });
  });

  it("moves on to later steps after exhausting an earlier one", () => {
    const history: ReminderRecord[] = [
      { step: 1, status: "FAILED", attempts: MAX_ATTEMPTS_PER_STEP },
    ];
    expect(plan(hoursAfterSent(48), history)).toMatchObject({
      action: "send",
      step: 2,
    });
  });

  it("retries a step left QUEUED by a run that died mid-send", () => {
    // Claim-then-send means a crash between the two leaves QUEUED. If
    // that counted as done, the client would silently lose a reminder.
    const history: ReminderRecord[] = [
      { step: 1, status: "QUEUED", attempts: 1 },
    ];
    expect(plan(hoursAfterSent(24), history)).toMatchObject({
      action: "send",
      step: 1,
    });
  });

  it("treats a superseded step as settled, never as a retry", () => {
    const history: ReminderRecord[] = [
      { step: 1, status: "SKIPPED", attempts: 0 },
    ];
    expect(plan(hoursAfterSent(24), history)).toEqual({
      action: "wait",
      reason: "no-step-due",
    });
  });
});

describe("idempotency under repeated runs", () => {
  it("is stable when called twice with no state change", () => {
    // The cron runs hourly, so the same inputs recur constantly. Two
    // identical calls must not produce two sends.
    const history = [sent(1)];
    const now = hoursAfterSent(48);
    expect(plan(now, history)).toEqual(plan(now, history));
  });

  it("does not resend a step already recorded as sent", () => {
    for (const step of [1, 2, 3, 4]) {
      const ladderEntry = REMINDER_LADDER.find((s) => s.step === step)!;
      const history = REMINDER_LADDER.filter((s) => s.step <= step).map((s) =>
        sent(s.step),
      );
      const result = plan(hoursAfterSent(ladderEntry.afterHours), history);
      expect(result.action, `step ${step}`).toBe("wait");
    }
  });
});
