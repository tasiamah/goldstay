// /owner/properties/[id] — drill-down for a single property in the
// landlord's portfolio. Read-only: the active tenancy, the documents,
// and the full transaction history (newest first) for that one
// property. The dashboard sends them here when they click on a
// property name.
//
// We use findFirst with a scoped where clause (id + ownerId) so a
// landlord can never load another landlord's property by guessing
// the cuid. Returns notFound() instead of 403 to avoid leaking
// existence.
//
// Goldstay rents each property out as a whole, so we don't surface
// units in the UI even though Lease still FKs into Unit at the
// schema level. The active lease is read by walking the property's
// implicit unit and is presented as a tenancy summary.

import Link from "next/link";
import { notFound } from "next/navigation";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { PropertyTypeBadge } from "@/components/PropertyStatusBadge";
import {
  PropertyReadinessBadge,
  PropertyReadinessSummary,
} from "@/components/owner/PropertyReadinessBadge";
import { computePropertyReadiness } from "@/lib/owner/property-readiness";
import { computeSetupChecklist } from "@/lib/owner/setup-status";
import { listPayoutMethodsFor } from "@/lib/payouts";
import {
  labelForRequiredDoc,
  missingPropertyDocKinds,
} from "@/lib/owner/property-documents";
import {
  OccupancyCalendar,
  clampHeatmapMonths,
  heatmapWindowStart,
  HEATMAP_MAX_MONTHS,
  HEATMAP_STEP,
} from "@/components/OccupancyCalendar";
import { formatPropertyDisplayName } from "@/lib/format-property";
import { SOURCE_LABEL } from "@/lib/booking-sources";
import {
  occupancyPercentForPeriod,
  revenueTotalsByCurrency,
  type BookingLike,
} from "@/lib/bookings/aggregate";
import { OwnerPropertyDocumentUploader } from "./OwnerPropertyDocumentUploader";
import { OwnerPropertyDocumentRow } from "./OwnerPropertyDocumentRow";

const DOCUMENT_KIND_LABELS: Record<string, string> = {
  TITLE_DEED: "Title deed",
  SALE_AGREEMENT: "Sale agreement",
  LEASE: "Lease",
  KYC: "KYC",
  ID_DOCUMENT: "ID document",
  PROOF_OF_PAYOUT_ACCOUNT: "Proof of payout account",
  INVOICE: "Invoice",
  RECEIPT: "Receipt",
  STATEMENT: "Statement",
  PHOTO: "Photo",
  MANAGEMENT_AGREEMENT: "Management agreement",
  OTHER: "Other",
};

export const dynamic = "force-dynamic";

export default async function OwnerPropertyDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { heatmap?: string };
}) {
  const { owner } = await requireOwner();

  // Heatmap window grows in 3-month steps from 3 → 12 via ?heatmap=N.
  // Same logic as the admin view so the URL behaves the same on both
  // sides of the platform.
  const heatmapMonthsBack = clampHeatmapMonths(searchParams?.heatmap);
  const heatmapStart = heatmapWindowStart(new Date(), heatmapMonthsBack);

  const property = await prisma.property.findFirst({
    where: { id: params.id, ownerId: owner.id },
    include: {
      units: {
        orderBy: { createdAt: "asc" },
        include: {
          leases: {
            where: { status: "ACTIVE" },
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
        },
      },
      transactions: {
        orderBy: { occurredOn: "desc" },
        take: 100,
        include: {
          lease: { select: { tenantName: true } },
        },
      },
      // Bookings overlapping the heatmap window — same query feeds the
      // calendar and the recent stays card.
      bookings: {
        where: { checkOut: { gte: heatmapStart } },
        orderBy: { checkIn: "desc" },
      },
      // Most recent management agreement, if any. We highlight the
      // status on the property header so an unsigned contract is
      // visible from the property view as well as the dashboard banner.
      agreements: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!property) notFound();

  // Setup completeness drives the readiness badge below. Two cheap
  // reads — same shape the dashboard uses — so the property header
  // can show "what's missing" without a navigation back to /owner.
  const [payoutMethods, kycCounts] = await Promise.all([
    listPayoutMethodsFor(owner.id, { includeArchived: false }),
    prisma.document.groupBy({
      by: ["kind"],
      where: {
        ownerId: owner.id,
        kind: { in: ["ID_DOCUMENT", "PROOF_OF_PAYOUT_ACCOUNT"] },
      },
      _count: { _all: true },
    }),
  ]);
  const kycByKind = Object.fromEntries(
    kycCounts.map((c) => [c.kind, c._count._all]),
  );
  const setupChecklist = computeSetupChecklist({
    owner: {
      fullName: owner.fullName,
      phone: owner.phone,
      address: owner.address,
      entityType: owner.entityType,
      companyName: owner.companyName,
    },
    hasIdDocument: (kycByKind.ID_DOCUMENT ?? 0) > 0,
    hasProofOfAccount: (kycByKind.PROOF_OF_PAYOUT_ACCOUNT ?? 0) > 0,
    payoutMethodCount: payoutMethods.length,
  });

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
  const occupancyLabel = activeLease ? "Occupied" : "Vacant";

  // Short-term occupancy and gross revenue for the last 30 days, used
  // both in the stat row and to colour the calendar.
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

  const latestAgreement = property.agreements[0] ?? null;
  const readiness = computePropertyReadiness({
    propertyStatus: property.status,
    hasPendingAgreement:
      latestAgreement != null && latestAgreement.status === "SENT",
    setupComplete: setupChecklist.doneCount === setupChecklist.totalCount,
  });

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/owner"
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← Overview
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-serif text-stone-900">
            {formatPropertyDisplayName(property.name, property.unitNumber)}
          </h2>
          <PropertyReadinessBadge
            status={property.status}
            ownerSideDone={readiness.ownerSideDone}
          />
          <PropertyTypeBadge type={property.propertyType} />
        </div>
        <p className="mt-1 text-sm text-stone-500">
          {property.neighbourhood ? `${property.neighbourhood}, ` : ""}
          {property.city} ·{" "}
          {property.country === "KE" ? "Kenya" : "Ghana"}
        </p>
        <PropertyReadinessSummary readiness={readiness} />
      </div>

      {latestAgreement && latestAgreement.status === "SENT" ? (
        <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wider text-amber-900/80">
                Action required
              </p>
              <h2 className="mt-1 text-base font-medium text-amber-950">
                Sign your management agreement
              </h2>
              <p className="mt-1 text-sm text-amber-900/80">
                We need a signed agreement on file before payouts can be
                released. About two minutes to review and sign.
              </p>
            </div>
            <Link
              href={`/owner/agreements/${latestAgreement.id}`}
              className="shrink-0 rounded-md bg-amber-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-amber-800"
            >
              Review and sign
            </Link>
          </div>
        </section>
      ) : null}

      <section className="grid grid-cols-3 gap-4">
        {isShortTerm ? (
          <>
            <Stat
              label="Occupancy (30d)"
              value={occPct30 === null ? "No bookings" : `${occPct30}%`}
            />
            <Stat label="Bedrooms" value={property.bedrooms ?? "Not set"} />
            <Stat
              label="Gross (30d)"
              value={
                revenue30.length === 0
                  ? "No revenue"
                  : `${revenue30[0].currency} ${fmt(revenue30[0].gross)}`
              }
            />
          </>
        ) : (
          <>
            <Stat label="Status" value={occupancyLabel} />
            <Stat label="Bedrooms" value={property.bedrooms ?? "Not set"} />
            <Stat
              label="Monthly rent"
              value={
                activeLease
                  ? `${activeLease.currency} ${fmt(Number(activeLease.monthlyRent))}`
                  : "No active lease"
              }
            />
          </>
        )}
      </section>

      {isShortTerm ? (
        <Card title={`Last ${heatmapMonthsBack} months`}>
          <div className="mt-4">
            <OccupancyCalendar
              bookings={property.bookings}
              monthsBack={heatmapMonthsBack}
              loadMoreHref={heatmapLoadMoreHref}
            />
          </div>
        </Card>
      ) : null}

      <section className="grid gap-8 lg:grid-cols-2">
        {isShortTerm ? (
          <Card title="Recent stays">
            {property.bookings.length === 0 ? (
              <p className="mt-4 text-sm text-stone-500">
                No bookings recorded yet for this property.
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-stone-100">
                {property.bookings.slice(0, 8).map((b) => (
                  <li
                    key={b.id}
                    className="flex items-start justify-between gap-4 py-3"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-stone-900">
                        {b.guestName}
                      </p>
                      <p className="mt-0.5 text-xs text-stone-500">
                        {SOURCE_LABEL[b.source]}
                        {" · "}
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
                        · {b.nights}{" "}
                        {b.nights === 1 ? "night" : "nights"}
                      </p>
                    </div>
                    <p className="shrink-0 text-right text-sm tabular-nums text-stone-900">
                      {b.currency} {fmt(Number(b.netPayout))}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        ) : (
          <Card title="Tenancy">
            {activeLease ? (
              <div className="mt-4 space-y-1">
                <p className="font-medium text-stone-900">
                  {activeLease.tenantName}
                </p>
                <p className="text-sm text-stone-500">
                  {activeLease.currency}{" "}
                  {fmt(Number(activeLease.monthlyRent))}/mo · since{" "}
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
                No active tenant. Goldstay will update this once the next
                lease is in place.
              </p>
            )}
          </Card>
        )}

        <Card title="Documents">
          {(() => {
            // We treat any uploaded document of a required kind as
            // "supplied" for the missing-kinds check — even if it's
            // still pending verification — because the owner has done
            // their part. The pending badge on the row tells them
            // Goldstay still needs to look at it. This split avoids
            // the previous "We still need title deed" callout
            // re-appearing the moment they upload one.
            const uploadedKinds = property.documents.map((d) => d.kind);
            const missing = missingPropertyDocKinds(uploadedKinds);
            if (missing.length === 0) return null;
            const primaryMissing = missing[0];
            return (
              <div className="mt-3 rounded-md border border-amber-200 bg-amber-50/60 px-4 py-3">
                <p className="text-xs font-medium uppercase tracking-wider text-amber-900">
                  We still need
                </p>
                <ul className="mt-1 space-y-0.5">
                  {missing.map((kind) => (
                    <li
                      key={kind}
                      className="flex items-center gap-2 text-sm text-amber-900"
                    >
                      <span
                        aria-hidden
                        className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500"
                      />
                      {labelForRequiredDoc(kind)}
                    </li>
                  ))}
                </ul>
                <p className="mt-2 text-xs text-amber-900/80">
                  Upload these below — a phone photo or PDF is fine.
                  Goldstay will verify and confirm, usually within one
                  working day.
                </p>
                <div className="mt-3 rounded-md border border-amber-200 bg-white p-3">
                  <OwnerPropertyDocumentUploader
                    propertyId={property.id}
                    presetKind={
                      primaryMissing === "TITLE_DEED" ||
                      primaryMissing === "SALE_AGREEMENT" ||
                      primaryMissing === "LEASE" ||
                      primaryMissing === "PHOTO" ||
                      primaryMissing === "OTHER"
                        ? primaryMissing
                        : undefined
                    }
                  />
                </div>
              </div>
            );
          })()}

          {property.documents.length === 0 ? (
            <p className="mt-4 text-sm text-stone-500">
              No paperwork on file for this property yet. Upload your
              title deed (or any other proof of ownership) below — a
              phone photo of the original is fine. Goldstay will review
              and verify the document, usually within one working day.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-stone-100">
              {property.documents.map((d) => {
                const isOwnerUpload = d.uploadedBy === owner.email;
                return (
                  <li
                    key={d.id}
                    className="flex flex-col gap-2 py-3 sm:flex-row sm:items-start sm:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <a
                          href={`/owner/documents/${d.id}/download`}
                          target="_blank"
                          rel="noopener"
                          className="truncate font-medium text-stone-900 hover:underline"
                        >
                          {d.title}
                        </a>
                        <DocumentVerificationBadge
                          verified={Boolean(d.verifiedAt)}
                        />
                      </div>
                      <p className="mt-0.5 text-xs text-stone-500">
                        {DOCUMENT_KIND_LABELS[d.kind] ?? d.kind}
                        {d.sizeBytes
                          ? ` · ${formatBytes(d.sizeBytes)}`
                          : ""}
                        {" · "}
                        Uploaded{" "}
                        {d.createdAt.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        {isOwnerUpload ? " by you" : " by Goldstay"}
                      </p>
                    </div>
                    {isOwnerUpload && !d.verifiedAt ? (
                      <OwnerPropertyDocumentRow
                        documentId={d.id}
                        title={d.title}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}

          {property.documents.length > 0 ? (
            <div className="mt-6 border-t border-stone-100 pt-5">
              <h4 className="text-sm font-medium text-stone-900">
                Add another document
              </h4>
              <p className="mt-0.5 text-xs text-stone-500">
                Title deeds, sale agreements, leases, or photos. New
                uploads land as pending until Goldstay verifies them.
              </p>
              <div className="mt-3">
                <OwnerPropertyDocumentUploader propertyId={property.id} />
              </div>
            </div>
          ) : null}
        </Card>
      </section>

      <Card title="Transaction history">
        <p className="mt-1 text-sm text-stone-500">
          Up to the last 100 transactions for this property. Need a
          formal record? Download the{" "}
          <Link
            href="/owner/statements"
            className="text-stone-900 underline-offset-2 hover:underline"
          >
            monthly statement PDF
          </Link>
          .
        </p>
        {property.transactions.length === 0 ? (
          <p className="mt-4 text-sm text-stone-500">
            No transactions recorded yet for this property.
          </p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-md border border-stone-200">
            <table className="min-w-full divide-y divide-stone-200">
              <thead className="bg-stone-50">
                <tr>
                  <Th>Date</Th>
                  <Th>Type</Th>
                  <Th>Detail</Th>
                  <Th align="right">Amount</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 bg-white">
                {property.transactions.map((t) => (
                  <tr key={t.id}>
                    <td className="px-4 py-2.5 text-sm text-stone-700">
                      {t.occurredOn.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-stone-700">
                      {t.type.replace(/_/g, " ")}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-stone-500">
                      {[t.description, t.lease?.tenantName, t.reference]
                        .filter(Boolean)
                        .join(" · ") || (
                        <span className="italic text-stone-400">
                          No description
                        </span>
                      )}
                    </td>
                    <td
                      className={`px-4 py-2.5 text-right text-sm tabular-nums ${
                        t.direction === "INFLOW"
                          ? "text-emerald-700"
                          : "text-red-700"
                      }`}
                    >
                      {t.direction === "INFLOW" ? "+" : "−"}
                      {fmt(Number(t.amount))} {t.currency}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
}: {
  label: string;
  value: number | string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wider text-stone-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-serif text-stone-900">{value}</p>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-white p-6">
      <h3 className="text-base font-medium text-stone-900">{title}</h3>
      {children}
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

// Per-document badge mirroring the OwnerKycSlot vocabulary: amber
// while Goldstay still has to look at the file, emerald once an
// admin has stamped Document.verifiedAt. Pure presentational; the
// authoritative state lives on the row.
function DocumentVerificationBadge({ verified }: { verified: boolean }) {
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
      Pending verification
    </span>
  );
}

function fmt(n: number): string {
  return n.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}
