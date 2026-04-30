"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Country } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PropertyInput } from "@/lib/validation/schemas";
import { flattenZodErrors } from "@/lib/validation/preprocessors";

export type PropertyActionResult =
  | { ok: true; propertyId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fromForm(formData: FormData) {
  return {
    ownerId: String(formData.get("ownerId") ?? ""),
    name: String(formData.get("name") ?? ""),
    city: String(formData.get("city") ?? ""),
    neighbourhood: String(formData.get("neighbourhood") ?? ""),
    address: String(formData.get("address") ?? ""),
    description: String(formData.get("description") ?? ""),
    bedrooms: String(formData.get("bedrooms") ?? ""),
    bathrooms: String(formData.get("bathrooms") ?? ""),
    sizeSqm: String(formData.get("sizeSqm") ?? ""),
    acquiredOn: String(formData.get("acquiredOn") ?? ""),
    acquisitionPrice: String(formData.get("acquisitionPrice") ?? ""),
    acquisitionCurrency: String(formData.get("acquisitionCurrency") ?? "USD"),
    status: String(formData.get("status") ?? "ONBOARDING"),
  };
}

export async function createPropertyAction(
  _prev: PropertyActionResult | null,
  formData: FormData,
): Promise<PropertyActionResult> {
  await requireAdmin();

  const parsed = PropertyInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  // Country is inherited from the owner so we don't ask for it twice.
  const owner = await prisma.owner.findUnique({
    where: { id: parsed.data.ownerId },
    select: { country: true },
  });
  if (!owner) {
    return { ok: false, error: "Owner not found." };
  }

  try {
    const created = await prisma.property.create({
      data: {
        ...parsed.data,
        country: owner.country as Country,
      },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/properties");
    revalidatePath(`/admin/owners/${parsed.data.ownerId}`);
    redirect(`/admin/properties/${created.id}`);
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    return { ok: false, error: "Could not save the property. Please retry." };
  }
}

export async function updatePropertyAction(
  propertyId: string,
  _prev: PropertyActionResult | null,
  formData: FormData,
): Promise<PropertyActionResult> {
  await requireAdmin();

  const parsed = PropertyInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  try {
    const { ownerId: _ignored, ...rest } = parsed.data;
    await prisma.property.update({
      where: { id: propertyId },
      data: rest,
    });
    revalidatePath("/admin");
    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${propertyId}`);
    revalidatePath(`/admin/owners/${parsed.data.ownerId}`);
    return { ok: true, propertyId };
  } catch {
    return { ok: false, error: "Could not save changes. Please retry." };
  }
}
