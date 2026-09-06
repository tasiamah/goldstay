// Photography rate card, shared verbatim by both Kenyan agreements.
//
// One module rather than the figures typed into each contract, because
// the two documents have to quote the same price. A landlord with a
// short-let and a long-let with us, reading two different numbers for
// the same service, is a discrepancy we would simply lose.
//
// Safe to state in code, unlike the fee percentage and the notice
// period: those live on the ManagementAgreement row and are
// snapshotted per property, so hard-coding them could contradict what
// we actually bill. This is a published rate card that applies to
// everyone. If it ever becomes negotiable per property it belongs on
// the row instead, and these constants have to go.
//
// Editing a figure here rewrites the rate in every agreement that has
// not yet been accepted, and in the HTML view of ones that have, since
// rendering builds from current clause text rather than from the
// stored version. Bump both contract versions when you change it.

export const PHOTOGRAPHY_FEE_UP_TO_ONE_BED_USD = 100;
export const PHOTOGRAPHY_FEE_TWO_PLUS_BEDS_USD = 150;

// The rate as a clause fragment, not a whole sentence: the short-let
// agreement folds photography into its defined term "Startup Costs"
// and the long-term one has no such concept, so each has to supply its
// own surrounding wording.
//
// Stated as a two-tier card rather than resolved against the
// property's bedroom count on purpose. Bedrooms are nullable and a
// studio is sometimes recorded as one bed, so computing a single
// figure would occasionally print the wrong one — and a contract that
// names both tiers is right whichever the property turns out to be.
export const PHOTOGRAPHY_RATE_TEXT = `USD ${PHOTOGRAPHY_FEE_UP_TO_ONE_BED_USD} for a studio or one-bedroom Property and USD ${PHOTOGRAPHY_FEE_TWO_PLUS_BEDS_USD} for a Property with two or more bedrooms`;

// Why the charge arises at all. Photography is billed only where we
// judge it necessary, so a property that already has usable images is
// not charged for images it does not need.
export const PHOTOGRAPHY_TRIGGER_TEXT =
  "where the Manager determines it is required for the Property";

// Both routes, with the deduction as the default so silence has a
// defined outcome rather than leaving the client to guess whether an
// invoice is coming.
export const PHOTOGRAPHY_TIMING_TEXT =
  "paid in advance or, if not paid in advance, deducted from the first payout";
