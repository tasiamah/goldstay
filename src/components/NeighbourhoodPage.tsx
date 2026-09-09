import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  MapPin,
  Users,
  Banknote,
  ShieldCheck,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { CTABanner } from "./CTABanner";
import { FAQSection } from "./FAQSection";
import { CalculatorTeaser } from "./CalculatorTeaser";
import { BreadcrumbJsonLd, FaqJsonLd } from "./JsonLd";
import {
  cities,
  cityTrail,
  citySourcing,
  localizedFaq,
  neighbourhoodSlug,
  profiledNeighbourhoods,
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

  // Sibling areas that actually have a page, for the "where else we
  // operate" block. Internal cross-linking is the cheapest ranking
  // lever we have, but only to URLs that serve a 200 — this used to
  // link every neighbourhood in the city, most of which now redirect
  // to the areas page, and a link to a redirect wastes both the click
  // and the crawl.
  const others = profiledNeighbourhoods(city).filter(
    (n) => n.name !== neighbourhood.name,
  );

  // Area-specific answers where we have them, falling back to the
  // city list otherwise.
  //
  // The fallback used to be unconditional, which meant the same 373
  // words and the same FAQPage schema appeared on all eleven Nairobi
  // neighbourhood pages — the largest single contributor to those
  // pages measuring 88% identical to each other. An area with a
  // profile now answers its own questions, so the block that was pure
  // duplication becomes the part of the page least like its siblings.
  const faqItems = neighbourhood.profile?.faq ?? localizedFaq(city);

  // Tenant midpoint rent figure for the hero subheadline. Avoids the
  // copy reading like a min/max table; gives one number a human can
  // anchor on and the calculator below for anyone who wants the band.
  const midRent = Math.round(
    (neighbourhood.twoBrUsd.min + neighbourhood.twoBrUsd.max) / 2,
  );

  // What the rent band is measuring. Apartments almost everywhere, but
  // not in the standalone-house suburbs, where quoting apartment
  // comparables would contradict the profile further down the page.
  const benchmarkUnit = neighbourhood.benchmarkUnit ?? "2-bed apartments";

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
          ...cityTrail(city, domainCity),
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
                A well-finished 2-bedroom in {neighbourhood.name} typically lets
                to {neighbourhood.tenant.toLowerCase()} for about USD{" "}
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
              {/* Sibling short-let page, where one exists. This is a
                  long-let page, so a reader weighing nightly against a
                  lease needs somewhere to go, and it connects the two
                  page sets rather than leaving them isolated. */}
              {neighbourhood.shortLet ? (
                <p className="mt-8 text-sm text-cream/70">
                  Considering nightly bookings instead? See{" "}
                  <Link
                    href={`/${city}/${slug}/airbnb-management`}
                    className="underline decoration-gold-500 underline-offset-4 hover:text-gold-300"
                  >
                    Airbnb management in {neighbourhood.name}
                  </Link>
                  , with the rates and occupancy we actually see there.
                </p>
              ) : null}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs max-w-5xl">
          <SectionHeader
            eyebrow={`${neighbourhood.name} at a glance`}
            title={`What a Goldstay-managed home in ${neighbourhood.name} actually earns.`}
            lede={`Indicative figures from recently let, well-finished ${benchmarkUnit} in ${neighbourhood.name}. Directional, not guarantees.`}
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <Reveal>
              <div className="card h-full">
                <Banknote className="h-6 w-6 text-gold-600" />
                <h3 className="mt-6 font-serif text-2xl">Long-term rent</h3>
                <p className="mt-2 font-mono text-lg text-charcoal">
                  USD {neighbourhood.twoBrUsd.min.toLocaleString()} to USD{" "}
                  {neighbourhood.twoBrUsd.max.toLocaleString()} / month
                </p>
                <p className="mt-3 text-sm text-charcoal/70">
                  Recently let, well-finished {benchmarkUnit} in{" "}
                  {neighbourhood.name}. We collect in {c.currency}, remit in USD
                  on the 5th.
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
                  {sourcing.taxAuthority} returns, service charge, land rates
                  and any neighbourhood levies are paid from your collected rent
                  and itemised on every monthly statement.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* The substance, where an area has any. Four sections that are
          specific to this place by construction: what it is, who
          rents there, what the buildings are like and what goes
          wrong. An area without them does not get this page at all —
          see the `profile` comment in lib/site.ts. */}
      {neighbourhood.profile ? (
        <section className="section bg-white/50">
          <div className="container-gs max-w-3xl">
            <SectionHeader
              eyebrow={`Letting in ${neighbourhood.name}`}
              title={`What owning here is actually like.`}
              lede={`Written for a landlord deciding whether to buy, hold or re-let in ${neighbourhood.name} — including the parts that argue against it.`}
            />
            <div className="mt-14 space-y-12">
              <Prose
                heading={`${neighbourhood.name} itself`}
                body={neighbourhood.profile.character}
              />
              <Prose
                heading="Who rents here, and why"
                body={neighbourhood.profile.demand}
              />
              <Prose
                heading="The buildings"
                body={neighbourhood.profile.stock}
              />
              <Prose
                heading="What goes wrong"
                body={neighbourhood.profile.friction}
              />
            </div>
          </div>
        </section>
      ) : null}

      <CalculatorTeaser />

      {others.length > 0 && (
        <section className="section bg-white/50">
          <div className="container-gs">
            <SectionHeader
              eyebrow="Where else in the city"
              title={`Other ${cityName} areas we write about in this much detail.`}
              lede={`We manage in ${c.neighbourhoods.length} ${cityName} areas. These are the ones we know well enough to be this specific about — for the rent band and tenant mix in all of them, see the comparison below.`}
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
            <Reveal>
              <p className="mt-8 text-sm text-charcoal/70">
                <Link
                  href={`/${city}/areas`}
                  className="underline decoration-gold-500 underline-offset-4"
                >
                  All {c.neighbourhoods.length} {cityName} areas compared
                </Link>{" "}
                — two-bed rent bands, who rents in each, and where nightly
                letting earns more than a lease.
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* The accordion and the schema read from one list, passed
          explicitly. These 17 pages rendered the FAQ but emitted no
          FAQPage markup, so the answers were on the page and invisible
          to anything parsing it. Passing the list rather than letting
          FAQSection resolve its own also means the two cannot drift. */}
      <FaqJsonLd items={faqItems} />
      <FAQSection items={faqItems} />
      <CTABanner />
    </>
  );
}

function Prose({ heading, body }: { heading: string; body: string }) {
  return (
    <Reveal>
      <div>
        <h3 className="font-serif text-2xl text-charcoal">{heading}</h3>
        <p className="mt-4 text-charcoal/75 pretty">{body}</p>
      </div>
    </Reveal>
  );
}
