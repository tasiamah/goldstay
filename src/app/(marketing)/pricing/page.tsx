import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Ban, Check, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { CTABanner } from "@/components/CTABanner";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ReviewJsonLd,
} from "@/components/JsonLd";
import { alternateLanguagesFor, launchedCityPhrase, services, site, waLink } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// Pricing.
//
// The fees were already public, and that was the problem: they were
// spread across four service pages and a handful of FAQ answers, so
// nothing on the site answered "what does property management cost in
// Kenya" as its subject. A keyword audit of the built HTML found no
// commercial page targeting "property management fees", "property
// management cost", "airbnb management fees" or "how much do property
// managers charge" in a title or H1, while 33 of 47 candidate commercial
// phrases had no page at all.
//
// Fee queries are the highest-intent search in this market. Somebody
// asking the price has decided they want the service and is choosing a
// supplier. It is also the query we are best placed to win, because the
// competition mostly does not publish a number: a page that answers the
// question directly beats one that asks you to enquire, both in ranking
// and in the comparison the reader is actually making.
//
// One page for all four fees rather than a page per fee. Four thin
// pricing pages would compete with each other for the same query and
// none would carry the comparison that makes the numbers meaningful.
//
// Every figure here is read from `services` in site.ts or restates a
// commitment already made on a service page or in GuaranteesSection.
// Nothing is invented for this page, and nothing here should be edited
// without changing the source it came from.

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const cityPhrase =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : launchedCityPhrase();

  // Exact-match on the phrase people actually type. "Fees" beats
  // "pricing" as the head term for this query and leaves room for the
  // brand suffix inside the pixel budget.
  const title =
    city === "nairobi"
      ? "Property Management Fees Nairobi"
      : city === "accra"
        ? "Property Management Fees Accra"
        : `Property Management Fees in ${launchedCityPhrase()}`;

  return {
    title,
    description: `What property management costs in ${cityPhrase}: 10% of collected rent for long-term, 20% of revenue for Airbnb and short-stay, one month's rent for tenant finding only. No setup fee, no contractor commissions, no exit fee.`,
    alternates: {
      canonical: "/pricing",
      languages: alternateLanguagesFor("/pricing"),
    },
    openGraph: { title, type: "website" },
  };
}

// What the fee does not include, which is the half competitors leave
// unstated. Each line restates a commitment made in GuaranteesSection
// or on a service page.
const notCharged = [
  {
    title: "No setup or onboarding fee",
    body: "Taking a property on costs you nothing. The first money we make is a percentage of the first rent we collect for you.",
  },
  {
    title: "No commission from contractors or platforms",
    body: "We take nothing from plumbers, cleaners, agents or listing platforms. Our fee comes from you and it is the only money we make, which is why we have no reason to inflate a repair.",
  },
  {
    title: "No markup on maintenance",
    body: "You pay the invoice we pay. Every expense over USD 50 reaches your statement with a photo receipt and a vendor reference, and anything over USD 250 is approved by you in writing before we spend it.",
  },
  {
    title: "No exit fee and no claw-back",
    body: "Thirty days' notice ends it. We hand over the tenant relationship, the deposit and a full onboarding pack for whoever takes over.",
  },
];

// What the fee is answerable for. A percentage means little without the
// commitments attached to it, and these are the ones already published.
const backedBy = [
  "Miss a 48 hour response on any request and we waive that property's management fee for the month",
  "Net payout clears to your overseas account on the 5th, and we cover the delay charges if a bank holiday pushes the wire",
  "A long-term tenant we placed who defaults inside six months is replaced at our cost",
  "The 7.5% MRI rental tax is calculated, withheld and remitted to KRA by the 20th, with the receipt reference on your statement",
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

  // Answer-shaped on purpose. These are close to verbatim queries, so
  // the FAQ schema can be the thing an AI summary or a featured snippet
  // quotes rather than something it has to infer from prose.
  const faqs = [
    {
      q: `How much do property managers charge in ${cityName ?? "Kenya"}?`,
      a: "Goldstay charges 10% of collected rent for full long-term management and 20% of revenue for Airbnb and short-stay management. Tenant finding on its own is a one-time fee of one month's rent, and property sourcing for buyers is free. The market in Nairobi generally runs between 8% and 15% for long-term and 15% and 25% for short-stay, so we sit inside the normal band. The difference is what the percentage covers and what is added on top of it afterwards.",
    },
    {
      q: "What are your Airbnb management fees?",
      a: "20% of revenue, which covers listing creation and photography, dynamic pricing, guest screening and communication, turnover cleaning coordination, maintenance and a monthly revenue statement with a USD payout. There is no setup fee for building the listing and no commission taken from the cleaners or the platform.",
    },
    // The next three are phrased the way Google autocomplete in Kenya
    // actually completes them, not the way we would naturally write
    // them. "What is a reasonable property management fee", "what is
    // included in property management fee" and "do you have to pay
    // property management fees" are all real completions; the last one
    // in particular is somebody suspecting they are being charged for
    // nothing, which deserves a straight answer rather than a pitch.
    // Reproduce with `node scripts/harvest-queries.mjs`.
    {
      q: "What is a reasonable property management fee in Kenya?",
      a: "In Kenya, 8% to 15% of collected rent is the normal range for full long-term management and 15% to 25% of revenue for short-stay. Below about 8% the manager is almost certainly running a rent-collection service rather than managing anything, and above about 15% you should expect something specific in return and ask what it is. But the percentage on its own tells you very little. A 10% fee with a setup charge, a markup on every repair and a fee to leave costs more over a year than a 12% fee with none of those, so the only number worth comparing is the total you will actually pay.",
    },
    {
      q: "What is included in the property management fee?",
      a: "Our fee covers all of our labour: finding and vetting the tenant, the lease, rent collection and chasing arrears, inspections, coordinating and supervising repairs, the statutory tax filing and withholding, and the monthly statement and payout. What it does not cover is third-party money — repairs, utilities, service charge, insurance and taxes are yours, billed at exactly what we were charged with nothing added. Expenses over USD 50 come with a photo receipt and anything over USD 250 needs your written approval before we spend it.",
    },
    {
      q: "Do you have to pay property management fees if nothing happens?",
      a: "With us, no. Both management fees are a percentage of money actually collected, so a month with no rent and no bookings carries no fee. That is worth checking wherever you are comparing, because a fee charged on rent due rather than rent collected, or a flat monthly retainer, both keep charging you through a vacancy or a defaulting tenant. Ours does not, which means an empty month costs us what it costs you.",
    },
    {
      q: "Is there a setup or onboarding fee?",
      a: "No. Onboarding a property costs nothing, whichever service you take. The first payment we receive is our percentage of the first rent or booking revenue we collect for you.",
    },
    {
      q: "What is not included in the management fee?",
      a: "The fee buys our work, not third-party costs. Maintenance and repairs, utilities, service charge, insurance, statutory taxes and the cost of furnishing a short-stay unit are yours, billed at what we were charged with no markup. Expenses over USD 50 carry a photo receipt and anything over USD 250 needs your written approval first.",
    },
    {
      q: "How does that compare to other Nairobi property managers?",
      a: "On headline percentage we are unremarkable and we would rather say so. Nairobi long-term management generally runs 8% to 15% and short-stay 15% to 25%, and some managers publish those numbers while others will not quote until you call. Where the totals actually diverge is underneath the headline: a one-off setup or onboarding charge, a markup or commission on maintenance, a letting fee charged again at each renewal, or a fee payable on exit. We charge none of the four, and there are six written guarantees behind the percentage rather than only a service description. Those are the questions worth asking whoever you are comparing us with.",
    },
    {
      q: "Do you charge if the property sits empty?",
      a: "No. Both management fees are a percentage of money actually collected, so an empty month costs you nothing in fees. That is deliberate: it means a vacancy costs us too, and we have the same interest in ending it that you do.",
    },
    {
      q: "What does tenant finding cost on its own?",
      a: "A one-time fee of one month's rent, payable when the lease is signed and the tenant has moved in. Nothing is due if we do not place anyone, and there is no monthly charge afterwards because we are not managing the property. If you move onto full management later there is no re-onboarding fee.",
    },
    {
      q: "Are the fees different in Accra?",
      a: "The structure is the same. Ghana has its own tax treatment, including an 8% withholding on residential rental income rather than Kenya's 7.5% MRI, so the deductions on your statement differ even where our percentage does not.",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          { name: "Pricing", url: `${baseUrl}/pricing` },
        ]}
      />
      <ReviewJsonLd />
      <FaqJsonLd items={faqs} />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <Image
          src="/images/locations/nairobi.jpg"
          alt={`Residential apartment buildings in ${cityPhrase} of the kind Goldstay manages for landlords`}
          fill
          priority
          sizes="100vw"
          quality={80}
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/80 via-charcoal/75 to-charcoal/95" />
        <div className="container-gs pb-20 md:pb-32">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">
                Pricing · Published in full
              </div>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                What property management costs in{" "}
                <em className="italic">{cityPhrase}</em>.
              </h1>
              {/* Answers the query in the first sentence, before any
                  scrolling and before any argument. */}
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                Ten percent of collected rent for long-term management. Twenty
                percent of revenue for Airbnb and short-stay. One month&rsquo;s
                rent, once, if you only need a tenant found. Nothing at all to
                onboard a property, and nothing on the way out.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    "Hi Goldstay, I'd like to check what your fee would be for my property",
                    city ?? undefined,
                  )}
                  data-wa-source="pricing-hero"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Ask what your property would cost
                </a>
                <Link href="/yield-calculator" className="btn-ghost-light">
                  Or model the numbers →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="fees" className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="The four fees"
            title="Every service, and what it costs."
            lede="Read straight from the same source the rest of the site uses, so a number here cannot drift from a number on a service page."
          />
          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 0.05}>
                <div className="card flex h-full flex-col">
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-4xl text-charcoal">
                      {s.fee}
                    </span>
                    <span className="text-sm text-charcoal/60">
                      {s.feeLabel}
                    </span>
                  </div>
                  <h2 className="mt-4 font-serif text-2xl">{s.title}</h2>
                  <p className="mt-3 text-sm text-charcoal/70 pretty">
                    {s.blurb}
                  </p>
                  <ul className="mt-6 space-y-2">
                    {s.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        <span className="text-sm text-charcoal/75">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={s.detailHref}
                    className="mt-6 inline-flex items-center gap-1 self-start text-sm underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
                  >
                    {s.title} in detail →
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-gs max-w-4xl">
          <SectionHeader
            eyebrow="What it works out to"
            title="A worked example, so the percentage means something."
          />
          <Reveal>
            <p className="mt-10 text-lg leading-relaxed text-charcoal/85 pretty">
              Take a well-finished two-bedroom in Kilimani let long-term at USD
              1,500 a month. Our fee is USD 150 of that, and the remaining USD
              1,350 is yours before the 7.5% rental tax we withhold and remit
              for you, and before whatever the property genuinely costs to run
              that month. If the unit is empty, the fee is zero, because we
              charge on rent collected rather than on rent hoped for.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/85 pretty">
              We have deliberately not turned that into a projected annual
              return here. What the same unit would earn on nightly bookings
              depends on the neighbourhood, the finish and the season, and
              guessing at it on a pricing page would be marketing rather than
              information. The{" "}
              <Link
                href="/yield-calculator"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                yield calculator
              </Link>{" "}
              runs both strategies against real neighbourhood rates and sends
              you the workings.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="What the fee is not"
            title="The charges that are usually hiding underneath the percentage."
            lede="A headline rate only tells you something if you know what gets added to it later. These are the four additions we do not make."
          />
          <div className="mt-16 grid gap-5 md:grid-cols-2">
            {notCharged.map((n, i) => (
              <Reveal key={n.title} delay={i * 0.05}>
                <div className="card h-full">
                  <Ban className="h-6 w-6 text-gold-600" />
                  <h3 className="mt-6 font-serif text-2xl">{n.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70 pretty">
                    {n.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-gs max-w-4xl">
          <SectionHeader
            eyebrow="What backs it"
            title="A percentage is a promise or it is nothing."
          />
          <Reveal>
            <ul className="mt-10 space-y-3 text-base">
              {backedBy.map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
                    <ShieldCheck className="h-3 w-3" />
                  </span>
                  <span className="text-charcoal/80">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-8 text-lg leading-relaxed text-charcoal/85 pretty">
              All four are written into the management agreement you sign, not
              offered as reassurance in a sales conversation. You can read the
              rest of them on the{" "}
              <Link
                href="/#guarantees"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                guarantees
              </Link>{" "}
              section.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs max-w-4xl">
          {/* This section used to say "most managers will not give you a
              number until you enquire". That was written from an
              assumption and it does not survive checking: at least one
              Nairobi competitor publishes its short-stay fee on the page
              and argues for doing so in almost the same words we did.
              Claiming otherwise on our own pricing page would be the one
              kind of inaccuracy this page cannot afford. So the section
              now compares on the things that are actually checkable and
              actually different. */}
          <SectionHeader
            eyebrow="Why this page exists"
            title="Compare the whole number, not the headline one."
          />
          <Reveal>
            <p className="mt-10 text-lg leading-relaxed text-charcoal/85 pretty">
              Some managers in {cityPhrase} publish a fee and some will not give
              you one until you are in a conversation. Where a percentage is
              published, it is still only part of the price, and the parts that
              are missing are usually the same three: a one-off setup or
              onboarding charge, a markup or commission on maintenance, and
              something payable on the way out.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/85 pretty">
              So when you compare us against anyone else, compare those. Ask
              what onboarding costs, ask whether they take anything from
              contractors or listing platforms, and ask what leaving costs. Our
              answers are nothing, nothing and nothing, and they are in the
              management agreement rather than in this paragraph. Then ask what
              happens when they get it wrong, because a fee with no
              consequences attached to it is just a price. Ours has{" "}
              <Link
                href="/#guarantees"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                six written guarantees
              </Link>{" "}
              behind it, including a fee we waive when we miss our own response
              window. If you are still drawing up a shortlist, we have written
              the whole comparison out — including the eight questions worth
              asking every firm, and where we are the wrong answer — on{" "}
              <Link
                href="/property-management-companies-nairobi"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                comparing property management companies in {cityPhrase}
              </Link>
              .
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/85 pretty">
              For the detail on what each percentage buys, the{" "}
              <Link
                href="/long-term-management"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                long-term management
              </Link>{" "}
              and{" "}
              <Link
                href="/airbnb-management"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                Airbnb management
              </Link>{" "}
              pages set it out service by service.
            </p>
          </Reveal>
        </div>
      </section>

      <FAQSection
        items={faqs}
        eyebrow="Fees FAQ"
        title="What landlords ask about the money."
      />
      <TestimonialsSection />
      <CTABanner
        headline="Want to know what your property would cost?"
        subheadline="Tell us the area, the size and whether you are thinking long-term or nightly. We will tell you the fee and what it would realistically let for."
        city={city ?? undefined}
      />
    </>
  );
}
