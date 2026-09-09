import { describe, expect, it } from "vitest";
import type { ReferralStatus } from "@prisma/client";
import {
  allowedReferralTransitions,
  canSettlePayout,
  canTransitionReferral,
  cancelsScheduledPayouts,
  isPayoutDue,
  originatesPayouts,
  referrerLinkWorks,
  timestampFieldFor,
  REFERRAL_STATUS_LABEL,
} from "./lifecycle";

const ALL: ReferralStatus[] = [
  "ATTRIBUTED",
  "CONTACTED",
  "QUALIFIED",
  "SIGNED",
  "CHURNED",
  "REJECTED",
];

describe("canTransitionReferral", () => {
  it("walks the happy path", () => {
    expect(canTransitionReferral("ATTRIBUTED", "CONTACTED")).toBe(true);
    expect(canTransitionReferral("CONTACTED", "QUALIFIED")).toBe(true);
    expect(canTransitionReferral("QUALIFIED", "SIGNED")).toBe(true);
  });

  // An agent sometimes introduces a landlord who signs that week.
  // Forcing three clicks through states nobody observed would teach
  // operators the buttons are theatre.
  it("allows skipping ahead", () => {
    expect(canTransitionReferral("ATTRIBUTED", "SIGNED")).toBe(true);
    expect(canTransitionReferral("ATTRIBUTED", "QUALIFIED")).toBe(true);
  });

  // The one that matters. Un-signing would orphan a payout schedule
  // that may already have paid money out.
  it("never goes backwards", () => {
    expect(canTransitionReferral("SIGNED", "QUALIFIED")).toBe(false);
    expect(canTransitionReferral("SIGNED", "CONTACTED")).toBe(false);
    expect(canTransitionReferral("SIGNED", "ATTRIBUTED")).toBe(false);
    expect(canTransitionReferral("QUALIFIED", "CONTACTED")).toBe(false);
    expect(canTransitionReferral("CONTACTED", "ATTRIBUTED")).toBe(false);
  });

  it("allows the one legitimate reversal, signed to churned", () => {
    expect(canTransitionReferral("SIGNED", "CHURNED")).toBe(true);
  });

  it("can refuse a lead at any point before signing, but not after", () => {
    expect(canTransitionReferral("ATTRIBUTED", "REJECTED")).toBe(true);
    expect(canTransitionReferral("CONTACTED", "REJECTED")).toBe(true);
    expect(canTransitionReferral("QUALIFIED", "REJECTED")).toBe(true);
    // Refusing a landlord we already signed is a churn. The agent is
    // owed the months already accrued either way, so conflating the
    // two would misstate why the relationship ended.
    expect(canTransitionReferral("SIGNED", "REJECTED")).toBe(false);
  });

  it("treats churned and rejected as terminal", () => {
    for (const to of ALL) {
      expect(canTransitionReferral("CHURNED", to), to).toBe(false);
      expect(canTransitionReferral("REJECTED", to), to).toBe(false);
    }
  });

  it("refuses a no-op", () => {
    for (const s of ALL) {
      expect(canTransitionReferral(s, s), s).toBe(false);
    }
  });

  // Guards against a status being added to the enum and silently
  // having no route into it.
  it("every status except the first is reachable from somewhere", () => {
    for (const target of ALL.filter((s) => s !== "ATTRIBUTED")) {
      const reachable = ALL.some((from) =>
        allowedReferralTransitions(from).includes(target),
      );
      expect(reachable, `nothing transitions into ${target}`).toBe(true);
    }
  });

  it("has a label for every status", () => {
    for (const s of ALL) {
      expect(REFERRAL_STATUS_LABEL[s], s).toBeTruthy();
    }
  });
});

describe("timestampFieldFor", () => {
  it("stamps the two states that record a moment", () => {
    expect(timestampFieldFor("CONTACTED")).toBe("contactedAt");
    expect(timestampFieldFor("SIGNED")).toBe("signedAt");
  });

  it("stamps nothing for the rest", () => {
    expect(timestampFieldFor("ATTRIBUTED")).toBeNull();
    expect(timestampFieldFor("QUALIFIED")).toBeNull();
    expect(timestampFieldFor("CHURNED")).toBeNull();
  });
});

describe("originatesPayouts", () => {
  // Only one status may start a twelve-month commitment.
  it("is true for SIGNED alone", () => {
    for (const s of ALL) {
      expect(originatesPayouts(s), s).toBe(s === "SIGNED");
    }
  });
});

describe("referrer status effects", () => {
  // Straight from the schema comments: PAUSED holds, TERMINATED kills.
  it("only termination cancels scheduled payouts", () => {
    expect(cancelsScheduledPayouts("TERMINATED")).toBe(true);
    expect(cancelsScheduledPayouts("PAUSED")).toBe(false);
    expect(cancelsScheduledPayouts("ACTIVE")).toBe(false);
  });

  it("only an active referrer's link tracks", () => {
    expect(referrerLinkWorks("ACTIVE")).toBe(true);
    expect(referrerLinkWorks("PAUSED")).toBe(false);
    expect(referrerLinkWorks("TERMINATED")).toBe(false);
  });
});

describe("payout settlement", () => {
  // Re-marking a paid row would overwrite the reference of the
  // payment that actually happened, which is the only evidence it did.
  it("only a scheduled payout can be settled or cancelled", () => {
    expect(canSettlePayout("SCHEDULED")).toBe(true);
    expect(canSettlePayout("PAID")).toBe(false);
    expect(canSettlePayout("CANCELLED")).toBe(false);
  });

  it("is due once its month has arrived", () => {
    const now = new Date("2026-06-15T00:00:00Z");
    expect(
      isPayoutDue(
        { status: "SCHEDULED", scheduledFor: new Date("2026-06-01T00:00:00Z") },
        now,
      ),
    ).toBe(true);
    expect(
      isPayoutDue(
        { status: "SCHEDULED", scheduledFor: new Date("2026-07-01T00:00:00Z") },
        now,
      ),
    ).toBe(false);
  });

  it("is never due once it is no longer scheduled", () => {
    const past = new Date("2020-01-01T00:00:00Z");
    expect(isPayoutDue({ status: "PAID", scheduledFor: past })).toBe(false);
    expect(isPayoutDue({ status: "CANCELLED", scheduledFor: past })).toBe(false);
  });
});
