"use client";

// Switching a property between long-let, short-let and tenant
// finding.
//
// Deliberately not a field on the edit form. Changing the model
// reissues the management agreement on different commercial terms,
// which is a change of contract rather than a correction to a record,
// and it needs the operator to see what moves before they commit. The
// edit form keeps its read-only display and points here.
//
// The consequences are computed server-side by the same function the
// action enforces, so this dialog cannot promise something different
// from what happens.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { PropertyType } from "@prisma/client";

import {
  PROPERTY_TYPE_FORM_LABEL,
  PROPERTY_TYPE_LABEL,
  PROPERTY_TYPE_ORDER,
} from "@/lib/property-type";
import { changeRentalModelAction } from "../actions";

type Props = {
  propertyId: string;
  current: PropertyType;
  country: "KE" | "GH";
  /** Consequence lines keyed by the model being switched to. */
  consequences: Partial<Record<PropertyType, string[]>>;
};

export function ChangeRentalModelCard({
  propertyId,
  current,
  country,
  consequences,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [choice, setChoice] = useState<PropertyType | null>(null);

  const options = PROPERTY_TYPE_ORDER.filter(
    (t) => t !== current && consequences[t] !== undefined,
  );

  // Nothing to offer: a Ghanaian property has only two models, and if
  // it is on one of them the other is the single option — so an empty
  // list here means the market genuinely has no alternative.
  if (options.length === 0) return null;

  const lines = choice ? (consequences[choice] ?? []) : [];

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5">
      <h3 className="text-sm font-medium text-stone-900">Rental model</h3>
      <p className="mt-1 text-sm text-stone-600">
        Currently <strong>{PROPERTY_TYPE_LABEL[current]}</strong>. Changing it
        reissues the management agreement on the new terms, so the client is
        asked to accept again.
      </p>

      <div className="mt-4 flex flex-wrap items-end gap-3">
        <label className="text-xs uppercase tracking-wider text-stone-500">
          Change to
          <select
            value={choice ?? ""}
            onChange={(e) =>
              setChoice((e.target.value || null) as PropertyType | null)
            }
            disabled={pending}
            className="mt-1 block rounded-md border border-stone-300 px-3 py-1.5 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          >
            <option value="">Select a model…</option>
            {options.map((t) => (
              <option key={t} value={t}>
                {PROPERTY_TYPE_FORM_LABEL[t]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {choice ? (
        <>
          <ul className="mt-4 space-y-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            {lines.map((line) => (
              <li key={line} className="flex gap-2">
                <span aria-hidden>·</span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (
                !window.confirm(
                  `Change this property to ${PROPERTY_TYPE_LABEL[choice]}? The current management agreement is cancelled and a new one is sent to the client.`,
                )
              ) {
                return;
              }
              startTransition(async () => {
                const res = await changeRentalModelAction(propertyId, choice);
                if (!res.ok) {
                  toast.error(res.error);
                  return;
                }
                toast.success(
                  `Now ${PROPERTY_TYPE_LABEL[res.to].toLowerCase()}. A new agreement has been sent to the client.`,
                );
                setChoice(null);
                router.refresh();
              });
            }}
            className="mt-4 inline-flex items-center rounded-md bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Changing…" : `Change to ${PROPERTY_TYPE_LABEL[choice]}`}
          </button>
        </>
      ) : null}

      {country === "GH" ? (
        <p className="mt-3 text-xs text-stone-500">
          Tenant finding is Kenya-only: its agreement is drafted against Kenyan
          law.
        </p>
      ) : null}
    </section>
  );
}
