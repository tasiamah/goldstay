"use client";

// One slot in the owner KYC card. Renders either:
//   * an upload form (no document yet for this kind), OR
//   * a greyed-out "uploaded, pending verification from Goldstay"
//     panel with a small "replace" link.
//
// Both modes live in the same component so the card layout doesn't
// shift between states. Keeping the upload + status side-by-side
// also means an owner who wants to swap a smudged photo doesn't have
// to hunt for the file picker.

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ownerCreateKycUploadAction,
  ownerFinaliseKycUploadAction,
} from "./kyc-actions";

type SlotKind = "ID_DOCUMENT" | "PROOF_OF_PAYOUT_ACCOUNT";

const MAX_BYTES = 25 * 1024 * 1024;

export type OwnerKycSlotProps = {
  kind: SlotKind;
  title: string;
  description: string;
  existing: {
    id: string;
    uploadedAt: Date;
    sizeBytes: number | null;
  } | null;
};

export function OwnerKycSlot({
  kind,
  title,
  description,
  existing,
}: OwnerKycSlotProps) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [pending, startTransition] = useTransition();
  const [showReplace, setShowReplace] = useState(false);

  const busy = uploading || pending;
  const hasUpload = Boolean(existing);
  const showForm = !hasUpload || showReplace;

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
      const init = await ownerCreateKycUploadAction({
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

      const fin = await ownerFinaliseKycUploadAction({
        documentId: init.data.documentId,
        mimeType: file.type || undefined,
        sizeBytes: file.size,
      });
      if (!fin.ok) {
        setError("Upload finished but the record could not be saved.");
        return;
      }

      if (fileRef.current) fileRef.current.value = "";
      setShowReplace(false);
      startTransition(() => router.refresh());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-md border border-stone-200 bg-stone-50 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-medium text-stone-900">{title}</h4>
          <p className="mt-0.5 text-xs text-stone-500">{description}</p>
        </div>
        {hasUpload ? (
          <span className="inline-flex shrink-0 items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-800">
            Pending verification
          </span>
        ) : (
          <span className="inline-flex shrink-0 items-center rounded-full bg-stone-200 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-stone-600">
            Not uploaded
          </span>
        )}
      </div>

      {hasUpload ? (
        <div
          className={`mt-3 rounded-md border border-stone-200 bg-white p-3 ${
            showReplace ? "" : "opacity-60"
          }`}
          aria-disabled={!showReplace}
        >
          <p className="text-xs text-stone-700">
            Uploaded{" "}
            {existing!.uploadedAt.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
            {existing!.sizeBytes
              ? ` · ${formatBytes(existing!.sizeBytes)}`
              : ""}
            .
          </p>
          <p className="mt-1 text-xs text-stone-500">
            Pending verification from Goldstay. We&apos;ll email you as
            soon as it&apos;s reviewed, usually within one working day.
          </p>
          {!showReplace ? (
            <button
              type="button"
              onClick={() => setShowReplace(true)}
              className="mt-2 text-xs text-stone-700 underline-offset-2 hover:underline"
            >
              Replace document
            </button>
          ) : null}
        </div>
      ) : null}

      {showForm ? (
        <form onSubmit={handleSubmit} className="mt-3 space-y-3">
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf,image/*"
            required
            disabled={busy}
            className="block w-full text-sm text-stone-700 file:mr-3 file:rounded-md file:border-0 file:bg-stone-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {error ? <p className="text-xs text-red-700">{error}</p> : null}

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={busy}
              className="rounded-md bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-400"
            >
              {busy
                ? "Uploading…"
                : hasUpload
                  ? "Upload replacement"
                  : "Upload"}
            </button>
            {hasUpload && showReplace ? (
              <button
                type="button"
                onClick={() => {
                  setShowReplace(false);
                  setError(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                disabled={busy}
                className="text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
            ) : null}
            <p className="text-[11px] text-stone-500">
              PDF or image, up to 25 MB. Goldstay storage is encrypted
              and never shared outside the verification team.
            </p>
          </div>
        </form>
      ) : null}
    </div>
  );
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
