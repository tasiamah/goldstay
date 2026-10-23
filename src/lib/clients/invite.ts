// Welcome links that belong to us rather than to Supabase.
//
// The link we email is a token in this table pointing at /welcome/<token>,
// a page that authenticates nobody. Opening it is free: a mail scanner
// can fetch it as often as it likes and nothing is spent. Only when the
// landlord presses the button do we mint a Supabase magic link
// server-side and spend it immediately, inside their own browser.
//
// That inversion is the whole point. Supabase magic links are single
// use and short lived, which are the right properties for a token in
// flight and the wrong ones for a token sitting in an inbox for three
// days. So we keep Supabase's token in flight for about two seconds
// and let ours do the waiting.

import { createHash, randomBytes } from "node:crypto";
import type { ClientInviteReason } from "@prisma/client";

import { prisma } from "@/lib/db";

// Long enough that guessing is not a concern. Seven days is what a
// landlord who reads email at the weekend actually needs; beyond that
// the right answer is a fresh link, not a longer-lived one.
export const INVITE_TTL_DAYS = 7;

export function generateInviteToken(): string {
  return randomBytes(32).toString("base64url");
}

// The plaintext lives only in the email. Storing the hash means a
// database leak hands over nothing usable, which matters more here
// than for most tokens because this one is a sign-in.
export function hashInviteToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function inviteUrl(token: string, siteUrl: string): string {
  return new URL(`/welcome/${token}`, siteUrl).toString();
}

// Returns the plaintext token, which the caller must put in the email
// and then forget. There is no way to recover it afterwards.
export async function createInvite(input: {
  clientId: string;
  reason?: ClientInviteReason;
  now?: Date;
}): Promise<string> {
  const now = input.now ?? new Date();
  const token = generateInviteToken();
  await prisma.clientInvite.create({
    data: {
      clientId: input.clientId,
      tokenHash: hashInviteToken(token),
      expiresAt: new Date(now.getTime() + INVITE_TTL_DAYS * 86_400_000),
      reason: input.reason ?? "WELCOME",
    },
  });
  return token;
}

export type InviteLookup =
  | {
      status: "valid";
      inviteId: string;
      client: { id: string; email: string; fullName: string };
    }
  // Separated from "unknown" so the page can offer to send a new link
  // to a known person rather than asking them to type their email.
  | { status: "expired" | "retired"; client: { fullName: string } }
  | { status: "unknown" };

export async function lookupInvite(
  token: string,
  now: Date = new Date(),
): Promise<InviteLookup> {
  // Reject implausible input before hitting the database. A base64url
  // 32-byte token is 43 chars.
  if (!token || token.length < 20 || token.length > 200) {
    return { status: "unknown" };
  }

  const invite = await prisma.clientInvite.findUnique({
    where: { tokenHash: hashInviteToken(token) },
    select: {
      id: true,
      expiresAt: true,
      retiredAt: true,
      client: { select: { id: true, email: true, fullName: true } },
    },
  });

  if (!invite) return { status: "unknown" };
  if (invite.retiredAt) {
    return { status: "retired", client: { fullName: invite.client.fullName } };
  }
  if (invite.expiresAt.getTime() <= now.getTime()) {
    return { status: "expired", client: { fullName: invite.client.fullName } };
  }
  return { status: "valid", inviteId: invite.id, client: invite.client };
}

// Called when the landlord actually presses the button, never on page
// load. A count well above 1 is the signal that something automated
// is walking the link.
export async function recordInviteUse(inviteId: string): Promise<void> {
  await prisma.clientInvite.update({
    where: { id: inviteId },
    data: { useCount: { increment: 1 }, lastUsedAt: new Date() },
  });
}

// Once there is a password on file the invite has done its job. We
// retire every outstanding one for the client rather than just the
// one they clicked, so an older link in an older email stops working
// at the same moment.
export async function retireInvitesForClient(clientId: string): Promise<void> {
  await prisma.clientInvite.updateMany({
    where: { clientId, retiredAt: null },
    data: { retiredAt: new Date() },
  });
}
