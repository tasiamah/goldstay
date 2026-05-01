import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { formatPropertyDisplayName } from "@/lib/format-property";
import { formatOwnerDisplayName } from "@/lib/format-owner";
import {
  PropertyStatusBadge,
  PropertyTypeBadge,
} from "@/components/PropertyStatusBadge";
import { ListSearchBar } from "@/components/admin/ListSearchBar";
import { FilterSelect } from "@/components/admin/FilterSelect";
import {
  ActiveFilterChips,
  type Chip,
} from "@/components/admin/ActiveFilterChips";
import {
  parsePropertyListFilters,
  toQueryString,
  type RawSearchParams,
} from "@/lib/admin/list-search";

export const dynamic = "force-dynamic";

export default async function PropertiesListPage({
  searchParams,
}: {
  searchParams?: RawSearchParams;
}) {
  const filters = parsePropertyListFilters(searchParams);

  const where: Prisma.PropertyWhereInput = {};
  if (filters.country) where.country = filters.country;
  if (filters.status) where.status = filters.status;
  if (filters.type) where.propertyType = filters.type;
  if (filters.q) {
    // Search across the things an operator types when looking up a
    // property: building name, unit/door, address, neighbourhood,
    // city, and the owner's display name (full or company).
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { unitNumber: { contains: filters.q, mode: "insensitive" } },
      { address: { contains: filters.q, mode: "insensitive" } },
      { neighbourhood: { contains: filters.q, mode: "insensitive" } },
      { city: { contains: filters.q, mode: "insensitive" } },
      {
        owner: {
          is: {
            OR: [
              { fullName: { contains: filters.q, mode: "insensitive" } },
              { companyName: { contains: filters.q, mode: "insensitive" } },
              { email: { contains: filters.q, mode: "insensitive" } },
            ],
          },
        },
      },
    ];
  }

  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        owner: { select: { id: true, fullName: true, companyName: true } },
      },
    }),
    prisma.property.count(),
  ]);

  const isFiltered =
    filters.q !== "" ||
    filters.country !== null ||
    filters.status !== null ||
    filters.type !== null;

  const chips: Chip[] = [];
  if (filters.q) chips.push({ key: "q", label: `Search: “${filters.q}”` });
  if (filters.country)
    chips.push({
      key: "country",
      label: filters.country === "KE" ? "Kenya" : "Ghana",
    });
  if (filters.status)
    chips.push({
      key: "status",
      label:
        filters.status === "ONBOARDING"
          ? "Onboarding"
          : filters.status === "ACTIVE"
            ? "Active"
            : "Exited",
    });
  if (filters.type)
    chips.push({
      key: "type",
      label: filters.type === "SHORT_TERM" ? "Short-term" : "Long-term",
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-medium text-stone-900">Properties</h2>
          <p className="text-sm text-stone-500">
            {isFiltered ? (
              <>
                Showing{" "}
                <strong className="text-stone-700">{properties.length}</strong>{" "}
                of {totalCount}{" "}
                {totalCount === 1 ? "property" : "properties"}
              </>
            ) : (
              <>
                {totalCount} {totalCount === 1 ? "property" : "properties"}{" "}
                across all owners
              </>
            )}
          </p>
        </div>
        <Link
          href={`/admin/properties/export${toQueryString({
            q: filters.q,
            country: filters.country,
            status: filters.status,
            type: filters.type,
          })}`}
          className="inline-flex items-center rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
        >
          Export CSV
        </Link>
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-3">
        <ListSearchBar
          placeholder="Search property, address, owner…"
          ariaLabel="Search properties"
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
          name="status"
          label="Status"
          options={[
            { value: "ONBOARDING", label: "Onboarding" },
            { value: "ACTIVE", label: "Active" },
            { value: "EXITED", label: "Exited" },
          ]}
        />
        <FilterSelect
          name="type"
          label="Model"
          options={[
            { value: "LONG_TERM", label: "Long-term" },
            { value: "SHORT_TERM", label: "Short-term" },
          ]}
        />
      </div>

      <ActiveFilterChips
        chips={chips}
        basePath="/admin/properties"
        allParams={{
          q: filters.q,
          country: filters.country,
          status: filters.status,
          type: filters.type,
        }}
      />

      {properties.length === 0 ? (
        isFiltered ? (
          <NoMatches resetHref="/admin/properties" />
        ) : (
          <EmptyState />
        )
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <Th>Property</Th>
                <Th>Owner</Th>
                <Th>Country</Th>
                <Th>Model</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {properties.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/properties/${p.id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {formatPropertyDisplayName(p.name, p.unitNumber)}
                    </Link>
                    <p className="text-xs text-stone-500">
                      {p.neighbourhood ? `${p.neighbourhood}, ` : ""}
                      {p.city}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/admin/owners/${p.owner.id}`}
                      className="text-stone-700 hover:underline"
                    >
                      {formatOwnerDisplayName(p.owner)}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {p.country === "KE" ? "Kenya" : "Ghana"}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <PropertyTypeBadge type={p.propertyType} />
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <PropertyStatusBadge status={p.status} />
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

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
      <h3 className="text-base font-medium text-stone-900">
        No properties yet
      </h3>
      <p className="mt-1 text-sm text-stone-500">
        Add an owner first, then attach a property from their detail page.
      </p>
      <Link
        href="/admin/owners"
        className="mt-4 inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
      >
        Go to owners
      </Link>
    </div>
  );
}

function NoMatches({ resetHref }: { resetHref: string }) {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
      <h3 className="text-base font-medium text-stone-900">
        No properties match those filters
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
