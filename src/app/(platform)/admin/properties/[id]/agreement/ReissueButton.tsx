"use client";

import { useTransition } from "react";
import { reissueAgreementAction } from "./actions";

// Confirm-then-fire button for issuing a fresh management agreement.
// Used when a previously-sent agreement needs new terms (e.g. we
// updated the early-exit floor and want the landlord to re-sign).
//
// Intentionally minimal: a single confirmation prompt, no modal,
// no toasts. The page revalidates after the action so the new
// agreement card appears on next render.
export function ReissueAgreementButton({
  propertyId,
  hasOpenAgreement,
}: {
  propertyId: string;
  hasOpenAgreement: boolean;
}) {
  const [pending, start] = useTransition();

  function onClick() {
    const message = hasOpenAgreement
      ? "Cancel the current agreement and issue a new one with today's terms?"
      : "Issue a new management agreement to the landlord with today's terms?";
    if (!confirm(message)) return;
    start(async () => {
      const res = await reissueAgreementAction(propertyId);
      if (!res.ok) alert(res.error);
    });
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className="inline-flex items-center rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-60"
    >
      {pending
        ? "Working..."
        : hasOpenAgreement
          ? "Cancel and reissue"
          : "Reissue agreement"}
    </button>
  );
}
