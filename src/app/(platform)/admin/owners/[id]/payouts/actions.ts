"use server";

// Admin payout-method actions.
//
// Wraps the lib/payouts.ts helpers so the form layer can dispatch
// against bound server actions and the owner detail page can
// revalidate cleanly. Also exposes recordPayoutAction, which
// creates the Transaction row representing money actually leaving
// Goldstay's account into the owner's beneficiary.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import {
  archivePayoutMethod,
  createPayoutMethod,
  setDefaultPayoutMethod,
  verifyPayoutMethod,
} from "@/lib/payouts";
import { PayoutMethodInput } from "@/lib/validation/schemas";
import {
  flattenZodErrors,
  requiredAmount,
  requiredDate,
  optionalString,
} from "@/lib/validation/preprocessors";
import { currentAuditActor, requireRole } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";

export type PayoutActionResult =
  | { ok: true; payoutMethodId?: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string>; missing?: string[] };

export async function createPayoutMethodAction(
  ownerId: string,
  _prev: unknown,
  formData: FormData,
): Promise<PayoutActionResult> {
  await requireRole("owner.write");
  const actor = await currentAuditActor();

  const parsed = PayoutMethodInput.safeParse({
    ownerId,
    kind: formData.get("kind"),
    label: formData.get("label") ?? "",
    currency: formData.get("currency") ?? "",
    beneficiaryName: formData.get("beneficiaryName") ?? "",
    bankName: formData.get("bankName") ?? "",
    bankCountry: formData.get("bankCountry") ?? "",
    branchCode: formData.get("branchCode") ?? "",
    accountNumber: formData.get("accountNumber") ?? "",
    iban: formData.get("iban") ?? "",
    swift: formData.get("swift") ?? "",
    wiseEmail: formData.get("wiseEmail") ?? "",
    mpesaPhone: formData.get("mpesaPhone") ?? "",
    beneficiaryAddress: formData.get("beneficiaryAddress") ?? "",
    internalNotes: formData.get("internalNotes") ?? "",
    isDefault: formData.get("isDefault") === "on" ? "on" : undefined,
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  const result = await createPayoutMethod({
    ...parsed.data,
    actor,
  });
  if (!result.ok) {
    return {
      ok: false,
      error: result.error,
      missing: result.missing,
    };
  }

  revalidatePath(`/admin/owners/${ownerId}`);
  return { ok: true, payoutMethodId: result.method.id };
}

export async function setDefaultPayoutMethodAction(
  ownerId: string,
  payoutMethodId: string,
): Promise<PayoutActionResult> {
  await requireRole("owner.write");
  const actor = await currentAuditActor();
  const result = await setDefaultPayoutMethod(payoutMethodId, actor);
  if (!result.ok) return { ok: false, error: result.error };
  revalidatePath(`/admin/owners/${ownerId}`);
  return { ok: true };
}

export async function verifyPayoutMethodAction(
  ownerId: string,
  payoutMethodId: string,
): Promise<PayoutActionResult> {
  await requireRole("owner.write");
  const actor = await currentAuditActor();
  const result = await verifyPayoutMethod(payoutMethodId, actor);
  if (!result.ok) return { ok: false, error: result.error };
  revalidatePath(`/admin/owners/${ownerId}`);
  return { ok: true };
}

export async function archivePayoutMethodAction(
  ownerId: string,
  payoutMethodId: string,
): Promise<PayoutActionResult> {
  await requireRole("owner.write");
  const actor = await currentAuditActor();
  const result = await archivePayoutMethod(payoutMethodId, actor);
  if (!result.ok) return { ok: false, error: result.error };
  revalidatePath(`/admin/owners/${ownerId}`);
  return { ok: true };
}

// ---------- Record payout ----------

const RecordPayoutInput = z.object({
  ownerId: z.string().min(1),
  propertyId: z.string().min(1),
  payoutMethodId: z.string().min(1),
  amount: requiredAmount,
  currency: z.string().trim().toUpperCase().min(3).max(3),
  occurredOn: requiredDate,
  reference: optionalString,
  description: optionalString,
});

export type RecordPayoutResult =
  | { ok: true; transactionId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

// Records a money-out PAYOUT transaction tied to a verified
// OwnerPayoutMethod. Refuses if the method is unverified, archived,
// or doesn't belong to the property's owner — these are the three
// most common operator mistakes and we'd rather fail loudly than
// land a payout against the wrong beneficiary.
export async function recordPayoutAction(
  ownerId: string,
  _prev: unknown,
  formData: FormData,
): Promise<RecordPayoutResult> {
  await requireRole("transaction.write");
  const actor = await currentAuditActor();

  const parsed = RecordPayoutInput.safeParse({
    ownerId,
    propertyId: formData.get("propertyId") ?? "",
    payoutMethodId: formData.get("payoutMethodId") ?? "",
    amount: formData.get("amount") ?? "",
    currency: formData.get("currency") ?? "",
    occurredOn: formData.get("occurredOn") ?? "",
    reference: formData.get("reference") ?? "",
    description: formData.get("description") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  // Three-fact integrity check rolled into one query so we don't
  // race between fetch and write.
  const [property, method] = await Promise.all([
    prisma.property.findUnique({
      where: { id: parsed.data.propertyId },
      select: { id: true, ownerId: true },
    }),
    prisma.ownerPayoutMethod.findUnique({
      where: { id: parsed.data.payoutMethodId },
      select: {
        id: true,
        ownerId: true,
        verifiedAt: true,
        archivedAt: true,
        label: true,
        currency: true,
      },
    }),
  ]);

  if (!property || property.ownerId !== ownerId) {
    return {
      ok: false,
      error: "Property does not belong to this owner.",
      fieldErrors: { propertyId: "Wrong owner" },
    };
  }
  if (!method || method.ownerId !== ownerId) {
    return {
      ok: false,
      error: "Payout method does not belong to this owner.",
      fieldErrors: { payoutMethodId: "Wrong owner" },
    };
  }
  if (method.archivedAt) {
    return {
      ok: false,
      error: "Payout method has been archived.",
      fieldErrors: { payoutMethodId: "Archived" },
    };
  }
  if (!method.verifiedAt) {
    return {
      ok: false,
      error:
        "Payout method is not verified. Verify it first; the platform refuses to record payouts against unverified beneficiaries.",
      fieldErrors: { payoutMethodId: "Not verified" },
    };
  }

  try {
    const created = await prisma.transaction.create({
      data: {
        propertyId: parsed.data.propertyId,
        type: "PAYOUT",
        direction: "OUTFLOW",
        amount: parsed.data.amount,
        currency: parsed.data.currency,
        occurredOn: parsed.data.occurredOn,
        reference: parsed.data.reference ?? null,
        description:
          parsed.data.description ??
          `Payout to ${method.label}`,
        payoutMethodId: parsed.data.payoutMethodId,
      },
    });

    await Promise.all([
      recordAudit({
        actor,
        entity: "TRANSACTION",
        entityId: created.id,
        action: "transaction.created",
        summary: `PAYOUT -${created.amount} ${created.currency}`,
        metadata: {
          propertyId: created.propertyId,
          payoutMethodId: created.payoutMethodId,
          ownerId,
        },
      }),
      recordAudit({
        actor,
        entity: "PAYOUT_METHOD",
        entityId: parsed.data.payoutMethodId,
        action: "payout.recorded",
        summary: `Payout ${created.amount} ${created.currency} recorded`,
        metadata: { transactionId: created.id, ownerId, propertyId: created.propertyId },
      }),
      recordAudit({
        actor,
        entity: "OWNER",
        entityId: ownerId,
        action: "payout.recorded",
        summary: `Payout ${created.amount} ${created.currency} → ${method.label}`,
        metadata: {
          transactionId: created.id,
          payoutMethodId: parsed.data.payoutMethodId,
          propertyId: created.propertyId,
        },
      }),
    ]);

    revalidatePath("/admin");
    revalidatePath("/admin/transactions");
    revalidatePath(`/admin/owners/${ownerId}`);
    revalidatePath(`/admin/properties/${created.propertyId}`);
    return { ok: true, transactionId: created.id };
  } catch {
    return { ok: false, error: "Could not record the payout. Please retry." };
  }
}
