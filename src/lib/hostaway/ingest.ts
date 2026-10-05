// Turning one Hostaway reservation into a Booking plus its
// Transaction rows.
//
// Extracted from the webhook route so the importer and the webhook
// cannot drift. They are the same operation arriving by different
// doors: one is pushed when a guest books, the other is pulled when
// an operator backfills a period the webhook was not yet listening
// for. If the commission or cleaning rules lived in the route, a
// backfilled month would silently be priced differently from a live
// one.
//
// Two things differ by door, and both are parameters rather than
// guesses:
//
//   notify — a live booking emails the client. A backfill must not,
//   or importing six months of history would send the owner dozens
//   of "new booking" emails for stays that already ended.
//
//   supersedePlaceholders — an iCal feed carries dates and no money,
//   so a property synced that way already holds zero-gross rows for
//   stays Hostaway is now telling us the real figures for. Left
//   alone, the statement would count the stay twice: once from the
//   placeholder and once from the real reservation.

import {
  BookingSource,
  type PrismaClient,
  TransactionDirection,
  TransactionType,
} from "@prisma/client";

import { applyStandardCleaning } from "@/lib/bookings/cleaning";
import { notifyClientOfBooking } from "@/lib/bookings/notify";
import { SHORT_TERM_COMMISSION_RATE } from "@/lib/commission";
import {
  isNonBooking,
  mapHostawayReservation,
  type HostawayReservation,
} from "./mapper";

const ICAL_PREFIX = "ical:";

export type IngestResult =
  | { status: "unmappable" }
  | { status: "not_a_booking"; reservationStatus: string }
  | { status: "unknown_listing"; listingId: string }
  | {
      status: "ingested";
      bookingId: string;
      propertyId: string;
      created: boolean;
      transactionsCreated: number;
      placeholdersRemoved: number;
    };

export async function ingestHostawayReservation({
  prisma,
  reservation,
  notify,
  supersedePlaceholders = true,
}: {
  prisma: PrismaClient;
  reservation: HostawayReservation;
  notify: boolean;
  supersedePlaceholders?: boolean;
}): Promise<IngestResult> {
  // Checked before mapping. An enquiry carries dates and a price and
  // would map perfectly well into a booking nobody ever made.
  if (isNonBooking(reservation)) {
    return {
      status: "not_a_booking",
      reservationStatus: String(reservation.status),
    };
  }

  const mapped = mapHostawayReservation(reservation);
  if (!mapped) return { status: "unmappable" };

  const property = await prisma.property.findUnique({
    where: { hostawayListingId: mapped.hostawayListingId },
    select: { id: true, cleaningFeePerStay: true },
  });
  if (!property) {
    return { status: "unknown_listing", listingId: mapped.hostawayListingId };
  }

  // Hostaway sends cleaningFee only where the channel itemised one.
  // Where it didn't, the turnover still happened and still cost us,
  // so the standard rate stands in. Deterministic from the payload,
  // which matters because a reservation update re-runs this upsert:
  // the same reservation always resolves to the same figure rather
  // than stacking a second charge on each edit.
  const cleaning = applyStandardCleaning({
    currency: mapped.currency,
    grossAmount: mapped.grossAmount,
    cleaningFee: mapped.cleaningFee,
    netPayout: mapped.netPayout,
    propertyFee: property.cleaningFeePerStay
      ? Number(property.cleaningFeePerStay)
      : null,
  });

  const existing = await prisma.booking.findUnique({
    where: {
      source_externalId: {
        source: mapped.source,
        externalId: mapped.externalId,
      },
    },
    select: { id: true },
  });

  const financials = {
    guestName: mapped.guestName,
    guestEmail: mapped.guestEmail,
    checkIn: mapped.checkIn,
    checkOut: mapped.checkOut,
    nights: mapped.nights,
    grossAmount: mapped.grossAmount,
    otaCommission: mapped.otaCommission,
    cleaningFee: cleaning.cleaningFee,
    netPayout: cleaning.netPayout,
    currency: mapped.currency,
    status: mapped.status,
  };

  const booking = await prisma.booking.upsert({
    where: {
      source_externalId: {
        source: mapped.source,
        externalId: mapped.externalId,
      },
    },
    create: {
      propertyId: property.id,
      source: mapped.source,
      externalId: mapped.externalId,
      ...financials,
    },
    update: financials,
    include: { transactions: { select: { id: true } } },
  });

  const placeholdersRemoved = supersedePlaceholders
    ? await removeSupersededPlaceholders({
        prisma,
        propertyId: property.id,
        keepBookingId: booking.id,
        checkIn: mapped.checkIn,
        checkOut: mapped.checkOut,
      })
    : 0;

  // Emit transactions only on first ingest. If the booking is later
  // modified upstream we leave the existing transaction stream alone
  // — the operator can reconcile manually if amounts shift.
  let transactionsCreated = 0;
  if (booking.transactions.length === 0 && mapped.status !== "CANCELLED") {
    const rows: Array<{
      type: TransactionType;
      direction: TransactionDirection;
      amount: number;
      description: string;
    }> = [
      {
        type: TransactionType.RENT,
        direction: TransactionDirection.INFLOW,
        amount: mapped.grossAmount,
        description: `Gross from ${mapped.guestName}`,
      },
    ];
    if (mapped.otaCommission > 0) {
      rows.push({
        type: TransactionType.OTA_COMMISSION,
        direction: TransactionDirection.OUTFLOW,
        amount: mapped.otaCommission,
        description: `${mapped.source} commission`,
      });
    }
    if (cleaning.cleaningFee > 0) {
      rows.push({
        type: TransactionType.CLEANING_FEE,
        direction: TransactionDirection.OUTFLOW,
        amount: cleaning.cleaningFee,
        description: cleaning.applied
          ? "Turnover cleaning (standard rate)"
          : "Turnover cleaning",
      });
    }
    // Goldstay's 20% short-stay commission is auto-recorded against
    // the gross at the same time, so the client statement reconciles
    // without anyone having to write the row by hand. Bespoke client
    // rates can override this later via the (yet-to-add) per-client
    // commissionRate field.
    const goldstayCommission =
      Math.round(mapped.grossAmount * SHORT_TERM_COMMISSION_RATE * 100) / 100;
    if (goldstayCommission > 0) {
      rows.push({
        type: TransactionType.GOLDSTAY_COMMISSION,
        direction: TransactionDirection.OUTFLOW,
        amount: goldstayCommission,
        description: `Goldstay commission (${Math.round(
          SHORT_TERM_COMMISSION_RATE * 100,
        )}%)`,
      });
    }

    // Dated to check-in, matching buildShortTermSummary's rule that a
    // stay's money belongs whole to the period it began in. Dating
    // these to check-out instead put a stay spanning a month end in
    // one month's short-stay table and the next month's ledger, so
    // the two halves of the same statement disagreed about when the
    // guest paid.
    await prisma.$transaction(
      rows.map((row) =>
        prisma.transaction.create({
          data: {
            propertyId: property.id,
            bookingId: booking.id,
            occurredOn: mapped.checkIn,
            type: row.type,
            direction: row.direction,
            amount: row.amount,
            currency: mapped.currency,
            description: row.description,
          },
        }),
      ),
    );
    transactionsCreated = rows.length;
  }

  if (notify) {
    // Non-throwing, so a Resend problem cannot cost us the booking
    // row or the transactions. Safe to call on every event despite
    // the upsert firing on every upstream modification:
    // notifyClientOfBooking claims a ClientNotification keyed on
    // this bookingId before sending, so the second and later events
    // for the same reservation return already-notified.
    await notifyClientOfBooking(
      booking.id,
      mapped.status === "CANCELLED" ? "cancelled" : "received",
    );
  }

  return {
    status: "ingested",
    bookingId: booking.id,
    propertyId: property.id,
    created: !existing,
    transactionsCreated,
    placeholdersRemoved,
  };
}

// Drops the calendar-only rows an iCal feed left behind for a stay we
// now hold real figures for.
//
// Matched on exact dates rather than overlap: back-to-back stays
// share a date, because one guest's checkout is the next guest's
// check-in, and an overlap match would delete the neighbour's
// placeholder too.
//
// Only ever deletes rows that carry no money and no transactions. A
// placeholder with transactions against it is not a placeholder any
// more — someone has reconciled it by hand — and deleting it would
// take their work with it. The client's notification history is
// unaffected: ClientNotification.sourceRef is a plain string, not a
// foreign key, so the bell row for the stay survives.
async function removeSupersededPlaceholders({
  prisma,
  propertyId,
  keepBookingId,
  checkIn,
  checkOut,
}: {
  prisma: PrismaClient;
  propertyId: string;
  keepBookingId: string;
  checkIn: Date;
  checkOut: Date;
}): Promise<number> {
  const placeholders = await prisma.booking.findMany({
    where: {
      propertyId,
      id: { not: keepBookingId },
      checkIn,
      checkOut,
      grossAmount: 0,
      OR: [
        { externalId: { startsWith: ICAL_PREFIX } },
        { externalId: null },
      ],
    },
    select: { id: true, _count: { select: { transactions: true } } },
  });

  const deletable = placeholders
    .filter((p) => p._count.transactions === 0)
    .map((p) => p.id);
  if (deletable.length === 0) return 0;

  await prisma.booking.deleteMany({ where: { id: { in: deletable } } });
  return deletable.length;
}

export { BookingSource };
