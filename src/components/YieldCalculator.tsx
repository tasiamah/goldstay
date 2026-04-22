"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { waLink } from "@/lib/site";

type City = "nairobi" | "accra";
type Bedrooms = "studio" | "1" | "2" | "3" | "4+";
type Mode = "long-term" | "short-stay";

// Baseline market rates per city per bedroom band (illustrative, tunable by ops).
// Long-term rent is MONTHLY in USD. Short-stay is AVG NIGHTLY in USD.
const rates: Record<
  City,
  Record<Bedrooms, { rent: number; nightly: number; occupancy: number }>
> = {
  nairobi: {
    studio: { rent: 550, nightly: 48, occupancy: 0.7 },
    "1": { rent: 800, nightly: 62, occupancy: 0.72 },
    "2": { rent: 1250, nightly: 85, occupancy: 0.72 },
    "3": { rent: 1800, nightly: 120, occupancy: 0.68 },
    "4+": { rent: 2600, nightly: 175, occupancy: 0.6 },
  },
  accra: {
    studio: { rent: 700, nightly: 55, occupancy: 0.66 },
    "1": { rent: 1050, nightly: 75, occupancy: 0.7 },
    "2": { rent: 1600, nightly: 110, occupancy: 0.72 },
    "3": { rent: 2300, nightly: 150, occupancy: 0.7 },
    "4+": { rent: 3200, nightly: 210, occupancy: 0.62 },
  },
};

// Premium tier multiplier (based on finish / building quality)
const tierMult: Record<"standard" | "premium" | "luxury", number> = {
  standard: 1,
  premium: 1.2,
  luxury: 1.45,
};

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.max(0, Math.round(n)));

export function YieldCalculator() {
  const [city, setCity] = useState<City>("nairobi");
  const [bedrooms, setBedrooms] = useState<Bedrooms>("2");
  const [tier, setTier] =
    useState<"standard" | "premium" | "luxury">("premium");
  const [mode, setMode] = useState<Mode>("short-stay");

  const result = useMemo(() => {
    const base = rates[city][bedrooms];
    const mult = tierMult[tier];

    if (mode === "long-term") {
      const gross = base.rent * mult;
      // Long-term management fee: 10% of collected rent.
      const fee = gross * 0.10;
      const net = gross - fee;
      return {
        gross,
        fee,
        netMonth: net,
        netYear: net * 12,
        feeLabel: "10%",
      };
    }
    // short-stay
    const nightly = base.nightly * mult;
    const nightsBooked = 30 * base.occupancy;
    const gross = nightly * nightsBooked;
    const platformFees = gross * 0.14; // platform + payment processing ~14%
    const cleaning = 260; // avg cleaning per month
    const fee = gross * 0.20;
    const net = gross - fee - platformFees - cleaning;
    return {
      gross,
      fee,
      platformFees,
      cleaning,
      netMonth: net,
      netYear: net * 12,
      feeLabel: "20%",
      nightly,
      occupancy: base.occupancy,
    };
  }, [city, bedrooms, tier, mode]);

  const segBtn = (active: boolean) =>
    `relative z-10 flex-1 rounded-full px-4 py-2 text-center text-sm font-medium transition-colors duration-300 ${
      active ? "text-cream" : "text-charcoal/70 hover:text-charcoal"
    }`;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
      {/* Controls */}
      <div className="rounded-3xl border border-charcoal/10 bg-cream p-6 sm:p-8 md:p-10">
        <div className="eyebrow">Yield estimator</div>
        <h2 className="mt-4 font-serif text-display-md balance">
          Estimate what your property could earn.
        </h2>
        <p className="mt-4 text-charcoal/70">
          Based on real market data from our managed portfolio in Nairobi and Accra.
          Numbers are illustrative. We&apos;ll send you a specific estimate within 48 hours.
        </p>

        {/* Mode toggle */}
        <div className="mt-8">
          <div className="eyebrow">Rental mode</div>
          <div className="relative mt-3 flex rounded-full border border-charcoal/10 bg-white/70 p-1">
            <motion.div
              className="absolute inset-y-1 w-[calc(50%-4px)] rounded-full bg-charcoal"
              animate={{ x: mode === "long-term" ? 0 : "100%" }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
            />
            <button
              type="button"
              onClick={() => setMode("long-term")}
              className={segBtn(mode === "long-term")}
            >
              Long-term
            </button>
            <button
              type="button"
              onClick={() => setMode("short-stay")}
              className={segBtn(mode === "short-stay")}
            >
              Short-stay
            </button>
          </div>
        </div>

        {/* City */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <label className="eyebrow">City</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value as City)}
              className="mt-3 block w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
            >
              <option value="nairobi">Nairobi</option>
              <option value="accra">Accra</option>
            </select>
          </div>
          <div>
            <label className="eyebrow">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value as Bedrooms)}
              className="mt-3 block w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-sm focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
            >
              <option value="studio">Studio</option>
              <option value="1">1 bedroom</option>
              <option value="2">2 bedrooms</option>
              <option value="3">3 bedrooms</option>
              <option value="4+">4+ bedrooms</option>
            </select>
          </div>
        </div>

        {/* Tier */}
        <div className="mt-8">
          <div className="eyebrow">Finish / tier</div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {(["standard", "premium", "luxury"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTier(t)}
                className={`rounded-xl border px-3 py-3 text-sm capitalize transition-all duration-300 ${
                  tier === t
                    ? "border-gold-500 bg-gold-500/10 text-charcoal"
                    : "border-charcoal/10 bg-white/50 text-charcoal/70 hover:border-charcoal/30"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-charcoal/55">
            Standard: mid-market finish. Premium: boutique apartment-hotel quality. Luxury: high-end serviced residence.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <a
            href={waLink(
              `Hi Goldstay, I used the yield calculator for a ${bedrooms}-bed ${tier} in ${city === "nairobi" ? "Nairobi" : "Accra"}. Can you send me a specific estimate?`,
              city,
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Get a specific estimate
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link href="/list-your-property" className="btn-secondary">
            List my property
          </Link>
        </div>
      </div>

      {/* Result */}
      <motion.div
        key={mode + city + bedrooms + tier}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl bg-charcoal p-6 text-cream sm:p-8 md:p-10"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-64 w-64 rounded-full bg-forest-700/40 blur-3xl" />

        <div className="relative">
          <div className="eyebrow text-gold-400">
            Estimated{" "}
            {mode === "long-term" ? "monthly rent" : "monthly short-stay revenue"}
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-serif text-display-lg text-cream">
              {currency(result.netMonth)}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest-xl text-cream/60">
              / month net
            </span>
          </div>

          <div className="mt-2 font-mono text-xs text-gold-400/90">
            ≈ {currency(result.netYear)} annual net, paid in USD
          </div>

          <div className="mt-10 space-y-3">
            <Row label="Gross revenue" value={currency(result.gross)} />
            {"nightly" in result && result.nightly ? (
              <Row
                label="Avg nightly rate"
                value={`${currency(result.nightly)} × ${Math.round((result.occupancy ?? 0) * 100)}% occupancy`}
                muted
              />
            ) : null}
            {"platformFees" in result && result.platformFees ? (
              <Row
                label="Platform + payment fees"
                value={`- ${currency(result.platformFees)}`}
                muted
              />
            ) : null}
            {"cleaning" in result && result.cleaning ? (
              <Row
                label="Cleaning"
                value={`- ${currency(result.cleaning)}`}
                muted
              />
            ) : null}
            <Row
              label={`Goldstay fee (${result.feeLabel})`}
              value={`- ${currency(result.fee)}`}
              muted
            />
            <div className="hairline my-4 bg-cream/10" />
            <Row
              label="Net to landlord"
              value={currency(result.netMonth)}
              strong
            />
          </div>

          <p className="mt-8 font-mono text-[0.7rem] uppercase tracking-widest-xl text-cream/50">
            Illustrative only. Actual yield depends on location, finish, seasonality and
            occupancy. We&apos;ll give you a property-specific estimate after assessment.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

function Row({
  label,
  value,
  muted,
  strong,
}: {
  label: string;
  value: string;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className={muted ? "text-cream/55" : "text-cream/80"}>{label}</span>
      <span
        className={
          strong
            ? "font-serif text-2xl text-gold-400 sm:text-3xl"
            : muted
              ? "text-cream/75"
              : "text-cream"
        }
      >
        {value}
      </span>
    </div>
  );
}
