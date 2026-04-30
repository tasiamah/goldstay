"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { LeaseActionResult } from "./actions";

type FormAction = (
  prev: LeaseActionResult | null,
  formData: FormData,
) => Promise<LeaseActionResult>;

type Defaults = {
  unitId: string;
  tenantName?: string;
  tenantEmail?: string | null;
  tenantPhone?: string | null;
  startDate?: Date;
  endDate?: Date | null;
  monthlyRent?: string | number;
  currency?: string;
  depositAmount?: string | number | null;
  status?: "ACTIVE" | "ENDED" | "TERMINATED" | "PENDING";
  notes?: string | null;
};

function dateInputValue(d: Date | null | undefined): string {
  if (!d) return "";
  return new Date(d).toISOString().slice(0, 10);
}

export function LeaseForm({
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
      <input type="hidden" name="unitId" value={defaults.unitId} />

      <Field
        label="Tenant name"
        name="tenantName"
        defaultValue={defaults.tenantName ?? ""}
        required
        error={fieldError("tenantName")}
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Tenant email"
          name="tenantEmail"
          type="email"
          defaultValue={defaults.tenantEmail ?? ""}
          error={fieldError("tenantEmail")}
        />
        <Field
          label="Tenant phone"
          name="tenantPhone"
          type="tel"
          defaultValue={defaults.tenantPhone ?? ""}
          error={fieldError("tenantPhone")}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Start date"
          name="startDate"
          type="date"
          defaultValue={dateInputValue(defaults.startDate)}
          required
          error={fieldError("startDate")}
        />
        <Field
          label="End date"
          name="endDate"
          type="date"
          defaultValue={dateInputValue(defaults.endDate)}
          error={fieldError("endDate")}
        />
      </div>

      <fieldset className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Field
          label="Monthly rent"
          name="monthlyRent"
          type="number"
          step="0.01"
          min={0}
          defaultValue={
            defaults.monthlyRent ? String(defaults.monthlyRent) : ""
          }
          required
          error={fieldError("monthlyRent")}
        />
        <Field
          label="Deposit"
          name="depositAmount"
          type="number"
          step="0.01"
          min={0}
          defaultValue={
            defaults.depositAmount ? String(defaults.depositAmount) : ""
          }
          error={fieldError("depositAmount")}
        />
        <Select
          label="Currency"
          name="currency"
          defaultValue={defaults.currency ?? defaultCurrency}
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
      </fieldset>

      <Select
        label="Status"
        name="status"
        defaultValue={defaults.status ?? "ACTIVE"}
        required
        options={[
          { value: "ACTIVE", label: "Active" },
          { value: "PENDING", label: "Pending start" },
          { value: "ENDED", label: "Ended" },
          { value: "TERMINATED", label: "Terminated" },
        ]}
        error={fieldError("status")}
      />

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
