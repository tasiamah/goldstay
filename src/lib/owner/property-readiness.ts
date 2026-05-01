// Computes what's blocking a single owner property from going ACTIVE.
//
// The property's PropertyStatus enum (ONBOARDING / ACTIVE / EXITED)
// only carries Goldstay's verdict — it doesn't tell the owner *why*
// they're still in onboarding. This helper enumerates the three
// real-world blockers an owner can act on (or wait on) so the UI
// can display them inline rather than leaving the owner to guess.
//
// Three possible blockers, in the order an owner would tackle them:
//
//   1. setup            — owner hasn't finished the 3-step account
//                          checklist (details / legal / bank).
//   2. agreement        — Goldstay has issued a management agreement
//                          for this property and the owner hasn't
//                          signed it yet.
//   3. goldstay_review  — owner's side is done but Goldstay hasn't
//                          flipped the property to ACTIVE yet (e.g.
//                          waiting on title-deed verification, photo
//                          shoot, OTA listing setup).
//
// Pure with respect to its inputs — easy to unit-test.

import type { PropertyStatus } from "@prisma/client";

export type ReadinessBlockerKey =
  | "setup"
  | "agreement"
  | "goldstay_review";

export type ReadinessBlocker = {
  key: ReadinessBlockerKey;
  label: string;
  // What the owner can click on. Null when the blocker is on
  // Goldstay's side (review) — there's no productive action.
  href: string | null;
};

export type PropertyReadiness = {
  // Convenience: true when status is already ACTIVE.
  isActive: boolean;
  // Convenience: true when the property is ONBOARDING but every
  // blocker is on Goldstay's side. The UI can use this to show
  // "Awaiting Goldstay review" rather than repeating "Setup in
  // progress" — the owner has done their part.
  ownerSideDone: boolean;
  blockers: ReadinessBlocker[];
};

export type ReadinessInputs = {
  propertyStatus: PropertyStatus;
  // Whether this specific property has a management agreement in
  // SENT state awaiting the owner's signature. Drives blocker #2.
  hasPendingAgreement: boolean;
  // Owner-wide setup completeness. Same number the dashboard banner
  // uses; we don't recompute here so a single source of truth.
  setupComplete: boolean;
};

export function computePropertyReadiness(
  inputs: ReadinessInputs,
): PropertyReadiness {
  if (inputs.propertyStatus === "ACTIVE") {
    return { isActive: true, ownerSideDone: true, blockers: [] };
  }
  // EXITED is a terminal state — there's no "activation" to gate.
  // We still return blockers: [] so the UI doesn't show a misleading
  // "what's missing" panel for an exited property.
  if (inputs.propertyStatus === "EXITED") {
    return { isActive: false, ownerSideDone: true, blockers: [] };
  }

  const blockers: ReadinessBlocker[] = [];
  if (!inputs.setupComplete) {
    blockers.push({
      key: "setup",
      label: "Finish your account setup",
      href: "/owner",
    });
  }
  if (inputs.hasPendingAgreement) {
    blockers.push({
      key: "agreement",
      label: "Sign your management agreement",
      // Caller can override with a more specific /owner/agreements/:id
      // link when it has the agreement id; this default is the list.
      href: "/owner",
    });
  }
  // If neither owner-side blocker is present, Goldstay is what's
  // outstanding. We always surface that explicitly — silence here
  // would let an owner think the system was broken.
  if (blockers.length === 0) {
    blockers.push({
      key: "goldstay_review",
      label: "Goldstay verification in progress",
      href: null,
    });
  }

  const ownerSideDone = blockers.every((b) => b.key === "goldstay_review");
  return { isActive: false, ownerSideDone, blockers };
}
