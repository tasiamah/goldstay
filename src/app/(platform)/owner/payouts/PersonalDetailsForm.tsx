"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updatePersonalDetailsAction } from "./profile-actions";

export function PersonalDetailsForm({
  defaultFullName,
  defaultPhone,
}: {
  defaultFullName: string;
  defaultPhone: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  return (
    <form
      action={(formData) => {
        setError(null);
        setFieldErrors({});
        setSuccess(false);
        startTransition(async () => {
          const r = await updatePersonalDetailsAction(null, formData);
          if (!r.ok) {
            setError(r.error);
            setFieldErrors(r.fieldErrors ?? {});
          } else {
            setSuccess(true);
            router.refresh();
          }
        });
      }}
      className="grid gap-4 sm:grid-cols-2"
    >
      <Field
        label="Full name"
        name="fullName"
        defaultValue={defaultFullName}
        required
        helperText="First and last name; used on statements and KYC."
        error={fieldErrors.fullName}
      />
      <Field
        label="Phone"
        name="phone"
        type="tel"
        defaultValue={defaultPhone}
        required
        placeholder="+254 712 345 678"
        helperText="International format. Used for verification calls only."
        error={fieldErrors.phone}
      />
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save personal details"}
        </button>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {success ? (
          <p className="text-sm text-emerald-700">Saved.</p>
        ) : null}
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
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
        placeholder={placeholder}
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
