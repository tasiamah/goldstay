// Pure aggregation helpers for the landlord-facing dashboard. Every
// function in here is callable without a Prisma client so the test
// suite can exercise the rules with hand-crafted data.

export type CurrencyTotal = {
  currency: string;
  inflow: number;
  outflow: number;
  net: number;
};

export type GroupedTotalRow = {
  currency: string;
  direction: "INFLOW" | "OUTFLOW";
  // Mirrors `prisma.transaction.groupBy({ _sum: { amount } })` shape.
  // amount may be a string (Decimal serialisation) or number; we
  // coerce inside the aggregator.
  amount: number | string | null | undefined;
};

// Folds the rows returned by `prisma.transaction.groupBy({ by:
// ['currency', 'direction'], _sum: { amount } })` into one row per
// currency with inflow / outflow / net totals.
//
// Sorted with the owner's preferredCurrency first so a diaspora
// landlord sees their USD payouts at the top instead of having to
// scroll past KES housekeeping totals. Currencies that don't appear
// in the input are silently dropped — there's no point rendering an
// "EUR: 0.00" row for an owner who has never held EUR.
export function aggregateTransactionsByCurrency(
  rows: GroupedTotalRow[],
  preferredCurrency?: string | null,
): CurrencyTotal[] {
  const byCurrency = new Map<
    string,
    { inflow: number; outflow: number }
  >();

  for (const row of rows) {
    if (!row.currency) continue;
    const bucket = byCurrency.get(row.currency) ?? { inflow: 0, outflow: 0 };
    const amt = toNumber(row.amount);
    if (row.direction === "INFLOW") bucket.inflow += amt;
    else if (row.direction === "OUTFLOW") bucket.outflow += amt;
    byCurrency.set(row.currency, bucket);
  }

  const totals: CurrencyTotal[] = Array.from(byCurrency.entries()).map(
    ([currency, b]) => ({
      currency,
      inflow: b.inflow,
      outflow: b.outflow,
      net: b.inflow - b.outflow,
    }),
  );

  totals.sort((a, b) => {
    if (preferredCurrency) {
      if (a.currency === preferredCurrency) return -1;
      if (b.currency === preferredCurrency) return 1;
    }
    return a.currency.localeCompare(b.currency);
  });

  return totals;
}

// Computes occupancy as a percentage rounded to the nearest integer.
// Returns null when there are no units so the UI can render an em-dash
// rather than a misleading "0%".
export function occupancyPercent(args: {
  totalUnits: number;
  occupiedUnits: number;
}): number | null {
  if (args.totalUnits <= 0) return null;
  const pct = (args.occupiedUnits / args.totalUnits) * 100;
  return Math.round(pct);
}

function toNumber(v: number | string | null | undefined): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
