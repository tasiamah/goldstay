import Link from "next/link";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  aggregateTransactionsByCurrency,
  occupancyPercent,
} from "@/lib/owner-dashboard";
import {
  pctChange,
  pickPrimaryCurrency,
  summariseTransactionsByCurrency,
} from "@/lib/owner-kpis";
import { formatPropertyDisplayName } from "@/lib/format-property";
import { WelcomeCard } from "./welcome/WelcomeCard";
import { KpiCard } from "@/components/owner/KpiCard";
import { MonthlyNetChart } from "@/components/owner/MonthlyNetChart";

// Goldstay rents each property out as a whole, so we treat
// "occupied" as a per-property boolean (an active lease exists)
// rather than a per-unit count.

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage({
  searchParams,
}: {
  searchParams?: { welcome?: string };
}) {
  // requireOwner handles the unmatched-user case by redirecting to
  // /owner/pending, so by the time we get here we always have a real
  // Owner row to render.
  const { owner } = await requireOwner();

  const now = new Date();
  const twelveMonthsAgo = new Date(now);
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);
  // Window covers the KPI strip's "prior 30 days" comparator too,
  // so a 13-month pull keeps us to a single round-trip.
  const thirteenMonthsAgo = new Date(now);
  thirteenMonthsAgo.setMonth(thirteenMonthsAgo.getMonth() - 13);

  const [
    properties,
    activeLeaseCount,
    totals,
    kpiTransactions,
    recentTransactions,
    pendingAgreements,
  ] = await Promise.all([
    prisma.property.findMany({
      where: { ownerId: owner.id },
      orderBy: { createdAt: "desc" },
      include: {
        units: {
          select: {
            leases: {
              where: { status: "ACTIVE" },
              select: { id: true },
            },
          },
        },
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
    // Raw transactions feed the KPI strip + monthly net chart. We
    // pull 13 months so the prior-30-day comparator window stays
    // inside the result set and we don't need a second round-trip.
    prisma.transaction.findMany({
      where: {
        property: { ownerId: owner.id },
        occurredOn: { gte: thirteenMonthsAgo },
      },
      select: {
        occurredOn: true,
        amount: true,
        currency: true,
        direction: true,
        propertyId: true,
      },
    }),
    prisma.transaction.findMany({
      where: { property: { ownerId: owner.id } },
      orderBy: { occurredOn: "desc" },
      take: 10,
      include: {
        property: { select: { id: true, name: true, unitNumber: true } },
        lease: { select: { tenantName: true } },
      },
    }),
    // Outstanding management agreements awaiting the owner's signature.
    // We show a single dashboard-level banner that links to the first
    // one (most common case is a single property), but the count is
    // surfaced in the copy so a multi-property landlord knows there's
    // more than one to handle.
    prisma.managementAgreement.findMany({
      where: {
        property: { ownerId: owner.id },
        status: "SENT",
      },
      orderBy: { sentAt: "asc" },
      include: {
        property: { select: { id: true, name: true, unitNumber: true } },
      },
    }),
  ]);

  const propertyOccupancy = properties.map((p) => ({
    id: p.id,
    occupied: p.units.some((u) => u.leases.length > 0),
  }));
  const occupiedPropertyCount = propertyOccupancy.filter((p) => p.occupied)
    .length;
  const occupancyPct = occupancyPercent({
    totalUnits: properties.length,
    occupiedUnits: occupiedPropertyCount,
  });

  const currencyRows = aggregateTransactionsByCurrency(
    totals.map((t) => ({
      currency: t.currency,
      direction: t.direction,
      amount: t._sum.amount ? Number(t._sum.amount) : 0,
    })),
    owner.preferredCurrency,
  );

  // KPI + chart data feed off the same raw 13-month pull so the
  // numbers a landlord eyeballs in the strip exactly match the
  // bars in the chart below.
  const summaries = summariseTransactionsByCurrency(
    kpiTransactions.map((t) => ({
      occurredOn: t.occurredOn,
      amount: Number(t.amount),
      currency: t.currency,
      direction: t.direction,
      propertyId: t.propertyId,
    })),
    now,
  );
  const primary = pickPrimaryCurrency(summaries, owner.preferredCurrency);
  const trend30d = primary
    ? pctChange(primary.thirtyDayNet, primary.prior30DayNet)
    : null;
  const otherCurrencyCount = Math.max(0, summaries.length - 1);
  const activePropertyCount = properties.filter(
    (p) => p.status === "ACTIVE",
  ).length;

  // Show the welcome panel either on a true first session
  // (welcomeCompletedAt is null) or whenever the owner explicitly
  // clicks "Take the tour" further down the page (?welcome=1).
  // Replay uses a different dismiss path so it doesn't try to flip
  // an already-set monotonic timestamp.
  const showWelcome =
    !owner.welcomeCompletedAt || searchParams?.welcome === "1";
  const isWelcomeReplay =
    Boolean(owner.welcomeCompletedAt) && searchParams?.welcome === "1";

  return (
    <div className="space-y-10">
      {showWelcome ? (
        <WelcomeCard
          ownerFirstName={owner.fullName.split(/\s+/)[0] || "there"}
          hasProperties={properties.length > 0}
          hasPendingAgreement={pendingAgreements.length > 0}
          isReplay={isWelcomeReplay}
        />
      ) : null}

      {pendingAgreements.length > 0 ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-900/80">
                Action required
              </p>
              <h2 className="mt-1 text-base font-medium text-amber-950">
                {pendingAgreements.length === 1
                  ? `Sign your management agreement for ${formatPropertyDisplayName(
                      pendingAgreements[0].property.name,
                      pendingAgreements[0].property.unitNumber,
                    )}`
                  : `${pendingAgreements.length} management agreements awaiting your signature`}
              </h2>
              <p className="mt-1 text-sm text-amber-900/80">
                Goldstay has issued a 12-month management agreement
                covering your property. It takes about two minutes to
                review and sign — your statements and payouts depend on
                it being in place.
              </p>
            </div>
            <Link
              href={`/owner/agreements/${pendingAgreements[0].id}`}
              className="shrink-0 rounded-md bg-amber-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-800"
            >
              {pendingAgreements.length === 1
                ? "Review and sign"
                : "Start with the first"}
            </Link>
          </div>
        </section>
      ) : null}

      {/* Top-level KPI strip. The four tiles answer the four
          questions a landlord opens this page to ask: "what did I
          make recently", "what did I make this year", "is my
          portfolio working", "am I full". The right-most tile
          deliberately doubles as the link into the trend chart
          below — landlords lean on the strip and ignore the chart
          on tiny screens, so we don't hide one behind the other. */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Net last 30 days"
          value={
            primary
              ? `${primary.currency} ${fmt(primary.thirtyDayNet)}`
              : "—"
          }
          sub={
            otherCurrencyCount > 0
              ? `+ ${otherCurrencyCount} other ${
                  otherCurrencyCount === 1 ? "currency" : "currencies"
                }`
              : "Inflows minus outflows"
          }
          trend={
            trend30d
              ? {
                  ...trend30d,
                  label: "vs prior 30d",
                }
              : undefined
          }
        />
        <KpiCard
          label="Net last 12 months"
          value={
            primary
              ? `${primary.currency} ${fmt(primary.twelveMonthNet)}`
              : "—"
          }
          sub="Year-to-now in primary currency"
        />
        <KpiCard
          label="Active properties"
          value={String(activePropertyCount)}
          sub={
            properties.length === activePropertyCount
              ? properties.length === 1
                ? "1 property"
                : `${properties.length} properties`
              : `of ${properties.length} on the books`
          }
        />
        <KpiCard
          label="Occupancy"
          value={occupancyPct === null ? "—" : `${occupancyPct}%`}
          sub={
            activeLeaseCount === 0
              ? "No active leases yet"
              : `${activeLeaseCount} active ${
                  activeLeaseCount === 1 ? "lease" : "leases"
                }`
          }
        />
      </section>

      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-medium text-stone-900">
              Net by month
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Inflows minus outflows by calendar month. Goldstay
              commission and out-of-pocket expenses are already
              netted off — these bars are what landed on your side
              of the ledger.
            </p>
          </div>
          <Link
            href="/owner/statements"
            className="shrink-0 self-start rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-white"
          >
            Download statement
          </Link>
        </div>

        {primary ? (
          <div className="mt-6">
            <MonthlyNetChart
              series={primary.monthlyNet}
              currency={primary.currency}
            />
          </div>
        ) : (
          <p className="mt-6 text-sm text-stone-500">
            No transactions recorded in the last 12 months.
          </p>
        )}

        {currencyRows.length > 0 ? (
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
        ) : null}
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
                const occupied = p.units.some((u) => u.leases.length > 0);
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
                        {formatPropertyDisplayName(p.name, p.unitNumber)}
                      </Link>
                      <p className="text-xs text-stone-500">
                        {p.neighbourhood ? `${p.neighbourhood}, ` : ""}
                        {p.city} · {occupied ? "Occupied" : "Vacant"}
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
                        {formatPropertyDisplayName(
                          t.property.name,
                          t.property.unitNumber,
                        )}
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

      {/* Quiet replay link so a landlord who's already dismissed
          the welcome panel can still revisit it later. We hide it
          while the panel is open to avoid a circular UX where the
          link leads back to the page you're on. */}
      {!showWelcome ? (
        <p className="border-t border-stone-200 pt-6 text-xs text-stone-500">
          New to the portal?{" "}
          <Link
            href="/owner?welcome=1"
            className="underline-offset-2 hover:text-stone-900 hover:underline"
          >
            Take the tour
          </Link>
          .
        </p>
      ) : null}
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
