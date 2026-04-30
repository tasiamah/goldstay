import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  aggregateTransactionsByCurrency,
  occupancyPercent,
} from "@/lib/owner-dashboard";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  // requireOwner handles the unmatched-user case by redirecting to
  // /owner/pending, so by the time we get here we always have a real
  // Owner row to render.
  const { owner } = await requireOwner();

  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  const [
    properties,
    unitCount,
    occupiedUnitCount,
    activeLeaseCount,
    totals,
    recentTransactions,
  ] = await Promise.all([
    prisma.property.findMany({
      where: { ownerId: owner.id },
      orderBy: { createdAt: "desc" },
      include: {
        units: {
          select: { id: true, status: true },
        },
      },
    }),
    prisma.unit.count({ where: { property: { ownerId: owner.id } } }),
    prisma.unit.count({
      where: {
        property: { ownerId: owner.id },
        status: "OCCUPIED",
      },
    }),
    prisma.lease.count({
      where: {
        unit: { property: { ownerId: owner.id } },
        status: "ACTIVE",
      },
    }),
    prisma.transaction.groupBy({
      by: ["currency", "direction"],
      where: {
        property: { ownerId: owner.id },
        occurredOn: { gte: twelveMonthsAgo },
      },
      _sum: { amount: true },
    }),
    prisma.transaction.findMany({
      where: { property: { ownerId: owner.id } },
      orderBy: { occurredOn: "desc" },
      take: 10,
      include: {
        property: { select: { id: true, name: true } },
        lease: { select: { tenantName: true } },
      },
    }),
  ]);

  const occupancyPct = occupancyPercent({
    totalUnits: unitCount,
    occupiedUnits: occupiedUnitCount,
  });

  const currencyRows = aggregateTransactionsByCurrency(
    totals.map((t) => ({
      currency: t.currency,
      direction: t.direction,
      amount: t._sum.amount ? Number(t._sum.amount) : 0,
    })),
    owner.preferredCurrency,
  );

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Properties" value={properties.length} />
        <Stat label="Units" value={unitCount} />
        <Stat label="Active leases" value={activeLeaseCount} />
        <Stat
          label="Occupancy"
          value={occupancyPct === null ? "—" : `${occupancyPct}%`}
        />
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-medium text-stone-900">
              Last 12 months
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Inflows are rent and deposits. Outflows are expenses, refunds,
              management fees, and payouts already remitted to you.
            </p>
          </div>
          <Link
            href="/owner/statements"
            className="shrink-0 self-start rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-white"
          >
            Download statement
          </Link>
        </div>
        {currencyRows.length === 0 ? (
          <p className="mt-6 text-sm text-stone-500">
            No transactions recorded in the last 12 months.
          </p>
        ) : (
          <div className="mt-6 overflow-hidden rounded-md border border-stone-200">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <Th>Currency</Th>
                  <Th align="right">Inflow</Th>
                  <Th align="right">Outflow</Th>
                  <Th align="right">Net</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {currencyRows.map((row) => (
                  <tr key={row.currency}>
                    <td className="px-4 py-3 text-sm font-medium text-stone-900">
                      {row.currency}
                    </td>
                    <td className="px-4 py-3 text-right text-sm tabular-nums text-emerald-700">
                      {fmt(row.inflow)}
                    </td>
                    <td className="px-4 py-3 text-right text-sm tabular-nums text-red-700">
                      {fmt(row.outflow)}
                    </td>
                    <td
                      className={`px-4 py-3 text-right text-sm font-medium tabular-nums ${
                        row.net >= 0 ? "text-stone-900" : "text-red-800"
                      }`}
                    >
                      {fmt(row.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="text-base font-medium text-stone-900">
            Your portfolio
          </h2>
          {properties.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">
              Goldstay has not attached any properties to your account yet.
              We&rsquo;ll be in touch as soon as your portfolio is live in the
              portal.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-stone-100">
              {properties.map((p) => {
                const occupied = p.units.filter(
                  (u) => u.status === "OCCUPIED",
                ).length;
                const pct = occupancyPercent({
                  totalUnits: p.units.length,
                  occupiedUnits: occupied,
                });
                return (
                  <li
                    key={p.id}
                    className="flex items-start justify-between py-3"
                  >
                    <div>
                      <Link
                        href={`/owner/properties/${p.id}`}
                        className="font-medium text-stone-900 hover:underline"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-stone-500">
                        {p.neighbourhood ? `${p.neighbourhood}, ` : ""}
                        {p.city} · {p.units.length}{" "}
                        {p.units.length === 1 ? "unit" : "units"}
                        {pct !== null ? ` · ${pct}% occupied` : ""}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-wider text-stone-500">
                      {p.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <div className="flex items-start justify-between gap-4">
            <h2 className="text-base font-medium text-stone-900">
              Recent activity
            </h2>
            <Link
              href="/owner/transactions"
              className="text-xs text-stone-500 hover:text-stone-900"
            >
              See all →
            </Link>
          </div>
          {recentTransactions.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">
              No transactions yet. Goldstay logs every rent payment, expense,
              and payout here so you can audit the numbers behind your monthly
              statement.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-stone-100">
              {recentTransactions.map((t) => (
                <li
                  key={t.id}
                  className="flex items-start justify-between py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-stone-900">
                      {t.type.replace(/_/g, " ")}
                      {t.lease ? (
                        <span className="font-normal text-stone-500">
                          {" "}
                          · {t.lease.tenantName}
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-stone-500">
                      <Link
                        href={`/owner/properties/${t.property.id}`}
                        className="hover:text-stone-900 hover:underline"
                      >
                        {t.property.name}
                      </Link>{" "}
                      ·{" "}
                      {t.occurredOn.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <span
                    className={`text-sm tabular-nums ${
                      t.direction === "INFLOW"
                        ? "text-emerald-700"
                        : "text-red-700"
                    }`}
                  >
                    {t.direction === "INFLOW" ? "+" : "−"}
                    {fmt(Number(t.amount))} {t.currency}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <p className="text-xs uppercase tracking-wider text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-serif text-stone-900">{value}</p>
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

function fmt(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
