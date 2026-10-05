// Filters and rollups for the admin transactions list.
//
// Lifted out of the page for two reasons. The parsing has to be
// shared with the sort headers and the pagination links, because a
// filter that silently drops when an operator clicks a column header
// shows them a different set of numbers under the same heading. And
// the per-currency rollup is the part worth testing: the question
// this screen exists to answer is "what did this unit cost us in
// this month", which is a sum, not a list.

import {
  isValidPeriod,
  periodRange,
  type Period,
} from "@/lib/statements/period";

export type TransactionFilters = {
  propertyId: string | null;
  period: Period | null;
};

export function parseMonthParam(raw: string | undefined): Period | null {
  if (!raw) return null;
  const m = /^(\d{4})-(\d{1,2})$/.exec(raw.trim());
  if (!m) return null;
  const period = { year: Number(m[1]), month: Number(m[2]) };
  return isValidPeriod(period) ? period : null;
}

export function parseTransactionFilters(
  params: Record<string, string | undefined>,
): TransactionFilters {
  return {
    propertyId: params.propertyId?.trim() || null,
    period: parseMonthParam(params.month),
  };
}

export function monthParam(period: Period): string {
  return `${period.year}-${String(period.month).padStart(2, "0")}`;
}

// Carried by every sort header and pagination link on the list.
export function filtersToParams(
  filters: TransactionFilters,
): Record<string, string> {
  const out: Record<string, string> = {};
  if (filters.propertyId) out.propertyId = filters.propertyId;
  if (filters.period) out.month = monthParam(filters.period);
  return out;
}

// Half-open range, matching the statement period helpers, so a
// transaction dated the 1st of the next month is never counted twice.
export function occurredOnRange(
  period: Period | null,
): { gte: Date; lt: Date } | null {
  if (!period) return null;
  const { start, end } = periodRange(period);
  return { gte: start, lt: end };
}

export type CurrencyTotal = {
  currency: string;
  inflow: number;
  outflow: number;
  net: number;
};

// Currencies are never mixed. A property earning in KES with a USD
// expense against it produces two rows rather than one wrong one,
// which is the same rule the statement aggregator follows.
export function summariseByCurrency(
  rows: {
    direction: "INFLOW" | "OUTFLOW";
    amount: number | string;
    currency: string;
  }[],
): CurrencyTotal[] {
  const map = new Map<string, CurrencyTotal>();

  for (const row of rows) {
    if (!row.currency) continue;
    const amount =
      typeof row.amount === "number" ? row.amount : Number(row.amount);
    if (!Number.isFinite(amount)) continue;

    const total =
      map.get(row.currency) ??
      { currency: row.currency, inflow: 0, outflow: 0, net: 0 };

    if (row.direction === "INFLOW") {
      total.inflow += amount;
      total.net += amount;
    } else {
      total.outflow += amount;
      total.net -= amount;
    }
    map.set(row.currency, total);
  }

  return [...map.values()].sort((a, b) =>
    a.currency.localeCompare(b.currency),
  );
}
