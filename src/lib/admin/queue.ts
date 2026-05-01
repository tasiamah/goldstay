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
//   5. Stale welcomes                  → owners we created days ago
//                                        who never logged in
//   6. My overdue tasks                → personal queue
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

export async function getAttentionQueue(
  admin: AdminUser,
): Promise<AttentionQueue> {
  const countryFilter =
    admin.role === "COUNTRY_MANAGER" && admin.country
      ? { country: admin.country }
      : {};

  const [
    pendingProperties,
    pendingPropertiesTotal,
    unsignedAgreements,
    unsignedAgreementsTotal,
    bookingsMissingFinancials,
    bookingsMissingFinancialsTotal,
    failedFeeds,
    failedFeedsTotal,
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

// ---------- Pure helpers ----------

export function daysAgo(days: number, from: Date = new Date()): Date {
  return new Date(from.getTime() - days * 24 * 60 * 60 * 1000);
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
