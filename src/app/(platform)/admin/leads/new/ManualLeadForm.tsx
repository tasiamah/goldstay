"use client";

import { useFormState, useFormStatus } from "react-dom";
import { logLeadManuallyAction } from "../actions";

export function ManualLeadForm() {
  const [state, formAction] = useFormState(logLeadManuallyAction, null);
  const fieldErrors = state && !state.ok ? state.fieldErrors ?? {} : {};

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Full name"
          name="fullName"
          required
          error={fieldErrors.fullName}
        />
        <Field
          label="Phone / WhatsApp"
          name="phone"
          required
          error={fieldErrors.phone}
          helperText="Include country code, e.g. +44 7..."
        />
        <Field
          label="Email (optional)"
          name="email"
          type="email"
          error={fieldErrors.email}
        />
        <Select
          label="Source"
          name="source"
          required
          options={[
            { value: "WHATSAPP", label: "WhatsApp" },
            { value: "EMAIL", label: "Email" },
            { value: "REFERRAL", label: "Referral" },
            { value: "OTHER", label: "Other" },
          ]}
        />
        <Select
          label="Property country"
          name="country"
          options={[
            { value: "", label: "—" },
            { value: "KE", label: "Kenya" },
            { value: "GH", label: "Ghana" },
          ]}
        />
        <Field
          label="Residence country"
          name="residenceCountry"
          helperText="Where the landlord lives. Diaspora context."
          error={fieldErrors.residenceCountry}
        />
        <Field label="City" name="city" />
        <Field label="Neighbourhood" name="neighbourhood" />
        <Field label="Property type" name="propertyType" />
        <Field label="Bedrooms" name="bedrooms" />
        <Field label="Furnished" name="furnished" />
        <Field
          label="Service interest"
          name="serviceInterest"
          helperText="Long-term, short-stay, sourcing…"
        />
        <Field label="Availability" name="availability" />
      </div>

      <label className="block text-sm">
        <span className="font-medium text-stone-800">Notes</span>
        <textarea
          name="notes"
          rows={4}
          className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          placeholder="Anything the landlord said that won't fit the structured fields."
        />
      </label>

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
      className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
    >
      {status.pending ? "Saving…" : "Log lead"}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  helperText,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
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
  required,
}: {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-stone-800">{label}</span>
      <select
        name={name}
        required={required}
        defaultValue={options[0]?.value}
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
