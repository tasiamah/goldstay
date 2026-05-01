// /owner/transactions — full transaction history across the whole
// portfolio with filters for month and property. Used when the dashboard's
// "Recent activity" list isn't enough; the diaspora landlord wants to
// scroll the full year, search by tenant, or sanity-check what
// hit a given month before downloading the statement PDF.
//
// Filters live in querystring (year, month, propertyId) so links
// from the dashboard's per-property cards or the per-month grid can
// land here pre-scoped without client-side state.

import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  formatPeriod,
  parsePeriod,
  periodRange,
  periodsSince,
} from "@/lib/statements/period";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

export default async function OwnerTransactionsPage({
  searchParams,
}: {
  searchParams: {
    year?: string;
    month?: string;
    period?: string;
    propertyId?: string;
    page?: string;
  };
}) {
  const { owner } = await requireOwner();

  // The filter form submits one combined ?period=YYYY-M selector
  // because GET-form selects can't synthesise two URL keys without
  // JS. Direct links from the dashboard pass year + month as
  // separate keys; both shapes are accepted here.
  const splitPeriod = splitCombinedPeriod(searchParams.period);
  const period = parsePeriod(
    searchParams.year ?? splitPeriod?.year,
    searchParams.month ?? splitPeriod?.month,
  );
  const propertyId = searchParams.propertyId?.trim() || undefined;
  const page = Math.max(1, Number(searchParams.page) || 1);

  const where: {
    property: { ownerId: string; id?: string };
    occurredOn?: { gte: Date; lt: Date };
  } = {
    property: { ownerId: owner.id },
  };
  if (propertyId) where.property.id = propertyId;
  if (period) {
    const { start, end } = periodRange(period);
    where.occurredOn = { gte: start, lt: end };
  }

  const [transactions, total, properties, earliestTx] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { occurredOn: "desc" },
      include: {
        property: { select: { id: true, name: true } },
        lease: { select: { tenantName: true } },
      },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.transaction.count({ where }),
    prisma.property.findMany({
      where: { ownerId: owner.id },
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
    // Earliest transaction date constrains the month dropdown so a
    // landlord who joined last week doesn't see 11 empty months.
    prisma.transaction.findFirst({
      where: { property: { ownerId: owner.id } },
      orderBy: { occurredOn: "asc" },
      select: { occurredOn: true },
    }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const earliest =
    earliestTx && earliestTx.occurredOn < owner.createdAt
      ? earliestTx.occurredOn
      : owner.createdAt;
  const months = periodsSince(earliest, new Date());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-serif text-stone-900">
          All transactions
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          The full ledger Goldstay keeps for your portfolio. Filter by
          month or property; download a signed{" "}
          <Link
            href="/owner/statements"
            className="text-stone-900 underline-offset-2 hover:underline"
          >
            monthly statement
          </Link>{" "}
          for accountants.
        </p>
      </div>

      <form className="flex flex-wrap items-end gap-3 rounded-lg border border-stone-200 bg-white p-4">
        <label className="block text-xs">
          <span className="text-stone-500">Month</span>
          <select
            name="period"
            defaultValue={period ? `${period.year}-${period.month}` : ""}
            className="mt-1 block rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All months</option>
            {months.map((m) => (
              <option
                key={`${m.year}-${m.month}`}
                value={`${m.year}-${m.month}`}
              >
                {formatPeriod(m)}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs">
          <span className="text-stone-500">Property</span>
          <select
            name="propertyId"
            defaultValue={propertyId ?? ""}
            className="mt-1 block rounded-md border border-stone-300 bg-white px-3 py-2 text-sm"
          >
            <option value="">All properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
        >
          Apply
        </button>
        {period || propertyId ? (
          <Link
            href="/owner/transactions"
            className="text-sm text-stone-500 hover:text-stone-900"
          >
            Clear
          </Link>
        ) : null}
      </form>

      <p className="text-xs text-stone-500">
        {total === 0
          ? "No transactions match these filters."
          : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(
              page * PAGE_SIZE,
              total,
            )} of ${total}`}
      </p>

      {transactions.length > 0 ? (
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
              {transactions.map((t) => (
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
                      {t.property.name}
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
      ) : null}

      {totalPages > 1 ? (
        <Pagination
          page={page}
          totalPages={totalPages}
          searchParams={searchParams}
        />
      ) : null}
    </div>
  );
}

function splitCombinedPeriod(
  v: string | undefined,
): { year: string; month: string } | null {
  if (!v) return null;
  const m = /^(\d{4})-(\d{1,2})$/.exec(v);
  if (!m) return null;
  return { year: m[1], month: m[2] };
}

function Pagination({
  page,
  totalPages,
  searchParams,
}: {
  page: number;
  totalPages: number;
  searchParams: { year?: string; month?: string; propertyId?: string };
}) {
  const base = new URLSearchParams();
  if (searchParams.year) base.set("year", searchParams.year);
  if (searchParams.month) base.set("month", searchParams.month);
  if (searchParams.propertyId)
    base.set("propertyId", searchParams.propertyId);

  const link = (p: number) => {
    const params = new URLSearchParams(base);
    params.set("page", String(p));
    return `/owner/transactions?${params.toString()}`;
  };

  return (
    <nav className="flex items-center justify-between border-t border-stone-200 pt-4 text-sm">
      {page > 1 ? (
        <Link href={link(page - 1)} className="text-stone-700 hover:text-stone-900">
          ← Previous
        </Link>
      ) : (
        <span className="text-stone-300">← Previous</span>
      )}
      <span className="text-stone-500">
        Page {page} of {totalPages}
      </span>
      {page < totalPages ? (
        <Link href={link(page + 1)} className="text-stone-700 hover:text-stone-900">
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

function fmt(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
