import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { TransactionForm } from "../TransactionForm";
import {
  deleteTransactionAction,
  updateTransactionAction,
} from "../actions";
import { loadPropertyOptions } from "../_loadProperties";

export const dynamic = "force-dynamic";

export default async function TransactionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [tx, properties] = await Promise.all([
    prisma.transaction.findUnique({
      where: { id: params.id },
      include: {
        property: { select: { id: true, name: true } },
        lease: { select: { id: true, tenantName: true } },
      },
    }),
    loadPropertyOptions(),
  ]);

  if (!tx) notFound();

  const boundUpdate = updateTransactionAction.bind(null, tx.id);
  const boundDelete = deleteTransactionAction.bind(null, tx.id);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin/transactions"
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← Transactions
        </Link>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-stone-900">
              {tx.type.replace(/_/g, " ")}{" "}
              <span
                className={
                  tx.direction === "INFLOW"
                    ? "text-emerald-700"
                    : "text-red-700"
                }
              >
                {tx.direction === "INFLOW" ? "+" : "−"}
                {Number(tx.amount).toLocaleString("en-GB", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {tx.currency}
              </span>
            </h2>
            <p className="text-sm text-stone-500">
              {tx.occurredOn.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}{" "}
              ·{" "}
              <Link
                href={`/admin/properties/${tx.property.id}`}
                className="hover:underline"
              >
                {tx.property.name}
              </Link>
              {tx.lease ? (
                <>
                  {" · "}
                  <Link
                    href={`/admin/leases/${tx.lease.id}`}
                    className="hover:underline"
                  >
                    {tx.lease.tenantName}
                  </Link>
                </>
              ) : null}
            </p>
          </div>
          <form action={boundDelete}>
            <button
              type="submit"
              className="inline-flex shrink-0 items-center rounded-md border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              Delete
            </button>
          </form>
        </div>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <TransactionForm
          action={boundUpdate}
          properties={properties}
          defaults={{
            propertyId: tx.propertyId,
            leaseId: tx.leaseId,
            bookingId: tx.bookingId,
            occurredOn: tx.occurredOn,
            type: tx.type,
            direction: tx.direction,
            amount: tx.amount.toString(),
            currency: tx.currency,
            description: tx.description,
            reference: tx.reference,
          }}
          submitLabel="Save changes"
        />
      </div>
    </div>
  );
}
