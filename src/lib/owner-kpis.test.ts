import { describe, expect, it } from "vitest";
import {
  pctChange,
  pickPrimaryCurrency,
  propertyShareForCurrency,
  summariseTransactionsByCurrency,
  utcMonthBuckets,
  type RawOwnerTransaction,
} from "./owner-kpis";

const NOW = new Date(Date.UTC(2026, 4, 15)); // 15 May 2026

function tx(
  date: string,
  amount: number,
  direction: "INFLOW" | "OUTFLOW",
  currency = "KES",
  propertyId = "prop-a",
): RawOwnerTransaction {
  return {
    occurredOn: new Date(date),
    amount,
    direction,
    currency,
    propertyId,
  };
}

describe("utcMonthBuckets", () => {
  it("returns N ascending months ending on the now month", () => {
    const buckets = utcMonthBuckets(NOW, 3);
    expect(buckets.map((b) => b.month)).toEqual([
      "2026-03",
      "2026-04",
      "2026-05",
    ]);
  });

  it("crosses year boundaries cleanly", () => {
    const jan = new Date(Date.UTC(2026, 0, 5));
    const buckets = utcMonthBuckets(jan, 3);
    expect(buckets.map((b) => b.month)).toEqual([
      "2025-11",
      "2025-12",
      "2026-01",
    ]);
  });
});

describe("summariseTransactionsByCurrency", () => {
  it("buckets per-month net per currency", () => {
    const summaries = summariseTransactionsByCurrency(
      [
        tx("2026-04-10T10:00:00Z", 100_000, "INFLOW"),
        tx("2026-04-12T10:00:00Z", 20_000, "OUTFLOW"),
        tx("2026-05-01T10:00:00Z", 50_000, "INFLOW"),
        tx("2026-05-02T10:00:00Z", 5_000, "OUTFLOW"),
      ],
      NOW,
    );

    expect(summaries).toHaveLength(1);
    const kes = summaries[0];
    expect(kes.currency).toBe("KES");
    const apr = kes.monthlyNet.find((m) => m.month === "2026-04");
    const may = kes.monthlyNet.find((m) => m.month === "2026-05");
    expect(apr?.net).toBe(80_000);
    expect(may?.net).toBe(45_000);
    expect(kes.twelveMonthNet).toBe(125_000);
  });

  it("computes the 30-day and prior-30-day windows", () => {
    const summaries = summariseTransactionsByCurrency(
      [
        // Inside last 30 days (15 May → window starts 15 Apr).
        tx("2026-04-20T10:00:00Z", 100_000, "INFLOW"),
        tx("2026-05-10T10:00:00Z", 30_000, "OUTFLOW"),
        // Inside the prior 30 days (15 Mar → 15 Apr).
        tx("2026-03-20T10:00:00Z", 60_000, "INFLOW"),
        tx("2026-04-01T10:00:00Z", 10_000, "OUTFLOW"),
        // Outside both (older than 60 days).
        tx("2026-01-10T10:00:00Z", 999_999, "INFLOW"),
      ],
      NOW,
    );

    const kes = summaries[0];
    expect(kes.thirtyDayNet).toBe(70_000); // 100k - 30k
    expect(kes.prior30DayNet).toBe(50_000); // 60k - 10k
  });

  it("sorts currencies by absolute 12-month volume", () => {
    const summaries = summariseTransactionsByCurrency(
      [
        tx("2026-05-01T00:00:00Z", 100, "INFLOW", "USD"),
        tx("2026-05-01T00:00:00Z", 1_000_000, "INFLOW", "KES"),
      ],
      NOW,
    );
    expect(summaries.map((s) => s.currency)).toEqual(["KES", "USD"]);
  });

  it("ignores transactions outside the 12-month window", () => {
    const summaries = summariseTransactionsByCurrency(
      [tx("2024-01-01T00:00:00Z", 999, "INFLOW")],
      NOW,
    );
    expect(summaries).toHaveLength(1);
    expect(summaries[0].twelveMonthNet).toBe(0);
  });
});

describe("pickPrimaryCurrency", () => {
  it("prefers the requested currency when it has activity", () => {
    const summaries = summariseTransactionsByCurrency(
      [
        tx("2026-05-01T00:00:00Z", 1_000, "INFLOW", "USD"),
        tx("2026-05-01T00:00:00Z", 1_000_000, "INFLOW", "KES"),
      ],
      NOW,
    );
    const primary = pickPrimaryCurrency(summaries, "USD");
    expect(primary?.currency).toBe("USD");
  });

  it("falls back to the most-active currency", () => {
    const summaries = summariseTransactionsByCurrency(
      [
        tx("2026-05-01T00:00:00Z", 1_000, "INFLOW", "USD"),
        tx("2026-05-01T00:00:00Z", 1_000_000, "INFLOW", "KES"),
      ],
      NOW,
    );
    const primary = pickPrimaryCurrency(summaries, "EUR");
    expect(primary?.currency).toBe("KES");
  });

  it("returns null when there are no summaries", () => {
    expect(pickPrimaryCurrency([], "USD")).toBeNull();
  });
});

describe("pctChange", () => {
  it("computes a positive delta", () => {
    const c = pctChange(120, 100);
    expect(c.direction).toBe("up");
    expect(c.delta).toBeCloseTo(20);
  });

  it("computes a negative delta", () => {
    const c = pctChange(80, 100);
    expect(c.direction).toBe("down");
    expect(c.delta).toBeCloseTo(-20);
  });

  it("returns flat when both sides are zero", () => {
    expect(pctChange(0, 0)).toEqual({ delta: null, direction: "flat" });
  });

  it("returns directional arrow when prior is zero but current isn't", () => {
    expect(pctChange(50, 0)).toEqual({ delta: null, direction: "up" });
    expect(pctChange(-50, 0)).toEqual({ delta: null, direction: "down" });
  });
});

describe("propertyShareForCurrency", () => {
  it("returns each property's share of positive net", () => {
    const rows = propertyShareForCurrency(
      [
        tx("2026-05-01T00:00:00Z", 100_000, "INFLOW", "KES", "p1"),
        tx("2026-05-02T00:00:00Z", 50_000, "INFLOW", "KES", "p2"),
        tx("2026-05-02T00:00:00Z", 25_000, "OUTFLOW", "KES", "p2"),
      ],
      "KES",
      new Date(Date.UTC(2026, 4, 1)),
    );
    expect(rows).toHaveLength(2);
    expect(rows[0].propertyId).toBe("p1");
    expect(rows[0].share).toBeCloseTo(100_000 / 125_000);
  });

  it("filters by the chosen currency", () => {
    const rows = propertyShareForCurrency(
      [
        tx("2026-05-01T00:00:00Z", 100, "INFLOW", "USD", "p1"),
        tx("2026-05-01T00:00:00Z", 100_000, "INFLOW", "KES", "p2"),
      ],
      "USD",
      new Date(Date.UTC(2026, 4, 1)),
    );
    expect(rows.map((r) => r.propertyId)).toEqual(["p1"]);
  });
});
