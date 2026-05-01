"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AgreementStatus,
  Country,
  PropertyStatus,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PropertyInput } from "@/lib/validation/schemas";
import { flattenZodErrors } from "@/lib/validation/preprocessors";
import { defaultAgreementTerms } from "@/lib/agreements/defaults";

export type PropertyActionResult =
  | { ok: true; propertyId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fromForm(formData: FormData) {
  return {
    ownerId: String(formData.get("ownerId") ?? ""),
    name: String(formData.get("name") ?? ""),
    unitNumber: String(formData.get("unitNumber") ?? ""),
    city: String(formData.get("city") ?? ""),
    neighbourhood: String(formData.get("neighbourhood") ?? ""),
    address: String(formData.get("address") ?? ""),
    description: String(formData.get("description") ?? ""),
    bedrooms: String(formData.get("bedrooms") ?? ""),
    bathrooms: String(formData.get("bathrooms") ?? ""),
    sizeSqm: String(formData.get("sizeSqm") ?? ""),
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
    // Rental model is locked once a property exists. Switching it
    // mid-life would silently rewrite the snapshotted commission
    // rate on any open management agreement and change how every
    // future booking is treated by the statement aggregator. The
    // form already renders a read-only display in edit mode, but
    // we also defend server-side so a direct POST or stale form
    // payload can't slip a switch through. Updates require an
    // explicit back-office action (changeRentalModelAction) that
    // hasn't been built yet — the placeholder is intentional.
    const existing = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { propertyType: true },
    });
    if (!existing) {
      return { ok: false, error: "Property not found." };
    }

    const { ownerId: _ignored, propertyType: _attempted, ...rest } =
      parsed.data;
    await prisma.property.update({
      where: { id: propertyId },
      data: { ...rest, propertyType: existing.propertyType },
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
      country: true,
      propertyType: true,
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

  // Verifying a property is also the moment we hand the landlord a
  // management agreement to sign. We snapshot the country/type-aware
  // defaults onto the row so future tweaks to the defaults helper
  // don't retroactively alter terms shown to a landlord. The agreement
  // is created in SENT state in a single transaction with the status
  // bump so the owner banner appears the moment they refresh.
  //
  // Idempotency: if a non-CANCELLED agreement somehow already exists
  // (e.g. an admin verified, then exited, then re-verified), we
  // leave it alone. Re-issuing terms is a deliberate admin action,
  // not a side effect of the lifecycle button.
  const terms = defaultAgreementTerms({
    country: property.country,
    propertyType: property.propertyType,
  });
  const existingActiveAgreement = await prisma.managementAgreement.findFirst({
    where: {
      propertyId,
      status: { not: AgreementStatus.CANCELLED },
    },
    select: { id: true },
  });

  await prisma.$transaction(async (tx) => {
    await tx.property.update({
      where: { id: propertyId },
      data: { status: PropertyStatus.ACTIVE },
    });
    if (!existingActiveAgreement) {
      const now = new Date();
      await tx.managementAgreement.create({
        data: {
          propertyId,
          termMonths: terms.termMonths,
          commissionRate: terms.commissionRate,
          earlyExitFee: terms.earlyExitFee,
          earlyExitFeeCurrency: terms.earlyExitFeeCurrency,
          noticePeriodDays: terms.noticePeriodDays,
          governingLaw: terms.governingLaw,
          status: AgreementStatus.SENT,
          sentAt: now,
        },
      });
    }
  });

  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath(`/admin/owners/${property.ownerId}`);
  revalidatePath("/owner");
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
