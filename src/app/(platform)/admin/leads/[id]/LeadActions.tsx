"use client";

// Lifecycle buttons on the lead detail page. Buttons fade out as
// the status moves forward — once contacted, the "Mark contacted"
// button disappears, leaving only the next step + the loss path.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  markLeadContactedAction,
  markLeadLostAction,
  markLeadQualifiedAction,
} from "../actions";

type Props = {
  leadId: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "CONVERTED" | "LOST";
  hasContactedAt: boolean;
  hasQualifiedAt: boolean;
};

export function LeadActions({ leadId, status, hasContactedAt, hasQualifiedAt }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [showLostForm, setShowLostForm] = useState(false);
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (status === "CONVERTED" || status === "LOST") return null;

  const canMarkContacted = !hasContactedAt;
  const canMarkQualified = status !== "QUALIFIED" && !hasQualifiedAt;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {canMarkContacted ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const r = await markLeadContactedAction(leadId);
                if (!r.ok) setError(r.error);
                else router.refresh();
              });
            }}
            className="inline-flex items-center rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Mark contacted"}
          </button>
        ) : null}
        {canMarkQualified ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              setError(null);
              startTransition(async () => {
                const r = await markLeadQualifiedAction(leadId);
                if (!r.ok) setError(r.error);
                else router.refresh();
              });
            }}
            className="inline-flex items-center rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
          >
            {pending ? "Saving…" : "Mark qualified"}
          </button>
        ) : null}
        <button
          type="button"
          disabled={pending}
          onClick={() => setShowLostForm((v) => !v)}
          className="inline-flex items-center rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-60"
        >
          Mark lost
        </button>
      </div>

      {showLostForm ? (
        <form
          action={(formData) => {
            setError(null);
            startTransition(async () => {
              const r = await markLeadLostAction(leadId, null, formData);
              if (!r.ok) setError(r.error);
              else router.refresh();
            });
          }}
          className="space-y-2 rounded-md border border-stone-200 bg-stone-50 p-3"
        >
          <label className="block text-xs font-medium text-stone-700">
            Why is this lead lost?
            <input
              type="text"
              name="reason"
              required
              maxLength={200}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Out of budget, declined, no response after 3 attempts…"
              className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-1.5 text-sm text-stone-900 focus:border-stone-500 focus:outline-none"
            />
          </label>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={pending || reason.trim().length === 0}
              className="inline-flex items-center rounded-md bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-50"
            >
              {pending ? "Saving…" : "Confirm lost"}
            </button>
            <button
              type="button"
              onClick={() => setShowLostForm(false)}
              className="text-xs text-stone-500 hover:text-stone-900"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
