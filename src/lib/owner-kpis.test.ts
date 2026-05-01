import { describe, expect, it } from "vitest";
import {
  pctChange,
  pickPrimaryCurrency,
  propertyShareForCurrency,
  summariseTransactionsByCurrency,
  type RawOwnerTransaction,
} from "./owner-kpis";

const NOW = new Date(Date.UTC(2026, 4, 15));

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

// Owner-facing money KPIs. The dashboard derives every headline number
// from this module, so the regression hazards here are: (a) the
// inflow/outflow netting per currency, and (b) the 30-day vs prior-30
// window used for the "vs. last month" arrow. Everything else is
// presentational and would be caught by visual review.
describe("summariseTransactionsByCurrency", () => {
  it("nets monthly per currency, sorts by 12-month volume, and computes both 30-day windows", () => {
    const summaries = summariseTransactionsByCurrency(
      [
        tx("2026-04-20T10:00:00Z", 100_000, "INFLOW"),
        tx("2026-05-10T10:00:00Z", 30_000, "OUTFLOW"),
        tx("2026-03-20T10:00:00Z", 60_000, "INFLOW"),
        tx("2026-04-01T10:00:00Z", 10_000, "OUTFLOW"),
        tx("2026-05-01T00:00:00Z", 100, "INFLOW", "USD"),
      ],
      NOW,
    );

    // Currencies sorted by absolute 12-month volume.
    expect(summaries.map((s) => s.currency)).toEqual(["KES", "USD"]);

    const kes = summaries[0]!;
    expect(kes.thirtyDayNet).toBe(70_000);
    expect(kes.prior30DayNet).toBe(50_000);
    expect(kes.twelveMonthNet).toBe(120_000);
  });
});

// Currency selection feeds the "primary card" on the dashboard. One
// merged test covers both branches: requested currency wins when it
// has activity, otherwise we surface the most-active one.
describe("pickPrimaryCurrency", () => {
  it("prefers the requested currency and falls back to the most active", () => {
    const summaries = summariseTransactionsByCurrency(
      [
        tx("2026-05-01T00:00:00Z", 1_000, "INFLOW", "USD"),
        tx("2026-05-01T00:00:00Z", 1_000_000, "INFLOW", "KES"),
      ],
      NOW,
    );
    expect(pickPrimaryCurrency(summaries, "USD")?.currency).toBe("USD");
    expect(pickPrimaryCurrency(summaries, "EUR")?.currency).toBe("KES");
  });
});

// The four arrow states on the "vs. last period" indicator. Each
// state has visible UI consequences (up/down arrow, flat dash), so
// all four are checked in one assertion table.
describe("pctChange", () => {
  it("covers all four direction states", () => {
    expect(pctChange(120, 100).direction).toBe("up");
    expect(pctChange(80, 100).direction).toBe("down");
    expect(pctChange(0, 0)).toEqual({ delta: null, direction: "flat" });
    expect(pctChange(50, 0)).toEqual({ delta: null, direction: "up" });
  });
});

// Per-property contribution chart. One consolidated test asserts the
// share maths AND the currency filter — the only two failure modes
// that would mislead an owner about which property is performing.
describe("propertyShareForCurrency", () => {
  it("returns each property's share of net for the chosen currency", () => {
    const rows = propertyShareForCurrency(
      [
        tx("2026-05-01T00:00:00Z", 100_000, "INFLOW", "KES", "p1"),
        tx("2026-05-02T00:00:00Z", 50_000, "INFLOW", "KES", "p2"),
        tx("2026-05-02T00:00:00Z", 25_000, "OUTFLOW", "KES", "p2"),
        tx("2026-05-01T00:00:00Z", 999, "INFLOW", "USD", "p3"),
      ],
      "KES",
      new Date(Date.UTC(2026, 4, 1)),
    );
    expect(rows.map((r) => r.propertyId)).toEqual(["p1", "p2"]);
    expect(rows[0]!.share).toBeCloseTo(100_000 / 125_000);
  });
});
