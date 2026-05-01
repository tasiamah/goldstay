"use client";

import { useState } from "react";

// Two-step form: collect referrer details → POST /api/refer/signup →
// show their referral link + dashboard URL inline so they can copy
// them immediately without waiting for the welcome email to land.
// The same details are emailed in case they tab away.

type Type = "AGENT" | "LANDLORD" | "PARTNER";

// Same visual treatment as the yield-calculator form. Kept inline
// rather than promoted to globals.css because every form on the
// site is small enough to redeclare and we want to evolve form
// styling per-surface for now.
const inputClass =
  "block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-charcoal shadow-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/30";

type Result = {
  code: string;
  dashboardUrl: string;
  referralUrl: string;
};

export function SignupForm({ presetType }: { presetType: Type }) {
  const [type, setType] = useState<Type>(presetType);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const data = new FormData(e.currentTarget);
    const payload = {
      type,
      fullName: String(data.get("fullName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      phone: optional(data.get("phone")),
      companyName: optional(data.get("companyName")),
      country: optional(data.get("country")),
    };
    try {
      const res = await fetch("/api/refer/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as
        | { ok: true; code: string; dashboardUrl: string; referralUrl: string }
        | { ok: false; error?: string };
      if (!res.ok || !("ok" in json) || !json.ok) {
        setError(
          ("error" in json && json.error) ||
            "Something went wrong on our side. Try again in a moment, or email leads@goldstay.co.ke.",
        );
        return;
      }
      setResult({
        code: json.code,
        dashboardUrl: json.dashboardUrl,
        referralUrl: json.referralUrl,
      });
    } catch (err) {
      setError(
        "Couldn't reach Goldstay. Check your connection and try again.",
      );
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return <SuccessPanel result={result} />;
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-5 rounded-2xl bg-white p-6 shadow-soft md:p-8"
    >
      <fieldset className="grid gap-2">
        <legend className="font-serif text-lg text-charcoal">
          I&rsquo;m signing up as a&hellip;
        </legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-3">
          {(
            [
              ["AGENT", "Agent / broker"],
              ["LANDLORD", "Existing landlord"],
              ["PARTNER", "Partner / other"],
            ] as const
          ).map(([value, label]) => (
            <label
              key={value}
              className={`cursor-pointer rounded-lg border px-4 py-3 text-sm transition ${
                type === value
                  ? "border-gold-500 bg-gold-50 text-charcoal"
                  : "border-stone-200 bg-white text-stone-600 hover:border-stone-300"
              }`}
            >
              <input
                type="radio"
                name="type"
                value={value}
                checked={type === value}
                onChange={() => setType(value)}
                className="sr-only"
              />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Full name" required>
        <input
          name="fullName"
          required
          minLength={2}
          maxLength={120}
          autoComplete="name"
          className={inputClass}
        />
      </Field>

      <Field label="Email" required>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          className={inputClass}
        />
      </Field>

      <Field label="Phone (optional)">
        <input
          name="phone"
          type="tel"
          maxLength={40}
          autoComplete="tel"
          className={inputClass}
        />
      </Field>

      <Field label="Company / agency (optional)">
        <input name="companyName" maxLength={120} className={inputClass} />
      </Field>

      <Field label="Country you're based in (optional)">
        <input
          name="country"
          maxLength={80}
          placeholder="e.g. United Kingdom"
          className={inputClass}
        />
      </Field>

      {error && (
        <p className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Signing you up…" : "Generate my referral link"}
        </button>
        <p className="text-xs text-stone-500">
          By signing up you agree to be paid only on real, collected
          management fees from landlords you introduce.
        </p>
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
    <label className="grid gap-1.5">
      <span className="text-sm font-medium text-charcoal">
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

function SuccessPanel({ result }: { result: Result }) {
  return (
    <div className="grid gap-6 rounded-2xl bg-white p-6 shadow-soft md:p-8">
      <div>
        <div className="eyebrow text-gold-600">You&rsquo;re in</div>
        <h2 className="mt-2 font-serif text-2xl text-charcoal md:text-3xl">
          Your referral link is live
        </h2>
        <p className="mt-3 text-sm text-stone-600">
          We&rsquo;ve also emailed both URLs to you. Bookmark the dashboard
          link &mdash; it&rsquo;s the only way back in.
        </p>
      </div>

      <Copyable label="Your referral link" value={result.referralUrl} />
      <Copyable label="Your private dashboard" value={result.dashboardUrl} />

      <div className="rounded-xl bg-cream-100 p-5 text-sm text-stone-700">
        <p>
          <strong>Code:</strong>{" "}
          <span className="font-mono">{result.code}</span>
        </p>
        <p className="mt-2">
          Share the link, or open the dashboard now to submit a landlord
          directly &mdash; useful when you already have the landlord&rsquo;s
          contact details and don&rsquo;t want to wait for them to click.
        </p>
      </div>

      <a href={result.dashboardUrl} className="btn-primary self-start">
        Open my dashboard →
      </a>
    </div>
  );
}

function Copyable({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="grid gap-1.5">
      <span className="text-sm font-medium text-charcoal">{label}</span>
      <div className="flex items-stretch gap-2">
        <input
          readOnly
          value={value}
          className={`${inputClass} flex-1 font-mono text-xs`}
          onFocus={(e) => e.currentTarget.select()}
        />
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            } catch {
              // Clipboard API can be blocked; user can still
              // select-all + ctrl-c on the readonly input.
            }
          }}
          className="rounded-md border border-stone-200 px-3 py-2 text-sm text-charcoal hover:bg-cream-100"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
