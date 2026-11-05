// Pulling a newly linked listing's history without anyone asking.
//
// An iCal feed only publishes the stays that have not happened yet.
// Airbnb drops a reservation out of the calendar once the guest has
// checked out, so a feed added to a unit that has been letting for
// months carries none of those months. The occupancy calendar and
// the owner's statements then begin on the day the feed was added,
// and the owner sees a property that appears to have earned nothing
// before that date.
//
// Hostaway does hold the history, with the money attached, which is
// what importPropertyReservations exists to pull. The gap was that
// pulling it was a button on each property page, so it only happened
// where somebody remembered. Five units went live with a feed and
// were never imported, which is how Misty Springs came to show one
// booking against the nine Hostaway had.
//
// So the trigger moves off the operator. Any property carrying a
// Hostaway listing id that has never been reached gets imported on
// the next sync run. hostawaySyncedAt is stamped by the importer on
// a successful fetch, so this naturally runs once per property and
// then stops: the set it selects is empty on almost every run.
//
// Deliberately only the never-synced. Re-importing a property that
// has already been reached is the operator's call, because it reaches
// back twelve months and those months may hold statements that have
// been sent.

import type { PrismaClient } from "@prisma/client";

import { hostawayCredentials } from "./client";
import { importPropertyReservations, type ImportSummary } from "./import";

// How far back a backfill reaches. Long enough to cover a property
// that has been running on a feed for a while, short enough that it
// cannot quietly rewrite years of settled statements.
export const HOSTAWAY_BACKFILL_MONTHS = 12;

// A cap per run, because each import is a token handshake plus a
// paged fetch and the cron shares a 300s budget with the feeds. The
// remainder is picked up on the next pass; there is no deadline on
// history that has already happened.
const MAX_PER_RUN = 10;

export type BackfillOutcome = {
  propertyId: string;
  propertyName: string;
  listingId: string;
} & ({ ok: true; summary: ImportSummary } | { ok: false; error: string });

export type BackfillRunResult = {
  /** Never-synced properties found, before the per-run cap. */
  pending: number;
  attempted: number;
  succeeded: number;
  failed: number;
  bookingsCreated: number;
  outcomes: BackfillOutcome[];
};

const EMPTY: BackfillRunResult = {
  pending: 0,
  attempted: 0,
  succeeded: 0,
  failed: 0,
  bookingsCreated: 0,
  outcomes: [],
};

export async function runPendingHostawayBackfills({
  prisma,
  now = new Date(),
  maxPerRun = MAX_PER_RUN,
}: {
  prisma: PrismaClient;
  now?: Date;
  maxPerRun?: number;
}): Promise<BackfillRunResult> {
  const credentials = hostawayCredentials();
  // Not an error. A deployment without Hostaway configured still runs
  // its calendar feeds, and failing the whole cron over a credential
  // this path happens to want would take those down with it.
  if (!credentials) return EMPTY;

  const pending = await prisma.property.findMany({
    where: {
      hostawayListingId: { not: null },
      hostawaySyncedAt: null,
    },
    select: { id: true, name: true, hostawayListingId: true },
    orderBy: { createdAt: "asc" },
  });

  const result: BackfillRunResult = {
    ...EMPTY,
    pending: pending.length,
    outcomes: [],
  };

  const from = new Date(now);
  from.setUTCMonth(from.getUTCMonth() - HOSTAWAY_BACKFILL_MONTHS);

  for (const property of pending.slice(0, maxPerRun)) {
    // Narrowed by the where clause above, but the column is nullable
    // so the type does not know that.
    const listingId = property.hostawayListingId;
    if (!listingId) continue;

    result.attempted += 1;
    try {
      const summary = await importPropertyReservations({
        prisma,
        accountId: credentials.accountId,
        apiKey: credentials.apiKey,
        listingId,
        from,
        to: now,
      });
      result.succeeded += 1;
      result.bookingsCreated += summary.created;
      result.outcomes.push({
        propertyId: property.id,
        propertyName: property.name,
        listingId,
        ok: true,
        summary,
      });
    } catch (e) {
      // One listing Hostaway refuses must not stop the rest. The
      // property keeps a null hostawaySyncedAt, so the next run
      // retries it on its own.
      result.failed += 1;
      result.outcomes.push({
        propertyId: property.id,
        propertyName: property.name,
        listingId,
        ok: false,
        error: e instanceof Error ? e.message : "Hostaway import failed.",
      });
    }
  }

  return result;
}
