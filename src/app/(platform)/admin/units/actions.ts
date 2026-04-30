"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { UnitStatus } from "@prisma/client";

const optionalInt = z.preprocess((v) => {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  if (t === "") return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
}, z.number().int().min(0).optional());

const UnitInput = z.object({
  propertyId: z.string().min(1),
  label: z.string().trim().min(1).max(60),
  bedrooms: optionalInt,
  bathrooms: optionalInt,
  sizeSqm: optionalInt,
  status: z.nativeEnum(UnitStatus).default("VACANT"),
});

export type UnitActionResult =
  | { ok: true; unitId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fromForm(formData: FormData) {
  return {
    propertyId: String(formData.get("propertyId") ?? ""),
    label: String(formData.get("label") ?? ""),
    bedrooms: String(formData.get("bedrooms") ?? ""),
    bathrooms: String(formData.get("bathrooms") ?? ""),
    sizeSqm: String(formData.get("sizeSqm") ?? ""),
    status: String(formData.get("status") ?? "VACANT"),
  };
}

function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.join(".");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export async function createUnitAction(
  _prev: UnitActionResult | null,
  formData: FormData,
): Promise<UnitActionResult> {
  await requireAdmin();
  const parsed = UnitInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }
  try {
    const unit = await prisma.unit.create({ data: parsed.data });
    revalidatePath("/admin");
    revalidatePath(`/admin/properties/${parsed.data.propertyId}`);
    redirect(`/admin/units/${unit.id}`);
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    return { ok: false, error: "Could not save the unit. Please retry." };
  }
}

export async function updateUnitAction(
  unitId: string,
  _prev: UnitActionResult | null,
  formData: FormData,
): Promise<UnitActionResult> {
  await requireAdmin();
  const parsed = UnitInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }
  try {
    const { propertyId: _p, ...rest } = parsed.data;
    const updated = await prisma.unit.update({
      where: { id: unitId },
      data: rest,
    });
    revalidatePath("/admin");
    revalidatePath(`/admin/units/${unitId}`);
    revalidatePath(`/admin/properties/${updated.propertyId}`);
    return { ok: true, unitId };
  } catch {
    return { ok: false, error: "Could not save changes. Please retry." };
  }
}
