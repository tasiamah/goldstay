"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Check, Loader2 } from "lucide-react";
import { toast } from "@/lib/toast";
import { useCurrentCity } from "@/lib/useCurrentCity";
import {
  asksForSearchTerm,
  FOUND_VIA_OPTIONS,
} from "@/lib/lead-attribution";
import { readFirstTouch } from "@/components/LeadAttribution";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  country: string;
  city: "Nairobi" | "Accra" | "Other";
  neighbourhood?: string;
  propertyType: string;
  bedrooms: string;
  furnished: "Furnished" | "Unfurnished" | "Part-furnished";
  service:
    | "Long-term"
    | "Short-stay / Airbnb"
    | "Help me buy a property"
    | "Tenant finding only"
    | "Not sure";
  availability: string;
  notes?: string;
  consent: boolean;
  // Both optional and neither blocks submit. foundVia is a select,
  // searchTerm only appears when the answer is Google.
  foundVia?: string;
  searchTerm?: string;
};

// Diaspora destinations that make up the vast majority of Goldstay's landlord
// base, plus the two home countries (Kenya, Ghana) for locals who buy-to-let
// within the region. "Other" catches the long tail without asking the form
// to become a full ISO country list, which would wreck the layout. On a
// localized domain we drop the other home country (goldstay.co.ke shouldn't
// advertise Ghana; goldstay.com.gh shouldn't advertise Kenya) because that
// surface is marketed as a single-market brand.
const BASE_COUNTRIES = [
  "Australia",
  "Belgium",
  "Canada",
  "France",
  "Germany",
  "Ghana",
  "Ireland",
  "Kenya",
  "Netherlands",
  "Qatar",
  "Saudi Arabia",
  "South Africa",
  "Sweden",
  "Switzerland",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Other",
] as const;

// Bedrooms is collected separately so these options describe the asset class
// rather than the room count. Maisonette grouped with townhouse because they
// are functionally the same for management purposes in Nairobi and Accra.
const PROPERTY_TYPES = [
  "Studio",
  "Apartment",
  "Townhouse / Maisonette",
  "Villa / Detached house",
  "Penthouse",
  "Commercial / mixed use",
  "Other",
] as const;

// Time bands rather than a free-text date because "Q3 2026", "next month" and
// "when the current tenant leaves" are all useful to ops in the same bucket,
// and a bucket is easier to filter in Airtable than free text.
const AVAILABILITY_OPTIONS = [
  "Immediately",
  "Within 1 month",
  "1 to 3 months",
  "3 to 6 months",
  "More than 6 months",
  "Still being built",
] as const;

export function ListPropertyForm() {
  const currentCity = useCurrentCity();

  // On goldstay.co.ke we hide Ghana (the other home market), and on
  // goldstay.com.gh we hide Kenya. "Other" stays as the escape hatch for any
  // landlord whose residence country we didn't list.
  const countries = BASE_COUNTRIES.filter((c) => {
    if (currentCity === "nairobi" && c === "Ghana") return false;
    if (currentCity === "accra" && c === "Kenya") return false;
    return true;
  });

  // Only show the current market's city (plus "Other") when the visitor is on
  // a localized domain or a city path. On the neutral .com homepage we keep
  // both as first-class options.
  const cityOptions =
    currentCity === "nairobi"
      ? (["Nairobi", "Other"] as const)
      : currentCity === "accra"
        ? (["Accra", "Other"] as const)
        : (["Nairobi", "Accra", "Other"] as const);

  const defaultCity: FormValues["city"] =
    currentCity === "accra" ? "Accra" : "Nairobi";

  const neighbourhoodPlaceholder =
    currentCity === "nairobi"
      ? "e.g. Westlands, Kilimani, Lavington"
      : currentCity === "accra"
        ? "e.g. East Legon, Airport Residential, Cantonments"
        : "e.g. Westlands, Kilimani";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FormValues>({
    defaultValues: {
      city: defaultCity,
      furnished: "Furnished",
      service: "Not sure",
    },
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Conversion-funnel rule: ask for the minimum we need to call the
  // landlord back, hide everything else behind a deliberate click.
  // The four required fields below are the smallest set that lets ops
  // (a) reach the person, (b) know which market they're in, and
  // (c) decide whether to staff a Nairobi or Accra agent on the call.
  // Everything else (bedrooms, furnishing, availability, notes,
  // service preference) is useful-but-not-blocking; we surface it
  // under a "Tell us more" disclosure so a landlord who *wants* to
  // give context can, but a landlord who just wants a callback isn't
  // forced through 9 extra fields on mobile. Server contract is
  // unchanged: undefined fields just don't appear on the Resend email
  // or the Airtable row, both of which already tolerate that.
  const [moreOpen, setMoreOpen] = useState(false);
  // Drives the follow-up question, so it appears the moment "Google
  // search" is picked rather than after a blur.
  const foundVia = watch("foundVia");

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      // How they arrived, captured on the first page of the visit by
      // <LeadAttribution />. Read here rather than held in form state
      // because the landing page is usually not this page — the whole
      // value is in knowing which article or service page started it.
      //
      // Spread first so a malformed stored value can never overwrite
      // the landlord's own answers, and so a null block just means the
      // enquiry posts exactly as it did before.
      const firstTouch = readFirstTouch();
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          attribution: {
            ...(firstTouch ?? {}),
            foundVia: data.foundVia || null,
            // Discarded unless the answer was Google. Somebody can pick
            // "Google search", type a phrase, then change the answer to
            // "recommended by someone" — the input unmounts but
            // react-hook-form keeps the value, and posting it would
            // attribute a search term to a word-of-mouth lead.
            searchTerm: asksForSearchTerm(data.foundVia)
              ? data.searchTerm || null
              : null,
          },
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setSent(true);
      reset();
      toast.success("Enquiry sent. We'll call you within 2 hours.");
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again or WhatsApp us.";
      setError(message);
      toast.error(message);
    }
  };

  // Surfaces validation errors that would otherwise fail silently (most
  // commonly the consent checkbox, which react-hook-form blocks on without
  // firing onSubmit). Shows a toast so the user always gets feedback on
  // every submit click.
  const onInvalid = () => {
    toast.error("Please fill the required fields and tick the consent box.");
  };

  if (sent) {
    return (
      <div className="rounded-3xl border border-gold-500/40 bg-gold-500/10 p-10 text-charcoal">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-charcoal">
          <Check className="h-5 w-5" />
        </div>
        <h3 className="mt-6 font-serif text-3xl">Thank you.</h3>
        <p className="mt-3 max-w-lg text-charcoal/75">
          We&apos;ve received your enquiry. One of our team will call you within
          two hours during business hours, or early the next morning if outside
          those hours.
        </p>
      </div>
    );
  }

  const field =
    "mt-2 block w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30";

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      className="grid gap-6 rounded-3xl border border-charcoal/10 bg-cream p-6 md:p-10"
      noValidate
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="eyebrow">Your name</label>
          <input
            className={field}
            placeholder="Full name"
            {...register("name", { required: true })}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-red-700">Name required</p>
          ) : null}
        </div>
        <div>
          <label className="eyebrow">Phone / WhatsApp</label>
          <input
            className={field}
            placeholder="+44 7..."
            {...register("phone", { required: true })}
          />
          {errors.phone ? (
            <p className="mt-1 text-xs text-red-700">
              We need a number to call you back on.
            </p>
          ) : null}
        </div>
        <div>
          <label className="eyebrow">Country you live in</label>
          <select
            className={field}
            defaultValue=""
            {...register("country", { required: true })}
          >
            <option value="" disabled>
              Select your country
            </option>
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          {errors.country ? (
            <p className="mt-1 text-xs text-red-700">
              Please pick the country you live in.
            </p>
          ) : null}
        </div>
        <div>
          <label className="eyebrow">Property city</label>
          <select className={field} {...register("city", { required: true })}>
            {cityOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Left in the always-visible block rather than under "Tell us
            more", and it is the only optional field that gets that
            treatment. The reason is that it is the sole way we can ever
            learn an organic search term: Google strips the query from
            its referrer, so no tracking recovers it and the landlord
            typing it is the entire mechanism. Buried in a disclosure
            almost nobody opens, it would answer nothing.

            Cost is one tap on a select, and it blocks nothing. */}
        <div className="md:col-span-2">
          <label className="eyebrow" htmlFor="found-via">
            How did you find us?{" "}
            <span className="font-normal normal-case text-charcoal/55">
              optional
            </span>
          </label>
          <select
            id="found-via"
            className={field}
            defaultValue=""
            {...register("foundVia")}
          >
            <option value="">Prefer not to say</option>
            {FOUND_VIA_OPTIONS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>

        {/* Only for the search answer. Asking somebody who ticked
            "recommended by someone" what they typed into Google is how
            a form starts to feel like an interrogation. */}
        {asksForSearchTerm(foundVia) ? (
          <div className="md:col-span-2">
            <label className="eyebrow" htmlFor="search-term">
              What did you search for?
            </label>
            <input
              id="search-term"
              className={field}
              placeholder="e.g. property management nairobi"
              {...register("searchTerm")}
            />
            <p className="mt-1 text-xs text-charcoal/55">
              Genuinely useful to us — it tells us how landlords like you
              are looking, so we can be easier to find.
            </p>
          </div>
        ) : null}
      </div>

      <div className="border-t border-charcoal/10 pt-5">
        <button
          type="button"
          onClick={() => setMoreOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left text-sm text-charcoal/70 hover:text-charcoal"
          aria-expanded={moreOpen}
          aria-controls="list-property-more"
        >
          <span>
            <span className="font-medium text-charcoal">
              Tell us more (optional)
            </span>{" "}
            <span className="text-charcoal/55">
              speeds up the call, but not required.
            </span>
          </span>
          <span aria-hidden className="text-charcoal/55">
            {moreOpen ? "−" : "+"}
          </span>
        </button>

        {moreOpen ? (
          <div
            id="list-property-more"
            className="mt-5 grid gap-6 md:grid-cols-2"
          >
            <div>
              <label className="eyebrow">Email</label>
              <input
                type="email"
                className={field}
                placeholder="you@example.com"
                {...register("email")}
              />
              <p className="mt-1 text-xs text-charcoal/55">
                Helps us send a written summary after the call.
              </p>
            </div>
            <div>
              <label className="eyebrow">Neighbourhood</label>
              <input
                className={field}
                placeholder={neighbourhoodPlaceholder}
                {...register("neighbourhood")}
              />
            </div>
            <div>
              <label className="eyebrow">Property type</label>
              <select
                className={field}
                defaultValue=""
                {...register("propertyType")}
              >
                <option value="">Pick the property type</option>
                {PROPERTY_TYPES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="eyebrow">Bedrooms</label>
              <select
                className={field}
                defaultValue=""
                {...register("bedrooms")}
              >
                <option value="">Pick bedrooms</option>
                <option>Studio</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5+</option>
              </select>
            </div>
            <div>
              <label className="eyebrow">Furnishing</label>
              <select className={field} {...register("furnished")}>
                <option>Furnished</option>
                <option>Unfurnished</option>
                <option>Part-furnished</option>
              </select>
            </div>
            <div>
              <label className="eyebrow">Preferred service</label>
              <select className={field} {...register("service")}>
                <option>Not sure</option>
                <option>Long-term</option>
                <option>Short-stay / Airbnb</option>
                <option>Help me buy a property</option>
                <option>Tenant finding only</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="eyebrow">
                When is the property available?
              </label>
              <select
                className={field}
                defaultValue=""
                {...register("availability")}
              >
                <option value="">Select availability</option>
                {AVAILABILITY_OPTIONS.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="eyebrow">
                Anything else we should know?
              </label>
              <textarea
                rows={4}
                className={field}
                placeholder="Current tenant situation, previous agent, goals…"
                {...register("notes")}
              />
            </div>
          </div>
        ) : null}
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-charcoal/70">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-charcoal/30 text-gold-600 focus:ring-gold-500"
            {...register("consent", { required: true })}
          />
          <span>
            I&apos;m happy for Goldstay to contact me about my property
            enquiry. We won&apos;t share your details and we don&apos;t send
            marketing spam.
          </span>
        </label>
        {errors.consent ? (
          <p className="mt-2 pl-7 text-xs text-red-700">
            Please tick this box so we can reply to you.
          </p>
        ) : null}
      </div>

      {error ? (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            "Submit enquiry"
          )}
        </button>
        <p className="text-xs text-charcoal/55">
          We call back within 2 hours during business hours.
        </p>
      </div>
    </form>
  );
}
