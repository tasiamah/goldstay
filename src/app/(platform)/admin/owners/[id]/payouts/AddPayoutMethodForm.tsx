"use client";

// Inline payout-method capture form. Conditional fields render
// based on the selected `kind` so the operator only sees the
// inputs relevant to Wise / SWIFT / local bank / M-Pesa. The
// helper layer re-validates on the server, so a mis-shaped
// payload from a custom client (or stale tab) is still rejected.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { PayoutMethodKind } from "@prisma/client";
import { createPayoutMethodAction } from "./actions";

type Props = {
  ownerId: string;
  defaultCurrency: string;
};

export function AddPayoutMethodForm({ ownerId, defaultCurrency }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<PayoutMethodKind>("WISE");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50"
      >
        + Add payout method
      </button>
    );
  }

  return (
    <form
      action={(formData) => {
        setError(null);
        setFieldErrors({});
        startTransition(async () => {
          const action = createPayoutMethodAction.bind(null, ownerId);
          const r = await action(null, formData);
          if (!r.ok) {
            setError(r.error);
            setFieldErrors(r.fieldErrors ?? {});
          } else {
            setOpen(false);
            router.refresh();
          }
        });
      }}
      className="space-y-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Method"
          name="kind"
          value={kind}
          onChange={(v) => setKind(v as PayoutMethodKind)}
          options={[
            { value: "WISE", label: "Wise" },
            { value: "SWIFT_BANK", label: "International bank (SWIFT)" },
            { value: "LOCAL_BANK", label: "Local bank" },
            { value: "MPESA", label: "M-Pesa" },
          ]}
        />
        <Field
          label="Display label"
          name="label"
          required
          placeholder='e.g. "Wise USD" or "KCB Westlands"'
          error={fieldErrors.label}
        />
        <Field
          label="Currency"
          name="currency"
          required
          defaultValue={defaultCurrency}
          maxLength={3}
          error={fieldErrors.currency}
          helperText="ISO 4217: KES, GHS, USD, GBP, EUR…"
        />
        <Field
          label="Beneficiary name"
          name="beneficiaryName"
          required
          error={fieldErrors.beneficiaryName}
          helperText="Exactly as it appears on the receiving account."
        />
      </div>

      {kind === "WISE" ? (
        <Field
          label="Wise email"
          name="wiseEmail"
          type="email"
          required
          error={fieldErrors.wiseEmail}
        />
      ) : null}

      {kind === "MPESA" ? (
        <Field
          label="M-Pesa number"
          name="mpesaPhone"
          required
          placeholder="254712345678 (no leading +)"
          error={fieldErrors.mpesaPhone}
        />
      ) : null}

      {kind === "LOCAL_BANK" || kind === "SWIFT_BANK" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Bank name"
            name="bankName"
            required
            error={fieldErrors.bankName}
          />
          <Field
            label="Bank country"
            name="bankCountry"
            error={fieldErrors.bankCountry}
            helperText="ISO-2 code, e.g. KE, GH, GB, US"
          />
          <Field
            label="Account number"
            name="accountNumber"
            error={fieldErrors.accountNumber}
          />
          <Field
            label={kind === "SWIFT_BANK" ? "IBAN" : "Branch / sort code"}
            name={kind === "SWIFT_BANK" ? "iban" : "branchCode"}
            error={
              fieldErrors[kind === "SWIFT_BANK" ? "iban" : "branchCode"]
            }
          />
          {kind === "SWIFT_BANK" ? (
            <Field
              label="SWIFT / BIC"
              name="swift"
              required
              error={fieldErrors.swift}
            />
          ) : null}
          {kind === "SWIFT_BANK" ? (
            <Field
              label="Beneficiary address"
              name="beneficiaryAddress"
              error={fieldErrors.beneficiaryAddress}
              helperText="Some banks reject SWIFT wires without one."
            />
          ) : null}
        </div>
      ) : null}

      <label className="block text-sm">
        <span className="font-medium text-stone-800">
          Internal notes (admin-only)
        </span>
        <textarea
          name="internalNotes"
          rows={3}
          className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          placeholder="Why this method, who confirmed the details, anything operator-facing only."
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input type="checkbox" name="isDefault" />
        <span>Make this the default payout method</span>
      </label>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save payout method"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-sm text-stone-500 hover:text-stone-900"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  placeholder,
  helperText,
  error,
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  maxLength?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-stone-800">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        maxLength={maxLength}
        className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
      />
      {error ? (
        <p className="mt-1 text-xs text-red-700">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-stone-500">{helperText}</p>
      ) : null}
    </label>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (next: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-stone-800">{label}</span>
      <select
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
