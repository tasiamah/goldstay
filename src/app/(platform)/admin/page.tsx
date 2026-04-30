import Link from "next/link";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [
    ownerCount,
    propertyCount,
    activeLeaseCount,
    recentOwners,
    recentProperties,
  ] = await Promise.all([
    prisma.owner.count(),
    prisma.property.count(),
    prisma.lease.count({ where: { status: "ACTIVE" } }),
    prisma.owner.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { _count: { select: { properties: true } } },
    }),
    prisma.property.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { owner: { select: { fullName: true, id: true } } },
    }),
  ]);

  return (
    <div className="space-y-10">
      <section className="grid grid-cols-3 gap-4">
        <Stat label="Owners" value={ownerCount} href="/admin/owners" />
        <Stat
          label="Properties"
          value={propertyCount}
          href="/admin/properties"
        />
        <Stat label="Active leases" value={activeLeaseCount} />
      </section>

      <section className="grid gap-8 lg:grid-cols-2">
        <RecentList
          title="Recent owners"
          emptyHint="No owners yet. Add the first one to get started."
          href="/admin/owners"
          primaryAction={{ href: "/admin/owners/new", label: "+ Add owner" }}
          items={recentOwners.map((o) => ({
            id: o.id,
            primary: o.fullName,
            secondary: `${o.email} · ${o._count.properties} ${
              o._count.properties === 1 ? "property" : "properties"
            }`,
            href: `/admin/owners/${o.id}`,
          }))}
        />
        <RecentList
          title="Recent properties"
          emptyHint="No properties yet. Open an owner to add their first property."
          href="/admin/properties"
          items={recentProperties.map((p) => ({
            id: p.id,
            primary: p.name,
            secondary: `${p.city} · ${p.owner.fullName}`,
            href: `/admin/properties/${p.id}`,
          }))}
        />
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: number;
  href?: string;
}) {
  const inner = (
    <div className="rounded-lg border border-stone-200 bg-white p-6 transition hover:border-stone-300">
      <p className="text-xs uppercase tracking-wider text-stone-500">{label}</p>
      <p className="mt-2 text-2xl font-serif text-stone-900">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function RecentList({
  title,
  href,
  items,
  emptyHint,
  primaryAction,
}: {
  title: string;
  href: string;
  items: { id: string; primary: string; secondary: string; href: string }[];
  emptyHint: string;
  primaryAction?: { href: string; label: string };
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-medium text-stone-900">{title}</h3>
        <div className="flex items-center gap-3 text-sm">
          <Link
            href={href}
            className="text-stone-600 hover:text-stone-900"
          >
            See all
          </Link>
          {primaryAction ? (
            <Link
              href={primaryAction.href}
              className="inline-flex items-center rounded-md bg-stone-900 px-3 py-1.5 font-medium text-white hover:bg-stone-800"
            >
              {primaryAction.label}
            </Link>
          ) : null}
        </div>
      </div>
      {items.length === 0 ? (
        <p className="mt-4 text-sm text-stone-500">{emptyHint}</p>
      ) : (
        <ul className="mt-4 divide-y divide-stone-100">
          {items.map((it) => (
            <li key={it.id} className="py-3">
              <Link href={it.href} className="block hover:underline">
                <p className="font-medium text-stone-900">{it.primary}</p>
                <p className="text-xs text-stone-500">{it.secondary}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
