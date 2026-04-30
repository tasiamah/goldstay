// /admin/bookings/[id] — edit a single booking. Two main use cases:
//
//   1. Backfilling financials on an iCal-imported placeholder
//      ("Reserved (Airbnb)" with zeroed money fields). Operator
//      copies gross / OTA fee / cleaning from the Airbnb dashboard
//      and saves; the existing transaction stream and statement PDF
//      pick it up automatically.
//
//   2. Correcting any field on a manually entered or Hostaway-
//      ingested booking before the next statement run.
//
// We surface a small "Source: Airbnb · external id" line in the
// header so the operator can match the row against the OTA dashboard
// without guessing.

import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { BookingForm } from "../BookingForm";
import { updateBookingAction } from "../actions";
import { DeleteBookingButton } from "./DeleteBookingButton";
import { SOURCE_LABEL } from "@/lib/booking-sources";

export const dynamic = "force-dynamic";

export default async function BookingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      property: {
        select: {
          id: true,
          name: true,
          country: true,
          owner: { select: { preferredCurrency: true } },
        },
      },
      transactions: {
        select: {
          id: true,
          type: true,
          direction: true,
          amount: true,
          currency: true,
          occurredOn: true,
          description: true,
        },
        orderBy: { occurredOn: "asc" },
      },
    },
  });

  if (!booking) notFound();

  const defaultCurrency =
    booking.property.country === "KE"
      ? "KES"
      : booking.property.country === "GH"
        ? "GHS"
        : (booking.property.owner.preferredCurrency ?? "USD");

  const boundUpdate = updateBookingAction.bind(null, booking.id);
  const isPlaceholder = Number(booking.grossAmount) === 0;

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <Link
          href={`/admin/properties/${booking.property.id}`}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          ← {booking.property.name}
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-medium text-stone-900">
              {booking.guestName}
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              {SOURCE_LABEL[booking.source] ?? booking.source}
              {booking.externalId ? ` · ${booking.externalId}` : ""}
            </p>
          </div>
          <DeleteBookingButton bookingId={booking.id} />
        </div>
      </div>

      {isPlaceholder ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          This booking was imported from an iCal feed. Financials are
          placeholders — fill in the real gross, OTA fee, cleaning, and
          payout from the {SOURCE_LABEL[booking.source]} dashboard so the
          owner statement reconciles.
        </div>
      ) : null}

      <div className="rounded-lg border border-stone-200 bg-white p-6">
        <BookingForm
          action={boundUpdate}
          defaults={{
            propertyId: booking.propertyId,
            source: booking.source,
            externalId: booking.externalId,
            guestName: booking.guestName,
            guestEmail: booking.guestEmail,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            grossAmount: booking.grossAmount.toString(),
            otaCommission: booking.otaCommission?.toString() ?? null,
            cleaningFee: booking.cleaningFee?.toString() ?? null,
            netPayout: booking.netPayout.toString(),
            currency: booking.currency,
            status: booking.status,
            notes: booking.notes,
          }}
          defaultCurrency={defaultCurrency}
          submitLabel="Save changes"
        />
      </div>

      {booking.transactions.length > 0 ? (
        <div className="rounded-lg border border-stone-200 bg-white p-6">
          <h3 className="text-base font-medium text-stone-900">
            Linked transactions
          </h3>
          <p className="mt-1 text-sm text-stone-500">
            Auto-emitted when the booking was first ingested. Edit them
            individually under{" "}
            <Link
              href="/admin/transactions"
              className="underline hover:text-stone-900"
            >
              Transactions
            </Link>{" "}
            if amounts need correcting.
          </p>
          <ul className="mt-4 divide-y divide-stone-100">
            {booking.transactions.map((t) => (
              <li
                key={t.id}
                className="flex items-start justify-between gap-4 py-2.5 text-sm"
              >
                <div>
                  <p className="font-medium text-stone-900">
                    {t.type.replace(/_/g, " ").toLowerCase()}
                  </p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    {t.occurredOn.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    {t.description ? ` · ${t.description}` : ""}
                  </p>
                </div>
                <p
                  className={`shrink-0 tabular-nums ${
                    t.direction === "INFLOW"
                      ? "text-emerald-700"
                      : "text-red-700"
                  }`}
                >
                  {t.direction === "INFLOW" ? "+" : "−"}
                  {Number(t.amount).toLocaleString("en-GB", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {t.currency}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
