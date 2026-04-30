// Aggregation logic for a single monthly statement.
//
// Takes a flat list of transactions for one owner across one month
// and folds them into the per-property + per-currency rollups we
// render on the PDF. Pure — no Prisma — so the test suite can
// exercise the rules with hand-crafted data.

export type StatementTransaction = {
  id: string;
  occurredOn: Date;
  type: string;
  direction: "INFLOW" | "OUTFLOW";
  amount: number | string; // accepts Decimal-as-string
  currency: string;
  description?: string | null;
  reference?: string | null;
  propertyId: string;
  propertyName: string;
  leaseId?: string | null;
  tenantName?: string | null;
};

export type StatementCurrencyTotal = {
  currency: string;
  inflow: number;
  outflow: number;
  net: number;
};

export type StatementPropertyGroup = {
  propertyId: string;
  propertyName: string;
  totalsByCurrency: StatementCurrencyTotal[];
  transactions: StatementTransaction[];
};

export type Statement = {
  totalsByCurrency: StatementCurrencyTotal[];
  propertyGroups: StatementPropertyGroup[];
  transactionCount: number;
};

export function buildStatement(
  transactions: StatementTransaction[],
  options: { preferredCurrency?: string | null } = {},
): Statement {
  const overall = new Map<
    string,
    { inflow: number; outflow: number }
  >();
  const byProperty = new Map<
    string,
    {
      propertyId: string;
      propertyName: string;
      totals: Map<string, { inflow: number; outflow: number }>;
      transactions: StatementTransaction[];
    }
  >();

  for (const t of transactions) {
    if (!t.currency) continue;
    const amt = toNumber(t.amount);

    bumpBucket(overall, t.currency, t.direction, amt);

    const group = byProperty.get(t.propertyId) ?? {
      propertyId: t.propertyId,
      propertyName: t.propertyName,
      totals: new Map<string, { inflow: number; outflow: number }>(),
      transactions: [],
    };
    bumpBucket(group.totals, t.currency, t.direction, amt);
    group.transactions.push(t);
    byProperty.set(t.propertyId, group);
  }

  return {
    totalsByCurrency: bucketsToTotals(overall, options.preferredCurrency),
    propertyGroups: Array.from(byProperty.values())
      .map((g) => ({
        propertyId: g.propertyId,
        propertyName: g.propertyName,
        totalsByCurrency: bucketsToTotals(g.totals, options.preferredCurrency),
        transactions: [...g.transactions].sort(
          (a, b) => a.occurredOn.getTime() - b.occurredOn.getTime(),
        ),
      }))
      .sort((a, b) => a.propertyName.localeCompare(b.propertyName)),
    transactionCount: transactions.length,
  };
}

function bumpBucket(
  buckets: Map<string, { inflow: number; outflow: number }>,
  currency: string,
  direction: "INFLOW" | "OUTFLOW",
  amount: number,
) {
  const b = buckets.get(currency) ?? { inflow: 0, outflow: 0 };
  if (direction === "INFLOW") b.inflow += amount;
  else if (direction === "OUTFLOW") b.outflow += amount;
  buckets.set(currency, b);
}

function bucketsToTotals(
  buckets: Map<string, { inflow: number; outflow: number }>,
  preferredCurrency?: string | null,
): StatementCurrencyTotal[] {
  const out: StatementCurrencyTotal[] = Array.from(buckets.entries()).map(
    ([currency, b]) => ({
      currency,
      inflow: b.inflow,
      outflow: b.outflow,
      net: b.inflow - b.outflow,
    }),
  );
  out.sort((a, b) => {
    if (preferredCurrency) {
      if (a.currency === preferredCurrency) return -1;
      if (b.currency === preferredCurrency) return 1;
    }
    return a.currency.localeCompare(b.currency);
  });
  return out;
}

function toNumber(v: number | string | null | undefined): number {
  if (v === null || v === undefined) return 0;
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
