"use client";

// Add/remove UI for property co-owners.
//
// Uses useTransition rather than a form action so the result message
// from the server can be shown in place — the refusals this can
// return ("create them as a client first", "their record is
// archived") are the useful part, and a form that silently did
// nothing would send the operator looking for a bug.

import { useState, useTransition } from "react";

type Row = {
  id: string;
  relationship: string | null;
  addedByEmail: string | null;
  createdAt: Date;
  client: { fullName: string; email: string };
};

type Result = { ok: true; message: string } | { ok: false; error: string };

export function CoOwnersPanel({
  rows,
  ownerOfRecord,
  addAction,
  removeAction,
}: {
  rows: Row[];
  ownerOfRecord: string;
  addAction: (formData: FormData) => Promise<Result>;
  removeAction: (coOwnerId: string) => Promise<Result>;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<Result | null>(null);

  function onAdd(formData: FormData) {
    setResult(null);
    startTransition(async () => setResult(await addAction(formData)));
  }

  function onRemove(id: string, name: string) {
    if (
      !window.confirm(
        `Remove ${name} as a co-owner? They will no longer see this unit in their portal.`,
      )
    ) {
      return;
    }
    setResult(null);
    startTransition(async () => setResult(await removeAction(id)));
  }

  return (
    <div>
      {rows.length === 0 ? (
        <p className="text-sm text-stone-500">
          No co-owners. {ownerOfRecord} is the only person who can see this
          unit.
        </p>
      ) : (
        <ul className="divide-y divide-stone-100">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex items-start justify-between gap-3 py-3"
            >
              <div>
                <p className="text-sm font-medium text-stone-900">
                  {r.client.fullName}
                  {r.relationship ? (
                    <span className="font-normal text-stone-500">
                      {" "}
                      · {r.relationship}
                    </span>
                  ) : null}
                </p>
                <p className="text-xs text-stone-500">{r.client.email}</p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() => onRemove(r.id, r.client.fullName)}
                className="text-xs text-stone-500 underline underline-offset-2 hover:text-red-700 disabled:opacity-50"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      <form action={onAdd} className="mt-5 space-y-3 border-t border-stone-100 pt-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-medium text-stone-700">
              Their Goldstay email
            </span>
            <input
              name="email"
              type="email"
              required
              placeholder="co-owner@example.com"
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-stone-700">
              Relationship <span className="text-stone-400">(optional)</span>
            </span>
            <input
              name="relationship"
              type="text"
              placeholder="mother, business partner"
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {pending ? "Saving…" : "Add co-owner"}
        </button>
      </form>

      {result ? (
        <p
          className={`mt-3 text-sm ${
            result.ok ? "text-green-700" : "text-red-700"
          }`}
        >
          {result.ok ? result.message : result.error}
        </p>
      ) : null}
    </div>
  );
}
