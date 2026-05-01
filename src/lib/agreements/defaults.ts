// Default commercial terms for the Goldstay management agreement.
//
// We keep the defaults pure and country/property-type aware so the
// auto-generation step can call this once, snapshot the result onto
// the ManagementAgreement row, and never have to look up the
// "current" defaults again. That snapshot is what makes a signed
// contract immutable even when we later tweak commission rates.
//
// Reasoning behind the numbers (consult before changing):
//
//   - Term length: 12 months for both flavours. Short-term setup
//     (photography, listing seeding, dynamic-pricing tuning, the
//     30-day Airbnb new-listing boost) takes ~3 months to recoup;
//     6-month contracts give Goldstay no cushion. Long-term tenants
//     are typically 12+ months anyway so 12 matches the underlying
//     tenancy.
//   - Commission: 20% short-term, 10% long-term. Already used
//     elsewhere in the codebase via SHORT_TERM_COMMISSION_RATE /
//     LONG_TERM_COMMISSION_RATE; we mirror those constants here so
//     the contract terms can never drift from what the booking and
//     transaction code is actually charging.
//   - Early-exit fee: a flat penalty calibrated to the setup cost
//     plus 1–2 months expected commission. Short-term gets a higher
//     floor because turnover photography and OTA listings cost more
//     to set up than placing a long-term tenant.
//   - Notice period: 60 days short-term, 90 days long-term. Long-
//     term needs longer because we may have an in-place tenant on a
//     fixed lease that we need to honour or hand off cleanly.

import type { Country, PropertyType } from "@prisma/client";
import {
  LONG_TERM_COMMISSION_RATE,
  SHORT_TERM_COMMISSION_RATE,
} from "@/lib/commission";

export type AgreementDefaults = {
  termMonths: number;
  commissionRate: number;
  earlyExitFee: number;
  earlyExitFeeCurrency: string;
  noticePeriodDays: number;
  governingLaw: string;
};

const COUNTRY_TO_LAW: Record<Country, string> = {
  KE: "Kenya",
  GH: "Ghana",
};

const COUNTRY_TO_CURRENCY: Record<Country, string> = {
  KE: "KES",
  GH: "GHS",
};

const EARLY_EXIT_FEE_BY_COUNTRY_TYPE: Record<
  Country,
  Record<PropertyType, number>
> = {
  KE: {
    SHORT_TERM: 75_000,
    LONG_TERM: 50_000,
  },
  GH: {
    SHORT_TERM: 7_500,
    LONG_TERM: 5_000,
  },
};

export function defaultAgreementTerms(input: {
  country: Country;
  propertyType: PropertyType;
}): AgreementDefaults {
  const isShort = input.propertyType === "SHORT_TERM";
  return {
    termMonths: 12,
    commissionRate: isShort
      ? SHORT_TERM_COMMISSION_RATE
      : LONG_TERM_COMMISSION_RATE,
    earlyExitFee:
      EARLY_EXIT_FEE_BY_COUNTRY_TYPE[input.country][input.propertyType],
    earlyExitFeeCurrency: COUNTRY_TO_CURRENCY[input.country],
    noticePeriodDays: isShort ? 60 : 90,
    governingLaw: COUNTRY_TO_LAW[input.country],
  };
}

// Loose equality check used at sign time. We don't need exact-string
// match — landlords commonly type "Jane M Doe" when their record
// says "Jane Margaret Doe" or vice versa. We collapse whitespace,
// drop punctuation, and compare case-insensitively. Tighten later
// if disputes arise.
export function namesPlausiblyMatch(typed: string, expected: string): boolean {
  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/[^\p{L}\s]/gu, "")
      .split(/\s+/)
      .filter(Boolean);
  const a = norm(typed);
  const b = norm(expected);
  // Require at least a first + last token on both sides — a single
  // first name is not a signature.
  if (a.length < 2 || b.length < 2) return false;
  return a[0] === b[0] && a[a.length - 1] === b[b.length - 1];
}
