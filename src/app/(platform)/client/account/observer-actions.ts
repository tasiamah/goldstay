"use server";

// Client-side add/remove for statement observers.
//
// Twin of the admin file, and thin for the same reason. The one thing
// it must get right is that the clientId comes from the session and
// never from the caller: a client may only change their own list, and
// the way that is guaranteed is by never accepting a clientId as an
// argument.

import { revalidatePath } from "next/cache";
import { requireClient } from "@/lib/auth";
import {
  addObserverFor,
  removeObserverFor,
  type ObserverActionResult,
} from "@/lib/clients/observer-actions";

export async function clientAddObserverAction(
  formData: FormData,
): Promise<ObserverActionResult> {
  const { client } = await requireClient();

  const result = await addObserverFor({
    clientId: client.id,
    clientName: client.fullName,
    clientEmail: client.email,
    email: String(formData.get("email") ?? ""),
    name: String(formData.get("name") ?? ""),
    relationship: String(formData.get("relationship") ?? ""),
    // The client is the actor. Recorded with their own address so the
    // admin timeline distinguishes "the landlord added their sister"
    // from "we did it for them on the phone".
    actor: { email: client.email },
    byClient: true,
  });

  revalidatePath("/client/account");
  revalidatePath(`/admin/clients/${client.id}`);
  return result;
}

export async function clientRemoveObserverAction(
  observerId: string,
): Promise<ObserverActionResult> {
  const { client } = await requireClient();

  // clientId from the session, so an id belonging to another account
  // matches nothing. removeObserver puts it in the WHERE clause
  // rather than checking it afterwards.
  const result = await removeObserverFor({
    observerId,
    clientId: client.id,
    actor: { email: client.email },
  });

  revalidatePath("/client/account");
  revalidatePath(`/admin/clients/${client.id}`);
  return result;
}
