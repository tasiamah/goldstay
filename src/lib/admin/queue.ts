// Attention queue.
//
// Single read-side aggregator that drives the admin overview page.
// Each bucket is a small array of {id, label, href} pairs we can
// render as a clickable list, plus a count for the bucket header.
// We keep the buckets pure and well-typed so the UI doesn't need
// to know the underlying Prisma shape.
//
// The buckets are ranked by "what would a careful operator look at
// first thing in the morning?":
//
//   1. Pending property verifications  → on-platform but not live yet
//   2. Unsigned management agreements  → revenue blocked behind ink
//   3. Bookings missing financials     → calendar holds we imported
//                                        from iCal that still need
//                                        gross / net entered
//   4. Failed iCal feeds               → silent breakage of occupancy
//   5. Owners missing payout method    → can't actually pay them when
//                                        the next statement runs
//   6. Leases expiring soon            → renewal radar (next 60 days)
//   7. Stale welcomes                  → owners we created days ago
//                                        who never logged in
//   8. My overdue tasks                → personal queue
//
// All Prisma queries filter `archivedAt: null` so soft-deleted rows
// never surface in the queue.

import { prisma } from "@/lib/db";
import { formatOwnerDisplayName } from "@/lib/format-owner";
import { formatPropertyDisplayName } from "@/lib/format-property";
import type { AdminUser } from "@prisma/client";

export type QueueItem = {
  id: string;
  label: string;
  href: string;
  // Optional secondary line (city, owner, etc.) so the operator can
  // disambiguate without opening every link.
  hint?: string;
};

export type QueueBucket = {
  key: string;
  title: string;
  description: string;
  items: QueueItem[];
  total: number;
};

export type AttentionQueue = {
  buckets: QueueBucket[];
  totalItems: number;
};

const PER_BUCKET_LIMIT = 5;

// Owners we created more than this many days ago that still have
// `welcomeCompletedAt: null`. Long enough that "they're on holiday"
// is not the explanation; short enough that we can still recover.
const STALE_WELCOME_DAYS = 3;

// How far ahead we look for lease renewals on the radar bucket.
// 60 days is enough to give an operator a real heads-up: at 30 days
// the conversation is rushed; at 90 the tenant hasn't started
// thinking about it yet. This number falls neatly between the two.
const LEASE_EXPIRING_WINDOW_DAYS = 60;

export async function getAttentionQueue(
  admin: AdminUser,
): Promise<AttentionQueue> {
  const countryFilter =
    admin.role === "COUNTRY_MANAGER" && admin.country
      ? { country: admin.country }
      : {};

  // Window used by the "leases expiring" bucket. Computed once so
  // the query and the bucket label agree on the same boundary.
  const expiringWindowEnd = new Date(
    Date.now() + LEASE_EXPIRING_WINDOW_DAYS * 24 * 60 * 60 * 1000,
  );

  const [
    pendingProperties,
    pendingPropertiesTotal,
    unsignedAgreements,
    unsignedAgreementsTotal,
    bookingsMissingFinancials,
    bookingsMissingFinancialsTotal,
    failedFeeds,
    failedFeedsTotal,
    ownersMissingPayoutMethod,
    ownersMissingPayoutMethodTotal,
    expiringLeases,
    expiringLeasesTotal,
    staleOwners,
    staleOwnersTotal,
    myTasks,
    myTasksTotal,
  ] = await Promise.all([
    prisma.property.findMany({
      where: {
        archivedAt: null,
        status: "ONBOARDING",
        ...countryFilter,
      },
      orderBy: { createdAt: "asc" },
      take: PER_BUCKET_LIMIT,
      select: {
        id: true,
        name: true,
        unitNumber: true,
        city: true,
        owner: { select: { fullName: true, companyName: true } },
      },
    }),
    prisma.property.count({
      where: {
        archivedAt: null,
        status: "ONBOARDING",
        ...countryFilter,
      },
    }),
    prisma.managementAgreement.findMany({
      where: {
        status: { in: ["DRAFT", "SENT"] },
        property: { archivedAt: null, ...countryFilter },
      },
      orderBy: { generatedAt: "asc" },
      take: PER_BUCKET_LIMIT,
      select: {
        id: true,
        status: true,
        property: {
          select: {
            id: true,
            name: true,
            unitNumber: true,
            owner: { select: { fullName: true, companyName: true } },
          },
        },
      },
    }),
    prisma.managementAgreement.count({
      where: {
        status: { in: ["DRAFT", "SENT"] },
        property: { archivedAt: null, ...countryFilter },
      },
    }),
    // Calendar-only iCal imports leave a 0 grossAmount placeholder.
    // These are bookings the operator needs to backfill from the OTA.
    prisma.booking.findMany({
      where: {
        grossAmount: 0,
        status: "CONFIRMED",
        property: { archivedAt: null, ...countryFilter },
      },
      orderBy: { checkIn: "asc" },
      take: PER_BUCKET_LIMIT,
      select: {
        id: true,
        guestName: true,
        checkIn: true,
        property: {
          select: {
            id: true,
            name: true,
            unitNumber: true,
            city: true,
          },
        },
      },
    }),
    prisma.booking.count({
      where: {
        grossAmount: 0,
        status: "CONFIRMED",
        property: { archivedAt: null, ...countryFilter },
      },
    }),
    prisma.propertyIcalFeed.findMany({
      where: {
        lastError: { not: null },
        property: { archivedAt: null, ...countryFilter },
      },
      orderBy: { lastSyncedAt: "desc" },
      take: PER_BUCKET_LIMIT,
      select: {
        id: true,
        source: true,
        lastError: true,
        property: {
          select: {
            id: true,
            name: true,
            unitNumber: true,
            city: true,
          },
        },
      },
    }),
    prisma.propertyIcalFeed.count({
      where: {
        lastError: { not: null },
        property: { archivedAt: null, ...countryFilter },
      },
    }),
    // Owners with at least one live property but no verified payout
    // method on file. These are the cases where statement-day will
    // hit and we'll have nowhere to send the money — by far the most
    // common cause of an embarrassing "where's my rent?" email.
    // We require an active property so we don't flag prospects we
    // haven't even started managing yet.
    prisma.owner.findMany({
      where: {
        archivedAt: null,
        ...countryFilter,
        // Require at least one live property so we don't flag fresh
        // prospects we haven't actually started managing yet.
        properties: { some: { archivedAt: null } },
        // Empty-relation match: every payout method is either
        // archived or unverified. Mirrors what statement generation
        // actually checks before deciding it can pay out.
        payoutMethods: {
          none: {
            archivedAt: null,
            verifiedAt: { not: null },
          },
        },
      },
      orderBy: { createdAt: "asc" },
      take: PER_BUCKET_LIMIT,
      select: {
        id: true,
        fullName: true,
        companyName: true,
        email: true,
        country: true,
      },
    }),
    prisma.owner.count({
      where: {
        archivedAt: null,
        ...countryFilter,
        properties: { some: { archivedAt: null } },
        payoutMethods: {
          none: {
            archivedAt: null,
            verifiedAt: { not: null },
          },
        },
      },
    }),
    // Active leases whose endDate is between today and +60d. We
    // surface these so renewals are a planned conversation, not an
    // accidental month-to-month rollover. Open-ended leases
    // (endDate: null) are intentionally excluded — they're not
    // "expiring" in any operational sense.
    prisma.lease.findMany({
      where: {
        archivedAt: null,
        status: "ACTIVE",
        endDate: { gte: new Date(), lte: expiringWindowEnd },
        unit: {
          property: { archivedAt: null, ...countryFilter },
        },
      },
      orderBy: { endDate: "asc" },
      take: PER_BUCKET_LIMIT,
      select: {
        id: true,
        tenantName: true,
        endDate: true,
        unit: {
          select: {
            property: {
              select: {
                id: true,
                name: true,
                unitNumber: true,
                city: true,
              },
            },
          },
        },
      },
    }),
    prisma.lease.count({
      where: {
        archivedAt: null,
        status: "ACTIVE",
        endDate: { gte: new Date(), lte: expiringWindowEnd },
        unit: {
          property: { archivedAt: null, ...countryFilter },
        },
      },
    }),
    prisma.owner.findMany({
      where: {
        archivedAt: null,
        welcomeCompletedAt: null,
        createdAt: { lte: daysAgo(STALE_WELCOME_DAYS) },
        ...countryFilter,
      },
      orderBy: { createdAt: "asc" },
      take: PER_BUCKET_LIMIT,
      select: {
        id: true,
        fullName: true,
        companyName: true,
        email: true,
        country: true,
        createdAt: true,
      },
    }),
    prisma.owner.count({
      where: {
        archivedAt: null,
        welcomeCompletedAt: null,
        createdAt: { lte: daysAgo(STALE_WELCOME_DAYS) },
        ...countryFilter,
      },
    }),
    prisma.task.findMany({
      where: {
        assigneeAdminId: admin.id,
        completedAt: null,
        dueAt: { lte: new Date() },
      },
      orderBy: { dueAt: "asc" },
      take: PER_BUCKET_LIMIT,
      select: {
        id: true,
        title: true,
        dueAt: true,
        entity: true,
        entityId: true,
      },
    }),
    prisma.task.count({
      where: {
        assigneeAdminId: admin.id,
        completedAt: null,
        dueAt: { lte: new Date() },
      },
    }),
  ]);

  const buckets: QueueBucket[] = [];

  buckets.push({
    key: "pending-verifications",
    title: "Properties pending verification",
    description:
      "Onboarded but not yet live. Verify the basics, then promote to ACTIVE.",
    total: pendingPropertiesTotal,
    items: pendingProperties.map((p) => ({
      id: p.id,
      label: formatPropertyDisplayName(p.name, p.unitNumber),
      href: `/admin/properties/${p.id}`,
      hint: `${p.city} · ${formatOwnerDisplayName(p.owner)}`,
    })),
  });

  buckets.push({
    key: "unsigned-agreements",
    title: "Unsigned management agreements",
    description:
      "Generated or sent but not yet signed. Revenue is blocked until ink lands.",
    total: unsignedAgreementsTotal,
    items: unsignedAgreements.map((a) => ({
      id: a.id,
      label: formatPropertyDisplayName(
        a.property.name,
        a.property.unitNumber,
      ),
      href: `/admin/properties/${a.property.id}/agreement`,
      hint: `${a.status === "SENT" ? "Sent · awaiting signature" : "Draft"} · ${formatOwnerDisplayName(a.property.owner)}`,
    })),
  });

  buckets.push({
    key: "bookings-missing-financials",
    title: "Bookings missing financials",
    description:
      "Imported from an iCal feed without amounts. Backfill gross + net from the OTA.",
    total: bookingsMissingFinancialsTotal,
    items: bookingsMissingFinancials.map((b) => ({
      id: b.id,
      label: `${b.guestName || "Guest"} · ${b.checkIn.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`,
      href: `/admin/bookings/${b.id}`,
      hint: `${formatPropertyDisplayName(b.property.name, b.property.unitNumber)} · ${b.property.city}`,
    })),
  });

  buckets.push({
    key: "failed-ical-feeds",
    title: "iCal feeds failing",
    description:
      "Calendar sync errored out. Property occupancy will drift until fixed.",
    total: failedFeedsTotal,
    items: failedFeeds.map((f) => ({
      id: f.id,
      label: `${formatPropertyDisplayName(f.property.name, f.property.unitNumber)} · ${f.source}`,
      href: `/admin/properties/${f.property.id}/ical`,
      hint: f.lastError?.slice(0, 80) ?? undefined,
    })),
  });

  buckets.push({
    key: "owners-no-payout-method",
    title: "Owners with no verified payout method",
    description:
      "Active landlords we can't actually pay. Statement-day will fail until a verified method lands.",
    total: ownersMissingPayoutMethodTotal,
    items: ownersMissingPayoutMethod.map((o) => ({
      id: o.id,
      label: formatOwnerDisplayName(o),
      href: `/admin/owners/${o.id}/payouts`,
      hint: `${o.email} · ${o.country === "KE" ? "Kenya" : "Ghana"}`,
    })),
  });

  buckets.push({
    key: "leases-expiring-soon",
    title: `Leases expiring in ${LEASE_EXPIRING_WINDOW_DAYS} days`,
    description:
      "Renewal radar. Reach out before they roll month-to-month or vacate without a heads-up.",
    total: expiringLeasesTotal,
    items: expiringLeases.map((l) => ({
      id: l.id,
      label: `${l.tenantName} · ${formatPropertyDisplayName(l.unit.property.name, l.unit.property.unitNumber)}`,
      href: `/admin/leases/${l.id}`,
      hint: l.endDate
        ? `Ends ${l.endDate.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })} · ${daysUntil(l.endDate)}d left`
        : undefined,
    })),
  });

  buckets.push({
    key: "stale-welcomes",
    title: "Owners who never logged in",
    description: `Created ${STALE_WELCOME_DAYS}+ days ago, welcome card never dismissed. Resend the magic link.`,
    total: staleOwnersTotal,
    items: staleOwners.map((o) => ({
      id: o.id,
      label: formatOwnerDisplayName(o),
      href: `/admin/owners/${o.id}`,
      hint: `${o.email} · ${o.country === "KE" ? "Kenya" : "Ghana"}`,
    })),
  });

  buckets.push({
    key: "my-overdue-tasks",
    title: "My overdue tasks",
    description: "Tasks assigned to you with a past due date.",
    total: myTasksTotal,
    items: myTasks.map((t) => ({
      id: t.id,
      label: t.title,
      href:
        t.entity && t.entityId
          ? entityHref(t.entity, t.entityId)
          : "/admin/tasks",
      hint: t.dueAt
        ? `Due ${t.dueAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })}`
        : undefined,
    })),
  });

  return {
    buckets,
    totalItems: buckets.reduce((sum, b) => sum + b.total, 0),
  };
}

// ---------- Multi-currency totals ----------
//
// We deliberately do NOT convert across currencies — KES and GHS rates
// move enough that a stitched-together "USD GMV" number invites bad
// decisions. Instead we sum within each currency and let the operator
// see the whole picture at a glance.

export type CurrencyTotal = {
  currency: string;
  inflow: number;
  outflow: number;
  net: number;
};

export async function getMonthlyTotals(now: Date = new Date()): Promise<{
  monthLabel: string;
  totals: CurrencyTotal[];
}> {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const grouped = await prisma.transaction.groupBy({
    by: ["currency", "direction"],
    where: {
      archivedAt: null,
      occurredOn: { gte: monthStart, lt: monthEnd },
    },
    _sum: { amount: true },
  });

  const byCurrency = new Map<string, CurrencyTotal>();
  for (const row of grouped) {
    const t =
      byCurrency.get(row.currency) ??
      ({
        currency: row.currency,
        inflow: 0,
        outflow: 0,
        net: 0,
      } satisfies CurrencyTotal);
    const amount = Number(row._sum.amount ?? 0);
    if (row.direction === "INFLOW") t.inflow += amount;
    else t.outflow += amount;
    t.net = t.inflow - t.outflow;
    byCurrency.set(row.currency, t);
  }

  return {
    monthLabel: monthStart.toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
    }),
    totals: [...byCurrency.values()].sort((a, b) =>
      a.currency.localeCompare(b.currency),
    ),
  };
}

// ---------- Overview KPIs ----------
//
// The morning-glance set. Six numbers an operator should be able to
// open the dashboard, scan, and instantly answer "is the business
// going well today?":
//
//   1. Occupancy %        — units leased / total units (the headline)
//   2. Vacant units       — actionable subset of #1
//   3. New leads MTD      — top of funnel + delta vs prior month
//   4. New owners MTD     — bottom of funnel proxy + delta vs prior
//   5. Active referrers   — channel health (the new acquisition rail)
//   6. Referrals signed   — channel output, MTD
//
// All of it country-scoped for COUNTRY_MANAGER admins so a Kenya
// manager doesn't see Ghana's pipeline polluting their numbers, and
// vice versa. SUPER_ADMIN sees the global view.
//
// Single Promise.all so the page stays one round-trip. Counts only —
// no .findMany() — keeps Postgres happy even as the data grows.

export type DeltaDirection = "up" | "down" | "flat";

export type Delta = {
  current: number;
  prior: number;
  // Percentage change vs prior period. `null` when prior is 0 to
  // avoid the div-by-zero "+infinity%" rendering trap.
  pct: number | null;
  direction: DeltaDirection;
};

export type OverviewKpis = {
  occupancy: {
    leasedUnits: number;
    totalUnits: number;
    pct: number | null; // null when totalUnits === 0
  };
  vacantUnits: number;
  leads: Delta;
  owners: Delta;
  activeReferrers: number;
  referralsSignedThisMonth: number;
  // ---- Growth & funnel (rendered as a second strip on /admin) ----
  // Conversion of leads → owners over a rolling 30-day window. Same
  // cohort in numerator and denominator (leads created in the window)
  // so the rate is attributable. The lag from leads created in the
  // last few days that haven't had time to convert pulls the number
  // down a little; that's noise we accept rather than papering over.
  leadConversion: {
    leadsCreated: number;
    leadsConverted: number;
    pct: number | null; // null when leadsCreated === 0
  };
  // Mean days from Lead.createdAt → Lead.convertedAt for leads
  // converted in the last 30 days. We use the mean (not median)
  // because the cohort is small in early months and a percentile
  // calc adds machinery without earning anything. `null` when
  // nobody converted in the window.
  avgDaysToConvert: number | null;
  // Properties added this month vs prior month — pure growth signal.
  properties: Delta;
  // Owners archived this month vs prior — churn signal. `up` here is
  // a *bad* thing and the strip surfaces that with a coloured badge
  // anyway; the operator will know what they're looking at.
  ownerChurn: Delta;
};

export async function getOverviewKpis(
  admin: AdminUser,
): Promise<OverviewKpis> {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  const priorMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const propertyCountryFilter =
    admin.role === "COUNTRY_MANAGER" && admin.country
      ? { country: admin.country }
      : {};

  // Lead.country is a Country? enum; we filter the same way as
  // Property.country. Owners don't carry a direct country column but
  // they're scoped through their leads/properties; for the overview
  // KPI we count *new* owners by createdAt and accept the small
  // imprecision that an owner created without any property yet won't
  // be country-attributable. In practice ops creates an owner with
  // a property in the same flow.
  const leadCountryFilter =
    admin.role === "COUNTRY_MANAGER" && admin.country
      ? { country: admin.country }
      : {};

  // Owner has no country column — country attribution lives on the
  // owner's properties. For COUNTRY_MANAGER we narrow to owners with
  // at least one property in their country so the "new owners" delta
  // doesn't double-count cross-country owners under both managers.
  const ownerCountryFilter =
    admin.role === "COUNTRY_MANAGER" && admin.country
      ? { properties: { some: { country: admin.country } } }
      : {};

  const thirtyDaysAgo = daysAgo(30, now);

  const [
    leasedUnits,
    totalUnits,
    leadsThisMonth,
    leadsPriorMonth,
    ownersThisMonth,
    ownersPriorMonth,
    activeReferrers,
    referralsSignedThisMonth,
    leadsCreatedLast30,
    leadsConvertedFromCohort,
    convertedRecently,
    propertiesThisMonth,
    propertiesPriorMonth,
    ownersChurnedThisMonth,
    ownersChurnedPriorMonth,
  ] = await Promise.all([
    // Occupancy numerator: distinct units with at least one ACTIVE
    // lease today. We count units (not leases) because a unit
    // briefly owning two ACTIVE rows mid-renewal would otherwise
    // overstate occupancy.
    prisma.unit.count({
      where: {
        property: { archivedAt: null, ...propertyCountryFilter },
        leases: { some: { status: "ACTIVE", archivedAt: null } },
      },
    }),
    prisma.unit.count({
      where: {
        property: { archivedAt: null, ...propertyCountryFilter },
      },
    }),
    prisma.lead.count({
      where: {
        createdAt: { gte: monthStart, lt: monthEnd },
        ...leadCountryFilter,
      },
    }),
    prisma.lead.count({
      where: {
        createdAt: { gte: priorMonthStart, lt: monthStart },
        ...leadCountryFilter,
      },
    }),
    prisma.owner.count({
      where: {
        archivedAt: null,
        createdAt: { gte: monthStart, lt: monthEnd },
        ...ownerCountryFilter,
      },
    }),
    prisma.owner.count({
      where: {
        archivedAt: null,
        createdAt: { gte: priorMonthStart, lt: monthStart },
        ...ownerCountryFilter,
      },
    }),
    // Referrers and referrals are not country-scoped: a UK-based
    // agent may bring deals in either market. The dashboard owner
    // is global-by-default for this rail.
    prisma.referrer.count({ where: { status: "ACTIVE", archivedAt: null } }),
    prisma.referral.count({
      where: { signedAt: { gte: monthStart, lt: monthEnd } },
    }),
    // ---- Conversion-funnel inputs ----
    // Same-cohort numerator & denominator: leads created in the
    // rolling 30-day window, and the subset that have converted
    // (at any later point — usually within the same window). Avoids
    // the classic dashboard lie of "this month's signed / this
    // month's leads" which mixes cohorts of different ages.
    prisma.lead.count({
      where: {
        archivedAt: null,
        createdAt: { gte: thirtyDaysAgo },
        ...leadCountryFilter,
      },
    }),
    prisma.lead.count({
      where: {
        archivedAt: null,
        createdAt: { gte: thirtyDaysAgo },
        convertedAt: { not: null },
        ...leadCountryFilter,
      },
    }),
    // For avg-days-to-convert we need the actual timestamp pairs.
    // Bounded to leads converted in the last 30 days so the query
    // stays tiny even at full scale; ops cares about *recent*
    // velocity, not all-time.
    prisma.lead.findMany({
      where: {
        archivedAt: null,
        convertedAt: { gte: thirtyDaysAgo, not: null },
        ...leadCountryFilter,
      },
      select: { createdAt: true, convertedAt: true },
    }),
    prisma.property.count({
      where: {
        archivedAt: null,
        createdAt: { gte: monthStart, lt: monthEnd },
        ...propertyCountryFilter,
      },
    }),
    prisma.property.count({
      where: {
        archivedAt: null,
        createdAt: { gte: priorMonthStart, lt: monthStart },
        ...propertyCountryFilter,
      },
    }),
    // Churn: owners *archived* this month. We don't apply the
    // ownerCountryFilter because an archived owner with no
    // remaining properties has no country attribution path. The
    // small over-counting risk for COUNTRY_MANAGER is preferable
    // to silently dropping churn events from their view.
    prisma.owner.count({
      where: { archivedAt: { gte: monthStart, lt: monthEnd } },
    }),
    prisma.owner.count({
      where: { archivedAt: { gte: priorMonthStart, lt: monthStart } },
    }),
  ]);

  const avgDaysToConvert = meanDaysBetween(
    convertedRecently.map((l) => ({
      from: l.createdAt,
      to: l.convertedAt!,
    })),
  );

  return {
    occupancy: {
      leasedUnits,
      totalUnits,
      pct: totalUnits === 0 ? null : (leasedUnits / totalUnits) * 100,
    },
    vacantUnits: Math.max(0, totalUnits - leasedUnits),
    leads: computeDelta(leadsThisMonth, leadsPriorMonth),
    owners: computeDelta(ownersThisMonth, ownersPriorMonth),
    activeReferrers,
    referralsSignedThisMonth,
    leadConversion: {
      leadsCreated: leadsCreatedLast30,
      leadsConverted: leadsConvertedFromCohort,
      pct:
        leadsCreatedLast30 === 0
          ? null
          : (leadsConvertedFromCohort / leadsCreatedLast30) * 100,
    },
    avgDaysToConvert,
    properties: computeDelta(propertiesThisMonth, propertiesPriorMonth),
    ownerChurn: computeDelta(ownersChurnedThisMonth, ownersChurnedPriorMonth),
  };
}

// Mean number of whole days between paired timestamps. Returns null
// for an empty input so the caller can render a friendly empty-state
// label instead of "NaN days". Pure — no Prisma — and trivially
// testable.
export function meanDaysBetween(
  pairs: { from: Date; to: Date }[],
): number | null {
  if (pairs.length === 0) return null;
  const totalMs = pairs.reduce(
    (sum, p) => sum + (p.to.getTime() - p.from.getTime()),
    0,
  );
  return totalMs / pairs.length / 86_400_000;
}

// Pure delta calculator. Extracted from the aggregator above so the
// edge cases (zero prior, equal periods, negative movements) are
// trivially testable without standing up Prisma. Direction is what
// the UI uses to colour the badge — pct is what it prints.
export function computeDelta(current: number, prior: number): Delta {
  if (prior === 0) {
    return {
      current,
      prior,
      pct: null,
      direction: current > 0 ? "up" : "flat",
    };
  }
  const pct = ((current - prior) / prior) * 100;
  const direction: DeltaDirection =
    pct > 0 ? "up" : pct < 0 ? "down" : "flat";
  return { current, prior, pct, direction };
}

// ---------- Pure helpers ----------

export function daysAgo(days: number, from: Date = new Date()): Date {
  return new Date(from.getTime() - days * 24 * 60 * 60 * 1000);
}

// Whole days from `now` to `target`, rounded up so a lease ending
// in 6 hours still reads as "1d left" rather than "0d". Pure helper
// surfaced for unit testing of the expiring-leases bucket.
export function daysUntil(target: Date, now: Date = new Date()): number {
  const ms = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
}

function entityHref(entity: string, id: string): string {
  switch (entity) {
    case "OWNER":
      return `/admin/owners/${id}`;
    case "PROPERTY":
      return `/admin/properties/${id}`;
    case "LEASE":
      return `/admin/leases/${id}`;
    case "BOOKING":
      return `/admin/bookings/${id}`;
    case "TRANSACTION":
      return `/admin/transactions/${id}`;
    case "AGREEMENT":
      return `/admin/properties/${id}/agreement`;
    case "DOCUMENT":
      return `/admin/properties/${id}/documents`;
    case "LEAD":
      return `/admin/leads/${id}`;
    default:
      return "/admin";
  }
}
