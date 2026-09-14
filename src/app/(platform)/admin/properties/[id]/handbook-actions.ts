"use server";

// An operator editing a property's handbook.
//
// Same row and same validation as the client's own form; the only
// differences are that the author is recorded as an admin and that
// both the admin and the client view of the property are
// revalidated, since either may be open when this is saved.
//
// Ops needs write access rather than a read-only view because most of
// this arrives verbally. An owner walks the operator through the gate
// procedure on a handover call, and asking them to go and type it
// into the portal afterwards is how a handbook stays empty.
//
// currentAuditActor() calls requireAdmin() internally, so the call
// below both authorises the write and attributes it.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { currentAuditActor } from "@/lib/auth";
import { saveHandbook } from "@/lib/properties/handbook-input";
import type { HandbookActionResult } from "@/lib/properties/handbook";

export async function updateAdminHandbookAction(
  propertyId: string,
  formData: FormData,
): Promise<HandbookActionResult> {
  const actor = await currentAuditActor();

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true, clientId: true },
  });
  if (!property) return { ok: false, error: "Property not found." };

  const result = await saveHandbook({
    propertyId: property.id,
    formData,
    actor,
  });

  if (result.ok) {
    revalidatePath(`/admin/properties/${property.id}`);
    revalidatePath(`/client/properties/${property.id}`);
  }
  return result;
}
