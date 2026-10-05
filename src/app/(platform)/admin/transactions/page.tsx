import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  PlainHeader,
  SortableHeader,
} from "@/components/admin/table/SortableHeader";
import { Pagination } from "@/components/admin/table/Pagination";
import {
  parsePagination,
  parseSort,
  sortToParam,
  type SortState,
} from "@/lib/admin/table";
import {
  filtersToParams,
  monthParam,
  occurredOnRange,
  parseTransactionFilters,
  summariseByCurrency,
  type TransactionFilters,
} from "@/lib/admin/transaction-filters";
import { formatPeriod, recentPeriods } from "@/lib/statements/period";

export const dynamic = "force-dynamic";

const SORTABLE_TX_COLUMNS = [
  "occurredOn",
  "type",
  "amount",
  "currency",
  "createdAt",
] as const;

export default async function TransactionsListPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const rawParams = (searchParams ?? {}) as Record<string, string>;
  const sort = parseSort(
    rawParams.sort,
    SORTABLE_TX_COLUMNS,
    { column: "occurredOn", direction: "desc" },
  );
  const { page, pageSize } = parsePagination(rawParams);
  const filters = parseTransactionFilters(rawParams);
  const range = occurredOnRange(filters.period);

  const where: Prisma.TransactionWhereInput = {
    archivedAt: null,
    ...(filters.propertyId ? { propertyId: filters.propertyId } : {}),
    ...(range ? { occurredOn: range } : {}),
  };

  const orderBy: Prisma.TransactionOrderByWithRelationInput = {
    [sort.column]: sort.direction,
  } as Prisma.TransactionOrderByWithRelationInput;

  const [txs, totalCount, totalsRows, properties] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        property: { select: { id: true, name: true, city: true } },
        lease: { select: { id: true, tenantName: true } },
      },
    }),
    prisma.transaction.count({ where }),
    // Totals cover the whole filtered set rather than the page in
    // front of you. A per-page subtotal would answer a question
    // nobody asked and quietly change as you paged.
    prisma.transaction.findMany({
      where,
      select: { direction: true, amount: true, currency: true },
    }),
    prisma.property.findMany({
      orderBy: [{ city: "asc" }, { name: "asc" }],
      select: { id: true, name: true, city: true },
    }),
  ]);

  const totals = summariseByCurrency(
    totalsRows.map((t) => ({
      direction: t.direction,
      amount: t.amount.toString(),
      currency: t.currency,
    })),
  );

  const selectedProperty = filters.propertyId
    ? properties.find((p) => p.id === filters.propertyId)
    : undefined;
  const isFiltered = Boolean(filters.propertyId || filters.period);
  const monthOptions = recentPeriods(new Date(), 18);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-stone-900">Transactions</h2>
          <p className="text-sm text-stone-500">
            {totalCount} {totalCount === 1 ? "transaction" : "transactions"}{" "}
            recorded
          </p>
        </div>
        <Link
          href={`/admin/transactions/new${
            filters.propertyId ? `?propertyId=${filters.propertyId}` : ""
          }`}
          className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          Record transaction
        </Link>
      </div>

      <form
        method="get"
        className="flex flex-wrap items-end gap-3 rounded-lg border border-stone-200 bg-white p-4"
      >
        <label className="text-xs uppercase tracking-wider text-stone-500">
          Property
          <select
            name="propertyId"
            defaultValue={filters.propertyId ?? ""}
            className="mt-1 block rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          >
            <option value="">All properties</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} · {p.city}
              </option>
            ))}
          </select>
        </label>

        <label className="text-xs uppercase tracking-wider text-stone-500">
          Month
          <select
            name="month"
            defaultValue={filters.period ? monthParam(filters.period) : ""}
            className="mt-1 block rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          >
            <option value="">All time</option>
            {monthOptions.map((p) => (
              <option key={monthParam(p)} value={monthParam(p)}>
                {formatPeriod(p)}
              </option>
            ))}
          </select>
        </label>

        {/* Sort and page size ride along so applying a filter does not
            silently reset the view the operator had set up. */}
        <input type="hidden" name="sort" value={sortToParam(sort)} />
        <input type="hidden" name="pageSize" value={String(pageSize)} />

        <button
          type="submit"
          className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-900 hover:bg-stone-50"
        >
          Apply
        </button>
        {isFiltered ? (
          <Link
            href="/admin/transactions"
            className="rounded-md px-2 py-1.5 text-sm text-stone-500 hover:text-stone-900"
          >
            Clear
          </Link>
        ) : null}
      </form>

      {totals.length > 0 ? (
        <section className="rounded-lg border border-stone-200 bg-white p-4">
          <h3 className="text-xs uppercase tracking-wider text-stone-500">
            {selectedProperty ? selectedProperty.name : "All properties"}
            {filters.period ? ` · ${formatPeriod(filters.period)}` : " · all time"}
          </h3>
          <div className="mt-2 overflow-x-auto">
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-stone-500">
                  <th className="py-1">Currency</th>
                  <th className="py-1 text-right">In</th>
                  <th className="py-1 text-right">Out</th>
                  <th className="py-1 text-right">Net</th>
                </tr>
              </thead>
              <tbody>
                {totals.map((t) => (
                  <tr key={t.currency} className="border-t border-stone-100">
                    <td className="py-1.5 text-stone-900">{t.currency}</td>
                    <td className="py-1.5 text-right text-emerald-700">
                      {money(t.inflow)}
                    </td>
                    <td className="py-1.5 text-right text-red-700">
                      {money(t.outflow)}
                    </td>
                    <td
                      className={`py-1.5 text-right font-medium ${
                        t.net >= 0 ? "text-stone-900" : "text-red-700"
                      }`}
                    >
                      {money(t.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {txs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
          <h3 className="text-base font-medium text-stone-900">
            {isFiltered
              ? "Nothing recorded for this filter"
              : "No transactions yet"}
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            {isFiltered
              ? "An empty month is not the same as a month nobody has entered yet. Widen the filter before concluding there were no costs."
              : "Record rent payments, expenses, payouts, and refunds here. They roll up into the client\u2019s monthly statement."}
          </p>
          <Link
            href={`/admin/transactions/new${
              filters.propertyId ? `?propertyId=${filters.propertyId}` : ""
            }`}
            className="mt-4 inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            {isFiltered ? "Record a cost here" : "Record first transaction"}
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <SortableHeader
                  column="occurredOn"
                  label="Date"
                  current={sort}
                  basePath="/admin/transactions"
                  params={txTableParams(sort, pageSize, filters)}
                />
                <PlainHeader>Property</PlainHeader>
                <PlainHeader>Lease</PlainHeader>
                <SortableHeader
                  column="type"
                  label="Type"
                  current={sort}
                  basePath="/admin/transactions"
                  params={txTableParams(sort, pageSize, filters)}
                />
                <SortableHeader
                  column="amount"
                  label="Amount"
                  current={sort}
                  basePath="/admin/transactions"
                  params={txTableParams(sort, pageSize, filters)}
                  align="right"
                />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {txs.map((t) => (
                <tr key={t.id} className="hover:bg-stone-50/60">
                  <td className="px-4 py-3 text-sm text-stone-700">
                    <Link
                      href={`/admin/transactions/${t.id}`}
                      className="hover:underline"
                    >
                      {t.occurredOn.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/admin/properties/${t.property.id}`}
                      className="text-stone-900 hover:underline"
                    >
                      {t.property.name}
                    </Link>
                    <p className="text-xs text-stone-500">{t.property.city}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {t.lease ? (
                      <Link
                        href={`/admin/leases/${t.lease.id}`}
                        className="hover:underline"
                      >
                        {t.lease.tenantName}
                      </Link>
                    ) : (
                      <span className="italic text-stone-400">No tenant</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs uppercase tracking-wider text-stone-500">
                    {t.type.replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums">
                    <span
                      className={
                        t.direction === "INFLOW"
                          ? "text-emerald-700"
                          : "text-red-700"
                      }
                    >
                      {t.direction === "INFLOW" ? "+" : "−"}
                      {Number(t.amount).toLocaleString("en-GB", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {t.currency}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            basePath="/admin/transactions"
            params={txTableParams(sort, pageSize, filters)}
            page={page}
            pageSize={pageSize}
            totalRows={totalCount}
          />
        </div>
      )}
    </div>
  );
}

// Filters ride along with the sort and page size. Without this,
// clicking a column header would clear the property or the month and
// relabel the totals without changing the heading above them.
function txTableParams(
  sort: SortState,
  pageSize: number,
  filters: TransactionFilters,
): Record<string, string> {
  return {
    sort: sortToParam(sort),
    pageSize: String(pageSize),
    ...filtersToParams(filters),
  };
}

function money(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
