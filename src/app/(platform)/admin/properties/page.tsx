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
import {
  PlainHeader,
  SortableHeader,
} from "@/components/admin/table/SortableHeader";
import { Pagination } from "@/components/admin/table/Pagination";
import {
  parsePagination,
  parseSort,
  sortToParam,
  type SortState,
} from "@/lib/admin/table";

export const dynamic = "force-dynamic";

const SORTABLE_PROPERTY_COLUMNS = [
  "name",
  "country",
  "propertyType",
  "status",
  "createdAt",
] as const;

export default async function PropertiesListPage({
  searchParams,
}: {
  searchParams?: RawSearchParams;
}) {
  const filters = parsePropertyListFilters(searchParams);
  const rawParams = (searchParams ?? {}) as Record<string, string>;
  const sort = parseSort(
    rawParams.sort,
    SORTABLE_PROPERTY_COLUMNS,
    { column: "createdAt", direction: "desc" },
  );
  const { page, pageSize } = parsePagination(rawParams);

  const where: Prisma.PropertyWhereInput = { archivedAt: null };
  if (filters.country) where.country = filters.country;
  if (filters.status) where.status = filters.status;
  if (filters.type) where.propertyType = filters.type;
  // Vacancy: a property is "vacant" when at least one of its units
  // has no ACTIVE lease today. "let" = every unit has at least one
  // ACTIVE lease. We model both via the units relation so the same
  // page works for single-unit homes and multi-unit blocks.
  if (filters.vacancy === "vacant") {
    where.units = {
      some: { leases: { none: { status: "ACTIVE", archivedAt: null } } },
    };
  } else if (filters.vacancy === "let") {
    where.units = {
      every: { leases: { some: { status: "ACTIVE", archivedAt: null } } },
    };
  }
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

  const orderBy: Prisma.PropertyOrderByWithRelationInput = {
    [sort.column]: sort.direction,
  } as Prisma.PropertyOrderByWithRelationInput;

  const [properties, filteredCount, totalCount] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        owner: { select: { id: true, fullName: true, companyName: true } },
      },
    }),
    prisma.property.count({ where }),
    prisma.property.count({ where: { archivedAt: null } }),
  ]);

  const isFiltered =
    filters.q !== "" ||
    filters.country !== null ||
    filters.status !== null ||
    filters.type !== null ||
    filters.vacancy !== null;

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
  if (filters.vacancy)
    chips.push({
      key: "vacancy",
      label: filters.vacancy === "vacant" ? "Has vacant unit" : "Fully let",
    });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-medium text-stone-900">Properties</h2>
          <p className="text-sm text-stone-500">
            {isFiltered ? (
              <>
                <strong className="text-stone-700">{filteredCount}</strong> of{" "}
                {totalCount}{" "}
                {totalCount === 1 ? "property" : "properties"} match
              </>
            ) : (
              <>
                {totalCount} {totalCount === 1 ? "property" : "properties"}{" "}
                across all owners
              </>
            )}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/properties/export${toQueryString({
              q: filters.q,
              country: filters.country,
              status: filters.status,
              type: filters.type,
              vacancy: filters.vacancy,
            })}`}
            className="inline-flex items-center rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Export CSV
          </Link>
          <Link
            href="/admin/properties/import"
            className="inline-flex items-center rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
          >
            Import CSV
          </Link>
        </div>
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
          vacancy: filters.vacancy,
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
                <SortableHeader
                  column="name"
                  label="Property"
                  current={sort}
                  basePath="/admin/properties"
                  params={propertiesTableParams(filters, sort, pageSize)}
                />
                <PlainHeader>Owner</PlainHeader>
                <SortableHeader
                  column="country"
                  label="Country"
                  current={sort}
                  basePath="/admin/properties"
                  params={propertiesTableParams(filters, sort, pageSize)}
                />
                <SortableHeader
                  column="propertyType"
                  label="Model"
                  current={sort}
                  basePath="/admin/properties"
                  params={propertiesTableParams(filters, sort, pageSize)}
                />
                <SortableHeader
                  column="status"
                  label="Status"
                  current={sort}
                  basePath="/admin/properties"
                  params={propertiesTableParams(filters, sort, pageSize)}
                />
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
          <Pagination
            basePath="/admin/properties"
            params={propertiesTableParams(filters, sort, pageSize)}
            page={page}
            pageSize={pageSize}
            totalRows={filteredCount}
          />
        </div>
      )}
    </div>
  );
}

function propertiesTableParams(
  filters: ReturnType<typeof parsePropertyListFilters>,
  sort: SortState,
  pageSize: number,
): Record<string, string> {
  const out: Record<string, string> = {
    sort: sortToParam(sort),
    pageSize: String(pageSize),
  };
  if (filters.q) out.q = filters.q;
  if (filters.country) out.country = filters.country;
  if (filters.status) out.status = filters.status;
  if (filters.type) out.type = filters.type;
  if (filters.vacancy) out.vacancy = filters.vacancy;
  return out;
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
