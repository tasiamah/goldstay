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
// One past the highest sequence already issued this year, *not* the
// count plus one. Counting looks equivalent and is not: delete a
// single agreement and the count points back at a number the unique
// index is still holding, so every subsequent issue fails and keeps
// failing. Highest-plus-one leaves a gap where the deleted row was
// and moves on, which is the right trade — the reference is a label
// for humans to quote, not a dense register.
//
// The scan reads every reference for the year rather than asking the
// database for a maximum, because the sequence is zero-padded to a
// minimum of three digits: sorted as text, GS-2026-999 outranks
// GS-2026-1000. Parsing in memory keeps the comparison numeric. At a
// few hundred agreements a year that is one small indexed read.
//
// Two concurrent issues can still land on the same number. The unique
// index turns that into a failed write rather than a duplicate
// reference, and at GoldStay's volume — a handful a week, each an
// admin clicking a button — it needs two admins in the same instant.
export async function nextAgreementReference(
  db: Pick<PrismaClient, "managementAgreement">,
  now = new Date(),
): Promise<string> {
  const year = now.getUTCFullYear();
  const prefix = `GS-${year}-`;

  const issued = await db.managementAgreement.findMany({
    where: { reference: { startsWith: prefix } },
    select: { reference: true },
  });

  let highest = 0;
  for (const { reference } of issued) {
    // Anything that isn't a plain number after the prefix is not part
    // of the sequence and must not drag the next reference anywhere.
    const seq = Number(reference?.slice(prefix.length));
    if (Number.isInteger(seq) && seq > highest) highest = seq;
  }

  return formatAgreementReference(year, highest + 1);
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
