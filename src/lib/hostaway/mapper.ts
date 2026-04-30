// Pure transform from Hostaway's reservation payload shape to our
// Booking row. Kept dependency-free (no Prisma) so the test suite can
// run it as a plain function and the route handler can compose it.
//
// We intentionally accept a permissive shape — Hostaway's API has
// historically renamed fields, and our defence is to fall back to
// reasonable zeros and refuse to crash. Anything we can't parse maps
// to a `null` so the caller can drop the message without retry.

import { BookingSource, BookingStatus } from "@prisma/client";

export type HostawayChannel = string | number;

// Channel id mapping per https://api.hostaway.com/documentation
// (subject to change; we only care about the four sources we model).
const HOSTAWAY_CHANNEL_TO_SOURCE: Record<string, BookingSource> = {
  "2018": BookingSource.AIRBNB,
  airbnb: BookingSource.AIRBNB,
  "2005": BookingSource.BOOKING_COM,
  bookingcom: BookingSource.BOOKING_COM,
  "2007": BookingSource.VRBO,
  homeaway: BookingSource.VRBO,
  vrbo: BookingSource.VRBO,
  "2000": BookingSource.DIRECT,
  direct: BookingSource.DIRECT,
};

const HOSTAWAY_STATUS_TO_BOOKING: Record<string, BookingStatus> = {
  new: BookingStatus.CONFIRMED,
  modified: BookingStatus.CONFIRMED,
  ownerStay: BookingStatus.CONFIRMED,
  cancelled: BookingStatus.CANCELLED,
  declined: BookingStatus.CANCELLED,
  expired: BookingStatus.CANCELLED,
  inquiry: BookingStatus.CONFIRMED,
  inquiryPreapproved: BookingStatus.CONFIRMED,
  inquiryDenied: BookingStatus.CANCELLED,
};

export type HostawayReservation = {
  id: number | string;
  channelId?: HostawayChannel;
  channelName?: string;
  status?: string;
  listingMapId?: number | string;
  listingId?: number | string;
  guestName?: string;
  guestEmail?: string;
  arrivalDate?: string; // YYYY-MM-DD
  departureDate?: string;
  nights?: number;
  totalPrice?: number | string;
  currency?: string;
  channelCommissionAmount?: number | string;
  hostPayout?: number | string;
  cleaningFee?: number | string;
};

export type MappedBooking = {
  externalId: string;
  hostawayListingId: string;
  source: BookingSource;
  status: BookingStatus;
  guestName: string;
  guestEmail: string | null;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  grossAmount: number;
  otaCommission: number;
  cleaningFee: number;
  netPayout: number;
  currency: string;
};

function toNumber(v: number | string | undefined | null): number {
  if (v === undefined || v === null) return 0;
  const n = typeof v === "number" ? v : parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function toDate(v: string | undefined): Date | null {
  if (!v) return null;
  // Anchor to UTC midnight so date arithmetic matches the rest of
  // the booking helpers.
  const d = new Date(`${v}T00:00:00.000Z`);
  return Number.isNaN(d.getTime()) ? null : d;
}

function lookupSource(reservation: HostawayReservation): BookingSource {
  const candidates = [
    reservation.channelId,
    reservation.channelName,
  ]
    .filter((v) => v !== undefined && v !== null)
    .map((v) => String(v).toLowerCase());

  for (const candidate of candidates) {
    const hit = HOSTAWAY_CHANNEL_TO_SOURCE[candidate];
    if (hit) return hit;
  }
  return BookingSource.DIRECT;
}

function lookupStatus(reservation: HostawayReservation): BookingStatus {
  if (!reservation.status) return BookingStatus.CONFIRMED;
  return (
    HOSTAWAY_STATUS_TO_BOOKING[reservation.status] ?? BookingStatus.CONFIRMED
  );
}

export function mapHostawayReservation(
  reservation: HostawayReservation,
): MappedBooking | null {
  const externalId =
    reservation.id !== undefined ? String(reservation.id) : null;
  const listingId =
    reservation.listingMapId !== undefined
      ? String(reservation.listingMapId)
      : reservation.listingId !== undefined
        ? String(reservation.listingId)
        : null;
  const checkIn = toDate(reservation.arrivalDate);
  const checkOut = toDate(reservation.departureDate);

  if (!externalId || !listingId || !checkIn || !checkOut) return null;
  if (checkOut <= checkIn) return null;

  const ms = checkOut.getTime() - checkIn.getTime();
  const nights =
    typeof reservation.nights === "number" && reservation.nights > 0
      ? Math.round(reservation.nights)
      : Math.round(ms / (1000 * 60 * 60 * 24));

  const grossAmount = toNumber(reservation.totalPrice);
  const otaCommission = toNumber(reservation.channelCommissionAmount);
  const cleaningFee = toNumber(reservation.cleaningFee);
  // Prefer Hostaway's hostPayout if present, otherwise derive it so
  // we never store a payout that disagrees with the components we
  // also store on the same row.
  const declaredPayout = toNumber(reservation.hostPayout);
  const derivedPayout =
    grossAmount - otaCommission - cleaningFee;
  const netPayout =
    declaredPayout > 0 ? declaredPayout : Math.max(0, derivedPayout);

  return {
    externalId,
    hostawayListingId: listingId,
    source: lookupSource(reservation),
    status: lookupStatus(reservation),
    guestName: reservation.guestName?.trim() || "Guest",
    guestEmail: reservation.guestEmail?.trim() || null,
    checkIn,
    checkOut,
    nights,
    grossAmount,
    otaCommission,
    cleaningFee,
    netPayout,
    currency: (reservation.currency ?? "KES").toUpperCase(),
  };
}
