"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { SignAgreementResult } from "./actions";

type FormAction = (
  prev: SignAgreementResult | null,
  formData: FormData,
) => Promise<SignAgreementResult>;

export function SignAgreementForm({
  action,
  ownerName,
}: {
  action: FormAction;
  ownerName: string;
}) {
  const [state, formAction] = useFormState(action, null);

  if (state?.ok) {
    return (
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-base font-medium text-emerald-900">
          Thank you — your agreement is signed
        </h2>
        <p className="mt-2 text-sm text-emerald-900/80">
          Refresh this page to download a countersigned PDF copy. We have
          also stored it in your property documents.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6">
      <h2 className="text-base font-medium text-stone-900">Sign agreement</h2>
      <p className="mt-1 text-sm text-stone-500">
        Typing your full name below has the same legal effect as a wet
        signature under the Kenya Business Laws (Amendment) Act and the
        Ghana Electronic Transactions Act 2008.
      </p>

      <form action={formAction} className="mt-5 space-y-5">
        <label className="flex items-start gap-3 text-sm text-stone-700">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 h-4 w-4 rounded border-stone-300 text-stone-900 focus:ring-stone-500"
          />
          <span>
            I have read the management agreement above and I agree to its
            terms on behalf of myself or the entity I represent.
          </span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-stone-700">
            Type your full legal name<span className="text-red-600"> *</span>
          </span>
          <input
            type="text"
            name="typedName"
            required
            placeholder={ownerName}
            autoComplete="off"
            className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 font-serif text-lg text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
          <span className="mt-1 block text-xs text-stone-500">
            We will record your name, the time of signing, and the IP
            address of this device alongside the signed copy.
          </span>
        </label>

        {state && !state.ok ? (
          <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            {state.error}
          </p>
        ) : null}

        <SubmitButton />
      </form>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
    >
      {pending ? "Signing..." : "Sign agreement"}
    </button>
  );
}
