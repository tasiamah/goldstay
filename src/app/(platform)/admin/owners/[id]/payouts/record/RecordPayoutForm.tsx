"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { recordPayoutAction } from "../actions";

type Property = { id: string; label: string };
type Method = {
  id: string;
  label: string;
  currency: string;
  kind: string;
  summary: string;
  isDefault: boolean;
};

export function RecordPayoutForm({
  ownerId,
  properties,
  methods,
  defaultCurrency,
}: {
  ownerId: string;
  properties: Property[];
  methods: Method[];
  defaultCurrency: string;
}) {
  const router = useRouter();
  const defaultMethod = methods.find((m) => m.isDefault) ?? methods[0];
  const [methodId, setMethodId] = useState(defaultMethod?.id ?? "");
  const [currency, setCurrency] = useState(
    defaultMethod?.currency ?? defaultCurrency,
  );
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const today = new Date().toISOString().slice(0, 10);

  return (
    <form
      action={(formData) => {
        setError(null);
        setFieldErrors({});
        startTransition(async () => {
          const action = recordPayoutAction.bind(null, ownerId);
          const r = await action(null, formData);
          if (!r.ok) {
            setError(r.error);
            setFieldErrors(r.fieldErrors ?? {});
          } else {
            router.push(`/admin/owners/${ownerId}`);
          }
        });
      }}
      className="space-y-5"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Property"
          name="propertyId"
          required
          options={properties.map((p) => ({ value: p.id, label: p.label }))}
          error={fieldErrors.propertyId}
        />
        <Select
          label="Payout method"
          name="payoutMethodId"
          required
          value={methodId}
          onChange={(v) => {
            setMethodId(v);
            const m = methods.find((x) => x.id === v);
            if (m) setCurrency(m.currency);
          }}
          options={methods.map((m) => ({
            value: m.id,
            label: `${m.label} · ${m.kind} (${m.currency})${m.isDefault ? " · default" : ""}`,
          }))}
          error={fieldErrors.payoutMethodId}
          helperText={
            methods.find((m) => m.id === methodId)?.summary ?? undefined
          }
        />
        <Field
          label="Amount"
          name="amount"
          type="number"
          step="0.01"
          min="0"
          required
          error={fieldErrors.amount}
        />
        <Field
          label="Currency"
          name="currency"
          required
          value={currency}
          onChange={setCurrency}
          maxLength={3}
          helperText="Defaults to the payout method's currency."
          error={fieldErrors.currency}
        />
        <Field
          label="Date paid"
          name="occurredOn"
          type="date"
          defaultValue={today}
          required
          error={fieldErrors.occurredOn}
        />
        <Field
          label="Reference (optional)"
          name="reference"
          placeholder="Bank ref, Wise transfer ID…"
          error={fieldErrors.reference}
        />
      </div>

      <label className="block text-sm">
        <span className="font-medium text-stone-800">
          Description (optional)
        </span>
        <textarea
          name="description"
          rows={2}
          className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          placeholder='Defaults to "Payout to <method label>". Override if you want the owner to see a richer note on their statement.'
        />
      </label>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}

      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {pending ? "Recording…" : "Record payout"}
        </button>
        <p className="text-xs text-stone-500">
          The owner sees this on their next statement immediately.
        </p>
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
  value,
  onChange,
  placeholder,
  helperText,
  error,
  maxLength,
  step,
  min,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  value?: string;
  onChange?: (next: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  maxLength?: number;
  step?: string;
  min?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-stone-800">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={value === undefined ? defaultValue : undefined}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        maxLength={maxLength}
        step={step}
        min={min}
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
  value,
  onChange,
  required,
  error,
  helperText,
}: {
  label: string;
  name: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (next: string) => void;
  required?: boolean;
  error?: string;
  helperText?: string;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-stone-800">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        required={required}
        className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error ? (
        <p className="mt-1 text-xs text-red-700">{error}</p>
      ) : helperText ? (
        <p className="mt-1 text-xs text-stone-500">{helperText}</p>
      ) : null}
    </label>
  );
}
