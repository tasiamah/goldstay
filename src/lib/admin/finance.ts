// Goldstay-side P&L aggregation.
//
// Most of the existing transaction code is owner-centric: rent in,
// expenses out, payout to landlord. This module instead asks "what
// did Goldstay actually keep?", which the SUPER_ADMIN finance page
// renders.
//
// Revenue (what we earn):
//   * MANAGEMENT_FEE      — long-term commission on a tenancy
//   * GOLDSTAY_COMMISSION — short-stay commission per booking
//
// Cost we book against ourselves (what comes out of our pocket
// before it ever lands on a landlord statement):
//   * OTA_COMMISSION (OUTFLOW) — the slice Airbnb / Booking.com
//     take on a short-stay; we eat it on the way through and pay
//     the landlord on net revenue.
//   * CLEANING_FEE   (OUTFLOW) — when we absorb a cleaning fee
//     instead of passing it on (ad-hoc, currently rare).
//
// Everything else (RENT, DEPOSIT, EXPENSE, PAYOUT, REFUND,
// GUEST_REFUND) is pass-through to the owner ledger and explicitly
// excluded so the P&L doesn't double-count owner-side flows.
//
// The aggregator is currency-aware: there's no FX pass anywhere in
// the codebase, so we group by currency and let the consumer decide
// how to render the multi-currency reality.

import type { TransactionDirection, TransactionType } from "@prisma/client";

export type GoldstayTxn = {
  occurredOn: Date;
  amount: number;
  currency: string;
  type: TransactionType;
  direction: TransactionDirection;
  propertyId: string;
};

export const GOLDSTAY_REVENUE_TYPES: readonly TransactionType[] = [
  "MANAGEMENT_FEE",
  "GOLDSTAY_COMMISSION",
];

export const GOLDSTAY_COST_TYPES: readonly TransactionType[] = [
  "OTA_COMMISSION",
  "CLEANING_FEE",
];

export type Bucket = "revenue" | "cost" | "ignored";

export function bucketFor(t: Pick<GoldstayTxn, "type" | "direction">): Bucket {
  if (
    GOLDSTAY_REVENUE_TYPES.includes(t.type) &&
    t.direction === "OUTFLOW" // commission OUT of the owner's column = IN for us
  ) {
    return "revenue";
  }
  if (
    GOLDSTAY_COST_TYPES.includes(t.type) &&
    t.direction === "OUTFLOW"
  ) {
    return "cost";
  }
  return "ignored";
}

export type CurrencyTotals = {
  currency: string;
  revenue: number;
  cost: number;
  net: number;
};

export type MonthBucket = {
  // YYYY-MM, sortable lexically.
  month: string;
  byCurrency: CurrencyTotals[];
};

export type PropertyTotals = {
  propertyId: string;
  byCurrency: CurrencyTotals[];
};

export type FinanceSummary = {
  // Single window the caller asked for, e.g. "current month",
  // "trailing 12 months". Same totals shape so the UI can render
  // them with one component.
  totals: CurrencyTotals[];
  // One row per calendar month inside the window, oldest first,
  // ready for a chart.
  monthly: MonthBucket[];
  // One row per property inside the window, ordered by net descending
  // in the consumer's primary currency (we don't sort here because
  // sorting depends on the FX-free reality — caller picks).
  byProperty: PropertyTotals[];
  // Cost-line breakdown so the P&L can show "where the money goes":
  // OTA commissions paid, cleaning absorbed, etc.
  costsByType: { type: TransactionType; byCurrency: CurrencyTotals[] }[];
};

function monthKey(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

// Adds amount to (currency, kind) on a totals map.
function addTo(
  map: Map<string, CurrencyTotals>,
  currency: string,
  kind: "revenue" | "cost",
  amount: number,
) {
  const row = map.get(currency) ?? {
    currency,
    revenue: 0,
    cost: 0,
    net: 0,
  };
  row[kind] += amount;
  row.net = row.revenue - row.cost;
  map.set(currency, row);
}

function totalsArray(map: Map<string, CurrencyTotals>): CurrencyTotals[] {
  // Stable order across renders: alphabetical by currency code.
  return Array.from(map.values()).sort((a, b) =>
    a.currency.localeCompare(b.currency),
  );
}

export function summariseFinance(txns: readonly GoldstayTxn[]): FinanceSummary {
  const totalsMap = new Map<string, CurrencyTotals>();
  const monthlyMap = new Map<string, Map<string, CurrencyTotals>>();
  const propertyMap = new Map<string, Map<string, CurrencyTotals>>();
  const costsByTypeMap = new Map<
    TransactionType,
    Map<string, CurrencyTotals>
  >();

  for (const t of txns) {
    const bucket = bucketFor(t);
    if (bucket === "ignored") continue;

    addTo(totalsMap, t.currency, bucket, t.amount);

    const mk = monthKey(t.occurredOn);
    if (!monthlyMap.has(mk)) monthlyMap.set(mk, new Map());
    addTo(monthlyMap.get(mk)!, t.currency, bucket, t.amount);

    if (!propertyMap.has(t.propertyId))
      propertyMap.set(t.propertyId, new Map());
    addTo(propertyMap.get(t.propertyId)!, t.currency, bucket, t.amount);

    if (bucket === "cost") {
      if (!costsByTypeMap.has(t.type)) costsByTypeMap.set(t.type, new Map());
      addTo(costsByTypeMap.get(t.type)!, t.currency, "cost", t.amount);
    }
  }

  const monthly: MonthBucket[] = Array.from(monthlyMap.entries())
    .map(([month, map]) => ({ month, byCurrency: totalsArray(map) }))
    .sort((a, b) => a.month.localeCompare(b.month));

  const byProperty: PropertyTotals[] = Array.from(propertyMap.entries()).map(
    ([propertyId, map]) => ({ propertyId, byCurrency: totalsArray(map) }),
  );

  const costsByType = Array.from(costsByTypeMap.entries()).map(
    ([type, map]) => ({ type, byCurrency: totalsArray(map) }),
  );

  return {
    totals: totalsArray(totalsMap),
    monthly,
    byProperty,
    costsByType,
  };
}

// Returns the four windows the executive KPI strip renders:
// current calendar month, the previous calendar month (for the
// month-on-month delta), year-to-date, and trailing 12 months.
// All windows are computed off the supplied `now` so this stays
// pure and testable.
export type FinanceWindowKey = "month" | "lastMonth" | "ytd" | "trailing12";

export type FinanceWindow = {
  key: FinanceWindowKey;
  start: Date;
  end: Date;
};

export function executiveWindows(now: Date): FinanceWindow[] {
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth();

  const monthStart = new Date(Date.UTC(y, m, 1));
  const nextMonthStart = new Date(Date.UTC(y, m + 1, 1));
  const lastMonthStart = new Date(Date.UTC(y, m - 1, 1));
  const ytdStart = new Date(Date.UTC(y, 0, 1));
  const trailing12Start = new Date(Date.UTC(y, m - 12, 1));

  return [
    { key: "month", start: monthStart, end: nextMonthStart },
    { key: "lastMonth", start: lastMonthStart, end: monthStart },
    { key: "ytd", start: ytdStart, end: nextMonthStart },
    { key: "trailing12", start: trailing12Start, end: nextMonthStart },
  ];
}

// Returns one summary per window from a single shared list of
// transactions, so the caller only does one DB round-trip for the
// whole executive strip.
export function summariseWindows(
  txns: readonly GoldstayTxn[],
  windows: readonly FinanceWindow[],
): Record<FinanceWindowKey, FinanceSummary> {
  const out = {} as Record<FinanceWindowKey, FinanceSummary>;
  for (const w of windows) {
    const slice = txns.filter(
      (t) => t.occurredOn >= w.start && t.occurredOn < w.end,
    );
    out[w.key] = summariseFinance(slice);
  }
  return out;
}

// Sums net across currencies in a single declared "primary" currency
// without any FX — anything in another currency is reported alongside
// so the UI can render an honest "USD 1,200 + 2 other currencies".
export function pickPrimary(
  totals: readonly CurrencyTotals[],
  preferred: string,
): { primary: CurrencyTotals | null; otherCount: number } {
  if (totals.length === 0) return { primary: null, otherCount: 0 };
  const exact = totals.find((t) => t.currency === preferred);
  if (exact) return { primary: exact, otherCount: totals.length - 1 };
  const fallback = [...totals].sort(
    (a, b) => Math.abs(b.net) - Math.abs(a.net),
  )[0]!;
  return { primary: fallback, otherCount: totals.length - 1 };
}
