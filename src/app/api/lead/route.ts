import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Lead = Record<string, unknown>;

function formatEmail(lead: Lead) {
  return Object.entries(lead)
    .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
    .join("\n");
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

  if (apiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(apiKey);
      await resend.emails.send({
        from: "Goldstay <leads@goldstay.com>",
        to: [inbox],
        replyTo: (data.email as string) || undefined,
        subject: `New property enquiry — ${data.name ?? "Unnamed"} (${data.city ?? ""})`,
        text: body,
      });
    } catch (e) {
      console.error("Resend send failed", e);
    }
  } else {
    console.log("[goldstay lead]\n" + body);
  }

  return NextResponse.json({ ok: true });
}
