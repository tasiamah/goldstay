"use server";

// Operator-side add/remove for statement observers.
//
// Thin on purpose: authenticate, look up the client, delegate to
// lib/clients/observer-actions.ts. The rules — including the one that
// refuses the account holder's own address — live there so this file
// and its client-portal twin cannot enforce different ones.

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { currentAuditActor } from "@/lib/auth";
import {
  addObserverFor,
  removeObserverFor,
  type ObserverActionResult,
} from "@/lib/clients/observer-actions";

export async function adminAddObserverAction(
  clientId: string,
  formData: FormData,
): Promise<ObserverActionResult> {
  const actor = await currentAuditActor();

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true, email: true, fullName: true },
  });
  if (!client) return { ok: false, error: "Client not found." };

  const result = await addObserverFor({
    clientId: client.id,
    clientName: client.fullName,
    clientEmail: client.email,
    email: String(formData.get("email") ?? ""),
    name: String(formData.get("name") ?? ""),
    relationship: String(formData.get("relationship") ?? ""),
    actor,
    // An operator did this, so the notice email must not tell the
    // recipient the client "asked us to" from their portal.
    byClient: false,
  });

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/client/account");
  return result;
}

export async function adminRemoveObserverAction(
  clientId: string,
  observerId: string,
): Promise<ObserverActionResult> {
  const actor = await currentAuditActor();

  const result = await removeObserverFor({ observerId, clientId, actor });

  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/client/account");
  return result;
}
