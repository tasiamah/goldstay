// GET /api/cron/acquisition-scan — outbound acquisition scrape entry
// point. Triggered daily by .github/workflows/acquisition-scan.yml,
// guarded by the same Bearer-token convention as /api/cron/sync-ical.
//
// Runs the public-listing scrapers (Airbnb, BuyRentKenya), classifies
// each result, and upserts surviving rows into the Airtable
// Acquisition Targets table. Returns a JSON summary the workflow
// surfaces in its log.

import { NextResponse } from "next/server";
import { runAcquisitionScan } from "@/lib/acquisition/run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Vercel Pro caps serverless functions at 300s. The scan walks ~3
// sources × 1–2 pages each with a polite delay, so we expect <60s in
// the steady state but leave headroom for slower pages and Airtable
// upsert latency.
export const maxDuration = 300;

function isAuthorized(request: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${expected}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const summary = await runAcquisitionScan();
  return NextResponse.json({ ok: true, ...summary });
}
