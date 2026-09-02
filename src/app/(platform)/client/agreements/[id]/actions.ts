"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { AgreementStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/auth";
import { readImpersonationCookie } from "@/lib/admin/impersonation";
import { newAcceptanceReference } from "@/lib/agreements/reference";
import { recordAudit } from "@/lib/audit";

export type SignAgreementResult =
  | { ok: true; acceptanceReference: string }
  | { ok: false; error: string };

// Server action invoked from the client sign page.
//
// Acceptance is a single click. There is no typed name and no tick-box
// gauntlet, deliberately: clause 12.3 of the short-let agreement
// contemplates acceptance "through the GoldStay platform" and asks the
// acceptance record to identify four things — the user, the Agreement
// version, an identity confirmation and the date and time. An
// authenticated session supplies all four more reliably than a typed
// name does, since requireClient() has already proved control of the
// account's mailbox, whereas anyone can type a name into a box.
//
// Clause 7.2 is what makes this safe for a client who isn't the
// registered owner: it states the Client "confirms this authority by
// accepting this Agreement". The confirmation is carried by the act of
// acceptance, so a separate authority tick would add friction without
// adding evidence.
//
// Everything of evidential value is captured server-side from the
// request and never trusted from form input.
export async function signAgreementAction(
  agreementId: string,
  _prev: SignAgreementResult | null,
  _formData: FormData,
): Promise<SignAgreementResult> {
  const { user, client } = await requireClient();

  // Refuse to accept while an admin is impersonating.
  //
  // "Open as client" works by signing the admin into the client's real
  // Supabase session, so requireClient() cannot tell them apart and
  // the acceptance record would attribute the click to the client.
  // With a typed signature that was at least a deliberate forgery;
  // with one click it is an accident waiting to happen, and the
  // resulting record — GoldStay having accepted GoldStay's own
  // contract on the client's behalf — is worth less than no record at
  // all. The cookie is not httpOnly so a determined admin could clear
  // it, but that also kills the impersonation banner, and this guard
  // is about preventing a mistake rather than a motivated insider.
  const impersonation = await readImpersonationCookie();
  if (impersonation) {
    return {
      ok: false,
      error:
        "You are viewing this portal as the client. Only the client can accept their own agreement — stop impersonating first.",
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
    return { ok: false, error: "This agreement is already accepted." };
  }
  if (agreement.status === AgreementStatus.CANCELLED) {
    return {
      ok: false,
      error:
        "This agreement was cancelled by GoldStay. Please contact us for a fresh copy.",
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
  const acceptanceReference = newAcceptanceReference();

  // The name on the executed copy is the one on file, not one typed at
  // acceptance time. It's the name the contract was issued against, so
  // it's the name the contract should be executed in.
  const signedByName = client.companyName
    ? `${client.companyName} (accepted by ${client.fullName})`
    : client.fullName;

  // updateMany with the status guard, not update: two taps on a slow
  // connection would otherwise both pass the check above and the
  // second would overwrite the first acceptance's timestamp and
  // receipt. Whoever loses the race is told it's already accepted.
  const { count } = await prisma.managementAgreement.updateMany({
    where: {
      id: agreementId,
      status: { in: [AgreementStatus.DRAFT, AgreementStatus.SENT] },
    },
    data: {
      status: AgreementStatus.SIGNED,
      signedAt: new Date(),
      signedByName,
      signedByIp: ip,
      signedByUserAgent: userAgent,
      // The session's auth user, not client.authUserId: they're
      // normally the same, but the session id is what actually clicked
      // and is the part a dispute would turn on.
      acceptedByUserId: user.id,
      acceptanceReference,
    },
  });
  if (count === 0) {
    return { ok: false, error: "This agreement is already accepted." };
  }

  // Audit row attributed to the client's email so the property
  // timeline reads "Asha Kimani accepted agreement at 14:32" without
  // leaking it under an admin actor.
  await recordAudit({
    actor: { adminId: null, email: client.email },
    entity: "AGREEMENT",
    entityId: agreementId,
    action: "agreement.signed",
    summary: `Accepted by ${signedByName}`,
    metadata: {
      propertyId: agreement.propertyId,
      clientId: client.id,
      signingCapacity: agreement.signingCapacity,
      template: agreement.template,
      templateVersion: agreement.templateVersion,
      reference: agreement.reference,
      acceptanceReference,
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
  return { ok: true, acceptanceReference };
}
