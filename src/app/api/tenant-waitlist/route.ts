import { NextResponse } from "next/server";
import {
  airtableTables,
  createAirtableRecord,
  isAirtableConfigured,
} from "@/lib/airtable";

export const runtime = "nodejs";

// Lightweight tenant capture from /find-a-home. Unlike /api/tenant-application
// (the deep dossier form at /apply that we send to invited applicants), this
// endpoint only wants what a passive browser is willing to hand over: name,
// contact, rough budget, rough timing. We mirror to Airtable's
// "Tenant waitlist" table and send an ops email so a human can reply with a
// shortlist within 24 hours.
//
// As with /api/lead, Airtable is a best-effort mirror. Email is the primary
// channel. If neither is configured the lead is logged to stdout so the
// operator still has a trace from Vercel logs.

type Waitlist = Record<string, unknown>;

function formatEmail(lead: Waitlist) {
  return Object.entries(lead)
    .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
    .join("\n");
}

function str(v: unknown): string | undefined {
  if (v === undefined || v === null) return undefined;
  return String(v);
}

function num(v: unknown): number | undefined {
  if (v === undefined || v === null || v === "") return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export async function POST(req: Request) {
  let data: Waitlist;
  try {
    data = (await req.json()) as Waitlist;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!data || typeof data !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Minimal sanity check; the UI validates these but the endpoint is public.
  if (!data.name || !data.email) {
    return NextResponse.json(
      { error: "Name and email are required." },
      { status: 400 },
    );
  }

  const inbox = process.env.CONTACT_INBOX || "hello@goldstay.com";
  const apiKey = process.env.RESEND_API_KEY;
  const body = formatEmail(data);
  const submittedAt = new Date().toISOString();

  const sendEmail = async () => {
    if (!apiKey) {
      console.log("[goldstay waitlist]\n" + body);
      return;
    }
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "Goldstay <leads@goldstay.com>",
        to: [inbox],
        replyTo: (data.email as string) || undefined,
        subject: `Tenant waitlist: ${data.name ?? "Unnamed"} (${data.city ?? ""} · ${data.stayType ?? ""})`,
        text: body,
      });
    } catch (e) {
      console.error("Resend waitlist send failed", e);
    }
  };

  const pushAirtable = async () => {
    if (!isAirtableConfigured()) return;
    await createAirtableRecord(airtableTables.waitlist, {
      Name: str(data.name),
      Email: str(data.email),
      Phone: str(data.phone),
      City: str(data.city),
      "Stay type": str(data.stayType),
      "Budget USD": num(data.budget),
      "Bedrooms wanted": str(data.bedrooms),
      "Move-in window": str(data.moveInWindow),
      "Check-in": str(data.checkIn),
      "Check-out": str(data.checkOut),
      Guests: num(data.guests),
      "Area preference": str(data.area),
      Notes: str(data.notes),
      Submitted: submittedAt,
      Status: "New",
    });
  };

  await Promise.allSettled([sendEmail(), pushAirtable()]);

  return NextResponse.json({ ok: true });
}
