"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { AgreementStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/auth";
import { namesPlausiblyMatch } from "@/lib/agreements/defaults";
import { recordAudit } from "@/lib/audit";

export type SignAgreementResult =
  | { ok: true }
  | { ok: false; error: string };

// Server action invoked from the client sign page. Validates the
// signature client-side input, captures forensic context (IP, UA,
// timestamp) from the request server-side, and flips the agreement
// to SIGNED. The PDF render + Document attachment happens later in
// a follow-up step (kept separate so a slow render doesn't block
// the user's confirmation).
export async function signAgreementAction(
  agreementId: string,
  _prev: SignAgreementResult | null,
  formData: FormData,
): Promise<SignAgreementResult> {
  const { client } = await requireClient();

  const typedName = String(formData.get("typedName") ?? "").trim();
  const consented = formData.get("consent") === "on";
  // Separate tick from `consent`, because clause 2 of the agreement
  // turns on it: the signatory need not be the registered owner, but
  // they must affirm they hold the right to let the property and to
  // sign. Two boxes rather than one so the record shows which of the
  // two things they actually confirmed.
  const authorityConfirmed = formData.get("authority") === "on";

  if (!consented) {
    return {
      ok: false,
      error: "Tick the confirmation box to acknowledge you have read the agreement.",
    };
  }
  if (!authorityConfirmed) {
    return {
      ok: false,
      error:
        "Confirm you have the right to let this property and to sign this agreement.",
    };
  }
  if (typedName.length < 2) {
    return { ok: false, error: "Type your full legal name to sign." };
  }
  if (!namesPlausiblyMatch(typedName, client.fullName)) {
    return {
      ok: false,
      error: `The name you typed does not match the account holder (${client.fullName}). Use the same name on file.`,
    };
  }

  const agreement = await prisma.managementAgreement.findUnique({
    where: { id: agreementId },
    include: { property: { select: { clientId: true } } },
  });
  if (!agreement || agreement.property.clientId !== client.id) {
    // Treat missing and not-yours identically so we never confirm
    // existence of an agreement to an unauthorised user.
    return { ok: false, error: "Agreement not found." };
  }
  if (agreement.status === AgreementStatus.SIGNED) {
    return { ok: false, error: "This agreement is already signed." };
  }
  if (agreement.status === AgreementStatus.CANCELLED) {
    return {
      ok: false,
      error:
        "This agreement was cancelled by Goldstay. Please contact us for a fresh copy.",
    };
  }

  const hdrs = headers();
  // x-forwarded-for can be a comma-separated list when there are
  // multiple proxies; the first entry is the original client.
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    hdrs.get("x-real-ip") ||
    null;
  const userAgent = hdrs.get("user-agent") ?? null;

  await prisma.managementAgreement.update({
    where: { id: agreementId },
    data: {
      status: AgreementStatus.SIGNED,
      signedAt: new Date(),
      signedByName: typedName,
      signedByIp: ip,
      signedByUserAgent: userAgent,
    },
  });

  // Audit row attributed to the client's email so the property
  // timeline reads "Asha Kimani signed agreement at 14:32" without
  // leaking it under an admin actor.
  await recordAudit({
    actor: { adminId: null, email: client.email },
    entity: "AGREEMENT",
    entityId: agreementId,
    action: "agreement.signed",
    summary: `Signed by ${typedName}`,
    metadata: {
      propertyId: agreement.propertyId,
      clientId: client.id,
      signingCapacity: agreement.signingCapacity,
      ip,
    },
  });

  revalidatePath("/client");
  revalidatePath(`/client/properties/${agreement.propertyId}`);
  revalidatePath(`/client/agreements/${agreementId}`);
  revalidatePath(`/admin/properties/${agreement.propertyId}`);

  // PDF render runs out-of-band so the user gets an instant ack;
  // see /client/agreements/[id]/pdf/route.ts which materialises the
  // signed PDF into the documents bucket on first request.
  return { ok: true };
}
