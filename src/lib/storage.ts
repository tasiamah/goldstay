// Document storage helpers backed by Supabase Storage.
//
// All landlord documents (title deeds, sale agreements, leases,
// invoices) live in a single private bucket. Access is brokered via
// short-lived signed URLs, so neither the upload form nor the
// download link ever exposes the raw bucket key, and the browser
// never carries the service-role secret.
//
// Bucket layout: properties/<propertyId>/<docId>-<safeFilename>

import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const DOCUMENTS_BUCKET = "goldstay-documents";

const SIGNED_UPLOAD_TTL_SECONDS = 60 * 5; // 5 minutes
const SIGNED_DOWNLOAD_TTL_SECONDS = 60 * 5;

export function buildStoragePath(opts: {
  propertyId: string;
  documentId: string;
  filename: string;
}): string {
  const safe = sanitiseFilename(opts.filename);
  return `properties/${opts.propertyId}/${opts.documentId}-${safe}`;
}

export function sanitiseFilename(name: string): string {
  // Strip any leading directory components, normalise whitespace, and
  // restrict to a small ASCII set. Originals get preserved on the
  // Document.title column; this is just the on-disk key.
  const base = name.split(/[\\/]/).pop() ?? name;
  return base
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "file";
}

// Ensures the documents bucket exists. Idempotent — safe to call
// from a one-shot bootstrap script and from a defensive lazy path.
export async function ensureDocumentsBucket() {
  const admin = createSupabaseAdminClient();
  const { data: list, error: listError } = await admin.storage.listBuckets();
  if (listError) throw listError;

  if (list?.some((b) => b.name === DOCUMENTS_BUCKET)) return;

  const { error: createError } = await admin.storage.createBucket(
    DOCUMENTS_BUCKET,
    {
      public: false,
      fileSizeLimit: 25 * 1024 * 1024, // 25 MB; PDFs of scans, not video
    },
  );
  if (createError && !/already exists/i.test(createError.message)) {
    throw createError;
  }
}

// Returns a single-use upload URL the browser can PUT a file to.
// The path is fixed in advance so the server controls where the file
// lands, regardless of what the client sends.
export async function createSignedUploadUrl(path: string) {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUploadUrl(path);
  if (error) throw error;
  return {
    signedUrl: data.signedUrl,
    token: data.token,
    path: data.path,
    expiresIn: SIGNED_UPLOAD_TTL_SECONDS,
  };
}

export async function createSignedDownloadUrl(
  path: string,
  options: { downloadAs?: string } = {},
): Promise<string> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.storage
    .from(DOCUMENTS_BUCKET)
    .createSignedUrl(path, SIGNED_DOWNLOAD_TTL_SECONDS, {
      download: options.downloadAs ?? false,
    });
  if (error) throw error;
  return data.signedUrl;
}

export async function deleteStoredObject(path: string) {
  const admin = createSupabaseAdminClient();
  const { error } = await admin.storage
    .from(DOCUMENTS_BUCKET)
    .remove([path]);
  if (error) throw error;
}
