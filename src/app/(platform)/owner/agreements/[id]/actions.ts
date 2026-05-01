"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { AgreementStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireOwner } from "@/lib/auth";
import { namesPlausiblyMatch } from "@/lib/agreements/defaults";

export type SignAgreementResult =
  | { ok: true }
  | { ok: false; error: string };

// Server action invoked from the owner sign page. Validates the
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
  const { owner } = await requireOwner();

  const typedName = String(formData.get("typedName") ?? "").trim();
  const consented = formData.get("consent") === "on";

  if (!consented) {
    return {
      ok: false,
      error: "Tick the confirmation box to acknowledge you have read the agreement.",
    };
  }
  if (typedName.length < 2) {
    return { ok: false, error: "Type your full legal name to sign." };
  }
  if (!namesPlausiblyMatch(typedName, owner.fullName)) {
    return {
      ok: false,
      error: `The name you typed does not match the account holder (${owner.fullName}). Use the same name on file.`,
    };
  }

  const agreement = await prisma.managementAgreement.findUnique({
    where: { id: agreementId },
    include: { property: { select: { ownerId: true } } },
  });
  if (!agreement || agreement.property.ownerId !== owner.id) {
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

  revalidatePath("/owner");
  revalidatePath(`/owner/properties/${agreement.propertyId}`);
  revalidatePath(`/owner/agreements/${agreementId}`);
  revalidatePath(`/admin/properties/${agreement.propertyId}`);

  // PDF render runs out-of-band so the user gets an instant ack;
  // see /owner/agreements/[id]/pdf/route.ts which materialises the
  // signed PDF into the documents bucket on first request.
  return { ok: true };
}
