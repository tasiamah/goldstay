// The work behind "add an observer" and "remove an observer",
// independent of who asked.
//
// Both surfaces do the same five things — validate, write, audit,
// notify, report — and the only real difference is who is allowed to
// touch which client and what the resulting audit row says. Keeping
// that shared here rather than writing it twice matters more than
// usual for this feature: the rules being enforced include "never
// add the account holder", and two implementations would be two
// chances for one of them to forget.
//
// Authentication is the caller's job. Each server action resolves its
// own actor and passes the clientId it is entitled to act on; nothing
// here checks a session, so nothing here may be exported to a route
// that has not already done so.

import { addObserver, describeObserver, removeObserver } from "./observers";
import { sendObserverNoticeEmail } from "./observer-email";
import { recordAudit, type AuditActor } from "@/lib/audit";

export type ObserverActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string };

export async function addObserverFor(input: {
  clientId: string;
  clientName: string;
  clientEmail: string;
  email: string;
  name?: string | null;
  relationship?: string | null;
  actor: AuditActor;
  // Whether the client did this themselves. Changes one sentence in
  // the notice email and the wording of the audit row; "the client
  // asked us to" is not a truthful description of an operator acting
  // on a phone call.
  byClient: boolean;
}): Promise<ObserverActionResult> {
  if (!input.email.trim()) {
    return { ok: false, error: "Enter an email address." };
  }

  const result = await addObserver({
    clientId: input.clientId,
    accountHolderEmail: input.clientEmail,
    email: input.email,
    name: input.name,
    relationship: input.relationship,
    addedByEmail: input.actor.email,
  });

  if (!result.ok) return { ok: false, error: result.message };

  const who = describeObserver(result.observer);

  try {
    await recordAudit({
      actor: input.actor,
      entity: "CLIENT",
      entityId: input.clientId,
      action: result.reactivated ? "observer.restored" : "observer.added",
      summary: `${who} now receives copies of the monthly statement`,
      metadata: {
        observerId: result.observer.id,
        email: result.observer.email,
        byClient: input.byClient,
      },
    });
  } catch (err) {
    // The observer is added; that is the durable outcome. Failing the
    // whole action because the audit row did not write would leave
    // the operator retrying something that already worked.
    console.warn("[observers] audit write failed on add", err);
  }

  // Notice sent on a fresh add and on a restore alike. Somebody
  // removed in March and put back in September has, in the interim,
  // stopped expecting these, and telling them again costs one email.
  const notice = await sendObserverNoticeEmail({
    observerEmail: result.observer.email,
    observerName: result.observer.name,
    relationship: result.observer.relationship,
    unsubscribeToken: await tokenFor(result.observer.id),
    clientName: input.clientName,
    clientEmail: input.clientEmail,
    addedByClient: input.byClient,
  });

  if (!notice.ok) {
    // Deliberately not an error. The row exists and the next
    // statement will reach them; what failed is the courtesy notice.
    // Saying so is more useful than either hiding it or implying the
    // whole thing failed.
    return {
      ok: true,
      message: `${who} was added, but we could not send them the notice email. They will still get the next statement.`,
    };
  }

  return {
    ok: true,
    message: notice.delivered
      ? `${who} will be copied on the monthly statement, and we have emailed them to say so.`
      : `${who} will be copied on the monthly statement. Email delivery is not configured, so the notice was written to the logs.`,
  };
}

export async function removeObserverFor(input: {
  observerId: string;
  clientId: string;
  actor: AuditActor;
}): Promise<ObserverActionResult> {
  const removed = await removeObserver({
    id: input.observerId,
    clientId: input.clientId,
  });

  // Not an error. The list no longer contains them, which is what the
  // click asked for, and a double-click should not produce a scary
  // message.
  if (!removed) {
    return { ok: true, message: "They were already off the list." };
  }

  try {
    await recordAudit({
      actor: input.actor,
      entity: "CLIENT",
      entityId: input.clientId,
      action: "observer.removed",
      summary: "An observer was taken off the monthly statement",
      metadata: { observerId: input.observerId },
    });
  } catch (err) {
    console.warn("[observers] audit write failed on remove", err);
  }

  return {
    ok: true,
    message: "Removed. They will not receive any more statements.",
  };
}

// The unsubscribe token is deliberately not in OBSERVER_SELECT: it is
// a credential, and a list rendered in two portals should not carry
// one for every row just so the add path can put it in an email. Read
// back here, for the one row that needs it.
async function tokenFor(observerId: string): Promise<string> {
  const { prisma } = await import("@/lib/db");
  const row = await prisma.clientObserver.findUnique({
    where: { id: observerId },
    select: { unsubscribeToken: true },
  });
  if (!row) throw new Error(`Observer ${observerId} vanished mid-add`);
  return row.unsubscribeToken;
}
