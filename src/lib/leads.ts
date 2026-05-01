// Inbound landlord lead helper.
//
// One row per lead, written from /api/lead (the public form) and
// readable from /admin/leads. Lifecycle goes
//   NEW → CONTACTED → QUALIFIED → CONVERTED (or LOST)
// and each transition writes an AuditEvent so the timeline reads
// continuously from "lead landed at 14:02" through "owner created".
//
// The Airtable mirror inside /api/lead stays as a parallel write
// for the ops team's existing pipeline, but the row created here
// is the system of record from this point forward — that's what
// the convert-to-owner action reads back.

import { Prisma, type Lead, type LeadSource } from "@prisma/client";
import { prisma } from "@/lib/db";
import { recordAudit, type AuditActor } from "@/lib/audit";
import { createHash } from "node:crypto";

export type CreateLeadInput = {
  source: LeadSource;
  fullName: string;
  email?: string | null;
  phone: string;
  residenceCountry?: string | null;
  country?: "KE" | "GH" | null;
  city?: string | null;
  neighbourhood?: string | null;
  propertyType?: string | null;
  bedrooms?: string | null;
  furnished?: string | null;
  serviceInterest?: string | null;
  availability?: string | null;
  notes?: string | null;
  // Optional actor; the public form has no admin actor (the lead
  // creates itself). Manual logs from /admin/leads/new include one.
  actor?: AuditActor | null;
};

// Same person hitting submit twice on a flaky mobile network
// produces two POSTs within seconds. The first creates the row, the
// second collides on the `submissionHash` unique index and we
// silently return the original — no double email, no double
// Airtable row, no duplicate ops touch.
function deriveSubmissionHash(input: CreateLeadInput): string {
  const key = [
    (input.email ?? "").toLowerCase().trim(),
    input.phone.replace(/\s+/g, ""),
    (input.fullName ?? "").toLowerCase().trim(),
    input.source,
  ].join("|");
  return createHash("sha1").update(key).digest("hex").slice(0, 32);
}

export async function createLead(input: CreateLeadInput): Promise<Lead> {
  const submissionHash = deriveSubmissionHash(input);
  try {
    const lead = await prisma.lead.create({
      data: {
        source: input.source,
        fullName: input.fullName.trim(),
        email: input.email?.trim() || null,
        phone: input.phone.trim(),
        residenceCountry: input.residenceCountry?.trim() || null,
        country: input.country ?? null,
        city: input.city?.trim() || null,
        neighbourhood: input.neighbourhood?.trim() || null,
        propertyType: input.propertyType?.trim() || null,
        bedrooms: input.bedrooms?.trim() || null,
        furnished: input.furnished?.trim() || null,
        serviceInterest: input.serviceInterest?.trim() || null,
        availability: input.availability?.trim() || null,
        notes: input.notes?.trim() || null,
        submissionHash,
      },
    });
    if (input.actor) {
      await recordAudit({
        actor: input.actor,
        entity: "LEAD",
        entityId: lead.id,
        action: "lead.created",
        summary: `Lead from ${lead.fullName}`,
        metadata: { source: lead.source, country: lead.country },
      });
    }
    return lead;
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      const existing = await prisma.lead.findUnique({
        where: { submissionHash },
      });
      if (existing) return existing;
    }
    throw e;
  }
}

export type LeadTransitionResult =
  | { ok: true; lead: Lead }
  | { ok: false; error: string };

export async function markLeadContacted(
  leadId: string,
  actor: AuditActor,
): Promise<LeadTransitionResult> {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { ok: false, error: "Lead not found." };
  if (lead.status === "CONVERTED" || lead.status === "LOST") {
    return { ok: false, error: `Lead is already ${lead.status.toLowerCase()}.` };
  }
  const updated = await prisma.lead.update({
    where: { id: leadId },
    data: {
      status: "CONTACTED",
      contactedAt: lead.contactedAt ?? new Date(),
      ownerAdminId: lead.ownerAdminId ?? actor.adminId ?? null,
    },
  });
  await recordAudit({
    actor,
    entity: "LEAD",
    entityId: leadId,
    action: "lead.contacted",
    summary: "Lead marked contacted",
  });
  return { ok: true, lead: updated };
}

export async function markLeadQualified(
  leadId: string,
  actor: AuditActor,
): Promise<LeadTransitionResult> {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { ok: false, error: "Lead not found." };
  if (lead.status === "CONVERTED" || lead.status === "LOST") {
    return { ok: false, error: `Lead is already ${lead.status.toLowerCase()}.` };
  }
  const updated = await prisma.lead.update({
    where: { id: leadId },
    data: {
      status: "QUALIFIED",
      qualifiedAt: lead.qualifiedAt ?? new Date(),
      contactedAt: lead.contactedAt ?? new Date(),
      ownerAdminId: lead.ownerAdminId ?? actor.adminId ?? null,
    },
  });
  await recordAudit({
    actor,
    entity: "LEAD",
    entityId: leadId,
    action: "lead.qualified",
    summary: "Lead marked qualified",
  });
  return { ok: true, lead: updated };
}

export async function markLeadLost(
  leadId: string,
  reason: string,
  actor: AuditActor,
): Promise<LeadTransitionResult> {
  const trimmedReason = reason.trim();
  if (trimmedReason.length === 0) {
    return { ok: false, error: "A short reason is required." };
  }
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { ok: false, error: "Lead not found." };
  if (lead.status === "CONVERTED") {
    return { ok: false, error: "Lead is already converted." };
  }
  const updated = await prisma.lead.update({
    where: { id: leadId },
    data: {
      status: "LOST",
      lostAt: new Date(),
      lostReason: trimmedReason,
    },
  });
  await recordAudit({
    actor,
    entity: "LEAD",
    entityId: leadId,
    action: "lead.lost",
    summary: `Lead lost: ${trimmedReason.slice(0, 80)}`,
  });
  return { ok: true, lead: updated };
}

// Wires a converted lead to the resulting Owner row. Caller is
// responsible for actually creating the Owner; we just close out
// the lead. Idempotent: a second call against an already-CONVERTED
// row returns ok if it points at the same owner.
export async function attachOwnerToLead(
  leadId: string,
  ownerId: string,
  actor: AuditActor,
): Promise<LeadTransitionResult> {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } });
  if (!lead) return { ok: false, error: "Lead not found." };
  if (lead.status === "CONVERTED") {
    if (lead.convertedOwnerId === ownerId) {
      return { ok: true, lead };
    }
    return {
      ok: false,
      error: `Lead already converted to a different owner (${lead.convertedOwnerId}).`,
    };
  }
  const updated = await prisma.lead.update({
    where: { id: leadId },
    data: {
      status: "CONVERTED",
      convertedAt: new Date(),
      convertedOwnerId: ownerId,
      contactedAt: lead.contactedAt ?? new Date(),
      qualifiedAt: lead.qualifiedAt ?? new Date(),
    },
  });
  // Two audit rows so the timeline is clean from both sides:
  //   - On the LEAD: "lead.converted" (so the lead detail / list
  //     shows the closing event before the redirect).
  //   - On the OWNER: "lead.converted" so the owner detail page's
  //     activity timeline starts with where this owner came from.
  await recordAudit({
    actor,
    entity: "LEAD",
    entityId: leadId,
    action: "lead.converted",
    summary: `Converted to owner`,
    metadata: { ownerId, source: lead.source },
  });
  await recordAudit({
    actor,
    entity: "OWNER",
    entityId: ownerId,
    action: "lead.converted",
    summary: `Converted from lead ${lead.fullName}`,
    metadata: { leadId, source: lead.source },
  });
  return { ok: true, lead: updated };
}

// ---------- Pure helpers ----------

export const LEAD_STATUS_LABEL: Record<Lead["status"], string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  QUALIFIED: "Qualified",
  CONVERTED: "Converted",
  LOST: "Lost",
};

export const LEAD_SOURCE_LABEL: Record<LeadSource, string> = {
  WEBSITE: "Website form",
  WHATSAPP: "WhatsApp",
  EMAIL: "Email",
  REFERRAL: "Referral",
  OUTBOUND_SCRAPE: "Outbound scrape",
  OTHER: "Other",
};

// Small badge palette used by the list page. Centralised so the
// detail page and the list stay in lockstep.
export const LEAD_STATUS_CLASSES: Record<Lead["status"], string> = {
  NEW: "bg-amber-50 text-amber-900 border-amber-200",
  CONTACTED: "bg-sky-50 text-sky-900 border-sky-200",
  QUALIFIED: "bg-violet-50 text-violet-900 border-violet-200",
  CONVERTED: "bg-emerald-50 text-emerald-900 border-emerald-200",
  LOST: "bg-stone-100 text-stone-600 border-stone-200",
};
