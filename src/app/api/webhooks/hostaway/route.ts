// POST /api/webhooks/hostaway — receives reservation.* events from
// Hostaway and upserts a Booking row + emits the matching
// Transaction rows (gross / OTA fee / cleaning) idempotently.
//
// Auth: HMAC-SHA256 over the raw request body, secret in
// HOSTAWAY_WEBHOOK_SECRET. On signature failure we return 401 so
// Hostaway retries; on a malformed payload or unknown listing we
// return 200 to avoid an infinite retry loop, but log the reason.
//
// Idempotency: Booking is keyed on (source, externalId) which is a
// unique index, so we use upsert. Transactions are idempotent via
// the bookingId-grouped check (we only emit if the booking has zero
// transactions yet).

import { NextResponse } from "next/server";
import { TransactionDirection, TransactionType } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  mapHostawayReservation,
  type HostawayReservation,
} from "@/lib/hostaway/mapper";
import { verifyHostawaySignature } from "@/lib/hostaway/signature";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type HostawayEvent = {
  event?: string; // e.g. "reservation.created"
  reservation?: HostawayReservation;
  // Some Hostaway tenants flatten the payload at the top level.
  id?: number | string;
};

export async function POST(request: Request) {
  const secret = process.env.HOSTAWAY_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Webhook secret not configured" },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-hostaway-signature");
  if (!verifyHostawaySignature(rawBody, signature, secret)) {
    return NextResponse.json(
      { ok: false, error: "Invalid signature" },
      { status: 401 },
    );
  }

  let payload: HostawayEvent;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed JSON" },
      { status: 200 },
    );
  }

  // Accept both the nested `reservation` shape and a flat shape (some
  // Hostaway accounts post the reservation fields at the top level).
  const reservation = payload.reservation ?? (payload as HostawayReservation);
  const mapped = mapHostawayReservation(reservation);
  if (!mapped) {
    return NextResponse.json(
      { ok: true, ignored: "unmappable_payload" },
      { status: 200 },
    );
  }

  const property = await prisma.property.findUnique({
    where: { hostawayListingId: mapped.hostawayListingId },
    select: { id: true },
  });
  if (!property) {
    // Unknown listing — don't make Hostaway retry forever.
    return NextResponse.json(
      { ok: true, ignored: "unknown_listing" },
      { status: 200 },
    );
  }

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
      cleaningFee: mapped.cleaningFee,
      netPayout: mapped.netPayout,
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
      cleaningFee: mapped.cleaningFee,
      netPayout: mapped.netPayout,
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
    if (mapped.cleaningFee > 0) {
      rows.push({
        type: TransactionType.CLEANING_FEE,
        direction: TransactionDirection.OUTFLOW,
        amount: mapped.cleaningFee,
        description: "Turnover cleaning",
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

  return NextResponse.json({
    ok: true,
    bookingId: booking.id,
    propertyId: property.id,
  });
}
