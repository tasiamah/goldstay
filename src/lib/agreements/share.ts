// Read-only sharing of a single management agreement with somebody
// who is not the client. In practice: the client's advocate.
//
// The security argument for this module existing at all is in the
// AgreementShare comment in prisma/schema.prisma. The short version
// is that the client's own agreement email carries a magic link which
// signs the clicker in as the client, so "add a second email to the
// account" would hand a third party the whole portal and the accept
// button. A share is a separate, deliberately weaker credential: one
// agreement, read-only, expiring, revocable, and with no code path to
// acceptance.
//
// The decision functions at the top are pure so the rules can be
// tested without a database. Everything below them is the persistence
// layer.

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { generateDashboardToken } from "@/lib/referrals/codes";

// How long a new share lasts. Long enough for an advocate to read a
// contract and come back with questions, short enough that a link
// forwarded on and forgotten stops working. Reissuing is one click,
// so erring short costs nothing.
export const SHARE_TTL_DAYS = 30;

export type ShareUsability =
  | { usable: true }
  | { usable: false; reason: "revoked" | "expired" };

// The single place that decides whether a share still works. Both the
// page and the PDF route go through this, so they can never disagree
// about whether a link is live.
export function shareUsability(
  share: { expiresAt: Date; revokedAt: Date | null },
  now: Date = new Date(),
): ShareUsability {
  // Revocation is checked first and reported first. If a client
  // revoked a share and it also happens to have expired, "revoked" is
  // the truthful answer about why it stopped working.
  if (share.revokedAt) return { usable: false, reason: "revoked" };
  if (share.expiresAt.getTime() <= now.getTime()) {
    return { usable: false, reason: "expired" };
  }
  return { usable: true };
}

export function shareExpiryFrom(
  now: Date = new Date(),
  days: number = SHARE_TTL_DAYS,
): Date {
  return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
}

// Cheap shape check before we go anywhere near Postgres with a value
// out of a URL. Tokens are 43-char base64url; anything else is not a
// token and does not deserve a query. Mirrors the guard in
// lib/referrals/db.ts for the same reason.
export function isPlausibleShareToken(input: unknown): input is string {
  if (typeof input !== "string") return false;
  if (input.length < 32 || input.length > 64) return false;
  return /^[A-Za-z0-9_-]+$/.test(input);
}

// Normalising here rather than at each call site because the same
// address arriving as "Dangulu1@Gmail.com " and "dangulu1@gmail.com"
// should be one recipient in the shared-with list, not two.
export function normaliseRecipientEmail(input: string): string {
  return input.trim().toLowerCase();
}

// Deliberately permissive. This is an operator typing a colleague's
// address into an admin form, not a public signup, so the job is to
// catch a fat-fingered entry rather than to adjudicate RFC 5322.
export function isPlausibleEmail(input: string): boolean {
  const value = input.trim();
  if (value.length < 6 || value.length > 254) return false;
  if (/\s/.test(value)) return false;
  return /^[^@]+@[^@.]+\.[^@]+$/.test(value);
}

// ---------------------------------------------------------------------
// Persistence
// ---------------------------------------------------------------------

const MAX_TOKEN_RETRIES = 5;

export type CreateShareInput = {
  agreementId: string;
  recipientEmail: string;
  recipientName?: string | null;
  recipientRelationship?: string | null;
  createdByEmail?: string | null;
  ttlDays?: number;
};

// Issue a fresh share. One row per (agreement, recipient) is the
// intent, but it is not a unique constraint: reissuing after an expiry
// is a legitimate second row and the history of who was given access
// when is worth keeping. The "shared with" list therefore shows the
// live share per recipient and treats older rows as history.
export async function createAgreementShare(input: CreateShareInput) {
  const recipientEmail = normaliseRecipientEmail(input.recipientEmail);
  const expiresAt = shareExpiryFrom(new Date(), input.ttlDays);

  for (let attempt = 0; attempt < MAX_TOKEN_RETRIES; attempt++) {
    try {
      return await prisma.agreementShare.create({
        data: {
          agreementId: input.agreementId,
          token: generateDashboardToken(),
          recipientEmail,
          recipientName: input.recipientName?.trim() || null,
          recipientRelationship: input.recipientRelationship?.trim() || null,
          createdByEmail: input.createdByEmail ?? null,
          expiresAt,
        },
      });
    } catch (err) {
      // A 32-byte collision will not happen. Retrying anyway costs one
      // branch and means the impossible case is a retry rather than a
      // 500 on an operator's screen.
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2002" &&
        ((err.meta?.target as string[] | undefined) ?? []).includes("token")
      ) {
        continue;
      }
      throw err;
    }
  }
  throw new Error("Failed to allocate a unique agreement share token");
}

// Look a token up and record the view in one go.
//
// Returns the share with its agreement and the property/client context
// the page needs to render the contract, or null for anything that is
// not a live share. Callers get null for "no such token", "revoked"
// and "expired" alike when they use this; the page uses
// findShareForDisplay below when it wants to tell the recipient which
// of those happened.
export async function consumeShareToken(token: unknown) {
  const share = await findShareForDisplay(token);
  if (!share) return null;
  if (!shareUsability(share).usable) return null;

  // Best-effort. A failure to write the view counter must never stop
  // an advocate reading a contract.
  try {
    await prisma.agreementShare.update({
      where: { id: share.id },
      data: {
        firstViewedAt: share.firstViewedAt ?? new Date(),
        lastViewedAt: new Date(),
        viewCount: { increment: 1 },
      },
    });
  } catch (err) {
    console.warn("[agreement-share] failed to record view", err);
  }

  return share;
}

// The same lookup without the view side effect, and without the
// usability filter, so the route can distinguish "revoked" from
// "expired" from "never existed" and say something useful. Kept
// separate from consumeShareToken so a GET that only wants to explain
// itself does not inflate the view count.
export async function findShareForDisplay(token: unknown) {
  if (!isPlausibleShareToken(token)) return null;

  return prisma.agreementShare.findUnique({
    where: { token },
    include: {
      agreement: {
        include: {
          property: {
            select: {
              id: true,
              name: true,
              unitNumber: true,
              city: true,
              address: true,
              propertyType: true,
              bedrooms: true,
              maxOccupancy: true,
              launchedAt: true,
              client: {
                select: {
                  fullName: true,
                  companyName: true,
                  companyRegistrationNumber: true,
                  idNumber: true,
                  kraPin: true,
                  address: true,
                  preferredCurrency: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function revokeAgreementShare(id: string) {
  // updateMany rather than update so revoking an already-revoked or
  // deleted share is a no-op instead of a thrown error on a button
  // someone double-clicked.
  const result = await prisma.agreementShare.updateMany({
    where: { id, revokedAt: null },
    data: { revokedAt: new Date() },
  });
  return result.count > 0;
}

// Everything shared for one agreement, newest first, for the admin
// card and the client's own "shared with" list.
export async function listSharesForAgreement(agreementId: string) {
  return prisma.agreementShare.findMany({
    where: { agreementId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      recipientEmail: true,
      recipientName: true,
      recipientRelationship: true,
      expiresAt: true,
      revokedAt: true,
      createdByEmail: true,
      firstViewedAt: true,
      lastViewedAt: true,
      viewCount: true,
      createdAt: true,
    },
  });
}

export function shareUrl(token: string, siteUrl: string): string {
  return `${siteUrl.replace(/\/$/, "")}/agreements/shared/${token}`;
}
