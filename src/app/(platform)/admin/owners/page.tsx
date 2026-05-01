import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  formatOwnerDisplayName,
  formatOwnerSecondaryName,
} from "@/lib/format-owner";
import { ListSearchBar } from "@/components/admin/ListSearchBar";
import { FilterSelect } from "@/components/admin/FilterSelect";
import {
  ActiveFilterChips,
  type Chip,
} from "@/components/admin/ActiveFilterChips";
import {
  parseOwnerListFilters,
  toQueryString,
  type RawSearchParams,
} from "@/lib/admin/list-search";

export const dynamic = "force-dynamic";

export default async function OwnersListPage({
  searchParams,
}: {
  searchParams?: RawSearchParams;
}) {
  const filters = parseOwnerListFilters(searchParams);

  // Build a Prisma where clause from the parsed filters. Search
  // covers the four fields a Goldstay ops person reasonably types
  // when looking for a landlord: name, company, email, phone.
  const where: Prisma.OwnerWhereInput = {};
  if (filters.country) where.country = filters.country;
  if (filters.q) {
    where.OR = [
      { fullName: { contains: filters.q, mode: "insensitive" } },
      { companyName: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
      { phone: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  const [owners, totalCount] = await Promise.all([
    prisma.owner.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { properties: true } } },
    }),
    prisma.owner.count(),
  ]);

  const isFiltered = filters.q !== "" || filters.country !== null;
  const chips: Chip[] = [];
  if (filters.q) chips.push({ key: "q", label: `Search: “${filters.q}”` });
  if (filters.country)
    chips.push({
      key: "country",
      label: filters.country === "KE" ? "Kenya" : "Ghana",
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-medium text-stone-900">Owners</h2>
          <p className="text-sm text-stone-500">
            {isFiltered ? (
              <>
                Showing <strong className="text-stone-700">{owners.length}</strong>{" "}
                of {totalCount}{" "}
                {totalCount === 1 ? "owner" : "owners"}
              </>
            ) : (
              <>
                {totalCount} {totalCount === 1 ? "owner" : "owners"} in
                the platform
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/owners/export${toQueryString({
              q: filters.q,
              country: filters.country,
            })}`}
            className="inline-flex items-center rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Export CSV
          </Link>
          <Link
            href="/admin/owners/new"
            className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            Add owner
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <ListSearchBar
            placeholder="Search name, company, email, phone…"
            ariaLabel="Search owners"
          />
          <FilterSelect
            name="country"
            label="Country"
            options={[
              { value: "KE", label: "Kenya" },
              { value: "GH", label: "Ghana" },
            ]}
          />
        </div>
      </div>

      <ActiveFilterChips
        chips={chips}
        basePath="/admin/owners"
        allParams={{ q: filters.q, country: filters.country }}
      />

      {owners.length === 0 ? (
        isFiltered ? (
          <NoMatches resetHref="/admin/owners" />
        ) : (
          <EmptyState />
        )
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Country</Th>
                <Th align="right">Properties</Th>
                <Th>Joined</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {owners.map((o) => {
                const secondary = formatOwnerSecondaryName(o);
                return (
                  <tr key={o.id} className="hover:bg-stone-50/60">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/owners/${o.id}`}
                        className="font-medium text-stone-900 hover:underline"
                      >
                        {formatOwnerDisplayName(o)}
                      </Link>
                      {secondary ? (
                        <p className="text-xs text-stone-500">{secondary}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-700">
                      <a
                        href={`mailto:${o.email}`}
                        className="hover:underline"
                      >
                        {o.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-700">
                      {o.country === "KE" ? "Kenya" : "Ghana"}
                    </td>
                    <td className="px-4 py-3 text-right text-sm tabular-nums text-stone-700">
                      {o._count.properties}
                    </td>
                    <td className="px-4 py-3 text-sm text-stone-500">
                      {o.createdAt.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
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

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
      <h3 className="text-base font-medium text-stone-900">No owners yet</h3>
      <p className="mt-1 text-sm text-stone-500">
        Add your first owner to start tracking properties and leases.
      </p>
      <Link
        href="/admin/owners/new"
        className="mt-4 inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
      >
        Add owner
      </Link>
    </div>
  );
}

function NoMatches({ resetHref }: { resetHref: string }) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
      <h3 className="text-base font-medium text-stone-900">
        No owners match those filters
      </h3>
      <p className="mt-1 text-sm text-stone-500">
        Try a shorter search or remove a filter.
      </p>
      <Link
        href={resetHref}
        className="mt-4 inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
      >
        Clear all filters
      </Link>
    </div>
  );
}
