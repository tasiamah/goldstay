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
import {
  AGREEMENT_ISSUE_PROPERTY_SELECT,
  issueAgreementForProperty,
} from "@/lib/agreements/issue";
import { notifyClientOfAgreement } from "@/lib/agreements/notify";
import { decidePropertyGoLive } from "@/lib/properties/go-live";
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
    status: String(formData.get("status") ?? "ONBOARDING"),
    propertyType: String(formData.get("propertyType") ?? "LONG_TERM"),
    signingCapacity: String(
      formData.get("signingCapacity") ?? "REGISTERED_OWNER",
    ),
    // Schedule 1 of the short-let agreement.
    maxOccupancy: String(formData.get("maxOccupancy") ?? ""),
    startupCostsBudget: String(formData.get("startupCostsBudget") ?? ""),
    operatingReserve: String(formData.get("operatingReserve") ?? ""),
    launchedAt: String(formData.get("launchedAt") ?? ""),
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
    //
    // The management agreement is issued here too, rather than behind
    // a button, because it gates the property going live and an
    // agreement nobody remembered to send is a property that silently
    // never launches. Atomic on purpose: a property with no agreement
    // is an invalid state, not a stage.
    const issued = await prisma.$transaction(async (tx) => {
      const property = await tx.property.create({
        data: {
          ...parsed.data,
          country: client.country as Country,
          // A property that has just been created cannot have an
          // accepted agreement, so it can never legitimately start
          // life as ACTIVE. Pinning it here means the agreement gate
          // cannot be sidestepped by creating the property live.
          status: PropertyStatus.ONBOARDING,
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
      return {
        property,
        agreement: await issueAgreementForProperty(tx, property),
      };
    });
    const created = issued.property;
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
    await recordAudit({
      actor,
      entity: "AGREEMENT",
      entityId: issued.agreement.id,
      action: "agreement.issued",
      summary: `Management agreement issued`,
      metadata: { propertyId: created.id },
    });
    // Awaited rather than detached so a Resend timeout can't outlive
    // the request on Vercel. Never throws — see notifyClientOfAgreement.
    await notifyClientOfAgreement({
      agreementId: issued.agreement.id,
      reference: issued.agreement.reference,
      propertyId: created.id,
      actor,
    });
    revalidatePath("/admin");
    revalidatePath("/admin/properties");
    revalidatePath(`/admin/clients/${parsed.data.clientId}`);
    // The client now has an agreement waiting, so their dashboard and
    // notification bell are stale until this lands.
    revalidatePath("/client");
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
      select: { propertyType: true, status: true },
    });
    if (!existing) {
      return { ok: false, error: "Property not found." };
    }

    // Status is owned by the lifecycle actions below, not this form.
    // The form only submits a hidden input echoing the current value,
    // but that made the edit path a way to set ACTIVE directly and
    // skip the agreement gate entirely with one crafted POST. Pin it
    // to the stored value, exactly as we already do for propertyType.
    const {
      clientId: _ignored,
      propertyType: _attempted,
      status: _lifecycleOwned,
      ...rest
    } = parsed.data;
    const updated = await prisma.property.update({
      where: { id: propertyId },
      data: {
        ...rest,
        propertyType: existing.propertyType,
        status: existing.status,
      },
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
// are the two actions below: a human marks the property live once the
// client has accepted its management agreement, or marks it exited
// when it leaves the portfolio. Both are guarded server-side so the
// UI buttons can't be replayed to skip the rules.
// ──────────────────────────────────────────────────────────────────

export type LifecycleResult =
  | { ok: true; stage: "agreement_issued" | "went_live" | "exited" }
  | { ok: false; error: string };

export async function markPropertyLiveAction(
  propertyId: string,
): Promise<LifecycleResult> {
  const actor = await currentAuditActor();

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: {
      ...AGREEMENT_ISSUE_PROPERTY_SELECT,
      status: true,
      clientId: true,
      name: true,
      unitNumber: true,
    },
  });
  if (!property) return { ok: false, error: "Property not found." };
  if (property.status !== PropertyStatus.ONBOARDING) {
    return {
      ok: false,
      error: "Only onboarding properties can be marked as live.",
    };
  }

  // The document check that used to live here is gone. It required
  // "at least one document (title deed, sale agreement, lease)"
  // before a property could be verified, which is the same
  // prove-you-own-it demand we removed from the client portal — and
  // it was satisfiable by uploading any file at all, so it was never
  // really checking ownership.
  //
  // What gates the property now is the client's acceptance of the
  // management agreement, which is where authority to let is
  // actually recorded.
  const agreements = await prisma.managementAgreement.findMany({
    where: { propertyId, status: { not: AgreementStatus.CANCELLED } },
    select: { status: true },
  });

  const decision = decidePropertyGoLive({
    agreementStatuses: agreements.map((a) => a.status),
  });

  if (decision.kind === "blocked") {
    return { ok: false, error: decision.reason };
  }

  // Recovery path, not a workflow step. Properties created from here
  // on get their agreement at creation, so only ones predating that
  // arrive with none — and they would otherwise be permanently
  // unlaunchable, since launching needs an acceptance and there is
  // nothing to accept. Issue one and stop.
  if (decision.kind === "issue_agreement") {
    const agreement = await prisma.$transaction((tx) =>
      issueAgreementForProperty(tx, property),
    );
    await recordAudit({
      actor,
      entity: "AGREEMENT",
      entityId: agreement.id,
      action: "agreement.issued",
      summary: `Management agreement issued`,
      metadata: { propertyId, reason: "backfill-on-launch" },
    });
    await notifyClientOfAgreement({
      agreementId: agreement.id,
      reference: agreement.reference,
      propertyId,
      actor,
    });
    revalidateAfterLifecycle(propertyId, property.clientId);
    return { ok: true, stage: "agreement_issued" };
  }

  // The client has accepted. Now it can go live.
  await prisma.property.update({
    where: { id: propertyId },
    data: { status: PropertyStatus.ACTIVE },
  });
  await recordAudit({
    actor,
    entity: "PROPERTY",
    entityId: propertyId,
    action: "property.verified",
    summary: `Property marked active`,
    metadata: { clientId: property.clientId },
  });
  revalidateAfterLifecycle(propertyId, property.clientId);
  return { ok: true, stage: "went_live" };
}

function revalidateAfterLifecycle(propertyId: string, clientId: string): void {
  revalidatePath("/admin");
  revalidatePath("/admin/properties");
  revalidatePath(`/admin/properties/${propertyId}`);
  revalidatePath(`/admin/clients/${clientId}`);
  revalidatePath("/client");
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
  revalidateAfterLifecycle(propertyId, property.clientId);
  return { ok: true, stage: "exited" };
}
