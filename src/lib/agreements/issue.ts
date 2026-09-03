// Builds the snapshot written onto a new ManagementAgreement row.
//
// Several places issue agreements — creating a property by hand or by
// CSV import, and reissuing one from the admin property page — and
// they must snapshot identically. When they drifted, the only symptom
// was a reissued contract quietly carrying different terms from the
// original, which nobody notices until a client disputes one. Hence
// one helper.
//
// Call it inside the same transaction as the create: the GS-YYYY-###
// reference is derived from a count of this year's rows, so it has to
// be read and written atomically to stand any chance of being unique.

import type { Prisma, PrismaClient } from "@prisma/client";
import { AgreementStatus } from "@prisma/client";
import { defaultAgreementTerms } from "./defaults";
import { nextAgreementReference } from "./reference";
import { AGREEMENT_TEMPLATE_VERSION, templateFor } from "./template";

// Exactly the property columns an issue needs. Shared so a caller
// can't forget one and silently snapshot a null Schedule 1 field.
export const AGREEMENT_ISSUE_PROPERTY_SELECT = {
  id: true,
  country: true,
  propertyType: true,
  signingCapacity: true,
  startupCostsBudget: true,
  operatingReserve: true,
} satisfies Prisma.PropertySelect;

export type AgreementIssueProperty = Prisma.PropertyGetPayload<{
  select: typeof AGREEMENT_ISSUE_PROPERTY_SELECT;
}>;

export async function buildAgreementIssueData(
  tx: Pick<PrismaClient, "managementAgreement">,
  property: AgreementIssueProperty,
  now = new Date(),
): Promise<Omit<Prisma.ManagementAgreementCreateInput, "property">> {
  const template = templateFor(property);
  const terms = defaultAgreementTerms({
    country: property.country,
    propertyType: property.propertyType,
  });

  return {
    template,
    templateVersion: AGREEMENT_TEMPLATE_VERSION[template],
    reference: await nextAgreementReference(tx, now),

    termMonths: terms.termMonths,
    commissionRate: terms.commissionRate,
    earlyExitFee: terms.earlyExitFee,
    earlyExitFeeCurrency: terms.earlyExitFeeCurrency,
    noticePeriodDays: terms.noticePeriodDays,
    governingLaw: terms.governingLaw,

    // Snapshotted alongside the commercial terms: the authority
    // warranty the client accepts under has to stay fixed even if the
    // property's capacity is corrected later.
    signingCapacity: property.signingCapacity,

    // Schedule 1 money terms, frozen at issue for the same reason.
    // Nulls are fine — the contract prints "to be confirmed through
    // GoldStay onboarding", which Schedule 1 expressly allows.
    startupCostsBudget: property.startupCostsBudget,
    operatingReserve: property.operatingReserve,

    status: AgreementStatus.SENT,
    sentAt: now,
  };
}

// Issue an agreement for a freshly created property.
//
// Every property gets one at creation, so there is no separate "send
// the agreement" step for an operator to remember or forget. Must run
// inside the same transaction as the property insert: the reference
// is derived from a count of this year's rows, and a property that
// exists without an agreement can never go live.
//
// Returns the reference alongside the id because the client's "your
// agreement is ready" email quotes it, and reading it back out would
// mean a second round trip for a value we just wrote.
export async function issueAgreementForProperty(
  tx: Pick<PrismaClient, "managementAgreement">,
  property: AgreementIssueProperty,
  now = new Date(),
): Promise<{ id: string; reference: string | null }> {
  return tx.managementAgreement.create({
    data: {
      ...(await buildAgreementIssueData(tx, property, now)),
      property: { connect: { id: property.id } },
    },
    select: { id: true, reference: true },
  });
}
