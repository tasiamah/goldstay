"use client";

// Per-row controls for a property document on the owner page.
// Currently just a Remove button, surfaced only when the doc is
// owner-uploaded AND not yet verified by Goldstay (the action
// re-checks this server-side, so a stale render can never delete a
// verified row through here).

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ownerDeletePropertyDocumentAction } from "./document-actions";

export function OwnerPropertyDocumentRow({
  documentId,
  title,
}: {
  documentId: string;
  title: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          if (
            !window.confirm(
              `Remove "${title}"? You can upload a fresh copy afterwards. This is only available before Goldstay has verified it.`,
            )
          ) {
            return;
          }
          startTransition(async () => {
            setError(null);
            const r = await ownerDeletePropertyDocumentAction(documentId);
            if (!r.ok) {
              setError(r.error);
              return;
            }
            router.refresh();
          });
        }}
        className="text-xs text-stone-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Removing\u2026" : "Remove"}
      </button>
      {error ? (
        <span className="text-xs text-red-700">{error}</span>
      ) : null}
    </div>
  );
}
