"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Country, PropertyStatus } from "@prisma/client";
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
    propertyType: String(formData.get("propertyType") ?? "LONG_TERM"),
    hostawayListingId: String(formData.get("hostawayListingId") ?? ""),
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
    // Business rule (current): a property is rented out as a whole,
    // never sub-divided. We still keep the Unit table because Lease
    // FKs into it, so we auto-create one implicit unit per property
    // and treat it as the property itself everywhere in the UI. If
    // we ever rent out subparts (a building, a compound) we flip
    // back to the per-unit flow without a migration.
    const created = await prisma.$transaction(async (tx) => {
      const property = await tx.property.create({
        data: {
          ...parsed.data,
          country: owner.country as Country,
        },
      });
      await tx.unit.create({
        data: {
          propertyId: property.id,
          label: "Whole property",
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          sizeSqm: property.sizeSqm,
        },
      });
      return property;
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

// ──────────────────────────────────────────────────────────────────
// Lifecycle transitions
//
// Status is not a free-form field. The only paths in/out of ACTIVE
// are the two actions below: a human marks the property verified
// after reviewing the documents, or marks it exited when it leaves
// the portfolio. Both are guarded server-side so the UI buttons
// can't be replayed to skip the rules.
// ──────────────────────────────────────────────────────────────────

export type LifecycleResult = { ok: true } | { ok: false; error: string };

export async function markPropertyVerifiedAction(
  propertyId: string,
): Promise<LifecycleResult> {
  await requireAdmin();

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      status: true,
      ownerId: true,
      _count: { select: { documents: true } },
    },
  });
  if (!property) return { ok: false, error: "Property not found." };
  if (property.status !== PropertyStatus.ONBOARDING) {
    return {
      ok: false,
      error: "Only onboarding properties can be marked as verified.",
    };
  }
  if (property._count.documents === 0) {
    return {
      ok: false,
      error:
        "Upload at least one document (title deed, sale agreement, lease) before marking the property as verified.",
    };
  }

  await prisma.property.update({
    where: { id: propertyId },
    data: { status: PropertyStatus.ACTIVE },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath(`/admin/owners/${property.ownerId}`);
  return { ok: true };
}

export async function markPropertyExitedAction(
  propertyId: string,
): Promise<LifecycleResult> {
  await requireAdmin();

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { status: true, ownerId: true },
  });
  if (!property) return { ok: false, error: "Property not found." };
  if (property.status === PropertyStatus.EXITED) {
    return { ok: false, error: "Property is already marked as exited." };
  }

  await prisma.property.update({
    where: { id: propertyId },
    data: { status: PropertyStatus.EXITED },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath(`/admin/owners/${property.ownerId}`);
  return { ok: true };
}
