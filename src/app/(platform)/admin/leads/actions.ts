"use server";

// Server actions for the /admin/leads surface.
//
// All transitions go through the helper layer (lib/leads.ts) so the
// audit + side-effects stay in one place. The convert action is the
// big one: it takes a lead, creates an Owner row, and stamps the
// lead as CONVERTED in a single transactional flow. Failure at any
// step rolls back the lot — we never want a lead marked converted
// without a matching owner.

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Prisma, type LeadSource } from "@prisma/client";
import { prisma } from "@/lib/db";
import { currentAuditActor } from "@/lib/auth";
import { recordAudit } from "@/lib/audit";
import {
  attachOwnerToLead,
  createLead,
  markLeadContacted,
  markLeadLost,
  markLeadQualified,
} from "@/lib/leads";
import { LeadInput, OwnerInput } from "@/lib/validation/schemas";
import { flattenZodErrors } from "@/lib/validation/preprocessors";
import { sendOwnerWelcomeEmail } from "@/lib/owner-welcome";
import { formatOwnerDisplayName } from "@/lib/format-owner";

export type LeadActionResult =
  | { ok: true; leadId: string }
  | { ok: false; error: string };

export async function logLeadManuallyAction(
  _prev: unknown,
  formData: FormData,
): Promise<
  | { ok: true; leadId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }
> {
  const actor = await currentAuditActor();

  const parsed = LeadInput.safeParse({
    source: (formData.get("source") as string | null) ?? "WHATSAPP",
    fullName: formData.get("fullName") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    residenceCountry: formData.get("residenceCountry") ?? "",
    country: formData.get("country") || undefined,
    city: formData.get("city") ?? "",
    neighbourhood: formData.get("neighbourhood") ?? "",
    propertyType: formData.get("propertyType") ?? "",
    bedrooms: formData.get("bedrooms") ?? "",
    furnished: formData.get("furnished") ?? "",
    serviceInterest: formData.get("serviceInterest") ?? "",
    availability: formData.get("availability") ?? "",
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  try {
    const lead = await createLead({
      source: parsed.data.source as LeadSource,
      fullName: parsed.data.fullName,
      email: parsed.data.email ?? null,
      phone: parsed.data.phone,
      residenceCountry: parsed.data.residenceCountry ?? null,
      country: parsed.data.country ?? null,
      city: parsed.data.city ?? null,
      neighbourhood: parsed.data.neighbourhood ?? null,
      propertyType: parsed.data.propertyType ?? null,
      bedrooms: parsed.data.bedrooms ?? null,
      furnished: parsed.data.furnished ?? null,
      serviceInterest: parsed.data.serviceInterest ?? null,
      availability: parsed.data.availability ?? null,
      notes: parsed.data.notes ?? null,
      actor,
    });
    revalidatePath("/admin/leads");
    redirect(`/admin/leads/${lead.id}`);
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    return {
      ok: false,
      error: "Could not create the lead. Please retry.",
    };
  }
}

export async function markLeadContactedAction(
  leadId: string,
): Promise<LeadActionResult> {
  const actor = await currentAuditActor();
  const result = await markLeadContacted(leadId, actor);
  if (!result.ok) return { ok: false, error: result.error };
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true, leadId };
}

export async function markLeadQualifiedAction(
  leadId: string,
): Promise<LeadActionResult> {
  const actor = await currentAuditActor();
  const result = await markLeadQualified(leadId, actor);
  if (!result.ok) return { ok: false, error: result.error };
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true, leadId };
}

export async function markLeadLostAction(
  leadId: string,
  _prev: unknown,
  formData: FormData,
): Promise<LeadActionResult> {
  const actor = await currentAuditActor();
  const reason = String(formData.get("reason") ?? "");
  const result = await markLeadLost(leadId, reason, actor);
  if (!result.ok) return { ok: false, error: result.error };
  revalidatePath("/admin/leads");
  revalidatePath(`/admin/leads/${leadId}`);
  return { ok: true, leadId };
}

// One-shot conversion: take a lead, create the owner, mark the lead
// CONVERTED, and fire the welcome email. We do owner-create + lead-
// mark inside the same Prisma transaction so a partial failure
// rolls both back; the welcome email is best-effort outside the
// transaction (the same as createOwnerAction).
export async function convertLeadAction(
  leadId: string,
  _prev: unknown,
  formData: FormData,
): Promise<
  | { ok: true; ownerId: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string> }
> {
  const actor = await currentAuditActor();

  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { ok: false, error: "Lead not found." };
  if (lead.status === "CONVERTED" && lead.convertedOwnerId) {
    // Already converted — just route the operator there. Idempotent.
    redirect(`/admin/owners/${lead.convertedOwnerId}`);
  }

  const parsed = OwnerInput.safeParse({
    email: formData.get("email") ?? lead.email ?? "",
    fullName: formData.get("fullName") ?? lead.fullName,
    phone: formData.get("phone") ?? lead.phone ?? "",
    companyName: formData.get("companyName") ?? "",
    country: formData.get("country") ?? lead.country ?? "",
    preferredCurrency: formData.get("preferredCurrency") ?? "USD",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: flattenZodErrors(parsed.error),
    };
  }

  try {
    const owner = await prisma.$transaction(async (tx) => {
      const created = await tx.owner.create({ data: parsed.data });
      await tx.lead.update({
        where: { id: leadId },
        data: {
          status: "CONVERTED",
          convertedAt: new Date(),
          convertedOwnerId: created.id,
          contactedAt: lead.contactedAt ?? new Date(),
          qualifiedAt: lead.qualifiedAt ?? new Date(),
        },
      });
      return created;
    });

    // Two audit rows: one on the OWNER (created), one carrying the
    // conversion provenance through attachOwnerToLead's audit trail.
    await recordAudit({
      actor,
      entity: "OWNER",
      entityId: owner.id,
      action: "owner.created",
      summary: `Owner ${formatOwnerDisplayName(owner)} created from lead`,
      metadata: {
        country: owner.country,
        email: owner.email,
        fromLeadId: leadId,
      },
    });
    // Additional audit row keyed off the lead so a single attachOwnerToLead
    // call writes the canonical "lead.converted" timeline entry.
    await attachOwnerToLead(leadId, owner.id, actor);

    // Fire-and-forget welcome email (same as createOwnerAction).
    await sendOwnerWelcomeEmail({
      email: owner.email,
      fullName: owner.fullName,
      companyName: owner.companyName,
      country: owner.country,
      // Threading ownerId + actor through means the welcome email
      // shows up on the owner's CommunicationLog tab the moment the
      // operator lands on /admin/owners/<id>, attributed to them
      // rather than to the system.
      ownerId: owner.id,
      actor,
    }).catch((err) => {
      console.error("[convertLeadAction] welcome email failed", err);
    });

    revalidatePath("/admin");
    revalidatePath("/admin/leads");
    revalidatePath(`/admin/leads/${leadId}`);
    revalidatePath("/admin/owners");
    redirect(`/admin/owners/${owner.id}`);
  } catch (e) {
    if ((e as { digest?: string }).digest?.startsWith("NEXT_REDIRECT")) {
      throw e;
    }
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return {
        ok: false,
        error: "An owner with that email already exists.",
        fieldErrors: { email: "Already in use" },
      };
    }
    return { ok: false, error: "Could not convert the lead. Please retry." };
  }
}
