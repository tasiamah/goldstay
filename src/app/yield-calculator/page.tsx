import type { Metadata } from "next";
import { YieldCalculator } from "@/components/YieldCalculator";
import { CTABanner } from "@/components/CTABanner";
import { getServerCity } from "@/lib/getServerCity";

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const cityPhrase =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : "Nairobi or Accra";

  return {
    title: "Yield Calculator",
    description: `Estimate what your ${cityPhrase} property could earn under Goldstay management. Long-term rent or short-stay revenue, in USD.`,
  };
}

export default function YieldCalculatorPage() {
  const city = getServerCity();
  const cityPhrase =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : "Nairobi and Accra";

  return (
    <>
      <section className="relative bg-cream pt-32 sm:pt-36 md:pt-40">
        <div className="container-gs">
          <div className="max-w-3xl">
            <div className="eyebrow">Know your numbers</div>
            <h1 className="mt-6 font-serif text-display-lg balance">
              What could your property <em className="italic text-gold-600">actually</em> earn?
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-charcoal/75 pretty">
              Two minutes. No sign-up. Based on real market data from our managed
              portfolio in {cityPhrase}. Get an illustrative number now, a
              specific one from our team within 48 hours.
            </p>
          </div>

          <div className="mt-16 md:mt-20">
            <YieldCalculator />
          </div>

          <div className="mt-20 grid gap-6 border-t border-charcoal/10 pt-10 md:grid-cols-3 md:gap-10">
            <Note
              n="01"
              title="Market data, not guesswork"
              body="Rates are based on what our managed units actually achieve in each city and neighbourhood."
            />
            <Note
              n="02"
              title="USD, paid monthly"
              body="Every figure you see is net of platform fees, cleaning costs and our management fee. No surprises."
            />
            <Note
              n="03"
              title="Updated quarterly"
              body="We refresh benchmark rates every quarter as the market moves. This estimator reflects the current cycle."
            />
          </div>
        </div>
      </section>

      <div className="h-20 md:h-28" />
      <CTABanner />
    </>
  );
}

function Note({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div>
      <div className="font-mono text-xs text-gold-600">{n}</div>
      <div className="mt-3 font-serif text-2xl">{title}</div>
      <p className="mt-3 text-sm text-charcoal/70">{body}</p>
    </div>
  );
}
