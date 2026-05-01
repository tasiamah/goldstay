"use client";

import { useMemo, useState, type FormEvent } from "react";
import { calculateYield, formatUsd } from "@/lib/yield/calc";
import type { CalcInput, CalcResult, Strategy } from "@/lib/yield/calc";
import { NAIROBI_NEIGHBOURHOODS } from "@/lib/nairobi-neighbourhoods";

// Indicative neighbourhood mid-points keyed by city for the rent
// pre-fill. Sourced from the same bands surfaced on the city pages
// in src/lib/site.ts; we don't import that map directly because it
// only covers a subset, and we want a sensible default for any name
// the user picks from the dropdown.
const RENT_HINT_BY_CITY: Record<"nairobi" | "accra", number> = {
  nairobi: 1500,
  accra: 1400,
};

const ACCRA_NEIGHBOURHOODS = [
  "Adjiringanor",
  "Airport Residential",
  "Cantonments",
  "East Legon",
  "Labone",
  "Ridge",
  "Spintex",
  "Tema",
  "Trasacco",
  "Other",
];

type Status = "idle" | "submitting" | "success" | "error";

export function YieldCalculatorClient() {
  const [city, setCity] = useState<"nairobi" | "accra">("nairobi");
  const [neighbourhood, setNeighbourhood] = useState<string>("Westlands");
  const [bedrooms, setBedrooms] = useState<number>(2);
  const [monthlyRent, setMonthlyRent] = useState<number>(
    RENT_HINT_BY_CITY.nairobi,
  );
  const [strategy, setStrategy] = useState<Strategy>("long-term");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const result: CalcResult = useMemo(() => {
    return calculateYield({
      city,
      bedrooms,
      monthlyMarketRentUsd: monthlyRent || 1,
      strategy,
    });
  }, [city, bedrooms, monthlyRent, strategy]);

  const neighbourhoods =
    city === "nairobi"
      ? [...NAIROBI_NEIGHBOURHOODS, "Other"]
      : ACCRA_NEIGHBOURHOODS;

  function onCityChange(next: "nairobi" | "accra") {
    setCity(next);
    setNeighbourhood(next === "nairobi" ? "Westlands" : "East Legon");
    setMonthlyRent(RENT_HINT_BY_CITY[next]);
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg(null);
    try {
      const res = await fetch("/api/yield-report", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || undefined,
          phone: phone || undefined,
          city,
          neighbourhood,
          bedrooms,
          monthlyMarketRentUsd: monthlyRent,
          strategy,
        } satisfies CalcInput & {
          email: string;
          name?: string;
          phone?: string;
          neighbourhood?: string;
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `goldstay-yield-${city}-${bedrooms}br.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setStatus("success");
    } catch (err) {
      setErrorMsg((err as Error).message);
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_1fr]">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm md:p-8"
      >
        <h2 className="font-serif text-2xl text-charcoal">
          Tell us about the property
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Numbers update live. Enter your email and we&apos;ll generate a
          branded PDF you can keep, share or sanity-check against your current
          agent.
        </p>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          <Field label="City">
            <select
              value={city}
              onChange={(e) =>
                onCityChange(e.target.value as "nairobi" | "accra")
              }
              className={inputClass}
            >
              <option value="nairobi">Nairobi</option>
              <option value="accra">Accra</option>
            </select>
          </Field>
          <Field label="Neighbourhood">
            <select
              value={neighbourhood}
              onChange={(e) => setNeighbourhood(e.target.value)}
              className={inputClass}
            >
              {neighbourhoods.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Bedrooms">
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(Number(e.target.value))}
              className={inputClass}
            >
              {[0, 1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "Studio" : n === 5 ? "5+" : n}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Monthly market rent (USD)">
            <input
              type="number"
              min={100}
              max={20000}
              step={50}
              value={monthlyRent}
              onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
              className={inputClass}
            />
          </Field>
          <Field label="Strategy" full>
            <div className="flex gap-2">
              {(["long-term", "short-stay"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStrategy(s)}
                  className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                    strategy === s
                      ? "border-forest bg-forest text-cream"
                      : "border-stone-300 bg-white text-charcoal hover:border-forest/40"
                  }`}
                >
                  {s === "long-term" ? "Long-term let" : "Short-stay / Airbnb"}
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-6">
          <h3 className="font-serif text-xl text-charcoal">
            Where should we send your report?
          </h3>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Your name (optional)">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                autoComplete="name"
              />
            </Field>
            <Field label="Phone or WhatsApp (optional)">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                autoComplete="tel"
              />
            </Field>
            <Field label="Email" full>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                autoComplete="email"
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={status === "submitting" || !email}
            className="btn-primary mt-6 w-full sm:w-auto"
          >
            {status === "submitting"
              ? "Generating PDF…"
              : "Download my PDF report"}
          </button>
          {status === "error" && errorMsg && (
            <p className="mt-3 text-sm text-red-700">{errorMsg}</p>
          )}
          {status === "success" && (
            <p className="mt-3 text-sm text-forest">
              Your report is downloading. We&apos;ll be in touch shortly.
            </p>
          )}
        </div>
      </form>

      <ResultPanel result={result} />
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

function ResultPanel({ result }: { result: CalcResult }) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-cream-100 p-6 md:p-8">
      <div className="eyebrow text-gold-600">Indicative net yield</div>
      <div className="mt-2 grid gap-4 sm:grid-cols-2">
        <Card
          title="Self-managed today"
          amount={result.selfManaged.netMonthly}
          annual={result.selfManaged.netAnnual}
          tone="muted"
        />
        <Card
          title="With Goldstay"
          amount={result.goldstayManaged.netMonthly}
          annual={result.goldstayManaged.netAnnual}
          tone="forest"
        />
      </div>
      <div className="mt-6 rounded-xl bg-forest p-5 text-cream">
        <div className="text-xs uppercase tracking-wide text-cream/70">
          Estimated annual uplift
        </div>
        <div className="mt-1 font-serif text-3xl">
          +{formatUsd(result.annualUplift)}
        </div>
        <div className="mt-1 text-sm text-cream/80">
          {formatUsd(result.monthlyUplift)} more in your pocket every month,
          after our fee, after tax, after every cost.
        </div>
      </div>
      <p className="mt-5 text-xs text-stone-600">
        Numbers are indicative and not a guarantee. The downloadable PDF shows
        every assumption used in the model.
      </p>
    </div>
  );
}

function Card({
  title,
  amount,
  annual,
  tone,
}: {
  title: string;
  amount: number;
  annual: number;
  tone: "muted" | "forest";
}) {
  return (
    <div
      className={`rounded-xl border p-5 ${
        tone === "forest"
          ? "border-forest/20 bg-white"
          : "border-stone-200 bg-white/60"
      }`}
    >
      <div className="text-xs uppercase tracking-wide text-stone-600">
        {title}
      </div>
      <div
        className={`mt-1 font-serif text-2xl ${
          tone === "forest" ? "text-forest" : "text-charcoal"
        }`}
      >
        {formatUsd(amount)}
      </div>
      <div className="text-xs text-stone-600">
        / month · {formatUsd(annual)} / year
      </div>
    </div>
  );
}
