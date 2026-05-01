// Pure analytics helpers for the landlord-facing top-of-page KPIs and
// the 12-month net trend chart. Everything here is callable without
// a Prisma client so the tests exercise the rules with hand-crafted
// transaction lists.
//
// Conventions:
//   - All dates are bucketed by UTC month so a landlord in Nairobi
//     (UTC+3) and one in Accra (UTC+0) see the same monthly totals.
//   - "Net" means inflows minus outflows. Goldstay deducts its
//     commission as an OUTFLOW, so the net here is always the
//     landlord's perspective: what actually accrued to them.
//   - Currencies are kept separate. We never auto-FX; mixing KES and
//     USD in one number would mislead.

export type RawOwnerTransaction = {
  occurredOn: Date;
  amount: number;
  currency: string;
  direction: "INFLOW" | "OUTFLOW";
  propertyId: string;
};

export type MonthlyBucket = {
  // YYYY-MM, UTC. Stable sort key.
  month: string;
  // Display label, e.g. "Apr 26".
  label: string;
  net: number;
};

export type CurrencySummary = {
  currency: string;
  thirtyDayNet: number;
  prior30DayNet: number;
  twelveMonthNet: number;
  // Always exactly N entries (default 12), ascending. Months with no
  // activity have net: 0 so the chart axis stays continuous instead
  // of compressing gaps.
  monthlyNet: MonthlyBucket[];
};

export type PctChange = {
  delta: number | null; // null when prior is zero (undefined ratio)
  direction: "up" | "down" | "flat";
};

const MONTH_LABEL_FORMAT: Intl.DateTimeFormatOptions = {
  month: "short",
  year: "2-digit",
  timeZone: "UTC",
};

// Builds the descending list of UTC month keys ending at `now`'s
// month, e.g. for May 2026 with monthsBack=12 returns
// ["2025-06", "2025-07", ..., "2026-05"]. Lives standalone so the
// chart can render the same axis even when no transactions land in
// some months.
export function utcMonthBuckets(now: Date, monthsBack: number): MonthlyBucket[] {
  const buckets: MonthlyBucket[] = [];
  const year = now.getUTCFullYear();
  const month = now.getUTCMonth();
  for (let i = monthsBack - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(year, month - i, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    buckets.push({
      month: key,
      label: d.toLocaleDateString("en-GB", MONTH_LABEL_FORMAT),
      net: 0,
    });
  }
  return buckets;
}

function monthKeyFor(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

// Returns one summary per currency that appeared in the input. Months
// with no activity are filled with zero so the chart never collapses
// horizontally.
export function summariseTransactionsByCurrency(
  txs: RawOwnerTransaction[],
  now: Date = new Date(),
  monthsBack: number = 12,
): CurrencySummary[] {
  // Anchor windows on midnight UTC so the comparisons are inclusive
  // of every transaction stamped to a date inside the window.
  const dayMs = 24 * 60 * 60 * 1000;
  const startOfToday = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const last30Start = new Date(startOfToday.getTime() - 30 * dayMs);
  const prior30Start = new Date(startOfToday.getTime() - 60 * dayMs);

  // currency → bucket map seeded with the empty 12-month axis on first
  // touch, so callers always get a continuous series.
  const byCurrency = new Map<string, CurrencySummary>();

  function ensure(currency: string): CurrencySummary {
    let s = byCurrency.get(currency);
    if (s) return s;
    s = {
      currency,
      thirtyDayNet: 0,
      prior30DayNet: 0,
      twelveMonthNet: 0,
      monthlyNet: utcMonthBuckets(now, monthsBack),
    };
    byCurrency.set(currency, s);
    return s;
  }

  // Pre-build a key→index lookup so the per-tx insertion is O(1)
  // instead of repeatedly walking the 12-entry monthly array.
  const monthIndex = new Map<string, number>();
  utcMonthBuckets(now, monthsBack).forEach((b, i) => {
    monthIndex.set(b.month, i);
  });
  const earliestBucketStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (monthsBack - 1), 1),
  );

  for (const tx of txs) {
    const sign = tx.direction === "INFLOW" ? 1 : -1;
    const amt = sign * (Number.isFinite(tx.amount) ? tx.amount : 0);
    const summary = ensure(tx.currency);

    if (tx.occurredOn >= earliestBucketStart) {
      const idx = monthIndex.get(monthKeyFor(tx.occurredOn));
      if (idx !== undefined) {
        summary.monthlyNet[idx].net += amt;
        summary.twelveMonthNet += amt;
      }
    }

    if (tx.occurredOn >= last30Start) {
      summary.thirtyDayNet += amt;
    } else if (tx.occurredOn >= prior30Start) {
      summary.prior30DayNet += amt;
    }
  }

  // Stable sort: highest absolute 12-month volume first so the
  // currency that matters most lands on top.
  return Array.from(byCurrency.values()).sort(
    (a, b) => Math.abs(b.twelveMonthNet) - Math.abs(a.twelveMonthNet),
  );
}

// Picks the currency to feature in the KPI strip. We prefer the
// owner's preferredCurrency when it has any activity, otherwise fall
// back to whichever currency moved the most money.
export function pickPrimaryCurrency(
  summaries: CurrencySummary[],
  preferred?: string | null,
): CurrencySummary | null {
  if (summaries.length === 0) return null;
  if (preferred) {
    const match = summaries.find((s) => s.currency === preferred);
    if (match) return match;
  }
  return summaries[0];
}

export function pctChange(current: number, prior: number): PctChange {
  if (prior === 0) {
    if (current === 0) return { delta: null, direction: "flat" };
    // No baseline to express a percentage against. The UI uses this
    // to show a directional arrow without a number.
    return { delta: null, direction: current > 0 ? "up" : "down" };
  }
  const delta = ((current - prior) / Math.abs(prior)) * 100;
  if (Math.abs(delta) < 0.5) return { delta: 0, direction: "flat" };
  return { delta, direction: delta > 0 ? "up" : "down" };
}

// Folds raw transactions into one row per property for the
// "Revenue mix" stacked-bar treatment. Returns rows for the chosen
// currency only — mixing currencies in one bar would be misleading.
export type PropertyShareRow = {
  propertyId: string;
  net: number;
  share: number; // 0..1; share of total positive net for the currency
};

export function propertyShareForCurrency(
  txs: RawOwnerTransaction[],
  currency: string,
  windowStart: Date,
): PropertyShareRow[] {
  const totals = new Map<string, number>();
  for (const tx of txs) {
    if (tx.currency !== currency) continue;
    if (tx.occurredOn < windowStart) continue;
    const sign = tx.direction === "INFLOW" ? 1 : -1;
    totals.set(
      tx.propertyId,
      (totals.get(tx.propertyId) ?? 0) + sign * tx.amount,
    );
  }
  const positive = Array.from(totals.entries()).filter(([, n]) => n > 0);
  const totalPositive = positive.reduce((acc, [, n]) => acc + n, 0);
  if (totalPositive === 0) return [];
  return positive
    .map(([propertyId, net]) => ({
      propertyId,
      net,
      share: net / totalPositive,
    }))
    .sort((a, b) => b.net - a.net);
}
