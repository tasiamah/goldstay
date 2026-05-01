import { Prisma } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  addMonths,
  buildPayoutSchedule,
  projectLifetimeEarnings,
  resolveTermsForReferrer,
} from "./payouts";

describe("referral payouts", () => {
  it("agent on long-term lands $37.50/mo for 12 months on a $1.5k unit", () => {
    // Worked example from the welcome email + landing copy. If this
    // test ever needs to change, the public copy is now wrong too —
    // change them together, never apart.
    const schedule = buildPayoutSchedule({
      signedAt: new Date("2026-05-01T00:00:00Z"),
      monthlyRentUsd: 1500,
      managementFeePct: 0.1,
      strategy: "long-term",
      terms: { longTermPct: 0.25, shortStayPct: 0.15, payoutMonths: 12 },
    });
    expect(schedule).toHaveLength(12);
    expect(schedule[0]!.amountUsd).toBe(37.5);
    expect(schedule[0]!.monthIndex).toBe(1);
    expect(schedule[0]!.scheduledFor.toISOString()).toBe(
      "2026-06-01T00:00:00.000Z",
    );
    expect(schedule[11]!.scheduledFor.toISOString()).toBe(
      "2027-05-01T00:00:00.000Z",
    );
    expect(projectLifetimeEarnings({
      monthlyRentUsd: 1500,
      managementFeePct: 0.1,
      strategy: "long-term",
      terms: { longTermPct: 0.25, shortStayPct: 0.15, payoutMonths: 12 },
    })).toBe(450);
  });

  it("landlord-tier referral pays a single 50% slice", () => {
    const schedule = buildPayoutSchedule({
      signedAt: new Date("2026-05-01T00:00:00Z"),
      monthlyRentUsd: 2000,
      managementFeePct: 0.1,
      strategy: "long-term",
      terms: { longTermPct: 0.5, shortStayPct: 0.5, payoutMonths: 1 },
    });
    expect(schedule).toHaveLength(1);
    expect(schedule[0]!.amountUsd).toBe(100);
  });

  it("respects per-referrer overrides over the type defaults", () => {
    // Mimics a Referrer row with custom commission negotiated by ops.
    const terms = resolveTermsForReferrer({
      type: "AGENT",
      longTermPctOverride: new Prisma.Decimal("0.4"),
      shortStayPctOverride: null,
      payoutMonthsOverride: 6,
    });
    expect(terms.longTermPct).toBe(0.4);
    // Untouched override falls through to type default.
    expect(terms.shortStayPct).toBe(0.15);
    expect(terms.payoutMonths).toBe(6);
  });

  it("addMonths clamps day-of-month at the target month boundary", () => {
    // Jan 31 + 1 month = Feb 28 (or Feb 29 in a leap year). This is
    // the one bit of date arithmetic we can't get away with off-by-one.
    expect(
      addMonths(new Date("2026-01-31T00:00:00Z"), 1).toISOString(),
    ).toBe("2026-02-28T00:00:00.000Z");
  });
});
