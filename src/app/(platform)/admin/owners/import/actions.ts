"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { currentAuditActor, requireRole } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import {
  parseCsv,
  summariseImport,
  validateRows,
  type ValidatedRow,
} from "@/lib/admin/csv-import";

// Schema mirrors the OwnerForm validators in src/lib/validation/schemas.
// We accept either fullName or full_name as the column header so a
// pasted Google Sheets export works without manual renaming.
const RowSchema = z.object({
  fullName: z.string().trim().min(2),
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

export type OwnerImportPreview = {
  rows: ValidatedRow<z.infer<typeof RowSchema>>[];
  okCount: number;
  errorCount: number;
  warnings: string[];
};

export async function previewOwnerImportAction(
  _prevState: OwnerImportPreview | null,
  formData: FormData,
): Promise<OwnerImportPreview> {
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

export async function applyOwnerImportAction(formData: FormData): Promise<void> {
  await requireRole("import.write");
  const actor = await currentAuditActor();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Re-upload the CSV file before applying.");
  }

  const text = await file.text();
  const parsed = parseCsv(text);
  const validated = validateRows(parsed.rows, normaliseAndValidate);
  const valid = validated.filter(
    (r): r is Extract<typeof r, { ok: true }> => r.ok,
  );

  let created = 0;
  for (const row of valid) {
    try {
      const owner = await prisma.owner.create({
        data: {
          fullName: row.value.fullName,
          email: row.value.email,
          country: row.value.country,
          companyName: row.value.companyName || null,
          phone: row.value.phone || null,
          preferredCurrency: row.value.preferredCurrency ?? "USD",
        },
      });
      created += 1;
      await recordAudit({
        actor,
        entity: "OWNER",
        entityId: owner.id,
        action: "owner.imported",
        summary: `Imported via CSV row ${row.rowIndex}`,
        metadata: { rowIndex: row.rowIndex, source: "csv" },
      });
    } catch (err) {
      console.warn("[owner-import] row failed", row.rowIndex, err);
    }
  }

  redirect(`/admin/owners?imported=${created}`);
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
