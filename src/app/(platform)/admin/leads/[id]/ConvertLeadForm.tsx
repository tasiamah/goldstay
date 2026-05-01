"use client";

// Inline owner-create form on the lead detail page. Mirrors
// /admin/owners/new but pre-fills from the lead so the operator
// only has to confirm + add the country/currency. On success the
// action redirects to the new owner detail page.

import { useFormState, useFormStatus } from "react-dom";
import { convertLeadAction } from "../actions";

type Defaults = {
  fullName: string;
  email: string;
  phone: string;
  country: "KE" | "GH";
};

export function ConvertLeadForm({
  leadId,
  defaults,
}: {
  leadId: string;
  defaults: Defaults;
}) {
  const action = convertLeadAction.bind(null, leadId);
  const [state, formAction] = useFormState(action, null);
  const fieldErrors = state && !state.ok ? state.fieldErrors ?? {} : {};

  return (
    <form action={formAction} className="space-y-4">
      <Field
        label="Full name"
        name="fullName"
        defaultValue={defaults.fullName}
        required
        error={fieldErrors.fullName}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        defaultValue={defaults.email}
        required
        error={fieldErrors.email}
        helperText="The welcome email + magic sign-in link land here."
      />
      <Field
        label="Phone"
        name="phone"
        defaultValue={defaults.phone}
        error={fieldErrors.phone}
      />
      <Field
        label="Company name (optional)"
        name="companyName"
        error={fieldErrors.companyName}
        helperText="Set when the legal owner is a holding company / SPV."
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Country"
          name="country"
          defaultValue={defaults.country}
          required
          error={fieldErrors.country}
          options={[
            { value: "KE", label: "Kenya" },
            { value: "GH", label: "Ghana" },
          ]}
        />
        <Field
          label="Preferred currency"
          name="preferredCurrency"
          defaultValue="USD"
          required
          error={fieldErrors.preferredCurrency}
          helperText="Statement currency. KES, GHS, USD, GBP, EUR…"
        />
      </div>

      {state && !state.ok ? (
        <p className="text-sm text-red-700">{state.error}</p>
      ) : null}

      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const status = useFormStatus();
  return (
    <button
      type="submit"
      disabled={status.pending}
      className="inline-flex items-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:opacity-60"
    >
      {status.pending ? "Converting…" : "Create owner & send welcome email"}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  defaultValue,
  helperText,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  helperText?: string;
  error?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-stone-800">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={defaultValue}
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
  options,
  defaultValue,
  required,
  error,
}: {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  defaultValue?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-stone-800">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? <p className="mt-1 text-xs text-red-700">{error}</p> : null}
    </label>
  );
}
