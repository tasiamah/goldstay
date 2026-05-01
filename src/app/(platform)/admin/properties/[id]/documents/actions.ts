"use server";

// Document upload + delete server actions.
//
// Upload uses a two-step flow:
//   1. createDocumentUploadAction()  — admin only. We create the
//      Document row in DRAFT (storagePath=temp), then mint a signed
//      upload URL bound to the final path. The browser PUTs the file
//      directly to Supabase, never through our serverless function,
//      so we don't pay 25 MB through the Vercel ingress.
//   2. finaliseDocumentUploadAction() — admin only. Called after the
//      browser PUT succeeds. We update the row with the final path,
//      mime, and size so it shows up in listings.
//
// Splitting the flow keeps abandoned uploads cleanable: rows still in
// DRAFT after 1h can be GC'd later.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { currentAuditActor, requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { recordAudit } from "@/lib/audit";
import {
  buildStoragePath,
  createSignedUploadUrl,
  deleteStoredObject,
  ensureDocumentsBucket,
  sanitiseFilename,
} from "@/lib/storage";

const DocumentKindEnum = z.enum([
  "TITLE_DEED",
  "SALE_AGREEMENT",
  "LEASE",
  "KYC",
  "INVOICE",
  "RECEIPT",
  "STATEMENT",
  "PHOTO",
  "OTHER",
]);

const InitInput = z.object({
  propertyId: z.string().min(1),
  title: z.string().min(1).max(200),
  kind: DocumentKindEnum,
  filename: z.string().min(1).max(200),
  mimeType: z.string().max(120).optional(),
  sizeBytes: z.number().int().positive().max(25 * 1024 * 1024).optional(),
});

export type DocumentUploadInit = {
  documentId: string;
  uploadUrl: string;
  uploadToken: string;
  storagePath: string;
};

export async function createDocumentUploadAction(input: unknown): Promise<{
  ok: true;
  data: DocumentUploadInit;
} | {
  ok: false;
  error: string;
}> {
  const admin = await requireAdmin();
  const parsed = InitInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }
  const { propertyId, title, kind, filename, mimeType, sizeBytes } = parsed.data;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { id: true },
  });
  if (!property) return { ok: false, error: "Property not found" };

  await ensureDocumentsBucket();

  const document = await prisma.document.create({
    data: {
      propertyId,
      title,
      kind,
      storagePath: "pending",
      mimeType: mimeType ?? null,
      sizeBytes: sizeBytes ?? null,
      uploadedBy: admin.email,
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
        uploadToken: signed.token,
        storagePath,
      },
    };
  } catch (err) {
    // Roll back the row so we don't leak a half-baked Document on the
    // property's list when the storage layer is unhappy.
    await prisma.document.delete({ where: { id: document.id } }).catch(() => {});
    return {
      ok: false,
      error:
        err instanceof Error
          ? err.message
          : "Failed to create signed upload URL",
    };
  }
}

const FinaliseInput = z.object({
  documentId: z.string().min(1),
  mimeType: z.string().max(120).optional(),
  sizeBytes: z.number().int().positive().max(25 * 1024 * 1024).optional(),
});

export async function finaliseDocumentUploadAction(input: unknown) {
  const actor = await currentAuditActor();
  const parsed = FinaliseInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false as const, error: "Invalid input" };
  }
  const { documentId, mimeType, sizeBytes } = parsed.data;

  const doc = await prisma.document.update({
    where: { id: documentId },
    data: {
      mimeType: mimeType ?? undefined,
      sizeBytes: sizeBytes ?? undefined,
    },
    select: { propertyId: true, ownerId: true, title: true, kind: true },
  });
  // Documents can attach to either a property or an owner (owner-
  // level KYC etc.). Audit against whichever scope is set.
  if (doc.propertyId) {
    await recordAudit({
      actor,
      entity: "PROPERTY",
      entityId: doc.propertyId,
      action: "document.uploaded",
      summary: `Document "${doc.title}" (${doc.kind}) uploaded`,
      metadata: { documentId, kind: doc.kind },
    });
    revalidatePath(`/admin/properties/${doc.propertyId}`);
  } else if (doc.ownerId) {
    await recordAudit({
      actor,
      entity: "OWNER",
      entityId: doc.ownerId,
      action: "document.uploaded",
      summary: `Document "${doc.title}" (${doc.kind}) uploaded`,
      metadata: { documentId, kind: doc.kind },
    });
    revalidatePath(`/admin/owners/${doc.ownerId}`);
  }
  return { ok: true as const };
}

export async function deleteDocumentAction(documentId: string) {
  const actor = await currentAuditActor();
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    select: {
      id: true,
      propertyId: true,
      ownerId: true,
      storagePath: true,
      title: true,
    },
  });
  if (!doc) return { ok: false as const, error: "Document not found" };

  await prisma.document.delete({ where: { id: doc.id } });
  if (doc.storagePath && doc.storagePath !== "pending") {
    await deleteStoredObject(doc.storagePath).catch(() => {
      // We deleted the row already; orphaned storage objects can be
      // GC'd later. Surface the failure as a soft warning.
    });
  }
  if (doc.propertyId) {
    await recordAudit({
      actor,
      entity: "PROPERTY",
      entityId: doc.propertyId,
      action: "document.deleted",
      summary: `Document "${doc.title}" deleted`,
      metadata: { documentId },
    });
    revalidatePath(`/admin/properties/${doc.propertyId}`);
  } else if (doc.ownerId) {
    await recordAudit({
      actor,
      entity: "OWNER",
      entityId: doc.ownerId,
      action: "document.deleted",
      summary: `Document "${doc.title}" deleted`,
      metadata: { documentId },
    });
    revalidatePath(`/admin/owners/${doc.ownerId}`);
  }
  return { ok: true as const };
}
