"use client";

// The handbook form, rendered from HANDBOOK_FIELDS so the client and
// admin copies cannot drift. The differing half — who is recorded as
// the author, and what gets revalidated afterwards — is in the action
// passed in, which is a server action bound by whichever page is
// rendering this.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  HANDBOOK_FIELDS,
  type HandbookActionResult,
  type HandbookValues,
} from "@/lib/properties/handbook";

export function PropertyHandbookForm({
  values,
  action,
  // Ops sees a slightly different framing: they are recording what a
  // client told them on a call, not answering about their own flat.
  audience,
}: {
  values: HandbookValues;
  action: (formData: FormData) => Promise<HandbookActionResult>;
  audience: "client" | "admin";
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);

  return (
    <form
      action={(formData) => {
        setError(null);
        setFieldErrors({});
        setSaved(false);
        startTransition(async () => {
          const r = await action(formData);
          if (!r.ok) {
            setError(r.error);
            setFieldErrors(r.fieldErrors ?? {});
          } else {
            setSaved(true);
            router.refresh();
          }
        });
      }}
      className="mt-5 space-y-5"
    >
      {HANDBOOK_FIELDS.map((f) => {
        const fieldError = fieldErrors[f.name];
        return (
          <div key={f.name}>
            <label
              htmlFor={`handbook-${f.name}`}
              className="block text-sm font-medium text-stone-900"
            >
              {f.label}
              {f.essential ? (
                <span className="ml-2 rounded bg-stone-100 px-1.5 py-0.5 text-[0.65rem] font-normal uppercase tracking-wider text-stone-500">
                  Essential
                </span>
              ) : null}
            </label>
            <p className="mt-1 text-xs text-stone-500">{f.hint}</p>
            {f.kind === "line" ? (
              <input
                id={`handbook-${f.name}`}
                name={f.name}
                type="text"
                defaultValue={values[f.name] ?? ""}
                maxLength={f.maxLength}
                className="mt-2 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none"
              />
            ) : (
              <textarea
                id={`handbook-${f.name}`}
                name={f.name}
                rows={3}
                defaultValue={values[f.name] ?? ""}
                maxLength={f.maxLength}
                className="mt-2 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none"
              />
            )}
            {fieldError ? (
              <p className="mt-1 text-xs text-red-700">{fieldError}</p>
            ) : null}
          </div>
        );
      })}

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save handbook"}
        </button>
        {saved ? (
          <p className="text-sm text-emerald-700">
            {audience === "client"
              ? "Saved. Our operations team can see this straight away."
              : "Saved."}
          </p>
        ) : null}
      </div>
    </form>
  );
}
