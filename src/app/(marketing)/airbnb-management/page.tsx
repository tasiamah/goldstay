import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  Camera,
  LineChart,
  MessageCircle,
  Sparkles,
  Wrench,
  Receipt,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { CTABanner } from "@/components/CTABanner";
import { FAQSection } from "@/components/FAQSection";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
} from "@/components/JsonLd";
import {
  waLink,
  alternateLanguagesFor,
  site,
  shortLetNeighbourhoods,
  neighbourhoodSlug,
} from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// Short-stay specific FAQ. The page previously rendered the generic
// site-wide accordion and emitted no FAQPage schema at all, so it both
// answered the wrong questions and passed up the rich result.
const airbnbFaqs = [
  {
    q: "What do you charge for Airbnb management?",
    a: "20% of revenue collected. There is no onboarding fee, listing fee or exit fee. The only setup cost is professional photography where we judge it necessary, at USD 100 for a studio or one-bed and USD 150 for two bedrooms or more.",
  },
  {
    q: "How much more does short-letting earn than a long lease?",
    a: "In the Nairobi neighbourhoods we operate in, short-letting typically grosses 40 to 70% more than a long lease, and it costs considerably more to run once furnishing, cleaning, consumables, utilities and higher wear are counted. The neighbourhood pages set out the nightly rates and realistic occupancy area by area so you can compare gross against gross.",
  },
  {
    q: "What occupancy is realistic in Nairobi?",
    a: "We plan on 55% to 75% across a full year depending on the neighbourhood, not the headline numbers quoted elsewhere. Westlands and Parklands run highest because their demand is corporate and medical and holds midweek; the quieter suburbs run lower but with much longer stays.",
  },
  {
    q: "Will my building allow short lets?",
    a: "Not always, and it is the first thing to establish rather than the last. A growing number of Nairobi buildings restrict or ban short lets in their house rules, and some cap how many units may operate one. We confirm the building's position before listing, and if it does not permit short-letting we will tell you and put the unit on a long lease instead.",
  },
  {
    q: "Who handles guests, cleaning and problems at 2am?",
    a: "We do. Guest screening, every message, arrival and security registration, turnover cleaning to a written checklist, linen, consumables, the prepaid electricity meter and any maintenance that arises. You are not on the guest thread and you are not called at night.",
  },
  {
    q: "How and when do I get paid?",
    a: "Monthly, in USD, to your foreign account, with a statement itemising revenue by booking and every deduction against it. Our fee, platform fees and operating costs are shown separately rather than netted off invisibly.",
  },
  {
    q: "What about damage?",
    a: "Guests are screened before arrival, security deposits and the platform guarantee programmes apply, and we document the unit's condition between stays. Where damage does occur we pursue it through the platform and keep you informed in writing.",
  },
  {
    q: "Am I locked in?",
    a: "No. Thirty days' written notice ends the agreement with no exit fee, and the listing and its review history remain associated with your property.",
  },
];

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const cityPhrase =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : "Nairobi and Accra";

  // City goes in the title, not just the description. The query we are
  // competing for is "airbnb management nairobi" and the title is the
  // most heavily weighted element on the page; leaving the city out of
  // it while every competitor names it is the whole reason this page
  // sat on page two. The template appends " | Goldstay".
  const cityTitle =
    city === "nairobi"
      ? "Airbnb Management in Nairobi, Kenya"
      : city === "accra"
        ? "Airbnb Management in Accra, Ghana"
        : "Airbnb Management in Nairobi & Accra";

  return {
    title: cityTitle,
    description: `Full Airbnb and short-stay management in ${cityPhrase}. Photography, dynamic pricing, guest comms, cleaning and USD remittance. 20% of revenue.`,
    alternates: {
      canonical: "/airbnb-management",
      languages: alternateLanguagesFor("/airbnb-management"),
    },
  };
}

const pillars = [
  {
    icon: Camera,
    title: "Listing & Photography",
    body: "Professional photography, copywriting and listing launch across Airbnb, Booking.com and direct booking channels.",
  },
  {
    icon: LineChart,
    title: "Dynamic Pricing",
    body: "We adjust nightly rates daily using occupancy, events and seasonality. Static weekly prices leave money on the table.",
  },
  {
    icon: MessageCircle,
    title: "Guest Communication",
    body: "24/7 response. Pre-stay screening. Smart check-in. Local guidebooks. A concierge experience, not a DIY message thread.",
  },
  {
    icon: Sparkles,
    title: "Turnover Cleaning",
    body: "Vetted housekeeping teams, hotel-grade linen inventory, inspection checklists and amenity restocking between every stay.",
  },
  {
    icon: Wrench,
    title: "Maintenance & Compliance",
    body: "On-call handymen, safety inspections, linen rotation and full fire / CO compliance to protect your asset.",
  },
  {
    icon: Receipt,
    title: "Monthly USD Statements",
    body: "Transparent revenue statements with every booking, expense and fee itemised. Net USD wired to your bank.",
  },
];

export default function Page() {
  const city = getServerCity();
  const cityName =
    city === "nairobi" ? "Nairobi" : city === "accra" ? "Accra" : null;

  const baseUrl =
    city === "nairobi"
      ? `https://${site.domains.nairobi}`
      : city === "accra"
        ? `https://${site.domains.accra}`
        : `https://${site.domain}`;
  const areaServed =
    city === "nairobi"
      ? ["Nairobi"]
      : city === "accra"
        ? ["Accra"]
        : ["Nairobi", "Accra"];

  // Swap the two cross-market phrases that leak into the Accra/Kenya narrative
  // when viewed on a localized domain. Neutral .com still says "Nairobi & Accra".
  const reviewLine = cityName
    ? `Average review score 4.88 across our ${cityName} portfolio`
    : "Average review score 4.88 across Nairobi & Accra";
  const exampleUnit =
    city === "accra"
      ? "2-bed apartment, East Legon"
      : city === "nairobi"
        ? "2-bed apartment, Westlands"
        : "2-bed apartment, Westlands or East Legon";

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          {
            name: "Airbnb & Short-Stay Management",
            url: `${baseUrl}/airbnb-management`,
          },
        ]}
      />
      <ServiceJsonLd
        name="Airbnb & Short-Stay Management"
        description={`Full short-stay operations in ${areaServed.join(" and ")}: photography, dynamic pricing, guest communication, turnover cleaning and maintenance, with monthly USD remittance to the landlord's foreign account.`}
        url={`${baseUrl}/airbnb-management`}
        serviceType="Short-stay property management"
        areaServed={areaServed}
        priceDescription="20% of revenue collected"
      />
      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        {/* Hero image rendered via next/image with priority so it becomes
            the LCP element on first paint and is discoverable to image
            search. The previous CSS background-image was invisible to
            crawlers and skipped Next's image optimisation pipeline. */}
        <Image
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=80"
          alt={`Sunlit short-stay apartment interior, representative of Goldstay's Airbnb management portfolio in ${cityName ?? "Nairobi and Accra"}`}
          fill
          priority
          sizes="100vw"
          quality={80}
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/80 via-charcoal/70 to-charcoal/95" />
        <div className="container-gs pb-20 md:pb-32">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">Airbnb · Short-stay</div>
              {/* City named in the H1 as well as the title. Reads
                  naturally and puts the geo term in the second-heaviest
                  on-page element for a query that always carries it. */}
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                Turn your {cityName ? `${cityName} ` : ""}apartment into a{" "}
                <em className="italic">five-star</em> short-stay, without
                lifting a finger.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                We handle photography, pricing, guests, cleaning and
                maintenance. You get a monthly statement and a USD wire. Our fee
                is 20% of revenue. No listing fees, no setup fees, no surprises.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    "Hi Goldstay, I'd like to discuss Airbnb / short-stay management for my property",
                    city ?? undefined,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Get a yield estimate
                </a>
                <Link href="/list-your-property" className="btn-ghost-light">
                  Or use the form →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="Everything included"
            title="Six pillars of full-service short-stay management."
            lede="This is not a listing service. It's end-to-end operations, done to a hospitality standard."
          />
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="card h-full">
                  <p.icon className="h-6 w-6 text-gold-600" />
                  <h3 className="mt-6 font-serif text-2xl">{p.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-gs grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div>
              <div className="eyebrow">Yield vs long-term</div>
              <h2 className="mt-4 font-serif text-display-md balance">
                Short-stay typically yields 40 to 70% more than long-term in the
                neighbourhoods we operate in.
              </h2>
              <p className="mt-5 text-charcoal/75">
                But only if the operation is tight. Bad photos, flat pricing,
                slow guest replies and patchy cleaning destroy the economics
                instantly. We run it like a boutique hotel, not a side hustle.
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "Average occupancy 72%+ in our managed portfolio",
                  reviewLine,
                  "Full damage deposit cover via platform guarantees",
                  "No lock-in. 30 days notice to exit anytime.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
                      <Check className="h-3 w-3" />
                    </span>
                    <span className="text-charcoal/80">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-charcoal/10 bg-charcoal p-6 text-cream sm:p-8 md:p-10">
              <div className="eyebrow text-gold-400">
                Illustrative economics
              </div>
              <h3 className="mt-4 font-serif text-2xl sm:text-3xl">
                {exampleUnit}
              </h3>
              <ul className="mt-8 divide-y divide-cream/10 text-sm">
                {[
                  ["Nightly rate (avg)", "USD 85"],
                  ["Occupancy", "72%"],
                  ["Gross monthly revenue", "USD 1,836"],
                  ["Goldstay fee (20%)", "USD 367"],
                  ["Cleaning & platform fees", "USD 260"],
                ].map(([k, v]) => (
                  <li
                    key={k}
                    className="flex items-center justify-between gap-4 py-3"
                  >
                    <span className="text-cream/60">{k}</span>
                    <span className="text-right">{v}</span>
                  </li>
                ))}
                <li className="flex items-center justify-between gap-4 py-4">
                  <span className="text-cream">Net to landlord</span>
                  <span className="text-right font-serif text-xl text-gold-400 sm:text-2xl">
                    USD 1,209
                  </span>
                </li>
              </ul>
              <p className="mt-6 text-xs text-cream/50">
                Illustrative only. Actual yield depends on location, size,
                furnishing and season. We&apos;ll give you a specific estimate
                after assessment.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Neighbourhood breakdown. Sends the reader to the page that
          matches how they searched, and gives the service-plus-location
          pages the inbound links from the parent service page that make
          the cluster work in the first place. Nairobi only, since the
          short-stay data set is Nairobi for now. */}
      {city !== "accra" && (
        <section className="section bg-white/50">
          <div className="container-gs">
            <SectionHeader
              eyebrow="By neighbourhood"
              title="What a short let actually takes, area by area."
              lede="Nightly rates, realistic occupancy and the local catch, for the Nairobi neighbourhoods where short-letting genuinely works."
            />
            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {shortLetNeighbourhoods("nairobi").map((n, i) => (
                <Reveal key={n.name} delay={i * 0.04}>
                  <Link
                    href={`/nairobi/${neighbourhoodSlug(n.name)}/airbnb-management`}
                    className="group flex items-center justify-between rounded-2xl border border-charcoal/10 bg-cream px-6 py-5 transition-colors duration-300 hover:border-gold-500/40"
                  >
                    <span>
                      <span className="font-serif text-xl">{n.name}</span>
                      <span className="mt-1 block font-mono text-xs text-charcoal/50">
                        USD {n.shortLet.nightlyUsd.min} to{" "}
                        {n.shortLet.nightlyUsd.max} / night ·{" "}
                        {n.shortLet.occupancyPct.min}–
                        {n.shortLet.occupancyPct.max}%
                      </span>
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
            <p className="mt-10 text-center text-sm text-charcoal/60">
              Karen and Runda are missing on purpose. Both are standalone-house
              suburbs where nightly demand is thin and{" "}
              <Link
                href="/long-term-management"
                className="link-underline text-charcoal"
              >
                a long lease
              </Link>{" "}
              is the better business.
            </p>
          </div>
        </section>
      )}

      {/* FAQ schema. The accordion rendered here already but emitted no
          FAQPage markup, unlike the homepage and city pages. */}
      <FaqJsonLd items={airbnbFaqs} />
      <FAQSection items={airbnbFaqs} />
      <CTABanner
        headline="Ready to turn it into a short-stay?"
        subheadline="Get a specific yield estimate for your apartment within 48 hours."
        city={city ?? undefined}
      />
    </>
  );
}
