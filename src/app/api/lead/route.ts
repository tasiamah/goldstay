import { NextResponse } from "next/server";
import {
  airtableTables,
  createAirtableRecord,
  isAirtableConfigured,
} from "@/lib/airtable";
import { rateLimitOr429 } from "@/lib/rateLimit";

export const runtime = "nodejs";

// Landlord lead endpoint. Receives the /list-your-property form payload and
// mirrors it to two places in parallel:
//
//   1. Resend email to the ops inbox so a human sees it in their normal
//      workflow within seconds.
//   2. Airtable "Leads" table so the lead is trackable alongside future
//      conversations, statuses and renewals.
//
// Email remains the primary channel. Airtable is a best-effort mirror: if it
// fails or is not configured, we still return a success response and the
// email still sends. That way the CRM never becomes a gate that can break
// the public form.

type Lead = Record<string, unknown>;

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

  // Default to the .co.ke inbox because that's the only domain with a
  // live forwarder at the moment. Override via CONTACT_INBOX in Vercel
  // once hello@goldstay.com routes somewhere real.
  const inbox = process.env.CONTACT_INBOX || "hello@goldstay.co.ke";
  const apiKey = process.env.RESEND_API_KEY;
  // "From" address is env-driven so we can flip to leads@goldstay.com
  // the moment that domain is verified in Resend, without a code push.
  const fromAddress =
    process.env.RESEND_FROM_LEADS || "Goldstay <leads@goldstay.co.ke>";

  const body = formatEmail(data);
  const submittedAt = new Date().toISOString();

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
        subject: `New property enquiry: ${data.name ?? "Unnamed"} (${data.city ?? ""})`,
        text: body,
      });
    } catch (e) {
      console.error("Resend send failed", e);
    }
  };

  const pushAirtable = async () => {
    if (!isAirtableConfigured()) return;
    await createAirtableRecord(airtableTables.leads, {
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
      Notes: str(data.notes),
      Submitted: submittedAt,
      Source: "list-your-property",
      Status: "New",
    });
  };

  // Parallel so total latency is max(email, airtable), not sum. allSettled
  // so a failure in one does not bubble up and fail the other.
  await Promise.allSettled([sendEmail(), pushAirtable()]);

  return NextResponse.json({ ok: true });
}
