import { describe, expect, it } from "vitest";
import { bucketFor, pickPrimary, summariseFinance } from "./finance";

// Goldstay-side P&L. The senior risks are:
//   1. Counting an owner-side flow (RENT, EXPENSE, PAYOUT) as our
//      revenue or cost — would double-book the entire owner ledger
//      into the company P&L.
//   2. Booking a commission INFLOW as cost (or vice versa). Each
//      transaction's TransactionDirection is recorded relative to
//      the owner's column, so a MANAGEMENT_FEE OUTFLOW is the bit
//      that lands in our pocket.

const t = (
  type:
    | "MANAGEMENT_FEE"
    | "GOLDSTAY_COMMISSION"
    | "OTA_COMMISSION"
    | "CLEANING_FEE"
    | "RENT"
    | "PAYOUT"
    | "EXPENSE",
  direction: "INFLOW" | "OUTFLOW",
  amount: number,
  overrides: Partial<{
    occurredOn: Date;
    currency: string;
    propertyId: string;
  }> = {},
) => ({
  type,
  direction,
  amount,
  occurredOn: overrides.occurredOn ?? new Date("2026-04-15T00:00:00Z"),
  currency: overrides.currency ?? "KES",
  propertyId: overrides.propertyId ?? "p_1",
});

describe("Goldstay finance summary", () => {
  it("buckets only commission OUTFLOWs as revenue and ignores owner-side flows", () => {
    expect(bucketFor(t("MANAGEMENT_FEE", "OUTFLOW", 1))).toBe("revenue");
    expect(bucketFor(t("GOLDSTAY_COMMISSION", "OUTFLOW", 1))).toBe("revenue");
    expect(bucketFor(t("OTA_COMMISSION", "OUTFLOW", 1))).toBe("cost");
    expect(bucketFor(t("CLEANING_FEE", "OUTFLOW", 1))).toBe("cost");
    // The full owner-side ledger must stay out of the company P&L.
    expect(bucketFor(t("RENT", "INFLOW", 1))).toBe("ignored");
    expect(bucketFor(t("PAYOUT", "OUTFLOW", 1))).toBe("ignored");
    expect(bucketFor(t("EXPENSE", "OUTFLOW", 1))).toBe("ignored");
    // Defensive: a commission booked the wrong way round shouldn't
    // be flipped into revenue silently — it stays out until cleaned.
    expect(bucketFor(t("MANAGEMENT_FEE", "INFLOW", 1))).toBe("ignored");
  });

  it("aggregates totals + monthly + per-property + cost lines, currency-grouped", () => {
    const summary = summariseFinance([
      t("MANAGEMENT_FEE", "OUTFLOW", 12000, {
        occurredOn: new Date("2026-03-10T00:00:00Z"),
      }),
      t("MANAGEMENT_FEE", "OUTFLOW", 9600, {
        occurredOn: new Date("2026-04-05T00:00:00Z"),
      }),
      t("GOLDSTAY_COMMISSION", "OUTFLOW", 367, {
        occurredOn: new Date("2026-04-12T00:00:00Z"),
        currency: "USD",
        propertyId: "p_2",
      }),
      t("OTA_COMMISSION", "OUTFLOW", 80, {
        occurredOn: new Date("2026-04-12T00:00:00Z"),
        currency: "USD",
        propertyId: "p_2",
      }),
      // Owner-side noise that must NOT affect the totals.
      t("RENT", "INFLOW", 50000),
      t("PAYOUT", "OUTFLOW", 40000),
    ]);

    expect(summary.totals).toEqual([
      { currency: "KES", revenue: 21600, cost: 0, net: 21600 },
      { currency: "USD", revenue: 367, cost: 80, net: 287 },
    ]);

    expect(summary.monthly.map((m) => m.month)).toEqual(["2026-03", "2026-04"]);

    const p2 = summary.byProperty.find((p) => p.propertyId === "p_2");
    expect(p2?.byCurrency).toEqual([
      { currency: "USD", revenue: 367, cost: 80, net: 287 },
    ]);

    expect(summary.costsByType).toEqual([
      {
        type: "OTA_COMMISSION",
        byCurrency: [{ currency: "USD", revenue: 0, cost: 80, net: -80 }],
      },
    ]);
  });
});

describe("executiveWindows + summariseWindows", () => {
  it("splits the same transaction list into month / lastMonth / ytd / trailing12 by occurrence date", async () => {
    const { executiveWindows, summariseWindows } = await import("./finance");
    const now = new Date("2026-04-15T00:00:00Z");
    const windows = executiveWindows(now);

    const txns = [
      // current month — counts in month, ytd, trailing12
      t("MANAGEMENT_FEE", "OUTFLOW", 100, {
        occurredOn: new Date("2026-04-02T00:00:00Z"),
      }),
      // previous month — counts in lastMonth, ytd, trailing12
      t("MANAGEMENT_FEE", "OUTFLOW", 50, {
        occurredOn: new Date("2026-03-15T00:00:00Z"),
      }),
      // earlier this year — counts in ytd, trailing12 only
      t("MANAGEMENT_FEE", "OUTFLOW", 25, {
        occurredOn: new Date("2026-01-10T00:00:00Z"),
      }),
      // 14 months ago — outside every window
      t("MANAGEMENT_FEE", "OUTFLOW", 999, {
        occurredOn: new Date("2025-02-10T00:00:00Z"),
      }),
    ];

    const summaries = summariseWindows(txns, windows);
    expect(summaries.month.totals[0]?.net).toBe(100);
    expect(summaries.lastMonth.totals[0]?.net).toBe(50);
    expect(summaries.ytd.totals[0]?.net).toBe(175);
    expect(summaries.trailing12.totals[0]?.net).toBe(175);
  });
});

describe("pickPrimary", () => {
  it("prefers the requested currency, otherwise the largest |net|", () => {
    const usd = { currency: "USD", revenue: 100, cost: 10, net: 90 };
    const kes = { currency: "KES", revenue: 5000, cost: 0, net: 5000 };
    expect(pickPrimary([usd, kes], "USD").primary).toBe(usd);
    expect(pickPrimary([usd, kes], "GBP").primary).toBe(kes);
    expect(pickPrimary([], "USD")).toEqual({ primary: null, otherCount: 0 });
  });
});
