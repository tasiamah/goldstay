import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, Users, Banknote, ShieldCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { CTABanner } from "./CTABanner";
import { FAQSection } from "./FAQSection";
import { CalculatorTeaser } from "./CalculatorTeaser";
import { BreadcrumbJsonLd } from "./JsonLd";
import {
  cities,
  citySourcing,
  neighbourhoodSlug,
  site,
  waLink,
  type Neighbourhood,
} from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

type City = "nairobi" | "accra";

// Programmatic neighbourhood landing page. Each Nairobi / Accra
// neighbourhood already in the cities map gets a dedicated URL with
// unique copy keyed off its rent range and tenant profile, so we have
// a real page to rank for long-tail searches like "property
// management Kilimani" or "Airbnb management East Legon" instead of
// hoping the city page picks them up. The same component drives both
// markets to keep copy and structure consistent.
export function NeighbourhoodPage({
  city,
  neighbourhood,
}: {
  city: City;
  neighbourhood: Neighbourhood;
}) {
  const c = cities[city];
  const cityName = city === "nairobi" ? "Nairobi" : "Accra";
  const country = c.country;
  const sourcing = citySourcing[city];

  // Surface-aware base URL for breadcrumb absolute URLs. The "back to
  // city" link and inter-neighbourhood links use relative /<city>/...
  // paths on every host because the .co.ke / .com.gh root rewrite is
  // scoped to "/" only — /kilimani on .co.ke would 404.
  const domainCity = getServerCity();
  const baseUrl =
    domainCity === "nairobi"
      ? `https://${site.domains.nairobi}`
      : domainCity === "accra"
        ? `https://${site.domains.accra}`
        : `https://${site.domain}`;
  const cityHref = `/${city}`;
  const cityUrl = `${baseUrl}/${city}`;
  const slug = neighbourhoodSlug(neighbourhood.name);
  const selfUrl = `${baseUrl}/${city}/${slug}`;

  // Local hero photo. We don't ship per-neighbourhood photography yet,
  // so reuse the city skyline. When neighbourhood-specific shots arrive
  // (Kilimani at dusk, East Legon street, etc.) just drop them under
  // /public/images/locations/<city>-<slug>.jpg and update the lookup.
  const heroImage =
    city === "nairobi"
      ? "/images/locations/nairobi.jpg"
      : "/images/locations/accra.jpg";

  // Other neighbourhoods in the same city (excluding self) for the
  // "Where else we operate" footer block. Internal cross-linking is
  // the cheapest ranking lever we have once these pages exist.
  const others = c.neighbourhoods.filter((n) => n.name !== neighbourhood.name);

  // Tenant midpoint rent figure for the hero subheadline. Avoids the
  // copy reading like a min/max table; gives one number a human can
  // anchor on and the calculator below for anyone who wants the band.
  const midRent = Math.round(
    (neighbourhood.twoBrUsd.min + neighbourhood.twoBrUsd.max) / 2,
  );

  // Place schema scoped to this neighbourhood. We deliberately do not
  // emit a fresh LocalBusiness per neighbourhood (we operate one
  // business per city, not per neighbourhood) — Place + the city-level
  // LocalBusiness from JsonLd.tsx is the honest representation.
  const placeData = {
    "@context": "https://schema.org",
    "@type": "Place",
    name: `${neighbourhood.name}, ${cityName}`,
    url: selfUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: cityName,
      addressCountry: country,
    },
    containedInPlace: {
      "@type": "City",
      name: cityName,
      addressCountry: country,
    },
  };

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          { name: cityName, url: cityUrl },
          { name: neighbourhood.name, url: selfUrl },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeData) }}
      />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <Image
          src={heroImage}
          alt={`${neighbourhood.name}, ${cityName}. Goldstay property management area`}
          fill
          priority
          sizes="100vw"
          quality={80}
          className="-z-10 object-cover"
          style={{ objectPosition: city === "accra" ? "center 38%" : "center" }}
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/65 via-charcoal/70 to-charcoal/95" />
        <div className="container-gs pb-20 md:pb-32">
          <Reveal>
            <div className="max-w-3xl">
              <Link
                href={cityHref}
                className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest-xl text-gold-400 hover:text-gold-300"
              >
                <MapPin className="h-3.5 w-3.5" />
                {country} · {cityName}
              </Link>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                Property management in{" "}
                <em className="italic">{neighbourhood.name}</em>, {cityName}.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                A well-finished 2-bedroom in {neighbourhood.name} typically
                lets to {neighbourhood.tenant.toLowerCase()} for about USD{" "}
                {midRent.toLocaleString()} a month, wired to your foreign
                account on the 5th. We handle the tenant, the rent, the
                paperwork and the {country} taxes; you do nothing.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    `Hi Goldstay, I'd like to discuss managing my property in ${neighbourhood.name}, ${cityName}`,
                    city,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  List your {neighbourhood.name} property
                </a>
                <Link href="/yield-calculator" className="btn-ghost-light">
                  Estimate your yield →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs max-w-5xl">
          <SectionHeader
            eyebrow={`${neighbourhood.name} at a glance`}
            title={`What a Goldstay-managed home in ${neighbourhood.name} actually earns.`}
            lede={`Indicative figures from recently let, well-finished 2-bed apartments in ${neighbourhood.name}. Directional, not guarantees.`}
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <Reveal>
              <div className="card h-full">
                <Banknote className="h-6 w-6 text-gold-600" />
                <h3 className="mt-6 font-serif text-2xl">Long-term rent</h3>
                <p className="mt-2 font-mono text-lg text-charcoal">
                  USD {neighbourhood.twoBrUsd.min.toLocaleString()} to{" "}
                  USD {neighbourhood.twoBrUsd.max.toLocaleString()} / month
                </p>
                <p className="mt-3 text-sm text-charcoal/70">
                  Recently let, well-finished 2-bed apartments in{" "}
                  {neighbourhood.name}. We collect in {c.currency}, remit
                  in USD on the 5th.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="card h-full">
                <Users className="h-6 w-6 text-gold-600" />
                <h3 className="mt-6 font-serif text-2xl">Tenant profile</h3>
                <p className="mt-3 text-sm text-charcoal/70">
                  {neighbourhood.tenant}. We vet every applicant via ID,
                  employer, income, references and a face-to-face interview
                  before anything is signed.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card h-full">
                <ShieldCheck className="h-6 w-6 text-gold-600" />
                <h3 className="mt-6 font-serif text-2xl">Compliance</h3>
                <p className="mt-3 text-sm text-charcoal/70">
                  {sourcing.taxAuthority} returns, service charge, land
                  rates and any neighbourhood levies are paid from your
                  collected rent and itemised on every monthly statement.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CalculatorTeaser />

      {others.length > 0 && (
        <section className="section bg-white/50">
          <div className="container-gs">
            <SectionHeader
              eyebrow="Where else in the city"
              title={`Other ${cityName} neighbourhoods we manage.`}
              lede={`We focus on the ${cityName} neighbourhoods with the strongest diaspora tenant demand. ${neighbourhood.name} is one of ${c.neighbourhoods.length}.`}
            />
            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((n, i) => {
                const href = `/${city}/${neighbourhoodSlug(n.name)}`;
                return (
                  <Reveal key={n.name} delay={i * 0.04}>
                    <Link
                      href={href}
                      className="group flex items-center justify-between rounded-2xl border border-charcoal/10 bg-cream px-6 py-5 transition-colors duration-300 hover:border-gold-500/40"
                    >
                      <span className="font-serif text-xl">{n.name}</span>
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/60 transition-transform group-hover:translate-x-1">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </Link>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <FAQSection />
      <CTABanner />
    </>
  );
}
