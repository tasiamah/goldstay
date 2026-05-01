import { NextResponse } from "next/server";
import {
  airtableTables,
  createAirtableRecord,
  isAirtableConfigured,
} from "@/lib/airtable";
import { enrichLead } from "@/lib/lead-enrichment";
import { createLead } from "@/lib/leads";
import { rateLimitOr429 } from "@/lib/rateLimit";
import { readReferralCookie } from "@/lib/referrals/attribution";
import { attachLeadToReferrer } from "@/lib/referrals/db";

export const runtime = "nodejs";

// Landlord lead endpoint. Receives the /list-your-property form payload and
// fans it out to three places in parallel:
//
//   1. Postgres `Lead` row (system of record from this point forward).
//      Powers /admin/leads, the convert-to-owner button, and the
//      lead-to-owner conversion analytics.
//   2. Resend email to the ops inbox so a human sees it in their normal
//      workflow within seconds.
//   3. Airtable "Leads" table so the lead is trackable alongside future
//      conversations, statuses and renewals.
//
// Email is still the primary channel for the human ops workflow. The
// DB row and Airtable mirror are both best-effort: if either fails or
// is not configured, we still return a success response and the email
// still sends. That way no individual sink can become a gate that
// breaks the public form.

type Lead = Record<string, unknown>;

// Map the legacy free-text "Nairobi" / "Accra" city value into the
// Country enum we use everywhere downstream. Anything else (including
// the explicit "Other" choice in the form) lands as null and ops
// triages from the notes.
function inferCountry(city: unknown): "KE" | "GH" | undefined {
  if (typeof city !== "string") return undefined;
  const v = city.trim().toLowerCase();
  if (v === "nairobi") return "KE";
  if (v === "accra") return "GH";
  return undefined;
}

function formatEmail(lead: Lead) {
  return Object.entries(lead)
    .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
    .join("\n");
}

function str(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  return String(v);
}

export async function POST(req: Request) {
  const limited = await rateLimitOr429(req, "lead");
  if (limited) return limited;

  let data: Lead;
  try {
    data = (await req.json()) as Lead;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Landlord enquiries land in the leads@ alias by default. LEADS_INBOX
  // takes priority; CONTACT_INBOX is honoured as a legacy fallback so
  // existing Vercel env var values keep working. Final hardcoded default
  // points at leads@ rather than hello@ because the aliases now exist on
  // the Workspace mailbox, so routing here is correct out of the box.
  const inbox =
    process.env.LEADS_INBOX ||
    process.env.CONTACT_INBOX ||
    "leads@goldstay.co.ke";
  const apiKey = process.env.RESEND_API_KEY;
  // goldstay.co.ke is verified in Resend, so this sender is deliverable
  // without any further DNS work. Env var remains for future multi-brand
  // or white-label sends (e.g. landlord-facing monthly statements).
  const fromAddress =
    process.env.RESEND_FROM_LEADS ||
    "Goldstay Leads <leads@goldstay.co.ke>";

  const enrichment = enrichLead({
    country: str(data.country) ?? null,
    city: str(data.city) ?? null,
    neighbourhood: str(data.neighbourhood) ?? null,
    service: str(data.service) ?? null,
    bedrooms: str(data.bedrooms) ?? null,
    availability: str(data.availability) ?? null,
    notes: str(data.notes) ?? null,
    email: str(data.email) ?? null,
    phone: str(data.phone) ?? null,
  });

  const submittedAt = new Date().toISOString();
  // Email body keeps the existing simple key:value layout but prepends
  // a 3-line operator briefing so the on-call sees Tier + SLA at a
  // glance without scrolling.
  const briefing = [
    `Tier: ${enrichment.tier}  ·  Score: ${enrichment.score}  ·  Callback SLA: ${enrichment.callbackSlaMinutes} min`,
    `Diaspora: ${enrichment.isDiaspora ? "yes" : "no"}  ·  Premium neighbourhood: ${enrichment.isPremiumNeighbourhood ? "yes" : "no"}`,
    enrichment.rationale.length
      ? `Rationale: ${enrichment.rationale.join(" ")}`
      : null,
  ]
    .filter(Boolean)
    .join("\n");
  const body = `${briefing}\n\n---\n\n${formatEmail(data)}`;
  // Source field tracks which surface the lead came from. Embedded
  // widget posts override it via data.source; everything else is the
  // canonical /list-your-property form. A `gs_ref` cookie (set by
  // middleware on `?ref=…`) overrides both with `referral:<code>`,
  // which is the durable attribution signal ops uses to credit the
  // partner that sent the lead.
  const referralCode = readReferralCookie();
  const source = referralCode
    ? `referral:${referralCode}`
    : str(data.source) ?? "list-your-property";

  const sendEmail = async () => {
    if (!apiKey) {
      console.log("[goldstay lead]\n" + body);
      return;
    }
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: fromAddress,
        to: [inbox],
        replyTo: (data.email as string) || undefined,
        subject: `[${enrichment.tier}] New property enquiry: ${data.name ?? "Unnamed"} (${data.city ?? ""})`,
        text: body,
      });
    } catch (e) {
      console.error("Resend send failed", e);
    }
  };

  // Captured after the Airtable mirror runs so the Referral row can
  // store the lead's CRM id for cross-system audit.
  let airtableLeadId: string | null = null;

  const pushAirtable = async () => {
    if (!isAirtableConfigured()) return;
    airtableLeadId = await createAirtableRecord(airtableTables.leads, {
      Name: str(data.name),
      Email: str(data.email),
      Phone: str(data.phone),
      Country: str(data.country),
      City: str(data.city),
      Neighbourhood: str(data.neighbourhood),
      "Property type": str(data.propertyType),
      Bedrooms: str(data.bedrooms),
      Furnished: str(data.furnished),
      Service: str(data.service),
      Availability: str(data.availability),
      Notes: [
        str(data.notes),
        `\n\n--- Auto-enrichment ---\nTier ${enrichment.tier} · Score ${enrichment.score} · ${enrichment.callbackSlaMinutes}min SLA\n${enrichment.rationale.join(" ")}`,
      ]
        .filter(Boolean)
        .join("\n"),
      Submitted: submittedAt,
      Source: source,
      Status: "New",
    });
  };

  const persistDbRow = async () => {
    // Required-field guard before touching the DB so a half-typed
    // form doesn't insert a junk row. The form already enforces
    // these client-side; we mirror server-side because direct API
    // hits and embedded widgets bypass the client validation.
    const fullName = str(data.name)?.trim();
    const phone = str(data.phone)?.trim();
    if (!fullName || !phone) return;
    try {
      await createLead({
        source: "WEBSITE",
        fullName,
        email: str(data.email),
        phone,
        residenceCountry: str(data.country),
        country: inferCountry(data.city),
        city: str(data.city),
        neighbourhood: str(data.neighbourhood),
        propertyType: str(data.propertyType),
        bedrooms: str(data.bedrooms),
        furnished: str(data.furnished),
        serviceInterest: str(data.service),
        availability: str(data.availability),
        notes: str(data.notes),
        actor: null,
      });
    } catch (e) {
      // Never fail the form because Postgres is unhappy. The email
      // and Airtable mirrors stay as the safety net.
      console.error("[goldstay lead] DB persist failed", e);
    }
  };

  // Parallel so total latency is max(email, airtable, db), not sum.
  // allSettled so a failure in one does not bubble up and fail the
  // others — every sink is an independent best-effort.
  await Promise.allSettled([sendEmail(), pushAirtable(), persistDbRow()]);

  // Referral attribution runs after the Airtable mirror so we can
  // stamp the CRM lead id onto the Referral row. A missing or stale
  // cookie just means no attribution; not an error.
  if (referralCode) {
    try {
      const fullName = str(data.name)?.trim();
      if (fullName) {
        await attachLeadToReferrer({
          code: referralCode,
          airtableLeadId,
          landlordName: fullName,
          landlordEmail: str(data.email) ?? null,
          landlordPhone: str(data.phone) ?? null,
          city: str(data.city) ?? null,
          notes: str(data.notes) ?? null,
        });
      }
    } catch (e) {
      console.error("[goldstay lead] referral attach failed", e);
    }
  }

  return NextResponse.json({ ok: true });
}
