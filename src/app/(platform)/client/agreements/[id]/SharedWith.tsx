"use client";

import { useState, useTransition } from "react";
import { revokeShareAction } from "./actions";

// Shows the client who their agreement has been shared with, and lets
// them close that access.
//
// Renders nothing when there are no live shares. A client who has
// never asked us to share their contract should not be shown an empty
// panel implying somebody might have been given it.

export type ClientShareRow = {
  id: string;
  recipientEmail: string;
  recipientName: string | null;
  recipientRelationship: string | null;
  expiresAt: Date;
  viewCount: number;
};

export function SharedWith({ shares }: { shares: ClientShareRow[] }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Optimistic local hide, so a withdrawn row leaves immediately
  // rather than waiting on a revalidate. The server is the authority;
  // this only affects what this render shows.
  const [hidden, setHidden] = useState<string[]>([]);

  const visible = shares.filter((s) => !hidden.includes(s.id));
  if (visible.length === 0) return null;

  function onRevoke(share: ClientShareRow) {
    const who = share.recipientName ?? share.recipientEmail;
    if (
      !confirm(
        `Withdraw ${who}'s access to this agreement? Their link stops working immediately.`,
      )
    ) {
      return;
    }
    setError(null);
    start(async () => {
      const res = await revokeShareAction(share.id);
      if (res.ok) setHidden((h) => [...h, share.id]);
      else setError(res.error);
    });
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6">
      <h2 className="text-base font-medium text-stone-900">Shared with</h2>
      <p className="mt-1 text-sm text-stone-500">
        These people can read this agreement through a read-only link.
        They cannot accept it and cannot see anything else in your
        account. Withdraw access whenever you like.
      </p>

      <ul className="mt-5 space-y-2">
        {visible.map((s) => (
          <li
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-stone-200 px-3 py-2.5 text-sm"
          >
            <div>
              <span className="font-medium text-stone-900">
                {s.recipientName ?? s.recipientEmail}
              </span>
              {s.recipientRelationship ? (
                <span className="text-stone-500">
                  {" "}
                  · {s.recipientRelationship}
                </span>
              ) : null}
              <span className="block text-xs text-stone-500">
                {s.recipientName ? `${s.recipientEmail} · ` : ""}
                access until{" "}
                {s.expiresAt.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
                {" · "}
                {s.viewCount === 0 ? "not opened yet" : "opened"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => onRevoke(s)}
              disabled={pending}
              className="text-xs font-medium text-red-700 hover:underline disabled:opacity-60"
            >
              Withdraw
            </button>
          </li>
        ))}
      </ul>

      {error ? (
        <p className="mt-3 rounded-md border border-red-200 bg-red-50 p-2.5 text-xs text-red-900">
          {error}
        </p>
      ) : null}
    </section>
  );
}
