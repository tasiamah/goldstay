// Lease status presentation helpers.
//
// Centralised here so the list page and the detail page stay in
// lockstep on label wording and badge palette. Mirrors the
// LEAD_STATUS_* / PROPERTY_STATUS_* convention used elsewhere in
// the admin chrome.

import type { LeaseStatus } from "@prisma/client";

export const LEASE_STATUS_LABEL: Record<LeaseStatus, string> = {
  ACTIVE: "Active",
  ENDED: "Ended",
  TERMINATED: "Terminated",
  PENDING: "Pending",
};

export const LEASE_STATUS_CLASSES: Record<LeaseStatus, string> = {
  ACTIVE: "bg-emerald-50 text-emerald-900 border-emerald-200",
  PENDING: "bg-amber-50 text-amber-900 border-amber-200",
  ENDED: "bg-stone-100 text-stone-600 border-stone-200",
  TERMINATED: "bg-rose-50 text-rose-900 border-rose-200",
};
