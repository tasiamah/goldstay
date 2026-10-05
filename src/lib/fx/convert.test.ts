import { describe, expect, it } from "vitest";

import {
  convert,
  formatRate,
  monthlyRate,
  sameCurrency,
  type FxRate,
} from "@/lib/fx/convert";

const day = (d: number) => new Date(Date.UTC(2026, 8, d));

const usdKes = (d: number, rate: number): FxRate => ({
  base: "USD",
  quote: "KES",
  asOf: day(d),
  rate,
});

const september = {
  start: new Date(Date.UTC(2026, 8, 1)),
  end: new Date(Date.UTC(2026, 9, 1)),
};

// A spread of rates across September: lowest on the 16th, highest on
// the 30th.
const rates: FxRate[] = [
  usdKes(1, 130.5),
  usdKes(10, 129.9),
  usdKes(16, 128.4),
  usdKes(20, 129.2),
  usdKes(30, 131.0),
];

describe("monthlyRate", () => {
  it("gives a month one rate, whichever way the conversion runs", () => {
    // The point of a flat monthly rate: a statement quotes a single
    // number an owner can check, rather than one rate per line.
    const cost = monthlyRate(rates, "KES", "USD", september, "recover");
    const payout = monthlyRate(rates, "USD", "KES", september, "disburse");

    expect(cost?.label).toBe("1 USD = 128 KES");
    expect(payout?.label).toBe("1 USD = 128 KES");
    // Reciprocal, because they convert opposite ways at one rate.
    expect(cost!.rate * payout!.rate).toBeCloseTo(1, 10);
  });

  it("rounds down to a whole shilling in our favour", () => {
    // The worked example this was asked for: a KES 2,000 cost at a
    // true 129.6 bills at 129, so the shave we take converting it
    // does not come out of the management fee.
    const r = monthlyRate(
      [usdKes(16, 129.6)],
      "KES",
      "USD",
      september,
      "recover",
    );
    expect(r?.label).toBe("1 USD = 129 KES");
    expect(convert(2_000, r!.rate)).toBe(15.5);
    // What it really cost us, which is the figure we are protecting.
    expect(2_000 / 129.6).toBeCloseTo(15.43, 2);
  });

  it("uses the month's safest rate, not the rate on the day", () => {
    // A cost paid on the 30th, when a dollar bought 131 shillings,
    // still converts at the month's 128.
    const r = monthlyRate(rates, "KES", "USD", september, "recover");
    expect(convert(6_000, r!.rate)).toBe(46.88);
    // At the 30th's real rate it had cost us 45.80, so the month rate
    // is the conservative one as intended.
    expect(convert(6_000, 1 / 131)).toBe(45.8);
  });

  it("rounds the other way when we are the other side of the trade", () => {
    // A KES-earning unit paying a USD-preferring owner: now it is
    // dollars leaving our hands, so the safe end of the month is the
    // high one and the rounding goes up with it.
    const r = monthlyRate(rates, "KES", "USD", september, "disburse");
    expect(r?.label).toBe("1 USD = 131 KES");
    expect(convert(131_000, r!.rate)).toBe(1_000);

    // And a dollar cost billed to a KES-earning unit, which is the
    // same trade seen from the other end.
    const cost = monthlyRate(rates, "USD", "KES", september, "recover");
    expect(cost?.label).toBe("1 USD = 131 KES");
    expect(cost?.rate).toBe(131);
  });

  it("rounds to a step that suits the size of the rate", () => {
    // Flooring every rate to a whole number would turn the euro rate
    // into 1 and the cedi rate into 15, which is not a rounding so
    // much as a confiscation.
    // Paying euros out of dollars, so the safe end is the one where a
    // euro costs more dollars and we part with fewer euros.
    const eur: FxRate[] = [
      { base: "EUR", quote: "USD", asOf: day(10), rate: 1.1634 },
    ];
    expect(monthlyRate(eur, "USD", "EUR", september, "disburse")?.label).toBe(
      "1 EUR = 1.17 USD",
    );

    const ghs: FxRate[] = [
      { base: "USD", quote: "GHS", asOf: day(10), rate: 15.672 },
    ];
    expect(monthlyRate(ghs, "USD", "GHS", september, "disburse")?.label).toBe(
      "1 USD = 15.6 GHS",
    );
  });

  it("keeps the margin the rounding creates under one percent", () => {
    // The margin has to be small enough to read as the cost of
    // converting money rather than as a fee nobody mentioned.
    const cases: [number, string][] = [
      [129.748, "KES"],
      [100.01, "KES"],
      [15.672, "GHS"],
      [10.09, "GHS"],
      [1.1634, "USD"],
      [1.009, "USD"],
    ];
    for (const [rate, quote] of cases) {
      const r = monthlyRate(
        [{ base: "XXX", quote, asOf: day(10), rate }],
        "XXX",
        quote,
        september,
        "disburse",
      );
      const margin = (rate - r!.rate) / rate;
      expect(margin).toBeGreaterThanOrEqual(0);
      expect(margin).toBeLessThan(0.01);
    }
  });

  it("does not lose a rate that already sits on a step", () => {
    // 15.6 / 0.1 is 155.99999999999997 in binary floating point, so
    // an unguarded floor would quietly hand over 15.5.
    const ghs: FxRate[] = [
      { base: "USD", quote: "GHS", asOf: day(10), rate: 15.6 },
    ];
    expect(monthlyRate(ghs, "USD", "GHS", september, "disburse")?.rate).toBe(
      15.6,
    );
  });

  it("only considers rates published inside the month", () => {
    const withOutliers: FxRate[] = [
      ...rates,
      usdKes(-5, 100), // August
      { base: "USD", quote: "KES", asOf: new Date(Date.UTC(2026, 9, 2)), rate: 90 },
    ];
    const r = monthlyRate(withOutliers, "USD", "KES", september, "disburse");
    expect(r?.rate).toBe(128);
    expect(r?.observations).toBe(5);
  });

  it("treats the month end as exclusive", () => {
    const onBoundary: FxRate[] = [
      { base: "USD", quote: "KES", asOf: new Date(Date.UTC(2026, 9, 1)), rate: 1 },
      usdKes(15, 129),
    ];
    expect(
      monthlyRate(onBoundary, "USD", "KES", september, "disburse")?.rate,
    ).toBe(129);
  });

  it("returns nothing for a month we hold no rates for", () => {
    // Must not reach into a neighbouring month. The caller shows the
    // currencies apart, which is what the statement did before any of
    // this existed.
    expect(monthlyRate([], "USD", "KES", september, "disburse")).toBeNull();
  });

  it("returns a rate of 1 for a currency against itself", () => {
    expect(monthlyRate([], "USD", "USD", september, "recover")?.rate).toBe(1);
  });

  it("ignores rows about a different pair", () => {
    const noise: FxRate[] = [
      { base: "GBP", quote: "KES", asOf: day(16), rate: 170 },
      { base: "USD", quote: "EUR", asOf: day(16), rate: 0.92 },
    ];
    expect(monthlyRate(noise, "USD", "KES", september, "disburse")).toBeNull();
  });

  it("ignores a nonsense rate rather than dividing by zero", () => {
    const bad: FxRate[] = [
      { base: "KES", quote: "USD", asOf: day(16), rate: 0 },
    ];
    expect(monthlyRate(bad, "USD", "KES", september, "disburse")).toBeNull();
  });
});

describe("convert", () => {
  it("rounds to cents", () => {
    expect(convert(10, 1.005)).toBe(10.05);
  });
});

describe("sameCurrency", () => {
  it("ignores case and padding", () => {
    expect(sameCurrency(" usd ", "USD")).toBe(true);
    expect(sameCurrency("USD", "KES")).toBe(false);
  });
});

describe("formatRate", () => {
  it("reads as a sentence and drops trailing zeros", () => {
    expect(formatRate("USD", "KES", 129.748)).toBe("1 USD = 129.748 KES");
    expect(formatRate("usd", "kes", 130)).toBe("1 USD = 130 KES");
  });
});
