"use client";

import { useFormState, useFormStatus } from "react-dom";
import { useState } from "react";
import type { TransactionActionResult } from "./actions";

type FormAction = (
  prev: TransactionActionResult | null,
  formData: FormData,
) => Promise<TransactionActionResult>;

type PropertyOption = {
  id: string;
  name: string;
  city: string;
  ownerName: string;
  propertyType: "LONG_TERM" | "SHORT_TERM";
  defaultCurrency: string;
  leases: { id: string; tenantName: string }[];
  bookings: { id: string; label: string }[];
};

type Defaults = {
  propertyId?: string;
  leaseId?: string | null;
  bookingId?: string | null;
  occurredOn?: Date;
  type?: string;
  direction?: "INFLOW" | "OUTFLOW";
  amount?: string | number;
  currency?: string;
  description?: string | null;
  reference?: string | null;
};

const TYPES: { value: string; label: string; direction: "INFLOW" | "OUTFLOW" }[] =
  [
    { value: "RENT", label: "Rent / gross from guests", direction: "INFLOW" },
    { value: "DEPOSIT", label: "Deposit", direction: "INFLOW" },
    { value: "REFUND", label: "Refund (deposit returned)", direction: "OUTFLOW" },
    { value: "EXPENSE", label: "Expense", direction: "OUTFLOW" },
    {
      value: "MANAGEMENT_FEE",
      label: "Management fee",
      direction: "OUTFLOW",
    },
    { value: "PAYOUT", label: "Payout to owner", direction: "OUTFLOW" },
    {
      value: "OTA_COMMISSION",
      label: "OTA commission (Airbnb)",
      direction: "OUTFLOW",
    },
    { value: "CLEANING_FEE", label: "Cleaning fee", direction: "OUTFLOW" },
    { value: "GUEST_REFUND", label: "Guest refund", direction: "OUTFLOW" },
    {
      value: "GOLDSTAY_COMMISSION",
      label: "Goldstay commission",
      direction: "OUTFLOW",
    },
    { value: "OTHER", label: "Other", direction: "INFLOW" },
  ];

function dateInputValue(d: Date | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export function TransactionForm({
  action,
  defaults,
  submitLabel,
  properties,
}: {
  action: FormAction;
  defaults: Defaults;
  submitLabel: string;
  properties: PropertyOption[];
}) {
  const [state, formAction] = useFormState(action, null);
  const fieldError = (key: string) =>
    state && !state.ok ? state.fieldErrors?.[key] : undefined;

  const [propertyId, setPropertyId] = useState(defaults.propertyId ?? "");
  const [type, setType] = useState(defaults.type ?? "RENT");

  const selectedProperty = properties.find((p) => p.id === propertyId);
  const directionForType =
    TYPES.find((t) => t.value === type)?.direction ?? "INFLOW";

  return (
    <form action={formAction} className="space-y-5">
      <Select
        label="Property"
        name="propertyId"
        value={propertyId}
        onChange={setPropertyId}
        required
        error={fieldError("propertyId")}
        options={[
          { value: "", label: "Select a property…", disabled: true },
          ...properties.map((p) => ({
            value: p.id,
            label: `${p.name} · ${p.city} · ${p.ownerName}`,
          })),
        ]}
      />

      {selectedProperty?.propertyType === "SHORT_TERM" &&
      selectedProperty.bookings.length > 0 ? (
        <Select
          label="Booking (optional)"
          name="bookingId"
          defaultValue={defaults.bookingId ?? ""}
          options={[
            { value: "", label: "— No booking —" },
            ...selectedProperty.bookings.map((b) => ({
              value: b.id,
              label: b.label,
            })),
          ]}
          error={fieldError("bookingId")}
        />
      ) : (
        <input type="hidden" name="bookingId" value={defaults.bookingId ?? ""} />
      )}

      {selectedProperty?.propertyType === "LONG_TERM" &&
      selectedProperty.leases.length > 0 ? (
        <Select
          label="Lease (optional)"
          name="leaseId"
          defaultValue={defaults.leaseId ?? ""}
          options={[
            { value: "", label: "— No lease —" },
            ...selectedProperty.leases.map((l) => ({
              value: l.id,
              label: l.tenantName,
            })),
          ]}
          error={fieldError("leaseId")}
        />
      ) : (
        <input type="hidden" name="leaseId" value={defaults.leaseId ?? ""} />
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Date"
          name="occurredOn"
          type="date"
          defaultValue={dateInputValue(defaults.occurredOn ?? new Date())}
          required
          error={fieldError("occurredOn")}
        />
        <Select
          label="Type"
          name="type"
          value={type}
          onChange={setType}
          required
          options={TYPES.map(({ value, label }) => ({ value, label }))}
          error={fieldError("type")}
        />
      </div>

      <input type="hidden" name="direction" value={directionForType} />

      <fieldset className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field
          label="Amount"
          name="amount"
          type="number"
          step="0.01"
          min={0}
          defaultValue={defaults.amount ? String(defaults.amount) : ""}
          required
          error={fieldError("amount")}
        />
        <Select
          label="Currency"
          name="currency"
          defaultValue={
            defaults.currency ?? selectedProperty?.defaultCurrency ?? "KES"
          }
          required
          options={[
            { value: "KES", label: "KES" },
            { value: "GHS", label: "GHS" },
            { value: "USD", label: "USD" },
            { value: "EUR", label: "EUR" },
            { value: "GBP", label: "GBP" },
          ]}
          error={fieldError("currency")}
        />
        <Field
          label="Reference"
          name="reference"
          defaultValue={defaults.reference ?? ""}
          placeholder="M-Pesa code, invoice no., …"
          error={fieldError("reference")}
        />
      </fieldset>

      <Field
        label="Description"
        name="description"
        defaultValue={defaults.description ?? ""}
        placeholder="e.g. April rent, Plumber callout"
        error={fieldError("description")}
      />

      <p className="text-xs text-stone-500">
        Direction is set automatically:{" "}
        <strong className="text-stone-700">{directionForType}</strong> for{" "}
        {TYPES.find((t) => t.value === type)?.label}.
      </p>

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

function Select({
  label,
  name,
  defaultValue,
  value,
  onChange,
  required,
  error,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  value?: string;
  onChange?: (next: string) => void;
  required?: boolean;
  error?: string;
  options: { value: string; label: string; disabled?: boolean }[];
}) {
  const isControlled = onChange !== undefined;
  return (
    <label className="block">
      <span className="text-sm font-medium text-stone-700">
        {label}
        {required ? <span className="text-red-600"> *</span> : null}
      </span>
      <select
        name={name}
        value={isControlled ? value : undefined}
        defaultValue={isControlled ? undefined : defaultValue}
        onChange={
          isControlled ? (e) => onChange!(e.currentTarget.value) : undefined
        }
        required={required}
        className={`mt-1 block w-full rounded-md border bg-white px-3 py-2 text-stone-900 shadow-sm focus:outline-none focus:ring-1 ${
          error
            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
            : "border-stone-300 focus:border-stone-500 focus:ring-stone-500"
        }`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} disabled={o.disabled}>
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
