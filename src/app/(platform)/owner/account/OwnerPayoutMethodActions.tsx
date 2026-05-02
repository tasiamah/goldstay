"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ownerArchivePayoutMethodAction,
  ownerSetDefaultPayoutMethodAction,
} from "./actions";

export function OwnerPayoutMethodActions({
  payoutMethodId,
  isDefault,
}: {
  payoutMethodId: string;
  isDefault: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        {!isDefault ? (
          <button
            type="button"
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setError(null);
                const r = await ownerSetDefaultPayoutMethodAction(payoutMethodId);
                if (!r.ok) setError(r.error);
                else router.refresh();
              })
            }
            className="inline-flex items-center rounded-md border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
          >
            Make default
          </button>
        ) : null}
        <button
          type="button"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              const ok = window.confirm(
                "Archive this payout method? Future payouts won't land here.",
              );
              if (!ok) return;
              const r = await ownerArchivePayoutMethodAction(payoutMethodId);
              if (!r.ok) setError(r.error);
              else router.refresh();
            })
          }
          className="inline-flex items-center rounded-md border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-600 hover:bg-stone-50 disabled:opacity-50"
        >
          Archive
        </button>
      </div>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}
