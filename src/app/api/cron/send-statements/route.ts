// GET /api/cron/send-statements — monthly statement push.
//
// Configured in vercel.json to run on the 5th of every month at
// 07:00 UTC (≈ 10:00 EAT, 10:00 GMT/WAT). For each non-archived
// owner with at least one ACTIVE property:
//   • compute the previous calendar month
//   • skip if a StatementSend row already exists for that period
//   • render the statement PDF + email it through Resend
//   • record StatementSend + CommunicationLog rows
//
// Idempotent: any subsequent invocation (Vercel retry, manual hit
// from a terminal with the right Bearer token) skips already-sent
// owners. Failures per owner are recorded but never abort the run.
//
// Auth: identical to the iCal cron — Bearer token via CRON_SECRET.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { wrapJob } from "@/lib/admin/job-run";
import { sendStatementForOwner } from "@/lib/statements/send";
import { previousPeriod } from "@/lib/statements/period";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Pro-tier ceiling. The render+send loop is sequential, so a
// portfolio of 100 owners * ~2s/owner = 200s, comfortably inside.
export const maxDuration = 300;

function isAuthorized(request: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${expected}`;
}

export async function GET(request: Request) {
  // Allow override for ad-hoc replays: ?period=YYYY-MM picks an
  // older month. Defaults to the calendar month we just left.
  const url = new URL(request.url);
  const periodParam = url.searchParams.get("period");
  const period = parsePeriodParam(periodParam) ?? previousPeriod(new Date());

  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const summary = await wrapJob("send-monthly-statements", async () => {
    const owners = await prisma.owner.findMany({
      where: {
        archivedAt: null,
        // Restrict to owners with at least one non-archived
        // property: empty owners (just-converted leads, paused
        // accounts) get no statement.
        properties: { some: { archivedAt: null } },
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        companyName: true,
        preferredCurrency: true,
      },
    });

    let sent = 0;
    let skipped = 0;
    let failed = 0;
    const failures: Array<{ ownerId: string; error: string }> = [];

    for (const owner of owners) {
      const result = await sendStatementForOwner(owner, period);
      if (!result.ok) {
        failed++;
        failures.push({ ownerId: owner.id, error: result.error });
      } else if (result.status === "skipped") {
        skipped++;
      } else {
        sent++;
      }
    }

    return {
      summary: `period=${period.year}-${String(period.month).padStart(2, "0")} owners=${owners.length} sent=${sent} skipped=${skipped} failed=${failed}`,
      // Returning extras through the wrap layer (currently unused
      // by JobRun.summary, but the route returns them in the JSON).
      _extras: {
        period,
        ownersConsidered: owners.length,
        sent,
        skipped,
        failed,
        failures: failures.slice(0, 10),
      },
    } as const;
  });

  return NextResponse.json({
    ok: true,
    jobRunId: summary.id,
    summary: summary.summary,
  });
}

function parsePeriodParam(
  v: string | null,
): { year: number; month: number } | null {
  if (!v) return null;
  const m = v.match(/^(\d{4})-(\d{1,2})$/);
  if (!m) return null;
  const year = Number(m[1]);
  const month = Number(m[2]);
  if (year < 2000 || year > 2100) return null;
  if (month < 1 || month > 12) return null;
  return { year, month };
}
