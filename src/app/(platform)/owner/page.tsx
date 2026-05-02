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
import { EarningsOverview } from "@/components/owner/EarningsOverview";
import { HelpHint } from "@/components/owner/HelpHint";
import { computeSetupChecklist } from "@/lib/owner/setup-status";
import { listPayoutMethodsFor } from "@/lib/payouts";
import { syncOwnerNotifications } from "@/lib/notifications/sync";
import { computePropertyReadiness } from "@/lib/owner/property-readiness";
import {
  PropertyReadinessBadge,
  PropertyReadinessSummary,
} from "@/components/owner/PropertyReadinessBadge";
import {
  REQUIRED_PROPERTY_DOC_KINDS,
  labelForRequiredDoc,
  missingPropertyDocKinds,
} from "@/lib/owner/property-documents";

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
    activeLeases,
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
        // Pull just the kind column for every document on the
        // property — enough to compute "is the required set
        // complete" without paying for titles, sizes, signed URLs,
        // etc. Cheap when there are 5–20 documents per property.
        documents: { select: { kind: true } },
      },
    }),
    // We pull the monthlyRent + currency for every active lease so the
    // dashboard can show both "how many leases are live" and the
    // "expected this month" headline KPI without a second round-trip.
    // The lease list per owner is small (single-digit to low-tens for
    // even our largest landlords), so taking the rows is cheaper than
    // a separate count + groupBy.
    prisma.lease.findMany({
      where: {
        unit: { property: { ownerId: owner.id } },
        status: "ACTIVE",
      },
      select: { monthlyRent: true, currency: true },
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
    // of truth on /owner/account.
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

  // Refresh the bell against current state. Idempotent + cheap
  // (one findMany + at most one transaction). The layout reads
  // from OwnerNotification right after this completes, so a
  // sequential await is correct here. Once we move to Next 15
  // this can move into `after()` to render the page before the
  // bell catch-up runs.
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

  // Bucket active leases by currency so we can pick the one matching
  // the dashboard's primary currency. Mixed-currency portfolios get a
  // "+ N other currencies" footnote rather than a misleading sum.
  const activeLeaseCount = activeLeases.length;
  const rentByCurrency = new Map<string, number>();
  for (const lease of activeLeases) {
    const c = lease.currency;
    rentByCurrency.set(
      c,
      (rentByCurrency.get(c) ?? 0) + Number(lease.monthlyRent),
    );
  }

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

  // "Expected this month" = sum of monthlyRent for the active leases
  // that bill in the dashboard's primary currency. We deliberately
  // don't FX-convert other currencies into that primary — owners
  // would rather see one currency clean than a soft-converted total.
  const expectedPrimaryCurrency = primary?.currency
    ?? owner.preferredCurrency
    ?? Array.from(rentByCurrency.keys())[0]
    ?? null;
  const expectedAmount = expectedPrimaryCurrency
    ? rentByCurrency.get(expectedPrimaryCurrency) ?? 0
    : 0;
  const expectedThisMonth =
    expectedPrimaryCurrency && activeLeaseCount > 0
      ? {
          amount: expectedAmount,
          currency: expectedPrimaryCurrency,
          activeLeaseCount: activeLeases.filter(
            (l) => l.currency === expectedPrimaryCurrency,
          ).length,
          otherCurrencyCount: Math.max(0, rentByCurrency.size - 1),
        }
      : null;

  // Properties that don't yet have every kind in
  // REQUIRED_PROPERTY_DOC_KINDS on file. Drives the second banner.
  // We compute this in memory (already have the documents from the
  // Promise.all above) so no extra round-trip — the cost is one Set
  // construction per property.
  const propertiesMissingDocs = properties.filter(
    (p) => missingPropertyDocKinds(p.documents.map((d) => d.kind)).length > 0,
  );
  const firstPropertyMissingDocs = propertiesMissingDocs[0] ?? null;

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
        // Red, not amber — setup blocks every payout, so it ranks
        // above the agreement banner (amber) and the missing-docs
        // banner (amber). Deliberately a one-liner with a single
        // CTA: the full step-by-step checklist already lives on
        // /owner/account where the owner is about to fill the
        // fields anyway, so duplicating it inside the banner just
        // made the dashboard noisier without giving the owner a
        // faster path to the work.
        <section className="rounded-lg border border-rose-300 bg-rose-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-wider text-rose-800">
                Account setup not complete
              </p>
              <h2 className="mt-1 text-base font-medium text-rose-950">
                {setup.doneCount} of {setup.totalCount} steps done. Finish
                the rest before your first payout
              </h2>
              <p className="mt-1 text-sm text-rose-900/80">
                Each step takes about a minute. Click below to jump
                straight to the next missing piece.
              </p>
            </div>
            <Link
              href={
                setup.firstIncomplete
                  ? `/owner/account?step=${setup.firstIncomplete}#${setup.firstIncomplete}`
                  : "/owner/account#details"
              }
              className="shrink-0 rounded-md bg-rose-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-rose-800"
            >
              Complete here →
            </Link>
          </div>
        </section>
      ) : null}

      {propertiesMissingDocs.length > 0 ? (
        // Amber — informational, not blocking. Most property docs
        // (title deed, sale agreement) are uploaded by the Goldstay
        // team rather than the owner, so we frame this as "what we
        // need on file" and route the owner to the most relevant
        // property detail page where the per-property "Documents
        // we still need" callout shows them what to chase support
        // for. Hidden entirely when every property is documented.
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-900/80">
                Documents needed
              </p>
              <h2 className="mt-1 text-base font-medium text-amber-950">
                {propertiesMissingDocs.length === properties.length
                  ? properties.length === 1
                    ? "Your property is missing required documents"
                    : `All ${properties.length} of your properties are missing required documents`
                  : `${propertiesMissingDocs.length} of your ${
                      properties.length
                    } ${
                      properties.length === 1 ? "property is" : "properties are"
                    } missing required documents`}
              </h2>
              <p className="mt-1 text-sm text-amber-900/80">
                We need {humanJoin(REQUIRED_PROPERTY_DOC_KINDS.map(labelForRequiredDoc))}{" "}
                on file for every property. The Goldstay team handles
                most of these for you. Open the property to see what&rsquo;s
                missing, or email{" "}
                <a
                  href="mailto:support@goldstay.co.ke"
                  className="font-medium text-amber-900 underline-offset-2 hover:underline"
                >
                  support@goldstay.co.ke
                </a>{" "}
                if you have copies handy.
              </p>
            </div>
            {firstPropertyMissingDocs ? (
              <Link
                href={`/owner/properties/${firstPropertyMissingDocs.id}`}
                className="shrink-0 rounded-md border border-amber-700 bg-white px-3 py-1.5 text-sm font-medium text-amber-900 hover:bg-amber-100"
              >
                {propertiesMissingDocs.length === 1
                  ? "Open property"
                  : "Open first property"}
              </Link>
            ) : null}
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
                review and sign. Your statements and payouts depend on
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

      {/* Headline earnings card. Anchors the dashboard at the
          top because "what did I make and is it growing" is the
          single question every owner opens this page to answer.
          The portfolio list directly below answers the natural
          follow-on ("what is producing this?"); the KPI tiles
          and per-currency breakdown sit further down as
          operational detail. */}
      {primary ? (
        <EarningsOverview
          primary={primary}
          otherCurrencyCount={otherCurrencyCount}
          expectedThisMonth={expectedThisMonth}
          activeLeaseCount={activeLeaseCount}
          windowStart={twelveMonthsAgo}
          windowEnd={now}
        />
      ) : (
        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <h2 className="text-base font-medium text-stone-900">
            Your earnings
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            No transactions recorded in the last 12 months. Once
            Goldstay logs your first rent collection or expense, the
            running totals and trend chart will appear here.
          </p>
        </section>
      )}

      {/* Portfolio — what's behind the earnings number. Sits
          directly under the headline so the reading order is
          "result -> what produced it". Full width because the
          per-row readiness summary needs room to breathe; the
          previous 2-col layout cramped it next to the activity
          feed. */}
      <section className="rounded-lg border border-stone-200 bg-white p-6">
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
              // We have agreement-pending state owner-wide; this
              // narrows it to "is there one for *this* property".
              const hasPendingAgreement = pendingAgreements.some(
                (a) => a.property.id === p.id,
              );
              const readiness = computePropertyReadiness({
                propertyStatus: p.status,
                hasPendingAgreement,
                setupComplete,
              });
              return (
                <li key={p.id} className="py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/owner/properties/${p.id}`}
                        className="font-medium text-stone-900 hover:underline"
                      >
                        {formatPropertyDisplayName(p.name, p.unitNumber)}
                      </Link>
                      <p className="text-xs text-stone-500">
                        {p.neighbourhood ? `${p.neighbourhood}, ` : ""}
                        {p.city}
                        {readiness.isActive ? (
                          <> · {occupied ? "Occupied" : "Vacant"}</>
                        ) : null}
                      </p>
                    </div>
                    <PropertyReadinessBadge
                      status={p.status}
                      ownerSideDone={readiness.ownerSideDone}
                    />
                  </div>
                  <PropertyReadinessSummary readiness={readiness} />
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Secondary operational KPIs — 30-day run-rate (with the
          prior-period delta), property count, and occupancy. Net
          last 12 months is not duplicated here; it lives in the
          headline card above. */}
      <section className="grid gap-4 sm:grid-cols-3">
        <KpiCard
          label="Net last 30 days"
          value={
            primary
              ? `${primary.currency} ${fmt(primary.thirtyDayNet)}`
              : "No activity yet"
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
          value={occupancyPct === null ? "No units" : `${occupancyPct}%`}
          sub={
            activeLeaseCount === 0
              ? "No active leases yet"
              : `${activeLeaseCount} active ${
                  activeLeaseCount === 1 ? "lease" : "leases"
                }`
          }
        />
      </section>

      {/* Per-currency breakdown is only useful when there are at
          least two currencies in the ledger — for the single-
          currency case the headline card already gives the
          definitive number. Hidden otherwise to keep the
          dashboard from sprawling. */}
      {currencyRows.length > 1 ? (
        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium text-stone-900">
              By currency
            </h2>
            <HelpHint label="By currency">
              Owners with portfolios across Kenya, Ghana and the
              diaspora often collect in more than one currency. We
              never auto-FX between them. Each row is the real
              total in that currency.
            </HelpHint>
          </div>
          <div className="mt-4 overflow-hidden rounded-md border border-stone-200">
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
        </section>
      ) : null}

      {/* Recent activity — drill-down ledger preview. Full width
          because it's the last section before /owner/statements,
          and the previous 2-col layout pinched the property-name
          column on long property names. */}
      <section className="rounded-lg border border-stone-200 bg-white p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium text-stone-900">
              Recent activity
            </h2>
            <HelpHint label="Recent activity">
              Every rent payment, expense, refund and payout, all
              the numbers behind your statement. Filter by property
              and month, or download the signed monthly PDF, on
              the Statements page.
            </HelpHint>
          </div>
          <Link
            href="/owner/statements"
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

// English-style joiner: ["a"] → "a"; ["a","b"] → "a and b";
// ["a","b","c"] → "a, b and c". Used by the documents banner so a
// future addition to REQUIRED_PROPERTY_DOC_KINDS reads cleanly
// without the banner copy needing to change.
function humanJoin(items: ReadonlyArray<string>): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0]!;
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}
