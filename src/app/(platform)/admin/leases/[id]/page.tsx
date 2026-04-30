import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { LeaseForm } from "../LeaseForm";
import { endLeaseAction, updateLeaseAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function LeaseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const lease = await prisma.lease.findUnique({
    where: { id: params.id },
    include: {
      unit: {
        include: {
          property: {
            select: {
              id: true,
              name: true,
              country: true,
              owner: { select: { id: true, fullName: true, preferredCurrency: true } },
            },
          },
        },
      },
      transactions: {
        orderBy: { occurredOn: "desc" },
        take: 10,
      },
    },
  });
  if (!lease) notFound();

  const boundUpdate = updateLeaseAction.bind(null, lease.id);
  const boundEnd = endLeaseAction.bind(null, lease.id);

  const defaultCurrency =
    lease.unit.property.country === "KE"
      ? "KES"
      : lease.unit.property.country === "GH"
        ? "GHS"
        : (lease.unit.property.owner.preferredCurrency ?? "USD");

  const formatDate = (d: Date | null) =>
    d
      ? d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/admin/properties/${lease.unit.property.id}`}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← {lease.unit.property.name}
        </Link>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-medium text-stone-900">
              {lease.tenantName}
            </h2>
            <p className="text-sm text-stone-500">
              {formatDate(lease.startDate)} →{" "}
              {lease.endDate ? formatDate(lease.endDate) : "ongoing"} ·{" "}
              <span className="text-xs uppercase tracking-wider">
                {lease.status}
              </span>
            </p>
          </div>
          {lease.status === "ACTIVE" ? (
            <form action={boundEnd}>
              <button
                type="submit"
                className="inline-flex shrink-0 items-center rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-800 hover:bg-stone-100"
              >
                End lease today
              </button>
            </form>
          ) : null}
        </div>
      </div>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <h3 className="text-base font-medium text-stone-900">Details</h3>
          <div className="mt-5">
            <LeaseForm
              action={boundUpdate}
              defaultCurrency={defaultCurrency}
              defaults={{
                unitId: lease.unit.id,
                tenantName: lease.tenantName,
                tenantEmail: lease.tenantEmail,
                tenantPhone: lease.tenantPhone,
                startDate: lease.startDate,
                endDate: lease.endDate,
                monthlyRent: lease.monthlyRent.toString(),
                currency: lease.currency,
                depositAmount: lease.depositAmount?.toString() ?? null,
                status: lease.status,
                notes: lease.notes,
              }}
              submitLabel="Save changes"
            />
          </div>
        </div>

        <div className="space-y-6">
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <h3 className="text-base font-medium text-stone-900">Snapshot</h3>
          <dl className="mt-4 space-y-3 text-sm">
            <Row
              label="Monthly rent"
              value={`${lease.currency} ${Number(lease.monthlyRent).toLocaleString("en-GB")}`}
            />
            <Row
              label="Deposit"
              value={
                lease.depositAmount
                  ? `${lease.currency} ${Number(lease.depositAmount).toLocaleString("en-GB")}`
                  : "—"
              }
            />
            <Row
              label="Tenant email"
              value={lease.tenantEmail ?? "—"}
            />
            <Row
              label="Tenant phone"
              value={lease.tenantPhone ?? "—"}
            />
            <Row
              label="Owner"
              value={
                <Link
                  href={`/admin/owners/${lease.unit.property.owner.id}`}
                  className="text-stone-900 hover:underline"
                >
                  {lease.unit.property.owner.fullName}
                </Link>
              }
            />
          </dl>
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-medium text-stone-900">
              Recent transactions
            </h3>
            <Link
              href={`/admin/transactions/new?propertyId=${lease.unit.property.id}&leaseId=${lease.id}`}
              className="text-sm font-medium text-stone-900 hover:underline"
            >
              + Record
            </Link>
          </div>
          {lease.transactions.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">
              No transactions recorded for this lease yet.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-stone-100">
              {lease.transactions.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center justify-between py-3"
                >
                  <Link
                    href={`/admin/transactions/${t.id}`}
                    className="block hover:underline"
                  >
                    <p className="text-sm font-medium text-stone-900">
                      {t.type.replace(/_/g, " ")}
                    </p>
                    <p className="text-xs text-stone-500">
                      {t.occurredOn.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                  <span
                    className={`text-sm tabular-nums ${
                      t.direction === "INFLOW"
                        ? "text-emerald-700"
                        : "text-red-700"
                    }`}
                  >
                    {t.direction === "INFLOW" ? "+" : "−"}
                    {Number(t.amount).toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {t.currency}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        </div>
      </section>
    </div>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-stone-500">{label}</dt>
      <dd className="text-right text-stone-900">{value}</dd>
    </div>
  );
}
