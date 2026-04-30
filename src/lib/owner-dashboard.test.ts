import { describe, expect, it } from "vitest";
import {
  aggregateTransactionsByCurrency,
  occupancyPercent,
} from "./owner-dashboard";

describe("aggregateTransactionsByCurrency", () => {
  it("returns an empty array when there are no rows", () => {
    expect(aggregateTransactionsByCurrency([])).toEqual([]);
  });

  it("folds inflow and outflow into a single row per currency with a net", () => {
    const out = aggregateTransactionsByCurrency([
      { currency: "KES", direction: "INFLOW", amount: 100_000 },
      { currency: "KES", direction: "INFLOW", amount: 60_000 },
      { currency: "KES", direction: "OUTFLOW", amount: 30_000 },
    ]);
    expect(out).toEqual([
      { currency: "KES", inflow: 160_000, outflow: 30_000, net: 130_000 },
    ]);
  });

  it("keeps each currency separate and sorts preferred to the top", () => {
    const out = aggregateTransactionsByCurrency(
      [
        { currency: "KES", direction: "INFLOW", amount: 1 },
        { currency: "USD", direction: "INFLOW", amount: 1 },
        { currency: "EUR", direction: "INFLOW", amount: 1 },
      ],
      "USD",
    );
    expect(out.map((r) => r.currency)).toEqual(["USD", "EUR", "KES"]);
  });

  it("coerces Decimal-as-string amounts and treats null/undefined as zero", () => {
    // Both shapes hit this helper from Prisma: decimal columns
    // serialise to strings, and `_sum.amount` is null when a group
    // is empty.
    const out = aggregateTransactionsByCurrency([
      { currency: "KES", direction: "INFLOW", amount: "100000.50" },
      { currency: "KES", direction: "INFLOW", amount: null },
      { currency: "KES", direction: "OUTFLOW", amount: undefined },
    ]);
    expect(out[0].inflow).toBe(100_000.5);
    expect(out[0].outflow).toBe(0);
  });

  it("ignores rows with an empty currency rather than crashing", () => {
    const out = aggregateTransactionsByCurrency([
      { currency: "", direction: "INFLOW", amount: 100_000 },
      { currency: "KES", direction: "INFLOW", amount: 50_000 },
    ]);
    expect(out).toHaveLength(1);
    expect(out[0].currency).toBe("KES");
  });
});

describe("occupancyPercent", () => {
  it("returns null when there are no units (avoids 'NaN%' on the dashboard)", () => {
    expect(occupancyPercent({ totalUnits: 0, occupiedUnits: 0 })).toBeNull();
    expect(occupancyPercent({ totalUnits: -1, occupiedUnits: 0 })).toBeNull();
  });

  it("rounds to the nearest integer", () => {
    expect(occupancyPercent({ totalUnits: 3, occupiedUnits: 2 })).toBe(67);
    expect(occupancyPercent({ totalUnits: 6, occupiedUnits: 1 })).toBe(17);
    expect(occupancyPercent({ totalUnits: 5, occupiedUnits: 5 })).toBe(100);
  });
});
