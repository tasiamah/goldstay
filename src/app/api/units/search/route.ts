import { NextResponse } from "next/server";
import { searchUnits, type UnitSearchParams } from "@/lib/airtable";
import { rateLimitOr429 } from "@/lib/rateLimit";

export const runtime = "nodejs";
// Inventory is dynamic; never cache responses here. The Airtable client
// already forces no-store on the upstream request but we pin the route
// to dynamic as well so Next doesn't try to pre-render this endpoint.
export const dynamic = "force-dynamic";

// Public search endpoint for /find-a-home. Reads directly from Airtable
// (via the thin helper in src/lib/airtable.ts) and filters server-side to
// keep Airtable PAT scope private and to avoid sending the whole inventory
// to the browser. Returns `{ units: [] }` when Airtable isn't configured;
// the UI handles that by showing the empty-state waitlist, so the page
// never looks broken while the base is being set up.

function parseStayType(v: string | null): "Long-term" | "Short-stay" | null {
  if (v === "Long-term" || v === "Short-stay") return v;
  return null;
}

function parseCity(v: string | null): "Nairobi" | "Accra" | undefined {
  if (v === "Nairobi" || v === "Accra") return v;
  return undefined;
}

function parsePositiveInt(v: string | null): number | undefined {
  if (!v) return undefined;
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

function parseIsoDate(v: string | null): string | undefined {
  if (!v) return undefined;
  // Airtable expects YYYY-MM-DD, and so does our search UI. Anything else
  // is rejected rather than coerced so a malformed date doesn't silently
  // match everything.
  return /^\d{4}-\d{2}-\d{2}$/.test(v) ? v : undefined;
}

export async function GET(req: Request) {
  const limited = await rateLimitOr429(req, "unitsSearch");
  if (limited) return limited;

  const url = new URL(req.url);
  const stayType = parseStayType(url.searchParams.get("stayType"));
  if (!stayType) {
    return NextResponse.json(
      { error: "stayType must be 'Long-term' or 'Short-stay'" },
      { status: 400 },
    );
  }

  const params: UnitSearchParams = {
    stayType,
    city: parseCity(url.searchParams.get("city")),
    bedrooms: parsePositiveInt(url.searchParams.get("bedrooms")),
    maxBudgetUsd: parsePositiveInt(url.searchParams.get("budget")),
    guests: parsePositiveInt(url.searchParams.get("guests")),
    checkIn: parseIsoDate(url.searchParams.get("checkIn")),
  };

  const units = await searchUnits(params);
  return NextResponse.json({ units });
}
