// GET /api/cron/agreement-reminders — chases unsigned management
// agreements.
//
// Driven hourly by .github/workflows/agreement-reminders.yml rather
// than by vercel.json, because Vercel cron on this project's plan only
// accepts daily-or-longer schedules — the same reason sync-ical,
// vacancy-pitch and acquisition-scan are workflows too.
//
// Hourly rather than daily because the cadence is anchored on each
// agreement's own sentAt and gated by the client's local quiet hours: a
// daily job would drift the "24 hour" reminder by up to a day and would
// fire every send at whatever single time the job happened to run.
//
// Idempotent. Each rung of the ladder is claimed through a unique index
// on (agreementId, step) before it is sent, so a Vercel retry, an
// overlapping run and a manual replay cannot double-email a client.
// See lib/agreements/remind.ts.
//
// Auth: Bearer token via CRON_SECRET, identical to the other crons.
//
// Query params:
//   ?dryRun=1  plan and report without sending, claiming or escalating
//   ?limit=n   override the per-run send cap

import { NextResponse } from "next/server";
import { wrapJob } from "@/lib/admin/job-run";
import {
  DEFAULT_SEND_LIMIT,
  formatRunSummary,
  isReminderDeliveryConfigured,
  runAgreementReminders,
} from "@/lib/agreements/remind";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Sends are sequential and each is one Resend call plus a magic-link
// mint, so the per-run cap of 50 is the real bound on duration.
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

  const url = new URL(request.url);
  const dryRun = url.searchParams.get("dryRun") === "1";
  const limit = parseLimit(url.searchParams.get("limit"));

  // Without a Resend key every send is a no-op that still reports
  // success. Claiming ladder steps against that would burn a client's
  // reminders on emails that never left the building, so the job
  // declines to run rather than quietly consuming the schedule.
  if (!isReminderDeliveryConfigured() && !dryRun) {
    return NextResponse.json({
      ok: true,
      skipped: "email-not-configured",
    });
  }

  const run = await wrapJob("agreement-reminders", async () => {
    const summary = await runAgreementReminders({ limit, dryRun });
    return { summary: formatRunSummary(summary), _extras: summary } as const;
  });

  return NextResponse.json({
    ok: true,
    jobRunId: run.id,
    summary: run.summary,
  });
}

function parseLimit(raw: string | null): number {
  if (!raw) return DEFAULT_SEND_LIMIT;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1 || n > 500) return DEFAULT_SEND_LIMIT;
  return n;
}
