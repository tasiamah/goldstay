// Short-term rental statement aggregation. Pure inputs/outputs so the
// PDF template, owner dashboard, and any future endpoint can share
// the same numbers. The period boundary handling matches the
// bookings/aggregate helper: nights are clipped to the window so a
// Jan 28 → Feb 4 stay contributes 4 nights to a January statement.
//
// Goldstay commission is sourced from the Transaction stream rather
// than recomputed, because the commission % can change over time and
// we want the statement to match the bank.

import type { TransactionType } from "@prisma/client";
import { nightsBetween } from "@/lib/bookings/nights";

export type StatementBooking = {
  propertyId: string;
  checkIn: Date;
  checkOut: Date;
  nights: number;
  grossAmount: number;
  otaCommission: number | null;
  cleaningFee: number | null;
  netPayout: number;
  currency: string;
  status: "CONFIRMED" | "CANCELLED" | "COMPLETED";
};

export type StatementBookingTransaction = {
  propertyId: string;
  type: TransactionType;
  amount: number;
  currency: string;
};

export type ShortTermPropertyRow = {
  propertyId: string;
  propertyName: string;
  currency: string;
  bookings: number;
  nights: number;
  gross: number;
  otaFees: number;
  cleaning: number;
  goldstayCommission: number;
  payout: number;
};

export function buildShortTermSummary(
  bookings: (StatementBooking & { propertyName: string })[],
  commissionTransactions: StatementBookingTransaction[],
  period: { start: Date; end: Date },
): ShortTermPropertyRow[] {
  const startMs = period.start.getTime();
  const endMs = period.end.getTime();

  const rows = new Map<string, ShortTermPropertyRow>();
  const keyFor = (propertyId: string, currency: string) =>
    `${propertyId}|${currency}`;

  // Pre-allocate a row per (property, currency) we encounter, even if
  // every booking is cancelled, so the PDF doesn't show ghost zeros
  // for currencies that never appeared.

  for (const b of bookings) {
    if (b.status === "CANCELLED") continue;
    if (b.checkOut.getTime() <= startMs) continue;
    if (b.checkIn.getTime() >= endMs) continue;

    const k = keyFor(b.propertyId, b.currency);
    const row = rows.get(k) ?? {
      propertyId: b.propertyId,
      propertyName: b.propertyName,
      currency: b.currency,
      bookings: 0,
      nights: 0,
      gross: 0,
      otaFees: 0,
      cleaning: 0,
      goldstayCommission: 0,
      payout: 0,
    };

    // Clip nights to the window for accurate per-period split. Money
    // is *not* clipped — short-term accounting books the full guest
    // payment to the period the stay belongs to (anchored to
    // check-in) so it matches the bank statement.
    const inMs = Math.max(b.checkIn.getTime(), startMs);
    const outMs = Math.min(b.checkOut.getTime(), endMs);
    const clipped =
      outMs > inMs ? nightsBetween(new Date(inMs), new Date(outMs)) : 0;

    row.bookings += 1;
    row.nights += clipped;
    row.gross += b.grossAmount;
    row.otaFees += b.otaCommission ?? 0;
    row.cleaning += b.cleaningFee ?? 0;
    row.payout += b.netPayout;
    rows.set(k, row);
  }

  // Layer in Goldstay commission transactions. They live on
  // Transaction (not Booking) because the % can vary over time. We
  // attribute by (property, currency) so the row math reads cleanly:
  // payout = gross − otaFees − cleaning − goldstayCommission.
  for (const tx of commissionTransactions) {
    const k = keyFor(tx.propertyId, tx.currency);
    const row = rows.get(k);
    if (!row) continue;
    row.goldstayCommission += tx.amount;
    row.payout -= tx.amount;
  }

  return [...rows.values()].sort((a, b) =>
    a.propertyName.localeCompare(b.propertyName) ||
    a.currency.localeCompare(b.currency),
  );
}
