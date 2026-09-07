// Client observers: additional addresses copied on a client's monthly
// statement for people who co-own or co-manage but do not hold the
// account.
//
// The security argument for the shape of this is in the
// ClientObserver comment in prisma/schema.prisma. The short version
// is that three of the four emails we send a client carry a Supabase
// magic link that signs the clicker in *as the client*, so a second
// address on the account row would have handed a co-owner the whole
// portal and the accept button on a contract. Observers therefore
// live in their own table and receive exactly one thing: the monthly
// statement, which is the only client email with no minted link in
// it.
//
// Nothing in this module resolves recipients for a send. That is
// lib/clients/recipients.ts, deliberately separate, so the static
// test in observers.test.ts can assert that no credential-minting
// module imports it.
//
// The decision functions at the top are pure so the rules can be
// tested without a database. Everything below them is persistence.

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { generateDashboardToken } from "@/lib/referrals/codes";
import {
  isPlausibleEmail,
  isSameEmail,
  normaliseEmail,
} from "@/lib/email-address";

// How many addresses one client may copy. Not a technical limit: a
// statement carries a PDF of someone's income, and a list long enough
// to need scrolling is a list nobody is still curating. Co-ownership
// in practice is two or three people; five leaves room without
// letting the feature become a mailing list.
export const MAX_OBSERVERS_PER_CLIENT = 5;

export type ObserverRejection =
  | { ok: false; reason: "invalid-email"; message: string }
  | { ok: false; reason: "is-account-holder"; message: string }
  | { ok: false; reason: "already-listed"; message: string }
  | { ok: false; reason: "unsubscribed"; message: string }
  | { ok: false; reason: "limit-reached"; message: string };

export type ObserverAcceptance = { ok: true; email: string };

export type ObserverCheck = ObserverAcceptance | ObserverRejection;

// The single place that decides whether an address may be added.
// Pure: the caller passes the current list, so the same rules can be
// exercised in a test and applied to an admin form and a client form
// without three chances to disagree.
export function checkObserverCandidate(input: {
  email: string;
  accountHolderEmail: string;
  existing: {
    email: string;
    removedAt: Date | null;
    unsubscribedAt: Date | null;
  }[];
}): ObserverCheck {
  const email = normaliseEmail(input.email);

  if (!isPlausibleEmail(email)) {
    return {
      ok: false,
      reason: "invalid-email",
      message: "That does not look like an email address.",
    };
  }

  // Checked before anything else about the list. Copying the account
  // holder would double-send their own statement, and more
  // importantly it would put the one address that legitimately
  // receives magic links into the table whose whole purpose is to
  // hold addresses that never do.
  if (isSameEmail(email, input.accountHolderEmail)) {
    return {
      ok: false,
      reason: "is-account-holder",
      message:
        "That is the account holder's own address, which already receives every statement.",
    };
  }

  const match = input.existing.find((o) => isSameEmail(o.email, email));

  // An opt-out belongs to the recipient, not to the client, so
  // re-adding must not undo it. Reported plainly rather than silently
  // succeeding, because a client who thinks they have added someone
  // and has not is worse off than one who is told.
  if (match?.unsubscribedAt) {
    return {
      ok: false,
      reason: "unsubscribed",
      message:
        "They asked us to stop sending them statements. They will need to tell us themselves before we can add them again.",
    };
  }

  if (match && !match.removedAt) {
    return {
      ok: false,
      reason: "already-listed",
      message: "They are already on the list.",
    };
  }

  // Reactivating a removed row does not consume a new slot, so the
  // limit counts only what is currently live.
  const liveCount = input.existing.filter(
    (o) => !o.removedAt && !o.unsubscribedAt,
  ).length;
  if (!match && liveCount >= MAX_OBSERVERS_PER_CLIENT) {
    return {
      ok: false,
      reason: "limit-reached",
      message: `You can copy up to ${MAX_OBSERVERS_PER_CLIENT} people. Remove one before adding another.`,
    };
  }

  return { ok: true, email };
}

// Whether a stored row should be copied on the next statement.
// Removal and opt-out are both terminal for sending; they differ only
// in who decided and whether the client can reverse it.
export function isReceiving(observer: {
  removedAt: Date | null;
  unsubscribedAt: Date | null;
}): boolean {
  return !observer.removedAt && !observer.unsubscribedAt;
}

// Cheap shape check before we take a value out of a URL to Postgres.
// Tokens are 43-char base64url; anything else is not a token and does
// not deserve a query. Mirrors the guard in lib/agreements/share.ts.
export function isPlausibleUnsubscribeToken(input: unknown): input is string {
  if (typeof input !== "string") return false;
  if (input.length < 32 || input.length > 64) return false;
  return /^[A-Za-z0-9_-]+$/.test(input);
}

// How an observer is described back to the client in a list. Name and
// relationship are both optional, so this has to read properly with
// any combination of them present.
export function describeObserver(observer: {
  email: string;
  name: string | null;
  relationship: string | null;
}): string {
  const who = observer.name?.trim() || observer.email;
  const rel = observer.relationship?.trim();
  return rel ? `${who} (${rel})` : who;
}

// ---------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------

const MAX_TOKEN_RETRIES = 5;

export const OBSERVER_SELECT = {
  id: true,
  // Carried so callers that only hold a row can attribute an audit
  // event to the account it affects. The unsubscribe route has no
  // session and reaches a row by token alone, so without this it
  // would have to query twice to know whose list it just changed.
  clientId: true,
  email: true,
  name: true,
  relationship: true,
  addedByEmail: true,
  unsubscribedAt: true,
  removedAt: true,
  lastSentAt: true,
  sendCount: true,
  createdAt: true,
} as const;

export type ObserverRow = Prisma.ClientObserverGetPayload<{
  select: typeof OBSERVER_SELECT;
}>;

// Every row for a client, newest first, including removed and
// unsubscribed ones. The UI needs the full set: an operator asked
// "why isn't Jane getting these" has to be able to see that Jane
// opted out, which a filtered list would hide.
export async function listObserversFor(
  clientId: string,
): Promise<ObserverRow[]> {
  return prisma.clientObserver.findMany({
    where: { clientId },
    orderBy: { createdAt: "desc" },
    select: OBSERVER_SELECT,
  });
}

export type AddObserverResult =
  | { ok: true; observer: ObserverRow; reactivated: boolean }
  | ObserverRejection;

// Add an address, or bring a previously removed one back.
//
// Re-reads the list inside the call rather than trusting one passed
// in, so the rules are applied to the state at write time and two
// operators on the same account cannot both pass a limit check that
// only one of them should.
export async function addObserver(input: {
  clientId: string;
  accountHolderEmail: string;
  email: string;
  name?: string | null;
  relationship?: string | null;
  addedByEmail?: string | null;
}): Promise<AddObserverResult> {
  const existing = await listObserversFor(input.clientId);
  const check = checkObserverCandidate({
    email: input.email,
    accountHolderEmail: input.accountHolderEmail,
    existing,
  });
  if (!check.ok) return check;

  const name = input.name?.trim() || null;
  const relationship = input.relationship?.trim() || null;
  const prior = existing.find((o) => isSameEmail(o.email, check.email));

  // Reactivation. Keeps the original row so createdAt still answers
  // "since when could this person see the numbers", and refreshes the
  // descriptive fields because a re-add is usually a correction.
  if (prior) {
    const observer = await prisma.clientObserver.update({
      where: { id: prior.id },
      data: {
        removedAt: null,
        name,
        relationship,
        addedByEmail: input.addedByEmail ?? null,
      },
      select: OBSERVER_SELECT,
    });
    return { ok: true, observer, reactivated: true };
  }

  for (let attempt = 0; attempt < MAX_TOKEN_RETRIES; attempt++) {
    try {
      const observer = await prisma.clientObserver.create({
        data: {
          clientId: input.clientId,
          email: check.email,
          name,
          relationship,
          addedByEmail: input.addedByEmail ?? null,
          unsubscribeToken: generateDashboardToken(),
        },
        select: OBSERVER_SELECT,
      });
      return { ok: true, observer, reactivated: false };
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        const target = (err.meta?.target as string[] | undefined) ?? [];
        // A 32-byte token collision will not happen; retrying costs
        // one branch and turns the impossible case into a retry
        // rather than a 500 on somebody's screen.
        if (target.includes("unsubscribeToken")) continue;
        // Lost a race against another writer adding the same address.
        // The intended end state — that address is on the list — now
        // holds, so report it as the same "already there" the pure
        // check would have.
        return {
          ok: false,
          reason: "already-listed",
          message: "They are already on the list.",
        };
      }
      throw err;
    }
  }
  throw new Error("Failed to allocate a unique observer unsubscribe token");
}

// Take an observer off the list. Soft, so the record of who could see
// the numbers survives; updateMany so removing an already-removed row
// is a no-op rather than a throw on a double-clicked button.
export async function removeObserver(input: {
  id: string;
  clientId: string;
}): Promise<boolean> {
  const result = await prisma.clientObserver.updateMany({
    // clientId is in the predicate, not just the id, so a client
    // cannot remove a row off somebody else's account by guessing an
    // id. The server action knows which client is signed in; this
    // makes that knowledge load-bearing.
    where: { id: input.id, clientId: input.clientId, removedAt: null },
    data: { removedAt: new Date() },
  });
  return result.count > 0;
}

// The observer's own opt-out, by token. Returns the row so the page
// can name the client they will stop hearing about, and to make the
// already-unsubscribed case idempotent — a second click, or an email
// client prefetching the link, must not look like a failure.
export async function unsubscribeByToken(token: unknown): Promise<{
  ok: boolean;
  observer:
    | (ObserverRow & { client: { fullName: string } })
    | null;
  alreadyDone: boolean;
}> {
  if (!isPlausibleUnsubscribeToken(token)) {
    return { ok: false, observer: null, alreadyDone: false };
  }

  const found = await prisma.clientObserver.findUnique({
    where: { unsubscribeToken: token },
    select: { ...OBSERVER_SELECT, client: { select: { fullName: true } } },
  });
  if (!found) return { ok: false, observer: null, alreadyDone: false };
  if (found.unsubscribedAt) {
    return { ok: true, observer: found, alreadyDone: true };
  }

  const updated = await prisma.clientObserver.update({
    where: { id: found.id },
    data: { unsubscribedAt: new Date() },
    select: { ...OBSERVER_SELECT, client: { select: { fullName: true } } },
  });
  return { ok: true, observer: updated, alreadyDone: false };
}

// Read-only lookup for the confirm screen, so a GET that only wants
// to ask "are you sure" does not opt anybody out. The mutation is a
// POST; see the route for why that matters with link prefetchers.
export async function findObserverByToken(token: unknown) {
  if (!isPlausibleUnsubscribeToken(token)) return null;
  return prisma.clientObserver.findUnique({
    where: { unsubscribeToken: token },
    select: { ...OBSERVER_SELECT, client: { select: { fullName: true } } },
  });
}

// Bookkeeping after a statement goes out, so "I never get these" is
// answerable from the admin screen. Best-effort by construction: the
// caller must not fail a delivered statement because a counter did
// not increment.
export async function recordObserverSend(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  try {
    await prisma.clientObserver.updateMany({
      where: { id: { in: ids } },
      data: { lastSentAt: new Date(), sendCount: { increment: 1 } },
    });
  } catch (err) {
    console.warn("[observers] failed to record send", err);
  }
}

export function unsubscribeUrl(token: string, siteUrl: string): string {
  return `${siteUrl.replace(/\/$/, "")}/statements/stop/${token}`;
}
