// Which properties a signed-in landlord is allowed to see.
//
// Until co-ownership existed this was simply `clientId: client.id`,
// repeated inline in every client-facing query. That was fine while
// the answer was one column. It stopped being fine the moment a
// second client could legitimately see a unit, because then the
// answer lives in two places and every query has to remember both.
//
// We have already been bitten by exactly that shape of bug: four
// independent queries each had to remember to exclude payouts, three
// were written before payouts existed, and the omission could not be
// noticed until the first one was recorded. See
// lib/transactions/settlement. So the rule lives here once, as a
// Prisma fragment rather than a list of ids, which keeps it to a
// single query no matter how many properties are involved.
//
// The deliberate asymmetry: this governs *sight* only. Statements,
// payout methods and account settings stay keyed to the client's own
// id, because they describe money moving to the owner of record and a
// co-owner is not party to that payment. A co-owner who could see a
// payout method would be reading someone else's bank details.

import type { Prisma } from "@prisma/client";

// Properties this client owns outright, plus those they co-own, and
// not the ones we have archived.
//
// Archiving is how an operator says a property is not this client's
// any more, and the admin UI tells them it hides it "from the
// client's own portal". That was not true: no client-facing query
// filtered it, so an archived flat kept its card. Wesley was shown
// two stale copies of a flat that had been moved to his mother for
// five weeks. The filter belongs here rather than in each caller,
// because "visible to" is exactly the question this answers, and a
// caller that forgot it looked identical to one that did not.
//
// Only the client-facing pages use this. The admin property page
// deliberately renders archived rows, and reaches them by id.
export function propertiesVisibleTo(
  clientId: string,
): Prisma.PropertyWhereInput {
  return {
    archivedAt: null,
    OR: [
      { clientId },
      { coOwners: { some: { clientId, removedAt: null } } },
    ],
  };
}

// The same rule one level down, for the tables that hang off a
// property. Written as a helper rather than left to each caller so
// nobody has to remember that `property:` is the hop.
export function propertyOwnedOrCoOwnedBy(
  clientId: string,
): Prisma.TransactionWhereInput {
  return { property: propertiesVisibleTo(clientId) };
}

// True when the client may see this property at all. For the detail
// pages, which look a property up by id and then have to decide
// whether this visitor is entitled to it.
export function canSeeProperty(
  property: { clientId: string; coOwners?: { clientId: string; removedAt: Date | null }[] },
  clientId: string,
): boolean {
  if (property.clientId === clientId) return true;
  return Boolean(
    property.coOwners?.some(
      (c) => c.clientId === clientId && c.removedAt === null,
    ),
  );
}
