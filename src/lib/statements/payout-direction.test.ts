import { describe, expect, it } from "vitest";

import { splitByPayoutDirection } from "@/lib/statements/aggregate";

const total = (currency: string, net: number) => ({
  currency,
  inflow: net > 0 ? net : 0,
  outflow: net < 0 ? -net : 0,
  net,
});

describe("splitByPayoutDirection", () => {
  // Polaris bills guests in dollars. A KES 6,000 repair on it lands in
  // a currency the unit earned nothing in, so September netted USD
  // 350.16 and KES −6,000. The statement led with "Your payout" over
  // both, which told the owner they were being paid minus six
  // thousand shillings.
  it("keeps a currency that only ever cost money out of the payout", () => {
    const { paid, owed } = splitByPayoutDirection([
      total("KES", -6_000),
      total("USD", 350.16),
    ]);

    expect(paid.map((t) => t.currency)).toEqual(["USD"]);
    expect(owed.map((t) => t.currency)).toEqual(["KES"]);
  });

  it("treats a currency that nets exactly zero as paid, not owed", () => {
    // Zero is not a debt. Putting it under "to settle" would ask the
    // owner to pay nothing, which reads as an error.
    const { paid, owed } = splitByPayoutDirection([total("USD", 0)]);
    expect(paid).toHaveLength(1);
    expect(owed).toEqual([]);
  });

  it("loses nothing: every total lands on exactly one side", () => {
    const totals = [
      total("KES", -6_000),
      total("USD", 350.16),
      total("GBP", 0),
      total("EUR", -1),
    ];
    const { paid, owed } = splitByPayoutDirection(totals);
    expect(paid.length + owed.length).toBe(totals.length);
    expect([...paid, ...owed].map((t) => t.currency).sort()).toEqual([
      "EUR",
      "GBP",
      "KES",
      "USD",
    ]);
  });

  it("returns both sides empty for a month with no activity", () => {
    const { paid, owed } = splitByPayoutDirection([]);
    expect(paid).toEqual([]);
    expect(owed).toEqual([]);
  });
});
