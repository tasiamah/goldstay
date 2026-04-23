import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowDown } from "lucide-react";
import { waLink } from "@/lib/site";

export function Hero({
  eyebrow = "Nairobi · Accra",
  headline = (
    <>
      <em className="italic">Premium</em> property management in Nairobi
      &amp; Accra.
    </>
  ),
  subheadline = "We handle everything. You receive monthly USD transfers. Zero headaches.",
  city,
}: {
  eyebrow?: string;
  headline?: ReactNode;
  subheadline?: string;
  city?: "nairobi" | "accra";
}) {
  // On the neutral homepage the "2 Cities" stat is a truthful scope claim.
  // On a single-market city surface it reads as a contradiction ("this is a
  // Nairobi site, but we list 2 cities"), so we swap it for a city-relevant
  // number instead. Counts are intentionally hardcoded to keep the Hero a
  // pure client component without pulling the full `cities` map.
  const stats =
    city === "nairobi"
      ? [
          { k: "9", label: "Neighbourhoods" },
          { k: "USD", label: "Remittance" },
          { k: "24/7", label: "Support" },
        ]
      : city === "accra"
        ? [
            { k: "5", label: "Neighbourhoods" },
            { k: "USD", label: "Remittance" },
            { k: "24/7", label: "Support" },
          ]
        : [
            { k: "2", label: "Cities" },
            { k: "USD", label: "Remittance" },
            { k: "24/7", label: "Support" },
          ];

  // Reuse the same locally-hosted, verified city photos the homepage
  // LocationsSection cards use, so the hero on /nairobi and /accra feels
  // continuous with the rest of the site. The neutral homepage still uses
  // a remote Unsplash hero until we shoot our own dual-market top image.
  const heroImage =
    city === "accra"
      ? "/images/locations/accra.jpg"
      : city === "nairobi"
        ? "/images/locations/nairobi.jpg"
        : "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=2400&q=80";
  const heroPosition = city === "accra" ? "center 38%" : "center";

  return (
    <section className="relative min-h-screen min-h-[100svh] w-full overflow-hidden bg-charcoal text-cream">
      {/* Background hero image rendered via next/image with priority so it
          becomes the LCP element on first paint instead of a late-loading
          CSS background. fill + cover keeps the same visual as before. */}
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={80}
        className="-z-10 object-cover"
        style={{ objectPosition: heroPosition }}
      />
      {/* Legibility wash. Bottom-weighted so the skyline actually reads
          in the upper third while the headline and stats strip still
          have enough contrast in the lower two-thirds. The previous
          70→60→95 uniform wash turned the image into a brown blur and
          defeated the point of using a real skyline photo. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/25 via-charcoal/55 to-charcoal/90" />
      <div className="absolute inset-0 -z-10 grain opacity-30" />

      <div className="container-gs relative flex min-h-screen min-h-[100svh] flex-col items-center justify-center pb-36 pt-32 text-center sm:pt-40">
        <div className="hero-fade-up mx-auto w-full max-w-4xl">
          <div className="eyebrow text-gold-400">{eyebrow}</div>
          <h1 className="mt-6 font-serif text-display-xl text-cream balance">
            {headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
            {subheadline}
          </p>

          <div className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a
              href={waLink(
                city === "nairobi"
                  ? "Hi Goldstay, I'd like to discuss managing my property in Nairobi"
                  : city === "accra"
                    ? "Hi Goldstay, I'd like to discuss managing my property in Accra"
                    : "Hi Goldstay, I'd like to discuss managing my property",
                city,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              List Your Property
            </a>
            <Link href="#services" className="btn-ghost-light">
              Learn More
              <ArrowDown className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* stat strip, floats at the bottom without pulling the headline off-centre */}
      <div className="hero-fade-up-delay absolute inset-x-0 bottom-6 z-10 sm:bottom-10">
        <div className="container-gs">
          <div className="mx-auto grid max-w-3xl grid-cols-3 gap-4 border-t border-cream/15 pt-5 text-center sm:gap-6 sm:pt-8">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-serif text-2xl text-cream sm:text-3xl md:text-4xl">
                  {s.k}
                </div>
                <div className="mt-1 font-mono text-[0.6rem] uppercase tracking-widest-xl text-cream/60 sm:text-[0.7rem]">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
