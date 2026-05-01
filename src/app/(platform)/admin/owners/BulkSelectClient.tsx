"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { bulkArchiveOwnersAction } from "./bulk-actions";

// Sticky bottom bar shown when one or more owner rows are selected.
// Reads checkbox state from the surrounding <form id="owners-form">
// rather than hoisting selection state into a context — server-
// rendered tables play nicest with native checkbox name="ids".

export function BulkActionBar({ formId }: { formId: string }) {
  const [count, setCount] = useState(0);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    if (!form) return;
    const handler = () => {
      const checked = form.querySelectorAll<HTMLInputElement>(
        'input[name="ids"]:checked',
      ).length;
      setCount(checked);
    };
    form.addEventListener("change", handler);
    handler();
    return () => form.removeEventListener("change", handler);
  }, [formId]);

  if (count === 0) return null;

  return (
    <div className="sticky bottom-4 z-20 mx-auto flex w-fit items-center gap-3 rounded-full border border-stone-300 bg-stone-900 px-4 py-2 text-sm text-white shadow-lg">
      <span>{count} selected</span>
      <button
        type="button"
        disabled={pending}
        onClick={() => {
          const form = document.getElementById(
            formId,
          ) as HTMLFormElement | null;
          if (!form) return;
          const fd = new FormData(form);
          startTransition(async () => {
            try {
              const res = await bulkArchiveOwnersAction(fd);
              toast.success(`${res.archived} archived`, {
                description:
                  res.failed > 0
                    ? `${res.failed} failed — see logs.`
                    : "Hidden from default queries.",
              });
              router.refresh();
            } catch (err) {
              toast.error("Bulk archive failed", {
                description: err instanceof Error ? err.message : String(err),
              });
            }
          });
        }}
        className="rounded-full bg-red-600 px-3 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-60"
      >
        {pending ? "Archiving…" : "Archive selected"}
      </button>
    </div>
  );
}
