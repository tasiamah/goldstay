// Who an email to a client actually goes to.
//
// This module exists to be a chokepoint. A client now has two kinds
// of address associated with them — the account holder's, which is
// `Client.email`, and any number of observers, which are copied on
// the monthly statement — and the difference between them is a
// security boundary rather than a preference.
//
// Three of the four emails we send a client (welcome, agreement
// issued, agreement reminder) carry a Supabase magic link minted by
// lib/supabase/magic-link.ts. Clicking one signs the clicker in as
// the client, with the accept button on a management agreement. A
// co-owner who received one could execute a contract in her sibling's
// name. So those three sends must reach the account holder and
// nobody else, forever.
//
// The rule is therefore: a send site either resolves its recipients
// through this module, in which case it must carry no credential, or
// it uses `client.email` directly, in which case it may. There is no
// third option and no per-send flag to get wrong, because a boolean
// argument called something like `includeObservers` is exactly the
// kind of thing that gets copied into a new email by someone who did
// not read this comment.
//
// src/lib/clients/observers.test.ts enforces it statically: no module
// that imports a mint function may import this module or the observer
// store. Adding an observer to a credential email fails the suite.

import { isReceiving, listObserversFor } from "./observers";

export type StatementRecipients = {
  // The account holder. Always exactly one address, always the
  // primary recipient — an observer is copied on somebody else's
  // statement and the headers should say so.
  to: string[];
  // Observers, as CC rather than BCC on purpose. Co-ownership is the
  // case this was built for, and there the transparency is the point:
  // the sisters can both see the statement went to both of them, and
  // the account holder can see at a glance who is reading their
  // income. A hidden copy of a financial document would be the wrong
  // default even though it leaks less.
  cc: string[];
  // The same observers with enough detail to name them in the body
  // and to update their counters afterwards, so the caller does not
  // resolve the list a second time to do either.
  //
  // Naming them in the email matters: a statement that has quietly
  // been going to a third party for eight months is a surprise, and
  // the account holder should be able to see who is on it from the
  // email itself rather than by remembering to check the portal.
  observers: { id: string; email: string; name: string | null }[];
};

// Recipients for the monthly statement.
//
// Named for the one email it serves rather than something general
// like `resolveRecipients`, so that reusing it for a different send
// requires renaming it, and renaming it requires thinking about
// whether that send carries a credential.
//
// Never throws. A statement that reaches the account holder and no
// observers is a degraded success; one that fails because the
// observer lookup did is a regression caused entirely by this
// feature, and the person waiting for their rent statement should not
// pay for it.
export async function resolveStatementRecipients(client: {
  id: string;
  email: string;
}): Promise<StatementRecipients> {
  const base: StatementRecipients = { to: [client.email], cc: [], observers: [] };

  try {
    const receiving = (await listObserversFor(client.id)).filter(isReceiving);
    return {
      to: base.to,
      cc: receiving.map((o) => o.email),
      observers: receiving.map((o) => ({
        id: o.id,
        email: o.email,
        name: o.name,
      })),
    };
  } catch (err) {
    console.warn("[recipients] observer lookup failed, sending to holder only", err);
    return base;
  }
}
