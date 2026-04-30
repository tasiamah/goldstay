"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { BookingActionResult } from "./actions";
import {
  ACTIVE_BOOKING_SOURCES,
  SOURCE_LABEL,
} from "@/lib/booking-sources";

type FormAction = (
  prev: BookingActionResult | null,
  formData: FormData,
) => Promise<BookingActionResult>;

type Defaults = {
  propertyId: string;
  source?: "AIRBNB" | "BOOKING_COM" | "VRBO" | "DIRECT";
  externalId?: string | null;
  guestName?: string;
  guestEmail?: string | null;
  checkIn?: Date;
  checkOut?: Date;
  grossAmount?: string | number;
  otaCommission?: string | number | null;
  cleaningFee?: string | number | null;
  netPayout?: string | number;
  currency?: string;
  status?: "CONFIRMED" | "CANCELLED" | "COMPLETED";
  notes?: string | null;
};

function dateInputValue(d: Date | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export function BookingForm({
  action,
  defaults,
  submitLabel,
  defaultCurrency,
}: {
  action: FormAction;
  defaults: Defaults;
  submitLabel: string;
  defaultCurrency: string;
}) {
  const [state, formAction] = useFormState(action, null);
  const fieldError = (key: string) =>
    state && !state.ok ? state.fieldErrors?.[key] : undefined;

  return (
    <form action={formAction} className="space-y-5">
      <input type="hidden" name="propertyId" value={defaults.propertyId} />

      <fieldset className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Select
          label="Source"
          name="source"
          defaultValue={defaults.source ?? "DIRECT"}
          required
          // Only Airbnb + Direct are active right now (see
          // src/lib/booking-sources.ts). When editing a legacy
          // booking from a hidden channel, append it to the list so
          // the existing value stays valid in the dropdown.
          options={(() => {
            const opts: { value: string; label: string }[] =
              ACTIVE_BOOKING_SOURCES.map((s) => ({
                value: s,
                label: SOURCE_LABEL[s],
              }));
            if (
              defaults.source &&
              !ACTIVE_BOOKING_SOURCES.includes(
                defaults.source as (typeof ACTIVE_BOOKING_SOURCES)[number],
              )
            ) {
              opts.push({
                value: defaults.source,
                label: `${SOURCE_LABEL[defaults.source]} (legacy)`,
              });
            }
            return opts;
          })()}
          error={fieldError("source")}
        />
        <Field
          label="Upstream reservation ID"
          name="externalId"
          defaultValue={defaults.externalId ?? ""}
          placeholder="Optional. Auto-set by Hostaway webhook."
          error={fieldError("externalId")}
        />
      </fieldset>

      <Field
        label="Guest name"
        name="guestName"
        defaultValue={defaults.guestName ?? ""}
        required
        error={fieldError("guestName")}
      />
      <Field
        label="Guest email"
        name="guestEmail"
        type="email"
        defaultValue={defaults.guestEmail ?? ""}
        error={fieldError("guestEmail")}
      />

      <fieldset className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Check-in"
          name="checkIn"
          type="date"
          defaultValue={dateInputValue(defaults.checkIn)}
          required
          error={fieldError("checkIn")}
        />
        <Field
          label="Check-out"
          name="checkOut"
          type="date"
          defaultValue={dateInputValue(defaults.checkOut)}
          required
          error={fieldError("checkOut")}
        />
      </fieldset>

      <fieldset className="grid grid-cols-2 gap-5 sm:grid-cols-4">
        <Field
          label="Gross"
          name="grossAmount"
          type="number"
          step="0.01"
          min={0}
          defaultValue={defaults.grossAmount ? String(defaults.grossAmount) : ""}
          required
          error={fieldError("grossAmount")}
        />
        <Field
          label="OTA fee"
          name="otaCommission"
          type="number"
          step="0.01"
          min={0}
          defaultValue={
            defaults.otaCommission ? String(defaults.otaCommission) : ""
          }
          error={fieldError("otaCommission")}
        />
        <Field
          label="Cleaning"
          name="cleaningFee"
          type="number"
          step="0.01"
          min={0}
          defaultValue={defaults.cleaningFee ? String(defaults.cleaningFee) : ""}
          error={fieldError("cleaningFee")}
        />
        <Field
          label="Net payout"
          name="netPayout"
          type="number"
          step="0.01"
          min={0}
          defaultValue={defaults.netPayout ? String(defaults.netPayout) : ""}
          required
          error={fieldError("netPayout")}
        />
      </fieldset>

      <fieldset className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Select
          label="Currency"
          name="currency"
          defaultValue={defaults.currency ?? defaultCurrency}
          options={[
            { value: "KES", label: "KES" },
            { value: "USD", label: "USD" },
            { value: "EUR", label: "EUR" },
            { value: "GBP", label: "GBP" },
            { value: "GHS", label: "GHS" },
          ]}
          error={fieldError("currency")}
        />
        <Select
          label="Status"
          name="status"
          defaultValue={defaults.status ?? "CONFIRMED"}
          options={[
            { value: "CONFIRMED", label: "Confirmed" },
            { value: "COMPLETED", label: "Completed" },
            { value: "CANCELLED", label: "Cancelled" },
          ]}
          error={fieldError("status")}
        />
      </fieldset>

      <TextArea
        label="Notes"
        name="notes"
        defaultValue={defaults.notes ?? ""}
        placeholder="Internal notes. Not visible to the landlord."
        error={fieldError("notes")}
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
