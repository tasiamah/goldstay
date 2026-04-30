"use client";

import { useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import type { PropertyActionResult } from "./actions";
import {
  findCanonicalNairobiNeighbourhood,
  isNairobiCity,
  NAIROBI_NEIGHBOURHOODS,
} from "@/lib/nairobi-neighbourhoods";

const OTHER_NEIGHBOURHOOD_VALUE = "__other__";

type FormAction = (
  prev: PropertyActionResult | null,
  formData: FormData,
) => Promise<PropertyActionResult>;

type Defaults = {
  ownerId: string;
  name?: string;
  city?: string;
  neighbourhood?: string | null;
  address?: string;
  description?: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  sizeSqm?: number | null;
  acquiredOn?: Date | null;
  acquisitionPrice?: string | number | null;
  acquisitionCurrency?: string | null;
  status?: "ACTIVE" | "ONBOARDING" | "EXITED";
};

export function PropertyForm({
  action,
  defaults,
  submitLabel,
  ownerCountry,
}: {
  action: FormAction;
  defaults: Defaults;
  submitLabel: string;
  ownerCountry: "KE" | "GH";
}) {
  const [state, formAction] = useFormState(action, null);
  const fieldError = (key: string) =>
    state && !state.ok ? state.fieldErrors?.[key] : undefined;

  const dateValue = defaults.acquiredOn
    ? new Date(defaults.acquiredOn).toISOString().slice(0, 10)
    : "";

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="ownerId" value={defaults.ownerId} />

      <Field
        label="Property name"
        name="name"
        defaultValue={defaults.name ?? ""}
        placeholder="Pinetree Plaza unit 4B"
        required
        error={fieldError("name")}
      />

      <LocationFields
        defaults={{
          city: defaults.city ?? (ownerCountry === "KE" ? "Nairobi" : "Accra"),
          neighbourhood: defaults.neighbourhood ?? "",
        }}
        ownerCountry={ownerCountry}
        cityError={fieldError("city")}
        neighbourhoodError={fieldError("neighbourhood")}
      />

      <Field
        label="Address"
        name="address"
        defaultValue={defaults.address ?? ""}
        placeholder="Street, plot, postal address"
        required
        error={fieldError("address")}
      />

      <TextArea
        label="Description"
        name="description"
        defaultValue={defaults.description ?? ""}
        placeholder="Internal notes for ops. Not visible to the landlord."
        error={fieldError("description")}
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

      <fieldset className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field
          label="Acquired on"
          name="acquiredOn"
          type="date"
          defaultValue={dateValue}
          error={fieldError("acquiredOn")}
        />
        <Field
          label="Acquisition price"
          name="acquisitionPrice"
          type="number"
          step="0.01"
          defaultValue={
            defaults.acquisitionPrice
              ? String(defaults.acquisitionPrice)
              : ""
          }
          min={0}
          error={fieldError("acquisitionPrice")}
        />
        <Select
          label="Currency"
          name="acquisitionCurrency"
          defaultValue={defaults.acquisitionCurrency ?? "USD"}
          options={[
            { value: "USD", label: "USD" },
            { value: "KES", label: "KES" },
            { value: "GHS", label: "GHS" },
            { value: "EUR", label: "EUR" },
            { value: "GBP", label: "GBP" },
          ]}
          error={fieldError("acquisitionCurrency")}
        />
      </fieldset>

      <Select
        label="Status"
        name="status"
        defaultValue={defaults.status ?? "ONBOARDING"}
        required
        options={[
          { value: "ONBOARDING", label: "Onboarding" },
          { value: "ACTIVE", label: "Active" },
          { value: "EXITED", label: "Exited" },
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

// City + Neighbourhood, controlled together so the neighbourhood
// field can swap between dropdown and free text based on whether
// the city is Nairobi. We track the typed neighbourhood string in
// one piece of state and derive the <select>'s display value from
// it, so a landlord typing "westlands" via the Other input would
// snap back to the canonical "Westlands" dropdown option on next
// render. That auto-normalising behaviour is intentional: it keeps
// the data clean for the per-neighbourhood reporting we'll add later
// without nagging the operator with a validation error.
function LocationFields({
  defaults,
  ownerCountry,
  cityError,
  neighbourhoodError,
}: {
  defaults: { city: string; neighbourhood: string };
  ownerCountry: "KE" | "GH";
  cityError?: string;
  neighbourhoodError?: string;
}) {
  const [city, setCity] = useState(defaults.city);
  const [neighbourhood, setNeighbourhood] = useState(defaults.neighbourhood);

  const showsDropdown = isNairobiCity(city);
  const canonical = findCanonicalNairobiNeighbourhood(neighbourhood);
  const isOther = neighbourhood !== "" && canonical === null;
  const selectValue = isOther
    ? OTHER_NEIGHBOURHOOD_VALUE
    : (canonical ?? "");

  function handleSelectChange(value: string) {
    if (value === OTHER_NEIGHBOURHOOD_VALUE) {
      // Clear so the Other input starts empty and the user can type
      // their own value. Without this, picking Other after picking
      // "Westlands" would leave "Westlands" prefilled in the input,
      // which is confusing.
      setNeighbourhood("");
    } else {
      setNeighbourhood(value);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <label className="block">
        <span className="text-sm font-medium text-stone-700">
          City<span className="text-red-600"> *</span>
        </span>
        <input
          type="text"
          name="city"
          required
          value={city}
          onChange={(e) => setCity(e.target.value)}
          aria-invalid={Boolean(cityError) || undefined}
          className={`mt-1 block w-full rounded-md border px-3 py-2 text-stone-900 shadow-sm focus:outline-none focus:ring-1 ${
            cityError
              ? "border-red-400 focus:border-red-500 focus:ring-red-500"
              : "border-stone-300 focus:border-stone-500 focus:ring-stone-500"
          }`}
        />
        {cityError ? (
          <span className="mt-1 block text-xs text-red-700">{cityError}</span>
        ) : null}
      </label>

      {showsDropdown ? (
        <div className="space-y-2">
          <label className="block">
            <span className="text-sm font-medium text-stone-700">
              Neighbourhood
            </span>
            <select
              value={selectValue}
              onChange={(e) => handleSelectChange(e.target.value)}
              aria-invalid={Boolean(neighbourhoodError) || undefined}
              className={`mt-1 block w-full rounded-md border bg-white px-3 py-2 text-stone-900 shadow-sm focus:outline-none focus:ring-1 ${
                neighbourhoodError
                  ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                  : "border-stone-300 focus:border-stone-500 focus:ring-stone-500"
              }`}
            >
              <option value="">Select a neighbourhood…</option>
              {NAIROBI_NEIGHBOURHOODS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
              <option value={OTHER_NEIGHBOURHOOD_VALUE}>
                Other / not listed
              </option>
            </select>
          </label>
          {selectValue === OTHER_NEIGHBOURHOOD_VALUE ? (
            <input
              type="text"
              autoFocus
              placeholder="Type the neighbourhood name"
              value={neighbourhood}
              onChange={(e) => setNeighbourhood(e.target.value)}
              className="block w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900 shadow-sm focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
            />
          ) : null}
          {/* Hidden input is what actually posts to the server action.
              We use a separate hidden field rather than naming the
              <select> so the "__other__" sentinel never reaches Zod. */}
          <input type="hidden" name="neighbourhood" value={neighbourhood} />
          {neighbourhoodError ? (
            <span className="block text-xs text-red-700">
              {neighbourhoodError}
            </span>
          ) : null}
        </div>
      ) : (
        <label className="block">
          <span className="text-sm font-medium text-stone-700">
            Neighbourhood
          </span>
          <input
            type="text"
            name="neighbourhood"
            value={neighbourhood}
            onChange={(e) => setNeighbourhood(e.target.value)}
            placeholder={ownerCountry === "GH" ? "East Legon" : "Suburb name"}
            aria-invalid={Boolean(neighbourhoodError) || undefined}
            className={`mt-1 block w-full rounded-md border px-3 py-2 text-stone-900 shadow-sm focus:outline-none focus:ring-1 ${
              neighbourhoodError
                ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                : "border-stone-300 focus:border-stone-500 focus:ring-stone-500"
            }`}
          />
          {neighbourhoodError ? (
            <span className="mt-1 block text-xs text-red-700">
              {neighbourhoodError}
            </span>
          ) : null}
        </label>
      )}
    </div>
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
  step,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  required?: boolean;
  min?: number;
  step?: string;
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
        step={step}
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

function TextArea({
  label,
  name,
  defaultValue,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      <textarea
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        rows={3}
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
