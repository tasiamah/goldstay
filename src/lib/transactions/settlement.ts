// Transaction types that settle a balance rather than describe one.
//
// A PAYOUT is us sending a client money an earlier statement already
// said they had earned. The earning was reported when it happened;
// the payout is the money moving. Counting both means counting the
// same income twice, once as revenue and once as a deduction.
//
// This matters more than it sounds, because almost every screen that
// adds transactions up does it as "inflow minus outflow" and a payout
// is the largest outflow a client will ever have. Yar's first payout
// went out in shillings against a unit that earns dollars, so her
// portal had a KES 39,159 outflow with no KES inflow to set against
// it: her own dashboard read minus thirty-nine thousand, and a
// property-costs card counted the money she had been paid as a cost
// of running her flat.
//
// Kept in one place because four independent queries need the same
// answer. Three of them were written before any payout existed, so
// the omission could not be noticed until the first one was recorded.
//
// Deliberately NOT applied to /admin/transactions: that screen is the
// ledger of record and should show every row, including this one.

import type { Prisma, TransactionType } from "@prisma/client";

export const SETTLEMENT_TYPES: readonly TransactionType[] = ["PAYOUT"];

export function isSettlement(type: TransactionType): boolean {
  return SETTLEMENT_TYPES.includes(type);
}

// Spread into a Prisma `where` to leave settlements out of an
// earnings figure. A fragment rather than a whole clause so a caller
// can combine it with their own filters.
export const EXCLUDE_SETTLEMENTS: Prisma.TransactionWhereInput = {
  type: { notIn: [...SETTLEMENT_TYPES] },
};
