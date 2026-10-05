import { describe, expect, it } from "vitest";

import {
  convert,
  formatRate,
  leastCostlyRate,
  rateOnOrBefore,
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

// A spread of rates across September, low in the middle.
const rates: FxRate[] = [
  usdKes(1, 130.5),
  usdKes(10, 129.9),
  usdKes(16, 128.4),
  usdKes(20, 129.2),
  usdKes(30, 131.0),
];

describe("rateOnOrBefore", () => {
  it("uses the rate published on the day itself", () => {
    const r = rateOnOrBefore(rates, "USD", "KES", day(16));
    expect(r?.rate).toBe(128.4);
  });

  it("looks back when the day has no rate of its own", () => {
    // Rates are not published at weekends. A Saturday cost has to
    // reach back rather than find nothing.
    const r = rateOnOrBefore(rates, "USD", "KES", day(18));
    expect(r?.rate).toBe(128.4);
    expect(r?.asOf).toEqual(day(16));
  });

  it("never looks forward", () => {
    // Valuing an earlier payment with a later rate restates history
    // using information we did not have at the time.
    expect(rateOnOrBefore(rates, "USD", "KES", new Date(Date.UTC(2026, 7, 1))))
      .toBeNull();
  });

  it("inverts a stored pair to answer the other direction", () => {
    // We store USD->KES. A shilling repair on a dollar-earning unit
    // asks the opposite question.
    const r = rateOnOrBefore(rates, "KES", "USD", day(16));
    expect(r?.inverted).toBe(true);
    expect(r?.rate).toBeCloseTo(1 / 128.4, 10);
    // KES 6,000 on 16 September.
    expect(convert(6_000, r!)).toBeCloseTo(46.73, 2);
  });

  it("returns a rate of 1 for a currency against itself", () => {
    const r = rateOnOrBefore([], "USD", "USD", day(16));
    expect(r?.rate).toBe(1);
  });

  it("ignores rows about a different pair", () => {
    const noise: FxRate[] = [
      { base: "GBP", quote: "KES", asOf: day(16), rate: 170 },
      { base: "USD", quote: "EUR", asOf: day(16), rate: 0.92 },
    ];
    expect(rateOnOrBefore(noise, "USD", "KES", day(16))).toBeNull();
  });

  it("ignores a nonsense rate rather than dividing by zero", () => {
    const bad: FxRate[] = [{ base: "KES", quote: "USD", asOf: day(16), rate: 0 }];
    expect(rateOnOrBefore(bad, "USD", "KES", day(16))).toBeNull();
  });
});

describe("leastCostlyRate", () => {
  it("hands over the fewest units of the currency we pay out in", () => {
    // Paying a KES-preferring owner out of USD income: fewest
    // shillings means the lowest KES-per-USD of the month.
    const r = leastCostlyRate(rates, "USD", "KES", september);
    expect(r?.rate).toBe(128.4);
    expect(convert(350.16, r!)).toBeCloseTo(44_960.54, 2);
  });

  it("flips which extreme that is when the pair runs the other way", () => {
    // Same rule, opposite direction: paying a USD-preferring owner
    // out of KES income means the fewest dollars, which is the
    // *highest* KES-per-USD — the other end of the same month.
    const r = leastCostlyRate(rates, "KES", "USD", september);
    expect(r?.inverted).toBe(true);
    expect(r?.rate).toBeCloseTo(1 / 131.0, 10);
    expect(r?.asOf).toEqual(day(30));
  });

  it("only considers rates inside the period", () => {
    const withOutliers = [
      ...rates,
      usdKes(-5, 100), // August
      { base: "USD", quote: "KES", asOf: new Date(Date.UTC(2026, 9, 2)), rate: 90 },
    ];
    const r = leastCostlyRate(withOutliers, "USD", "KES", september);
    expect(r?.rate).toBe(128.4);
  });

  it("treats the period end as exclusive", () => {
    const onBoundary: FxRate[] = [
      { base: "USD", quote: "KES", asOf: new Date(Date.UTC(2026, 9, 1)), rate: 1 },
      usdKes(15, 129),
    ];
    expect(leastCostlyRate(onBoundary, "USD", "KES", september)?.rate).toBe(129);
  });

  it("returns nothing for a month we hold no rates for", () => {
    // Must not reach for some unrelated day's rate. The caller falls
    // back to showing the currencies apart, which is what the
    // statement did before any of this existed.
    expect(leastCostlyRate([], "USD", "KES", september)).toBeNull();
  });
});

describe("convert", () => {
  it("rounds to cents", () => {
    expect(convert(10, { rate: 1.005, asOf: day(1), inverted: false })).toBe(
      10.05,
    );
  });

  it("is exact on the figure already on Yar's statement", () => {
    // KES 2,000 at the XE rate we keyed by hand on 16 September.
    const r = rateOnOrBefore(
      [{ base: "USD", quote: "KES", asOf: day(16), rate: 129.748 }],
      "KES",
      "USD",
      day(16),
    );
    expect(convert(2_000, r!)).toBe(15.41);
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
