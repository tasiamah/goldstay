// GET /api/cron/sync-ical — Vercel cron entry point. Configured in
// vercel.json to run every 15 minutes. Vercel's cron uses GET and
// signs the request with a Bearer token from the project's
// CRON_SECRET environment variable, which we verify before doing
// any work to keep this endpoint safe to leave public.
//
// Manual run: hitting this URL with the right Authorization header
// also works for ad-hoc syncs from your terminal.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { runAllFeedsSync } from "@/lib/ical/run";
import { runPendingHostawayBackfills } from "@/lib/hostaway/backfill";
import { wrapJob } from "@/lib/admin/job-run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Vercel cron tasks run inside the standard 60s function timeout on
// Hobby and 300s on Pro. We bump the cap to the Pro ceiling so a
// portfolio of 50+ feeds doesn't cut off mid-loop later.
export const maxDuration = 300;

function isAuthorized(request: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    // No secret configured = refuse all calls. Safer than allowing
    // anyone to trigger syncs while the project is being set up.
    return false;
  }
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

  const startedAt = Date.now();
  const result = await wrapJob("sync-ical", async () => {
    const summary = await runAllFeedsSync();
    // Feeds first. They are the every-15-minutes job and must not be
    // delayed by a backfill, which on nearly every run finds nothing
    // to do and on the run after a listing is linked is the only
    // thing that can supply that unit's history.
    const backfill = await runPendingHostawayBackfills({ prisma });
    return {
      summary:
        `feeds=${summary.total} ok=${summary.succeeded} fail=${summary.failed}` +
        (backfill.attempted > 0
          ? ` backfilled=${backfill.succeeded}/${backfill.attempted} bookings=${backfill.bookingsCreated}`
          : ""),
      _extras: { ...summary, backfill },
    } as const;
  });
  return NextResponse.json({
    ok: true,
    jobRunId: result.id,
    durationMs: Date.now() - startedAt,
    summary: result.summary,
  });
}
