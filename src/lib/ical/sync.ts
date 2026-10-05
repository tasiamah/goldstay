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
//
// A property can be fed by both a calendar feed and the Hostaway
// webhook at once, and the two describe the same reservations. The
// webhook is the better source because it carries the money, so this
// engine stands down on any stay a PMS booking already holds rather
// than writing a second, zero-value row beside it. What it keeps
// doing is the thing the webhook cannot: a feed is re-read in full
// every 15 minutes, so anything the webhook never delivered, after
// Hostaway's three retries have run out, still reaches the calendar
// here.
//
// It does not delete a placeholder that a PMS booking has since
// superseded. A Booking id is the sourceRef of the client's
// notification row, which is the bell item they can see and not only
// an idempotency lock (see bookings/notify.ts), so retiring one is an
// operator's call and not a cron's.

import type { BookingSource, PrismaClient } from "@prisma/client";
import { isCalendarBlock, type ParsedEvent } from "./parse";
import { nightsBetween } from "@/lib/bookings/nights";

export type IcalSyncResult = {
  imported: number;
  refreshed: number;
  skippedBlocks: number;
  skippedExisting: number;
  // Stays the feed describes that a PMS-sourced booking already
  // holds, so we left them alone. Expected to be the majority on a
  // property wired to the Hostaway webhook, and expected to be zero
  // on one that only has calendar feeds.
  skippedPmsCovered: number;
  // Bookings created by this run, in creation order. Returned rather
  // than acted on because notifying the client is the orchestrator's
  // job (run.ts): this engine takes an injected prisma so it can be
  // driven against a test double, and reaching out to Resend from
  // inside it would undo that.
  createdBookingIds: string[];
};

// Prefix the iCal UID with the source so we never clash with manual
// or Hostaway-sourced bookings, even on the off chance the same UID
// shows up in two channels.
const ICAL_PREFIX = "ical:";

function externalIdFor(source: BookingSource, uid: string): string {
  return `${ICAL_PREFIX}${source}:${uid}`;
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
    skippedPmsCovered: 0,
    createdBookingIds: [],
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

    // Nothing of ours covers this stay, so we are about to import it.
    // Before we do, check whether a PMS-sourced booking already holds
    // it. On a property wired to the Hostaway webhook the answer is
    // normally yes: Hostaway sends the same reservation the feed
    // describes, seconds after it is made, with the money attached.
    //
    // (source, externalId) cannot see that collision. Airbnb's iCal
    // UID and Hostaway's reservation id are unrelated values, so the
    // stay itself is the only join available.
    //
    // Exact dates rather than an overlap test, because back-to-back
    // stays share a date: one guest's checkout is the next one's
    // check-in, and an overlap test would suppress a real booking.
    // Both sides anchor to UTC midnight (parse.ts and the Hostaway
    // mapper), so the equality holds.
    const pmsHeld = await prisma.booking.findFirst({
      where: {
        propertyId,
        source,
        checkIn: event.start,
        checkOut: event.end,
        // A cancelled booking does not hold the dates. If the feed
        // still lists the stay, the calendar is the better authority
        // and we want the placeholder.
        status: { not: "CANCELLED" },
        // Anything this engine did not import. A Hostaway webhook row
        // carries the bare reservation id; a manually entered one
        // carries null, which needs saying explicitly because
        // `NOT (null LIKE 'ical:%')` is null in Postgres, not true.
        OR: [
          { externalId: null },
          { externalId: { not: { startsWith: ICAL_PREFIX } } },
        ],
      },
      select: { id: true },
    });

    if (pmsHeld) {
      result.skippedPmsCovered++;
      continue;
    }

    const created = await prisma.booking.create({
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
      select: { id: true },
    });
    result.createdBookingIds.push(created.id);
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
