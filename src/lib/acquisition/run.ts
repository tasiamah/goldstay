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
import { scrapeAirbnb } from "./sources/airbnb";
import { scrapeBuyRentKenya } from "./sources/buyrentkenya";
import type { ClassifiedListing, RawListing } from "./types";

export type SourceRunSummary = {
  source: string;
  pagesFetched: number;
  rawCount: number;
  surfacedCount: number;
  inserted: number;
  updated: number;
  skipped: number;
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
  for (const c of surfaced) {
    const r = await upsertAcquisitionTarget(c);
    if (r === "inserted") inserted++;
    else if (r === "updated") updated++;
    else skipped++;
  }

  return {
    source: job.name,
    pagesFetched: result.pagesFetched,
    rawCount: result.listings.length,
    surfacedCount: surfaced.length,
    inserted,
    updated,
    skipped,
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
    }),
    { rawCount: 0, surfacedCount: 0, inserted: 0, updated: 0 },
  );

  return {
    startedAt: startedAt.toISOString(),
    finishedAt: finishedAt.toISOString(),
    durationMs: finishedAt.getTime() - startedAt.getTime(),
    sources,
    totals,
  };
}
