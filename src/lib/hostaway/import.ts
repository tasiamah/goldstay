// Pull a window of reservations for one property and ingest them.
//
// This is the backfill path. The webhook only knows about bookings
// made after it was registered, so a property that was running on an
// iCal feed has months of stays recorded as zero-gross placeholders.
// Importing replaces them with the real figures and, because ingest
// writes the commission and cleaning rows, produces a statement that
// reconciles rather than one that reports a busy month as earning
// nothing.
//
// Never notifies. These are stays that already happened; emailing
// the owner about each one would be a dozen "new booking received"
// messages for guests who have long since checked out.

import type { PrismaClient } from "@prisma/client";

import {
  acquireToken,
  listReservations,
  type Fetch,
} from "./client";
import { ingestHostawayReservation } from "./ingest";

export type ImportSummary = {
  fetched: number;
  created: number;
  updated: number;
  transactionsCreated: number;
  placeholdersRemoved: number;
  skipped: number;
};

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export async function importPropertyReservations({
  prisma,
  accountId,
  apiKey,
  listingId,
  from,
  to,
  fetchImpl,
  warmupMs,
}: {
  prisma: PrismaClient;
  accountId: string;
  apiKey: string;
  listingId: string;
  from: Date;
  to: Date;
  fetchImpl?: Fetch;
  warmupMs?: number;
}): Promise<ImportSummary> {
  const token = await acquireToken({
    accountId,
    apiKey,
    fetchImpl,
    warmupMs,
  });

  // Reach back a month before the window. Hostaway can only filter on
  // arrival date, and a stay that arrived on 28 August belongs to
  // September's statement too — asking only for September arrivals
  // would drop it.
  const arrivalFrom = new Date(from);
  arrivalFrom.setUTCMonth(arrivalFrom.getUTCMonth() - 1);

  const reservations = await listReservations({
    token,
    listingId,
    arrivalStartDate: isoDate(arrivalFrom),
    arrivalEndDate: isoDate(to),
    fetchImpl,
  });

  const summary: ImportSummary = {
    fetched: reservations.length,
    created: 0,
    updated: 0,
    transactionsCreated: 0,
    placeholdersRemoved: 0,
    skipped: 0,
  };

  for (const reservation of reservations) {
    const result = await ingestHostawayReservation({
      prisma,
      reservation,
      notify: false,
    });

    if (result.status !== "ingested") {
      summary.skipped += 1;
      continue;
    }
    if (result.created) summary.created += 1;
    else summary.updated += 1;
    summary.transactionsCreated += result.transactionsCreated;
    summary.placeholdersRemoved += result.placeholdersRemoved;
  }

  return summary;
}
