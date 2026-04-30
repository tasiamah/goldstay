// Orchestrator: takes a PropertyIcalFeed row, fetches it, parses it,
// and pipes the events through the sync engine. Persists the
// outcome (lastSyncedAt always; lastSuccessAt on success; lastError
// on failure) so the admin UI can show "last synced 2m ago" and
// "last failure: 504 Gateway Timeout" without needing log access.

import { prisma } from "@/lib/db";
import { fetchIcal, IcalFetchError } from "./fetch";
import { parseIcal } from "./parse";
import { syncIcalEvents, type IcalSyncResult } from "./sync";

export type SyncFeedOutcome =
  | { ok: true; result: IcalSyncResult }
  | { ok: false; error: string };

export async function runFeedSync(feedId: string): Promise<SyncFeedOutcome> {
  const feed = await prisma.propertyIcalFeed.findUnique({
    where: { id: feedId },
    include: {
      property: { select: { id: true, country: true } },
    },
  });
  if (!feed) return { ok: false, error: "Feed not found" };

  // Property currency mirrors what the admin booking form picks for
  // the country, so iCal placeholders use the same default and the
  // operator never has to convert.
  const currency =
    feed.property.country === "KE"
      ? "KES"
      : feed.property.country === "GH"
        ? "GHS"
        : "USD";

  const now = new Date();
  try {
    const raw = await fetchIcal(feed.url);
    const events = parseIcal(raw);
    const result = await syncIcalEvents({
      prisma,
      propertyId: feed.propertyId,
      source: feed.source,
      currency,
      events,
    });
    await prisma.propertyIcalFeed.update({
      where: { id: feed.id },
      data: { lastSyncedAt: now, lastSuccessAt: now, lastError: null },
    });
    return { ok: true, result };
  } catch (err) {
    const message =
      err instanceof IcalFetchError
        ? err.message
        : (err as Error).message || "Unknown sync error";
    await prisma.propertyIcalFeed.update({
      where: { id: feed.id },
      data: { lastSyncedAt: now, lastError: message.slice(0, 500) },
    });
    return { ok: false, error: message };
  }
}

export async function runAllFeedsSync(): Promise<{
  total: number;
  succeeded: number;
  failed: number;
}> {
  const feeds = await prisma.propertyIcalFeed.findMany({
    select: { id: true },
  });
  let succeeded = 0;
  let failed = 0;
  for (const feed of feeds) {
    const outcome = await runFeedSync(feed.id);
    if (outcome.ok) succeeded++;
    else failed++;
  }
  return { total: feeds.length, succeeded, failed };
}
