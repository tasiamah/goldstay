// Labels for Property.signingCapacity / ManagementAgreement.signingCapacity.
//
// Three audiences need different words for the same enum, so they all
// live here rather than being retyped per call site:
//
//   *_LABEL       — short, for admin dropdowns, tables and badges.
//   *_HINT        — the operator-facing "pick this when…" explanation
//                   on the property form.
//   *_ATTESTATION — first-person, shown to the client above the
//                   signature box and printed on the signed PDF, so
//                   what they tick matches what the contract says.
//
// The contract clauses themselves are not here; they're in
// src/lib/agreements/text.ts, keyed off the same enum.

import type { SigningCapacity } from "@prisma/client";

// Order used by every selector: commonest case first, and it doubles
// as the canonical order for the admin form's radio group.
export const SIGNING_CAPACITIES: ReadonlyArray<SigningCapacity> = [
  "REGISTERED_OWNER",
  "AUTHORISED_LEASEHOLDER",
  "AUTHORISED_REPRESENTATIVE",
];

export const SIGNING_CAPACITY_LABEL: Record<SigningCapacity, string> = {
  REGISTERED_OWNER: "Registered owner",
  AUTHORISED_LEASEHOLDER: "Tenant letting on (rent-to-rent)",
  AUTHORISED_REPRESENTATIVE: "Signing for the owner",
};

export const SIGNING_CAPACITY_HINT: Record<SigningCapacity, string> = {
  REGISTERED_OWNER:
    "The client's name is on the title, or they are a co-owner signing for the others.",
  AUTHORISED_LEASEHOLDER:
    "The client rents the property and has the owner's written permission to let it on and to appoint a managing agent.",
  AUTHORISED_REPRESENTATIVE:
    "The client signs for the registered owner under a power of attorney, board resolution, or executor or trustee appointment.",
};

export const SIGNING_CAPACITY_ATTESTATION: Record<SigningCapacity, string> = {
  REGISTERED_OWNER:
    "I am the registered owner of this property, or a co-owner signing with the authority of the others.",
  AUTHORISED_LEASEHOLDER:
    "I am not the owner of this property. I rent it, and the owner has given me written permission to let it out and to appoint a managing agent.",
  AUTHORISED_REPRESENTATIVE:
    "I am not the owner of this property. I hold written authority from the owner to let it out, appoint a managing agent, and sign this agreement on their behalf.",
};

// True where the signatory is someone other than the registered owner,
// and the agreement therefore leans on a granted authority rather than
// on title. Callers use it to decide whether to ask for evidence of
// that authority or to flag the property in admin.
export function isDelegatedCapacity(capacity: SigningCapacity): boolean {
  return capacity !== "REGISTERED_OWNER";
}
