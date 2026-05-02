// Unified admin search.
//
// One DB hop returns the top ~10 hits per entity for a free-text
// query, ranked roughly by name / address / reference match. We
// return slim dataset shapes (label + secondary line + href + entity
// kind) so the UI doesn't need to know the underlying Prisma models.
//
// Country-managers only see their country (admin.country) — same
// scoping the rest of the admin surface uses.

import { prisma } from "@/lib/db";
import { formatOwnerDisplayName } from "@/lib/format-owner";
import { formatPropertyDisplayName } from "@/lib/format-property";
import type { AdminUser, Country } from "@prisma/client";

export type SearchEntity =
  | "owner"
  | "property"
  | "lease"
  | "booking"
  | "transaction"
  | "document"
  | "lead";

export type SearchHit = {
  id: string;
  entity: SearchEntity;
  label: string;
  hint?: string;
  href: string;
};

export type SearchResults = {
  hits: SearchHit[];
  // Caller can use this to render a "limited to your country" badge.
  scopedCountry: Country | null;
};

const PER_ENTITY_LIMIT = 5;

export async function adminSearch(
  rawQuery: string,
  admin: AdminUser,
): Promise<SearchResults> {
  const q = rawQuery.trim();
  if (q.length < 2) {
    return { hits: [], scopedCountry: scopedCountryFor(admin) };
  }

  const country = scopedCountryFor(admin);
  const countryFilter = country ? { country } : {};
  const propertyCountryFilter = country
    ? { property: { country } }
    : {};

  const [
    owners,
    properties,
    leases,
    bookings,
    transactions,
    documents,
    leads,
  ] = await Promise.all([
    prisma.owner.findMany({
      where: {
        archivedAt: null,
        ...countryFilter,
        OR: [
          { fullName: { contains: q, mode: "insensitive" } },
          { companyName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { phone: { contains: q, mode: "insensitive" } },
        ],
      },
      take: PER_ENTITY_LIMIT,
      select: {
        id: true,
        fullName: true,
        companyName: true,
        email: true,
        country: true,
      },
    }),
    prisma.property.findMany({
      where: {
        archivedAt: null,
        ...countryFilter,
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { unitNumber: { contains: q, mode: "insensitive" } },
          { address: { contains: q, mode: "insensitive" } },
          { neighbourhood: { contains: q, mode: "insensitive" } },
          { city: { contains: q, mode: "insensitive" } },
        ],
      },
      take: PER_ENTITY_LIMIT,
      select: {
        id: true,
        name: true,
        unitNumber: true,
        city: true,
        neighbourhood: true,
        owner: { select: { fullName: true, companyName: true } },
      },
    }),
    prisma.lease.findMany({
      where: {
        archivedAt: null,
        OR: [
          { tenantName: { contains: q, mode: "insensitive" } },
          { tenantEmail: { contains: q, mode: "insensitive" } },
          { tenantPhone: { contains: q, mode: "insensitive" } },
        ],
        ...(country
          ? { unit: { property: { country } } }
          : {}),
      },
      take: PER_ENTITY_LIMIT,
      select: {
        id: true,
        tenantName: true,
        tenantEmail: true,
        unit: {
          select: {
            label: true,
            property: {
              select: {
                id: true,
                name: true,
                unitNumber: true,
              },
            },
          },
        },
      },
    }),
    prisma.booking.findMany({
      where: {
        OR: [
          { guestName: { contains: q, mode: "insensitive" } },
          { guestEmail: { contains: q, mode: "insensitive" } },
          { externalId: { contains: q, mode: "insensitive" } },
        ],
        ...propertyCountryFilter,
      },
      take: PER_ENTITY_LIMIT,
      orderBy: { checkIn: "desc" },
      select: {
        id: true,
        guestName: true,
        checkIn: true,
        checkOut: true,
        property: {
          select: {
            id: true,
            name: true,
            unitNumber: true,
          },
        },
      },
    }),
    prisma.transaction.findMany({
      where: {
        archivedAt: null,
        OR: [
          { reference: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
        ...propertyCountryFilter,
      },
      take: PER_ENTITY_LIMIT,
      orderBy: { occurredOn: "desc" },
      select: {
        id: true,
        reference: true,
        description: true,
        amount: true,
        currency: true,
        occurredOn: true,
        property: {
          select: { id: true, name: true, unitNumber: true },
        },
      },
    }),
    prisma.document.findMany({
      where: {
        title: { contains: q, mode: "insensitive" },
        ...(country
          ? {
              OR: [
                { property: { country } },
                { owner: { country } },
              ],
            }
          : {}),
      },
      take: PER_ENTITY_LIMIT,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        kind: true,
        propertyId: true,
        ownerId: true,
        property: { select: { name: true, unitNumber: true } },
        owner: { select: { fullName: true, companyName: true } },
      },
    }),
    safeLeadSearch(q, country),
  ]);

  const hits: SearchHit[] = [];

  for (const o of owners) {
    hits.push({
      id: o.id,
      entity: "owner",
      label: formatOwnerDisplayName(o),
      hint: `${o.email} · ${o.country}`,
      href: `/admin/owners/${o.id}`,
    });
  }

  for (const p of properties) {
    hits.push({
      id: p.id,
      entity: "property",
      label: formatPropertyDisplayName(p.name, p.unitNumber),
      hint: `${p.neighbourhood ? `${p.neighbourhood}, ` : ""}${p.city} · ${formatOwnerDisplayName(p.owner)}`,
      href: `/admin/properties/${p.id}`,
    });
  }

  for (const l of leases) {
    hits.push({
      id: l.id,
      entity: "lease",
      label: l.tenantName,
      hint: `${formatPropertyDisplayName(l.unit.property.name, l.unit.property.unitNumber)} · ${l.unit.label}`,
      href: `/admin/leases/${l.id}`,
    });
  }

  for (const b of bookings) {
    hits.push({
      id: b.id,
      entity: "booking",
      label: `${b.guestName} · ${formatDate(b.checkIn)} → ${formatDate(b.checkOut)}`,
      hint: formatPropertyDisplayName(b.property.name, b.property.unitNumber),
      href: `/admin/bookings/${b.id}`,
    });
  }

  for (const t of transactions) {
    hits.push({
      id: t.id,
      entity: "transaction",
      label:
        t.description ||
        t.reference ||
        `${t.currency} ${t.amount.toString()}`,
      hint: `${formatDate(t.occurredOn)} · ${formatPropertyDisplayName(t.property.name, t.property.unitNumber)}`,
      href: `/admin/transactions/${t.id}`,
    });
  }

  for (const d of documents) {
    const parentLabel = d.property
      ? formatPropertyDisplayName(d.property.name, d.property.unitNumber)
      : d.owner
        ? formatOwnerDisplayName(d.owner)
        : "Unattached";
    const href = d.propertyId
      ? `/admin/properties/${d.propertyId}/documents`
      : d.ownerId
        ? `/admin/owners/${d.ownerId}`
        : "/admin";
    hits.push({
      id: d.id,
      entity: "document",
      label: d.title,
      hint: `${String(d.kind)} · ${parentLabel}`,
      href,
    });
  }

  for (const lead of leads) {
    hits.push(lead);
  }

  return { hits, scopedCountry: country };
}

// Country managers see only their country; everyone else sees both.
export function scopedCountryFor(admin: AdminUser): Country | null {
  if (admin.role === "COUNTRY_MANAGER" && admin.country) return admin.country;
  return null;
}

// Lead model may not exist on every branch (it was added by parallel
// work). Defensive lookup so the search route still works even if the
// generated client doesn't carry a lead delegate.
async function safeLeadSearch(
  q: string,
  country: Country | null,
): Promise<SearchHit[]> {
  const client = prisma as unknown as {
    lead?: {
      findMany: (args: unknown) => Promise<
        Array<{
          id: string;
          fullName: string;
          email: string | null;
          companyName: string | null;
        }>
      >;
    };
  };
  if (!client.lead) return [];
  try {
    const leads = await client.lead.findMany({
      where: {
        ...(country ? { country } : {}),
        OR: [
          { fullName: { contains: q, mode: "insensitive" } },
          { email: { contains: q, mode: "insensitive" } },
          { companyName: { contains: q, mode: "insensitive" } },
        ],
      },
      take: PER_ENTITY_LIMIT,
      select: {
        id: true,
        fullName: true,
        email: true,
        companyName: true,
      },
    });
    return leads.map((l) => ({
      id: l.id,
      entity: "lead" as const,
      label: l.companyName || l.fullName,
      hint: l.email ?? undefined,
      href: `/admin/leads/${l.id}`,
    }));
  } catch {
    return [];
  }
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

// ---------- Pure helpers (testable) ----------

// Static "jump to" actions exposed by the command palette in addition
// to entity hits. These don't depend on the query, but are filtered
// down by simple substring match in the UI.
export type PaletteAction = {
  id: string;
  label: string;
  hint?: string;
  href: string;
  group: "Create" | "Navigate" | "Tools";
};

export const PALETTE_ACTIONS: PaletteAction[] = [
  {
    id: "create-owner",
    label: "Create owner",
    hint: "New landlord record",
    href: "/admin/owners/new",
    group: "Create",
  },
  {
    id: "open-tasks",
    label: "Open my tasks",
    href: "/admin/tasks",
    group: "Navigate",
  },
  {
    id: "open-overview",
    label: "Open overview",
    href: "/admin",
    group: "Navigate",
  },
  {
    id: "open-owners",
    label: "Open owners",
    href: "/admin/owners",
    group: "Navigate",
  },
  {
    id: "open-properties",
    label: "Open properties",
    href: "/admin/properties",
    group: "Navigate",
  },
  {
    id: "open-transactions",
    label: "Open transactions",
    href: "/admin/transactions",
    group: "Navigate",
  },
  {
    id: "open-leases",
    label: "Open leases",
    href: "/admin/leases",
    group: "Navigate",
  },
  {
    id: "open-bookings",
    label: "Open bookings",
    href: "/admin/bookings",
    group: "Navigate",
  },
];

export function filterPaletteActions(
  query: string,
  actions: PaletteAction[] = PALETTE_ACTIONS,
): PaletteAction[] {
  const q = query.trim().toLowerCase();
  if (!q) return actions;
  return actions.filter(
    (a) =>
      a.label.toLowerCase().includes(q) ||
      (a.hint?.toLowerCase().includes(q) ?? false),
  );
}
