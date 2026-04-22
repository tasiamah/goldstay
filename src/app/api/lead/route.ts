import { NextResponse } from "next/server";
import {
  airtableTables,
  createAirtableRecord,
  isAirtableConfigured,
} from "@/lib/airtable";

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
  let data: Lead;
  try {
    data = (await req.json()) as Lead;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const inbox = process.env.CONTACT_INBOX || "hello@goldstay.com";
  const apiKey = process.env.RESEND_API_KEY;

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
        from: "Goldstay <leads@goldstay.com>",
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
