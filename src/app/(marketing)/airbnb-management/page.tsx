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
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { KeyFacts } from "@/components/KeyFacts";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
  ReviewJsonLd,
} from "@/components/JsonLd";
import { alternateLanguagesFor, launchedCityPhrase, neighbourhoodSlug, shortLetNeighbourhoods, site, waLink } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// Short-stay specific FAQ. The page previously rendered the generic
// site-wide accordion and emitted no FAQPage schema at all, so it both
// answered the wrong questions and passed up the rich result.
const airbnbFaqs = [
  // The first two answer questions the site had no words for at all.
  // A keyword audit of the built HTML found "co-host", "co-hosting" and
  // "cohost" absent from every page and every article, along with
  // "serviced apartment management", "holiday home management" and
  // "furnished apartment management". Co-host is Airbnb's own term, so
  // it is what a host calls the thing they are looking for, and the
  // others are what the same service is called by owners who do not
  // think of their property as an Airbnb.
  {
    q: "Do you work as an Airbnb co-host?",
    a: "Yes. Co-hosting is what this service is, in Airbnb's own vocabulary: your listing stays on your account and we run it, handling the calendar, pricing, guest messaging, check-ins, cleaning turnovers and maintenance. We can either be added as a co-host on your existing listing or build the listing from scratch if there is not one yet. The fee is the same 20% of revenue either way.",
  },
  // "Airbnb agent" was absent from the entire site, money pages and
  // all 379 articles, until Sep 2026. We said manager and co-host and
  // never agent, which is the word a good share of Nairobi owners
  // actually use, and on 10 Sep the top result for "airbnb agents in
  // nairobi" was a competitor's Instagram profile with 840 followers.
  // A social profile outranking every website on a commercial query
  // means Google could not find a page that answers it.
  {
    q: "Are you an Airbnb agent or an Airbnb management company?",
    a: "In Nairobi they are two names for the same job and owners use them interchangeably. An Airbnb agent, a short-stay agent, a co-host and an Airbnb management company all describe someone who runs a furnished unit on your behalf: the listing, the nightly pricing, guest screening and messaging, check-ins, turnover cleaning and the money. The label tells you nothing useful. What separates firms is whether the listing stays on your account or moves to theirs, whether the fee is charged on revenue collected or on something more flattering, and whether you get an itemised monthly statement or a figure in a message. Ours stays on your account, the fee is 20% of revenue collected, and the statement is itemised.",
  },
  {
    q: "Do you manage serviced apartments, holiday homes and furnished lets too?",
    a: "They are the same operation under different names, and yes. Whether it is marketed as a serviced apartment, a holiday home, a furnished short let or an Airbnb, the work is a furnished unit let by the night or the week, and it is run the same way. What changes is the channel mix: some units earn better on direct and corporate bookings than on Airbnb, and we list wherever the demand for that address actually is.",
  },
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
  // Operators, who are the majority of the short-let book but were a
  // reader this page addressed nowhere: everything above says "your
  // property" and "your title". The answer routes them rather than
  // trying to serve both audiences in one page, and states the
  // consent condition here rather than leaving it to be discovered.
  {
    q: "I do not own the property, I lease it. Can you still manage it?",
    a: "Yes, and it is now most of our short-let book. The model is variously called rent-to-rent, rental arbitrage or Airbnb arbitrage, and it is entirely legitimate provided the owner has given written permission to sublet and to appoint us. We ask to see that permission and will not take a unit on without it, because we would be the visible party in any dispute and half of what we do is act for landlords. We can also help you obtain it, since we already manage long-term property for owners in the same buildings. See our page on management for operators for the detail.",
  },
];

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const cityPhrase =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : launchedCityPhrase();

  // Built from harvested Google autocomplete for Kenya rather than
  // from a guess. Run `node scripts/harvest-queries.mjs` to reproduce.
  //
  // Typing "airbnb management" in Kenya completes first to "airbnb
  // management companies in kenya", then "airbnb management", then
  // "airbnb management services", then "airbnb management company".
  // So the country term outranks the city term on this service, and
  // "company" is a real modifier. This title carries all three of
  // "airbnb management company", "airbnb management nairobi" and
  // "airbnb management kenya" at 503px against a ~600px budget.
  //
  // "Short-let" came out. It was added on the assumption that it was a
  // synonym worth claiming, and autocomplete returns it for nothing at
  // all in Kenya: the everyday term is "furnished", the trade term is
  // "serviced", and "short let" is British. It was costing title
  // weight for a phrase nobody types. Same story for "co-host", which
  // is why that stayed in the FAQ and never went in a title.
  const cityTitle =
    city === "nairobi"
      ? "Airbnb Management Company Nairobi, Kenya"
      : city === "accra"
        ? "Airbnb Management Company Accra, Ghana"
        : `Airbnb Management Company in ${launchedCityPhrase()}`;

  return {
    title: cityTitle,
    // The old description listed the service — photography, pricing,
    // guest comms, cleaning — and closed on "20% of revenue".
    //
    // On the results page for "nairobi airbnb management" that put a
    // bare 20% directly beneath a competitor's snippet reading "18%
    // fee of net booking revenue", so a landlord comparing the two
    // saw us as the dearer option before reading anything about why.
    // The service list was no help either: every competitor on that
    // page claims the same five things.
    //
    // This leads with the thing none of them offer — rent remitted in
    // USD to an account outside the country — and frames the fee as
    // what it actually is. Their 18% is a headline rate; our 20% has
    // no setup fee, no exit fee, no cut of the cleaners and no charge
    // at all in a month without bookings, which is the comparison we
    // would rather a landlord make.
    description: `Airbnb management in ${cityPhrase}, with your rent remitted in USD. 20% of revenue — no setup fee, no exit fee, and nothing in a month with no bookings.`,
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
    body: "Professional photography, copywriting and listing launch across Airbnb, Booking.com, Expedia and direct booking channels.",
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
  const cityPhrase = cityName ?? launchedCityPhrase();

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
  // when viewed on a localized domain. Neutral .com still says launchedCityPhrase().
  const reviewLine = cityName
    ? `Average review score 4.88 across our ${cityName} portfolio`
    : `Average review score 4.88 across ${launchedCityPhrase()}`;
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
            name: "Airbnb Management & Short-Stay",
            url: `${baseUrl}/airbnb-management`,
          },
        ]}
      />
      <ReviewJsonLd />
      <ServiceJsonLd
        name="Airbnb Management & Short-Stay"
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
          alt={`Sunlit short-stay apartment interior, representative of Goldstay's Airbnb management portfolio in ${cityName ?? launchedCityPhrase()}`}
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
              {/* Service and city both named, in the words the query
                  uses. The city was already here; the service was not.
                  "Turn your Nairobi apartment into a five-star
                  short-stay" put the geo term in the second-heaviest
                  on-page element and left the thing being sold out of
                  it entirely, so the H1 supported the location half of
                  "airbnb management nairobi" and none of the rest.

                  The comparison that prompted this: /long-term-management
                  and /pricing both open by naming the service the way it
                  is searched, and on 9 Sep both sat at position 1. This
                  page led with a benefit and sat at 13. One day of data
                  is not proof, but the on-page principle does not depend
                  on it, and the promise is kept rather than dropped —
                  "without lifting a finger" is the half of the old line
                  that was doing the persuading. */}
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                Airbnb management{cityName ? ` in ${cityName}` : ""},{" "}
                <em className="italic">without lifting a finger</em>.
              </h1>
              {/* The service named the way people search for it.
                  "Short-term rental management" appeared nowhere on the
                  site before this — not on this page, not on any other
                  service page — despite being the commonest unbranded
                  name for what we sell. Somebody who does not think in
                  terms of Airbnb-the-brand searches for this phrase, and
                  we were invisible to them.

                  The fee came out of the hero because this page already
                  states it eight times, including a dedicated pricing
                  panel below, the FAQ and the meta description, where
                  leading with the number is deliberate — see the comment
                  on `description`. Losing it here costs no transparency
                  and buys the line back for coverage. */}
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                Full short-term rental management in {cityPhrase}:
                photography, nightly pricing, guest screening, changeover
                cleaning and maintenance between stays. You get a monthly
                statement and a USD wire to your account abroad.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    "Hi Goldstay, I'd like to discuss Airbnb management for my property",
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

      {/* Answer-first summary, immediately below the hero. The page
          previously made a reader assemble the fee, the payout terms
          and the exit terms from three separate sections, and gave the
          answer engines no single quotable paragraph defining the
          service at all. Both problems are the same problem. */}
      <KeyFacts
        question={`What is Airbnb management in ${cityName ?? "Kenya"}, and what does it cost?`}
        answer={`Airbnb management, also called short-term rental management, short-let management or co-hosting, is a service where a company runs your furnished property as a short-stay rental on your behalf: listing and photography, nightly pricing, guest screening and messaging, check-in, turnover cleaning, consumables and maintenance. Goldstay charges 20% of the revenue collected for this in ${cityPhrase}, with no onboarding fee, no listing fee and no exit fee, and pays the net to your overseas account in USD each month against an itemised statement.`}
        facts={[
          { label: "Management fee", value: "20% of revenue collected" },
          { label: "Onboarding fee", value: "None" },
          {
            label: "Setup cost",
            value: "Photography only, USD 100 to 150, where needed",
          },
          {
            label: "Contractor commissions",
            value: "None taken, ever",
          },
          { label: "Payout", value: "Monthly, in USD, to a foreign account" },
          { label: "Exit terms", value: "30 days' notice, no exit fee" },
          {
            label: "Realistic occupancy",
            value: "55% to 75% over a full year, by neighbourhood",
          },
          {
            label: "Best suited to",
            value: cityName
              ? `Furnished apartments in ${cityName}`
              : `Furnished apartments in ${launchedCityPhrase()}`,
          },
        ]}
        footnote="Every figure here is the figure you would be quoted on a call, and each one is written into the management agreement rather than described on a website."
      />

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
      <TestimonialsSection />
      <CTABanner
        headline="Ready to turn it into a short-stay?"
        subheadline="Get a specific yield estimate for your apartment within 48 hours."
        city={city ?? undefined}
      />
    </>
  );
}
