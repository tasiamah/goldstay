import Link from "next/link";
import { notFound } from "next/navigation";
import type { AgreementTemplate, SigningCapacity } from "@prisma/client";
import { prisma } from "@/lib/db";
import { PropertyForm } from "../PropertyForm";
import { updatePropertyAction } from "../actions";
import { DocumentUploader } from "./documents/DocumentUploader";
import { DeleteDocumentButton } from "./documents/DeleteDocumentButton";
import { VerifyDocumentButton } from "./documents/VerifyDocumentButton";
import { PropertyLifecycleActions } from "./PropertyLifecycleActions";
import {
  PropertyStatusBadge,
  PropertyTypeBadge,
} from "@/components/PropertyStatusBadge";
import { formatPropertyDisplayName } from "@/lib/format-property";
import { formatClientDisplayName } from "@/lib/format-client";
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
import { AGREEMENT_TEMPLATE_TITLE } from "@/lib/agreements/template";
import { SIGNING_CAPACITY_LABEL } from "@/lib/signing-capacity";
import { SOURCE_LABEL } from "@/lib/booking-sources";
import {
  occupancyPercentForPeriod,
  revenueTotalsByCurrency,
  type BookingLike,
} from "@/lib/bookings/aggregate";
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";
import { Tip } from "@/components/admin/Tip";
import { NotesPanel } from "@/components/admin/notes/NotesPanel";
import { TasksPanel } from "@/components/admin/tasks/TasksPanel";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { PropertyFinanceCard } from "@/components/admin/finance/PropertyFinanceCard";

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
      client: {
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
        select: {
          id: true,
          title: true,
          kind: true,
          sizeBytes: true,
          createdAt: true,
          verifiedAt: true,
          uploadedBy: true,
          storagePath: true,
        },
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

  // Which step of the go-live sequence this property is at. Derived
  // from the same rule the server action enforces, so the button can
  // never offer an action that will be refused. Cancelled agreements
  // are withdrawn offers and must not hold a property back.
  const liveAgreements = property.agreements.filter(
    (a) => a.status !== "CANCELLED",
  );
  const agreementStage: "none" | "awaiting_acceptance" | "accepted" =
    liveAgreements.length === 0
      ? "none"
      : liveAgreements.some((a) => a.status === "SIGNED")
        ? "accepted"
        : "awaiting_acceptance";

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

  return (
    <div className="space-y-8">
      <div>
        <Breadcrumbs
          items={[
            { label: "Properties", href: "/admin/properties" },
            {
              label: formatClientDisplayName(property.client),
              href: `/admin/clients/${property.client.id}`,
            },
            {
              label: formatPropertyDisplayName(
                property.name,
                property.unitNumber,
              ),
            },
          ]}
        />
        <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-medium text-stone-900">
                {formatPropertyDisplayName(property.name, property.unitNumber)}
              </h2>
              <Tip term={<PropertyStatusBadge status={property.status} />}>
                ONBOARDING: verifying documents.
                ACTIVE: under management; statements run.
                EXITED: left the portfolio; data retained.
              </Tip>
              <Tip term={<PropertyTypeBadge type={property.propertyType} />}>
                LONG_TERM rents to a single tenant under a Lease.
                SHORT_TERM lights up the calendar from Bookings
                (Airbnb, Booking.com, direct).
              </Tip>
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
            agreementStage={agreementStage}
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
                  {occPct30 === null ? (
                    <span className="text-sm font-sans text-stone-400">
                      No bookings yet
                    </span>
                  ) : (
                    `${occPct30}%`
                  )}
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
            Updates are visible to the client on next page load.
          </p>
          <div className="mt-5">
            <PropertyForm
              action={boundUpdate}
              clientCountry={property.client.country}
              isEditing
              defaults={{
                clientId: property.client.id,
                name: property.name,
                unitNumber: property.unitNumber,
                city: property.city,
                neighbourhood: property.neighbourhood,
                address: property.address,
                description: property.description,
                bedrooms: property.bedrooms,
                bathrooms: property.bathrooms,
                sizeSqm: property.sizeSqm,
                status: property.status,
                propertyType: property.propertyType,
                signingCapacity: property.signingCapacity,
                maxOccupancy: property.maxOccupancy,
                startupCostsBudget: property.startupCostsBudget?.toString(),
                operatingReserve: property.operatingReserve?.toString(),
                // A date input needs yyyy-mm-dd, and the column is a
                // calendar date rather than an instant, so slice off
                // the UTC time rather than going through local time.
                launchedAt:
                  property.launchedAt?.toISOString().slice(0, 10) ?? null,
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
                  Free alternative to a paid PMS: dates only, no guest data
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
                signingCapacity: a.signingCapacity,
                template: a.template,
                reference: a.reference,
                generatedAt: a.generatedAt,
                sentAt: a.sentAt,
                signedAt: a.signedAt,
                signedByName: a.signedByName,
                acceptanceReference: a.acceptanceReference,
                documentId: a.documentId,
              }))}
              propertySigningCapacity={property.signingCapacity}
            />
          ) : null}

          <div className="rounded-lg border border-stone-200 bg-white p-6">
            <h3 className="text-base font-medium text-stone-900">
              Documents
            </h3>
            <p className="mt-1 text-sm text-stone-500">
              Title deeds, sale agreements, leases, invoices, and any
              other paperwork backing this property. Visible to the
              client on their portal.
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
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`/admin/documents/${d.id}/download`}
                          target="_blank"
                          rel="noopener"
                          className="truncate font-medium text-stone-900 hover:underline"
                        >
                          {d.title}
                        </a>
                        <AdminDocumentVerificationBadge
                          verified={Boolean(d.verifiedAt)}
                        />
                      </div>
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
                        {d.uploadedBy ? ` · uploaded by ${d.uploadedBy}` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <VerifyDocumentButton
                        documentId={d.id}
                        verified={Boolean(d.verifiedAt)}
                      />
                      <DeleteDocumentButton
                        documentId={d.id}
                        title={d.title}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </section>

      <PropertyFinanceCard propertyId={property.id} />

      <section className="grid gap-8 lg:grid-cols-2">
        <NotesPanel
          entity="PROPERTY"
          entityId={property.id}
          returnPath={`/admin/properties/${property.id}`}
        />
        <TasksPanel
          entity="PROPERTY"
          entityId={property.id}
          returnPath={`/admin/properties/${property.id}`}
        />
      </section>
      <ActivityTimeline
        entity="PROPERTY"
        entityId={property.id}
        clientId={property.client.id}
      />
    </div>
  );
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

// Mirror of the client-side badge; same vocabulary so admins and
// landlords describe the same row the same way during a support
// call. Local to the admin page because the styling differs
// slightly (smaller, sits inline with the title) — extracting to a
// shared component would force both pages to agree on the wrapper
// markup, which we don't want yet.
function AdminDocumentVerificationBadge({
  verified,
}: {
  verified: boolean;
}) {
  if (verified) {
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-800">
        <svg
          width="10"
          height="10"
          viewBox="0 0 12 12"
          aria-hidden
          fill="none"
        >
          <path
            d="M2.5 6.5l2.5 2.5L9.5 4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        Verified
      </span>
    );
  }
  return (
    <span className="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
      Pending
    </span>
  );
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
  signingCapacity: SigningCapacity;
  template: AgreementTemplate;
  reference: string | null;
  generatedAt: Date;
  sentAt: Date | null;
  signedAt: Date | null;
  signedByName: string | null;
  acceptanceReference: string | null;
  documentId: string | null;
};

function AgreementCard({
  propertyId,
  agreements,
  propertySigningCapacity,
}: {
  propertyId: string;
  agreements: AgreementRow[];
  // The property's current capacity, which can differ from the one
  // snapshotted on the agreement if someone corrected it after issue.
  // We show the drift rather than hide it, because the fix is to
  // reissue and the operator needs to know that.
  propertySigningCapacity: SigningCapacity;
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
            {current
              ? AGREEMENT_TEMPLATE_TITLE[current.template]
              : "Management agreement"}
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Auto-issued on verification; the client accepts it in one
            click through their portal.
            {current?.reference ? ` Reference ${current.reference}.` : ""}
          </p>
        </div>
        <ReissueAgreementButton
          propertyId={propertyId}
          hasOpenAgreement={hasOpen}
        />
      </div>

      {!current ? (
        <p className="mt-5 text-sm text-stone-500">
          No agreement on file. Properties now get one automatically at
          creation, so this one predates that — click reissue above, or
          “Mark as live”, to send the client an agreement.
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
                  })} by ${current.signedByName ?? "(unknown)"}`
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
            {current.template === "SHORT_LET_KE_V1" ? (
              // Clause 10.3 sets early exit at unrecovered Startup
              // Costs, which are only known once incurred. Printing a
              // number here would misstate what we can actually
              // charge, so we state the basis instead.
              <Term label="Early exit" value="Unrecovered startup costs" />
            ) : (
              <Term
                label="Early-exit fee"
                value={formatMoney(
                  current.earlyExitFee,
                  current.earlyExitFeeCurrency,
                )}
              />
            )}
            <Term
              label="Signed as"
              value={SIGNING_CAPACITY_LABEL[current.signingCapacity]}
            />
          </dl>

          {current.signingCapacity !== propertySigningCapacity ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              This agreement carries the authority clause for{" "}
              <strong>
                {SIGNING_CAPACITY_LABEL[current.signingCapacity].toLowerCase()}
              </strong>
              , but the property is now set to{" "}
              <strong>
                {SIGNING_CAPACITY_LABEL[propertySigningCapacity].toLowerCase()}
              </strong>
              . Reissue the agreement so the clause matches the paperwork.
            </p>
          ) : null}
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
              Client can accept at /client/agreements/{current.id}
            </p>
          ) : null}

          {current.acceptanceReference ? (
            <p className="text-xs text-stone-500">
              Acceptance receipt{" "}
              <span className="font-mono">{current.acceptanceReference}</span>
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
