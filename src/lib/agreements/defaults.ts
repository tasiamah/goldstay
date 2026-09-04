// Default commercial terms for the Goldstay management agreement.
//
// We keep the defaults pure and country/property-type aware so the
// auto-generation step can call this once, snapshot the result onto
// the ManagementAgreement row, and never have to look up the
// "current" defaults again. That snapshot is what makes a signed
// contract immutable even when we later tweak commission rates.
//
// Both Kenyan contracts state their own term, notice period and
// early-exit mechanism, and those win. The numbers below now describe
// the generic contract alone, which since the Kenyan long-term
// agreement landed means Ghana only — so the notes explaining them
// apply to Ghanaian properties, not to anything Kenyan.
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

import { AgreementTemplate } from "@prisma/client";
import type { Country, PropertyType } from "@prisma/client";
import {
  LONG_TERM_COMMISSION_RATE,
  SHORT_TERM_COMMISSION_RATE,
} from "@/lib/commission";
import { templateFor } from "./template";

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

  // Kenyan short-lets are issued under the short-let agreement, whose
  // own terms differ from the generic contract's and take precedence:
  // a three-month Initial Commitment Period running from the Launch
  // Date (clause 10.1), 30 days' notice thereafter (clause 10.2), and
  // an early-exit amount computed under clause 10.3 rather than fixed.
  // The Kenyan long-term agreement sells "cancel with 30 days notice,
  // no exit fee, no lock-in" on the service sheet, so its terms are
  // not negotiable against the generic numbers below: a 12-month term
  // with a KES 50,000 exit fee would contradict the page the client
  // was sold on.
  if (templateFor(input) === AgreementTemplate.LONG_LET_KE_V1) {
    return {
      // No minimum term. One rather than zero because the appointment
      // genuinely runs month to month, and because a bare
      // `${termMonths} months` slipping through somewhere unbranched
      // reads better as "1" than "0". Display sites should use
      // agreementTermSummary rather than print this directly.
      termMonths: 1,
      commissionRate: LONG_TERM_COMMISSION_RATE,
      // No exit fee, per the service sheet. Zero is the term, not a
      // placeholder for one we haven't computed.
      earlyExitFee: 0,
      earlyExitFeeCurrency: COUNTRY_TO_CURRENCY[input.country],
      noticePeriodDays: 30,
      governingLaw: COUNTRY_TO_LAW[input.country],
    };
  }

  if (templateFor(input) === AgreementTemplate.SHORT_LET_KE_V1) {
    return {
      termMonths: 3,
      commissionRate: SHORT_TERM_COMMISSION_RATE,
      // Clause 10.3 makes early exit unrecovered Startup Costs, which
      // are only known once they have been incurred, so there is no
      // figure to snapshot at issue. Zero rather than a made-up
      // number: the column would otherwise imply we can charge an
      // amount the contract does not entitle us to.
      earlyExitFee: 0,
      earlyExitFeeCurrency: COUNTRY_TO_CURRENCY[input.country],
      noticePeriodDays: 30,
      governingLaw: COUNTRY_TO_LAW[input.country],
    };
  }

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
