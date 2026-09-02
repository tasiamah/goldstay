"use server";

import { revalidatePath } from "next/cache";
import { AgreementStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { currentAuditActor } from "@/lib/auth";
import {
  AGREEMENT_ISSUE_PROPERTY_SELECT,
  buildAgreementIssueData,
} from "@/lib/agreements/issue";
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
    select: { ...AGREEMENT_ISSUE_PROPERTY_SELECT, clientId: true },
  });
  if (!property) return { ok: false, error: "Property not found." };

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
    // Re-snapshotted from the property, so correcting a capacity — or
    // filling in a Schedule 1 figure — and reissuing is how you fix a
    // contract that went out with the wrong terms on it.
    return tx.managementAgreement.create({
      data: {
        ...(await buildAgreementIssueData(tx, property)),
        property: { connect: { id: propertyId } },
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
