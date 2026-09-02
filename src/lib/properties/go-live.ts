// What has to be true before a property can go live.
//
// The rule: a property does not become ACTIVE until the client has
// accepted its management agreement. Nothing else establishes that we
// are allowed to let the property on their behalf — and since we
// stopped asking clients to prove ownership (many of them lease and
// sub-let with the owner's written permission, so a title deed is a
// document they cannot produce), the accepted agreement is now the
// only place that authority is recorded.
//
// This inverts the previous order. Marking a property verified used
// to flip it to ACTIVE and issue the agreement in the same
// transaction, so every property went live before anyone had agreed
// to anything, and a client who never accepted still had a live
// listing. Now the same button walks two steps instead:
//
//   1. no agreement yet  -> issue one, property stays ONBOARDING
//   2. agreement accepted -> property goes ACTIVE
//
// and refuses in between.
//
// Pure so the rule can be tested without a database.

import type { AgreementStatus } from "@prisma/client";

export type GoLiveDecision =
  | { kind: "issue_agreement" }
  | { kind: "go_live" }
  | { kind: "blocked"; reason: string };

export const AWAITING_ACCEPTANCE_REASON =
  "This property cannot go live until the client accepts its management agreement. They have it in their portal; use “Resend welcome email” or nudge them directly if it has been a while.";

export function decidePropertyGoLive(input: {
  // Statuses of this property's agreements, excluding CANCELLED ones.
  // A cancelled agreement is a withdrawn offer, not a pending one, so
  // it must not keep a property hostage.
  agreementStatuses: ReadonlyArray<AgreementStatus>;
}): GoLiveDecision {
  if (input.agreementStatuses.length === 0) {
    return { kind: "issue_agreement" };
  }
  // Any signed agreement is enough. Re-issuing terms leaves the old
  // signed row in place alongside a new SENT one, and a property that
  // was legitimately live should not be dragged back to ONBOARDING by
  // an admin regenerating paperwork.
  if (input.agreementStatuses.includes("SIGNED")) {
    return { kind: "go_live" };
  }
  return { kind: "blocked", reason: AWAITING_ACCEPTANCE_REASON };
}
