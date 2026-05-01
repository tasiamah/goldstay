"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import {
  archivePayoutMethodAction,
  setDefaultPayoutMethodAction,
  verifyPayoutMethodAction,
} from "./actions";

export function PayoutMethodActions({
  ownerId,
  payoutMethodId,
  isVerified,
  isDefault,
}: {
  ownerId: string;
  payoutMethodId: string;
  isVerified: boolean;
  isDefault: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex flex-wrap items-center gap-2">
        {!isVerified ? (
          <ActionButton
            label="Verify"
            primary
            disabled={pending}
            onClick={() =>
              startTransition(async () => {
                setError(null);
                const r = await verifyPayoutMethodAction(ownerId, payoutMethodId);
                if (!r.ok) setError(r.error);
                else router.refresh();
              })
            }
          />
        ) : null}
        {!isDefault ? (
          <ActionButton
            label="Make default"
            disabled={pending || !isVerified}
            title={
              isVerified
                ? undefined
                : "Verify the method before promoting it to default."
            }
            onClick={() =>
              startTransition(async () => {
                setError(null);
                const r = await setDefaultPayoutMethodAction(
                  ownerId,
                  payoutMethodId,
                );
                if (!r.ok) setError(r.error);
                else router.refresh();
              })
            }
          />
        ) : null}
        <ActionButton
          label="Archive"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              setError(null);
              const ok = window.confirm(
                "Archive this payout method? It can no longer receive payouts.",
              );
              if (!ok) return;
              const r = await archivePayoutMethodAction(ownerId, payoutMethodId);
              if (!r.ok) setError(r.error);
              else router.refresh();
            })
          }
        />
      </div>
      {error ? <p className="text-xs text-red-700">{error}</p> : null}
    </div>
  );
}

function ActionButton({
  label,
  onClick,
  disabled,
  primary,
  title,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={
        primary
          ? "inline-flex items-center rounded-md bg-stone-900 px-3 py-1 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          : "inline-flex items-center rounded-md border border-stone-300 bg-white px-3 py-1 text-xs font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
      }
    >
      {label}
    </button>
  );
}
