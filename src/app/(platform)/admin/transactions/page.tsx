import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function TransactionsListPage() {
  const txs = await prisma.transaction.findMany({
    orderBy: { occurredOn: "desc" },
    take: 200,
    include: {
      property: { select: { id: true, name: true, city: true } },
      lease: { select: { id: true, tenantName: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-medium text-stone-900">Transactions</h2>
          <p className="text-sm text-stone-500">
            {txs.length === 200
              ? "Showing the 200 most recent transactions"
              : `${txs.length} ${txs.length === 1 ? "transaction" : "transactions"}`}
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
                <Th>Date</Th>
                <Th>Property</Th>
                <Th>Lease</Th>
                <Th>Type</Th>
                <Th align="right">Amount</Th>
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
        </div>
      )}
    </div>
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
      className={`px-4 py-2 text-${align} text-xs font-semibold uppercase tracking-wider text-stone-500`}
    >
      {children}
    </th>
  );
}
