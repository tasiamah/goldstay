// Status and type pills for the referral screens.
//
// Server components, so they can be used from either the list or the
// detail page without pulling anything into the client bundle.

import type {
  PayoutStatus,
  ReferralStatus,
  ReferrerStatus,
  ReferrerType,
} from "@prisma/client";
import {
  PAYOUT_STATUS_LABEL,
  REFERRAL_STATUS_LABEL,
  REFERRER_STATUS_LABEL,
} from "@/lib/referrals/lifecycle";

const BASE = "inline-flex rounded-full px-2 py-0.5 text-xs font-medium";

const REFERRER_TONE: Record<ReferrerStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-700",
  PAUSED: "bg-amber-50 text-amber-700",
  TERMINATED: "bg-stone-100 text-stone-600",
};

// Signed is the one that matters commercially, so it gets the only
// strong colour; the states before it are stages, not outcomes.
const REFERRAL_TONE: Record<ReferralStatus, string> = {
  ATTRIBUTED: "bg-sky-50 text-sky-700",
  CONTACTED: "bg-stone-100 text-stone-700",
  QUALIFIED: "bg-indigo-50 text-indigo-700",
  SIGNED: "bg-emerald-50 text-emerald-700",
  CHURNED: "bg-stone-100 text-stone-500",
  REJECTED: "bg-stone-100 text-stone-500",
};

const PAYOUT_TONE: Record<PayoutStatus, string> = {
  SCHEDULED: "bg-amber-50 text-amber-700",
  PAID: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-stone-100 text-stone-500",
};

const TYPE_LABEL: Record<ReferrerType, string> = {
  AGENT: "Agent",
  LANDLORD: "Landlord",
  PARTNER: "Partner",
};

export function ReferrerStatusPill({ status }: { status: ReferrerStatus }) {
  return (
    <span className={`${BASE} ${REFERRER_TONE[status]}`}>
      {REFERRER_STATUS_LABEL[status]}
    </span>
  );
}

export function ReferralStatusPill({ status }: { status: ReferralStatus }) {
  return (
    <span className={`${BASE} ${REFERRAL_TONE[status]}`}>
      {REFERRAL_STATUS_LABEL[status]}
    </span>
  );
}

export function PayoutStatusPill({ status }: { status: PayoutStatus }) {
  return (
    <span className={`${BASE} ${PAYOUT_TONE[status]}`}>
      {PAYOUT_STATUS_LABEL[status]}
    </span>
  );
}

export function ReferrerTypePill({ type }: { type: ReferrerType }) {
  return (
    <span className={`${BASE} bg-stone-100 text-stone-700`}>
      {TYPE_LABEL[type]}
    </span>
  );
}
