import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  MapPin,
  Users,
  Banknote,
  CalendarCheck,
  TriangleAlert,
  Camera,
  LineChart,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { CTABanner } from "./CTABanner";
import { FAQSection } from "./FAQSection";
import { BreadcrumbJsonLd, FaqJsonLd, ServiceJsonLd } from "./JsonLd";
import {
  cityTrail,
  neighbourhoodSlug,
  shortLetNeighbourhoods,
  site,
  waLink,
  type ShortLetNeighbourhood,
} from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";
import { postsForCountry } from "@/app/(marketing)/insights/posts";

// Service-plus-location landing page: "Airbnb management in Kilimani".
//
// The gap this fills is that /airbnb-management ranks for the service
// and /nairobi/kilimani ranks for the location, but nothing targeted
// the two together, which is how people actually search. Only
// neighbourhoods carrying real short-stay data get one of these, so the
// route is a handful of substantive pages rather than one template
// reprinted over every suburb in the city.
//
// Each page has to earn its URL. The nightly band, the occupancy band,
// the guest mix, the side-by-side against a long lease, the local note
// and the caveat are all per-neighbourhood, and the caveat especially:
// a page that admits Rosslyn is car-dependent and Parklands has a low
// rate ceiling is a page that says something the others do not.

// Articles that support this specific neighbourhood, so the page sits on
// top of the content cluster rather than beside it. Matched on the slug
// and tags rather than a hand-kept map, which would silently rot as the
// catalogue grows.
function supportingArticles(neighbourhoodName: string, limit = 4) {
  const needle = neighbourhoodSlug(neighbourhoodName);
  const posts = postsForCountry("kenya");

  const local = posts.filter(
    (p) =>
      p.meta.slug.includes(needle) ||
      p.meta.tags.some(
        (t) => t.toLowerCase() === neighbourhoodName.toLowerCase(),
      ),
  );

  // Topped up with the short-stay pillars so a thinly covered
  // neighbourhood still offers somewhere useful to go next.
  const pillars = posts.filter((p) =>
    [
      "airbnb-nairobi-complete-host-guide-2026",
      "airbnb-nairobi-pricing-strategy-2026",
      "how-much-can-you-earn-airbnb-nairobi-2026",
      "airbnb-nairobi-startup-costs-2026",
      "small-things-that-win-airbnb-reviews-nairobi",
    ].includes(p.meta.slug),
  );

  const seen = new Set<string>();
  const out: typeof posts = [];
  for (const p of [...local, ...pillars]) {
    if (seen.has(p.meta.slug)) continue;
    seen.add(p.meta.slug);
    out.push(p);
    if (out.length === limit) break;
  }
  return out;
}

const pillars = [
  {
    icon: Camera,
    title: "Listing & photography",
    body: "Professional photography, copywriting and launch across Airbnb, Booking.com and direct enquiries.",
  },
  {
    icon: LineChart,
    title: "Daily pricing",
    body: "Rates move with occupancy, events and season rather than sitting at one weekly number.",
  },
  {
    icon: MessageCircle,
    title: "Guests, end to end",
    body: "Screening, arrival instructions, security registration and every message in between.",
  },
  {
    icon: Sparkles,
    title: "Turnovers",
    body: "Cleaning to a written checklist, linen, consumables and the electricity meter topped up.",
  },
];

export function NeighbourhoodShortLetPage({
  neighbourhood,
}: {
  neighbourhood: ShortLetNeighbourhood;
}) {
  const { name, shortLet, twoBrUsd } = neighbourhood;
  const slug = neighbourhoodSlug(name);

  const domainCity = getServerCity();
  const baseUrl =
    domainCity === "nairobi"
      ? `https://${site.domains.nairobi}`
      : `https://${site.domain}`;
  const selfUrl = `${baseUrl}/nairobi/${slug}/airbnb-management`;

  // Gross revenue implied by the nightly and occupancy bands. Stated as
  // a band and labelled as gross, because the honest comparison against
  // a long lease is gross-to-gross: our 20% and the operating costs come
  // off this, exactly as 10% comes off the rent figure.
  const grossLow = Math.round(
    (shortLet.nightlyUsd.min * 30 * shortLet.occupancyPct.min) / 100,
  );
  const grossHigh = Math.round(
    (shortLet.nightlyUsd.max * 30 * shortLet.occupancyPct.max) / 100,
  );

  const others = shortLetNeighbourhoods("nairobi").filter(
    (n) => n.name !== name,
  );
  const articles = supportingArticles(name);

  // Neighbourhood-scoped FAQ. Reuses the real figures above so the
  // answers cannot drift from the page, and gets FAQPage schema, which
  // /airbnb-management itself still lacks.
  const faqs = [
    {
      q: `Is short-letting in ${name} better than a long lease?`,
      a: `On our numbers a well-presented 2-bed in ${name} grosses roughly USD ${grossLow.toLocaleString()} to ${grossHigh.toLocaleString()} a month short-let, against USD ${twoBrUsd.min.toLocaleString()} to ${twoBrUsd.max.toLocaleString()} on a long lease. Short-letting usually wins on gross and costs more to run, so the gap narrows after cleaning, consumables, utilities and furnishing. It is the right answer when the unit suits the guest mix here and you can fund the setup; a long lease is the right answer when you want a predictable figure and no operating exposure.`,
    },
    {
      q: `What occupancy should I expect in ${name}?`,
      a: `We plan on ${shortLet.occupancyPct.min}% to ${shortLet.occupancyPct.max}% across a full year in ${name}, not the headline figures you see quoted. ${shortLet.caveat}`,
    },
    {
      q: `Who actually books short stays in ${name}?`,
      a: `${shortLet.guests}. ${shortLet.note}`,
    },
    {
      q: `What does Goldstay charge for Airbnb management in ${name}?`,
      a: "20% of revenue collected, with no onboarding or listing fee. The only setup charge is professional photography where we judge it necessary, at USD 100 for a studio or one-bed and USD 150 for two bedrooms or more, payable in advance or deducted from your first payout.",
    },
    {
      q: `Will my building in ${name} allow short lets?`,
      a: `Not always, and it is the first thing to check rather than the last. A growing number of Nairobi buildings restrict or ban short lets in their house rules, and some cap the number of units that may operate one. We confirm the building's position before we list anything, and if it does not permit short-letting we will say so and put the unit on a long lease instead.`,
    },
  ];

  return (
    <>
      {/* cityTrail for the leading steps. The hardcoded "/nairobi"
          this replaced 308s to the root on goldstay.co.ke, so the
          trail carried a redirect in the middle and named the same
          page twice. */}
      <BreadcrumbJsonLd
        items={[
          ...cityTrail("nairobi", domainCity),
          { name, url: `${baseUrl}/nairobi/${slug}` },
          { name: "Airbnb Management", url: selfUrl },
        ]}
      />
      <ServiceJsonLd
        name={`Airbnb Management & Short-Stay in ${name}, Nairobi`}
        description={`Full short-stay management for ${name} apartments: photography, daily pricing, guest communication, turnover cleaning and maintenance, with monthly USD remittance to the landlord's foreign account.`}
        url={selfUrl}
        serviceType="Short-stay property management"
        areaServed={[name, "Nairobi"]}
        priceDescription="20% of revenue collected"
      />
      <FaqJsonLd items={faqs.map(({ q, a }) => ({ q, a }))} />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <Image
          src="/images/locations/nairobi.jpg"
          alt={`${name}, Nairobi, where Goldstay manages short-stay apartments`}
          fill
          priority
          sizes="100vw"
          quality={80}
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/75 via-charcoal/75 to-charcoal/95" />
        <div className="container-gs pb-20 md:pb-32">
          <Reveal>
            <div className="max-w-3xl">
              <Link
                href={`/nairobi/${slug}`}
                className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest-xl text-gold-400 hover:text-gold-300"
              >
                <MapPin className="h-3.5 w-3.5" />
                Kenya · Nairobi · {name}
              </Link>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                Airbnb management in <em className="italic">{name}</em>,
                Nairobi.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                A well-presented 2-bed in {name} takes USD{" "}
                {shortLet.nightlyUsd.min} to {shortLet.nightlyUsd.max} a night
                at {shortLet.occupancyPct.min}% to {shortLet.occupancyPct.max}%
                occupancy. Full short-term rental management: we run the
                listing, the pricing, the guests and the turnovers, and remit
                in USD on the 5th. You do nothing.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    `Hi Goldstay, I'd like to discuss short-letting my property in ${name}, Nairobi`,
                    "nairobi",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Talk about your {name} unit
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
            eyebrow={`${name} short-stay numbers`}
            title={`What a short let in ${name} actually takes.`}
            lede={`Indicative figures for a well-finished, well-photographed 2-bed in ${name}. Directional, not guarantees, and gross before our fee and operating costs.`}
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            <Reveal>
              <div className="card h-full">
                <Banknote className="h-6 w-6 text-gold-600" />
                <h3 className="mt-6 font-serif text-2xl">Nightly rate</h3>
                <p className="mt-2 font-mono text-lg text-charcoal">
                  USD {shortLet.nightlyUsd.min} to {shortLet.nightlyUsd.max} /
                  night
                </p>
                <p className="mt-3 text-sm text-charcoal/70">
                  What {name} units in good condition actually achieve once
                  pricing is managed daily rather than set weekly.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="card h-full">
                <CalendarCheck className="h-6 w-6 text-gold-600" />
                <h3 className="mt-6 font-serif text-2xl">Occupancy</h3>
                <p className="mt-2 font-mono text-lg text-charcoal">
                  {shortLet.occupancyPct.min}% to {shortLet.occupancyPct.max}%
                </p>
                <p className="mt-3 text-sm text-charcoal/70">
                  Across a full year in {name}, including the low season. We
                  plan on this rather than on a good month.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="card h-full">
                <Users className="h-6 w-6 text-gold-600" />
                <h3 className="mt-6 font-serif text-2xl">Who books</h3>
                <p className="mt-3 text-sm text-charcoal/70">
                  {shortLet.guests}.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal>
            <div className="mt-12 rounded-3xl border border-charcoal/10 bg-white/60 p-8 md:p-10">
              <h3 className="font-serif text-2xl">
                Short let or long lease in {name}?
              </h3>
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="eyebrow text-gold-700">Short let, gross</div>
                  <p className="mt-2 font-mono text-xl text-charcoal">
                    USD {grossLow.toLocaleString()} to{" "}
                    {grossHigh.toLocaleString()} / month
                  </p>
                  <p className="mt-2 text-sm text-charcoal/70">
                    Our fee is 20% of revenue. Cleaning, consumables, utilities
                    and furnishing come out of what is left.
                  </p>
                </div>
                <div>
                  <div className="eyebrow text-gold-700">Long lease, gross</div>
                  <p className="mt-2 font-mono text-xl text-charcoal">
                    USD {twoBrUsd.min.toLocaleString()} to{" "}
                    {twoBrUsd.max.toLocaleString()} / month
                  </p>
                  <p className="mt-2 text-sm text-charcoal/70">
                    Our fee is 10% of collected rent. Almost no operating cost,
                    one tenant, a predictable figure.
                  </p>
                </div>
              </div>
              <p className="mt-8 text-base leading-relaxed text-charcoal/80 pretty">
                Short-letting usually wins on gross and always costs more to
                run, so the real gap is narrower than these two lines suggest.
                We will tell you which one your specific unit suits, and we are
                happy to say a long lease, because a badly matched short let
                earns less than a good tenant and takes far more work. See{" "}
                <Link
                  href={`/nairobi/${slug}`}
                  className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
                >
                  long-term management in {name}
                </Link>
                .
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-gs max-w-4xl">
          <SectionHeader
            eyebrow={`What is specific about ${name}`}
            title={`${name} is not interchangeable with the rest of Nairobi.`}
          />
          <Reveal>
            <p className="mt-10 text-lg leading-relaxed text-charcoal/85 pretty">
              {shortLet.note}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="mt-8 flex gap-4 rounded-2xl border border-gold-500/30 bg-gold-50/60 p-6">
              <TriangleAlert className="h-6 w-6 shrink-0 text-gold-700" />
              <div>
                <div className="eyebrow text-gold-700">
                  What caps it in {name}
                </div>
                <p className="mt-2 text-base leading-relaxed text-charcoal/80 pretty">
                  {shortLet.caveat}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="What we run"
            title={`Everything a ${name} short let needs, handled.`}
            lede="The same operation on every managed unit, whichever neighbourhood it is in."
          />
          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.05}>
                <div className="card h-full">
                  <p.icon className="h-6 w-6 text-gold-600" />
                  <h3 className="mt-6 font-serif text-xl">{p.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="mt-10 text-center text-base text-charcoal/70">
              The full scope, the fee and the economics are set out on{" "}
              <Link
                href="/airbnb-management"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                our Airbnb management service page
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {articles.length > 0 && (
        <section className="section bg-white/50">
          <div className="container-gs">
            <SectionHeader
              eyebrow="Before you decide"
              title={`Reading that helps with ${name}.`}
              lede="Written by the team that runs these units, not by a content agency."
            />
            <div className="mt-14 grid gap-3 sm:grid-cols-2">
              {articles.map((p, i) => (
                <Reveal key={p.meta.slug} delay={i * 0.04}>
                  <Link
                    href={`/insights/${p.meta.slug}`}
                    className="group flex h-full items-start justify-between gap-4 rounded-2xl border border-charcoal/10 bg-cream px-6 py-5 transition-colors duration-300 hover:border-gold-500/40"
                  >
                    <span>
                      <span className="font-serif text-lg leading-snug">
                        {p.meta.title}
                      </span>
                      <span className="mt-1 block font-mono text-[0.65rem] uppercase tracking-widest text-charcoal/50">
                        {p.meta.readingMinutes} min read
                      </span>
                    </span>
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/60 transition-transform group-hover:translate-x-1">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {others.length > 0 && (
        <section className="section">
          <div className="container-gs">
            <SectionHeader
              eyebrow="Other Nairobi neighbourhoods"
              title="Where else we run short lets."
              lede={`We only publish a short-stay page for a neighbourhood where the numbers hold up. ${name} is one of ${others.length + 1}.`}
            />
            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((n, i) => (
                <Reveal key={n.name} delay={i * 0.04}>
                  <Link
                    href={`/nairobi/${neighbourhoodSlug(n.name)}/airbnb-management`}
                    className="group flex items-center justify-between rounded-2xl border border-charcoal/10 bg-cream px-6 py-5 transition-colors duration-300 hover:border-gold-500/40"
                  >
                    <span>
                      <span className="font-serif text-xl">{n.name}</span>
                      <span className="mt-1 block font-mono text-xs text-charcoal/50">
                        USD {n.shortLet.nightlyUsd.min} to{" "}
                        {n.shortLet.nightlyUsd.max} / night
                      </span>
                    </span>
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/60 transition-transform group-hover:translate-x-1">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <FAQSection
        items={faqs}
        eyebrow={`${name} questions`}
        title={`Short-letting in ${name}, answered.`}
      />
      <CTABanner
        headline={`Thinking about short-letting in ${name}?`}
        subheadline="Send us the building and the unit type. We will tell you what it should take and whether a long lease would serve you better."
        city="nairobi"
      />
    </>
  );
}
