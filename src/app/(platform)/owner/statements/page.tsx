// /owner/statements — single ledger + monthly statement surface.
//
// Replaces the old split between /owner/statements (pick-a-month
// PDF download) and /owner/transactions (full filterable ledger).
// The two were the same data viewed two ways; merging them removes
// a confusing nav choice and gives the owner one place to either
// "browse what happened" or "download something for my accountant".
//
// Default view is "All months" — when a landlord lands here they
// usually want to see what's been happening, not pick a specific
// month to download. Picking a specific month from the dropdown
// scopes the table AND enables the download button. The PDF is
// only ever monthly (signed, accountant-ready), so requiring a
// month before enabling download stays honest.
//
// URL contract:
//   ?period=YYYY-MM   → restrict to that calendar month
//   ?propertyId=...   → restrict to one property
//   ?page=N           → paginate the table (50 rows / page)
//
// Stale period links (a month with no activity, e.g. someone
// emailed a 2024-08 link to a landlord who joined this year)
// land cleanly: the table renders empty and the dropdown still
// lets them re-pick. We deliberately do NOT silently fall back
// to the most-recent month — that would mask the stale URL and
// confuse anyone troubleshooting.

import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatPeriod,
  isValidPeriod,
  type Period,
} from "@/lib/statements/period";
import { formatPropertyDisplayName } from "@/lib/format-property";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;
// Owners almost never need to scroll past two years of history.
// Capping the dropdown horizon keeps the per-render summary query
// fast even for landlords with multi-property, daily activity.
// If they need older months they ask ops; we have it in the DB.
const DROPDOWN_HORIZON_MONTHS = 24;

type CurrencyTotals = { inflow: number; outflow: number };
type Bucket = { count: number; totals: Map<string, CurrencyTotals> };

export default async function OwnerStatementsPage({
  searchParams,
}: {
  searchParams?: { period?: string; propertyId?: string; page?: string };
}) {
  const { owner } = await requireOwner();

  const requested = parsePeriodParam(searchParams?.period);
  const propertyId = searchParams?.propertyId?.trim() || undefined;
  const page = Math.max(1, Number(searchParams?.page) || 1);

  // Two-query plan:
  //   1. A light pull of the last DROPDOWN_HORIZON_MONTHS of
  //      transaction headers (date / direction / amount / currency)
  //      across the *whole* portfolio. This feeds the month
  //      dropdown and the per-month summary card. Property filter
  //      is deliberately NOT applied here — the dropdown should
  //      always show every month with activity, even when the
  //      table is scoped to one property.
  //   2. The paginated ledger query for the table itself, which
  //      honours both filters.
  // Two queries instead of one because the table needs joined
  // property + tenant rows we don't want to drag through the
  // dropdown bucketer.
  const horizon = monthsAgo(new Date(), DROPDOWN_HORIZON_MONTHS);
  const tableWhere = buildWhere(owner.id, requested, propertyId);

  const [headers, properties, transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where: {
        property: { ownerId: owner.id },
        occurredOn: { gte: horizon },
      },
      select: {
        occurredOn: true,
        direction: true,
        amount: true,
        currency: true,
      },
    }),
    prisma.property.findMany({
      where: { ownerId: owner.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true, unitNumber: true },
    }),
    prisma.transaction.findMany({
      where: tableWhere,
      orderBy: { occurredOn: "desc" },
      include: {
        property: { select: { id: true, name: true, unitNumber: true } },
        lease: { select: { tenantName: true } },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.transaction.count({ where: tableWhere }),
  ]);

  const byMonth = bucketByMonth(headers);
  const periods: Period[] = Array.from(byMonth.keys())
    .map(parseMonthKey)
    .filter((p): p is Period => p !== null)
    .sort((a, b) => b.year - a.year || b.month - a.month);

  // Empty-state: never had any activity in the last 24 months.
  // Nothing to filter, nothing to download — fast bail.
  if (periods.length === 0) {
    return (
      <div className="space-y-6">
        <Header />
        <EmptyState />
      </div>
    );
  }

  const selected = requested;
  const selectedKey = selected ? monthKeyFromPeriod(selected) : null;
  const selectedBucket = selectedKey ? byMonth.get(selectedKey) ?? null : null;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const isFiltered = Boolean(selected || propertyId);

  return (
    <div className="space-y-6">
      <Header />

      <FilterCard
        periods={periods}
        byMonth={byMonth}
        properties={properties}
        selected={selected}
        selectedPropertyId={propertyId}
      />

      {/* Summary callout. Two flavours:
          - Specific month picked → show that month's net per
            currency, AND offer the PDF download.
          - "All months" → show the running 24-month totals so
            the owner gets *some* headline answer at the top of
            the page even when they haven't narrowed down.       */}
      {selected ? (
        <SelectedMonthSummary
          period={selected}
          bucket={selectedBucket}
          downloadHref={`/owner/statements/${selected.year}/${selected.month}`}
        />
      ) : (
        <AllMonthsSummary byMonth={byMonth} />
      )}

      <ResultsCount
        showing={transactions.length}
        total={total}
        page={page}
        isFiltered={isFiltered}
      />

      {transactions.length > 0 ? (
        <LedgerTable rows={transactions} />
      ) : (
        <NoResults isFiltered={isFiltered} />
      )}

      {totalPages > 1 ? (
        <Pagination
          page={page}
          totalPages={totalPages}
          period={selected}
          propertyId={propertyId}
        />
      ) : null}
    </div>
  );
}

// ---------- Top-level pieces ----------

function Header() {
  return (
    <div>
      <h2 className="text-xl font-serif text-stone-900">Statements</h2>
      <p className="mt-2 text-sm text-stone-500">
        Every rent payment, expense, fee and payout Goldstay records on
        your portfolio. Filter by month or property to scope the view —
        pick a specific month to download a signed PDF for your
        accountant.
      </p>
    </div>
  );
}

function FilterCard({
  periods,
  byMonth,
  properties,
  selected,
  selectedPropertyId,
}: {
  periods: Period[];
  byMonth: Map<string, Bucket>;
  properties: { id: string; name: string; unitNumber: string | null }[];
  selected: Period | null;
  selectedPropertyId: string | undefined;
}) {
  const selectedValue = selected ? periodParam(selected) : "";
  return (
    // Plain GET form so the URL stays the source of truth — a
    // landlord can bookmark "April 2026 for the Westlands flat"
    // and forward the link to their accountant without us
    // needing to round-trip through client state.
    <form
      method="get"
      className="rounded-lg border border-stone-200 bg-white p-5"
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
        <label className="text-sm">
          <span className="block font-medium text-stone-700">Month</span>
          <select
            name="period"
            defaultValue={selectedValue}
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
          >
            <option value="">All months</option>
            {periods.map((p) => {
              const b = byMonth.get(monthKeyFromPeriod(p))!;
              return (
                <option key={periodParam(p)} value={periodParam(p)}>
                  {formatPeriod(p)} —{" "}
                  {b.count === 1 ? "1 transaction" : `${b.count} transactions`}
                </option>
              );
            })}
          </select>
        </label>

        <label className="text-sm">
          <span className="block font-medium text-stone-700">Property</span>
          <select
            name="propertyId"
            defaultValue={selectedPropertyId ?? ""}
            className="mt-1 w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 shadow-sm focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
          >
            <option value="">All properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {formatPropertyDisplayName(p.name, p.unitNumber)}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center justify-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            Apply
          </button>
          {selected || selectedPropertyId ? (
            <Link
              href="/owner/statements"
              className="text-sm text-stone-500 hover:text-stone-900"
            >
              Clear
            </Link>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function SelectedMonthSummary({
  period,
  bucket,
  downloadHref,
}: {
  period: Period;
  bucket: Bucket | null;
  downloadHref: string;
}) {
  const nets = bucket
    ? Array.from(bucket.totals.entries()).map(([currency, t]) => ({
        currency,
        net: t.inflow - t.outflow,
      }))
    : [];

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-stone-500">
            {formatPeriod(period)}
          </p>
          <p className="mt-1 text-sm text-stone-700">
            {bucket
              ? bucket.count === 1
                ? "1 transaction recorded"
                : `${bucket.count} transactions recorded`
              : "No transactions recorded in this month."}
          </p>
        </div>
        {/* Download is always offered for a picked month. The
            PDF route renders an empty statement gracefully if a
            stale link points at a zero-activity month — better
            than disabling the button and leaving the owner
            wondering why. */}
        <Link
          href={downloadHref}
          target="_blank"
          rel="noopener"
          className="shrink-0 rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          Download statement (PDF)
        </Link>
      </div>
      {nets.length > 0 ? (
        <ul className="mt-4 space-y-1 border-t border-stone-100 pt-3">
          {nets.map((n) => (
            <li
              key={n.currency}
              className="flex items-center justify-between text-sm tabular-nums"
            >
              <span className="text-stone-600">{n.currency} net</span>
              <span className={n.net >= 0 ? "text-stone-900" : "text-red-700"}>
                {fmt(n.net)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function AllMonthsSummary({ byMonth }: { byMonth: Map<string, Bucket> }) {
  // Roll up every bucket in the dropdown horizon (24 months) so
  // the owner sees the "since I joined" headline at the top of
  // the all-months view. Keeps it on one read of the same map
  // we already built for the dropdown.
  const totals = new Map<string, CurrencyTotals>();
  let count = 0;
  for (const bucket of byMonth.values()) {
    count += bucket.count;
    for (const [currency, t] of bucket.totals.entries()) {
      const acc = totals.get(currency) ?? { inflow: 0, outflow: 0 };
      acc.inflow += t.inflow;
      acc.outflow += t.outflow;
      totals.set(currency, acc);
    }
  }
  const nets = Array.from(totals.entries()).map(([currency, t]) => ({
    currency,
    net: t.inflow - t.outflow,
  }));

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-wider text-stone-500">
            All activity (last {DROPDOWN_HORIZON_MONTHS} months)
          </p>
          <p className="mt-1 text-sm text-stone-700">
            {count === 1
              ? "1 transaction recorded"
              : `${count.toLocaleString("en-GB")} transactions recorded`}
          </p>
        </div>
        <p className="text-xs text-stone-500">
          Pick a specific month above to download a signed PDF.
        </p>
      </div>
      {nets.length > 0 ? (
        <ul className="mt-4 space-y-1 border-t border-stone-100 pt-3">
          {nets.map((n) => (
            <li
              key={n.currency}
              className="flex items-center justify-between text-sm tabular-nums"
            >
              <span className="text-stone-600">{n.currency} net</span>
              <span className={n.net >= 0 ? "text-stone-900" : "text-red-700"}>
                {fmt(n.net)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function ResultsCount({
  showing,
  total,
  page,
  isFiltered,
}: {
  showing: number;
  total: number;
  page: number;
  isFiltered: boolean;
}) {
  if (total === 0) return null;
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  return (
    <p className="text-xs text-stone-500">
      Showing <strong className="text-stone-700">{from}</strong>–
      <strong className="text-stone-700">{to}</strong> of {total}
      {isFiltered ? " filtered" : ""} {total === 1 ? "row" : "rows"}
      {showing < total - (page - 1) * PAGE_SIZE ? null : ""}
    </p>
  );
}

function LedgerTable({
  rows,
}: {
  rows: {
    id: string;
    occurredOn: Date;
    type: string;
    direction: "INFLOW" | "OUTFLOW";
    amount: unknown;
    currency: string;
    description: string | null;
    reference: string | null;
    property: { id: string; name: string; unitNumber: string | null };
    lease: { tenantName: string } | null;
  }[];
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <table className="min-w-full divide-y divide-stone-200">
        <thead className="bg-stone-50">
          <tr>
            <Th>Date</Th>
            <Th>Type</Th>
            <Th>Property</Th>
            <Th>Detail</Th>
            <Th align="right">Amount</Th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {rows.map((t) => (
            <tr key={t.id}>
              <td className="px-4 py-2.5 text-sm text-stone-700">
                {t.occurredOn.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="px-4 py-2.5 text-sm text-stone-700">
                {t.type.replace(/_/g, " ")}
              </td>
              <td className="px-4 py-2.5 text-sm">
                <Link
                  href={`/owner/properties/${t.property.id}`}
                  className="text-stone-900 hover:underline"
                >
                  {formatPropertyDisplayName(
                    t.property.name,
                    t.property.unitNumber,
                  )}
                </Link>
              </td>
              <td className="px-4 py-2.5 text-sm text-stone-500">
                {[t.description, t.lease?.tenantName, t.reference]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </td>
              <td
                className={`px-4 py-2.5 text-right text-sm tabular-nums ${
                  t.direction === "INFLOW"
                    ? "text-emerald-700"
                    : "text-red-700"
                }`}
              >
                {t.direction === "INFLOW" ? "+" : "−"}
                {fmt(Number(t.amount))} {t.currency}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function NoResults({ isFiltered }: { isFiltered: boolean }) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
      <h3 className="text-base font-medium text-stone-900">
        {isFiltered ? "No transactions match these filters" : "No transactions"}
      </h3>
      <p className="mt-1 text-sm text-stone-500">
        {isFiltered
          ? "Try a different month or remove the property filter."
          : "Goldstay logs every rent payment, expense and payout here."}
      </p>
      {isFiltered ? (
        <Link
          href="/owner/statements"
          className="mt-4 inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Clear filters
        </Link>
      ) : null}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
      <h3 className="text-base font-medium text-stone-900">
        No statements yet
      </h3>
      <p className="mt-1 text-sm text-stone-500">
        As soon as Goldstay records activity (rent, expenses, or a
        payout) on any of your properties, statements and the full
        ledger will appear here. We also email a signed PDF on the
        1st of each month.
      </p>
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  period,
  propertyId,
}: {
  page: number;
  totalPages: number;
  period: Period | null;
  propertyId: string | undefined;
}) {
  const link = (p: number) => {
    const params = new URLSearchParams();
    if (period) params.set("period", periodParam(period));
    if (propertyId) params.set("propertyId", propertyId);
    params.set("page", String(p));
    return `/owner/statements?${params.toString()}`;
  };
  return (
    <nav className="flex items-center justify-between border-t border-stone-200 pt-4 text-sm">
      {page > 1 ? (
        <Link
          href={link(page - 1)}
          className="text-stone-700 hover:text-stone-900"
        >
          ← Previous
        </Link>
      ) : (
        <span className="text-stone-300">← Previous</span>
      )}
      <span className="text-stone-500">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link
          href={link(page + 1)}
          className="text-stone-700 hover:text-stone-900"
        >
          Next →
        </Link>
      ) : (
        <span className="text-stone-300">Next →</span>
      )}
    </nav>
  );
}

function Th({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <th
      className={`px-4 py-2 ${align === "right" ? "text-right" : "text-left"} text-xs font-semibold uppercase tracking-wider text-stone-500`}
    >
      {children}
    </th>
  );
}

// ---------- Pure helpers ----------

function buildWhere(
  ownerId: string,
  period: Period | null,
  propertyId: string | undefined,
): Prisma.TransactionWhereInput {
  const where: Prisma.TransactionWhereInput = {
    property: propertyId
      ? { ownerId, id: propertyId }
      : { ownerId },
  };
  if (period) {
    const start = new Date(Date.UTC(period.year, period.month - 1, 1));
    const end = new Date(Date.UTC(period.year, period.month, 1));
    where.occurredOn = { gte: start, lt: end };
  }
  return where;
}

function bucketByMonth(
  txs: {
    occurredOn: Date;
    direction: "INFLOW" | "OUTFLOW";
    amount: unknown;
    currency: string;
  }[],
): Map<string, Bucket> {
  const out = new Map<string, Bucket>();
  for (const t of txs) {
    const key = monthKey(t.occurredOn);
    const b = out.get(key) ?? { count: 0, totals: new Map() };
    b.count += 1;
    const c = b.totals.get(t.currency) ?? { inflow: 0, outflow: 0 };
    const amt = Number(t.amount);
    if (t.direction === "INFLOW") c.inflow += amt;
    else c.outflow += amt;
    b.totals.set(t.currency, c);
    out.set(key, b);
  }
  return out;
}

function fmt(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function monthKey(d: Date): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthKeyFromPeriod(p: Period): string {
  return `${p.year}-${String(p.month).padStart(2, "0")}`;
}

function parseMonthKey(key: string): Period | null {
  const [y, m] = key.split("-");
  const period = { year: Number(y), month: Number(m) };
  return isValidPeriod(period) ? period : null;
}

function periodParam(p: Period): string {
  return `${p.year}-${String(p.month).padStart(2, "0")}`;
}

function parsePeriodParam(raw: string | undefined): Period | null {
  if (!raw) return null;
  const m = /^(\d{4})-(\d{1,2})$/.exec(raw);
  if (!m) return null;
  const period = { year: Number(m[1]), month: Number(m[2]) };
  return isValidPeriod(period) ? period : null;
}

function monthsAgo(now: Date, count: number): Date {
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - count, 1),
  );
}
