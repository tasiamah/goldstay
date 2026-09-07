"use server";

import { revalidatePath } from "next/cache";
import { AgreementStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { currentAuditActor } from "@/lib/auth";
import {
  AGREEMENT_ISSUE_PROPERTY_SELECT,
  buildAgreementIssueData,
} from "@/lib/agreements/issue";
import { notifyClientOfAgreement } from "@/lib/agreements/notify";
import { recordAudit } from "@/lib/audit";
import { AGREEMENT_TEMPLATE_TITLE } from "@/lib/agreements/template";
import { formatPropertyDisplayName } from "@/lib/format-property";
import {
  createAgreementShare,
  isPlausibleEmail,
  normaliseRecipientEmail,
  revokeAgreementShare,
  shareUrl,
  SHARE_TTL_DAYS,
} from "@/lib/agreements/share";
import {
  sendAgreementShareEmail,
  shareSiteUrl,
} from "@/lib/agreements/share-email";

export type AgreementAdminResult =
  | { ok: true; agreementId: string }
  | { ok: false; error: string };

export type ShareActionResult =
  | { ok: true; message: string }
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

  // A reissue cancels whatever the client was looking at and replaces
  // it with different terms, so it needs the same email as a first
  // issue. Without one, a client who had already opened the old link
  // would be sitting on a cancelled agreement with no idea why.
  await notifyClientOfAgreement({
    agreementId: newAgreement.id,
    reference: newAgreement.reference,
    propertyId,
    actor,
  });

  revalidatePath("/admin");
  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath(`/admin/clients/${property.clientId}`);
  revalidatePath("/client");
  revalidatePath(`/client/properties/${propertyId}`);
  return { ok: true, agreementId: newAgreement.id };
}

// ---------------------------------------------------------------------
// Sharing an agreement read-only with a third party
// ---------------------------------------------------------------------

// Issue a read-only share of one agreement and email it.
//
// This is the operator's half of the feature a client asks for when
// their advocate wants to read the contract before they accept it.
// The reason it is a share rather than a second address on the client
// record is in the AgreementShare comment in prisma/schema.prisma: the
// client's own agreement email carries a magic link that signs the
// clicker in as them, so a copied address would grant the portal and
// the accept button rather than a read-only look at a document.
//
// Deliberately available on unsigned agreements. Reviewing a contract
// before signing it is the entire point, so gating this on SIGNED
// would refuse the only case anybody actually asks for.
export async function shareAgreementAction(
  agreementId: string,
  formData: FormData,
): Promise<ShareActionResult> {
  const actor = await currentAuditActor();

  const rawEmail = String(formData.get("email") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const relationship = String(formData.get("relationship") ?? "").trim();

  if (!isPlausibleEmail(rawEmail)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  const recipientEmail = normaliseRecipientEmail(rawEmail);

  const agreement = await prisma.managementAgreement.findUnique({
    where: { id: agreementId },
    select: {
      id: true,
      reference: true,
      status: true,
      template: true,
      propertyId: true,
      property: {
        select: {
          name: true,
          unitNumber: true,
          clientId: true,
          client: { select: { id: true, fullName: true, email: true } },
        },
      },
    },
  });
  if (!agreement) return { ok: false, error: "Agreement not found." };

  // Sharing a client's contract with their own address is a no-op at
  // best: they already reach it through the portal, and a share link
  // would give them a weaker view of their own agreement with no
  // accept button on it, which looks like a bug.
  if (recipientEmail === normaliseRecipientEmail(agreement.property.client.email)) {
    return {
      ok: false,
      error:
        "That is the client's own address. They already reach this agreement from their portal.",
    };
  }

  const share = await createAgreementShare({
    agreementId,
    recipientEmail,
    recipientName: name || null,
    recipientRelationship: relationship || null,
    createdByEmail: actor.email,
  });

  await recordAudit({
    actor,
    entity: "AGREEMENT",
    entityId: agreementId,
    action: "agreement.shared",
    summary: `Agreement shared read-only with ${recipientEmail}`,
    metadata: {
      propertyId: agreement.propertyId,
      clientId: agreement.property.clientId,
      recipientEmail,
      recipientRelationship: relationship || null,
      expiresAt: share.expiresAt.toISOString(),
      // The token is a bearer credential. Never in the audit log.
      shareId: share.id,
    },
  });

  const result = await sendAgreementShareEmail({
    shareUrl: shareUrl(share.token, shareSiteUrl()),
    agreementTitle: AGREEMENT_TEMPLATE_TITLE[agreement.template],
    propertyLabel: formatPropertyDisplayName(
      agreement.property.name,
      agreement.property.unitNumber,
    ),
    reference: agreement.reference,
    expiresAt: share.expiresAt,
    isSigned: agreement.status === "SIGNED",
    recipient: { email: recipientEmail, name: name || null },
    client: agreement.property.client,
    actor,
  });

  revalidatePath(`/admin/properties/${agreement.propertyId}`);
  revalidatePath(`/admin/clients/${agreement.property.clientId}`);

  // The share exists either way; only the email is best-effort. Say
  // which happened rather than reporting a clean success on a send
  // that failed, because the operator's next move differs.
  return {
    ok: true,
    message: result.delivered
      ? `Shared with ${recipientEmail}. The link works for ${SHARE_TTL_DAYS} days and ${agreement.property.client.fullName} is copied in.`
      : `Share created for ${recipientEmail}, but the email did not send. Copy the link from the list below and send it yourself.`,
  };
}

// Withdraw a share. The link stops working on the next request; the
// row stays so the record of who had access when survives.
export async function revokeAgreementShareAction(
  shareId: string,
): Promise<ShareActionResult> {
  const actor = await currentAuditActor();

  const share = await prisma.agreementShare.findUnique({
    where: { id: shareId },
    select: {
      id: true,
      recipientEmail: true,
      agreementId: true,
      agreement: {
        select: { propertyId: true, property: { select: { clientId: true } } },
      },
    },
  });
  if (!share) return { ok: false, error: "Share not found." };

  const revoked = await revokeAgreementShare(shareId);
  if (!revoked) {
    return { ok: false, error: "That share had already been withdrawn." };
  }

  await recordAudit({
    actor,
    entity: "AGREEMENT",
    entityId: share.agreementId,
    action: "agreement.share_revoked",
    summary: `Read-only access withdrawn from ${share.recipientEmail}`,
    metadata: {
      propertyId: share.agreement.propertyId,
      clientId: share.agreement.property.clientId,
      recipientEmail: share.recipientEmail,
      shareId,
    },
  });

  revalidatePath(`/admin/properties/${share.agreement.propertyId}`);
  revalidatePath(`/admin/clients/${share.agreement.property.clientId}`);
  return {
    ok: true,
    message: `Access withdrawn from ${share.recipientEmail}.`,
  };
}
