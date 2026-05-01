"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ArchivableEntity } from "@/lib/admin/archive";
import { archiveAction, restoreAction } from "@/app/(platform)/admin/archive/actions";

// Generic archive trigger used on owner / property / lease /
// transaction detail pages. Triggers an optimistic toast with an
// "Undo" button that immediately calls restoreAction. We bind the
// returnPath so revalidation refreshes whatever surface the operator
// archived from.

export function ArchiveButton({
  entity,
  id,
  returnPath,
  redirectAfter,
  label = "Archive",
}: {
  entity: ArchivableEntity;
  id: string;
  returnPath: string;
  // Where to send the operator after a successful archive (usually
  // the list page for the entity). Optional — null keeps them on the
  // current page (which will now show the archived banner).
  redirectAfter?: string | null;
  label?: string;
}) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            const result = await archiveAction(entity, id, returnPath);
            toast.success(`${entity.toLowerCase()} archived`, {
              description: "Hidden from default queries.",
              duration: 8000,
              action: {
                label: "Undo",
                onClick: async () => {
                  try {
                    await restoreAction(result.entity, result.id, returnPath);
                    toast.success("Restored");
                    router.refresh();
                  } catch (err) {
                    toast.error("Undo failed", {
                      description:
                        err instanceof Error ? err.message : String(err),
                    });
                  }
                },
              },
            });
            if (redirectAfter) {
              router.push(redirectAfter);
            } else {
              router.refresh();
            }
          } catch (err) {
            toast.error("Archive failed", {
              description: err instanceof Error ? err.message : String(err),
            });
          }
        });
      }}
      className="inline-flex items-center rounded-md border border-red-300 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-900 hover:bg-red-100 disabled:opacity-60"
    >
      {pending ? "Archiving…" : label}
    </button>
  );
}
