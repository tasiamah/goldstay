import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { PropertyForm } from "../PropertyForm";
import { updatePropertyAction } from "../actions";
import { DocumentUploader } from "./documents/DocumentUploader";
import { DeleteDocumentButton } from "./documents/DeleteDocumentButton";
import { PropertyLifecycleActions } from "./PropertyLifecycleActions";
import {
  PropertyStatusBadge,
  PropertyTypeBadge,
} from "@/components/PropertyStatusBadge";
import { formatPropertyDisplayName } from "@/lib/format-property";
import { formatOwnerDisplayName } from "@/lib/format-owner";
import {
  OccupancyCalendar,
  clampHeatmapMonths,
  heatmapWindowStart,
  HEATMAP_MAX_MONTHS,
  HEATMAP_STEP,
} from "@/components/OccupancyCalendar";
import { IcalFeedManager } from "./ical/IcalFeedManager";
import { ReissueAgreementButton } from "./agreement/ReissueButton";
import {
  AGREEMENT_STATUS_CLASSES,
  AGREEMENT_STATUS_LABEL,
  formatCommissionPct,
  formatMoney,
} from "@/lib/agreements/format";
import { SOURCE_LABEL } from "@/lib/booking-sources";
import {
  occupancyPercentForPeriod,
  revenueTotalsByCurrency,
  type BookingLike,
} from "@/lib/bookings/aggregate";

const DOCUMENT_KIND_LABELS: Record<string, string> = {
  TITLE_DEED: "Title deed",
  SALE_AGREEMENT: "Sale agreement",
  LEASE: "Lease",
  KYC: "KYC",
  INVOICE: "Invoice",
  RECEIPT: "Receipt",
  STATEMENT: "Statement",
  PHOTO: "Photo",
  OTHER: "Other",
};

export const dynamic = "force-dynamic";

export default async function PropertyDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { heatmap?: string };
}) {
  // The heatmap window grows in 3-month steps from 3 → 12 via a
  // ?heatmap=N query param. We fetch bookings overlapping that window
  // and pass the same monthsBack to the calendar so the fetch and
  // the render line up exactly.
  const heatmapMonthsBack = clampHeatmapMonths(searchParams?.heatmap);
  const heatmapStart = heatmapWindowStart(new Date(), heatmapMonthsBack);

  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      owner: {
        select: {
          id: true,
          fullName: true,
          companyName: true,
          country: true,
        },
      },
      // We don't surface units in the UI any more (one property is
      // one rental) but we still walk them to find the active lease,
      // because Lease FKs into Unit, not Property.
      units: {
        orderBy: { createdAt: "asc" },
        include: {
          leases: {
            where: { status: "ACTIVE" },
            orderBy: { startDate: "desc" },
            take: 1,
            select: {
              id: true,
              tenantName: true,
              startDate: true,
              endDate: true,
              monthlyRent: true,
              currency: true,
            },
          },
        },
      },
      documents: {
        orderBy: { createdAt: "desc" },
      },
      // All bookings whose stay overlaps the heatmap window. The
      // BookingsCard then takes the most recent slice for display,
      // so one query feeds both views.
      bookings: {
        where: { checkOut: { gte: heatmapStart } },
        orderBy: { checkIn: "desc" },
      },
      icalFeeds: {
        orderBy: { source: "asc" },
      },
      // Most recent agreement first; UI surfaces the latest one.
      // Older rows stay around for audit history.
      agreements: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!property) notFound();

  // Only surface the "Show 3 more months" link when both conditions
  // hold: there's actually older data to reveal AND the window hasn't
  // already hit its cap. Cheap count, scoped by property.
  const olderBookingCount =
    heatmapMonthsBack < HEATMAP_MAX_MONTHS
      ? await prisma.booking.count({
          where: {
            propertyId: params.id,
            checkOut: { lt: heatmapStart },
            status: { not: "CANCELLED" },
          },
        })
      : 0;
  const heatmapLoadMoreHref =
    olderBookingCount > 0
      ? `?heatmap=${heatmapMonthsBack + HEATMAP_STEP}`
      : null;

  const isShortTerm = property.propertyType === "SHORT_TERM";
  const activeLease = property.units.flatMap((u) => u.leases)[0] ?? null;

  // Last-30-day occupancy stat for short-term properties. Anchored to
  // UTC midnight so it lines up with the booking aggregation.
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30);
  const period = { start: thirtyDaysAgo, end: now };
  const bookingsForAgg: BookingLike[] = property.bookings.map((b) => ({
    checkIn: b.checkIn,
    checkOut: b.checkOut,
    nights: b.nights,
    grossAmount: Number(b.grossAmount),
    otaCommission: b.otaCommission ? Number(b.otaCommission) : null,
    cleaningFee: b.cleaningFee ? Number(b.cleaningFee) : null,
    netPayout: Number(b.netPayout),
    currency: b.currency,
    status: b.status,
  }));
  const occPct30 = isShortTerm
    ? occupancyPercentForPeriod(bookingsForAgg, period)
    : null;
  const revenue30 = isShortTerm
    ? revenueTotalsByCurrency(bookingsForAgg, period)
    : [];

  const boundUpdate = updatePropertyAction.bind(null, property.id);

  // Decimal serialises to string on the wire; convert for the form
  // value so the input doesn't crash on a Prisma Decimal instance.
  const acquisitionPrice = property.acquisitionPrice
    ? property.acquisitionPrice.toString()
    : null;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href={`/admin/owners/${property.owner.id}`}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← {formatOwnerDisplayName(property.owner)}
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-medium text-stone-900">
                {formatPropertyDisplayName(property.name, property.unitNumber)}
              </h2>
              <PropertyStatusBadge status={property.status} />
              <PropertyTypeBadge type={property.propertyType} />
            </div>
            <p className="mt-1 text-sm text-stone-500">
              {property.neighbourhood ? `${property.neighbourhood}, ` : ""}
              {property.city} ·{" "}
              {property.country === "KE" ? "Kenya" : "Ghana"}
            </p>
          </div>
          <PropertyLifecycleActions
            propertyId={property.id}
            status={property.status}
            documentCount={property.documents.length}
          />
        </div>
      </div>

      {isShortTerm ? (
        <section className="space-y-4 rounded-lg border border-stone-200 bg-white p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h3 className="text-base font-medium text-stone-900">
              Last {heatmapMonthsBack} months
            </h3>
            <div className="flex flex-wrap items-baseline gap-6 text-sm">
              <span className="text-stone-500">
                Occupancy (30d){" "}
                <span className="ml-1 text-base font-serif text-stone-900">
                  {occPct30 === null ? "—" : `${occPct30}%`}
                </span>
              </span>
              {revenue30.map((r) => (
                <span key={r.currency} className="text-stone-500">
                  Gross {r.currency}{" "}
                  <span className="ml-1 text-base font-serif text-stone-900">
                    {r.gross.toLocaleString("en-GB", {
                      maximumFractionDigits: 0,
                    })}
                  </span>
                </span>
              ))}
            </div>
          </div>
          <OccupancyCalendar
            bookings={property.bookings}
            monthsBack={heatmapMonthsBack}
            loadMoreHref={heatmapLoadMoreHref}
          />
        </section>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <h3 className="text-base font-medium text-stone-900">Details</h3>
          <p className="mt-1 text-sm text-stone-500">
            Updates are visible to the owner on next page load.
          </p>
          <div className="mt-5">
            <PropertyForm
              action={boundUpdate}
              ownerCountry={property.owner.country}
              isEditing
              defaults={{
                ownerId: property.owner.id,
                name: property.name,
                unitNumber: property.unitNumber,
                city: property.city,
                neighbourhood: property.neighbourhood,
                address: property.address,
                description: property.description,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                sizeSqm: property.sizeSqm,
                acquisitionPrice,
                acquisitionCurrency: property.acquisitionCurrency,
                status: property.status,
                propertyType: property.propertyType,
                hostawayListingId: property.hostawayListingId,
              }}
              submitLabel="Save changes"
            />
          </div>
        </div>

        <div className="space-y-6">
          {isShortTerm ? (
            <>
              <BookingsCard
                propertyId={property.id}
                bookings={property.bookings.slice(0, 25)}
              />
              <div className="rounded-lg border border-stone-200 bg-white p-6">
                <h3 className="text-base font-medium text-stone-900">
                  Channel calendars
                </h3>
                <p className="mt-1 text-sm text-stone-500">
                  Connect this property&rsquo;s public iCal feeds so the
                  occupancy calendar updates automatically every 15 minutes.
                  Free alternative to a paid PMS — dates only, no guest data
                  or money. Operators backfill financials manually.
                </p>
                <div className="mt-5">
                  <IcalFeedManager
                    propertyId={property.id}
                    feeds={property.icalFeeds.map((f) => ({
                      id: f.id,
                      source: f.source,
                      url: f.url,
                      lastSyncedAt: f.lastSyncedAt,
                      lastSuccessAt: f.lastSuccessAt,
                      lastError: f.lastError,
                    }))}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-stone-200 bg-white p-6">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-base font-medium text-stone-900">
                  Tenancy
                </h3>
                {activeLease ? (
                  <Link
                    href={`/admin/leases/${activeLease.id}`}
                    className="text-sm text-stone-600 hover:text-stone-900"
                  >
                    Manage lease
                  </Link>
                ) : (
                  <Link
                    href={`/admin/properties/${property.id}/leases/new`}
                    className="inline-flex items-center rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
                  >
                    + Start lease
                  </Link>
                )}
              </div>
              {activeLease ? (
                <div className="mt-4 space-y-1">
                  <p className="font-medium text-stone-900">
                    {activeLease.tenantName}
                  </p>
                  <p className="text-sm text-stone-500">
                    {activeLease.currency}{" "}
                    {Number(activeLease.monthlyRent).toLocaleString("en-GB")}/mo
                    {" · since "}
                    {activeLease.startDate.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    {activeLease.endDate
                      ? ` → ${activeLease.endDate.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}`
                      : " · ongoing"}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-stone-500">
                  No active lease. Click{" "}
                  <span className="font-medium text-stone-700">Start lease</span>{" "}
                  to record a new tenant.
                </p>
              )}
            </div>
          )}

          {property.status === "ACTIVE" || property.agreements.length > 0 ? (
            <AgreementCard
              propertyId={property.id}
              agreements={property.agreements.map((a) => ({
                id: a.id,
                status: a.status,
                termMonths: a.termMonths,
                commissionRate: a.commissionRate.toString(),
                earlyExitFee: a.earlyExitFee.toString(),
                earlyExitFeeCurrency: a.earlyExitFeeCurrency,
                noticePeriodDays: a.noticePeriodDays,
                generatedAt: a.generatedAt,
                sentAt: a.sentAt,
                signedAt: a.signedAt,
                signedByName: a.signedByName,
                documentId: a.documentId,
              }))}
            />
          ) : null}

          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <h3 className="text-base font-medium text-stone-900">
              Documents
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              Title deeds, sale agreements, leases, invoices, and any
              other paperwork backing this property. Visible to the
              owner on their portal.
            </p>

            <div className="mt-5 border-b border-stone-100 pb-5">
              <DocumentUploader propertyId={property.id} />
            </div>

            {property.documents.length === 0 ? (
              <p className="mt-5 text-sm text-stone-500">
                No documents uploaded yet.
              </p>
            ) : (
              <ul className="mt-5 divide-y divide-stone-100">
                {property.documents.map((d) => (
                  <li
                    key={d.id}
                    className="flex items-start justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <a
                        href={`/admin/documents/${d.id}/download`}
                        target="_blank"
                        rel="noopener"
                        className="block truncate font-medium text-stone-900 hover:underline"
                      >
                        {d.title}
                      </a>
                      <p className="mt-0.5 text-xs text-stone-500">
                        {DOCUMENT_KIND_LABELS[d.kind] ?? d.kind}
                        {d.sizeBytes
                          ? ` · ${formatBytes(d.sizeBytes)}`
                          : ""}
                        {" · "}
                        {d.createdAt.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                    <DeleteDocumentButton
                      documentId={d.id}
                      title={d.title}
                    />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function BookingsCard({
  propertyId,
  bookings,
}: {
  propertyId: string;
  bookings: Array<{
    id: string;
    source: string;
    guestName: string;
    checkIn: Date;
    checkOut: Date;
    nights: number;
    grossAmount: unknown;
    netPayout: unknown;
    currency: string;
    status: string;
  }>;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-base font-medium text-stone-900">Bookings</h3>
        <Link
          href={`/admin/properties/${propertyId}/bookings/new`}
          className="inline-flex items-center rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
        >
          + Add booking
        </Link>
      </div>
      <p className="mt-1 text-sm text-stone-500">
        Bookings synced from Hostaway land here automatically. You can also
        record direct bookings manually.
      </p>
      {bookings.length === 0 ? (
        <p className="mt-4 text-sm text-stone-500">
          No bookings yet for this property.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-stone-100">
          {bookings.map((b) => {
            const isPlaceholder = Number(b.grossAmount) === 0;
            return (
              <li key={b.id}>
                <Link
                  href={`/admin/bookings/${b.id}`}
                  className="-mx-2 flex items-start justify-between gap-4 rounded-md px-2 py-3 hover:bg-stone-50"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-stone-900">{b.guestName}</p>
                    <p className="mt-0.5 text-xs text-stone-500">
                      {SOURCE_LABEL[b.source as keyof typeof SOURCE_LABEL] ??
                        b.source}{" "}
                      ·{" "}
                      {b.checkIn.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                      })}{" "}
                      →{" "}
                      {b.checkOut.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      · {b.nights} {b.nights === 1 ? "night" : "nights"}
                      {b.status !== "CONFIRMED"
                        ? ` · ${b.status.toLowerCase()}`
                        : ""}
                    </p>
                  </div>
                  <p
                    className={`shrink-0 text-right text-sm tabular-nums ${
                      isPlaceholder
                        ? "italic text-amber-700"
                        : "text-stone-900"
                    }`}
                  >
                    {isPlaceholder
                      ? "needs financials →"
                      : `${b.currency} ${Number(b.grossAmount).toLocaleString(
                          "en-GB",
                          { maximumFractionDigits: 0 },
                        )}`}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// Surfaces the management agreement lifecycle to the operator. Most
// of the time there'll be exactly one row (the auto-issued one);
// older CANCELLED rows are listed under a small "history" line so the
// audit trail is visible without dominating the card. Reissue lives
// on a small button at the top so changing terms before signature is
// a single click.
type AgreementRow = {
  id: string;
  status: "DRAFT" | "SENT" | "SIGNED" | "CANCELLED";
  termMonths: number;
  commissionRate: string;
  earlyExitFee: string;
  earlyExitFeeCurrency: string;
  noticePeriodDays: number;
  generatedAt: Date;
  sentAt: Date | null;
  signedAt: Date | null;
  signedByName: string | null;
  documentId: string | null;
};

function AgreementCard({
  propertyId,
  agreements,
}: {
  propertyId: string;
  agreements: AgreementRow[];
}) {
  const current =
    agreements.find((a) => a.status !== "CANCELLED") ?? agreements[0] ?? null;
  const cancelledHistory = agreements.filter((a) => a.status === "CANCELLED");
  const hasOpen =
    !!current &&
    (current.status === "DRAFT" || current.status === "SENT");

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-medium text-stone-900">
            Management agreement
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            12-month management contract with the owner.
            Auto-issued on verification; owner signs through their
            portal.
          </p>
        </div>
        <ReissueAgreementButton
          propertyId={propertyId}
          hasOpenAgreement={hasOpen}
        />
      </div>

      {!current ? (
        <p className="mt-5 text-sm text-stone-500">
          No agreement on file yet. Mark the property verified to
          auto-issue one, or click reissue above.
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${AGREEMENT_STATUS_CLASSES[current.status]}`}
            >
              {AGREEMENT_STATUS_LABEL[current.status]}
            </span>
            <span className="text-xs text-stone-500">
              Issued{" "}
              {current.generatedAt.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
              {current.signedAt
                ? ` · signed ${current.signedAt.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })} by ${current.signedByName ?? "—"}`
                : current.sentAt
                  ? ` · sent ${current.sentAt.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}`
                  : ""}
            </span>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm sm:grid-cols-4">
            <Term label="Term" value={`${current.termMonths} months`} />
            <Term
              label="Commission"
              value={formatCommissionPct(current.commissionRate)}
            />
            <Term
              label="Notice"
              value={`${current.noticePeriodDays} days`}
            />
            <Term
              label="Early-exit fee"
              value={formatMoney(
                current.earlyExitFee,
                current.earlyExitFeeCurrency,
              )}
            />
          </dl>
          {current.status === "SIGNED" && current.documentId ? (
            <a
              href={`/admin/documents/${current.documentId}/download`}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center text-sm font-medium text-stone-700 underline-offset-2 hover:underline"
            >
              Download signed PDF →
            </a>
          ) : current.status === "SENT" ? (
            <p className="text-xs text-stone-500">
              Owner can sign at /owner/agreements/{current.id}
            </p>
          ) : null}
        </div>
      )}

      {cancelledHistory.length > 0 ? (
        <p className="mt-4 border-t border-stone-100 pt-3 text-xs text-stone-500">
          {cancelledHistory.length} earlier{" "}
          {cancelledHistory.length === 1 ? "version" : "versions"} cancelled
          and superseded.
        </p>
      ) : null}
    </div>
  );
}

function Term({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wider text-stone-500">
        {label}
      </dt>
      <dd className="mt-1 font-serif text-base text-stone-900">{value}</dd>
    </div>
  );
}
