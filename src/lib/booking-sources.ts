// Single source of truth for which booking channels Goldstay
// actively supports in the UI. The Prisma enum keeps every value
// (AIRBNB, BOOKING_COM, VRBO, DIRECT) so we can re-enable any of
// them without a migration — but everything user-facing reads from
// this list, so flipping one on is a one-line change.
//
// Current product position (Apr 2026):
//   - AIRBNB:    primary OTA, drives ~70% of short-stay volume
//   - DIRECT:    higher-margin (no OTA fee), worth pushing
//   - BOOKING_COM and VRBO: enum-only, hidden from forms / lists
//                until we have the ops bandwidth to handle them.

import type { BookingSource } from "@prisma/client";

export const ACTIVE_BOOKING_SOURCES = [
  "AIRBNB",
  "DIRECT",
] as const satisfies ReadonlyArray<BookingSource>;

export const ACTIVE_OTA_SOURCES = [
  "AIRBNB",
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
