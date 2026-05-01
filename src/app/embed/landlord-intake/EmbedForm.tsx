"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";

// Compact embeddable landlord intake form. Posts to /api/lead with
// a Source of "embed:<partner>" so ops can attribute every signed
// landlord back to the partner site that referred them. The form
// itself is intentionally smaller than the canonical /list-your-property
// version: 6 fields, no react-hook-form, no toast — embedding in
// someone else's page means we own less of the visual budget.

type Status = "idle" | "submitting" | "success" | "error";

const COUNTRIES = [
  "Australia",
  "Canada",
  "Germany",
  "Ghana",
  "Ireland",
  "Kenya",
  "Netherlands",
  "Qatar",
  "Saudi Arabia",
  "South Africa",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Other",
];

const SERVICES = [
  "Long-term",
  "Short-stay / Airbnb",
  "Help me buy a property",
  "Tenant finding only",
  "Not sure",
];

export function EmbedForm({ partner }: { partner: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("United Kingdom");
  const [city, setCity] = useState<"Nairobi" | "Accra">("Nairobi");
  const [service, setService] = useState(SERVICES[0]!);
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const rootRef = useRef<HTMLDivElement | null>(null);

  // Auto-resize: tell the parent window what height we need so it can
  // size the iframe. Cheap, browser-supported postMessage handshake;
  // the loader script in /embed/landlord-intake.js listens for it.
  useEffect(() => {
    const send = () => {
      if (!rootRef.current) return;
      const height = rootRef.current.scrollHeight;
      window.parent?.postMessage(
        { type: "goldstay-embed-resize", height },
        "*",
      );
    };
    send();
    const ro = new ResizeObserver(send);
    if (rootRef.current) ro.observe(rootRef.current);
    return () => ro.disconnect();
  }, [status]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          country,
          city,
          service,
          notes,
          source: `embed:${partner}`,
        }),
      });
      if (!res.ok) {
        throw new Error(`Request failed (${res.status})`);
      }
      setStatus("success");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStatus("error");
    }
  }

  return (
    <div
      ref={rootRef}
      className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft md:p-8"
    >
      <div className="eyebrow text-gold-600">Goldstay landlord intake</div>
      <h1 className="mt-2 font-serif text-2xl text-charcoal">
        Tell us about your property
      </h1>
      <p className="mt-2 text-sm text-stone-600">
        We&apos;ll call you within two business hours.
      </p>

      {status === "success" ? (
        <div className="mt-6 rounded-xl bg-forest p-5 text-cream">
          <div className="font-serif text-lg">Thank you.</div>
          <p className="mt-1 text-sm text-cream/85">
            A Goldstay specialist will be in touch shortly. Keep an eye on
            your inbox and WhatsApp.
          </p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Your name" full>
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              autoComplete="name"
            />
          </Field>
          <Field label="Email">
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              autoComplete="email"
            />
          </Field>
          <Field label="Phone or WhatsApp">
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              autoComplete="tel"
            />
          </Field>
          <Field label="Where do you live?">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className={inputClass}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Property city">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value as "Nairobi" | "Accra")}
              className={inputClass}
            >
              <option value="Nairobi">Nairobi</option>
              <option value="Accra">Accra</option>
            </select>
          </Field>
          <Field label="What do you need?" full>
            <select
              value={service}
              onChange={(e) => setService(e.target.value)}
              className={inputClass}
            >
              {SERVICES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Anything else? (optional)" full>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className={inputClass}
            />
          </Field>

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary w-full"
            >
              {status === "submitting" ? "Sending…" : "Send to Goldstay"}
            </button>
            {status === "error" && errorMsg && (
              <p className="mt-3 text-sm text-red-700">{errorMsg}</p>
            )}
            <p className="mt-3 text-xs text-stone-500">
              Submissions are handled by Goldstay (A TADCO Company) ·
              leads@goldstay.co.ke
            </p>
          </div>
        </form>
      )}
    </div>
  );
}

function Field({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-stone-600">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputClass =
  "block w-full rounded-lg border border-stone-300 bg-white px-3 py-2 text-charcoal shadow-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/30";
