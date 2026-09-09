// Which referral and referrer state changes are legal, and what each
// one implies.
//
// Pure, and separate from db.ts, because these are the rules an
// operator's click is checked against and they should be assertable
// without a database. The referral lifecycle also has one property
// worth defending in a test: SIGNED originates a twelve-month payout
// schedule, so it must not be reachable by accident or reachable
// twice.

import type { ReferralStatus, ReferrerStatus, PayoutStatus } from "@prisma/client";

// Forward-only, with one exception.
//
// ATTRIBUTED → CONTACTED → QUALIFIED → SIGNED is the happy path, and
// skipping ahead is allowed because an agent sometimes introduces a
// landlord who signs the same week and forcing three clicks would
// just teach operators to distrust the buttons.
//
// Going backwards is not allowed. CONTACTED means somebody spoke to
// the landlord, which does not become untrue, and un-signing would
// orphan a payout schedule that may already have paid out. The one
// legitimate reversal is SIGNED → CHURNED, which is what off-boarding
// a referred landlord looks like.
// REJECTED is reachable from any pre-signing state, because a lead
// can turn out to be out of scope at any point before there is a
// contract, but never from SIGNED — refusing a landlord we already
// signed is a churn, and the difference matters to the agent, who is
// owed the months already accrued either way.
const ALLOWED: Record<ReferralStatus, readonly ReferralStatus[]> = {
  ATTRIBUTED: ["CONTACTED", "QUALIFIED", "SIGNED", "REJECTED"],
  CONTACTED: ["QUALIFIED", "SIGNED", "REJECTED"],
  QUALIFIED: ["SIGNED", "REJECTED"],
  SIGNED: ["CHURNED"],
  // Terminal. A landlord who leaves and later returns is a new
  // referral, not a resurrection of the old one, because the terms
  // and the rent would both have moved.
  CHURNED: [],
  // Terminal. Reopening a refused lead hides why it was refused;
  // a genuine second approach is a new referral.
  REJECTED: [],
};

export function canTransitionReferral(
  from: ReferralStatus,
  to: ReferralStatus,
): boolean {
  if (from === to) return false;
  return ALLOWED[from].includes(to);
}

export function allowedReferralTransitions(
  from: ReferralStatus,
): readonly ReferralStatus[] {
  return ALLOWED[from];
}

// The timestamp column a transition should stamp, if any. Returned
// rather than applied so db.ts stays the only writer.
export function timestampFieldFor(
  to: ReferralStatus,
): "contactedAt" | "signedAt" | null {
  if (to === "CONTACTED") return "contactedAt";
  if (to === "SIGNED") return "signedAt";
  return null;
}

// Whether reaching this status should originate a payout schedule.
// Only SIGNED does, and only once — db.ts relies on the
// (referralId, monthIndex) unique index to make a second attempt a
// no-op rather than a double payout.
export function originatesPayouts(to: ReferralStatus): boolean {
  return to === "SIGNED";
}

export const REFERRAL_STATUS_LABEL: Record<ReferralStatus, string> = {
  ATTRIBUTED: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Likely to sign",
  SIGNED: "Signed",
  CHURNED: "Churned",
  REJECTED: "Not a fit",
};

export const REFERRER_STATUS_LABEL: Record<ReferrerStatus, string> = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  TERMINATED: "Terminated",
};

export const PAYOUT_STATUS_LABEL: Record<PayoutStatus, string> = {
  SCHEDULED: "Scheduled",
  PAID: "Paid",
  CANCELLED: "Cancelled",
};

// What changing a referrer's status does to money already scheduled.
//
// The schema comments define this and the implementation must match:
// PAUSED holds the link working and leaves payouts SCHEDULED, while
// TERMINATED kills the link and cancels anything not yet paid. Paid
// rows are never touched by either — that money has left.
export function cancelsScheduledPayouts(to: ReferrerStatus): boolean {
  return to === "TERMINATED";
}

export function referrerLinkWorks(status: ReferrerStatus): boolean {
  return status === "ACTIVE";
}

// A payout can only be settled or killed while it is still
// scheduled. Marking an already-paid row paid again would overwrite
// the reference of the payment that actually happened, which is the
// one piece of evidence that it did.
export function canSettlePayout(status: PayoutStatus): boolean {
  return status === "SCHEDULED";
}

// Whether a scheduled payout is ready to be paid, i.e. its month has
// arrived. Ops can still pay early; this only drives the "due now"
// queue so the common case is a short list rather than a year of
// future rows.
export function isPayoutDue(
  payout: { status: PayoutStatus; scheduledFor: Date },
  now: Date = new Date(),
): boolean {
  if (payout.status !== "SCHEDULED") return false;
  return payout.scheduledFor.getTime() <= now.getTime();
}
