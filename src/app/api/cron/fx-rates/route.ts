// GET /api/cron/fx-rates — captures today's exchange rates.
//
// Runs daily because the provider publishes today's rates only. A day
// not captured is gone: there is no history to backfill from, and a
// statement for a month we hold no rates for cannot show a converted
// payout at all.
//
// Auth: Bearer token via CRON_SECRET, same as every other job here.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchRates } from "@/lib/fx/provider";
import { wrapJob } from "@/lib/admin/job-run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(request: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;
  return request.headers.get("authorization") === `Bearer ${expected}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const summary = await wrapJob("fx-rates", async () => {
    const { base, asOf, rates } = await fetchRates();

    let written = 0;
    for (const [quote, rate] of Object.entries(rates)) {
      // Upsert rather than create: a replay on the same day must not
      // leave two different rates for one date, because then which
      // one a statement used would depend on row order.
      await prisma.fxRate.upsert({
        where: { base_quote_asOf: { base, quote, asOf } },
        create: { base, quote, asOf, rate, source: "open.er-api.com" },
        update: { rate, source: "open.er-api.com" },
      });
      written += 1;
    }

    return {
      summary: `${written} ${base} rates for ${asOf
        .toISOString()
        .slice(0, 10)}`,
    };
  });

  return NextResponse.json(summary);
}
