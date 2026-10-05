// Short-term rental statement aggregation. Pure inputs/outputs so the
// PDF template, client dashboard, and any future endpoint can share
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
  expenses: number;
  payout: number;
};

export function buildShortTermSummary(
  bookings: (StatementBooking & { propertyName: string })[],
  deductionTransactions: StatementBookingTransaction[],
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
      expenses: 0,
      payout: 0,
    };

    // Nights are clipped to the window, because occupancy genuinely
    // splits: a 28 Sep -> 5 Oct stay filled three nights of
    // September and four of October.
    const inMs = Math.max(b.checkIn.getTime(), startMs);
    const outMs = Math.min(b.checkOut.getTime(), endMs);
    const clipped =
      outMs > inMs ? nightsBetween(new Date(inMs), new Date(outMs)) : 0;
    row.nights += clipped;

    // Money is not clipped — a guest payment is one payment, and
    // splitting it pro-rata would never match the bank. So it is
    // booked whole to the period the stay began in, and only there.
    // Adding it to every period the stay touches, which is what this
    // used to do, reported the same payment on two statements: the
    // owner saw October revenue they had already been paid for in
    // September.
    const checkInMs = b.checkIn.getTime();
    if (checkInMs >= startMs && checkInMs < endMs) {
      row.bookings += 1;
      row.gross += b.grossAmount;
      row.otaFees += b.otaCommission ?? 0;
      row.cleaning += b.cleaningFee ?? 0;
      row.payout += b.netPayout;
    }
    rows.set(k, row);
  }

  // Layer in the deductions that live on Transaction rather than
  // Booking: Goldstay's commission, because the % can vary over time,
  // and out-of-pocket costs on the unit, because they have nothing to
  // do with any one stay.
  //
  // Both have to be here. While only commission was subtracted, this
  // row's "Net payout" was larger than the Summary below it by
  // exactly the month's expenses — two different final figures on one
  // page, with the bigger one in bold at the top.
  //
  // Row math now reads:
  //   payout = gross − otaFees − cleaning − goldstayCommission − expenses
  //
  // A cost in a currency the property took no bookings in finds no row
  // and is left to the Summary, which groups by currency. Converting
  // it here would be the only FX in the platform.
  for (const tx of deductionTransactions) {
    const k = keyFor(tx.propertyId, tx.currency);
    const row = rows.get(k);
    if (!row) continue;
    if (tx.type === "GOLDSTAY_COMMISSION") {
      row.goldstayCommission += tx.amount;
    } else if (tx.type === "EXPENSE") {
      row.expenses += tx.amount;
    } else {
      continue;
    }
    row.payout -= tx.amount;
  }

  return [...rows.values()].sort((a, b) =>
    a.propertyName.localeCompare(b.propertyName) ||
    a.currency.localeCompare(b.currency),
  );
}
