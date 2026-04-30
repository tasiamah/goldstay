"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteDocumentAction } from "./actions";

export function DeleteDocumentButton({
  documentId,
  title,
}: {
  documentId: string;
  title: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (
      !window.confirm(
        `Delete "${title}"? This removes the file and cannot be undone.`,
      )
    ) {
      return;
    }
    startTransition(async () => {
      await deleteDocumentAction(documentId);
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className="text-xs text-stone-500 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Removing…" : "Remove"}
    </button>
  );
}
