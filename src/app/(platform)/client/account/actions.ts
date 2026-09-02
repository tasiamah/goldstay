"use server";

// Client-side payout-method actions.
//
// The client can:
//   • add a new payout method (always lands unverified — admin must
//     verify before any payout can land against it).
//   • mark an existing one as default.
//   • archive one (e.g. closed bank account).
//
// What the client CAN'T do:
//   • verify their own method. The whole point of verification is
//     human review against a proof-of-account document.
//   • see internal admin notes — the helper layer never returns
//     `internalNotes` to the client UI.

import { revalidatePath } from "next/cache";
import { requireClient } from "@/lib/auth";
import {
  archivePayoutMethod,
  createPayoutMethod,
  setDefaultPayoutMethod,
} from "@/lib/payouts";
import { prisma } from "@/lib/db";
import { PayoutMethodInput } from "@/lib/validation/schemas";
import { flattenZodErrors } from "@/lib/validation/preprocessors";

export type ClientPayoutActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string>; missing?: string[] };

export async function clientCreatePayoutMethodAction(
  _prev: unknown,
  formData: FormData,
): Promise<ClientPayoutActionResult> {
  const { client } = await requireClient();
  const actor = { adminId: null, email: client.email };

  const parsed = PayoutMethodInput.safeParse({
    clientId: client.id,
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
    // Clients cannot author internal notes; the field is admin-only.
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

  revalidatePath("/client/account");
  revalidatePath("/client");
  return { ok: true };
}

export async function clientSetDefaultPayoutMethodAction(
  payoutMethodId: string,
): Promise<ClientPayoutActionResult> {
  const { client } = await requireClient();
  // Defence-in-depth: ensure the row really belongs to the caller
  // before mutating. The helper trusts callers and we want the
  // client-facing actions to be the place ownership is enforced.
  const target = await prisma.clientPayoutMethod.findUnique({
    where: { id: payoutMethodId },
    select: { clientId: true },
  });
  if (!target || target.clientId !== client.id) {
    return { ok: false, error: "Payout method not found." };
  }
  const actor = { adminId: null, email: client.email };
  const result = await setDefaultPayoutMethod(payoutMethodId, actor);
  if (!result.ok) return { ok: false, error: result.error };
  revalidatePath("/client/account");
  return { ok: true };
}

export async function clientArchivePayoutMethodAction(
  payoutMethodId: string,
): Promise<ClientPayoutActionResult> {
  const { client } = await requireClient();
  const target = await prisma.clientPayoutMethod.findUnique({
    where: { id: payoutMethodId },
    select: { clientId: true },
  });
  if (!target || target.clientId !== client.id) {
    return { ok: false, error: "Payout method not found." };
  }
  const actor = { adminId: null, email: client.email };
  const result = await archivePayoutMethod(payoutMethodId, actor);
  if (!result.ok) return { ok: false, error: result.error };
  revalidatePath("/client/account");
  return { ok: true };
}
