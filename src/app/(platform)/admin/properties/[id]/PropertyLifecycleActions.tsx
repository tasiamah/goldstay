"use client";

// Lifecycle buttons for a property's status. Renders nothing for
// EXITED (terminal state). For ACTIVE, shows a Mark exited button
// behind a window.confirm.
//
// ONBOARDING offers one action, "Mark as live", gated on the client
// having accepted the property's management agreement. There is no
// button to send that agreement: it is issued the moment the property
// is created, so by the time anyone opens this page the client
// already has it waiting. While they haven't accepted, the button is
// disabled and says why.
//
// The old gate here was documentCount > 0, mirroring a server check
// that demanded a title deed or similar. Both are gone: we no longer
// ask clients to prove ownership, and any uploaded file satisfied it
// anyway, so it never verified what it claimed to.
//
// Errors and successes both flow through Sonner so the feedback
// matches the rest of the admin chrome (ArchiveButton, bulk actions,
// imports). The previous alert() popup was the only one left in the
// admin surface and broke muscle memory.

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { markPropertyExitedAction, markPropertyLiveAction } from "../actions";

type Props = {
  propertyId: string;
  status: "ONBOARDING" | "ACTIVE" | "EXITED";
  // Derived server-side from the property's agreements so the button
  // never offers an action the server will then refuse. "none" only
  // happens for properties that predate agreements being issued at
  // creation; clicking through backfills one for them.
  agreementStage: "none" | "awaiting_acceptance" | "accepted";
};

export function PropertyLifecycleActions({
  propertyId,
  status,
  agreementStage,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (status === "EXITED") return null;

  if (status === "ONBOARDING") {
    const awaiting = agreementStage === "awaiting_acceptance";
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          disabled={awaiting || pending}
          onClick={() => {
            startTransition(async () => {
              const res = await markPropertyLiveAction(propertyId);
              if (!res.ok) {
                toast.error(res.error);
                return;
              }
              toast.success(
                res.stage === "agreement_issued"
                  ? "This property had no agreement, so we've sent one. It goes live once the client accepts it."
                  : "Property is live",
              );
              router.refresh();
            });
          }}
          className="inline-flex items-center rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          {pending ? "Working…" : "Mark as live"}
        </button>
        {awaiting ? (
          <p className="max-w-xs text-right text-xs text-stone-500">
            Waiting for the client to accept their management
            agreement. It goes live as soon as they do.
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
            toast.error(res.error);
            return;
          }
          toast.success("Property marked as exited");
          router.refresh();
        });
      }}
      className="inline-flex items-center rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? "Marking…" : "Mark as exited"}
    </button>
  );
}
