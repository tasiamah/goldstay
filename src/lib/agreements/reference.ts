// Human-quotable identifiers for agreements.
//
// Agreement references (GS-2026-004) go on the face of the contract so
// a client can quote one in an email; acceptance receipts (GS-A-...)
// are handed back after one-click acceptance, which clause 12.3 of the
// short-let agreement asks for ("GoldStay will provide a downloadable
// copy or receipt"). Neither replaces the cuid primary key — they exist
// only to be read aloud and typed by humans.

import { randomBytes } from "node:crypto";
import type { PrismaClient } from "@prisma/client";

// Ambiguous glyphs removed (no 0/O, 1/I/L) so a receipt read off a
// screen and typed into an email doesn't come back wrong.
const RECEIPT_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function formatAgreementReference(year: number, seq: number): string {
  return `GS-${year}-${String(seq).padStart(3, "0")}`;
}

// Next free GS-YYYY-### for the current year.
//
// Derived from a count rather than a database sequence, so a gap can
// appear if a row is ever hard-deleted and two concurrent issues can
// collide. Both are acceptable: the reference is a label, not a
// control, the unique index turns a collision into a failed write
// rather than a duplicate, and the caller retries. At GoldStay's
// volume — a handful of agreements a week, all issued by an admin
// clicking a button — a real collision needs two admins in the same
// millisecond.
export async function nextAgreementReference(
  db: Pick<PrismaClient, "managementAgreement">,
  now = new Date(),
): Promise<string> {
  const year = now.getUTCFullYear();
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));

  const issued = await db.managementAgreement.count({
    where: { createdAt: { gte: start, lt: end } },
  });

  return formatAgreementReference(year, issued + 1);
}

// Receipt reference for an acceptance. Random rather than sequential:
// unlike the agreement reference it isn't a register, and a guessable
// receipt id invites someone to probe for other clients' acceptances.
export function newAcceptanceReference(now = new Date()): string {
  const bytes = randomBytes(8);
  let suffix = "";
  for (const byte of bytes) {
    suffix += RECEIPT_ALPHABET[byte % RECEIPT_ALPHABET.length];
  }
  return `GS-A-${now.getUTCFullYear()}-${suffix}`;
}
