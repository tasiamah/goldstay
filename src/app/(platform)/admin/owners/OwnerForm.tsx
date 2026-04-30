"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { OwnerActionResult } from "./actions";

type FormAction = (
  prev: OwnerActionResult | null,
  formData: FormData,
) => Promise<OwnerActionResult>;

type Defaults = {
  email?: string;
  fullName?: string;
  phone?: string | null;
  companyName?: string | null;
  country?: "KE" | "GH";
  preferredCurrency?: string;
};

export function OwnerForm({
  action,
  defaults,
  submitLabel,
}: {
  action: FormAction;
  defaults?: Defaults;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, null);
  const fieldError = (key: string) =>
    state && !state.ok ? state.fieldErrors?.[key] : undefined;

  return (
    <form action={formAction} className="space-y-5">
      <Field
        label="Full name"
        name="fullName"
        defaultValue={defaults?.fullName ?? ""}
        required
        error={fieldError("fullName")}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        defaultValue={defaults?.email ?? ""}
        required
        autoComplete="off"
        error={fieldError("email")}
        help="Used for sign-in. The landlord will receive a magic link at this address."
      />
      <Field
        label="Phone"
        name="phone"
        type="tel"
        defaultValue={defaults?.phone ?? ""}
        placeholder="+254 ..."
        error={fieldError("phone")}
      />
      <Field
        label="Company name"
        name="companyName"
        defaultValue={defaults?.companyName ?? ""}
        placeholder="Optional"
        error={fieldError("companyName")}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Select
          label="Country"
          name="country"
          defaultValue={defaults?.country ?? "KE"}
          required
          error={fieldError("country")}
          options={[
            { value: "KE", label: "Kenya" },
            { value: "GH", label: "Ghana" },
          ]}
        />
        <Select
          label="Preferred currency"
          name="preferredCurrency"
          defaultValue={defaults?.preferredCurrency ?? "USD"}
          error={fieldError("preferredCurrency")}
          options={[
            { value: "USD", label: "USD" },
            { value: "KES", label: "KES" },
            { value: "GHS", label: "GHS" },
            { value: "EUR", label: "EUR" },
            { value: "GBP", label: "GBP" },
          ]}
        />
      </div>

      {state && !state.ok ? (
        <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          {state.error}
        </p>
      ) : null}

      <SubmitButton label={submitLabel} />
    </form>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
    >
      {pending ? "Saving..." : label}
    </button>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required,
  autoComplete,
  help,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  help?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={Boolean(error) || undefined}
        className={`mt-1 block w-full rounded-md border px-3 py-2 text-stone-900 shadow-sm focus:outline-none focus:ring-1 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
            : "border-stone-300 focus:border-stone-500 focus:ring-stone-500"
        }`}
      />
      {error ? (
        <span className="mt-1 block text-xs text-red-700">{error}</span>
      ) : help ? (
        <span className="mt-1 block text-xs text-stone-500">{help}</span>
      ) : null}
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  required,
  error,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  error?: string;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        aria-invalid={Boolean(error) || undefined}
        className={`mt-1 block w-full rounded-md border bg-white px-3 py-2 text-stone-900 shadow-sm focus:outline-none focus:ring-1 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
            : "border-stone-300 focus:border-stone-500 focus:ring-stone-500"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <span className="mt-1 block text-xs text-red-700">{error}</span>
      ) : null}
    </label>
  );
}
