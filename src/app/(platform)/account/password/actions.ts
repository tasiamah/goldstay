"use server";

import { getCurrentClient } from "@/lib/auth";
import { retireInvitesForClient } from "@/lib/clients/invite";

// Called once the password has actually saved.
//
// A welcome invite is a way in for someone who cannot get in yet. The
// moment there is a password on file that is no longer true, and a
// week-old link sitting in an inbox would be a spare key nobody
// asked for. Retiring every outstanding invite for the client — not
// just the one they clicked — means an older email stops working at
// the same moment.
//
// Best-effort on purpose: the password is already saved by the time
// we run, so a failure here must not show the landlord an error for
// something that succeeded. The invite expires on its own regardless.
export async function retireInvitesAction(): Promise<void> {
  try {
    const client = await getCurrentClient();
    if (!client) return;
    await retireInvitesForClient(client.id);
  } catch (err) {
    console.warn("[account/password] retiring invites failed", err);
  }
}
