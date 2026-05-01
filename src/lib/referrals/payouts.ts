// Referral payout maths.
//
// One source of truth for "what does a referrer earn?" so the public
// /refer landing page, the welcome email, the dashboard and the
// scheduled-payout generator all agree to the cent.
//
// Defaults by referrer type are conservative — better to under-promise
// here and exceed at payout time than the reverse. Per-referrer
// overrides on the Referrer row beat the defaults.

import type {
  Referrer,
  ReferrerType,
  Referral,
} from "@prisma/client";

// Share of management fee paid to the referrer per month, by referrer
// type. The duration (`payoutMonths`) is how many of those monthly
// shares we pay out before the referral stops accruing.
//
// Worked example for an AGENT referring a long-term landlord at $1,500/mo:
//   monthly fee  = 1500 × 0.10  = $150
//   referrer cut = 150  × 0.25  = $37.50 / month for 12 months
//   total payout = $450 over the first year of the relationship.
//
// LANDLORD-tier defaults are a single 50% slice of one month's fee,
// because diaspora landlord-to-landlord referrals are rare enough
// that a one-shot cash thank-you outperforms an annuity.
type DefaultsForType = {
  longTermPct: number;
  shortStayPct: number;
  payoutMonths: number;
};

const DEFAULTS: Record<ReferrerType, DefaultsForType> = {
  LANDLORD: { longTermPct: 0.5, shortStayPct: 0.5, payoutMonths: 1 },
  AGENT: { longTermPct: 0.25, shortStayPct: 0.15, payoutMonths: 12 },
  PARTNER: { longTermPct: 0.25, shortStayPct: 0.15, payoutMonths: 12 },
};

export type ResolvedTerms = {
  longTermPct: number;
  shortStayPct: number;
  payoutMonths: number;
};

// Apply per-referrer overrides on top of the type defaults. Pure;
// safe to call from anywhere including the public landing page so
// "as a [type] you earn X" copy never drifts from what the scheduler
// will actually generate.
export function resolveTermsForReferrer(
  referrer: Pick<
    Referrer,
    | "type"
    | "longTermPctOverride"
    | "shortStayPctOverride"
    | "payoutMonthsOverride"
  >,
): ResolvedTerms {
  const d = DEFAULTS[referrer.type];
  return {
    longTermPct: toNumber(referrer.longTermPctOverride) ?? d.longTermPct,
    shortStayPct: toNumber(referrer.shortStayPctOverride) ?? d.shortStayPct,
    payoutMonths: referrer.payoutMonthsOverride ?? d.payoutMonths,
  };
}

export function defaultsForType(type: ReferrerType): DefaultsForType {
  return DEFAULTS[type];
}

function toNumber(d: { toString(): string } | null | undefined): number | null {
  if (d === null || d === undefined) return null;
  const n = Number(d.toString());
  return Number.isFinite(n) ? n : null;
}

export type PayoutScheduleRow = {
  monthIndex: number;
  amountUsd: number;
  scheduledFor: Date;
};

// Generates the full payout schedule for a SIGNED referral. Takes
// pure inputs (no Prisma client) so unit tests don't need a DB and
// the same function powers the dashboard projections.
//
// Strategy is implied by which percentage we use; ops sets it on
// the Referral row at sign time. Long-term is the default because
// it covers ~85% of signings.
export function buildPayoutSchedule(args: {
  signedAt: Date;
  monthlyRentUsd: number;
  managementFeePct: number;
  strategy: "long-term" | "short-stay";
  terms: ResolvedTerms;
}): PayoutScheduleRow[] {
  const {
    signedAt,
    monthlyRentUsd,
    managementFeePct,
    strategy,
    terms,
  } = args;

  if (monthlyRentUsd <= 0) return [];
  if (managementFeePct <= 0) return [];
  const sharePct =
    strategy === "long-term" ? terms.longTermPct : terms.shortStayPct;
  if (sharePct <= 0) return [];

  const monthlyFee = monthlyRentUsd * managementFeePct;
  const monthlyPayout = monthlyFee * sharePct;
  const rounded = Math.round(monthlyPayout * 100) / 100;

  const out: PayoutScheduleRow[] = [];
  for (let i = 1; i <= terms.payoutMonths; i++) {
    out.push({
      monthIndex: i,
      amountUsd: rounded,
      scheduledFor: addMonths(signedAt, i),
    });
  }
  return out;
}

// Add N calendar months without pulling in date-fns. Handles month
// rollover (Jan 31 + 1 month → Feb 28 / 29) by clamping the day to
// the target month's last valid day.
export function addMonths(date: Date, months: number): Date {
  const d = new Date(date.getTime());
  const targetMonth = d.getUTCMonth() + months;
  const targetYear = d.getUTCFullYear() + Math.floor(targetMonth / 12);
  const normalisedMonth = ((targetMonth % 12) + 12) % 12;
  const lastDay = new Date(
    Date.UTC(targetYear, normalisedMonth + 1, 0),
  ).getUTCDate();
  d.setUTCFullYear(targetYear, normalisedMonth, Math.min(d.getUTCDate(), lastDay));
  return d;
}

// Total a referrer would earn from a given referral over its full
// payout window. Used by the dashboard to project lifetime value.
export function projectLifetimeEarnings(args: {
  monthlyRentUsd: number;
  managementFeePct: number;
  strategy: "long-term" | "short-stay";
  terms: ResolvedTerms;
}): number {
  const sharePct =
    args.strategy === "long-term"
      ? args.terms.longTermPct
      : args.terms.shortStayPct;
  const monthly = args.monthlyRentUsd * args.managementFeePct * sharePct;
  return Math.round(monthly * args.terms.payoutMonths * 100) / 100;
}

// Convenience used by the dashboard server component to project a
// schedule for a Referral row that has already been SIGNED. Falls
// back to no schedule when the snapshot fields are missing.
export function projectScheduleFromReferral(
  referral: Pick<
    Referral,
    "signedAt" | "monthlyRentUsd" | "managementFeePct"
  >,
  terms: ResolvedTerms,
  strategy: "long-term" | "short-stay" = "long-term",
): PayoutScheduleRow[] {
  if (!referral.signedAt) return [];
  const rent = toNumber(referral.monthlyRentUsd);
  const fee = toNumber(referral.managementFeePct);
  if (!rent || !fee) return [];
  return buildPayoutSchedule({
    signedAt: referral.signedAt,
    monthlyRentUsd: rent,
    managementFeePct: fee,
    strategy,
    terms,
  });
}
