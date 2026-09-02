"use server";

import { revalidatePath } from "next/cache";
import { AgreementStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { currentAuditActor } from "@/lib/auth";
import { defaultAgreementTerms } from "@/lib/agreements/defaults";
import { recordAudit } from "@/lib/audit";

export type AgreementAdminResult =
  | { ok: true; agreementId: string }
  | { ok: false; error: string };

// Cancel the current agreement and issue a fresh one with current
// defaults. Used when terms change before the landlord has signed.
// Cascades through cleanly because the old SIGNED row stays around
// for audit; we just supersede it with a new SENT row.
export async function reissueAgreementAction(
  propertyId: string,
): Promise<AgreementAdminResult> {
  const actor = await currentAuditActor();

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      id: true,
      country: true,
      propertyType: true,
      signingCapacity: true,
      clientId: true,
    },
  });
  if (!property) return { ok: false, error: "Property not found." };

  const terms = defaultAgreementTerms({
    country: property.country,
    propertyType: property.propertyType,
  });

  const newAgreement = await prisma.$transaction(async (tx) => {
    // Soft-cancel any open agreement so we never have two parallel
    // SENT rows for the same property. SIGNED rows are left intact —
    // they remain the authoritative record until superseded.
    await tx.managementAgreement.updateMany({
      where: {
        propertyId,
        status: { in: [AgreementStatus.DRAFT, AgreementStatus.SENT] },
      },
      data: { status: AgreementStatus.CANCELLED },
    });
    return tx.managementAgreement.create({
      data: {
        propertyId,
        termMonths: terms.termMonths,
        commissionRate: terms.commissionRate,
        earlyExitFee: terms.earlyExitFee,
        earlyExitFeeCurrency: terms.earlyExitFeeCurrency,
        noticePeriodDays: terms.noticePeriodDays,
        governingLaw: terms.governingLaw,
        // Re-snapshotted from the property, so correcting a capacity
        // and reissuing is how you fix a wrong authority clause.
        signingCapacity: property.signingCapacity,
        status: AgreementStatus.SENT,
        sentAt: new Date(),
      },
    });
  });

  await recordAudit({
    actor,
    entity: "AGREEMENT",
    entityId: newAgreement.id,
    action: "agreement.reissued",
    summary: "Management agreement reissued",
    metadata: { propertyId, clientId: property.clientId },
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath(`/admin/clients/${property.clientId}`);
  revalidatePath("/client");
  revalidatePath(`/client/properties/${propertyId}`);
  return { ok: true, agreementId: newAgreement.id };
}
