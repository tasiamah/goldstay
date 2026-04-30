import { describe, expect, it } from "vitest";
import {
  aggregateTransactionsByCurrency,
  occupancyPercent,
} from "./owner-dashboard";

describe("aggregateTransactionsByCurrency", () => {
  it("returns an empty array for no rows", () => {
    expect(aggregateTransactionsByCurrency([])).toEqual([]);
  });

  it("folds inflow + outflow into a single row per currency", () => {
    const rows = [
      { currency: "KES", direction: "INFLOW" as const, amount: 100_000 },
      { currency: "KES", direction: "OUTFLOW" as const, amount: 30_000 },
    ];
    const out = aggregateTransactionsByCurrency(rows);
    expect(out).toHaveLength(1);
    expect(out[0]).toEqual({
      currency: "KES",
      inflow: 100_000,
      outflow: 30_000,
      net: 70_000,
    });
  });

  it("groups multiple rows of the same currency+direction", () => {
    const rows = [
      { currency: "KES", direction: "INFLOW" as const, amount: 50_000 },
      { currency: "KES", direction: "INFLOW" as const, amount: 60_000 },
    ];
    const [row] = aggregateTransactionsByCurrency(rows);
    expect(row.inflow).toBe(110_000);
    expect(row.outflow).toBe(0);
    expect(row.net).toBe(110_000);
  });

  it("keeps each currency separate (no fake FX)", () => {
    const rows = [
      { currency: "KES", direction: "INFLOW" as const, amount: 100_000 },
      { currency: "USD", direction: "INFLOW" as const, amount: 1_500 },
    ];
    const out = aggregateTransactionsByCurrency(rows);
    expect(out).toHaveLength(2);
    const kes = out.find((r) => r.currency === "KES");
    const usd = out.find((r) => r.currency === "USD");
    expect(kes?.net).toBe(100_000);
    expect(usd?.net).toBe(1_500);
  });

  it("sorts the preferred currency to the top", () => {
    const rows = [
      { currency: "KES", direction: "INFLOW" as const, amount: 100_000 },
      { currency: "USD", direction: "INFLOW" as const, amount: 1_500 },
      { currency: "EUR", direction: "INFLOW" as const, amount: 1_200 },
    ];
    const out = aggregateTransactionsByCurrency(rows, "USD");
    expect(out[0].currency).toBe("USD");
  });

  it("sorts remaining currencies alphabetically", () => {
    const rows = [
      { currency: "KES", direction: "INFLOW" as const, amount: 1 },
      { currency: "USD", direction: "INFLOW" as const, amount: 1 },
      { currency: "EUR", direction: "INFLOW" as const, amount: 1 },
    ];
    const out = aggregateTransactionsByCurrency(rows, "USD");
    expect(out.map((r) => r.currency)).toEqual(["USD", "EUR", "KES"]);
  });

  it("computes a negative net when outflow exceeds inflow", () => {
    const rows = [
      { currency: "KES", direction: "INFLOW" as const, amount: 30_000 },
      { currency: "KES", direction: "OUTFLOW" as const, amount: 50_000 },
    ];
    const [row] = aggregateTransactionsByCurrency(rows);
    expect(row.net).toBe(-20_000);
  });

  it("coerces string amounts (Prisma Decimal serialisation) to numbers", () => {
    const rows = [
      { currency: "KES", direction: "INFLOW" as const, amount: "100000.50" },
      { currency: "KES", direction: "OUTFLOW" as const, amount: "0.25" },
    ];
    const [row] = aggregateTransactionsByCurrency(rows);
    expect(row.inflow).toBe(100_000.5);
    expect(row.outflow).toBe(0.25);
    expect(row.net).toBe(100_000.25);
  });

  it("treats null and undefined amounts as zero", () => {
    const rows = [
      { currency: "KES", direction: "INFLOW" as const, amount: null },
      { currency: "KES", direction: "INFLOW" as const, amount: undefined },
    ];
    const [row] = aggregateTransactionsByCurrency(rows);
    expect(row.inflow).toBe(0);
  });

  it("ignores rows with a missing currency", () => {
    const rows = [
      { currency: "", direction: "INFLOW" as const, amount: 100_000 },
      { currency: "KES", direction: "INFLOW" as const, amount: 50_000 },
    ];
    const out = aggregateTransactionsByCurrency(rows);
    expect(out).toHaveLength(1);
    expect(out[0].currency).toBe("KES");
  });
});

describe("occupancyPercent", () => {
  it("returns null when there are no units", () => {
    expect(occupancyPercent({ totalUnits: 0, occupiedUnits: 0 })).toBeNull();
  });

  it("returns 0 when nothing is occupied", () => {
    expect(occupancyPercent({ totalUnits: 5, occupiedUnits: 0 })).toBe(0);
  });

  it("returns 100 when everything is occupied", () => {
    expect(occupancyPercent({ totalUnits: 5, occupiedUnits: 5 })).toBe(100);
  });

  it("rounds to the nearest integer", () => {
    expect(occupancyPercent({ totalUnits: 3, occupiedUnits: 2 })).toBe(67);
    expect(occupancyPercent({ totalUnits: 6, occupiedUnits: 1 })).toBe(17);
  });

  it("handles a totalUnits below zero by returning null (defensive)", () => {
    expect(occupancyPercent({ totalUnits: -1, occupiedUnits: 0 })).toBeNull();
  });
});
