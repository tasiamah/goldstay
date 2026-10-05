// POST /api/webhooks/hostaway — receives reservation.* events from
// Hostaway and upserts a Booking row + emits the matching
// Transaction rows (gross / OTA fee / cleaning / commission).
//
// The actual work lives in lib/hostaway/ingest so the operator-run
// importer performs it identically; this file is auth, payload
// extraction, and choosing the HTTP status.
//
// Auth: HTTP Basic, credentials in HOSTAWAY_WEBHOOK_USER and
// HOSTAWAY_WEBHOOK_PASSWORD, matching the login and password set on
// the webhook in Hostaway. Hostaway does not sign webhook bodies, so
// Basic is the only protection on offer; see lib/hostaway/auth.ts.
//
// On bad credentials we return 401 so Hostaway retries. On a payload
// we cannot map or a listing we do not manage we return 200, because
// Hostaway posts every reservation on the account and emails the
// owner after three failures, so refusing them would generate alerts
// for listings that are deliberately not in the portal.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { extractReservation } from "@/lib/hostaway/mapper";
import { ingestHostawayReservation } from "@/lib/hostaway/ingest";
import { verifyHostawayBasicAuth } from "@/lib/hostaway/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = process.env.HOSTAWAY_WEBHOOK_USER;
  const password = process.env.HOSTAWAY_WEBHOOK_PASSWORD;
  if (!user || !password) {
    return NextResponse.json(
      { ok: false, error: "Webhook credentials not configured" },
      { status: 500 },
    );
  }

  if (
    !verifyHostawayBasicAuth(
      request.headers.get("authorization"),
      user,
      password,
    )
  ) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: { "WWW-Authenticate": "Basic" } },
    );
  }

  const rawBody = await request.text();

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      { ok: false, error: "Malformed JSON" },
      { status: 200 },
    );
  }

  const reservation = extractReservation(payload);
  if (!reservation) {
    logIgnored(payload);
    return NextResponse.json(
      { ok: true, ignored: "unmappable_payload" },
      { status: 200 },
    );
  }

  const result = await ingestHostawayReservation({
    prisma,
    reservation,
    notify: true,
  });

  if (result.status === "unmappable") {
    logIgnored(payload);
    return NextResponse.json(
      { ok: true, ignored: "unmappable_payload" },
      { status: 200 },
    );
  }

  if (result.status === "unknown_listing") {
    // A listing we don't manage in the portal, or one whose
    // hostawayListingId has not been filled in yet. 200 rather than
    // an error: see the retry note at the top of the file.
    return NextResponse.json(
      { ok: true, ignored: "unknown_listing" },
      { status: 200 },
    );
  }

  return NextResponse.json({
    ok: true,
    bookingId: result.bookingId,
    propertyId: result.propertyId,
  });
}

// Log the keys but never the values: a reservation payload carries
// guest names and emails, and this lands in Vercel's log drain. Keys
// alone are enough to tell a message event apart from a reservation
// whose envelope has moved again.
function logIgnored(payload: unknown) {
  console.warn(
    "[hostaway] ignored payload, top-level keys:",
    payload && typeof payload === "object"
      ? Object.keys(payload as Record<string, unknown>).join(",")
      : typeof payload,
  );
}
