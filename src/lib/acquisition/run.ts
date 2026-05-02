// Acquisition scrape orchestrator.
//
// Called from the /api/cron/acquisition-scan route on a daily schedule
// (GitHub Actions, mirroring the iCal pattern). Runs each source in
// sequence so we don't slam any one host with parallel pages, then
// classifies, filters and upserts every result into Airtable.
//
// Returns a summary the cron route serialises to JSON for the
// workflow log. Nothing throws: a failing source is recorded and the
// rest of the run continues.

import { classify, isWorthSurfacing } from "./classify";
import { upsertAcquisitionTarget } from "./airtable";
import { persistScrapedLead } from "./leads";
import { scrapeAirbnb } from "./sources/airbnb";
import { scrapeBuyRentKenya } from "./sources/buyrentkenya";
import type { ClassifiedListing, RawListing } from "./types";

export type SourceRunSummary = {
  source: string;
  pagesFetched: number;
  rawCount: number;
  surfacedCount: number;
  // Airtable mirror — historical fields, ops still uses these to
  // measure how the Acquisition Targets table is filling up.
  inserted: number;
  updated: number;
  skipped: number;
  // Postgres `Lead` mirror — drives /admin/leads. leadsInserted is
  // a brand-new Lead row; leadsDeduped is a re-scrape of a listing
  // we already saw on a previous night; leadsSkipped is a listing
  // with no usable phone/name (we can't action it without a
  // callback channel) or a Likely-agent that slipped through.
  leadsInserted: number;
  leadsDeduped: number;
  leadsSkipped: number;
  blocked: boolean;
  notes: string[];
  errored?: string;
};

export type AcquisitionRunSummary = {
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  sources: SourceRunSummary[];
  totals: {
    rawCount: number;
    surfacedCount: number;
    inserted: number;
    updated: number;
    leadsInserted: number;
    leadsDeduped: number;
  };
};

type SourceJob = {
  name: string;
  run: () => Promise<{
    listings: RawListing[];
    pagesFetched: number;
    blocked: boolean;
    notes: string[];
  }>;
};

function defaultJobs(): SourceJob[] {
  return [
    { name: "Airbnb · Nairobi", run: () => scrapeAirbnb("nairobi") },
    { name: "Airbnb · Accra", run: () => scrapeAirbnb("accra") },
    { name: "BuyRentKenya · Nairobi", run: () => scrapeBuyRentKenya() },
  ];
}

async function runOne(job: SourceJob): Promise<SourceRunSummary> {
  const empty: SourceRunSummary = {
    source: job.name,
    pagesFetched: 0,
    rawCount: 0,
    surfacedCount: 0,
    inserted: 0,
    updated: 0,
    skipped: 0,
    leadsInserted: 0,
    leadsDeduped: 0,
    leadsSkipped: 0,
    blocked: false,
    notes: [],
  };

  let result: Awaited<ReturnType<SourceJob["run"]>>;
  try {
    result = await job.run();
  } catch (e) {
    return { ...empty, errored: (e as Error).message };
  }

  const classified: ClassifiedListing[] = result.listings.map(classify);
  const surfaced = classified.filter(isWorthSurfacing);

  let inserted = 0;
  let updated = 0;
  let skipped = 0;
  let leadsInserted = 0;
  let leadsDeduped = 0;
  let leadsSkipped = 0;
  for (const c of surfaced) {
    const r = await upsertAcquisitionTarget(c);
    if (r === "inserted") inserted++;
    else if (r === "updated") updated++;
    else skipped++;

    // Mirror the surfaced listing into Postgres so /admin/leads
    // shows it. Failures here are isolated per-listing — we don't
    // want one bad row to stop the rest of the night's Lead
    // mirror or the Airtable upsert that already happened.
    try {
      const leadResult = await persistScrapedLead(c);
      if (leadResult === "inserted") leadsInserted++;
      else if (leadResult === "deduped") leadsDeduped++;
      else leadsSkipped++;
    } catch (e) {
      leadsSkipped++;
      // Surfacing in the workflow log is enough; the Airtable row
      // is the safety net, ops will still see the listing there.
      console.error(
        `[acquisition] persistScrapedLead failed for ${c.url}`,
        e,
      );
    }
  }

  return {
    source: job.name,
    pagesFetched: result.pagesFetched,
    rawCount: result.listings.length,
    surfacedCount: surfaced.length,
    inserted,
    updated,
    skipped,
    leadsInserted,
    leadsDeduped,
    leadsSkipped,
    blocked: result.blocked,
    notes: result.notes,
  };
}

export async function runAcquisitionScan(
  jobs: SourceJob[] = defaultJobs(),
): Promise<AcquisitionRunSummary> {
  const startedAt = new Date();
  const sources: SourceRunSummary[] = [];
  for (const job of jobs) sources.push(await runOne(job));
  const finishedAt = new Date();

  const totals = sources.reduce(
    (acc, s) => ({
      rawCount: acc.rawCount + s.rawCount,
      surfacedCount: acc.surfacedCount + s.surfacedCount,
      inserted: acc.inserted + s.inserted,
      updated: acc.updated + s.updated,
      leadsInserted: acc.leadsInserted + s.leadsInserted,
      leadsDeduped: acc.leadsDeduped + s.leadsDeduped,
    }),
    {
      rawCount: 0,
      surfacedCount: 0,
      inserted: 0,
      updated: 0,
      leadsInserted: 0,
      leadsDeduped: 0,
    },
  );

  return {
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    sources,
    totals,
  };
}
