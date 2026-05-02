"use client";

// Owner self-serve property document upload form.
//
// Mirrors the admin uploader's two-step flow (signed PUT URL,
// direct upload to Supabase Storage) so the file body never goes
// through our serverless function and we avoid the 4.5 MB Vercel
// ingress cap on owner-uploaded title deeds. Title is optional —
// for the common case of a single deed scan, the action defaults
// it from the kind label so the owner doesn't have to think.

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ownerCreatePropertyDocumentUploadAction,
  ownerFinalisePropertyDocumentUploadAction,
  type OwnerPropertyDocKind,
} from "./document-actions";

const MAX_BYTES = 25 * 1024 * 1024;

const KIND_OPTIONS: { value: OwnerPropertyDocKind; label: string }[] = [
  { value: "TITLE_DEED", label: "Title deed" },
  { value: "SALE_AGREEMENT", label: "Sale agreement" },
  { value: "LEASE", label: "Lease" },
  { value: "PHOTO", label: "Photo" },
  { value: "OTHER", label: "Other document" },
];

export function OwnerPropertyDocumentUploader({
  propertyId,
  // Optional preset so the empty-state callout above can hand the
  // owner a one-click "Upload title deed" affordance instead of a
  // generic kind picker.
  presetKind,
}: {
  propertyId: string;
  presetKind?: OwnerPropertyDocKind;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [kind, setKind] = useState<OwnerPropertyDocKind>(
    presetKind ?? "TITLE_DEED",
  );
  const [title, setTitle] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();

  const busy = uploading || pending;

  function reset() {
    setTitle("");
    setError(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const file = fileRef.current?.files?.[0];
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File is larger than the 25 MB limit.");
      return;
    }

    setUploading(true);
    try {
      const init = await ownerCreatePropertyDocumentUploadAction({
        propertyId,
        kind,
        title: title.trim() || undefined,
        filename: file.name,
        mimeType: file.type || undefined,
        sizeBytes: file.size,
      });
      if (!init.ok) {
        setError(init.error);
        return;
      }

      const put = await fetch(init.data.uploadUrl, {
        method: "PUT",
        headers: file.type ? { "content-type": file.type } : undefined,
        body: file,
      });
      if (!put.ok) {
        setError(
          `Upload failed (${put.status}). Try again or pick a smaller file.`,
        );
        return;
      }

      const fin = await ownerFinalisePropertyDocumentUploadAction({
        documentId: init.data.documentId,
        mimeType: file.type || undefined,
        sizeBytes: file.size,
      });
      if (!fin.ok) {
        setError(fin.error);
        return;
      }

      reset();
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-stone-700">Document type</span>
          <select
            value={kind}
            onChange={(e) =>
              setKind(e.target.value as OwnerPropertyDocKind)
            }
            disabled={busy}
            className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 disabled:opacity-60"
          >
            {KIND_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-stone-700">
            Title <span className="text-stone-400">(optional)</span>
          </span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            placeholder="e.g. Title deed (signed)"
            disabled={busy}
            className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500 disabled:opacity-60"
          />
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-stone-700">
          File (PDF or image, up to 25 MB)
        </span>
        <input
          ref={fileRef}
          type="file"
          accept="application/pdf,image/*"
          required
          disabled={busy}
          className="mt-1 block w-full text-sm text-stone-700 file:mr-3 file:rounded-md file:border-0 file:bg-stone-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-stone-700 disabled:opacity-60"
        />
      </label>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {busy ? "Uploading\u2026" : "Upload document"}
        </button>
        <p className="text-xs text-stone-500">
          Goldstay storage is encrypted. Goldstay will review and verify
          the document, usually within one working day.
        </p>
      </div>
    </form>
  );
}
