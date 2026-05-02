"use server";

// Owner-side payout-method actions.
//
// The owner can:
//   • add a new payout method (always lands unverified — admin must
//     verify before any payout can land against it).
//   • mark an existing one as default.
//   • archive one (e.g. closed bank account).
//
// What the owner CAN'T do:
//   • verify their own method. The whole point of verification is
//     human review against a proof-of-account document.
//   • see internal admin notes — the helper layer never returns
//     `internalNotes` to the owner UI.

import { revalidatePath } from "next/cache";
import { requireOwner } from "@/lib/auth";
import {
  archivePayoutMethod,
  createPayoutMethod,
  setDefaultPayoutMethod,
} from "@/lib/payouts";
import { prisma } from "@/lib/db";
import { PayoutMethodInput } from "@/lib/validation/schemas";
import { flattenZodErrors } from "@/lib/validation/preprocessors";

export type OwnerPayoutActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string>; missing?: string[] };

export async function ownerCreatePayoutMethodAction(
  _prev: unknown,
  formData: FormData,
): Promise<OwnerPayoutActionResult> {
  const { owner } = await requireOwner();
  const actor = { adminId: null, email: owner.email };

  const parsed = PayoutMethodInput.safeParse({
    ownerId: owner.id,
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
    // Owners cannot author internal notes; the field is admin-only.
    internalNotes: undefined,
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

  revalidatePath("/owner/account");
  revalidatePath("/owner");
  return { ok: true };
}

export async function ownerSetDefaultPayoutMethodAction(
  payoutMethodId: string,
): Promise<OwnerPayoutActionResult> {
  const { owner } = await requireOwner();
  // Defence-in-depth: ensure the row really belongs to the caller
  // before mutating. The helper trusts callers and we want the
  // owner-facing actions to be the place ownership is enforced.
  const target = await prisma.ownerPayoutMethod.findUnique({
    where: { id: payoutMethodId },
    select: { ownerId: true },
  });
  if (!target || target.ownerId !== owner.id) {
    return { ok: false, error: "Payout method not found." };
  }
  const actor = { adminId: null, email: owner.email };
  const result = await setDefaultPayoutMethod(payoutMethodId, actor);
  if (!result.ok) return { ok: false, error: result.error };
  revalidatePath("/owner/account");
  return { ok: true };
}

export async function ownerArchivePayoutMethodAction(
  payoutMethodId: string,
): Promise<OwnerPayoutActionResult> {
  const { owner } = await requireOwner();
  const target = await prisma.ownerPayoutMethod.findUnique({
    where: { id: payoutMethodId },
    select: { ownerId: true },
  });
  if (!target || target.ownerId !== owner.id) {
    return { ok: false, error: "Payout method not found." };
  }
  const actor = { adminId: null, email: owner.email };
  const result = await archivePayoutMethod(payoutMethodId, actor);
  if (!result.ok) return { ok: false, error: result.error };
  revalidatePath("/owner/account");
  return { ok: true };
}
