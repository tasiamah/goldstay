import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { getServerCity } from "@/lib/getServerCity";
import { alternateLanguagesFor } from "@/lib/site";

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const cityPhrase =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : "Nairobi and Accra";

  return {
    title: "Buy Property with Goldstay",
    description: `Buy-side property sourcing for diaspora buyers in ${cityPhrase}. Search, inspection, negotiation, title verification and handover. Free for buyers.`,
    alternates: {
      canonical: "/property-sourcing",
      languages: alternateLanguagesFor("/property-sourcing"),
    },
  };
}

const allCards = [
  {
    key: "nairobi" as const,
    href: "/nairobi/buy",
    city: "Nairobi",
    country: "Kenya",
    image: "/images/locations/nairobi.jpg",
    blurb:
      "Kilimani, Westlands, Lavington and Karen. Title work at the Ministry of Lands.",
  },
  {
    key: "accra" as const,
    href: "/accra/buy",
    city: "Accra",
    country: "Ghana",
    image: "/images/locations/accra.jpg",
    blurb:
      "East Legon, Airport Residential, Cantonments and Labone. Full title chain verified at the Lands Commission.",
  },
];

export default function Page() {
  const city = getServerCity();

  // On a localized domain, only show that city's card. On neutral .com we
  // keep the full chooser so a diaspora buyer who hasn't decided yet can pick.
  const cards = city ? allCards.filter((c) => c.key === city) : allCards;

  const headline = city ? "Where in the city?" : "Where do you want to buy?";
  const lede = city
    ? "Property sourcing is a city-level service. Tap through for the neighbourhoods, the title process and the legal paperwork specific to your market."
    : "Property sourcing is a city-level service. The neighbourhoods, the title process and the legal paperwork are different in Nairobi and Accra, so the page you want is different too. Pick your city.";

  return (
    <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
      <div className="absolute inset-0 -z-10 grain opacity-40" />
      <div className="container-gs pb-20 md:pb-32">
        <Reveal>
          <div className="max-w-3xl">
            <div className="eyebrow text-gold-400">Property sourcing</div>
            <h1 className="mt-6 font-serif text-display-lg balance">
              {headline}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
              {lede}
            </p>
          </div>
        </Reveal>

        <div
          className={`mt-14 grid gap-6 ${cards.length > 1 ? "md:grid-cols-2" : ""}`}
        >
          {cards.map((c, i) => (
            <Reveal key={c.city} delay={i * 0.05}>
              <Link
                href={c.href}
                className="group relative block h-80 overflow-hidden rounded-3xl border border-white/10 shadow-lift"
              >
                {/* next/image with sizes hint so the same asset isn't shipped
                    full-resolution on mobile, and an alt that names the city
                    so the image is discoverable in image-search for "buy
                    property Nairobi" / "buy property Accra". */}
                <Image
                  src={c.image}
                  alt={`${c.city} skyline — Goldstay buy-side property sourcing in ${c.country}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/95 via-charcoal/55 to-charcoal/20" />
                <div className="relative flex h-full flex-col justify-end p-7 sm:p-8">
                  <div className="eyebrow text-gold-400">{c.country}</div>
                  <div className="mt-2 flex items-center justify-between gap-4">
                    <h2 className="font-serif text-3xl sm:text-4xl">
                      Buy in {c.city}
                    </h2>
                    <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold-500/40 bg-gold-500/10 text-gold-400 transition-transform group-hover:translate-x-1">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                  <p className="mt-3 max-w-md text-sm text-cream/80">
                    {c.blurb}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
