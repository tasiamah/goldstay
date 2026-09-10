// Computes what's blocking a single client property from going ACTIVE.
//
// The property's PropertyStatus enum (ONBOARDING / ACTIVE / EXITED)
// only carries Goldstay's verdict — it doesn't tell the client *why*
// they're still in onboarding. This helper enumerates the three
// real-world blockers a client can act on (or wait on) so the UI
// can display them inline rather than leaving the client to guess.
//
// Two possible blockers:
//
//   1. agreement        — Goldstay has issued a management agreement
//                          for this property and the client hasn't
//                          signed it yet. This is the only thing that
//                          holds a listing back.
//   2. goldstay_review  — signed, but not flipped to ACTIVE yet. Rare
//                          now that acceptance activates the property
//                          automatically; kept for properties that
//                          predate that and for the moments between.
//
// The account checklist (details / legal / bank) used to be listed
// here as blocker one, above the agreement. It was never true: the
// admin gate is decidePropertyGoLive, which takes agreement statuses
// and nothing else, and the document requirement that once existed
// was deliberately removed. Showing it told clients their listing was
// waiting on a KRA PIN and a bank account when it was not, and the
// practical cost was momentum — owners who take weeks to produce an
// ID were sitting on an empty property that could have been earning.
//
// Bank details are still needed, for paying the client rather than
// for letting the property, and the dashboard already carries the
// setup checklist for that. It just does not belong on a property.
//
// Pure with respect to its inputs — easy to unit-test.

import type { PropertyStatus } from "@prisma/client";

export type ReadinessBlockerKey = "agreement" | "goldstay_review";

export type ReadinessBlocker = {
  key: ReadinessBlockerKey;
  label: string;
  // What the client can click on. Null when the blocker is on
  // Goldstay's side (review) — there's no productive action.
  href: string | null;
};

export type PropertyReadiness = {
  // Convenience: true when status is already ACTIVE.
  isActive: boolean;
  // Convenience: true when the property is ONBOARDING but every
  // blocker is on Goldstay's side. The UI can use this to show
  // "Awaiting Goldstay review" rather than repeating "Setup in
  // progress" — the client has done their part.
  clientSideDone: boolean;
  blockers: ReadinessBlocker[];
};

export type ReadinessInputs = {
  propertyStatus: PropertyStatus;
  // Whether this specific property has a management agreement in
  // SENT state awaiting the client's signature. Drives blocker #2.
  hasPendingAgreement: boolean;
};

export function computePropertyReadiness(
  inputs: ReadinessInputs,
): PropertyReadiness {
  if (inputs.propertyStatus === "ACTIVE") {
    return { isActive: true, clientSideDone: true, blockers: [] };
  }
  // EXITED is a terminal state — there's no "activation" to gate.
  // We still return blockers: [] so the UI doesn't show a misleading
  // "what's missing" panel for an exited property.
  if (inputs.propertyStatus === "EXITED") {
    return { isActive: false, clientSideDone: true, blockers: [] };
  }

  const blockers: ReadinessBlocker[] = [];
  if (inputs.hasPendingAgreement) {
    blockers.push({
      key: "agreement",
      label: "Accept your management agreement",
      // Caller can override with a more specific /client/agreements/:id
      // link when it has the agreement id; this default is the list.
      href: "/client",
    });
  }
  // If neither client-side blocker is present, Goldstay is what's
  // outstanding. We always surface that explicitly — silence here
  // would let a client think the system was broken.
  if (blockers.length === 0) {
    blockers.push({
      key: "goldstay_review",
      label: "Goldstay verification in progress",
      href: null,
    });
  }

  const clientSideDone = blockers.every((b) => b.key === "goldstay_review");
  return { isActive: false, clientSideDone, blockers };
}
