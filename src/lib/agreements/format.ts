// Display helpers for ManagementAgreement rows. Pure formatters so
// they can be unit-tested and reused in admin/owner pages and PDF
// without dragging React in.

import type { AgreementStatus } from "@prisma/client";

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

export function formatMoney(
  amount: number | string,
  currency: string,
): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return "Not set";
  return `${currency} ${n.toLocaleString("en-GB", {
    maximumFractionDigits: 0,
  })}`;
}
