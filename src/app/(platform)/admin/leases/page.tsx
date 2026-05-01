// /admin/leases — portfolio-wide lease list.
//
// Backfills the "Open leases" jump action that the command palette
// already exposes; without this page that action 404'd. Kept
// deliberately minimal at first: tenant + property + status + dates
// + monthly rent. The standard list-page contract (search, filters,
// chips, sort) lands as part of the list-page consistency project.
//
// Visible to every role with `lease.read` (everyone except a future
// role with no lease access). Country managers are scoped to their
// country via the property relation.

import Link from "next/link";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { Pagination } from "@/components/admin/table/Pagination";
import {
  PlainHeader,
  SortableHeader,
} from "@/components/admin/table/SortableHeader";
import { parsePagination, parseSort } from "@/lib/admin/table";
import { formatPropertyDisplayName } from "@/lib/format-property";
import { LEASE_STATUS_CLASSES, LEASE_STATUS_LABEL } from "@/lib/leases";

export const dynamic = "force-dynamic";

const SORTABLE_LEASE_COLUMNS = [
  "startDate",
  "endDate",
  "monthlyRent",
  "createdAt",
] as const;

export default async function AdminLeasesListPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const admin = await requireAdmin();
  const rawParams = (searchParams ?? {}) as Record<string, string>;
  const sort = parseSort(rawParams.sort, SORTABLE_LEASE_COLUMNS, {
    column: "startDate",
    direction: "desc",
  });
  const { page, pageSize } = parsePagination(rawParams);

  const countryFilter =
    admin.role === "COUNTRY_MANAGER" && admin.country
      ? { unit: { property: { country: admin.country } } }
      : {};

  const where: Prisma.LeaseWhereInput = {
    archivedAt: null,
    ...countryFilter,
  };

  const orderBy: Prisma.LeaseOrderByWithRelationInput = {
    [sort.column]: sort.direction,
  } as Prisma.LeaseOrderByWithRelationInput;

  const [leases, totalCount] = await Promise.all([
    prisma.lease.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        unit: {
          select: {
            label: true,
            property: {
              select: { id: true, name: true, unitNumber: true, city: true },
            },
          },
        },
      },
    }),
    prisma.lease.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Leases" }]} />

      <div>
        <h2 className="text-xl font-medium text-stone-900">Leases</h2>
        <p className="mt-1 text-sm text-stone-500">
          Every long-term tenancy across the portfolio. Click a row to open the
          lease detail (transactions, notes, status changes).
        </p>
      </div>

      {leases.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <PlainHeader>Tenant</PlainHeader>
                <PlainHeader>Property</PlainHeader>
                <SortableHeader
                  column="startDate"
                  label="Start"
                  current={sort}
                  basePath="/admin/leases"
                  params={rawParams}
                />
                <SortableHeader
                  column="endDate"
                  label="End"
                  current={sort}
                  basePath="/admin/leases"
                  params={rawParams}
                />
                <SortableHeader
                  column="monthlyRent"
                  label="Monthly rent"
                  current={sort}
                  basePath="/admin/leases"
                  params={rawParams}
                  align="right"
                />
                <PlainHeader>Status</PlainHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {leases.map((l) => (
                <tr key={l.id} className="hover:bg-stone-50/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/leases/${l.id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {l.tenantName}
                    </Link>
                    {l.tenantEmail ? (
                      <p className="text-xs text-stone-500">{l.tenantEmail}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/admin/properties/${l.unit.property.id}`}
                      className="text-stone-900 hover:underline"
                    >
                      {formatPropertyDisplayName(
                        l.unit.property.name,
                        l.unit.property.unitNumber,
                      )}
                    </Link>
                    <p className="text-xs text-stone-500">
                      {l.unit.label} · {l.unit.property.city}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {fmtDate(l.startDate)}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {l.endDate ? fmtDate(l.endDate) : "Open-ended"}
                  </td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-stone-900">
                    {Number(l.monthlyRent).toLocaleString("en-GB", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    {l.currency}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${LEASE_STATUS_CLASSES[l.status]}`}
                    >
                      {LEASE_STATUS_LABEL[l.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            basePath="/admin/leases"
            params={rawParams}
            page={page}
            pageSize={pageSize}
            totalRows={totalCount}
          />
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
      <h3 className="text-base font-medium text-stone-900">No leases yet</h3>
      <p className="mt-1 text-sm text-stone-500">
        Long-term tenancies appear here as soon as ops attaches the first lease
        to a unit. Open a property to add one.
      </p>
    </div>
  );
}

function fmtDate(d: Date): string {
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
