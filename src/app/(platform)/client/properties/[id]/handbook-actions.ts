"use server";

// The client editing the operating notes for their own unit.
//
// This is the first write a client can make against a property. The
// page around it is otherwise read-only, and that asymmetry is
// deliberate: everything else on a Property is either a commercial
// term we agreed or a number we produced, whereas the handbook is
// the one part of the record where the owner is the only person who
// knows the answer.
//
// Ownership is re-checked here rather than trusted from the page.
// A server action is a public endpoint, so the property id arriving
// in the form post has to be proved to belong to the caller before
// anything is written.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireClient } from "@/lib/auth";
import { saveHandbook } from "@/lib/properties/handbook-input";
import type { HandbookActionResult } from "@/lib/properties/handbook";

export async function updateClientHandbookAction(
  propertyId: string,
  formData: FormData,
): Promise<HandbookActionResult> {
  const { client } = await requireClient();

  const owned = await prisma.property.findFirst({
    where: { id: propertyId, clientId: client.id, archivedAt: null },
    select: { id: true },
  });
  if (!owned) {
    // Same reasoning as the page's notFound(): do not confirm that a
    // property with this id exists at all.
    return { ok: false, error: "Property not found." };
  }

  const result = await saveHandbook({
    propertyId: owned.id,
    formData,
    actor: { adminId: null, email: client.email },
  });

  if (result.ok) revalidatePath(`/client/properties/${owned.id}`);
  return result;
}
