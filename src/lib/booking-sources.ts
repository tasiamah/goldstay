// Single source of truth for which booking channels Goldstay
// actively supports in the UI. The Prisma enum keeps every value
// (AIRBNB, BOOKING_COM, VRBO, DIRECT) so we can re-enable any of
// them without a migration — but everything user-facing reads from
// this list, so flipping one on is a one-line change.
//
// Current product position (Sep 2026):
//   - AIRBNB:      primary OTA, the clear majority of short-stay volume
//   - BOOKING_COM: listings are created and managed by hand, outside the
//                  platform. Active here so staff can record the bookings
//                  and attach an iCal feed; without it a Booking.com stay
//                  could not be entered at all and nothing guarded against
//                  double-booking a unit that is live on two channels.
//   - DIRECT:      higher-margin (no OTA fee), worth pushing
//   - VRBO:        enum-only. We do not list there, so it stays hidden.

import type { BookingSource } from "@prisma/client";

export const ACTIVE_BOOKING_SOURCES = [
  "AIRBNB",
  "BOOKING_COM",
  "DIRECT",
] as const satisfies ReadonlyArray<BookingSource>;

export const ACTIVE_OTA_SOURCES = [
  "AIRBNB",
  "BOOKING_COM",
] as const satisfies ReadonlyArray<BookingSource>;

export const SOURCE_LABEL: Record<BookingSource, string> = {
  AIRBNB: "Airbnb",
  BOOKING_COM: "Booking.com",
  VRBO: "Vrbo",
  DIRECT: "Direct",
};

export function isActiveSource(source: BookingSource): boolean {
  return (ACTIVE_BOOKING_SOURCES as ReadonlyArray<string>).includes(source);
}
