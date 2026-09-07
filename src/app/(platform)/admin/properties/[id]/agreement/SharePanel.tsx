"use client";

import { useState, useTransition } from "react";
import {
  revokeAgreementShareAction,
  shareAgreementAction,
} from "./actions";

// Operator control for sharing one agreement read-only with somebody
// who is not the client. In practice the client's advocate.
//
// Matches the house style of ReissueButton: inline, no modal, no
// toast library. Feedback is a line of text under the form, because
// the two outcomes that matter (shared and emailed, versus shared but
// the email failed) need different next moves from the operator and a
// disappearing toast is the wrong place to say so.

export type ShareRow = {
  id: string;
  recipientEmail: string;
  recipientName: string | null;
  recipientRelationship: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  createdByEmail: string | null;
  firstViewedAt: Date | null;
  lastViewedAt: Date | null;
  viewCount: number;
  createdAt: Date;
};

export function SharePanel({
  agreementId,
  shares,
}: {
  agreementId: string;
  shares: ShareRow[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();
  const [feedback, setFeedback] = useState<
    { tone: "ok" | "error"; text: string } | null
  >(null);

  const live = shares.filter(
    (s) => !s.revokedAt && s.expiresAt.getTime() > Date.now(),
  );
  const past = shares.filter((s) => !live.includes(s));

  function onSubmit(formData: FormData) {
    setFeedback(null);
    start(async () => {
      const res = await shareAgreementAction(agreementId, formData);
      if (res.ok) {
        setFeedback({ tone: "ok", text: res.message });
        setOpen(false);
      } else {
        setFeedback({ tone: "error", text: res.error });
      }
    });
  }

  function onRevoke(id: string, email: string) {
    if (
      !confirm(
        `Withdraw ${email}'s access to this agreement? Their link stops working immediately.`,
      )
    ) {
      return;
    }
    setFeedback(null);
    start(async () => {
      const res = await revokeAgreementShareAction(id);
      setFeedback(
        res.ok
          ? { tone: "ok", text: res.message }
          : { tone: "error", text: res.error },
      );
    });
  }

  return (
    <div className="rounded-md border border-stone-200 bg-stone-50/60 p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h4 className="text-sm font-medium text-stone-900">
            Shared for review
          </h4>
          <p className="mt-1 max-w-prose text-xs text-stone-500">
            Gives a third party — usually the client&rsquo;s advocate — a
            read-only copy of this agreement. The link reaches this one
            document, cannot accept it, and can be withdrawn at any
            time. Never share the client&rsquo;s own sign-in email with
            anyone else: it signs the holder in as them.
          </p>
        </div>
        {!open ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center rounded-md border border-stone-300 px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-white"
          >
            Share for review
          </button>
        ) : null}
      </div>

      {open ? (
        <form action={onSubmit} className="mt-4 space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="block sm:col-span-2">
              <span className="block text-xs font-medium text-stone-700">
                Email
              </span>
              <input
                name="email"
                type="email"
                required
                placeholder="advocate@example.com"
                className="mt-1 w-full rounded-md border border-stone-300 px-2.5 py-1.5 text-sm"
              />
            </label>
            <label className="block">
              <span className="block text-xs font-medium text-stone-700">
                Relationship
              </span>
              <input
                name="relationship"
                type="text"
                placeholder="Advocate"
                className="mt-1 w-full rounded-md border border-stone-300 px-2.5 py-1.5 text-sm"
              />
            </label>
          </div>
          <label className="block">
            <span className="block text-xs font-medium text-stone-700">
              Name <span className="text-stone-400">(optional)</span>
            </span>
            <input
              name="name"
              type="text"
              placeholder="Their name, so the email and page address them properly"
              className="mt-1 w-full rounded-md border border-stone-300 px-2.5 py-1.5 text-sm"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center rounded-md bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-60"
            >
              {pending ? "Sharing..." : "Share and email"}
            </button>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setFeedback(null);
              }}
              className="text-xs text-stone-500 hover:text-stone-900"
            >
              Cancel
            </button>
          </div>
          <p className="text-xs text-stone-500">
            The client is copied on the email, so they can see the share
            happened.
          </p>
        </form>
      ) : null}

      {feedback ? (
        <p
          className={`mt-3 rounded-md border p-2.5 text-xs ${
            feedback.tone === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          }`}
        >
          {feedback.text}
        </p>
      ) : null}

      {live.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {live.map((s) => (
            <li
              key={s.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-stone-200 bg-white px-3 py-2 text-xs"
            >
              <div>
                <span className="font-medium text-stone-900">
                  {s.recipientName
                    ? `${s.recipientName} · ${s.recipientEmail}`
                    : s.recipientEmail}
                </span>
                {s.recipientRelationship ? (
                  <span className="text-stone-500">
                    {" "}
                    ({s.recipientRelationship})
                  </span>
                ) : null}
                <span className="block text-stone-500">
                  Until{" "}
                  {s.expiresAt.toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  {" · "}
                  {s.viewCount === 0
                    ? "not opened yet"
                    : `opened ${s.viewCount === 1 ? "once" : `${s.viewCount} times`}${
                        s.lastViewedAt
                          ? `, last ${s.lastViewedAt.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })}`
                          : ""
                      }`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onRevoke(s.id, s.recipientEmail)}
                disabled={pending}
                className="text-xs font-medium text-red-700 hover:underline disabled:opacity-60"
              >
                Withdraw
              </button>
            </li>
          ))}
        </ul>
      ) : shares.length === 0 ? (
        <p className="mt-4 text-xs text-stone-500">
          Not shared with anyone.
        </p>
      ) : null}

      {/* Expired and withdrawn shares stay visible. Who had sight of a
          client's contract, and when, is the kind of thing worth being
          able to answer later. */}
      {past.length > 0 ? (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-stone-500 hover:text-stone-900">
            {past.length} closed {past.length === 1 ? "share" : "shares"}
          </summary>
          <ul className="mt-2 space-y-1">
            {past.map((s) => (
              <li key={s.id} className="text-xs text-stone-500">
                {s.recipientEmail} ·{" "}
                {s.revokedAt
                  ? `withdrawn ${s.revokedAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`
                  : `expired ${s.expiresAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`}
                {" · "}
                {s.viewCount === 0
                  ? "never opened"
                  : `opened ${s.viewCount === 1 ? "once" : `${s.viewCount} times`}`}
              </li>
            ))}
          </ul>
        </details>
      ) : null}
    </div>
  );
}
