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

// One row per property. ownerEmail is the join key — admins always
// know the email already, and importing properties before the
// matching owner exists is a workflow bug we want to surface
// loudly rather than silently auto-create.
const RowSchema = z.object({
  ownerEmail: z.string().trim().toLowerCase().email(),
  name: z.string().trim().min(2),
  unitNumber: z.string().trim().optional(),
  city: z.string().trim().min(2),
  address: z.string().trim().min(3),
  neighbourhood: z.string().trim().optional(),
  country: z.enum(["KE", "GH"]),
  propertyType: z.enum(["LONG_TERM", "SHORT_TERM"]).default("LONG_TERM"),
  bedrooms: z.coerce.number().int().min(0).max(50).optional(),
  bathrooms: z.coerce.number().int().min(0).max(50).optional(),
  sizeSqm: z.coerce.number().int().min(0).max(100_000).optional(),
});

export type PropertyImportPreview = {
  rows: ValidatedRow<z.infer<typeof RowSchema>>[];
  okCount: number;
  errorCount: number;
  warnings: string[];
};

export async function previewPropertyImportAction(
  _prev: PropertyImportPreview | null,
  formData: FormData,
): Promise<PropertyImportPreview> {
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

export async function applyPropertyImportAction(
  formData: FormData,
): Promise<void> {
  await requireRole("import.write");
  const actor = await currentAuditActor();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new Error("Re-upload the CSV file before applying.");
  }

  const text = await file.text();
  const parsed = parseCsv(text);
  const validated = validateRows(parsed.rows, normaliseAndValidate);

  let created = 0;
  let unmatched = 0;
  for (const row of validated) {
    if (!row.ok) continue;
    const owner = await prisma.owner.findUnique({
      where: { email: row.value.ownerEmail },
      select: { id: true },
    });
    if (!owner) {
      unmatched += 1;
      continue;
    }
    try {
      const property = await prisma.property.create({
        data: {
          ownerId: owner.id,
          name: row.value.name,
          unitNumber: row.value.unitNumber || null,
          city: row.value.city,
          address: row.value.address,
          neighbourhood: row.value.neighbourhood || null,
          country: row.value.country,
          propertyType: row.value.propertyType,
          bedrooms: row.value.bedrooms ?? null,
          bathrooms: row.value.bathrooms ?? null,
          sizeSqm: row.value.sizeSqm ?? null,
        },
      });
      created += 1;
      await recordAudit({
        actor,
        entity: "PROPERTY",
        entityId: property.id,
        action: "property.imported",
        summary: `Imported via CSV row ${row.rowIndex} for owner ${row.value.ownerEmail}`,
        metadata: { rowIndex: row.rowIndex, source: "csv" },
      });
    } catch (err) {
      console.warn("[property-import] row failed", row.rowIndex, err);
    }
  }

  redirect(
    `/admin/properties?imported=${created}${unmatched > 0 ? `&unmatched=${unmatched}` : ""}`,
  );
}

function normaliseAndValidate(
  raw: Record<string, string>,
):
  | { ok: true; value: z.infer<typeof RowSchema> }
  | { ok: false; errors: string[] } {
  const normalised = {
    ownerEmail: raw.ownerEmail ?? raw.owner_email ?? raw.owner ?? "",
    name: raw.name ?? raw.building ?? "",
    unitNumber: raw.unitNumber ?? raw.unit_number ?? raw.unit ?? "",
    city: raw.city ?? "",
    address: raw.address ?? "",
    neighbourhood: raw.neighbourhood ?? raw.neighborhood ?? "",
    country: raw.country ?? "",
    propertyType:
      (raw.propertyType ?? raw.property_type ?? "").toUpperCase() || "LONG_TERM",
    bedrooms: raw.bedrooms ?? "",
    bathrooms: raw.bathrooms ?? "",
    sizeSqm: raw.sizeSqm ?? raw.size_sqm ?? raw.size ?? "",
  };
  const result = RowSchema.safeParse({
    ...normalised,
    unitNumber: normalised.unitNumber || undefined,
    neighbourhood: normalised.neighbourhood || undefined,
    bedrooms: normalised.bedrooms || undefined,
    bathrooms: normalised.bathrooms || undefined,
    sizeSqm: normalised.sizeSqm || undefined,
  });
  if (result.success) return { ok: true, value: result.data };
  return {
    ok: false,
    errors: result.error.issues.map(
      (i) => `${i.path.join(".")}: ${i.message}`,
    ),
  };
}
