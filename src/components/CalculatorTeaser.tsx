import Link from "next/link";
import { ArrowRight, Calculator } from "lucide-react";
import { Reveal } from "./Reveal";

export function CalculatorTeaser() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-20 text-cream md:py-24">
      <div className="pointer-events-none absolute -left-24 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-gold-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 -bottom-10 h-80 w-80 rounded-full bg-forest-700/40 blur-3xl" />
      <div className="container-gs relative">
        <Reveal>
          <div className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center md:gap-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 font-mono text-[0.7rem] uppercase tracking-widest-xl text-gold-400">
                <Calculator className="h-3.5 w-3.5" /> New
              </div>
              <h2 className="mt-6 font-serif text-display-md balance md:text-display-lg">
                Know your property&apos;s{" "}
                <em className="italic text-gold-400">real</em> yield.
              </h2>
              <p className="mt-5 max-w-xl text-base text-cream/75 pretty md:text-lg">
                Two minutes. No sign-up. Based on what our managed portfolio actually earns
                in Nairobi and Accra. Get a working estimate now, a specific one within 48 hours.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/yield-calculator" className="btn-primary">
                  Open the calculator
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/list-your-property" className="btn-ghost-light">
                  Or talk to us →
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-cream/10 bg-cream/[0.04] p-6 backdrop-blur-sm sm:p-8">
              <div className="font-mono text-[0.7rem] uppercase tracking-widest-xl text-gold-400">
                Sample output
              </div>
              <div className="mt-4 flex items-baseline gap-3">
                <span className="font-serif text-5xl text-cream sm:text-6xl">
                  $1,850
                </span>
                <span className="font-mono text-xs text-cream/55">/ month net</span>
              </div>
              <div className="mt-2 font-mono text-xs text-gold-400/80">
                ≈ $22,200 annual net, paid in USD
              </div>
              <div className="mt-6 h-px w-full bg-cream/10" />
              <div className="mt-6 space-y-2 text-sm">
                <Row k="Mode" v="Short-stay" />
                <Row k="City" v="Nairobi" />
                <Row k="Bedrooms" v="2" />
                <Row k="Tier" v="Premium" />
                <Row k="Occupancy" v="72%" />
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-cream/55">{k}</span>
      <span className="text-cream/90">{v}</span>
    </div>
  );
}
