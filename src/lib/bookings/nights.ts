// Pure helper to count whole nights between a check-in and a
// check-out. Both inputs are interpreted as calendar dates anchored
// to UTC midnight; the answer is the number of midnights crossed.
// Same-day check-in/out is invalid in nightly-rate accounting and
// returns 0 so the caller can reject early.

export function nightsBetween(checkIn: Date, checkOut: Date): number {
  const ms = checkOut.getTime() - checkIn.getTime();
  if (ms <= 0) return 0;
  return Math.round(ms / (1000 * 60 * 60 * 24));
}
