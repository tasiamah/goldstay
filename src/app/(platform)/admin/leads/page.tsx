// /admin/leads — single pane of glass for inbound landlord leads.
//
// Replaces the "go check the inbox / go check Airtable" pattern: every
// /list-your-property submission writes a row here, status starts NEW,
// and the lifecycle (CONTACTED → QUALIFIED → CONVERTED|LOST) is driven
// by buttons on the detail page.
//
// Filters: status, country, source, free-text on name/email/phone. The
// Convert column links straight to /admin/leads/[id]/convert which
// pre-fills /admin/owners/new — that's the whole point of this page.

import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  LEAD_SOURCE_LABEL,
  LEAD_STATUS_CLASSES,
  LEAD_STATUS_LABEL,
} from "@/lib/leads";
import { ListSearchBar } from "@/components/admin/ListSearchBar";
import { FilterSelect } from "@/components/admin/FilterSelect";
import {
  ActiveFilterChips,
  type Chip,
} from "@/components/admin/ActiveFilterChips";
import {
  PERIOD_LABEL,
  parsePeriod,
  periodRange,
  type PeriodFilter,
} from "@/lib/admin/list-search";

export const dynamic = "force-dynamic";

type LeadFilters = {
  q: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST" | null;
  country: "KE" | "GH" | null;
  source:
    | "WEBSITE"
    | "WHATSAPP"
    | "EMAIL"
    | "REFERRAL"
    | "OUTBOUND_SCRAPE"
    | "OTHER"
    | null;
  period: PeriodFilter;
};

function parseFilters(
  searchParams: Record<string, string | string[] | undefined> | undefined,
): LeadFilters {
  const q = (searchParams?.q as string | undefined)?.trim() ?? "";
  const status = (searchParams?.status as string | undefined) ?? null;
  const country = (searchParams?.country as string | undefined) ?? null;
  const source = (searchParams?.source as string | undefined) ?? null;
  return {
    q,
    status:
      status === "NEW" ||
      status === "CONTACTED" ||
      status === "QUALIFIED" ||
      status === "CONVERTED" ||
      status === "LOST"
        ? status
        : null,
    country: country === "KE" || country === "GH" ? country : null,
    source:
      source === "WEBSITE" ||
      source === "WHATSAPP" ||
      source === "EMAIL" ||
      source === "REFERRAL" ||
      source === "OUTBOUND_SCRAPE" ||
      source === "OTHER"
        ? source
        : null,
    period: parsePeriod(searchParams),
  };
}

export default async function LeadsListPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const filters = parseFilters(searchParams);

  const where: Prisma.LeadWhereInput = { archivedAt: null };
  if (filters.status) where.status = filters.status;
  if (filters.country) where.country = filters.country;
  if (filters.source) where.source = filters.source;
  // Drives the "New leads" KPI deep-link from /admin so clicking the
  // count opens the leads created in that calendar month.
  const range = periodRange(filters.period);
  if (range) where.createdAt = { gte: range.gte, lt: range.lt };
  if (filters.q) {
    where.OR = [
      { fullName: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
      { phone: { contains: filters.q, mode: "insensitive" } },
      { city: { contains: filters.q, mode: "insensitive" } },
      { neighbourhood: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  const [leads, totalCount, openCount] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
      take: 200,
      include: {
        ownerAdmin: { select: { fullName: true, email: true } },
      },
    }),
    prisma.lead.count({ where: { archivedAt: null } }),
    prisma.lead.count({
      where: { archivedAt: null, status: { in: ["NEW", "CONTACTED", "QUALIFIED"] } },
    }),
  ]);

  const isFiltered =
    filters.q !== "" ||
    filters.status !== null ||
    filters.country !== null ||
    filters.source !== null ||
    filters.period !== null;

  const chips: Chip[] = [];
  if (filters.q) chips.push({ key: "q", label: `Search: “${filters.q}”` });
  if (filters.status)
    chips.push({ key: "status", label: LEAD_STATUS_LABEL[filters.status] });
  if (filters.country)
    chips.push({
      key: "country",
      label: filters.country === "KE" ? "Kenya" : "Ghana",
    });
  if (filters.source)
    chips.push({ key: "source", label: LEAD_SOURCE_LABEL[filters.source] });
  if (filters.period)
    chips.push({ key: "period", label: PERIOD_LABEL[filters.period] });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-medium text-stone-900">Leads</h2>
          <p className="text-sm text-stone-500">
            {isFiltered ? (
              <>
                Showing <strong className="text-stone-700">{leads.length}</strong>{" "}
                of {totalCount} leads
              </>
            ) : (
              <>
                <strong className="text-stone-700">{openCount}</strong> open
                {" of "}
                {totalCount} total
              </>
            )}
          </p>
        </div>
        <Link
          href="/admin/leads/new"
          className="inline-flex items-center self-start rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
        >
          Log a lead manually
        </Link>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <ListSearchBar
            placeholder="Search name, email, phone, city…"
            ariaLabel="Search leads"
          />
          <FilterSelect
            name="status"
            label="Status"
            options={(["NEW", "CONTACTED", "QUALIFIED", "CONVERTED", "LOST"] as const).map(
              (s) => ({ value: s, label: LEAD_STATUS_LABEL[s] }),
            )}
          />
          <FilterSelect
            name="country"
            label="Country"
            options={[
              { value: "KE", label: "Kenya" },
              { value: "GH", label: "Ghana" },
            ]}
          />
          <FilterSelect
            name="source"
            label="Source"
            options={(
              [
                "WEBSITE",
                "WHATSAPP",
                "EMAIL",
                "REFERRAL",
                "OUTBOUND_SCRAPE",
                "OTHER",
              ] as const
            ).map((s) => ({ value: s, label: LEAD_SOURCE_LABEL[s] }))}
          />
        </div>
      </div>

      <ActiveFilterChips
        chips={chips}
        basePath="/admin/leads"
        allParams={{
          q: filters.q,
          status: filters.status,
          country: filters.country,
          source: filters.source,
          period: filters.period,
        }}
      />

      {leads.length === 0 ? (
        isFiltered ? (
          <NoMatches />
        ) : (
          <EmptyState />
        )
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <Th>Lead</Th>
                <Th>Status</Th>
                <Th>Property</Th>
                <Th>Source</Th>
                <Th>Owner</Th>
                <Th>Submitted</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {leads.map((l) => (
                <tr key={l.id} className="hover:bg-stone-50/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leads/${l.id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {l.fullName}
                    </Link>
                    <p className="mt-0.5 text-xs text-stone-500">
                      {l.email ?? "—"} · {l.phone}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${LEAD_STATUS_CLASSES[l.status]}`}
                    >
                      {LEAD_STATUS_LABEL[l.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {l.city ?? "—"}
                    {l.neighbourhood ? `, ${l.neighbourhood}` : ""}
                    {l.country ? (
                      <span className="ml-1 text-xs text-stone-400">
                        ({l.country})
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {LEAD_SOURCE_LABEL[l.source]}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {l.ownerAdmin ? l.ownerAdmin.fullName : (
                      <span className="text-stone-400">Unassigned</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-500">
                    {l.createdAt.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-stone-500">
      {children}
    </th>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
      <h3 className="text-base font-medium text-stone-900">No leads yet</h3>
      <p className="mt-1 text-sm text-stone-500">
        Inbound enquiries from the website land here. While you wait for
        traffic, log a lead manually if a landlord reaches you on WhatsApp.
      </p>
    </div>
  );
}

function NoMatches() {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
      <h3 className="text-base font-medium text-stone-900">
        No leads match those filters
      </h3>
      <p className="mt-1 text-sm text-stone-500">
        Try a shorter search or remove a filter.
      </p>
      <Link
        href="/admin/leads"
        className="mt-4 inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
      >
        Clear all filters
      </Link>
    </div>
  );
}
