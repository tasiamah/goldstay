"use client";

import { useEffect, useRef, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { SignAgreementResult } from "./actions";

type FormAction = (
  prev: SignAgreementResult | null,
  formData: FormData,
) => Promise<SignAgreementResult>;

// One-click acceptance.
//
// The contract is on the page above this component; the sticky bar
// opens a dialog that restates what acceptance means in three lines
// and offers a single button. No typed signature and no tick-boxes:
// clause 12.3 provides for acceptance through the platform, and
// clause 7.2 makes the act of accepting the authority confirmation, so
// extra gates would cost us completions without buying evidence. What
// matters evidentially — who, when, which version, from where — is
// captured server-side in the action.
export function SignAgreementForm({
  action,
  clientName,
  propertyDisplayName,
  agreementTitle,
  reference,
}: {
  action: FormAction;
  clientName: string;
  propertyDisplayName: string;
  agreementTitle: string;
  reference: string | null;
}) {
  const [state, formAction] = useFormState(action, null);
  const [open, setOpen] = useState(false);

  if (state?.ok) {
    return (
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-base font-medium text-emerald-900">
          Accepted. Your agreement is in force.
        </h2>
        <p className="mt-2 text-sm text-emerald-900/80">
          We have recorded your acceptance and stored a copy in your
          property documents. Refresh this page to download the executed
          PDF.
        </p>
        <p className="mt-3 text-sm text-emerald-900/80">
          Acceptance receipt{" "}
          <span className="font-mono text-xs font-medium">
            {state.acceptanceReference}
          </span>
        </p>
      </section>
    );
  }

  return (
    <>
      <section className="sticky bottom-4 rounded-lg border border-stone-900 bg-stone-900 p-5 shadow-lg sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h2 className="text-base font-medium text-white">
            Ready to get started?
          </h2>
          <p className="mt-1 text-sm text-stone-300">
            Accept the agreement and we will begin onboarding{" "}
            {propertyDisplayName}.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-white px-5 py-2.5 text-sm font-medium text-stone-900 hover:bg-stone-100 sm:mt-0 sm:w-auto sm:shrink-0"
        >
          Accept agreement
        </button>
      </section>

      {state && !state.ok ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}

      {open ? (
        <AcceptDialog
          onClose={() => setOpen(false)}
          formAction={formAction}
          clientName={clientName}
          agreementTitle={agreementTitle}
          reference={reference}
        />
      ) : null}
    </>
  );
}

function AcceptDialog({
  onClose,
  formAction,
  clientName,
  agreementTitle,
  reference,
}: {
  onClose: () => void;
  formAction: (formData: FormData) => void;
  clientName: string;
  agreementTitle: string;
  reference: string | null;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Escape to dismiss, and move focus into the panel on open so the
  // accept button is the first thing a keyboard or screen-reader user
  // lands on rather than the page behind the overlay.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/50 p-4 sm:items-center"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="accept-agreement-title"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl focus:outline-none"
      >
        <h2
          id="accept-agreement-title"
          className="font-serif text-xl text-stone-900"
        >
          Accept your agreement
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          You are accepting the {agreementTitle.toLowerCase()}
          {reference ? ` (${reference})` : ""} as{" "}
          <span className="font-medium text-stone-900">{clientName}</span>.
        </p>

        <ul className="mt-4 space-y-2 text-sm text-stone-700">
          <li className="flex gap-2">
            <Tick />
            <span>
              You have read and agree to the agreement and its schedules.
            </span>
          </li>
          <li className="flex gap-2">
            <Tick />
            <span>
              You hold the rights, consents and approvals needed to offer
              this property for short stays and to appoint GoldStay,
              whether you own it or let it on with the owner&rsquo;s
              written permission.
            </span>
          </li>
          <li className="flex gap-2">
            <Tick />
            <span>
              We will record your account, the agreement version, the time
              and your IP address as the acceptance record, and give you a
              receipt reference and a downloadable copy.
            </span>
          </li>
        </ul>

        <form action={formAction} className="mt-6">
          <AcceptButton />
        </form>

        <button
          type="button"
          onClick={onClose}
          className="mt-3 w-full rounded-md px-4 py-2 text-sm text-stone-500 hover:text-stone-900"
        >
          Not yet, let me read it again
        </button>

        <p className="mt-4 text-xs leading-5 text-stone-500">
          Accepting here has the same legal effect as a handwritten
          signature under the Kenya Business Laws (Amendment) Act and the
          Ghana Electronic Transactions Act 2008.
        </p>
      </div>
    </div>
  );
}

function AcceptButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex w-full items-center justify-center rounded-md bg-stone-900 px-4 py-3 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
    >
      {pending ? "Recording your acceptance..." : "I agree — activate my listing"}
    </button>
  );
}

function Tick() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
    >
      <path
        fillRule="evenodd"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.5 7.5a1 1 0 0 1-1.4 0L3.3 9.7a1 1 0 0 1 1.4-1.4l3.8 3.8 6.8-6.8a1 1 0 0 1 1.4 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
