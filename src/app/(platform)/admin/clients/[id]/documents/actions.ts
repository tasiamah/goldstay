"use server";

// Client-scoped document upload + delete actions.
//
// Mirrors the property-document flow (see admin/properties/[id]/
// documents/actions.ts) but writes Document rows with `clientId`
// set instead of `propertyId`. Same two-step upload (create row +
// signed URL → finalise once the browser PUT succeeds) so big PDFs
// of scanned IDs don't pass through the Vercel ingress.
//
// Allowed kinds are restricted to the genuinely-client-level set:
// passport / national ID, proof of beneficiary account, KYC
// supporting docs. Property-attached kinds (TITLE_DEED, LEASE,
// etc.) are still required to land on the property surface.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { currentAuditActor, requireRole } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { recordAudit } from "@/lib/audit";
import {
  buildClientStoragePath,
  createSignedUploadUrl,
  deleteStoredObject,
  ensureDocumentsBucket,
  sanitiseFilename,
} from "@/lib/storage";

const ClientDocumentKindEnum = z.enum([
  "ID_DOCUMENT",
  "KYC",
  "PROOF_OF_PAYOUT_ACCOUNT",
  "OTHER",
]);

const InitInput = z.object({
  clientId: z.string().min(1),
  title: z.string().min(1).max(200),
  kind: ClientDocumentKindEnum,
  filename: z.string().min(1).max(200),
  mimeType: z.string().max(120).optional(),
  sizeBytes: z.number().int().positive().max(25 * 1024 * 1024).optional(),
});

export type ClientDocumentUploadInit = {
  documentId: string;
  uploadUrl: string;
  uploadToken: string;
  storagePath: string;
};

export async function createClientDocumentUploadAction(input: unknown): Promise<{
  ok: true;
  data: ClientDocumentUploadInit;
} | {
  ok: false;
  error: string;
}> {
  const admin = await requireRole("document.write");
  const parsed = InitInput.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const { clientId, title, kind, filename, mimeType, sizeBytes } = parsed.data;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true },
  });
  if (!client) return { ok: false, error: "Client not found" };

  await ensureDocumentsBucket();

  const document = await prisma.document.create({
    data: {
      clientId,
      title,
      kind,
      storagePath: "pending",
      mimeType: mimeType ?? null,
      sizeBytes: sizeBytes ?? null,
      uploadedBy: admin.email,
    },
  });

  const storagePath = buildClientStoragePath({
    clientId,
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
    // Roll back the row so a half-baked Document doesn't leak onto
    // the client's KYC list when storage is unhappy.
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

export async function finaliseClientDocumentUploadAction(input: unknown) {
  await requireRole("document.write");
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
    select: { clientId: true, title: true, kind: true },
  });
  if (!doc.clientId) {
    return { ok: false as const, error: "Document is not client-attached" };
  }
  await recordAudit({
    actor,
    entity: "CLIENT",
    entityId: doc.clientId,
    action: "document.uploaded",
    summary: `Client document "${doc.title}" (${doc.kind}) uploaded`,
    metadata: { documentId, kind: doc.kind, scope: "client" },
  });
  revalidatePath(`/admin/clients/${doc.clientId}`);
  return { ok: true as const };
}

export async function deleteClientDocumentAction(documentId: string) {
  await requireRole("document.write");
  const actor = await currentAuditActor();
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, clientId: true, storagePath: true, title: true },
  });
  if (!doc) return { ok: false as const, error: "Document not found" };
  if (!doc.clientId)
    return { ok: false as const, error: "Document is not client-attached" };

  await prisma.document.delete({ where: { id: doc.id } });
  if (doc.storagePath && doc.storagePath !== "pending") {
    await deleteStoredObject(doc.storagePath).catch(() => {
      // Orphaned storage objects can be GC'd later; the row is
      // already gone, so the user-facing surface is clean.
    });
  }
  await recordAudit({
    actor,
    entity: "CLIENT",
    entityId: doc.clientId,
    action: "document.deleted",
    summary: `Client document "${doc.title}" deleted`,
    metadata: { documentId, scope: "client" },
  });
  revalidatePath(`/admin/clients/${doc.clientId}`);
  return { ok: true as const };
}

export async function getClientDocumentDownloadUrlAction(documentId: string) {
  await requireRole("document.read");
  const doc = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, clientId: true, storagePath: true, title: true },
  });
  if (!doc) return { ok: false as const, error: "Document not found" };
  if (!doc.clientId) return { ok: false as const, error: "Wrong scope" };
  if (!doc.storagePath || doc.storagePath === "pending") {
    return { ok: false as const, error: "Upload still in progress" };
  }

  const { createSignedDownloadUrl } = await import("@/lib/storage");
  const url = await createSignedDownloadUrl(doc.storagePath, {
    downloadAs: doc.title,
  });
  return { ok: true as const, url };
}
