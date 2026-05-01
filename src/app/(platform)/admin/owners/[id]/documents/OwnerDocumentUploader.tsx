"use client";

// Mirror of the property-document uploader, scoped to the owner.
// Same two-step flow: ask the server for a signed PUT URL, upload
// the file straight to Supabase, then finalise the row. Kinds are
// limited to genuinely owner-level documents.

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  createOwnerDocumentUploadAction,
  finaliseOwnerDocumentUploadAction,
} from "./actions";

type OwnerDocumentKindValue =
  | "ID_DOCUMENT"
  | "KYC"
  | "PROOF_OF_PAYOUT_ACCOUNT"
  | "OTHER";

const KIND_OPTIONS: { value: OwnerDocumentKindValue; label: string }[] = [
  { value: "ID_DOCUMENT", label: "ID document (passport / national ID)" },
  { value: "PROOF_OF_PAYOUT_ACCOUNT", label: "Proof of payout account" },
  { value: "KYC", label: "Other KYC" },
  { value: "OTHER", label: "Other" },
];

const MAX_BYTES = 25 * 1024 * 1024;

export function OwnerDocumentUploader({ ownerId }: { ownerId: string }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<OwnerDocumentKindValue>("ID_DOCUMENT");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);

  function reset() {
    setTitle("");
    setKind("ID_DOCUMENT");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setError("Choose a file to upload.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("File is larger than the 25 MB limit.");
      return;
    }
    if (!title.trim()) {
      setError("Give the document a title.");
      return;
    }

    setUploading(true);
    try {
      const init = await createOwnerDocumentUploadAction({
        ownerId,
        title: title.trim(),
        kind,
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

      const fin = await finaliseOwnerDocumentUploadAction({
        documentId: init.data.documentId,
        mimeType: file.type || undefined,
        sizeBytes: file.size,
      });
      if (!fin.ok) {
        setError("Upload finished but the record could not be saved.");
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

  const busy = uploading || pending;

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-stone-700">Title</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            placeholder="e.g. Passport (UK), front + back"
            className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
        </label>
        <label className="block text-sm">
          <span className="text-stone-700">Kind</span>
          <select
            value={kind}
            onChange={(e) => setKind(e.target.value as OwnerDocumentKindValue)}
            className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          >
            {KIND_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="block text-sm">
        <span className="text-stone-700">File (PDF or image, up to 25 MB)</span>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,image/*"
          required
          className="mt-1 block w-full text-sm text-stone-700 file:mr-3 file:rounded-md file:border-0 file:bg-stone-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-stone-700"
        />
      </label>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
        >
          {busy ? "Uploading…" : "Upload owner document"}
        </button>
        <p className="text-xs text-stone-500">
          Goes to encrypted storage. Visible to the owner via their
          portal once uploaded.
        </p>
      </div>
    </form>
  );
}
