"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { currentAuditActor, requireRole } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import { sendClientWelcomeEmail } from "@/lib/client-welcome";
import { WELCOME_SEND_CAP } from "./limits";
import {
  parseCsv,
  summariseImport,
  validateRows,
  type ValidatedRow,
} from "@/lib/admin/csv-import";
import { personFullName } from "@/lib/validation/preprocessors";

// Schema mirrors the ClientForm validators in src/lib/validation/schemas.
// We accept either fullName or full_name as the column header so a
// pasted Google Sheets export works without manual renaming.
const RowSchema = z.object({
  fullName: personFullName,
  email: z.string().trim().toLowerCase().email(),
  country: z.enum(["KE", "GH"]),
  companyName: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  preferredCurrency: z
    .string()
    .trim()
    .toUpperCase()
    .length(3)
    .optional(),
});

export type ClientImportPreview = {
  rows: ValidatedRow<z.infer<typeof RowSchema>>[];
  okCount: number;
  errorCount: number;
  warnings: string[];
};

export async function previewClientImportAction(
  _prevState: ClientImportPreview | null,
  formData: FormData,
): Promise<ClientImportPreview> {
  await requireRole("import.write");
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return {
      rows: [],
      okCount: 0,
      errorCount: 0,
      warnings: ["Pick a CSV file first."],
    };
  }
  const text = await file.text();
  const parsed = parseCsv(text);
  const validated = validateRows(parsed.rows, normaliseAndValidate);
  const { okCount, errorCount } = summariseImport(validated);
  return {
    rows: validated,
    okCount,
    errorCount,
    warnings: parsed.warnings,
  };
}

// Most imports are a handful of rows pasted out of a spreadsheet, and
// for those the welcome email should just go out — an imported client
// with no email is a client who cannot reach their portal and has no
// idea an account exists. WELCOME_SEND_CAP is where that stops being
// safe; see limits.ts for why.

// Sends run a few at a time rather than one after another, which
// keeps a full 25-row import at roughly five sequential round trips
// instead of fifty.
const WELCOME_SEND_CONCURRENCY = 5;

export async function applyClientImportAction(formData: FormData): Promise<void> {
  await requireRole("import.write");
  const actor = await currentAuditActor();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Re-upload the CSV file before applying.");
  }

  const sendWelcome = formData.get("sendWelcome") === "on";

  const text = await file.text();
  const parsed = parseCsv(text);
  const validated = validateRows(parsed.rows, normaliseAndValidate);
  const valid = validated.filter(
    (r): r is Extract<typeof r, { ok: true }> => r.ok,
  );

  // Collected as we go so the emails can be sent after every row is
  // safely committed. Creating all the rows first means a send that
  // fails or times out can never cost us a client record.
  const createdClients: {
    id: string;
    email: string;
    fullName: string;
    companyName: string | null;
    country: "KE" | "GH";
  }[] = [];

  for (const row of valid) {
    try {
      const client = await prisma.client.create({
        data: {
          fullName: row.value.fullName,
          email: row.value.email,
          country: row.value.country,
          companyName: row.value.companyName || null,
          phone: row.value.phone || null,
          preferredCurrency: row.value.preferredCurrency ?? "USD",
        },
      });
      createdClients.push({
        id: client.id,
        email: client.email,
        fullName: client.fullName,
        companyName: client.companyName,
        country: client.country,
      });
      await recordAudit({
        actor,
        entity: "CLIENT",
        entityId: client.id,
        action: "client.imported",
        summary: `Imported via CSV row ${row.rowIndex}`,
        metadata: { rowIndex: row.rowIndex, source: "csv" },
      });
    } catch (err) {
      console.warn("[client-import] row failed", row.rowIndex, err);
    }
  }

  const created = createdClients.length;
  const overCap = created > WELCOME_SEND_CAP;
  let welcomed = 0;

  if (sendWelcome && !overCap) {
    for (let i = 0; i < createdClients.length; i += WELCOME_SEND_CONCURRENCY) {
      const batch = createdClients.slice(i, i + WELCOME_SEND_CONCURRENCY);
      const results = await Promise.allSettled(
        batch.map((c) =>
          sendClientWelcomeEmail({
            email: c.email,
            fullName: c.fullName,
            companyName: c.companyName,
            country: c.country,
            clientId: c.id,
            actor,
          }),
        ),
      );
      for (const r of results) {
        // `delivered`, not `ok`: with email unconfigured every send
        // resolves ok while delivering nothing, and reporting "25 of
        // 25 welcome emails sent" would be a straight lie.
        if (r.status === "fulfilled" && r.value.delivered) welcomed += 1;
      }
    }
  }

  // Outcome is reported back on the list page rather than swallowed:
  // "did those people get an email?" is the first thing an operator
  // wants to know, and it used to be unanswerable.
  const params = new URLSearchParams({ imported: String(created) });
  if (sendWelcome) {
    if (overCap) params.set("welcomeSkipped", "cap");
    else params.set("welcomed", String(welcomed));
  } else {
    params.set("welcomeSkipped", "off");
  }
  redirect(`/admin/clients?${params.toString()}`);
}

function normaliseAndValidate(
  raw: Record<string, string>,
):
  | { ok: true; value: z.infer<typeof RowSchema> }
  | { ok: false; errors: string[] } {
  const normalised = {
    fullName: raw.fullName ?? raw.full_name ?? raw.name ?? "",
    email: raw.email ?? "",
    country: raw.country ?? raw.Country ?? "",
    companyName: raw.companyName ?? raw.company_name ?? raw.company ?? "",
    phone: raw.phone ?? raw.Phone ?? "",
    preferredCurrency:
      raw.preferredCurrency ?? raw.preferred_currency ?? raw.currency ?? "",
  };
  const result = RowSchema.safeParse({
    ...normalised,
    companyName: normalised.companyName || undefined,
    phone: normalised.phone || undefined,
    preferredCurrency: normalised.preferredCurrency || undefined,
  });
  if (result.success) return { ok: true, value: result.data };
  return {
    ok: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join(".")}: ${i.message}`,
    ),
  };
}
