"use server";

// Client-side KYC document upload actions.
//
// The client uploads two pieces of paper before the first payout:
//
//   * PROOF_OF_PAYOUT_ACCOUNT — proof that the receiving account
//     belongs to them (bank letter, voided cheque, M-Pesa till
//     statement, screenshot of Wise account).
//   * ID_DOCUMENT             — proof of who they are (passport or
//     national ID).
//
// Both kinds are written to the existing Document table with the
// `clientId` foreign key set; the admin reviews them on the client
// detail page and verifies the matching payout method (which is what
// actually gates outbound transfers — see lib/payouts.ts).
//
// Two-step upload flow (mirrors the admin uploader):
//   1. server creates the Document row + signed PUT URL
//   2. browser PUTs the bytes straight to Supabase Storage
//   3. server finalises (sets mime/size, records audit)
//
// requireClient() guarantees we always attach the row to the
// caller's own client id, regardless of what the form submits.

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireClient } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { recordAudit } from "@/lib/audit";
import {
  buildClientStoragePath,
  createSignedUploadUrl,
  ensureDocumentsBucket,
  sanitiseFilename,
} from "@/lib/storage";

const ClientKycKindEnum = z.enum(["ID_DOCUMENT", "PROOF_OF_PAYOUT_ACCOUNT"]);

const InitInput = z.object({
  kind: ClientKycKindEnum,
  filename: z.string().min(1).max(200),
  mimeType: z.string().max(120).optional(),
  sizeBytes: z.number().int().positive().max(25 * 1024 * 1024).optional(),
});

const FinaliseInput = z.object({
  documentId: z.string().min(1),
  mimeType: z.string().max(120).optional(),
  sizeBytes: z.number().int().positive().max(25 * 1024 * 1024).optional(),
});

export type ClientKycUploadInit = {
  documentId: string;
  uploadUrl: string;
  storagePath: string;
};

const KIND_TITLE: Record<z.infer<typeof ClientKycKindEnum>, string> = {
  ID_DOCUMENT: "Proof of identity",
  PROOF_OF_PAYOUT_ACCOUNT: "Proof of payout-account ownership",
};

export async function clientCreateKycUploadAction(
  input: unknown,
): Promise<
  | { ok: true; data: ClientKycUploadInit }
  | { ok: false; error: string }
> {
  const { client } = await requireClient();

  const parsed = InitInput.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input",
    };
  }
  const { kind, filename, mimeType, sizeBytes } = parsed.data;

  await ensureDocumentsBucket();

  const document = await prisma.document.create({
    data: {
      clientId: client.id,
      title: KIND_TITLE[kind],
      kind,
      storagePath: "pending",
      mimeType: mimeType ?? null,
      sizeBytes: sizeBytes ?? null,
      uploadedBy: client.email,
    },
  });

  const storagePath = buildClientStoragePath({
    clientId: client.id,
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
    // Roll back so a half-baked Document row never appears in the
    // admin's KYC review queue when storage is unhappy.
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

export async function clientFinaliseKycUploadAction(
  input: unknown,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { client } = await requireClient();
  const actor = { adminId: null, email: client.email };

  const parsed = FinaliseInput.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input" };
  }
  const { documentId, mimeType, sizeBytes } = parsed.data;

  // Defence-in-depth: confirm the row really belongs to the caller
  // before touching it — the action is client-scoped but we don't
  // want a tampered documentId to update somebody else's record.
  const target = await prisma.document.findUnique({
    where: { id: documentId },
    select: { id: true, clientId: true, kind: true, title: true },
  });
  if (!target || target.clientId !== client.id) {
    return { ok: false, error: "Document not found." };
  }

  const doc = await prisma.document.update({
    where: { id: documentId },
    data: {
      mimeType: mimeType ?? undefined,
      sizeBytes: sizeBytes ?? undefined,
    },
    select: { clientId: true, title: true, kind: true },
  });

  await recordAudit({
    actor,
    entity: "CLIENT",
    entityId: client.id,
    action: "document.uploaded",
    summary: `Client uploaded "${doc.title}" (${doc.kind}) for verification`,
    metadata: { documentId, kind: doc.kind, scope: "client-self-serve" },
  });

  revalidatePath("/client/account");
  revalidatePath("/client");
  return { ok: true };
}
