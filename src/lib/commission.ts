// Goldstay's standard commission rates, as published on the
// marketing site:
//   - Long-term Management:        10% of collected rent
//   - Airbnb / Short-Stay Mgmt:    20% of revenue
//   - Property Sourcing:           free (one-off, no recurring %)
//
// We treat these as defaults applied automatically when bookings are
// ingested (Hostaway webhook) or when the admin emits transactions
// for a manual booking. For bespoke deals we'll later store an
// override on Client or Property; until then the constants below are
// the single source of truth so they can't drift between the PDF,
// the webhook, and the admin UI.

import { PropertyType } from "@prisma/client";

export const LONG_TERM_COMMISSION_RATE = 0.1;
export const SHORT_TERM_COMMISSION_RATE = 0.2;

// Tenant finding earns one month's rent, once. That is not a rate on
// a recurring base, so there is no honest percentage to put here.
//
// Zero is the deliberate answer rather than a missing one: every
// caller of defaultCommissionRate is asking "what recurring
// percentage do we take from this property's income", and for a
// tenant-finding property the answer is none. The placement fee is
// booked as a single TENANT_FINDING_FEE transaction equal to the
// first month's rent, not derived from a rate.
//
// Storing 1.0000 to mean "one month" was the obvious alternative and
// is worse: it renders as "100%" in the admin, on the agreement card
// and on the PDF, and a landlord reading that we charge 100% will
// not stay to hear the explanation.
export const TENANT_FINDING_COMMISSION_RATE = 0;

export function defaultCommissionRate(type: PropertyType): number {
  switch (type) {
    case PropertyType.SHORT_TERM:
      return SHORT_TERM_COMMISSION_RATE;
    case PropertyType.TENANT_FINDING:
      return TENANT_FINDING_COMMISSION_RATE;
    case PropertyType.LONG_TERM:
      return LONG_TERM_COMMISSION_RATE;
  }
}

// Whether Goldstay takes a recurring cut of this property's income at
// all. Used wherever the question is "does a management fee apply",
// which is not the same as "is the rate greater than zero" — a
// bespoke zero-rate management deal would still be management.
export function hasRecurringFee(type: PropertyType): boolean {
  return type !== PropertyType.TENANT_FINDING;
}
