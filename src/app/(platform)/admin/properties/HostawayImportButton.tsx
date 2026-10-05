"use client";

import { useFormState, useFormStatus } from "react-dom";

import type { HostawayImportResult } from "./hostaway-actions";

export function HostawayImportButton({
  action,
  disabled,
  disabledReason,
}: {
  action: (
    prev: HostawayImportResult | null,
    formData: FormData,
  ) => Promise<HostawayImportResult>;
  disabled?: boolean;
  disabledReason?: string;
}) {
  const [state, formAction] = useFormState(action, null);

  if (disabled) {
    return (
      <p className="mt-3 text-xs text-stone-500">{disabledReason}</p>
    );
  }

  return (
    <form action={formAction} className="mt-3">
      <ImportButton />
      {state && !state.ok ? (
        <p className="mt-2 text-xs text-red-700">{state.error}</p>
      ) : null}
      {state && state.ok ? (
        <p className="mt-2 text-xs text-emerald-700">{state.message}</p>
      ) : null}
    </form>
  );
}

function ImportButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50"
    >
      {pending ? "Importing…" : "Import from Hostaway"}
    </button>
  );
}
