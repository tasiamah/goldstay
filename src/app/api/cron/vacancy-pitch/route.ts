// GET /api/cron/vacancy-pitch — daily auto-pitch to landlords whose
// outgoing tenants told us they were leaving. Same Bearer-token
// convention as the other crons (CRON_SECRET).
//
// Always idempotent: each row is patched to Status "Contacted" the
// moment it's pitched, so re-running the route never double-sends.

import { NextResponse } from "next/server";
import { runVacancyPitchOnce } from "@/lib/vacancy/pitch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
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
  const startedAt = Date.now();
  const summary = await runVacancyPitchOnce();
  return NextResponse.json({
    ok: true,
    durationMs: Date.now() - startedAt,
    ...summary,
  });
}
