// Vacancy-lead auto-pitch.
//
// The /apply tenant form auto-creates a row in the Airtable
// "Vacancy Leads" table whenever an applicant names a previous
// landlord — that landlord almost certainly has a unit they're about
// to need to re-let, and our marginal cost to acquire them is zero.
//
// This module turns those rows into outbound. The cron route
// (/api/cron/vacancy-pitch) runs daily, picks up rows whose Status
// is "New" and that have at least an email or phone, sends a short
// pitch via Resend, and patches the row to "Contacted" so we don't
// re-pitch on the next run. WhatsApp goes through the standard
// `wa.me` deeplink shown to ops in the email — proper WhatsApp
// Business API send is queued for the next iteration.

import {
  airtableTables,
  listAirtableRecords,
  patchAirtableRecord,
} from "@/lib/airtable";
import { waLink } from "@/lib/site";

type VacancyFields = {
  "Landlord name"?: string;
  Phone?: string;
  Property?: string;
  "Tenant leaving"?: string;
  "Leaving around"?: string;
  "Referred via"?: string;
  Submitted?: string;
  Status?: string;
};

export type VacancyPitchResult = {
  ok: boolean;
  reason?: string;
  emailedTo?: string;
  whatsappLink?: string;
};

export type VacancyPitchSummary = {
  candidates: number;
  pitched: number;
  skipped: number;
  errors: number;
  details: Array<{
    id: string;
    landlord: string | undefined;
    result: VacancyPitchResult;
  }>;
};

// Best-effort email-vs-phone separator. Vacancy Leads only has a
// "Phone" column, but landlords sometimes type emails into it. We
// treat anything containing "@" as email; everything else as phone.
function separateContact(raw: string | undefined): {
  email?: string;
  phone?: string;
} {
  const v = (raw ?? "").trim();
  if (!v) return {};
  if (v.includes("@")) return { email: v };
  return { phone: v };
}

export function buildPitchEmail(landlord: VacancyFields): {
  subject: string;
  text: string;
} {
  const name = landlord["Landlord name"]?.trim() || "there";
  const property = landlord.Property?.trim();
  const tenant = landlord["Tenant leaving"]?.trim();
  const leaving = landlord["Leaving around"]?.trim();

  const subject = property
    ? `Re-letting ${property.split("\n")[0]?.slice(0, 60)}: quick offer`
    : `Quick offer on your upcoming vacancy`;

  const lines: string[] = [
    `Hi ${name},`,
    "",
    `I'm writing from Goldstay${landlord["Referred via"] ? ` after ${landlord["Referred via"]} mentioned us` : ""}.`,
  ];

  if (tenant && property) {
    lines.push(
      `We understand ${tenant} is moving out of ${property.split("\n")[0]}${leaving ? ` around ${leaving}` : ""}, which means you'll be looking for a new tenant shortly.`,
    );
  } else if (property) {
    lines.push(
      `We understand you'll have a vacancy at ${property.split("\n")[0]}${leaving ? ` around ${leaving}` : ""} shortly.`,
    );
  } else {
    lines.push(
      `We understand you'll have a tenant moving out${leaving ? ` around ${leaving}` : ""}.`,
    );
  }

  lines.push(
    "",
    "Goldstay manages premium residential lets in Nairobi end-to-end for diaspora and busy professional landlords:",
    "  · We source the next tenant in days, not weeks (we already have a vetted pipeline).",
    "  · 10% management fee; everything else (maintenance, KRA, communication) is on us.",
    "  · USD remittance to whichever bank you prefer, every month, on the 5th.",
    "",
    "Would a 15-minute call this week make sense? Reply to this email or message me on WhatsApp on +254 700 000 000 (your dedicated line goes here).",
    "",
    "Best,",
    "The Goldstay team",
    "leads@goldstay.co.ke · goldstay.co.ke",
  );

  return { subject, text: lines.join("\n") };
}

async function sendOne(
  recipientEmail: string,
  subject: string,
  text: string,
  apiKey: string,
  fromAddress: string,
): Promise<boolean> {
  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: fromAddress,
      to: [recipientEmail],
      subject,
      text,
    });
    return true;
  } catch (e) {
    console.error("[vacancy-pitch] resend send failed", e);
    return false;
  }
}

// Cap on rows pitched per run so a backlog can't burn through Resend
// quota in one go. Backlog gets cleared over several days; that's
// fine because every row stays "New" until we touch it.
const MAX_PER_RUN = 25;

export async function runVacancyPitchOnce(): Promise<VacancyPitchSummary> {
  const summary: VacancyPitchSummary = {
    candidates: 0,
    pitched: 0,
    skipped: 0,
    errors: 0,
    details: [],
  };

  const apiKey = process.env.RESEND_API_KEY;
  const fromAddress =
    process.env.RESEND_FROM_LEADS ||
    "Goldstay Leads <leads@goldstay.co.ke>";
  const opsInbox =
    process.env.LEADS_INBOX ||
    process.env.CONTACT_INBOX ||
    "leads@goldstay.co.ke";

  const candidates = await listAirtableRecords<VacancyFields>(
    airtableTables.vacancy,
    {
      filterByFormula: `OR({Status}='New',{Status}=BLANK())`,
      fields: [
        "Landlord name",
        "Phone",
        "Property",
        "Tenant leaving",
        "Leaving around",
        "Referred via",
        "Submitted",
        "Status",
      ],
      maxRecords: MAX_PER_RUN,
      sort: [{ field: "Submitted", direction: "desc" }],
    },
  );
  summary.candidates = candidates.length;

  for (const record of candidates) {
    const f = record.fields;
    const contact = separateContact(f.Phone);

    const { subject, text } = buildPitchEmail(f);
    const wa = contact.phone
      ? waLink(
          `Hi ${f["Landlord name"] ?? "there"}, this is Goldstay. We manage premium lets in Nairobi. We understand you'll have a vacancy${f["Leaving around"] ? ` around ${f["Leaving around"]}` : ""} and would love a quick chat.`,
          "nairobi",
        )
      : undefined;

    let emailed = false;
    if (contact.email && apiKey) {
      emailed = await sendOne(
        contact.email,
        subject,
        text,
        apiKey,
        fromAddress,
      );
    } else if (apiKey) {
      // No email on file: send the pitch to ops with the WhatsApp
      // deeplink so a human picks it up. This still counts as
      // "Contacted" for status purposes.
      emailed = await sendOne(
        opsInbox,
        `[ops] Vacancy pitch needs WhatsApp: ${f["Landlord name"] ?? "Unknown"}`,
        [
          subject,
          "",
          text,
          "",
          "---",
          `WhatsApp link: ${wa ?? "(no phone on record)"}`,
        ].join("\n"),
        apiKey,
        fromAddress,
      );
    } else {
      // No Resend API key configured — log only.
      console.log(
        `[vacancy-pitch] (dry run) ${record.id} ${f["Landlord name"] ?? ""}`,
      );
      emailed = true;
    }

    if (!emailed) {
      summary.errors++;
      summary.details.push({
        id: record.id,
        landlord: f["Landlord name"],
        result: { ok: false, reason: "send-failed" },
      });
      continue;
    }

    const patched = await patchAirtableRecord(
      airtableTables.vacancy,
      record.id,
      { Status: "Contacted" },
    );
    if (!patched) {
      summary.errors++;
      summary.details.push({
        id: record.id,
        landlord: f["Landlord name"],
        result: { ok: false, reason: "patch-failed" },
      });
      continue;
    }

    summary.pitched++;
    summary.details.push({
      id: record.id,
      landlord: f["Landlord name"],
      result: {
        ok: true,
        emailedTo: contact.email ?? opsInbox,
        whatsappLink: wa,
      },
    });
  }

  return summary;
}
