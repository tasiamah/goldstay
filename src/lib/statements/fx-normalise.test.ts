import { describe, expect, it } from "vitest";

import {
  earningCurrencyByProperty,
  normaliseCosts,
  type NormalisableTransaction,
} from "@/lib/statements/fx-normalise";
import type { FxRate } from "@/lib/fx/convert";

const day = (d: number) => new Date(Date.UTC(2026, 8, d));

const rates: FxRate[] = [
  { base: "USD", quote: "KES", asOf: day(16), rate: 129.748 },
  { base: "USD", quote: "KES", asOf: day(28), rate: 128.4 },
];

function tx(
  overrides: Partial<NormalisableTransaction> = {},
): NormalisableTransaction {
  return {
    occurredOn: day(28),
    direction: "OUTFLOW",
    amount: 6_000,
    currency: "KES",
    description: "Electricity token machine repair",
    propertyId: "polaris",
    ...overrides,
  };
}

const earnsUsd = new Map([["polaris", "USD"]]);

describe("earningCurrencyByProperty", () => {
  it("reads the currency a property actually took money in", () => {
    const got = earningCurrencyByProperty([
      { propertyId: "polaris", direction: "INFLOW", amount: 712, currency: "USD" },
      { propertyId: "polaris", direction: "OUTFLOW", amount: 6000, currency: "KES" },
    ]);
    expect(got.get("polaris")).toBe("USD");
  });

  it("goes by value, not by count", () => {
    // One small direct booking in shillings does not make a
    // dollar-earning unit a shilling-earning one.
    const got = earningCurrencyByProperty([
      { propertyId: "polaris", direction: "INFLOW", amount: 5, currency: "KES" },
      { propertyId: "polaris", direction: "INFLOW", amount: 4, currency: "KES" },
      { propertyId: "polaris", direction: "INFLOW", amount: 712, currency: "USD" },
    ]);
    expect(got.get("polaris")).toBe("USD");
  });

  it("knows nothing about a property that earned nothing", () => {
    // With no income there is no currency to convert costs into, and
    // guessing one would state a payout in a currency the owner has
    // never been paid in.
    const got = earningCurrencyByProperty([
      { propertyId: "empty", direction: "OUTFLOW", amount: 6000, currency: "KES" },
    ]);
    expect(got.has("empty")).toBe(false);
  });

  it("resolves a dead heat the same way every time", () => {
    const rows = [
      { propertyId: "p", direction: "INFLOW" as const, amount: 100, currency: "USD" },
      { propertyId: "p", direction: "INFLOW" as const, amount: 100, currency: "EUR" },
    ];
    expect(earningCurrencyByProperty(rows).get("p")).toBe("EUR");
    expect(earningCurrencyByProperty([...rows].reverse()).get("p")).toBe("EUR");
  });
});

describe("normaliseCosts", () => {
  it("converts a shilling cost on a dollar-earning unit", () => {
    const { rows, unconverted } = normaliseCosts([tx()], rates, earnsUsd);
    expect(unconverted).toBe(0);
    expect(rows[0].currency).toBe("USD");
    // 6000 / 128.4
    expect(rows[0].amount).toBeCloseTo(46.73, 2);
  });

  it("carries the original sum and the rate onto the line", () => {
    const { rows } = normaliseCosts([tx()], rates, earnsUsd);
    expect(rows[0].description).toBe(
      "Electricity token machine repair — KES 6,000 at 1 USD = 128.4 KES",
    );
  });

  it("uses the rate from the day the cost was paid, not the newest", () => {
    // Paid on the 16th, when a dollar bought 129.748 shillings.
    const { rows } = normaliseCosts(
      [tx({ occurredOn: day(16), amount: 2_000 })],
      rates,
      earnsUsd,
    );
    expect(rows[0].amount).toBe(15.41);
  });

  it("never touches income", () => {
    // A guest paid what they paid. Restating it would put the
    // statement out of step with Airbnb.
    const income = tx({ direction: "INFLOW", amount: 240, currency: "USD" });
    expect(normaliseCosts([income], rates, earnsUsd).rows[0]).toEqual(income);
  });

  it("leaves a cost alone when it is already in the earning currency", () => {
    const same = tx({ currency: "USD", amount: 15.41 });
    const { rows } = normaliseCosts([same], rates, earnsUsd);
    expect(rows[0]).toEqual(same);
    expect(rows[0].description).toBe("Electricity token machine repair");
  });

  it("leaves a cost alone, and says so, when no rate was on file", () => {
    // Before the daily job started running there are no rates at all.
    // Inventing one would be worse than showing the currencies apart.
    const { rows, unconverted } = normaliseCosts([tx()], [], earnsUsd);
    expect(unconverted).toBe(1);
    expect(rows[0].currency).toBe("KES");
    expect(rows[0].amount).toBe(6_000);
  });

  it("leaves a cost alone when the property earned nothing to convert into", () => {
    const { rows, unconverted } = normaliseCosts([tx()], rates, new Map());
    expect(unconverted).toBe(0);
    expect(rows[0].currency).toBe("KES");
  });

  it("does not annotate a line twice if it runs again", () => {
    const once = normaliseCosts([tx()], rates, earnsUsd).rows;
    const twice = normaliseCosts(
      once.map((r) => ({ ...r, currency: "KES", amount: 6_000 })),
      rates,
      earnsUsd,
    ).rows;
    expect(twice[0].description).toBe(
      "Electricity token machine repair — KES 6,000 at 1 USD = 128.4 KES",
    );
  });

  it("handles a cost with no description at all", () => {
    const { rows } = normaliseCosts(
      [tx({ description: null })],
      rates,
      earnsUsd,
    );
    expect(rows[0].description).toBe("KES 6,000 at 1 USD = 128.4 KES");
  });
});
