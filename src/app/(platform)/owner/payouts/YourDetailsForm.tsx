"use client";

// Single form covering the consolidated "Your details" step:
// name, phone, address, entity type, and (when COMPANY is picked)
// company name + registration number + country. Replaces the
// previous PersonalDetailsForm + BusinessForm pair. We keep the
// form fully controlled around entityType because the company
// fields are conditionally rendered — server validation enforces
// the same interlock so a hand-crafted POST can't bypass it.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { OwnerEntityType } from "@prisma/client";
import { updateYourDetailsAction } from "./profile-actions";

export function YourDetailsForm({
  defaultFullName,
  defaultPhone,
  defaultAddress,
  defaultEntityType,
  defaultCompanyName,
  defaultCompanyRegistrationNumber,
  defaultCountry,
  email,
}: {
  defaultFullName: string;
  defaultPhone: string;
  defaultAddress: string;
  defaultEntityType: OwnerEntityType;
  defaultCompanyName: string;
  defaultCompanyRegistrationNumber: string;
  defaultCountry: "KE" | "GH";
  // Read-only — shown alongside the editable fields so the owner
  // sees the account they're editing, but locked because email is
  // the auth principal. To change it, support has to verify
  // identity and reassign the supabase user, which the owner
  // can't trigger from a form post.
  email: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);
  // Controlled so we can show / hide the company fields without
  // remounting the whole form. Server-side superRefine validates the
  // same interlock — this is purely UX progressive disclosure.
  const [entityType, setEntityType] = useState<OwnerEntityType>(
    defaultEntityType,
  );

  return (
    <form
      action={(formData) => {
        setError(null);
        setFieldErrors({});
        setSuccess(false);
        startTransition(async () => {
          const r = await updateYourDetailsAction(null, formData);
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

      <div className="sm:col-span-2">
        <label className="block text-sm">
          <span className="font-medium text-stone-800">Postal address</span>
          <textarea
            name="address"
            required
            defaultValue={defaultAddress}
            rows={3}
            placeholder="Apartment / building, street, neighbourhood, city, country"
            className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:outline-none focus:ring-1 focus:ring-stone-500"
          />
          {fieldErrors.address ? (
            <p className="mt-1 text-xs text-red-700">{fieldErrors.address}</p>
          ) : (
            <p className="mt-1 text-xs text-stone-500">
              Used on KYC paperwork and as the return-address line on your
              monthly statement PDF.
            </p>
          )}
        </label>
      </div>

      <fieldset className="sm:col-span-2 rounded-md border border-stone-200 bg-stone-50/40 p-4">
        <legend className="px-1 text-sm font-medium text-stone-800">
          How do you let?
        </legend>
        <p className="text-xs text-stone-500">
          We use this to issue payouts and statements to the right legal
          entity. You can switch later if you incorporate.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          <EntityTypeOption
            value="INDIVIDUAL"
            label="In my personal capacity"
            hint="Payouts and statements are issued to you as an individual."
            selected={entityType === "INDIVIDUAL"}
            onSelect={setEntityType}
          />
          <EntityTypeOption
            value="COMPANY"
            label="Through a registered company"
            hint="LLC / Ltd that holds the property. Statements are issued to the company."
            selected={entityType === "COMPANY"}
            onSelect={setEntityType}
          />
        </div>
      </fieldset>

      {entityType === "COMPANY" ? (
        <>
          <Field
            label="Company name"
            name="companyName"
            defaultValue={defaultCompanyName}
            required
            placeholder="e.g. Pinetree Holdings Ltd"
            helperText="Legal name on the certificate of incorporation."
            error={fieldErrors.companyName}
          />
          <Field
            label="Company registration number"
            name="companyRegistrationNumber"
            defaultValue={defaultCompanyRegistrationNumber}
            placeholder="Optional"
            helperText="KE: CR. number. GH: RGD number. Optional, but speeds up KYC."
            error={fieldErrors.companyRegistrationNumber}
          />
          <label className="block text-sm sm:col-span-2">
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
                Where the company is registered — drives the tax setup on
                statements.
              </p>
            )}
          </label>
        </>
      ) : (
        // Hidden inputs so the server action always receives a country
        // value (we keep the owner's existing country) and an explicit
        // empty companyName / registration number. Saves a second
        // round-trip when the owner toggles back from COMPANY.
        <>
          <input type="hidden" name="country" value={defaultCountry} />
          <input type="hidden" name="companyName" value="" />
          <input type="hidden" name="companyRegistrationNumber" value="" />
        </>
      )}

      <div className="sm:col-span-2">
        <label className="block text-sm">
          <span className="font-medium text-stone-800">Email</span>
          <input
            type="email"
            value={email}
            readOnly
            disabled
            aria-readonly="true"
            className="mt-1 block w-full cursor-not-allowed rounded-md border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-600"
          />
          <p className="mt-1 text-xs text-stone-500">
            Email is locked because it&apos;s how you sign in. To change it,
            email{" "}
            <a
              href="mailto:support@goldstay.co.ke"
              className="font-medium text-stone-700 underline-offset-2 hover:underline"
            >
              support@goldstay.co.ke
            </a>{" "}
            and we&apos;ll verify identity before swapping it over.
          </p>
        </label>
      </div>

      <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-60"
        >
          {pending ? "Saving…" : "Save details"}
        </button>
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-700">Saved.</p> : null}
      </div>
      {/* Always include the entityType in the form payload, regardless
          of which branch rendered. Hidden because the radio cards above
          are the actual UI. */}
      <input type="hidden" name="entityType" value={entityType} />
    </form>
  );
}

function EntityTypeOption({
  value,
  label,
  hint,
  selected,
  onSelect,
}: {
  value: OwnerEntityType;
  label: string;
  hint: string;
  selected: boolean;
  onSelect: (v: OwnerEntityType) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={selected}
      className={`rounded-md border p-3 text-left text-sm transition ${
        selected
          ? "border-stone-900 bg-white shadow-sm"
          : "border-stone-200 bg-white/60 hover:border-stone-400"
      }`}
    >
      <span className="block font-medium text-stone-900">{label}</span>
      <span className="mt-1 block text-xs text-stone-500">{hint}</span>
    </button>
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
