// The standard turnover charge applied to a stay when the source of
// the booking did not supply one of its own.
//
// Why it lives on Booking.cleaningFee rather than on a CLEANING_FEE
// transaction: the two already mean different things here. The
// booking field is subtracted from the owner's payout in
// buildShortTermSummary, so it is a cost passed through to the
// landlord. A CLEANING_FEE transaction is counted in
// lib/admin/finance as a Goldstay cost — the ad-hoc case where we
// absorb a clean instead of passing it on. Charging the owner means
// the booking field.
//
// The figure is cost recovery, not a line we earn on. /pricing tells
// clients third-party costs are "billed at what we were charged with
// no markup", so the standard rate has to stay equal to what a
// turnover actually costs us — the cleaner's time plus consumables.
// If the real cost moves, this number moves with it.

// Per currency rather than one number converted at run time: there
// is no FX pass anywhere in this codebase, and a stay priced in USD
// settling against a KES rate would be a silently wrong deduction on
// someone's statement.
// The two figures are deliberately equivalent at the prevailing rate
// (XE mid-market, 5 Oct 2026: 1 USD = 129.748 KES, so USD 7.70 is
// KES 999). Keeping them in step matters because a property is
// charged in whichever currency its bookings settle in, and a pair
// that has drifted would quietly charge a USD-earning unit more than
// a KES-earning one for the same clean.
export const STANDARD_CLEANING_FEE: Record<string, number> = {
  KES: 1000,
  USD: 7.7,
};

export type CleaningInput = {
  currency: string;
  grossAmount: number;
  cleaningFee: number | null | undefined;
  netPayout: number;
  /** Per-property override, when that property is not on the standard rate. */
  propertyFee?: number | null;
};

export type CleaningOutcome = {
  cleaningFee: number;
  netPayout: number;
  /** True when this call introduced the charge rather than passing one through. */
  applied: boolean;
};

export function applyStandardCleaning(input: CleaningInput): CleaningOutcome {
  const supplied = input.cleaningFee ?? 0;
  const unchanged: CleaningOutcome = {
    cleaningFee: supplied,
    netPayout: input.netPayout,
    applied: false,
  };

  // The channel already charged for cleaning. Adding ours on top
  // would bill the owner twice for one turnover.
  if (supplied > 0) return unchanged;

  // A stay with no money on it is a calendar placeholder, not a
  // settled booking — an iCal feed carries dates and nothing else.
  // Deducting a clean from it would put a charge on a statement that
  // shows no revenue to set it against, which reads to the owner as
  // us invoicing them for a guest they were never paid for.
  if (!(input.grossAmount > 0)) return unchanged;

  const fee =
    input.propertyFee != null && input.propertyFee > 0
      ? input.propertyFee
      : (STANDARD_CLEANING_FEE[input.currency?.toUpperCase()] ?? 0);

  // No standard rate for this currency and no override. Better to
  // leave it for someone to enter by hand than to guess.
  if (!(fee > 0)) return unchanged;

  return {
    cleaningFee: fee,
    // Derived from the payout we already held rather than recomputed
    // from gross, so whatever the channel told us about its own
    // deductions survives having ours applied on top.
    netPayout: Math.max(0, input.netPayout - fee),
    applied: true,
  };
}
