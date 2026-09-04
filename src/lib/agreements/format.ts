// Display helpers for ManagementAgreement rows. Pure formatters so
// they can be unit-tested and reused in admin/client pages and PDF
// without dragging React in.

import type { AgreementStatus, AgreementTemplate } from "@prisma/client";

export const AGREEMENT_STATUS_LABEL: Record<AgreementStatus, string> = {
  DRAFT: "Draft",
  SENT: "Awaiting signature",
  SIGNED: "Signed",
  CANCELLED: "Cancelled",
};

// Tailwind class set per status, mirroring the property status badges
// for visual consistency. Amber for action-required, emerald for done.
export const AGREEMENT_STATUS_CLASSES: Record<AgreementStatus, string> = {
  DRAFT: "border-stone-200 bg-stone-50 text-stone-700",
  SENT: "border-amber-200 bg-amber-50 text-amber-900",
  SIGNED: "border-emerald-200 bg-emerald-50 text-emerald-900",
  CANCELLED: "border-stone-200 bg-stone-100 text-stone-600",
};

export function formatCommissionPct(rate: number | string): string {
  const n = typeof rate === "string" ? Number(rate) : rate;
  if (!Number.isFinite(n)) return "Not set";
  return `${Math.round(n * 100)}%`;
}

export function formatMoney(amount: number | string, currency: string): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "Not set";
  return `${currency} ${n.toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}

// The four headline terms shown above the contract on the client sign
// page, the admin agreement card and the executed PDF.
//
// Shared because the three had already drifted with only two
// templates: admin said "Early exit: unrecovered startup costs" for a
// short-let while the PDF printed the raw earlyExitFee of zero for the
// same row, which reads as "no exit fee" and is the opposite of what
// clause 10.3 says. With a third template that drift would triple, and
// it is the kind that gets quoted at you in a dispute.
//
// The right value depends on the template because the columns mean
// different things per contract. termMonths is a real minimum term
// under the short-let agreement, and no term at all under the
// long-term one, where the same figure would contradict "no lock-in".
export type AgreementTermSummary = { label: string; value: string };

export function agreementTermSummary(input: {
  template: AgreementTemplate;
  termMonths: number;
  commissionPct: string;
  noticePeriodDays: number;
  earlyExitFeeFormatted: string;
}): AgreementTermSummary[] {
  const notice = {
    label: "Notice period",
    value: `${input.noticePeriodDays} days`,
  };

  switch (input.template) {
    case "SHORT_LET_KE_V1":
      return [
        {
          label: "Minimum term",
          value: `${input.termMonths} months`,
        },
        { label: "Management fee", value: input.commissionPct },
        notice,
        // Clause 10.3 sets this as a calculation off costs incurred,
        // not a figure knowable at issue.
        { label: "Early exit", value: "Unrecovered startup costs" },
      ];
    case "LONG_LET_KE_V1":
      return [
        { label: "Term", value: "No minimum term" },
        { label: "Management fee", value: input.commissionPct },
        notice,
        { label: "Early exit", value: "No exit fee" },
      ];
    case "GENERIC_MANAGEMENT_V1":
      return [
        { label: "Term", value: `${input.termMonths} months` },
        { label: "Commission", value: input.commissionPct },
        notice,
        { label: "Early-exit fee", value: input.earlyExitFeeFormatted },
      ];
  }
}
