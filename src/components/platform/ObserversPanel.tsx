"use client";

// The add/remove UI for statement observers, used by both the admin
// client page and the client's own Account page.
//
// One component for both because the rules and the copy should not
// drift: an operator and a landlord looking at the same list ought to
// see the same thing, and a caveat worth telling one of them is
// usually worth telling the other. The two surfaces differ only in
// which server actions they hand in and in whose voice the intro is
// written, both of which are props.

import { useState, useTransition } from "react";
import type { ObserverActionResult } from "@/lib/clients/observer-actions";

export type ObserverListRow = {
  id: string;
  email: string;
  name: string | null;
  relationship: string | null;
  unsubscribedAt: Date | string | null;
  removedAt: Date | string | null;
  lastSentAt: Date | string | null;
  sendCount: number;
};

export function ObserversPanel({
  rows,
  addAction,
  removeAction,
  audience,
  atLimit,
}: {
  rows: ObserverListRow[];
  addAction: (formData: FormData) => Promise<ObserverActionResult>;
  removeAction: (observerId: string) => Promise<ObserverActionResult>;
  // Who is looking. Only changes wording — an operator needs to know
  // this is the client's data, a client needs to know what the people
  // they add will and will not be able to see.
  audience: "admin" | "client";
  atLimit: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [result, setResult] = useState<ObserverActionResult | null>(null);

  const live = rows.filter((r) => !r.removedAt && !r.unsubscribedAt);
  const past = rows.filter((r) => r.removedAt || r.unsubscribedAt);

  return (
    <div>
      {live.length === 0 ? (
        <p className="text-sm text-stone-600">
          {audience === "client"
            ? "Nobody else is copied on your statements at the moment."
            : "Nobody else is copied on this client's statements."}
        </p>
      ) : (
        <ul className="divide-y divide-stone-100 rounded-lg border border-stone-200 bg-white">
          {live.map((row) => (
            <li
              key={row.id}
              className="flex flex-col gap-2 p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-stone-900">
                  {row.name?.trim() || row.email}
                  {row.relationship?.trim() ? (
                    <span className="ml-2 text-xs font-normal text-stone-500">
                      {row.relationship.trim()}
                    </span>
                  ) : null}
                </p>
                {row.name?.trim() ? (
                  <p className="truncate text-xs text-stone-500">{row.email}</p>
                ) : null}
                <p className="mt-0.5 text-xs text-stone-500">
                  {/* The honest answer to "are they actually getting
                      these", which is the only question anybody asks
                      about this list once it is set up. */}
                  {row.sendCount === 0
                    ? "No statement sent yet — they will get the next one."
                    : `${row.sendCount} statement${row.sendCount === 1 ? "" : "s"} sent${
                        row.lastSentAt
                          ? `, most recently ${formatDate(row.lastSentAt)}`
                          : ""
                      }`}
                </p>
              </div>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    setResult(await removeAction(row.id));
                  })
                }
                className="shrink-0 self-start rounded-md border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {atLimit ? (
        <p className="mt-5 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          This is the maximum number of people we will copy. Remove one
          before adding another.
        </p>
      ) : (
        <form
          className="mt-6 rounded-lg border border-stone-200 bg-white p-5"
          action={(formData) =>
            startTransition(async () => {
              const outcome = await addAction(formData);
              setResult(outcome);
            })
          }
        >
          <h4 className="text-sm font-medium text-stone-900">
            Copy someone else in
          </h4>
          <p className="mt-1 text-xs text-stone-500">
            They will receive the monthly statement, including the PDF. They
            will not get a Goldstay login and cannot agree to anything on the
            account.
          </p>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-medium text-stone-700">
                Email address
              </span>
              <input
                type="email"
                name="email"
                required
                autoComplete="off"
                placeholder="name@example.com"
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-stone-700">
                Name <span className="text-stone-400">(optional)</span>
              </span>
              <input
                type="text"
                name="name"
                autoComplete="off"
                placeholder="Wanjiru Kamau"
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none"
              />
            </label>
          </div>

          <label className="mt-3 block">
            <span className="text-xs font-medium text-stone-700">
              How are they involved?{" "}
              <span className="text-stone-400">(optional)</span>
            </span>
            <input
              type="text"
              name="relationship"
              autoComplete="off"
              placeholder="Co-owner, spouse, accountant…"
              className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none"
            />
            <span className="mt-1 block text-xs text-stone-500">
              Only so the list still makes sense in a year.
            </span>
          </label>

          <button
            type="submit"
            disabled={pending}
            className="mt-5 inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {pending ? "Adding…" : "Add and email them"}
          </button>
        </form>
      )}

      {result ? (
        <p
          className={`mt-4 text-sm ${
            result.ok ? "text-emerald-700" : "text-red-700"
          }`}
        >
          {result.ok ? result.message : result.error}
        </p>
      ) : null}

      {past.length > 0 ? (
        <details className="mt-6">
          <summary className="cursor-pointer text-xs font-medium uppercase tracking-wider text-stone-500">
            No longer copied ({past.length})
          </summary>
          <ul className="mt-3 space-y-2">
            {past.map((row) => (
              <li key={row.id} className="text-xs text-stone-500">
                <span className="text-stone-700">
                  {row.name?.trim() || row.email}
                </span>{" "}
                &middot;{" "}
                {row.unsubscribedAt
                  ? // Worth distinguishing. A client who removed
                    // someone can add them back; someone who opted
                    // out themselves cannot be re-added, and an
                    // operator needs to be able to explain why.
                    `asked us to stop on ${formatDate(row.unsubscribedAt)}`
                  : `removed on ${formatDate(row.removedAt!)}`}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}

function formatDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
