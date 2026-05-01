// /admin/bookings — portfolio-wide short-stay booking list.
//
// Backfills the "Open bookings" command-palette jump action and the
// "iCal feed" deep-links from the attention queue, both of which
// previously 404'd. Same minimal-list-then-evolve approach as
// /admin/leases: standard table, breadcrumbs, sort + pagination,
// no filters yet.
//
// Scope: every CONFIRMED, CANCELLED and COMPLETED booking. Default
// sort puts upcoming check-ins first so the morning glance answers
// "who's arriving soon?" without a filter. Country managers get
// scoped to their country via the property relation.

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
import {
  BOOKING_SOURCE_LABEL,
  BOOKING_STATUS_CLASSES,
  BOOKING_STATUS_LABEL,
} from "@/lib/bookings";

export const dynamic = "force-dynamic";

const SORTABLE_BOOKING_COLUMNS = [
  "checkIn",
  "checkOut",
  "grossAmount",
  "createdAt",
] as const;

export default async function AdminBookingsListPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const admin = await requireAdmin();
  const rawParams = (searchParams ?? {}) as Record<string, string>;
  const sort = parseSort(rawParams.sort, SORTABLE_BOOKING_COLUMNS, {
    column: "checkIn",
    direction: "desc",
  });
  const { page, pageSize } = parsePagination(rawParams);

  const countryFilter =
    admin.role === "COUNTRY_MANAGER" && admin.country
      ? { property: { country: admin.country } }
      : {};

  const where: Prisma.BookingWhereInput = { ...countryFilter };

  const orderBy: Prisma.BookingOrderByWithRelationInput = {
    [sort.column]: sort.direction,
  } as Prisma.BookingOrderByWithRelationInput;

  const [bookings, totalCount] = await Promise.all([
    prisma.booking.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        property: {
          select: { id: true, name: true, unitNumber: true, city: true },
        },
      },
    }),
    prisma.booking.count({ where }),
  ]);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Bookings" }]}
      />

      <div>
        <h2 className="text-xl font-medium text-stone-900">Bookings</h2>
        <p className="mt-1 text-sm text-stone-500">
          Short-term stays from every channel: Airbnb, Booking.com, Vrbo and
          direct. Calendar-only iCal imports show up here with a 0 amount until
          the financials are backfilled (the attention queue chases those).
        </p>
      </div>

      {bookings.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <table className="min-w-full divide-y divide-stone-200">
            <thead className="bg-stone-50">
              <tr>
                <PlainHeader>Guest</PlainHeader>
                <PlainHeader>Property</PlainHeader>
                <SortableHeader
                  column="checkIn"
                  label="Check-in"
                  current={sort}
                  basePath="/admin/bookings"
                  params={rawParams}
                />
                <SortableHeader
                  column="checkOut"
                  label="Check-out"
                  current={sort}
                  basePath="/admin/bookings"
                  params={rawParams}
                />
                <PlainHeader>Source</PlainHeader>
                <SortableHeader
                  column="grossAmount"
                  label="Gross"
                  current={sort}
                  basePath="/admin/bookings"
                  params={rawParams}
                  align="right"
                />
                <PlainHeader>Status</PlainHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {bookings.map((b) => (
                <tr key={b.id} className="hover:bg-stone-50/60">
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/bookings/${b.id}`}
                      className="font-medium text-stone-900 hover:underline"
                    >
                      {b.guestName || "Guest"}
                    </Link>
                    {b.guestEmail ? (
                      <p className="text-xs text-stone-500">{b.guestEmail}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <Link
                      href={`/admin/properties/${b.property.id}`}
                      className="text-stone-900 hover:underline"
                    >
                      {formatPropertyDisplayName(
                        b.property.name,
                        b.property.unitNumber,
                      )}
                    </Link>
                    <p className="text-xs text-stone-500">{b.property.city}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {fmtDate(b.checkIn)}
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {fmtDate(b.checkOut)}{" "}
                    <span className="text-xs text-stone-400">
                      ({b.nights}n)
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-stone-700">
                    {BOOKING_SOURCE_LABEL[b.source]}
                  </td>
                  <td className="px-4 py-3 text-right text-sm tabular-nums text-stone-900">
                    {Number(b.grossAmount) === 0 ? (
                      <span className="text-amber-700">pending</span>
                    ) : (
                      <>
                        {Number(b.grossAmount).toLocaleString("en-GB", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        {b.currency}
                      </>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${BOOKING_STATUS_CLASSES[b.status]}`}
                    >
                      {BOOKING_STATUS_LABEL[b.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination
            basePath="/admin/bookings"
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
      <h3 className="text-base font-medium text-stone-900">No bookings yet</h3>
      <p className="mt-1 text-sm text-stone-500">
        Bookings appear here as soon as the iCal cron picks one up from any
        connected channel, or once ops logs a direct booking from a
        property&rsquo;s detail page.
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
