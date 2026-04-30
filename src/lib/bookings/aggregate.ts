// Pure aggregation helpers for short-term booking analytics. Operate
// on plain objects so they're trivial to unit test and easy to call
// from both the server-rendered owner dashboard and the statement
// PDF route. No Prisma imports here.

import { nightsBetween } from "./nights";

export type BookingLike = {
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

export type Period = { start: Date; end: Date };

// Booked nights inside [start, end). Cancelled bookings are excluded.
// Bookings that straddle the period boundary are clipped, so a Jan 28
// → Feb 4 stay contributes 4 nights to January and 3 to February.
export function bookedNightsInPeriod(
  bookings: BookingLike[],
  period: Period,
): number {
  const startMs = period.start.getTime();
  const endMs = period.end.getTime();
  let total = 0;
  for (const b of bookings) {
    if (b.status === "CANCELLED") continue;
    const inMs = Math.max(b.checkIn.getTime(), startMs);
    const outMs = Math.min(b.checkOut.getTime(), endMs);
    if (outMs <= inMs) continue;
    total += nightsBetween(new Date(inMs), new Date(outMs));
  }
  return total;
}

export function totalNightsInPeriod(period: Period): number {
  return nightsBetween(period.start, period.end);
}

export function occupancyPercentForPeriod(
  bookings: BookingLike[],
  period: Period,
): number | null {
  const total = totalNightsInPeriod(period);
  if (total <= 0) return null;
  const booked = bookedNightsInPeriod(bookings, period);
  return Math.round((booked / total) * 100);
}

export type RevenueTotals = {
  currency: string;
  bookings: number;
  nights: number;
  gross: number;
  otaFees: number;
  cleaning: number;
  netPayout: number;
};

// Sums revenue components per currency. Cancelled bookings are
// skipped. Multi-currency portfolios get one row per currency since
// we don't FX-convert on the fly.
export function revenueTotalsByCurrency(
  bookings: BookingLike[],
  period: Period,
): RevenueTotals[] {
  const startMs = period.start.getTime();
  const endMs = period.end.getTime();
  const buckets = new Map<string, RevenueTotals>();

  for (const b of bookings) {
    if (b.status === "CANCELLED") continue;
    // Booking counts toward the period if any of its nights overlap.
    if (b.checkOut.getTime() <= startMs) continue;
    if (b.checkIn.getTime() >= endMs) continue;

    const bucket = buckets.get(b.currency) ?? {
      currency: b.currency,
      bookings: 0,
      nights: 0,
      gross: 0,
      otaFees: 0,
      cleaning: 0,
      netPayout: 0,
    };
    bucket.bookings += 1;
    bucket.nights += b.nights;
    bucket.gross += b.grossAmount;
    bucket.otaFees += b.otaCommission ?? 0;
    bucket.cleaning += b.cleaningFee ?? 0;
    bucket.netPayout += b.netPayout;
    buckets.set(b.currency, bucket);
  }

  return [...buckets.values()].sort((a, b) =>
    a.currency.localeCompare(b.currency),
  );
}
