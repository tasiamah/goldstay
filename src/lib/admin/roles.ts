// Admin role permissions matrix.
//
// Single source of truth for "can role X do action Y?". Server
// actions and route handlers call `requireRole(...)` which delegates
// to `can(...)` here. The matrix is hand-written rather than rule-
// based because the role count is small and explicit reading is
// more important than generality.
//
// Action keys are dot-namespaced (`owner.write`, `transaction.write`,
// `admin.write`, etc.) so future product surfaces can extend without
// touching every existing call site. Unknown actions deny by default.

import type { AdminRole, Country } from "@prisma/client";

// All actions we currently gate. Adding a new action here is a one-
// line change in the matrix below; missing it means the action is
// unreachable for non-SUPER_ADMIN, which is the safe default.
export type AdminAction =
  | "owner.read"
  | "owner.write"
  | "property.read"
  | "property.write"
  | "property.verify"
  | "lease.read"
  | "lease.write"
  | "booking.read"
  | "booking.write"
  | "transaction.read"
  | "transaction.write"
  | "document.read"
  | "document.write"
  | "agreement.read"
  | "agreement.write"
  | "comms.read"
  | "comms.write"
  | "task.read"
  | "task.write"
  | "note.read"
  | "note.write"
  | "admin.read"
  | "admin.write"
  | "impersonate.owner"
  | "health.read"
  | "import.write"
  | "archive.write";

const SUPER_ADMIN_ALLOWED: ReadonlySet<AdminAction> = new Set(
  // Empty set means "everything"; SUPER_ADMIN bypasses the lookup.
  [],
);

const OPS_ALLOWED: ReadonlySet<AdminAction> = new Set<AdminAction>([
  "owner.read",
  "owner.write",
  "property.read",
  "property.write",
  "property.verify",
  "lease.read",
  "lease.write",
  "booking.read",
  "booking.write",
  "transaction.read",
  "transaction.write",
  "document.read",
  "document.write",
  "agreement.read",
  "agreement.write",
  "comms.read",
  "comms.write",
  "task.read",
  "task.write",
  "note.read",
  "note.write",
  "admin.read",
  "impersonate.owner",
  "health.read",
  "import.write",
  "archive.write",
]);

const ACCOUNTING_ALLOWED: ReadonlySet<AdminAction> = new Set<AdminAction>([
  "owner.read",
  "property.read",
  "lease.read",
  "booking.read",
  "transaction.read",
  "transaction.write",
  "document.read",
  "agreement.read",
  "comms.read",
  "task.read",
  "task.write",
  "note.read",
  "note.write",
  "health.read",
]);

const SUPPORT_ALLOWED: ReadonlySet<AdminAction> = new Set<AdminAction>([
  "owner.read",
  "property.read",
  "lease.read",
  "booking.read",
  "transaction.read",
  "document.read",
  "agreement.read",
  "comms.read",
  "comms.write",
  "task.read",
  "task.write",
  "note.read",
  "note.write",
]);

// COUNTRY_MANAGER is OPS-shaped, scoped to one country. The country
// check is enforced separately in `canForCountry` because some routes
// (eg. health, admin.read) are global even for a country manager.
const COUNTRY_MANAGER_ALLOWED: ReadonlySet<AdminAction> = OPS_ALLOWED;

const MATRIX: Record<AdminRole, ReadonlySet<AdminAction>> = {
  SUPER_ADMIN: SUPER_ADMIN_ALLOWED,
  OPS: OPS_ALLOWED,
  ACCOUNTING: ACCOUNTING_ALLOWED,
  SUPPORT: SUPPORT_ALLOWED,
  COUNTRY_MANAGER: COUNTRY_MANAGER_ALLOWED,
};

// SUPER_ADMIN-only actions, listed once so the test suite can pin
// them and the production code can refuse them for everyone else
// without searching the matrix.
const SUPER_ADMIN_ONLY: ReadonlySet<AdminAction> = new Set<AdminAction>([
  "admin.write",
]);

export function can(role: AdminRole, action: AdminAction): boolean {
  if (role === "SUPER_ADMIN") return true;
  if (SUPER_ADMIN_ONLY.has(action)) return false;
  return MATRIX[role].has(action);
}

// For COUNTRY_MANAGER, additionally checks that the action targets
// the same country as the admin's `AdminUser.country`. Other roles
// pass through `can()` because their access is global.
export function canForCountry(
  role: AdminRole,
  action: AdminAction,
  adminCountry: Country | null,
  targetCountry: Country | null,
): boolean {
  if (!can(role, action)) return false;
  if (role !== "COUNTRY_MANAGER") return true;
  if (adminCountry === null) return false;
  // Targets without a country (e.g. global tasks) are allowed; the
  // restriction kicks in only for country-scoped entities.
  if (targetCountry === null) return true;
  return adminCountry === targetCountry;
}

export const ALL_ROLES: readonly AdminRole[] = [
  "SUPER_ADMIN",
  "OPS",
  "ACCOUNTING",
  "SUPPORT",
  "COUNTRY_MANAGER",
];

export const ROLE_LABEL: Record<AdminRole, string> = {
  SUPER_ADMIN: "Super admin",
  OPS: "Operations",
  ACCOUNTING: "Accounting",
  SUPPORT: "Support",
  COUNTRY_MANAGER: "Country manager",
};
