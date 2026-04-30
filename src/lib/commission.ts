// Goldstay's standard commission rates, as published on the
// marketing site:
//   - Long-term Management:        10% of collected rent
//   - Airbnb / Short-Stay Mgmt:    20% of revenue
//   - Property Sourcing:           free (one-off, no recurring %)
//
// We treat these as defaults applied automatically when bookings are
// ingested (Hostaway webhook) or when the admin emits transactions
// for a manual booking. For bespoke deals we'll later store an
// override on Owner or Property; until then the constants below are
// the single source of truth so they can't drift between the PDF,
// the webhook, and the admin UI.

import { PropertyType } from "@prisma/client";

export const LONG_TERM_COMMISSION_RATE = 0.1;
export const SHORT_TERM_COMMISSION_RATE = 0.2;

export function defaultCommissionRate(type: PropertyType): number {
  return type === PropertyType.SHORT_TERM
    ? SHORT_TERM_COMMISSION_RATE
    : LONG_TERM_COMMISSION_RATE;
}
