"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Check, Loader2 } from "lucide-react";

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
};

export function ListPropertyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      city: "Nairobi",
      furnished: "Furnished",
      service: "Not sure",
    },
  });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: FormValues) => {
    setError(null);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(await res.text());
      setSent(true);
      reset();
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Something went wrong. Please try again or WhatsApp us.",
      );
    }
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
      onSubmit={handleSubmit(onSubmit)}
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
            placeholder="+44 7..."
            {...register("phone", { required: true })}
          />
        </div>
        <div>
          <label className="eyebrow">Country you live in</label>
          <input
            className={field}
            placeholder="UK, USA, UAE, Canada…"
            {...register("country", { required: true })}
          />
        </div>
        <div>
          <label className="eyebrow">Property city</label>
          <select className={field} {...register("city", { required: true })}>
            <option>Nairobi</option>
            <option>Accra</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="eyebrow">Neighbourhood</label>
          <input
            className={field}
            placeholder="e.g. Westlands, East Legon"
            {...register("neighbourhood")}
          />
        </div>
        <div>
          <label className="eyebrow">Property type</label>
          <input
            className={field}
            placeholder="Apartment, townhouse, villa…"
            {...register("propertyType", { required: true })}
          />
        </div>
        <div>
          <label className="eyebrow">Bedrooms</label>
          <select
            className={field}
            {...register("bedrooms", { required: true })}
          >
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
            <option>Long-term</option>
            <option>Short-stay / Airbnb</option>
            <option>Help me buy a property</option>
            <option>Tenant finding only</option>
            <option>Not sure</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="eyebrow">When is the property available?</label>
          <input
            className={field}
            placeholder="Immediately, next month, still being built…"
            {...register("availability", { required: true })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="eyebrow">Anything else we should know?</label>
          <textarea
            rows={4}
            className={field}
            placeholder="Current tenant situation, previous agent, goals…"
            {...register("notes")}
          />
        </div>
      </div>

      <label className="flex items-start gap-3 text-sm text-charcoal/70">
        <input
          type="checkbox"
          className="mt-1 h-4 w-4 rounded border-charcoal/30 text-gold-600 focus:ring-gold-500"
          {...register("consent", { required: true })}
        />
        <span>
          I&apos;m happy for Goldstay to contact me about my property enquiry.
          We won&apos;t share your details and we don&apos;t send marketing
          spam.
        </span>
      </label>

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
