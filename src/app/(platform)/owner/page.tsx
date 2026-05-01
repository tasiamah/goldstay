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
import { FirstVisitHint } from "./welcome/FirstVisitHint";
import { KpiCard } from "@/components/owner/KpiCard";
import { MonthlyNetChart } from "@/components/owner/MonthlyNetChart";
import { HelpHint } from "@/components/owner/HelpHint";
import { SetupChecklist } from "@/components/owner/SetupChecklist";
import {
  computeSetupChecklist,
  type SetupStepKey,
} from "@/lib/owner/setup-status";
import { listPayoutMethodsFor } from "@/lib/payouts";
import { syncOwnerNotifications } from "@/lib/notifications/sync";

const PAYOUTS_STEPS = new Set<SetupStepKey>(["legal", "bank"]);

// Goldstay rents each property out as a whole, so we treat
// "occupied" as a per-property boolean (an active lease exists)
// rather than a per-unit count.

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
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
    payoutMethods,
    kycCounts,
    latestStatement,
    latestPayout,
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
    // Two cheap reads that drive the setup checklist banner below.
    // We only need the count of payout methods and a kind-grouped
    // count of KYC documents — the underlying rows are the source
    // of truth on /owner/payouts and /owner/profile.
    listPayoutMethodsFor(owner.id, { includeArchived: false }),
    prisma.document.groupBy({
      by: ["kind"],
      where: {
        ownerId: owner.id,
        kind: { in: ["ID_DOCUMENT", "PROOF_OF_PAYOUT_ACCOUNT"] },
      },
      _count: { _all: true },
    }),
    // Latest statement + latest payout drive the bell. Both pull
    // one row each so even an owner with hundreds of transactions
    // stays cheap. We restrict latestPayout to the last 60 days
    // so an old statement doesn't keep ringing the bell forever
    // — the sync helper applies its own 14-day window inside that.
    prisma.statementSend.findFirst({
      where: { ownerId: owner.id, sentAt: { not: null } },
      orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }],
      select: { periodYear: true, periodMonth: true, sentAt: true },
    }),
    prisma.transaction.findFirst({
      where: {
        property: { ownerId: owner.id },
        type: "PAYOUT",
        direction: "OUTFLOW",
        occurredOn: {
          gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        },
      },
      orderBy: { occurredOn: "desc" },
      select: {
        id: true,
        amount: true,
        currency: true,
        occurredOn: true,
      },
    }),
  ]);

  const kycByKind = Object.fromEntries(
    kycCounts.map((c) => [c.kind, c._count._all]),
  );
  const setup = computeSetupChecklist({
    owner: {
      fullName: owner.fullName,
      phone: owner.phone,
      address: owner.address,
      entityType: owner.entityType,
      companyName: owner.companyName,
    },
    hasIdDocument: (kycByKind.ID_DOCUMENT ?? 0) > 0,
    hasProofOfAccount: (kycByKind.PROOF_OF_PAYOUT_ACCOUNT ?? 0) > 0,
    payoutMethodCount: payoutMethods.length,
  });
  const setupComplete = setup.doneCount === setup.totalCount;

  // Refresh the bell against current state. Idempotent + cheap (one
  // findMany + at most one transaction). We deliberately don't await
  // this in a way that blocks the page — but we do need it before
  // the bell renders in the layout, so a sequential await it is.
  // The layout reads from OwnerNotification after this completes.
  await syncOwnerNotifications(owner.id, {
    setup,
    pendingAgreements: pendingAgreements.map((a) => ({
      id: a.id,
      property: a.property,
    })),
    latestStatement,
    latestPayout: latestPayout
      ? {
          id: latestPayout.id,
          amount: latestPayout.amount,
          currency: latestPayout.currency,
          occurredOn: latestPayout.occurredOn,
        }
      : null,
  });

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

  // First-visit nudge: a one-line banner above the dashboard
  // pointing at the per-section ? hints. Once dismissed it never
  // comes back — the hints themselves remain available for any
  // refresher, removing the need for a separate "take the tour" link.
  const showFirstVisitHint = !owner.welcomeCompletedAt;

  return (
    <div className="space-y-10">
      {showFirstVisitHint ? (
        <FirstVisitHint
          ownerFirstName={owner.fullName.split(/\s+/)[0] || "there"}
          hasPendingAgreement={pendingAgreements.length > 0}
        />
      ) : null}

      {!setupComplete ? (
        <section className="rounded-lg border border-stone-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-stone-500">
                Account setup
              </p>
              <h2 className="mt-1 text-base font-medium text-stone-900">
                {setup.doneCount} of {setup.totalCount} steps done — finish
                the rest before your first payout
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Each step takes about a minute. Tap a row to jump straight
                to the missing piece. Your details sit under{" "}
                <Link
                  href="/owner/profile"
                  className="text-stone-700 underline-offset-2 hover:underline"
                >
                  Profile
                </Link>
                ; legal documents and bank account sit under{" "}
                <Link
                  href="/owner/payouts"
                  className="text-stone-700 underline-offset-2 hover:underline"
                >
                  Payouts
                </Link>
                .
              </p>
            </div>
            <ProgressPill
              done={setup.doneCount}
              total={setup.totalCount}
            />
          </div>
          <div className="mt-4">
            <SetupChecklist
              data={setup}
              activeKey={setup.firstIncomplete}
              hrefFor={(key) =>
                PAYOUTS_STEPS.has(key)
                  ? `/owner/payouts?step=${key}#${key}`
                  : `/owner/profile#details`
              }
            />
          </div>
        </section>
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
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium text-stone-900">
                Net by month
              </h2>
              <HelpHint label="Net by month">
                A signed PDF statement is also issued on the 5th of
                every month — open it from the &ldquo;Download
                statement&rdquo; button to see the same numbers with
                supporting receipts attached.
              </HelpHint>
            </div>
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
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium text-stone-900">
              Your portfolio
            </h2>
            <HelpHint label="Your portfolio">
              Every property Goldstay manages for you. Tap into a
              property to see live occupancy, recent bookings, and the
              documents we hold for it.
            </HelpHint>
          </div>
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
            <div className="flex items-center gap-2">
              <h2 className="text-base font-medium text-stone-900">
                Recent activity
              </h2>
              <HelpHint label="Recent activity">
                Every rent payment, expense, refund and payout — the
                numbers behind your statement. Filterable by property
                and month on the full transactions page.
              </HelpHint>
            </div>
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

// Small "X / Y" pill rendered next to the setup-checklist heading
// so a glance at the dashboard tells the owner how close they are
// without reading the row icons. We keep it amber-tinted so it
// echoes the same visual language as the agreement-pending banner
// below — both are "finish me" prompts.
function ProgressPill({ done, total }: { done: number; total: number }) {
  return (
    <span
      aria-label={`${done} of ${total} setup steps done`}
      className="inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-900"
    >
      <span className="tabular-nums">{done}</span>
      <span className="text-amber-700">/</span>
      <span className="tabular-nums">{total}</span>
    </span>
  );
}
