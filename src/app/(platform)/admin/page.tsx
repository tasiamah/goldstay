import Link from "next/link";
import { prisma } from "@/lib/db";
import { PropertyStatusBadge } from "@/components/PropertyStatusBadge";
import { formatPropertyDisplayName } from "@/lib/format-property";
import { formatOwnerDisplayName } from "@/lib/format-owner";
import { requireAdmin } from "@/lib/auth";
import { AdminWelcomeCard } from "./welcome/AdminWelcomeCard";
import { AttentionQueue } from "@/components/admin/AttentionQueue";
import { CurrencyTotals } from "@/components/admin/CurrencyTotals";
import { ExecutiveKpiStrip } from "@/components/admin/finance/ExecutiveKpiStrip";
import { KpiStrip } from "@/components/admin/KpiStrip";
import { PermissionDeniedBanner } from "@/components/admin/PermissionDeniedBanner";
import {
  getAttentionQueue,
  getMonthlyTotals,
  getOverviewKpis,
} from "@/lib/admin/queue";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const admin = await requireAdmin();

  // Settled instead of all so a single failing query doesn't blank the
  // overview behind a generic "Something went wrong". Each rejection
  // is logged with full Prisma context (which Vercel surfaces in
  // Runtime Logs un-truncated, unlike the platform error boundary's
  // sanitised digest), then we substitute a safe default and the page
  // renders with the data that did come back. This was added after a
  // production incident where the page consistently 500'd for admin
  // users while /owner kept working — the root cause was hidden by
  // Promise.all collapsing the 15-query rejection storm into one
  // opaque error. Defensive readers are correct on infra hiccups too:
  // a transient pgbouncer blip or Supabase pause now degrades the
  // dashboard gracefully instead of taking it down entirely.
  const settled = await Promise.allSettled([
    getAttentionQueue(admin),
    getMonthlyTotals(),
    getOverviewKpis(admin),
    prisma.owner.findMany({
      where: { archivedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { _count: { select: { properties: true } } },
    }),
    prisma.property.findMany({
      where: { archivedAt: null },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        owner: {
          select: { fullName: true, companyName: true, id: true },
        },
      },
    }),
  ]);

  const [
    queueRes,
    totalsRes,
    kpisRes,
    recentOwnersRes,
    recentPropertiesRes,
  ] = settled;

  const queue = unwrap(queueRes, "getAttentionQueue", {
    buckets: [],
    totalItems: 0,
  });
  const totals = unwrap(totalsRes, "getMonthlyTotals", {
    monthLabel: "",
    totals: [],
  });
  const kpis = unwrap(kpisRes, "getOverviewKpis", null);
  const recentOwners = unwrap(recentOwnersRes, "recentOwners", []);
  const recentProperties = unwrap(recentPropertiesRes, "recentProperties", []);

  return (
    <div className="space-y-10">
      <PermissionDeniedBanner deniedRaw={searchParams?.denied} />
      <AdminWelcomeCard admin={admin} />
      {/* Self-gated to SUPER_ADMIN. Renders nothing — and does not
          query — for any other role, so there's no number for the
          rest of the team to glimpse over a shoulder. */}
      <ExecutiveKpiStrip />
      {/* Operational pulse, visible to every admin. Country-scoped
          for COUNTRY_MANAGER so a Kenya manager doesn't see Ghana's
          numbers and vice versa. The three legacy "Owners /
          Properties / Active leases" tiles below this strip are now
          subsumed: occupancy already encodes active leases, and the
          inventory totals were never action-driving — anyone who
          needs them opens /admin/owners or /admin/properties. */}
      {kpis ? <KpiStrip kpis={kpis} /> : null}
      <AttentionQueue queue={queue} />
      {totals.monthLabel ? (
        <CurrencyTotals monthLabel={totals.monthLabel} totals={totals.totals} />
      ) : null}

      <section className="grid gap-8 lg:grid-cols-2">
        <RecentList
          title="Recent owners"
          emptyHint="No owners yet. Add the first one to get started."
          href="/admin/owners"
          primaryAction={{ href: "/admin/owners/new", label: "+ Add owner" }}
          items={recentOwners.map((o) => ({
            id: o.id,
            primary: formatOwnerDisplayName(o),
            // We deliberately keep email + property count as the
            // secondary line here rather than the personal name; the
            // operator already has the legal entity on the primary
            // line and the email is the more useful piece of context
            // when scanning the recent-owners feed.
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
            primary: formatPropertyDisplayName(p.name, p.unitNumber),
            secondary: `${p.city} · ${formatOwnerDisplayName(p.owner)}`,
            href: `/admin/properties/${p.id}`,
            trailing: <PropertyStatusBadge status={p.status} />,
          }))}
        />
      </section>
    </div>
  );
}

// Defensive Promise.allSettled unwrap. On reject, logs the full error
// to console.error (Vercel surfaces these in Runtime Logs without
// truncation, which is exactly what we need to root-cause Prisma /
// connection failures) and returns a caller-supplied default so the
// page still renders. Pure function, side-effect is the log only.
function unwrap<T>(
  res: PromiseSettledResult<T>,
  label: string,
  fallback: T,
): T {
  if (res.status === "fulfilled") return res.value;
  console.error(
    `[admin/overview] ${label} failed; falling back to default.`,
    res.reason,
  );
  return fallback;
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
  items: {
    id: string;
    primary: string;
    secondary: string;
    href: string;
    trailing?: React.ReactNode;
  }[];
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
              <Link
                href={it.href}
                className="group flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="font-medium text-stone-900 group-hover:underline">
                    {it.primary}
                  </p>
                  <p className="text-xs text-stone-500">{it.secondary}</p>
                </div>
                {it.trailing ? (
                  <div className="shrink-0">{it.trailing}</div>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
