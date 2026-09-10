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

// Channel labels live in booking-sources.ts, next to the decision about
// which channels are switched on, and are re-exported here only so the
// long-standing import path keeps working.
//
// This was a second copy of the same map until Sep 2026, when adding
// Expedia updated one and not the other and the build caught it. Two
// maps over one enum will always drift; the compiler only notices
// because both are typed Record<BookingSource, string>.
export { SOURCE_LABEL as BOOKING_SOURCE_LABEL } from "./booking-sources";
