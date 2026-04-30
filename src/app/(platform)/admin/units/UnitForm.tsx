"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { UnitActionResult } from "./actions";

type FormAction = (
  prev: UnitActionResult | null,
  formData: FormData,
) => Promise<UnitActionResult>;

type Defaults = {
  propertyId: string;
  label?: string;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sizeSqm?: number | null;
  status?: "VACANT" | "OCCUPIED" | "RENOVATION" | "OFF_MARKET";
};

export function UnitForm({
  action,
  defaults,
  submitLabel,
}: {
  action: FormAction;
  defaults: Defaults;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, null);
  const fieldError = (key: string) =>
    state && !state.ok ? state.fieldErrors?.[key] : undefined;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="propertyId" value={defaults.propertyId} />

      <Field
        label="Label"
        name="label"
        defaultValue={defaults.label ?? ""}
        placeholder="e.g. Unit 4B, Whole house"
        required
        error={fieldError("label")}
      />

      <fieldset className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field
          label="Bedrooms"
          name="bedrooms"
          type="number"
          defaultValue={defaults.bedrooms ?? ""}
          min={0}
          error={fieldError("bedrooms")}
        />
        <Field
          label="Bathrooms"
          name="bathrooms"
          type="number"
          defaultValue={defaults.bathrooms ?? ""}
          min={0}
          error={fieldError("bathrooms")}
        />
        <Field
          label="Size (sqm)"
          name="sizeSqm"
          type="number"
          defaultValue={defaults.sizeSqm ?? ""}
          min={0}
          error={fieldError("sizeSqm")}
        />
      </fieldset>

      <Select
        label="Status"
        name="status"
        defaultValue={defaults.status ?? "VACANT"}
        required
        options={[
          { value: "VACANT", label: "Vacant" },
          { value: "OCCUPIED", label: "Occupied" },
          { value: "RENOVATION", label: "Renovation" },
          { value: "OFF_MARKET", label: "Off market" },
        ]}
        error={fieldError("status")}
      />

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
  min,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  min?: number;
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
        min={min}
        aria-invalid={Boolean(error) || undefined}
        className={`mt-1 block w-full rounded-md border px-3 py-2 text-stone-900 shadow-sm focus:outline-none focus:ring-1 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
            : "border-stone-300 focus:border-stone-500 focus:ring-stone-500"
        }`}
      />
      {error ? (
        <span className="mt-1 block text-xs text-red-700">{error}</span>
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
