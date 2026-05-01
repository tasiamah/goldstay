"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import type { ArchivableEntity } from "@/lib/admin/archive";
import { restoreAction } from "./actions";

// Restore button for the archive page. Wrapped in a useTransition so
// the button shows a "Restoring…" state instead of locking up while
// the server action runs.

export function ArchiveRow({
  entity,
  id,
  returnPath,
  restorable,
}: {
  entity: ArchivableEntity;
  id: string;
  returnPath: string;
  restorable: boolean;
}) {
  const [pending, startTransition] = useTransition();

  if (!restorable) {
    return (
      <span className="text-xs text-stone-400">
        Past 30-day restore window
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            await restoreAction(entity, id, returnPath);
            toast.success("Restored", {
              description: `${entity.toLowerCase()} restored to default queries`,
            });
          } catch (err) {
            toast.error("Restore failed", {
              description: err instanceof Error ? err.message : String(err),
            });
          }
        });
      }}
      className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900 hover:bg-emerald-100 disabled:opacity-60"
    >
      {pending ? "Restoring…" : "Restore"}
    </button>
  );
}
