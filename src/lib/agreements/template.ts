// Chooses which contract a property is issued under, and renders it.
//
// Every caller that needs contract prose — the client sign page, the
// PDF route, the admin preview — goes through here rather than calling
// a clause module directly. That way the choice is made once, and a
// row's stored `template` is what decides how it reprints, so adding a
// third contract later can never retroactively change the text of an
// agreement someone has already accepted.

import { AgreementTemplate } from "@prisma/client";
import type { Country, PropertyType, SigningCapacity } from "@prisma/client";
import { buildAgreementSections, type AgreementSection } from "./text";
import {
  buildShortLetKeSections,
  SHORT_LET_KE_VERSION,
} from "./short-let-ke";

export const GENERIC_MANAGEMENT_VERSION = "generic-management-v1";

export const AGREEMENT_TEMPLATE_VERSION: Record<AgreementTemplate, string> = {
  GENERIC_MANAGEMENT_V1: GENERIC_MANAGEMENT_VERSION,
  SHORT_LET_KE_V1: SHORT_LET_KE_VERSION,
};

export const AGREEMENT_TEMPLATE_TITLE: Record<AgreementTemplate, string> = {
  GENERIC_MANAGEMENT_V1: "Property management agreement",
  SHORT_LET_KE_V1: "Short-let property management agreement",
};

// The short-let agreement is drafted around Gross Booking Revenue,
// Booking Channels, a KRA PIN and Kenyan law, so it only fits a Kenyan
// short-term property. A Ghanaian client or a long-term letting gets
// the generic agreement until its own document exists — issuing the
// Kenyan short-let contract to either would be plainly wrong on its
// face, not merely imprecise.
export function templateFor(input: {
  country: Country;
  propertyType: PropertyType;
}): AgreementTemplate {
  return input.country === "KE" && input.propertyType === "SHORT_TERM"
    ? AgreementTemplate.SHORT_LET_KE_V1
    : AgreementTemplate.GENERIC_MANAGEMENT_V1;
}

// Everything either contract could need. The two clause modules read
// disjoint subsets; keeping one input type means page components don't
// branch on the template to decide what to fetch.
export type AgreementRenderInput = {
  template: AgreementTemplate;

  // Client
  clientName: string;
  clientCompany: string | null;
  clientIdNumber: string | null;
  clientKraPin: string | null;
  clientAddress: string | null;

  // Property
  propertyName: string;
  propertyAddress: string;
  propertyCity: string;
  bedrooms: number | null;
  maxOccupancy: number | null;
  isShortTerm: boolean;
  signingCapacity: SigningCapacity;

  // Snapshotted terms
  governingLaw: string;
  termMonths: number;
  commissionPct: string;
  earlyExitFeeFormatted: string;
  noticePeriodDays: number;
  payoutCurrency: string;
  forecastMonthlyFeeFormatted: string | null;
  startupCostsBudgetFormatted: string | null;
  operatingReserveFormatted: string | null;

  // Lifecycle
  reference: string | null;
  startDate: Date;
  launchDate: Date | null;
};

export function renderAgreement(
  input: AgreementRenderInput,
): AgreementSection[] {
  if (input.template === AgreementTemplate.SHORT_LET_KE_V1) {
    return buildShortLetKeSections({
      // Schedule 1 wants the name that binds: the company where the
      // client contracts through one, otherwise the individual.
      clientLegalName: input.clientCompany
        ? `${input.clientCompany} (acting through ${input.clientName})`
        : input.clientName,
      clientIdNumber: input.clientIdNumber,
      clientKraPin: input.clientKraPin,
      clientAddress: input.clientAddress,
      signingCapacity: input.signingCapacity,
      propertyDescription: `${input.propertyName}, ${input.propertyAddress}, ${input.propertyCity}`,
      bedrooms: input.bedrooms,
      maxOccupancy: input.maxOccupancy,
      startDate: input.startDate,
      launchDate: input.launchDate,
      commissionPct: input.commissionPct,
      termMonths: input.termMonths,
      noticePeriodDays: input.noticePeriodDays,
      payoutCurrency: input.payoutCurrency,
      forecastMonthlyFeeFormatted: input.forecastMonthlyFeeFormatted,
      startupCostsBudgetFormatted: input.startupCostsBudgetFormatted,
      operatingReserveFormatted: input.operatingReserveFormatted,
      reference: input.reference,
    });
  }

  return buildAgreementSections({
    clientName: input.clientName,
    clientCompany: input.clientCompany,
    propertyName: input.propertyName,
    propertyAddress: input.propertyAddress,
    propertyCity: input.propertyCity,
    governingLaw: input.governingLaw,
    termMonths: input.termMonths,
    commissionPct: input.commissionPct,
    earlyExitFeeFormatted: input.earlyExitFeeFormatted,
    noticePeriodDays: input.noticePeriodDays,
    isShortTerm: input.isShortTerm,
    signingCapacity: input.signingCapacity,
  });
}
