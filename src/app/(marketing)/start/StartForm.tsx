"use client";

import { useState, type FormEvent } from "react";
import type { LeadSource } from "@prisma/client";
import {
  PROPERTY_CITIES,
  RESIDENCE_COUNTRIES,
  SERVICE_OPTIONS,
  type PropertyCity,
} from "@/lib/lead-options";
import { NAIROBI_NEIGHBOURHOODS } from "@/lib/nairobi-neighbourhoods";
import { waLink } from "@/lib/site";

// The form behind the shareable /start link.
//
// Optimised for one situation: a landlord is mid-conversation with us on
// WhatsApp, on a phone, and has just been sent this link. That drives
// every choice here.
//
//   - Single column, large tap targets, native selects. No multi-step
//     wizard — a chat that goes quiet is a lost lead, so the whole form
//     has to be visibly finishable in one screen of scrolling.
//   - Email is optional. Lead.email is nullable for exactly this reason
//     and a WhatsApp-only landlord is the common case, not the edge one.
//     Phone is the required identifier because it's the channel we'll
//     actually reply on.
//   - Neighbourhood and bedrooms are asked even though they're optional,
//     because lead-enrichment scores on them; a lead that arrives with
//     "Kileleshwa, 2 bed" is tiered and SLA'd on landing instead of
//     waiting for an ops call to become useful.
//
// Posts to the same /api/lead endpoint as every other intake surface, so
// the ops email, the Airtable mirror and the Postgres row all behave
// identically to a website submission. Only the channel tag differs.

type Status = "idle" | "submitting" | "success" | "error";

const BEDROOM_OPTIONS = ["Studio", "1", "2", "3", "4", "5+"] as const;

const OTHER_NEIGHBOURHOOD = "Other / not listed";

export function StartForm({
  leadSource,
  defaultCity,
}: {
  leadSource: LeadSource;
  defaultCity: PropertyCity;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState<string>(RESIDENCE_COUNTRIES[0]);
  const [city, setCity] = useState<PropertyCity>(defaultCity);
  const [neighbourhood, setNeighbourhood] = useState("");
  const [otherNeighbourhood, setOtherNeighbourhood] = useState("");
  const [service, setService] = useState<string>(SERVICE_OPTIONS[0]);
  const [bedrooms, setBedrooms] = useState("");
  const [notes, setNotes] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // The curated dropdown only covers Nairobi, so Accra falls back to a
  // free-text box rather than showing an empty or wrong list.
  const showNairobiList = city === "Nairobi";
  const resolvedNeighbourhood =
    showNairobiList && neighbourhood === OTHER_NEIGHBOURHOOD
      ? otherNeighbourhood
      : neighbourhood;

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
          phone,
          email,
          country,
          city,
          neighbourhood: resolvedNeighbourhood,
          service,
          bedrooms,
          notes,
          // Human-readable attribution for the ops email and Airtable.
          source: `start:${leadSource.toLowerCase()}`,
          // The LeadSource enum the Postgres row is filed under.
          leadSource,
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      setStatus("success");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white p-7 shadow-soft">
        <div className="font-serif text-2xl text-charcoal">
          Got it, {name.split(" ")[0] || "thanks"}.
        </div>
        <p className="mt-3 text-charcoal/75 pretty">
          Your details are with the Goldstay team. We&apos;ll come back to
          you on{" "}
          <span className="font-medium text-charcoal">{phone}</span> within
          two business hours — usually much sooner.
        </p>
        <p className="mt-3 text-charcoal/75 pretty">
          Nothing else is needed from you right now. If you want to add
          anything in the meantime, just reply in the chat.
        </p>
        <a
          href={waLink("Hi Goldstay, I've just sent my property details")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-6 inline-flex"
        >
          Back to WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft sm:p-8"
    >
      <div className="grid gap-5">
        <Field label="Your name" hint="Required">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            autoComplete="name"
            placeholder="e.g. Amina Wanjiru"
          />
        </Field>

        <Field label="Phone or WhatsApp" hint="Required — this is how we reply">
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={inputClass}
            autoComplete="tel"
            inputMode="tel"
            placeholder="+254 7…"
          />
        </Field>

        <Field label="Email" hint="Optional">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
            autoComplete="email"
            inputMode="email"
            placeholder="For your statements later"
          />
        </Field>

        <Field label="Where do you live?">
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className={inputClass}
          >
            {RESIDENCE_COUNTRIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Which city is the property in?">
          <select
            value={city}
            onChange={(e) => {
              setCity(e.target.value as PropertyCity);
              // The neighbourhood options are city-specific, so a city
              // change has to clear a stale selection.
              setNeighbourhood("");
              setOtherNeighbourhood("");
            }}
            className={inputClass}
          >
            {PROPERTY_CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Neighbourhood" hint="Optional">
          {showNairobiList ? (
            <select
              value={neighbourhood}
              onChange={(e) => setNeighbourhood(e.target.value)}
              className={inputClass}
            >
              <option value="">Select an area…</option>
              {NAIROBI_NEIGHBOURHOODS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
              <option value={OTHER_NEIGHBOURHOOD}>
                {OTHER_NEIGHBOURHOOD}
              </option>
            </select>
          ) : (
            <input
              value={neighbourhood}
              onChange={(e) => setNeighbourhood(e.target.value)}
              className={inputClass}
              placeholder="e.g. Cantonments"
            />
          )}
        </Field>

        {showNairobiList && neighbourhood === OTHER_NEIGHBOURHOOD ? (
          <Field label="Which area?">
            <input
              value={otherNeighbourhood}
              onChange={(e) => setOtherNeighbourhood(e.target.value)}
              className={inputClass}
              placeholder="Type the area name"
            />
          </Field>
        ) : null}

        <Field label="What do you need from us?">
          <select
            value={service}
            onChange={(e) => setService(e.target.value)}
            className={inputClass}
          >
            {SERVICE_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Bedrooms" hint="Optional">
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className={inputClass}
          >
            <option value="">Not sure yet</option>
            {BEDROOM_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Anything else we should know?" hint="Optional">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className={inputClass}
            placeholder="Furnished? Currently tenanted? When is it free?"
          />
        </Field>

        <div>
          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn-primary w-full"
          >
            {status === "submitting" ? "Sending…" : "Send my details"}
          </button>
          {status === "error" && errorMsg ? (
            <p className="mt-3 text-sm text-red-700">
              {errorMsg}. Please try again, or send the details straight to us
              on WhatsApp.
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex flex-wrap items-baseline gap-x-2">
        <span className="text-sm font-medium text-charcoal">{label}</span>
        {hint ? (
          <span className="text-xs text-charcoal/50">{hint}</span>
        ) : null}
      </span>
      {children}
    </label>
  );
}

// Inputs are 16px on mobile on purpose: iOS Safari zooms the viewport
// on focus for anything smaller, which throws the landlord out of the
// layout mid-form.
const inputClass =
  "block w-full rounded-lg border border-stone-300 bg-white px-3.5 py-3 text-base text-charcoal shadow-sm focus:border-forest focus:outline-none focus:ring-2 focus:ring-forest/30";
