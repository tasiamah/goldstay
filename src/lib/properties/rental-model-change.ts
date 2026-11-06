// Whether a property's rental model can be switched, and what the
// operator is agreeing to by switching it.
//
// The model used to be fixed at creation. The form rendered it
// read-only on edit and told the admin to email support, which in an
// internal tool means "nobody can change this" — so when somebody
// picked the wrong one during onboarding, the way out was to create
// the property again. Denis Gardens D601 exists twice for exactly
// that reason, once as a short-let and once as a long-let.
//
// It was locked for a real reason though. The model decides which
// clause set the management agreement is issued under and what
// commission it quotes, so a silent switch would leave a landlord
// holding a signed contract for 20% of revenue on a property we had
// started treating as a 10%-of-rent long-let. The answer is not to
// keep it locked but to make the switch reissue the agreement, and
// to say plainly what else moves.
//
// Pure, so the consequences an operator is shown are the consequences
// the action enforces, and both can be asserted on without a database.

import type { PropertyType } from "@prisma/client";

import {
  PROPERTY_TYPE_LABEL,
  isPropertyTypeAvailableIn,
} from "@/lib/property-type";

export type RentalModelChangeInput = {
  from: PropertyType;
  to: PropertyType;
  country: "KE" | "GH";
  /** Stays already recorded against the property. */
  bookingCount: number;
  /** Leases across all of the property's units, any status. */
  leaseCount: number;
  /** Where the property sits in the go-live sequence. */
  agreementStage: "none" | "awaiting_acceptance" | "accepted";
  status: "ONBOARDING" | "ACTIVE" | "EXITED";
};

export type RentalModelChangeCheck =
  | { allowed: false; reason: string }
  | { allowed: true; consequences: string[] };

export function checkRentalModelChange(
  input: RentalModelChangeInput,
): RentalModelChangeCheck {
  const { from, to, country } = input;

  if (from === to) {
    return {
      allowed: false,
      reason: `This property is already on ${PROPERTY_TYPE_LABEL[to].toLowerCase()}.`,
    };
  }

  // Same rule the create form applies. Tenant finding is drafted
  // against Kenyan law, and Ghana's fallback is a management contract
  // that never mentions a placement-only scope.
  if (!isPropertyTypeAvailableIn(to, country)) {
    return {
      allowed: false,
      reason: `${PROPERTY_TYPE_LABEL[to]} is not available in ${country === "KE" ? "Kenya" : "Ghana"}.`,
    };
  }

  return { allowed: true, consequences: consequencesOf(input) };
}

// Ordered most-consequential first, because this is read in a confirm
// dialog and the last line is the one people skip.
function consequencesOf(input: RentalModelChangeInput): string[] {
  const { from, to, bookingCount, leaseCount, agreementStage, status } = input;
  const out: string[] = [];

  if (agreementStage === "accepted") {
    out.push(
      "The signed management agreement will be superseded. A new one is issued on the new terms and the client has to accept it again.",
    );
  } else if (agreementStage === "awaiting_acceptance") {
    out.push(
      "The agreement the client is currently looking at will be cancelled and replaced with one on the new terms.",
    );
  }

  // Worth saying out loud rather than leaving them to discover it on
  // the 5th. Statements read short-stay figures off bookings and rent
  // off leases, so a model change moves which of the two the owner
  // sees without touching either set of rows.
  if (from === "SHORT_TERM" && bookingCount > 0) {
    out.push(
      `${bookingCount} ${bookingCount === 1 ? "booking stays" : "bookings stay"} on the property, but short-stay nights and revenue drop off future statements.`,
    );
  }
  if (from === "LONG_TERM" && leaseCount > 0) {
    out.push(
      `${leaseCount} ${leaseCount === 1 ? "lease stays" : "leases stay"} on the property, but rent stops being reported as long-let income.`,
    );
  }

  if (to === "TENANT_FINDING") {
    out.push(
      "No recurring commission applies from now on. The fee is one month's rent, booked once when a tenant is placed, and statements stop after it.",
    );
  }
  if (from === "TENANT_FINDING") {
    out.push(
      `This becomes a managed property, so ${to === "SHORT_TERM" ? "20% of revenue" : "10% of collected rent"} applies from now on.`,
    );
  }

  if (to === "SHORT_TERM") {
    out.push(
      "Add a Hostaway listing ID in Details, or no stays will ever reach the platform for it.",
    );
  }

  if (status === "ACTIVE") {
    out.push(
      "The property stays live and keeps earning. It will show an agreement the client has not accepted yet until they do.",
    );
  }

  return out;
}
