// Client-level rollup of management agreement state, for the admin
// clients list.
//
// Agreements hang off properties, not clients: a ManagementAgreement
// has a propertyId and reaches the client only through
// Property.clientId. So "has this client signed?" has no single row to
// read, and a client with three properties can legitimately be two
// signed and one outstanding at the same time. This module answers the
// question an operator actually has, which is "who do I need to chase",
// and it keeps the answer in one place so the list page and the CSV
// export cannot drift apart.

import type { AgreementStatus, Prisma, PropertyStatus } from "@prisma/client";
import { AGREEMENT_STATUS_CLASSES } from "@/lib/agreements/format";

// DRAFT and SENT are both "not signed yet" for chasing purposes, which
// matches the admin attention queue in lib/admin/queue.ts. In practice
// issuance goes straight to SENT and DRAFT is a legacy/review state,
// but an operator still needs to see it as outstanding rather than as
// nothing at all.
export const AWAITING_SIGNATURE_STATUSES = ["DRAFT", "SENT"] as const;

// CANCELLED rows are kept for audit and superseded by a new agreement,
// so they must never count towards either side of the rollup.
const LIVE_STATUSES = ["DRAFT", "SENT", "SIGNED"] as const;

// An EXITED property is off the books. Its unsigned agreement is not
// something anyone is going to chase, and counting it would leave
// permanent amber on clients we have finished with.
const COUNTED_PROPERTY_STATUSES = ["ONBOARDING", "ACTIVE"] as const;

export type ClientAgreementState =
  // No properties at all, so there is nothing to sign yet.
  | "no-properties"
  // Has properties, but no agreement has been issued on any of them.
  // Actionable, and distinct from "sent and ignored".
  | "not-issued"
  // At least one property is waiting on the client's signature.
  | "awaiting"
  // Every counted property with an agreement has signed it.
  | "signed";

export type ClientAgreementRollup = {
  state: ClientAgreementState;
  /** Properties waiting on a signature. */
  awaiting: number;
  /** Properties with a signed agreement. */
  signed: number;
  /** Counted properties with no agreement issued at all. */
  notIssued: number;
  label: string;
  /** Reuses the agreement pill palette so admin surfaces stay consistent. */
  className: string;
};

type PropertySnapshot = {
  status: PropertyStatus;
  agreements: { status: AgreementStatus }[];
};

export function rollupClientAgreements(
  properties: readonly PropertySnapshot[],
): ClientAgreementRollup {
  const counted = properties.filter((p) =>
    (COUNTED_PROPERTY_STATUSES as readonly string[]).includes(p.status),
  );

  let awaiting = 0;
  let signed = 0;
  let notIssued = 0;

  for (const property of counted) {
    const live = property.agreements.filter((a) =>
      (LIVE_STATUSES as readonly string[]).includes(a.status),
    );
    if (live.length === 0) {
      notIssued += 1;
      continue;
    }
    // Awaiting wins over signed on the same property. A property can
    // hold a signed agreement and a freshly reissued one at once, when
    // terms changed after signature, and in that case the client does
    // still owe us a signature.
    const isAwaiting = live.some((a) =>
      (AWAITING_SIGNATURE_STATUSES as readonly string[]).includes(a.status),
    );
    if (isAwaiting) awaiting += 1;
    else signed += 1;
  }

  const state: ClientAgreementState =
    counted.length === 0
      ? "no-properties"
      : awaiting > 0
        ? "awaiting"
        : signed > 0
          ? "signed"
          : "not-issued";

  return {
    state,
    awaiting,
    signed,
    notIssued,
    label: labelFor(state, awaiting, signed),
    className: CLASSES[state],
  };
}

function labelFor(
  state: ClientAgreementState,
  awaiting: number,
  signed: number,
): string {
  switch (state) {
    case "no-properties":
      return "No properties";
    case "not-issued":
      return "Not issued";
    case "signed":
      // The count matters once there is more than one, because "Signed"
      // against a four-property client reads as though one document
      // covers all four.
      return signed === 1 ? "Signed" : `${signed} signed`;
    case "awaiting":
      // Partially signed is the case worth spelling out: it tells the
      // operator both that there is something to chase and how much of
      // the client is already done.
      if (signed > 0) return `${awaiting} of ${awaiting + signed} awaiting`;
      return awaiting === 1
        ? "Awaiting signature"
        : `${awaiting} awaiting signature`;
  }
}

// Borrowed from the agreement status palette rather than redefined, so
// amber still means action-required and emerald still means done
// wherever an operator sees it.
const CLASSES: Record<ClientAgreementState, string> = {
  "no-properties": "border-stone-200 bg-white text-stone-500",
  "not-issued": AGREEMENT_STATUS_CLASSES.DRAFT,
  awaiting: AGREEMENT_STATUS_CLASSES.SENT,
  signed: AGREEMENT_STATUS_CLASSES.SIGNED,
};

// The include the rollup needs. Exported so the list page and the CSV
// export request exactly the same shape.
export const CLIENT_AGREEMENT_INCLUDE = {
  select: {
    status: true,
    agreements: { select: { status: true } },
  },
} satisfies Prisma.Client$propertiesArgs;

export const CLIENT_AGREEMENT_FILTERS = [
  "awaiting",
  "signed",
  "not-issued",
] as const;

export type ClientAgreementFilter =
  | (typeof CLIENT_AGREEMENT_FILTERS)[number]
  | null;

export function parseClientAgreementFilter(
  value: string,
): ClientAgreementFilter {
  return (CLIENT_AGREEMENT_FILTERS as readonly string[]).includes(value)
    ? (value as Exclude<ClientAgreementFilter, null>)
    : null;
}

export const CLIENT_AGREEMENT_FILTER_LABEL: Record<
  Exclude<ClientAgreementFilter, null>,
  string
> = {
  awaiting: "Awaiting signature",
  signed: "All signed",
  "not-issued": "No agreement issued",
};

// Prisma predicate matching the rollup above.
//
// Filtering has to happen in the database rather than over the fetched
// page, or the row count and the pagination would describe a different
// set from the one on screen.
export function clientAgreementWhere(
  filter: ClientAgreementFilter,
): Prisma.ClientWhereInput | null {
  if (filter === null) return null;

  const countedProperty = {
    status: { in: [...COUNTED_PROPERTY_STATUSES] },
  } satisfies Prisma.PropertyWhereInput;

  const hasAwaiting: Prisma.ClientWhereInput = {
    properties: {
      some: {
        ...countedProperty,
        agreements: {
          some: { status: { in: [...AWAITING_SIGNATURE_STATUSES] } },
        },
      },
    },
  };

  if (filter === "awaiting") return hasAwaiting;

  if (filter === "signed") {
    return {
      AND: [
        {
          properties: {
            some: {
              ...countedProperty,
              agreements: { some: { status: "SIGNED" } },
            },
          },
        },
        // "All signed" has to exclude the partially signed client, or
        // the two filters overlap and a client needing a chase hides
        // inside the reassuring one.
        { NOT: hasAwaiting },
      ],
    };
  }

  return {
    AND: [
      // Has at least one counted property...
      { properties: { some: countedProperty } },
      // ...and not one of them carries a live agreement.
      {
        NOT: {
          properties: {
            some: {
              ...countedProperty,
              agreements: { some: { status: { in: [...LIVE_STATUSES] } } },
            },
          },
        },
      },
    ],
  };
}
