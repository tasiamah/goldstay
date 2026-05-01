"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateBusinessDetailsAction } from "./profile-actions";

export function BusinessForm({
  defaultCompanyName,
  defaultCountry,
}: {
  defaultCompanyName: string;
  defaultCountry: "KE" | "GH";
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
          const r = await updateBusinessDetailsAction(null, formData);
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
      <label className="block text-sm">
        <span className="font-medium text-stone-800">Company name</span>
        <input
          type="text"
          name="companyName"
          required
          defaultValue={defaultCompanyName}
          placeholder="e.g. Pinetree Holdings Ltd"
          className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        />
        {fieldErrors.companyName ? (
          <p className="mt-1 text-xs text-red-700">{fieldErrors.companyName}</p>
        ) : (
          <p className="mt-1 text-xs text-stone-500">
            Leave matching your name if you let in your personal capacity.
          </p>
        )}
      </label>
      <label className="block text-sm">
        <span className="font-medium text-stone-800">Country</span>
        <select
          name="country"
          required
          defaultValue={defaultCountry}
          className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
        >
          <option value="KE">Kenya</option>
          <option value="GH">Ghana</option>
        </select>
        {fieldErrors.country ? (
          <p className="mt-1 text-xs text-red-700">{fieldErrors.country}</p>
        ) : (
          <p className="mt-1 text-xs text-stone-500">
            Where the property sits — drives the tax setup.
          </p>
        )}
      </label>
      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save business details"}
        </button>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {success ? (
          <p className="text-sm text-emerald-700">Saved.</p>
        ) : null}
      </div>
    </form>
  );
}
