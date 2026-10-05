import { describe, expect, it } from "vitest";

import {
  applyStandardCleaning,
  STANDARD_CLEANING_FEE,
} from "@/lib/bookings/cleaning";

const base = {
  currency: "KES",
  grossAmount: 20_000,
  cleaningFee: null,
  netPayout: 20_000,
};

describe("applyStandardCleaning", () => {
  it("applies the standard rate when the source supplied none", () => {
    const out = applyStandardCleaning(base);
    expect(out.applied).toBe(true);
    expect(out.cleaningFee).toBe(1000);
    expect(out.netPayout).toBe(19_000);
  });

  it("leaves a fee the channel already charged alone", () => {
    const out = applyStandardCleaning({
      ...base,
      cleaningFee: 2_500,
      netPayout: 17_500,
    });
    expect(out.applied).toBe(false);
    expect(out.cleaningFee).toBe(2_500);
    expect(out.netPayout).toBe(17_500);
  });

  it("charges in the booking's own currency rather than converting", () => {
    const out = applyStandardCleaning({ ...base, currency: "USD" });
    expect(out.cleaningFee).toBe(STANDARD_CLEANING_FEE.USD);
    expect(out.cleaningFee).not.toBe(STANDARD_CLEANING_FEE.KES);
  });

  it("skips a placeholder stay carrying no revenue", () => {
    // An iCal feed gives dates and nothing else. Charging a clean
    // against it would show the owner a deduction on a stay their
    // statement reports no income for.
    const out = applyStandardCleaning({
      ...base,
      grossAmount: 0,
      netPayout: 0,
    });
    expect(out.applied).toBe(false);
    expect(out.cleaningFee).toBe(0);
    expect(out.netPayout).toBe(0);
  });

  it("prefers a per-property rate over the standard one", () => {
    const out = applyStandardCleaning({ ...base, propertyFee: 1_800 });
    expect(out.cleaningFee).toBe(1_800);
    expect(out.netPayout).toBe(18_200);
  });

  it("leaves the booking alone in a currency we hold no rate for", () => {
    const out = applyStandardCleaning({ ...base, currency: "GBP" });
    expect(out.applied).toBe(false);
    expect(out.cleaningFee).toBe(0);
  });

  it("is idempotent, so a reservation update cannot stack a second charge", () => {
    const first = applyStandardCleaning(base);
    const second = applyStandardCleaning({
      ...base,
      cleaningFee: first.cleaningFee,
      netPayout: first.netPayout,
    });
    expect(second.cleaningFee).toBe(first.cleaningFee);
    expect(second.netPayout).toBe(first.netPayout);
    expect(second.applied).toBe(false);
  });

  it("never drives a payout negative on a stay that barely covers the clean", () => {
    const out = applyStandardCleaning({
      ...base,
      grossAmount: 500,
      netPayout: 500,
    });
    expect(out.cleaningFee).toBe(1000);
    expect(out.netPayout).toBe(0);
  });
});
