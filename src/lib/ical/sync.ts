// Sync engine: takes a parsed iCal event stream + the property it
// belongs to, and upserts placeholder Booking rows so the occupancy
// calendar lights up automatically. Deliberately separate from the
// HTTP fetch so we can unit-test the upsert logic against an in-
// memory event list.
//
// Important: iCal feeds give us only dates. Money-related Booking
// fields are zeroed out and the operator backfills them later from
// the OTA dashboard via the admin form. We never overwrite
// financial data on a Booking that already has it — meaning, once
// the operator has typed in real numbers, subsequent iCal polls
// only refresh the dates / status, not the gross / fees / payout.

import type { BookingSource, PrismaClient } from "@prisma/client";
import { isCalendarBlock, type ParsedEvent } from "./parse";
import { nightsBetween } from "@/lib/bookings/nights";

export type IcalSyncResult = {
  imported: number;
  refreshed: number;
  skippedBlocks: number;
  skippedExisting: number;
};

// Prefix the iCal UID with the source so we never clash with manual
// or Hostaway-sourced bookings, even on the off chance the same UID
// shows up in two channels.
function externalIdFor(source: BookingSource, uid: string): string {
  return `ical:${source}:${uid}`;
}

export async function syncIcalEvents({
  prisma,
  propertyId,
  source,
  currency,
  events,
}: {
  prisma: PrismaClient;
  propertyId: string;
  source: BookingSource;
  currency: string;
  events: ParsedEvent[];
}): Promise<IcalSyncResult> {
  const result: IcalSyncResult = {
    imported: 0,
    refreshed: 0,
    skippedBlocks: 0,
    skippedExisting: 0,
  };

  for (const event of events) {
    if (isCalendarBlock(event.summary)) {
      result.skippedBlocks++;
      continue;
    }

    const externalId = externalIdFor(source, event.uid);
    const nights = nightsBetween(event.start, event.end);
    if (nights <= 0) continue;

    // Find any existing booking for this UID first so we can decide
    // whether to refresh dates only or create from scratch.
    const existing = await prisma.booking.findUnique({
      where: { source_externalId: { source, externalId } },
      select: { id: true, grossAmount: true },
    });

    if (existing) {
      // Refresh dates / status only; leave financials alone so the
      // operator's manual backfill is never clobbered.
      await prisma.booking.update({
        where: { id: existing.id },
        data: {
          checkIn: event.start,
          checkOut: event.end,
          nights,
          status: "CONFIRMED",
        },
      });
      // Distinguish a no-op refresh (already has financials) from a
      // first import for diagnostics. Anything > 0 means the
      // operator has touched it.
      if (Number(existing.grossAmount) > 0) {
        result.skippedExisting++;
      } else {
        result.refreshed++;
      }
      continue;
    }

    await prisma.booking.create({
      data: {
        propertyId,
        source,
        externalId,
        guestName: `Reserved (${friendlySource(source)})`,
        checkIn: event.start,
        checkOut: event.end,
        nights,
        grossAmount: 0,
        otaCommission: 0,
        cleaningFee: 0,
        netPayout: 0,
        currency,
        status: "CONFIRMED",
        notes: "Imported from iCal. Backfill financials when ready.",
      },
    });
    result.imported++;
  }

  return result;
}

function friendlySource(source: BookingSource): string {
  switch (source) {
    case "AIRBNB":
      return "Airbnb";
    case "BOOKING_COM":
      return "Booking.com";
    case "VRBO":
      return "Vrbo";
    default:
      return "iCal";
  }
}
