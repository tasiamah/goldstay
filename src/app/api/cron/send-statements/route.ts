// GET /api/cron/send-statements — monthly statement review.
//
// Runs on the 5th of every month at 07:00 UTC (≈ 10:00 EAT), as
// configured in vercel.json.
//
// This used to render every statement and email it to the landlord.
// It no longer sends anything to anyone outside Goldstay. A statement
// is only as right as what reached the platform that month, and a
// channel that quietly stops delivering booking revenue does not
// produce an obviously broken statement — it produces a plausible
// quiet month, with real stays and no money against them. Sending
// first and discovering that afterwards is the wrong order.
//
// So the job now assembles every statement, emails the team a digest
// of what it found, and stops. Sending is a person pressing a button
// on /admin/statements once the figures have been checked.
//
// The route keeps its name because vercel.json and the deploy
// history point at it, and because what it governs is still the
// monthly statement run.
//
// Idempotent and side-effect free with respect to clients: it writes
// no StatementSend rows, so running it twice costs two digests and
// nothing else.
//
// Auth: identical to the iCal cron — Bearer token via CRON_SECRET.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { wrapJob } from "@/lib/admin/job-run";
import {
  buildStatementReview,
  sendStatementReviewEmail,
} from "@/lib/statements/review";
import { previousPeriod } from "@/lib/statements/period";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Pro-tier ceiling. Assembling is cheaper than the old render-and-
// send loop, but it is still one pass per client.
export const maxDuration = 300;

function isAuthorized(request: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  const header = request.headers.get("authorization");
  return header === `Bearer ${expected}`;
}

export async function GET(request: Request) {
  // Allow override for ad-hoc replays: ?period=YYYY-MM reviews an
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

  const summary = await wrapJob("review-monthly-statements", async () => {
    const review = await buildStatementReview({ prisma, period });
    const notified = await sendStatementReviewEmail(review);

    return {
      summary:
        `period=${period.year}-${String(period.month).padStart(2, "0")} ` +
        `clients=${review.rows.length} ready=${review.awaitingReview} ` +
        `empty=${review.empty} alreadySent=${review.alreadySent} ` +
        `digest=${notified.delivered ? "sent" : (notified.reason ?? "failed")}`,
      _extras: {
        period,
        clientsConsidered: review.rows.length,
        awaitingReview: review.awaitingReview,
        empty: review.empty,
        alreadySent: review.alreadySent,
        digestDelivered: notified.delivered,
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
