// Flips a property live the moment its management agreement is
// accepted, instead of waiting for someone to notice and click.
//
// decidePropertyGoLive has always said a signed agreement is the only
// requirement. The admin action that applies it was manual, so the
// gap between "the client accepted at 9pm" and "the listing is live"
// was however long it took an operator to open the property. On 10 Sep
// 2026 three properties were sitting in ONBOARDING with signed
// agreements, one of them already taking bookings on Airbnb, because
// nothing had ever pushed that transition.
//
// Deliberately does not touch launchedAt. That field is the Launch
// Date the executed agreement refers to, defined in clause 1.4 as the
// date the property is "first published and made available for booking
// through an approved Booking Channel". Acceptance is not publication;
// it is permission to publish. Writing today's date here on acceptance
// would put a wrong date inside a contract.
//
// Never throws. It is called from the acceptance action, and a client
// who has just accepted a contract must not see an error because a
// status update failed. The agreement is the legally significant part
// and it is already committed by this point.

import { prisma } from "@/lib/db";
import { recordAudit } from "@/lib/audit";

export type ActivationOutcome =
  | { kind: "activated" }
  | { kind: "unchanged"; reason: string };

export async function activatePropertyOnAcceptance(input: {
  propertyId: string;
  clientId: string;
  // Attributed to the client, matching the agreement.signed audit row,
  // so the timeline reads as one action by one person rather than the
  // client accepting and a phantom admin flipping a switch.
  actorEmail: string;
}): Promise<ActivationOutcome> {
  try {
    // Guarded update rather than read-then-write. Two agreements can
    // be accepted for one property in quick succession (a reissued
    // set of terms leaves the old signed row in place), and an EXITED
    // property must never be resurrected by someone signing something.
    const { count } = await prisma.property.updateMany({
      where: { id: input.propertyId, status: "ONBOARDING" },
      data: { status: "ACTIVE" },
    });

    if (count === 0) return { kind: "unchanged", reason: "not_onboarding" };

    await recordAudit({
      actor: { adminId: null, email: input.actorEmail },
      entity: "PROPERTY",
      entityId: input.propertyId,
      action: "property.activated",
      summary:
        "Property went live automatically when the management agreement was accepted",
      metadata: { clientId: input.clientId, trigger: "agreement_accepted" },
    });

    return { kind: "activated" };
  } catch (err) {
    console.error(
      `[property-activate] ${input.propertyId}:`,
      err instanceof Error ? err.message : err,
    );
    return { kind: "unchanged", reason: "error" };
  }
}
