// Booking status + source presentation helpers.
//
// Same pattern as src/lib/leases.ts and src/lib/leads.ts: label
// strings and a small badge palette so every list / detail page
// references one source of truth for "how does CONFIRMED render?".

import type { BookingSource, BookingStatus } from "@prisma/client";

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  CONFIRMED: "Confirmed",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
};

export const BOOKING_STATUS_CLASSES: Record<BookingStatus, string> = {
  CONFIRMED: "bg-sky-50 text-sky-900 border-sky-200",
  COMPLETED: "bg-emerald-50 text-emerald-900 border-emerald-200",
  CANCELLED: "bg-stone-100 text-stone-600 border-stone-200",
};

export const BOOKING_SOURCE_LABEL: Record<BookingSource, string> = {
  AIRBNB: "Airbnb",
  BOOKING_COM: "Booking.com",
  VRBO: "Vrbo",
  DIRECT: "Direct",
};
