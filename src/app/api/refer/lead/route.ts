// POST /api/refer/lead — manual landlord submission from a referrer's
// dashboard. Auth is the dashboard token: whoever holds it can submit
// referrals against that referrer's account, same trust boundary as
// the dashboard itself.
//
// This is the "agent has the relationship, the landlord may never
// click a link" path. The referrer types in the landlord's name +
// contact, we create the Airtable lead AND the Postgres Referral row
// in one round-trip, attributed to them.

import { NextResponse } from "next/server";
import { z } from "zod";
import {
  airtableTables,
  createAirtableRecord,
  isAirtableConfigured,
} from "@/lib/airtable";
import { rateLimitOr429 } from "@/lib/rateLimit";
import { enrichLead } from "@/lib/lead-enrichment";
import {
  attachLeadToReferrer,
  findReferrerByDashboardToken,
} from "@/lib/referrals/db";

export const runtime = "nodejs";

const Body = z.object({
  token: z.string().min(32).max(64),
  landlordName: z.string().trim().min(2).max(120),
  email: z.string().email().optional(),
  phone: z.string().trim().max(40).optional(),
  city: z.enum(["Nairobi", "Accra", "Other"]).optional(),
  neighbourhood: z.string().trim().max(80).optional(),
  service: z.string().trim().max(80).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export async function POST(req: Request) {
  const limited = await rateLimitOr429(req, "lead");
  if (limited) return limited;

  let parsed: z.infer<typeof Body>;
  try {
    parsed = Body.parse(await req.json());
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: "Invalid input", details: (e as Error).message },
      { status: 400 },
    );
  }

  const referrer = await findReferrerByDashboardToken(parsed.token);
  if (!referrer) {
    return NextResponse.json(
      { ok: false, error: "Invalid dashboard token" },
      { status: 401 },
    );
  }
  if (referrer.status !== "ACTIVE") {
    return NextResponse.json(
      {
        ok: false,
        error: `Account is ${referrer.status.toLowerCase()}; contact leads@goldstay.co.ke.`,
      },
      { status: 403 },
    );
  }

  const enrichment = enrichLead({
    country: null,
    city: parsed.city ?? null,
    neighbourhood: parsed.neighbourhood ?? null,
    service: parsed.service ?? null,
    bedrooms: null,
    availability: null,
    notes: parsed.notes ?? null,
    email: parsed.email ?? null,
    phone: parsed.phone ?? null,
  });

  const submittedAt = new Date().toISOString();
  const source = `referral:${referrer.code}`;

  // Mirror to the Landlord leads table for the ops queue. The id we
  // get back is stamped on the Referral row for cross-system audit.
  let airtableLeadId: string | null = null;
  if (isAirtableConfigured()) {
    airtableLeadId = await createAirtableRecord(airtableTables.leads, {
      Name: parsed.landlordName,
      Email: parsed.email,
      Phone: parsed.phone,
      City: parsed.city,
      Neighbourhood: parsed.neighbourhood,
      Service: parsed.service,
      Notes: [
        parsed.notes,
        `\n\n--- Submitted by referrer ${referrer.code} (${referrer.fullName}) ---`,
        `Tier ${enrichment.tier} · Score ${enrichment.score} · ${enrichment.callbackSlaMinutes}min SLA`,
        enrichment.rationale.join(" "),
      ]
        .filter(Boolean)
        .join("\n"),
      Submitted: submittedAt,
      Source: source,
      Status: "New",
    });
  }

  const referral = await attachLeadToReferrer({
    code: referrer.code,
    airtableLeadId,
    landlordName: parsed.landlordName,
    landlordEmail: parsed.email ?? null,
    landlordPhone: parsed.phone ?? null,
    city: parsed.city ?? null,
    notes: parsed.notes ?? null,
  });

  // Mirror the Referral row too, for the ops referrals view.
  if (referral && isAirtableConfigured()) {
    void createAirtableRecord(airtableTables.referrals, {
      "Landlord name": parsed.landlordName,
      "Referrer code": referrer.code,
      "Referrer name": referrer.fullName,
      "Referrer email": referrer.email,
      "Lead email": parsed.email,
      "Lead phone": parsed.phone,
      City: parsed.city,
      Status: referral.status,
      Source: source,
      Notes: parsed.notes,
      Created: referral.createdAt.toISOString(),
      "Referral ID": referral.id,
      "Lead ID": airtableLeadId ?? undefined,
    });
  }

  return NextResponse.json({ ok: true, referralId: referral?.id });
}
