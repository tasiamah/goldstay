// Single source of truth for which booking channels Goldstay
// actively supports in the UI. The Prisma enum keeps every value
// (AIRBNB, BOOKING_COM, EXPEDIA, VRBO, DIRECT) so we can re-enable any
// of them without a migration — but everything user-facing reads from
// this list, so flipping one on is a one-line change.
//
// Current product position (Sep 2026):
//   - AIRBNB:      primary OTA, the clear majority of short-stay volume
//   - BOOKING_COM: listings are created and managed by hand, outside the
//                  platform. Active here so staff can record the bookings
//                  and attach an iCal feed; without it a Booking.com stay
//                  could not be entered at all and nothing guarded against
//                  double-booking a unit that is live on two channels.
//   - EXPEDIA:     agreement signed Sep 2026, no listing live yet. Active
//                  here ahead of the first listing on purpose: the value
//                  has to exist before a stay can be recorded against it,
//                  and switching it on at the moment the first booking
//                  arrives is how you end up filing it under AIRBNB to
//                  get the statement out. Nothing user-facing should
//                  claim live Expedia listings until one exists.
//   - DIRECT:      higher-margin (no OTA fee), worth pushing
//   - VRBO:        enum-only. Expedia Group owns Vrbo and the agreement
//                  may or may not distribute there; until that is
//                  confirmed we do not claim it, so it stays hidden.

import type { BookingSource } from "@prisma/client";

export const ACTIVE_BOOKING_SOURCES = [
  "AIRBNB",
  "BOOKING_COM",
  "EXPEDIA",
  "DIRECT",
] as const satisfies ReadonlyArray<BookingSource>;

export const ACTIVE_OTA_SOURCES = [
  "AIRBNB",
  "BOOKING_COM",
  "EXPEDIA",
] as const satisfies ReadonlyArray<BookingSource>;

export const SOURCE_LABEL: Record<BookingSource, string> = {
  AIRBNB: "Airbnb",
  BOOKING_COM: "Booking.com",
  EXPEDIA: "Expedia",
  VRBO: "Vrbo",
  DIRECT: "Direct",
};

export function isActiveSource(source: BookingSource): boolean {
  return (ACTIVE_BOOKING_SOURCES as ReadonlyArray<string>).includes(source);
}
