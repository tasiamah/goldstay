"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AgreementStatus,
  Country,
  PropertyStatus,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { currentAuditActor } from "@/lib/auth";
import { PropertyInput } from "@/lib/validation/schemas";
import { flattenZodErrors } from "@/lib/validation/preprocessors";
import { defaultAgreementTerms } from "@/lib/agreements/defaults";
import { recordAudit } from "@/lib/audit";
import { formatPropertyDisplayName } from "@/lib/format-property";

export type PropertyActionResult =
  | { ok: true; propertyId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function fromForm(formData: FormData) {
  return {
    clientId: String(formData.get("clientId") ?? ""),
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
    signingCapacity: String(
      formData.get("signingCapacity") ?? "REGISTERED_OWNER",
    ),
    hostawayListingId: String(formData.get("hostawayListingId") ?? ""),
  };
}

export async function createPropertyAction(
  _prev: PropertyActionResult | null,
  formData: FormData,
): Promise<PropertyActionResult> {
  const actor = await currentAuditActor();

  const parsed = PropertyInput.safeParse(fromForm(formData));
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  // Country is inherited from the client so we don't ask for it twice.
  const client = await prisma.client.findUnique({
    where: { id: parsed.data.clientId },
    select: { country: true },
  });
  if (!client) {
    return { ok: false, error: "Client not found." };
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
          country: client.country as Country,
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
    await recordAudit({
      actor,
      entity: "PROPERTY",
      entityId: created.id,
      action: "property.created",
      summary: `Property ${formatPropertyDisplayName(created.name, created.unitNumber)} created`,
      metadata: {
        clientId: created.clientId,
        country: created.country,
        propertyType: created.propertyType,
      },
    });
    revalidatePath("/admin");
    revalidatePath("/admin/properties");
    revalidatePath(`/admin/clients/${parsed.data.clientId}`);
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
  const actor = await currentAuditActor();

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

    const { clientId: _ignored, propertyType: _attempted, ...rest } =
      parsed.data;
    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: { ...rest, propertyType: existing.propertyType },
    });
    await recordAudit({
      actor,
      entity: "PROPERTY",
      entityId: propertyId,
      action: "property.updated",
      summary: `Property ${formatPropertyDisplayName(updated.name, updated.unitNumber)} updated`,
    });
    revalidatePath("/admin");
    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${propertyId}`);
    revalidatePath(`/admin/clients/${parsed.data.clientId}`);
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
  const actor = await currentAuditActor();

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      status: true,
      clientId: true,
      country: true,
      propertyType: true,
      signingCapacity: true,
      name: true,
      unitNumber: true,
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
  // bump so the client banner appears the moment they refresh.
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

  const newAgreementId = await prisma.$transaction(async (tx) => {
    await tx.property.update({
      where: { id: propertyId },
      data: { status: PropertyStatus.ACTIVE },
    });
    if (!existingActiveAgreement) {
      const now = new Date();
      const agreement = await tx.managementAgreement.create({
        data: {
          propertyId,
          termMonths: terms.termMonths,
          commissionRate: terms.commissionRate,
          earlyExitFee: terms.earlyExitFee,
          earlyExitFeeCurrency: terms.earlyExitFeeCurrency,
          noticePeriodDays: terms.noticePeriodDays,
          governingLaw: terms.governingLaw,
          // Snapshotted alongside the commercial terms: the authority
          // warranty the client signs under has to stay fixed even if
          // the property's capacity is corrected later.
          signingCapacity: property.signingCapacity,
          status: AgreementStatus.SENT,
          sentAt: now,
        },
        select: { id: true },
      });
      return agreement.id;
    }
    return null;
  });

  await recordAudit({
    actor,
    entity: "PROPERTY",
    entityId: propertyId,
    action: "property.verified",
    summary: `Property marked active`,
    metadata: {
      clientId: property.clientId,
      issuedAgreementId: newAgreementId,
    },
  });
  if (newAgreementId) {
    await recordAudit({
      actor,
      entity: "AGREEMENT",
      entityId: newAgreementId,
      action: "agreement.issued",
      summary: `Management agreement issued`,
      metadata: { propertyId },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath(`/admin/clients/${property.clientId}`);
  revalidatePath("/client");
  return { ok: true };
}

export async function markPropertyExitedAction(
  propertyId: string,
): Promise<LifecycleResult> {
  const actor = await currentAuditActor();

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { status: true, clientId: true },
  });
  if (!property) return { ok: false, error: "Property not found." };
  if (property.status === PropertyStatus.EXITED) {
    return { ok: false, error: "Property is already marked as exited." };
  }

  await prisma.property.update({
    where: { id: propertyId },
    data: { status: PropertyStatus.EXITED },
  });
  await recordAudit({
    actor,
    entity: "PROPERTY",
    entityId: propertyId,
    action: "property.exited",
    summary: `Property marked exited`,
    metadata: { clientId: property.clientId },
  });
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath(`/admin/clients/${property.clientId}`);
  return { ok: true };
}
