"use client";

// Verify / un-verify toggle for a single property document. Mirrors
// the affordances on OwnerPayoutMethod verification: a single
// primary button when the doc is pending, and a quieter "Mark
// unverified" link when it's already been signed off.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  unverifyPropertyDocumentAction,
  verifyPropertyDocumentAction,
} from "./actions";

export function VerifyDocumentButton({
  documentId,
  verified,
}: {
  documentId: string;
  verified: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useState<boolean | null>(null);

  const isVerified = optimistic ?? verified;

  function onVerify() {
    setOptimistic(true);
    startTransition(async () => {
      const r = await verifyPropertyDocumentAction(documentId);
      if (!r.ok) {
        setOptimistic(null);
        toast.error(r.error);
        return;
      }
      toast.success("Document verified");
      router.refresh();
    });
  }

  function onUnverify() {
    if (
      !window.confirm(
        "Mark this document as unverified? The owner will see a pending badge again until you re-verify it.",
      )
    ) {
      return;
    }
    setOptimistic(false);
    startTransition(async () => {
      const r = await unverifyPropertyDocumentAction(documentId);
      if (!r.ok) {
        setOptimistic(null);
        toast.error(r.error);
        return;
      }
      toast.success("Verification removed");
      router.refresh();
    });
  }

  if (isVerified) {
    return (
      <button
        type="button"
        onClick={onUnverify}
        disabled={pending}
        className="text-xs text-stone-500 hover:text-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Mark unverified
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onVerify}
      disabled={pending}
      className="rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-stone-300"
    >
      {pending ? "Verifying\u2026" : "Verify"}
    </button>
  );
}
