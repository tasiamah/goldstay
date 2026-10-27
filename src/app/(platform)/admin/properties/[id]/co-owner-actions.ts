"use server";

// Operator-side add/remove for property co-owners.
//
// Thin on purpose: authenticate, delegate, revalidate. The rules —
// including the refusals for the owner of record, an archived client
// and an address with no client record — live in
// lib/properties/co-owners.ts so a second caller cannot enforce a
// different set.

import { revalidatePath } from "next/cache";

import { currentAuditActor } from "@/lib/auth";
import {
  addCoOwnerByEmail,
  removeCoOwner,
  type CoOwnerResult,
} from "@/lib/properties/co-owners";

export async function adminAddCoOwnerAction(
  propertyId: string,
  formData: FormData,
): Promise<CoOwnerResult> {
  const actor = await currentAuditActor();

  const result = await addCoOwnerByEmail({
    propertyId,
    email: String(formData.get("email") ?? ""),
    relationship: String(formData.get("relationship") ?? ""),
    actor,
  });

  revalidatePath(`/admin/properties/${propertyId}`);
  // The co-owner's own dashboard changes too, and they may be
  // looking at it while the operator is on the phone to them.
  revalidatePath("/client");
  return result;
}

export async function adminRemoveCoOwnerAction(
  propertyId: string,
  coOwnerId: string,
): Promise<CoOwnerResult> {
  const actor = await currentAuditActor();

  const result = await removeCoOwner({ coOwnerId, propertyId, actor });

  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath("/client");
  return result;
}
