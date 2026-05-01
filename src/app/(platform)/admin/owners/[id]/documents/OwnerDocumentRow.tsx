"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  deleteOwnerDocumentAction,
  getOwnerDocumentDownloadUrlAction,
} from "./actions";

export function OwnerDocumentRow({
  documentId,
  ready,
}: {
  documentId: string;
  ready: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-2">
      {ready ? (
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              const r = await getOwnerDocumentDownloadUrlAction(documentId);
              if (!r.ok) {
                setError(r.error);
                return;
              }
              window.open(r.url, "_blank", "noopener,noreferrer");
            })
          }
          className="text-xs font-medium text-stone-700 underline-offset-2 hover:text-stone-900 hover:underline disabled:opacity-50"
        >
          Download
        </button>
      ) : (
        <span className="text-xs text-stone-400">Uploading…</span>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            setError(null);
            const ok = window.confirm("Delete this document?");
            if (!ok) return;
            const r = await deleteOwnerDocumentAction(documentId);
            if (!r.ok) setError(r.error);
            else router.refresh();
          })
        }
        className="text-xs text-red-700 hover:text-red-900 disabled:opacity-50"
      >
        Delete
      </button>
      {error ? <p className="ml-2 text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
