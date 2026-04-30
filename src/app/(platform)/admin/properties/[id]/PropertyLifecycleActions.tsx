"use client";

// Lifecycle buttons for a property's status. Renders nothing for
// EXITED (terminal state). For ONBOARDING, shows Mark verified —
// disabled with a tooltip when no documents have been uploaded yet,
// because the server-side check will refuse the call anyway and we'd
// rather tell the admin upfront. For ACTIVE, shows a Mark exited
// button behind a window.confirm.

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  markPropertyExitedAction,
  markPropertyVerifiedAction,
} from "../actions";

type Props = {
  propertyId: string;
  status: "ONBOARDING" | "ACTIVE" | "EXITED";
  documentCount: number;
};

export function PropertyLifecycleActions({
  propertyId,
  status,
  documentCount,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (status === "EXITED") return null;

  if (status === "ONBOARDING") {
    const canVerify = documentCount > 0;
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          disabled={!canVerify || pending}
          onClick={() => {
            startTransition(async () => {
              const res = await markPropertyVerifiedAction(propertyId);
              if (!res.ok) {
                alert(res.error);
                return;
              }
              router.refresh();
            });
          }}
          className="inline-flex items-center rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {pending ? "Marking…" : "Mark as verified"}
        </button>
        {!canVerify ? (
          <p className="text-xs text-stone-500">
            Upload at least one document first.
          </p>
        ) : null}
      </div>
    );
  }

  // ACTIVE
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (
          !window.confirm(
            "Mark this property as exited? It will stop appearing as active in the portfolio. You can't undo this from the UI.",
          )
        ) {
          return;
        }
        startTransition(async () => {
          const res = await markPropertyExitedAction(propertyId);
          if (!res.ok) {
            alert(res.error);
            return;
          }
          router.refresh();
        });
      }}
      className="inline-flex items-center rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Marking…" : "Mark as exited"}
    </button>
  );
}
