"use server";

// Owner self-serve property document upload actions.
//
// Mirrors the admin uploader's two-step flow but scoped per-owner
// instead of per-admin. The owner can upload TITLE_DEED,
// SALE_AGREEMENT, LEASE, PHOTO, OTHER for any property they own;
// every uploaded row lands as un-verified (`verifiedAt = null`) so
// admin still has the final word before it counts toward the
// property's verification status.
//
// Two-step flow:
//   1. ownerCreatePropertyDocumentUploadAction — verifies ownership,
//      creates a Document row in pending state, mints a signed PUT
//      URL the browser uploads to directly.
//   2. ownerFinalisePropertyDocumentUploadAction — stamps mime/size
//      and writes an audit row attributing the upload to the
//      landlord, not Goldstay.
//
// Delete is also self-serve, but only for documents the owner
// uploaded themselves AND that haven't been verified yet — once
// Goldstay has signed off on a title deed we don't want a single
// click to remove it from the file. Verified docs require admin
// removal, same rule the management agreement obeys.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireOwner } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { recordAudit } from "@/lib/audit";
import {
  buildStoragePath,
  createSignedUploadUrl,
  deleteStoredObject,
  ensureDocumentsBucket,
  sanitiseFilename,
} from "@/lib/storage";

// The kinds an owner can attach to one of their own properties.
// Deliberately narrower than the admin uploader: KYC/INVOICE/
// RECEIPT/STATEMENT are operationally Goldstay-side artefacts and
// MANAGEMENT_AGREEMENT is materialised by the click-to-sign flow.
const OwnerPropertyDocKindEnum = z.enum([
  "TITLE_DEED",
  "SALE_AGREEMENT",
  "LEASE",
  "PHOTO",
  "OTHER",
]);

export type OwnerPropertyDocKind = z.infer<typeof OwnerPropertyDocKindEnum>;

const KIND_DEFAULT_TITLE: Record<OwnerPropertyDocKind, string> = {
  TITLE_DEED: "Title deed",
  SALE_AGREEMENT: "Sale agreement",
  LEASE: "Lease",
  PHOTO: "Photo",
  OTHER: "Document",
};

const InitInput = z.object({
  propertyId: z.string().min(1),
  kind: OwnerPropertyDocKindEnum,
  title: z.string().trim().min(1).max(200).optional(),
  filename: z.string().min(1).max(200),
  mimeType: z.string().max(120).optional(),
  sizeBytes: z.number().int().positive().max(25 * 1024 * 1024).optional(),
});

const FinaliseInput = z.object({
  documentId: z.string().min(1),
  mimeType: z.string().max(120).optional(),
  sizeBytes: z.number().int().positive().max(25 * 1024 * 1024).optional(),
});

export type OwnerPropertyDocUploadInit = {
  documentId: string;
  uploadUrl: string;
  storagePath: string;
};

export async function ownerCreatePropertyDocumentUploadAction(
  input: unknown,
): Promise<
  | { ok: true; data: OwnerPropertyDocUploadInit }
  | { ok: false; error: string }
> {
  const { owner } = await requireOwner();
  const parsed = InitInput.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const { propertyId, kind, title, filename, mimeType, sizeBytes } =
    parsed.data;

  // Defence-in-depth ownership check. The form only submits ids the
  // owner can see, but we never trust client-supplied ids — a
  // tampered request must not be able to attach a doc to a stranger's
  // property.
  const property = await prisma.property.findFirst({
    where: { id: propertyId, ownerId: owner.id, archivedAt: null },
    select: { id: true },
  });
  if (!property) return { ok: false, error: "Property not found" };

  await ensureDocumentsBucket();

  const document = await prisma.document.create({
    data: {
      propertyId,
      title: title?.trim() || KIND_DEFAULT_TITLE[kind],
      kind,
      storagePath: "pending",
      mimeType: mimeType ?? null,
      sizeBytes: sizeBytes ?? null,
      uploadedBy: owner.email,
    },
  });

  const storagePath = buildStoragePath({
    propertyId,
    documentId: document.id,
    filename: sanitiseFilename(filename),
  });

  try {
    const signed = await createSignedUploadUrl(storagePath);
    await prisma.document.update({
      where: { id: document.id },
      data: { storagePath },
    });
    return {
      ok: true,
      data: {
        documentId: document.id,
        uploadUrl: signed.signedUrl,
        storagePath,
      },
    };
  } catch (err) {
    // Roll back so a half-baked Document row doesn't appear in the
    // admin verification queue when storage is unhappy.
    await prisma.document
      .delete({ where: { id: document.id } })
      .catch(() => {});
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to create signed upload URL",
    };
  }
}

export async function ownerFinalisePropertyDocumentUploadAction(
  input: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { owner } = await requireOwner();
  const actor = { adminId: null, email: owner.email };
  const parsed = FinaliseInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input" };
  }
  const { documentId, mimeType, sizeBytes } = parsed.data;

  // Reconfirm the row is on a property the caller owns. Prevents a
  // tampered documentId from being used to overwrite metadata on
  // somebody else's record.
  const target = await prisma.document.findUnique({
    where: { id: documentId },
    select: {
      id: true,
      title: true,
      kind: true,
      propertyId: true,
      property: { select: { ownerId: true } },
    },
  });
  if (
    !target ||
    !target.propertyId ||
    target.property?.ownerId !== owner.id
  ) {
    return { ok: false, error: "Document not found." };
  }

  await prisma.document.update({
    where: { id: documentId },
    data: {
      mimeType: mimeType ?? undefined,
      sizeBytes: sizeBytes ?? undefined,
    },
  });

  await recordAudit({
    actor,
    entity: "PROPERTY",
    entityId: target.propertyId,
    action: "document.uploaded",
    summary: `Owner uploaded "${target.title}" (${target.kind}) — pending verification`,
    metadata: {
      documentId,
      kind: target.kind,
      scope: "owner-self-serve",
    },
  });

  revalidatePath(`/owner/properties/${target.propertyId}`);
  revalidatePath("/owner");
  // Mirror to the admin surface so the verification queue picks
  // up the new pending doc on next render.
  revalidatePath(`/admin/properties/${target.propertyId}`);
  return { ok: true };
}

export async function ownerDeletePropertyDocumentAction(
  documentId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { owner } = await requireOwner();
  const actor = { adminId: null, email: owner.email };

  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    select: {
      id: true,
      title: true,
      kind: true,
      storagePath: true,
      uploadedBy: true,
      verifiedAt: true,
      propertyId: true,
      property: { select: { ownerId: true } },
    },
  });

  if (
    !doc ||
    !doc.propertyId ||
    doc.property?.ownerId !== owner.id
  ) {
    return { ok: false, error: "Document not found." };
  }

  // Owners can only remove what they themselves uploaded and only
  // before Goldstay has verified it. Anything else routes through
  // admin to avoid an accidental tap blowing away a signed lease.
  if (doc.uploadedBy !== owner.email) {
    return {
      ok: false,
      error:
        "This document was attached by Goldstay. Email support@goldstay.co.ke if you need it removed.",
    };
  }
  if (doc.verifiedAt) {
    return {
      ok: false,
      error:
        "Already verified by Goldstay. Email support@goldstay.co.ke if a change is needed.",
    };
  }

  await prisma.document.delete({ where: { id: doc.id } });
  if (doc.storagePath && doc.storagePath !== "pending") {
    await deleteStoredObject(doc.storagePath).catch(() => {
      // The DB row is already gone; an orphaned storage object can
      // be GC'd separately. Don't fail the user-facing action over
      // a transient storage hiccup.
    });
  }

  await recordAudit({
    actor,
    entity: "PROPERTY",
    entityId: doc.propertyId,
    action: "document.deleted",
    summary: `Owner removed pending "${doc.title}" (${doc.kind})`,
    metadata: { documentId, scope: "owner-self-serve" },
  });

  revalidatePath(`/owner/properties/${doc.propertyId}`);
  revalidatePath(`/admin/properties/${doc.propertyId}`);
  return { ok: true };
}
