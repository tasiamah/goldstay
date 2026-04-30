import Link from "next/link";
import { TransactionForm } from "../TransactionForm";
import { createTransactionAction } from "../actions";
import { loadPropertyOptions } from "../_loadProperties";

export const dynamic = "force-dynamic";

export default async function NewTransactionPage({
  searchParams,
}: {
  searchParams: { propertyId?: string; leaseId?: string };
}) {
  const properties = await loadPropertyOptions();

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/transactions"
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← Transactions
        </Link>
        <h2 className="mt-2 text-xl font-medium text-stone-900">
          Record transaction
        </h2>
        <p className="text-sm text-stone-500">
          Inflows (rent, deposit) and outflows (expenses, payouts) are tracked
          per property and optionally tied to a specific lease.
        </p>
      </div>

      <div className="rounded-lg border border-stone-200 bg-white p-6">
        {properties.length === 0 ? (
          <p className="text-sm text-stone-500">
            You need at least one property before you can log a transaction.
            Add an owner and a property first.
          </p>
        ) : (
          <TransactionForm
            action={createTransactionAction}
            properties={properties}
            defaults={{
              propertyId: searchParams.propertyId,
              leaseId: searchParams.leaseId,
              occurredOn: new Date(),
              type: "RENT",
              direction: "INFLOW",
            }}
            submitLabel="Record transaction"
          />
        )}
      </div>
    </div>
  );
}
