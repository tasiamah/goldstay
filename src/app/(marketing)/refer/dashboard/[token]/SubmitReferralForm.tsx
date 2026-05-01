"use client";

import { useState } from "react";

// Minimal form for the agent-style "I have the landlord on the
// phone, file them under my code" workflow. POSTs to /api/refer/lead
// which authenticates with the dashboard token (same trust boundary
// as viewing the page itself).

const inputClass =
  "block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-charcoal shadow-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/30";

export function SubmitReferralForm({ token }: { token: string }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const payload = {
      token,
      landlordName: String(data.get("landlordName") || "").trim(),
      email: optional(data.get("email")),
      phone: optional(data.get("phone")),
      city: optional(data.get("city")),
      neighbourhood: optional(data.get("neighbourhood")),
      service: optional(data.get("service")),
      notes: optional(data.get("notes")),
    };
    try {
      const res = await fetch("/api/refer/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setError(json.error ?? "Couldn't save the referral. Try again.");
        return;
      }
      setDone(true);
      e.currentTarget.reset();
      setTimeout(() => setDone(false), 4000);
    } catch (err) {
      console.error(err);
      setError("Network error. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3">
      <Field label="Landlord name" required>
        <input
          name="landlordName"
          required
          minLength={2}
          maxLength={120}
          className={inputClass}
        />
      </Field>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Email">
          <input name="email" type="email" className={inputClass} />
        </Field>
        <Field label="Phone / WhatsApp">
          <input name="phone" type="tel" maxLength={40} className={inputClass} />
        </Field>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="City">
          <select name="city" className={inputClass} defaultValue="">
            <option value="" disabled>
              Pick one
            </option>
            <option value="Nairobi">Nairobi</option>
            <option value="Accra">Accra</option>
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="Neighbourhood">
          <input name="neighbourhood" maxLength={80} className={inputClass} />
        </Field>
      </div>
      <Field label="Service of interest">
        <select name="service" className={inputClass} defaultValue="">
          <option value="">Unsure / let ops decide</option>
          <option value="Long-term Management">Long-term Management</option>
          <option value="Short-stay / Airbnb">Short-stay / Airbnb</option>
          <option value="Tenant Finding">Tenant Finding</option>
          <option value="Property Sourcing">Property Sourcing</option>
        </select>
      </Field>
      <Field label="Notes for ops">
        <textarea
          name="notes"
          rows={3}
          maxLength={2000}
          className={inputClass}
          placeholder="Anything we should know before we call them. Best time, language preference, current arrangement, etc."
        />
      </Field>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}
      {done && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Got it. Ops will reach out within two business hours and your
          referral now appears in the list on the right.
        </p>
      )}

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Submitting…" : "Submit referral"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1">
      <span className="text-xs font-medium text-charcoal">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function optional(v: FormDataEntryValue | null): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length > 0 ? t : undefined;
}
