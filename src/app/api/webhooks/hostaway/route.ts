// POST /api/webhooks/hostaway — receives reservation.* events from
// Hostaway and upserts a Booking row + emits the matching
// Transaction rows (gross / OTA fee / cleaning) idempotently.
//
// Auth: HTTP Basic, credentials in HOSTAWAY_WEBHOOK_USER and
// HOSTAWAY_WEBHOOK_PASSWORD, matching the login and password set on
// the webhook in Hostaway. Hostaway does not sign webhook bodies, so
// Basic is the only protection on offer; see lib/hostaway/auth.ts.
//
// On bad credentials we return 401 so Hostaway retries. On a payload
// we cannot map or a listing we do not manage we return 200, because
// Hostaway posts every reservation on the account and emails the
// owner after three failures, so refusing them would generate alerts
// for listings that are deliberately not in the portal.
//
// Idempotency: Booking is keyed on (source, externalId) which is a
// unique index, so we use upsert. Transactions are idempotent via
// the bookingId-grouped check (we only emit if the booking has zero
// transactions yet).

import { NextResponse } from "next/server";
import { TransactionDirection, TransactionType } from "@prisma/client";
import { prisma } from "@/lib/db";
import { applyStandardCleaning } from "@/lib/bookings/cleaning";
import {
  extractReservation,
  mapHostawayReservation,
} from "@/lib/hostaway/mapper";
import { verifyHostawayBasicAuth } from "@/lib/hostaway/auth";
import { notifyClientOfBooking } from "@/lib/bookings/notify";
import { SHORT_TERM_COMMISSION_RATE } from "@/lib/commission";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = process.env.HOSTAWAY_WEBHOOK_USER;
  const password = process.env.HOSTAWAY_WEBHOOK_PASSWORD;
  if (!user || !password) {
    return NextResponse.json(
      { ok: false, error: "Webhook credentials not configured" },
      { status: 500 },
    );
  }

  if (
    !verifyHostawayBasicAuth(
      request.headers.get("authorization"),
      user,
      password,
    )
  ) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: { "WWW-Authenticate": "Basic" } },
    );
  }

  const rawBody = await request.text();

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed JSON" },
      { status: 200 },
    );
  }

  const reservation = extractReservation(payload);
  const mapped = reservation ? mapHostawayReservation(reservation) : null;
  if (!mapped) {
    // Log the keys but never the values: a reservation payload
    // carries guest names and emails, and this lands in Vercel's log
    // drain. Keys alone are enough to tell a message event apart
    // from a reservation whose envelope has moved again.
    console.warn(
      "[hostaway] ignored payload, top-level keys:",
      payload && typeof payload === "object"
        ? Object.keys(payload as Record<string, unknown>).join(",")
        : typeof payload,
    );
    return NextResponse.json(
      { ok: true, ignored: "unmappable_payload" },
      { status: 200 },
    );
  }

  const property = await prisma.property.findUnique({
    where: { hostawayListingId: mapped.hostawayListingId },
    select: { id: true, cleaningFeePerStay: true },
  });
  if (!property) {
    // A listing we don't manage in the portal, or one whose
    // hostawayListingId has not been filled in yet. 200 rather than
    // an error: see the retry note at the top of the file.
    return NextResponse.json(
      { ok: true, ignored: "unknown_listing" },
      { status: 200 },
    );
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
    },
    update: {
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
    },
    include: { transactions: { select: { id: true } } },
  });

  // Emit transactions only on first ingest. If the booking is later
  // modified upstream we leave the existing transaction stream alone
  // — the operator can reconcile manually if amounts shift.
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

    await prisma.$transaction(
      rows.map((row) =>
        prisma.transaction.create({
          data: {
            propertyId: property.id,
            bookingId: booking.id,
            occurredOn: mapped.checkOut,
            type: row.type,
            direction: row.direction,
            amount: row.amount,
            currency: mapped.currency,
            description: row.description,
          },
        }),
      ),
    );
  }

  // Tell the client. Last, so a Resend problem cannot cost us the
  // booking row or the transactions, and non-throwing, so Hostaway is
  // never made to retry a payload we have already stored.
  //
  // Safe to call on every event despite the upsert firing on every
  // upstream modification: notifyClientOfBooking claims a
  // ClientNotification keyed on this bookingId before sending, so the
  // second and later events for the same reservation return
  // already-notified. A cancellation is a distinct kind, so a booking
  // can still produce one arrival email and one cancellation email.
  await notifyClientOfBooking(
    booking.id,
    mapped.status === "CANCELLED" ? "cancelled" : "received",
  );

  return NextResponse.json({
    ok: true,
    bookingId: booking.id,
    propertyId: property.id,
  });
}
