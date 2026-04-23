"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "@/lib/toast";
import { useCurrentCity } from "@/lib/useCurrentCity";

// Lightweight tenant capture from /find-a-home. Deliberately short: we only
// ask for what an agent needs to reply with a shortlist. The deep dossier
// (employer, referees, ID, bank statement) only appears later at /apply
// once a specific property is in play and the tenant opts in.

type FormValues = {
  name: string;
  email: string;
  phone: string;
  city: "Nairobi" | "Accra" | "Other";
  stayType: "Long-term" | "Short-stay";
  budget?: string;
  bedrooms?: string;
  moveInWindow?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
  area?: string;
  notes?: string;
  consent: boolean;
};

export function WaitlistForm({
  defaultStayType = "Long-term",
  defaultCity,
  defaultCheckIn,
  defaultCheckOut,
  defaultGuests,
  compact = false,
}: {
  defaultStayType?: "Long-term" | "Short-stay";
  defaultCity?: "Nairobi" | "Accra" | "Other";
  defaultCheckIn?: string;
  defaultCheckOut?: string;
  defaultGuests?: string;
  compact?: boolean;
}) {
  const currentCity = useCurrentCity();
  const cityOptions: FormValues["city"][] =
    currentCity === "nairobi"
      ? ["Nairobi", "Other"]
      : currentCity === "accra"
        ? ["Accra", "Other"]
        : ["Nairobi", "Accra", "Other"];

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      stayType: defaultStayType,
      city:
        defaultCity ??
        (currentCity === "accra"
          ? "Accra"
          : currentCity === "nairobi"
            ? "Nairobi"
            : "Nairobi"),
      checkIn: defaultCheckIn,
      checkOut: defaultCheckOut,
      guests: defaultGuests,
    },
  });
  const [sent, setSent] = useState(false);

  const stayType = watch("stayType");

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/api/tenant-waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      setSent(true);
      reset();
      toast.success("You're on the waitlist. We'll be in touch within 24 hours.");
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again or WhatsApp us.";
      toast.error(message);
    }
  };

  const onInvalid = () => {
    toast.error("Please fill the required fields and tick the consent box.");
  };

  const field =
    "mt-2 block w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30";

  if (sent) {
    return (
      <div className="rounded-3xl border border-gold-500/40 bg-gold-500/10 p-8 text-charcoal sm:p-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold-500 text-charcoal">
          <Check className="h-5 w-5" />
        </div>
        <h3 className="mt-6 font-serif text-2xl sm:text-3xl">
          You&apos;re on the waitlist.
        </h3>
        <p className="mt-3 max-w-lg text-charcoal/75">
          We&apos;ll reply within 24 hours with homes that match. If something
          urgent comes up, message us directly on WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, onInvalid)}
      noValidate
      className={
        compact
          ? "grid gap-5 rounded-3xl border border-charcoal/10 bg-cream p-6 md:p-8"
          : "grid gap-6 rounded-3xl border border-charcoal/10 bg-cream p-6 md:p-10"
      }
    >
      <div>
        <div className="eyebrow">Join the tenant waitlist</div>
        <h3 className="mt-3 font-serif text-2xl sm:text-3xl">
          Tell us what you&apos;re looking for.
        </h3>
        <p className="mt-2 text-sm text-charcoal/70">
          We match new inventory to the waitlist before it goes public.
          Takes 60 seconds.
        </p>
      </div>

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
          <label className="eyebrow">Email</label>
          <input
            type="email"
            className={field}
            placeholder="you@example.com"
            {...register("email", { required: true })}
          />
          {errors.email ? (
            <p className="mt-1 text-xs text-red-700">Valid email required</p>
          ) : null}
        </div>
        <div>
          <label className="eyebrow">Phone / WhatsApp</label>
          <input
            className={field}
            placeholder="+254 7..."
            {...register("phone", { required: true })}
          />
        </div>
        <div>
          <label className="eyebrow">Stay type</label>
          <select className={field} {...register("stayType")}>
            <option>Long-term</option>
            <option>Short-stay</option>
          </select>
        </div>
        <div>
          <label className="eyebrow">City</label>
          <select className={field} {...register("city")}>
            {cityOptions.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="eyebrow">Bedrooms</label>
          <select className={field} {...register("bedrooms")}>
            <option value="">Any</option>
            <option>Studio</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4+</option>
          </select>
        </div>

        {stayType === "Long-term" ? (
          <>
            <div>
              <label className="eyebrow">Monthly budget (USD)</label>
              <input
                type="number"
                min={0}
                step={50}
                className={field}
                placeholder="e.g. 1800"
                {...register("budget")}
              />
            </div>
            <div>
              <label className="eyebrow">Move-in window</label>
              <select className={field} {...register("moveInWindow")}>
                <option value="">Flexible</option>
                <option>Immediately</option>
                <option>1 to 3 months</option>
                <option>3 to 6 months</option>
                <option>6+ months</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="eyebrow">Check-in</label>
              <input
                type="date"
                className={field}
                {...register("checkIn")}
              />
            </div>
            <div>
              <label className="eyebrow">Check-out</label>
              <input
                type="date"
                className={field}
                {...register("checkOut")}
              />
            </div>
            <div>
              <label className="eyebrow">Guests</label>
              <input
                type="number"
                min={1}
                max={20}
                className={field}
                placeholder="2"
                {...register("guests")}
              />
            </div>
            <div>
              <label className="eyebrow">Nightly budget (USD)</label>
              <input
                type="number"
                min={0}
                step={10}
                className={field}
                placeholder="e.g. 120"
                {...register("budget")}
              />
            </div>
          </>
        )}

        <div className="md:col-span-2">
          <label className="eyebrow">Neighbourhood preference (optional)</label>
          <input
            className={field}
            placeholder={
              currentCity === "accra"
                ? "e.g. East Legon, Airport Residential"
                : "e.g. Kilimani, Westlands"
            }
            {...register("area")}
          />
        </div>
        <div className="md:col-span-2">
          <label className="eyebrow">Anything else?</label>
          <textarea
            rows={3}
            className={field}
            placeholder="Pets, parking, work-from-home needs, employer relocation details…"
            {...register("notes")}
          />
        </div>
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-charcoal/70">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 rounded border-charcoal/30 text-gold-600 focus:ring-gold-500"
            {...register("consent", { required: true })}
          />
          <span>
            I&apos;m happy for Goldstay to contact me with matching homes.
            I&apos;ve read the{" "}
            <Link href="/privacy" className="underline hover:text-charcoal">
              privacy notice
            </Link>
            .
          </span>
        </label>
        {errors.consent ? (
          <p className="mt-2 pl-7 text-xs text-red-700">
            Please tick this box so we can reply to you.
          </p>
        ) : null}
      </div>

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
            "Join the waitlist"
          )}
        </button>
        <p className="text-xs text-charcoal/55">
          We reply within 24 hours. No spam, ever.
        </p>
      </div>
    </form>
  );
}
