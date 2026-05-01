// GET /api/cron/sync-ical — Vercel cron entry point. Configured in
// vercel.json to run every 15 minutes. Vercel's cron uses GET and
// signs the request with a Bearer token from the project's
// CRON_SECRET environment variable, which we verify before doing
// any work to keep this endpoint safe to leave public.
//
// Manual run: hitting this URL with the right Authorization header
// also works for ad-hoc syncs from your terminal.

import { NextResponse } from "next/server";
import { runAllFeedsSync } from "@/lib/ical/run";
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
    return {
      summary: `feeds=${summary.total} ok=${summary.succeeded} fail=${summary.failed}`,
      _extras: summary,
    } as const;
  });
  return NextResponse.json({
    ok: true,
    jobRunId: result.id,
    durationMs: Date.now() - startedAt,
    summary: result.summary,
  });
}
