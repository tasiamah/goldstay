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
  // A booking that existed and then was called off. Kept, because it
  // is real history and may carry a refund.
  cancelled: BookingStatus.CANCELLED,
};

// Statuses that never became a stay: someone asked about dates, or a
// request lapsed or was turned down. Hostaway returns these from
// /reservations alongside real bookings and gives them a totalPrice,
// so treating them as bookings invents revenue — and because an
// enquiry usually covers the dates the guest went on to book, it
// invents it on top of the booking it turned into.
const NON_BOOKING_STATUSES = new Set([
  "inquiry",
  "inquiryPreapproved",
  "inquiryDenied",
  "inquiryTimedout",
  "inquiryNotPossible",
  "expired",
  "declined",
  "pending",
  "awaitingPayment",
]);

export function isNonBooking(reservation: HostawayReservation): boolean {
  return (
    typeof reservation.status === "string" &&
    NON_BOOKING_STATUSES.has(reservation.status)
  );
}

export type HostawayReservation = {
  id?: number | string;
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
  // Money fields are nullable, not merely absent. Hostaway returns an
  // explicit null for every fee it has no value for, so a type that
  // only allowed undefined would describe a payload we never receive.
  totalPrice?: number | string | null;
  currency?: string;
  channelCommissionAmount?: number | string | null;
  hostPayout?: number | string | null;
  cleaningFee?: number | string | null;
  // What the channel says it will actually pay out. On Airbnb
  // reservations this is the only honest payout figure: the account
  // we read leaves channelCommissionAmount null on every booking, so
  // deriving the fee from it would report that Airbnb took nothing.
  airbnbExpectedPayoutAmount?: number | string | null;
  financeField?: Array<{
    name?: string;
    total?: number | string | null;
  }> | null;
};

// Hostaway repeats the payout inside financeField as `airbnbPayoutSum`
// and the two have always agreed on this account, but the flat field
// is not documented as guaranteed, so we fall through to the array
// rather than silently reporting a zero payout if it disappears.
function channelPayout(reservation: HostawayReservation): number {
  const flat = toNumber(reservation.airbnbExpectedPayoutAmount);
  if (flat > 0) return flat;

  const declared = toNumber(reservation.hostPayout);
  if (declared > 0) return declared;

  for (const field of reservation.financeField ?? []) {
    if (field?.name === "airbnbPayoutSum") {
      const value = toNumber(field.total);
      if (value > 0) return value;
    }
  }
  return 0;
}

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

// Money arrives as fractional dollars and the subtraction above can
// leave a float tail; the column is DECIMAL(12,2).
function round2(n: number): number {
  return Math.round(n * 100) / 100;
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

// Pull the reservation out of whatever envelope Hostaway wrapped it
// in. A unified webhook posts `{ event, data }` with the reservation
// under `data`, but Hostaway does not publish the payload schema and
// the shape has moved before, so we also accept `reservation` and a
// flat body rather than hard-coding one key and silently dropping
// everything the day it changes.
//
// Returns null for events that carry no reservation at all. The same
// webhook delivers "new message received", and a conversation
// message has no listing or stay attached to map.
export function extractReservation(
  payload: unknown,
): HostawayReservation | null {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }
  const envelope = payload as Record<string, unknown>;

  const event = typeof envelope.event === "string" ? envelope.event : null;
  if (event && !event.startsWith("reservation")) return null;

  for (const key of ["data", "reservation", "result"]) {
    const nested = envelope[key];
    if (nested && typeof nested === "object" && !Array.isArray(nested)) {
      return nested as HostawayReservation;
    }
  }

  return envelope as HostawayReservation;
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
  const cleaningFee = toNumber(reservation.cleaningFee);

  // A payout above the gross is not a payout, it is a field we have
  // misread; fall back rather than store it.
  const quoted = channelPayout(reservation);
  const payout = quoted > 0 && quoted <= grossAmount ? quoted : 0;

  // What the channel kept, as the gap between what the guest paid and
  // what reaches us, less any cleaning the channel itemised — that
  // sits in the gap too but is not a channel fee. Derived rather than
  // read from a named field because Airbnb splits its cut across
  // several of them and leaves channelCommissionAmount null, so
  // trusting that field alone reports that Airbnb took nothing.
  const otaCommission =
    payout > 0
      ? Math.max(0, round2(grossAmount - payout - cleaningFee))
      : toNumber(reservation.channelCommissionAmount);

  // The payout the channel quoted, which is what actually lands in
  // the bank. Our own cleaning charge comes off it downstream in
  // applyStandardCleaning. Falls back to deriving it so a row can
  // never claim a payout that disagrees with the figures beside it.
  const netPayout =
    payout > 0
      ? payout
      : Math.max(0, grossAmount - otaCommission - cleaningFee);

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
