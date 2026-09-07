"use server";

// The mutation behind the unsubscribe button.
//
// Unauthenticated on purpose: the caller is an observer with no
// Goldstay account, and the token in the URL is the whole credential.
// That is acceptable here because of how little it can do. The token
// unsubscribes one address from one client's statements and nothing
// else — it reads no data back, grants no session, and the worst
// outcome for somebody who found a forwarded link is that a co-owner
// stops receiving a copy the account holder can restore by asking us.
//
// Compare AgreementShare, whose token exposes a contract and so is
// expiring and revocable. This one is neither, because an opt-out
// that expired would be an opt-out that stopped working.

import { revalidatePath } from "next/cache";
import { unsubscribeByToken } from "@/lib/clients/observers";
import { recordAudit } from "@/lib/audit";

export type StopResult = { ok: boolean; message: string };

export async function stopStatementsAction(
  token: string,
): Promise<StopResult> {
  const result = await unsubscribeByToken(token);

  if (!result.ok || !result.observer) {
    return {
      ok: false,
      message:
        "That link is not valid. If statements are still arriving, reply to one and we will sort it out.",
    };
  }

  if (!result.alreadyDone) {
    // Keyed to the client, because that is the account whose list
    // changed and an operator asked "why did Jane stop getting
    // these" will be looking at the client timeline.
    //
    // The actor is the observer's own address rather than a system
    // placeholder. They are genuinely who did this, and recording it
    // as anything else would make a deliberate opt-out look like
    // something Goldstay decided on their behalf.
    //
    // Best-effort: an audit write must never turn a completed opt-out
    // into an error the recipient is asked to retry.
    try {
      await recordAudit({
        actor: { email: result.observer.email },
        entity: "CLIENT",
        entityId: result.observer.clientId,
        action: "observer.unsubscribed",
        summary: `${result.observer.email} opted out of statement copies`,
        metadata: { observerId: result.observer.id },
      });
    } catch (err) {
      console.warn("[observers] audit write failed on unsubscribe", err);
    }
  }

  revalidatePath(`/statements/stop/${token}`);

  return {
    ok: true,
    message: result.alreadyDone
      ? "You were already unsubscribed. Nothing has changed."
      : "Done. We have stopped sending you these statements.",
  };
}
