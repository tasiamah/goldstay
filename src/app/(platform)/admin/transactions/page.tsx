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

  const where: Prisma.TransactionWhereInput = { archivedAt: null };

  const orderBy: Prisma.TransactionOrderByWithRelationInput = {
    [sort.column]: sort.direction,
  } as Prisma.TransactionOrderByWithRelationInput;

  const [txs, totalCount] = await Promise.all([
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
  ]);

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
          href="/admin/transactions/new"
          className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          Record transaction
        </Link>
      </div>

      {txs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
          <h3 className="text-base font-medium text-stone-900">
            No transactions yet
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Record rent payments, expenses, payouts, and refunds here. They
            roll up into the owner&rsquo;s monthly statement.
          </p>
          <Link
            href="/admin/transactions/new"
            className="mt-4 inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            Record first transaction
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <SortableHeader
                  column="occurredOn"
                  label="Date"
                  current={sort}
                  basePath="/admin/transactions"
                  params={txTableParams(sort, pageSize)}
                />
                <PlainHeader>Property</PlainHeader>
                <PlainHeader>Lease</PlainHeader>
                <SortableHeader
                  column="type"
                  label="Type"
                  current={sort}
                  basePath="/admin/transactions"
                  params={txTableParams(sort, pageSize)}
                />
                <SortableHeader
                  column="amount"
                  label="Amount"
                  current={sort}
                  basePath="/admin/transactions"
                  params={txTableParams(sort, pageSize)}
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
                      <span className="text-stone-400">—</span>
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
            params={txTableParams(sort, pageSize)}
            page={page}
            pageSize={pageSize}
            totalRows={totalCount}
          />
        </div>
      )}
    </div>
  );
}

function txTableParams(
  sort: SortState,
  pageSize: number,
): Record<string, string> {
  return {
    sort: sortToParam(sort),
    pageSize: String(pageSize),
  };
}
