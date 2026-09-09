import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  FileSignature,
  Banknote,
  Wrench,
  Receipt,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { CTABanner } from "@/components/CTABanner";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { KeyFacts } from "@/components/KeyFacts";
import { CalculatorTeaser } from "@/components/CalculatorTeaser";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
  ReviewJsonLd,
} from "@/components/JsonLd";
import {
  waLink,
  alternateLanguagesFor,
  site,
  cities,
  neighbourhoodSlug,
  profiledNeighbourhoods,
} from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// Long-term management service page.
//
// This service was in the services array with a 10% fee and a feature
// list, and had no detailHref and therefore no page. It is the larger
// half of the business by unit count and every query for it landed on
// the homepage anchor, which cannot rank for "property management
// nairobi" the way a dedicated page can.

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const cityPhrase =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : "Nairobi and Accra";

  // "Rental management" rather than "property management" on purpose.
  // The city page already owns "property management {city}", so both
  // pages competing for it meant Google picking between them on every
  // search. This targets "rental management nairobi", which is a real
  // query that had no page at all, and describes the long-let service
  // more precisely than the head term does.
  const title =
    city === "nairobi"
      ? "Long-Term Rental Management Nairobi"
      : city === "accra"
        ? "Long-Term Rental Management Accra"
        : "Long-Term Rental Management in Nairobi & Accra";

  return {
    title,
    description: `Full long-term property management in ${cityPhrase} for landlords abroad. Tenant vetting, lease drafting, rent collection, maintenance and monthly USD remittance. 10% of collected rent.`,
    alternates: {
      canonical: "/long-term-management",
      languages: alternateLanguagesFor("/long-term-management"),
    },
    openGraph: { title, type: "website" },
  };
}

const pillars = [
  {
    icon: UserCheck,
    title: "Tenant sourcing & vetting",
    body: "We market the unit, shortlist applicants and verify each one on ID, employer, income, references and a face-to-face interview before anything is signed.",
  },
  {
    icon: FileSignature,
    title: "Lease drafting",
    body: "A lease written by our property lawyers, in your name, with the deposit, escalation, notice and repair obligations set out properly rather than copied off a template.",
  },
  {
    icon: Banknote,
    title: "Rent collection & USD payout",
    body: "We collect locally, deduct what is due, and wire the balance to your foreign account on the 5th of each month. You never chase a tenant.",
  },
  {
    icon: Wrench,
    title: "Maintenance",
    body: "Routine and emergency repairs coordinated with vetted trades, quoted before we commit, and approved by you above an agreed threshold.",
  },
  {
    icon: Receipt,
    title: "Statements & compliance",
    body: "A monthly statement itemising rent, expenses, service charge, land rates and tax, so the year-end return is a download rather than a reconstruction.",
  },
  {
    icon: ShieldCheck,
    title: "Inspections & handover",
    body: "Move-in and move-out inventories with photographs, plus periodic inspections, so deposit disputes are settled by evidence rather than argument.",
  },
];

export default function Page() {
  const city = getServerCity();
  const cityName =
    city === "nairobi" ? "Nairobi" : city === "accra" ? "Accra" : null;
  const cityPhrase = cityName ?? "Nairobi & Accra";

  const baseUrl =
    city === "nairobi"
      ? `https://${site.domains.nairobi}`
      : city === "accra"
        ? `https://${site.domains.accra}`
        : `https://${site.domain}`;
  const areaServed = cityName ? [cityName] : ["Nairobi", "Accra"];

  const c = city === "accra" ? cities.accra : cities.nairobi;
  const taxAuthority = city === "accra" ? "GRA" : "KRA";
  const linkCity = city === "accra" ? "accra" : "nairobi";

  const faqs = [
    {
      q: `What does long-term property management cost in ${cityPhrase}?`,
      a: "10% of collected rent, with no setup or onboarding fee. If we also have to find the tenant, tenant finding is a one-time fee of one month's rent. Nothing is deducted that is not itemised on your monthly statement.",
    },
    {
      q: "How and when do I get paid?",
      a: `We collect rent in ${c.currency}, deduct the management fee and any approved expenses, and remit the balance in USD to your foreign account on the 5th of each month, with a statement showing every line.`,
    },
    {
      q: "What happens if the tenant stops paying?",
      a: "We chase it the day it is late rather than at month end, and we keep you informed in writing. Where it cannot be recovered we manage the notice and, if it comes to it, the eviction process through our lawyers. Rigorous vetting up front is what keeps this rare.",
    },
    {
      q: "Who pays for repairs?",
      a: "You do, from collected rent, and we never commit your money blind. Routine items below an agreed threshold we handle and itemise. Anything above it comes to you with a quote first, except genuine emergencies where we act to prevent damage and tell you immediately.",
    },
    {
      q: `Do you handle ${taxAuthority} and the statutory side?`,
      a: `Yes. ${taxAuthority} returns on rental income, service charge, land rates and any estate levies are paid from collected rent and shown separately on the statement, so nothing accrues quietly while you are abroad.`,
    },
    {
      q: "Am I locked in?",
      a: "No. Thirty days' written notice ends the agreement, with no exit fee. We would rather keep a landlord because the service is good than because the contract is tight.",
    },
    {
      q: "Should I let long-term or short-let?",
      a: "Long-term wins on predictability and near-zero operating cost. Short-letting usually grosses more and costs considerably more to run. It depends on the unit, the building's rules and how much variability you can live with, and we will give you an honest answer for your specific property rather than the one that pays us more.",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          {
            name: "Long-Term Management",
            url: `${baseUrl}/long-term-management`,
          },
        ]}
      />
      <ReviewJsonLd />
      <ServiceJsonLd
        name="Long-Term Property Management"
        description={`End-to-end long-term residential management in ${areaServed.join(" and ")}: tenant sourcing and vetting, lease drafting, rent collection, maintenance coordination and monthly USD remittance to the landlord's foreign account.`}
        url={`${baseUrl}/long-term-management`}
        serviceType="Residential property management"
        areaServed={areaServed}
        priceDescription="10% of collected rent"
      />
      <FaqJsonLd items={faqs} />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <Image
          src="/images/locations/nairobi.jpg"
          alt={`Residential apartment building in ${cityPhrase} under Goldstay long-term management`}
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
                Long-term · Residential
              </div>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                Long-term property management in{" "}
                <em className="italic">{cityPhrase}</em>, run so you never have
                to ask.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                A vetted tenant, a lease that holds, rent collected on time and
                wired to your account in USD on the 5th. Our fee is 10% of
                collected rent. No setup fee, no lock-in, and every deduction
                itemised.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    "Hi Goldstay, I'd like to discuss long-term management for my property",
                    city ?? undefined,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Talk to us on WhatsApp
                </a>
                <Link href="/list-your-property" className="btn-ghost-light">
                  Or use the form →
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Answer-first summary. See the note in KeyFacts: this exists to
          be quotable standing alone, not to introduce the page. */}
      <KeyFacts
        question={`What does long-term property management in ${cityPhrase} cost, and what is included?`}
        answer={`Long-term rental management, also called buy-to-let or residential letting management, is what a letting agent, managing agent or property management company does for a landlord: tenant sourcing and vetting, the lease, rent collection and arrears chasing, repairs and vendor coordination, statutory compliance and monthly reporting. Goldstay charges 10% of the rent actually collected for this in ${cityPhrase}, with no setup fee, no renewal fee and no commission taken from contractors, and remits the net to your overseas account in USD on the 5th of each month with withholding tax already deducted and paid to ${taxAuthority}.`}
        facts={[
          { label: "Management fee", value: "10% of rent collected" },
          {
            label: "Tenant finding",
            value: "One month's rent, only if we place the tenant",
          },
          { label: "Setup or renewal fees", value: "None" },
          { label: "Contractor commissions", value: "None taken, ever" },
          { label: "Payout", value: "The 5th of each month, in USD" },
          {
            label: "Tax handling",
            value: `Rental income tax withheld and remitted to ${taxAuthority}`,
          },
          {
            label: "If a placed tenant defaults",
            value: "Replaced free within the first six months",
          },
          { label: "Exit terms", value: "30 days' notice, no exit fee" },
        ]}
        footnote="We are paid on rent collected rather than rent due, so an empty month or an unpaid one costs us what it costs you."
      />

      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="Everything included"
            title="What 10% actually covers."
            lede="Not a rent-collection service with a letting agent's badge. Full management, including the parts that are inconvenient for us."
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
              <div className="eyebrow">Why landlords abroad choose it</div>
              <h2 className="mt-4 font-serif text-display-md balance">
                The point of a long lease is that nothing happens.
              </h2>
              <p className="mt-5 text-charcoal/75 pretty">
                A good tenant in a well-kept unit produces one predictable
                figure a month and almost no decisions. That is the entire
                product, and it is why most of the portfolio we manage for
                landlords in Europe, the Gulf and North America is long-term
                rather than short-stay.
              </p>
              <ul className="mt-8 space-y-3 text-sm">
                {[
                  "Rent wired in USD on the 5th, every month",
                  "Every applicant vetted on ID, employer, income and references",
                  `${taxAuthority}, service charge and land rates paid from rent and itemised`,
                  "Move-in and move-out inventories, photographed",
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
                What a statement looks like
              </div>
              <h3 className="mt-4 font-serif text-2xl sm:text-3xl">
                2-bed apartment, {city === "accra" ? "East Legon" : "Westlands"}
              </h3>
              <ul className="mt-8 divide-y divide-cream/10 text-sm">
                {[
                  ["Rent collected", "USD 1,600"],
                  ["Goldstay fee (10%)", "USD 160"],
                  ["Service charge", "USD 120"],
                  [`${taxAuthority} withholding`, "USD 160"],
                  ["Repairs this month", "USD 0"],
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
                  <span className="text-cream">Wired to you</span>
                  <span className="text-right font-serif text-xl text-gold-400 sm:text-2xl">
                    USD 1,160
                  </span>
                </li>
              </ul>
              <p className="mt-6 text-xs text-cream/50">
                Illustrative only. Service charge, tax treatment and repairs
                vary by building and by month. Your actual statement itemises
                every line.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <CalculatorTeaser />

      <section className="section">
        <div className="container-gs max-w-4xl">
          <SectionHeader
            eyebrow="Long-term or short-stay"
            title="We will tell you which one your property suits."
          />
          <Reveal>
            <p className="mt-10 text-lg leading-relaxed text-charcoal/85 pretty">
              Short-letting grosses more in most of the neighbourhoods we
              operate in, and it costs considerably more to run: furnishing,
              cleaning, consumables, utilities, higher wear and a building that
              has to permit it. Long-term wins on predictability and on the
              near-total absence of operating cost. The right answer depends on
              the unit, the building rules and how much variability you can live
              with, and it is not always the one that pays us more.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/85 pretty">
              If you are weighing it up, read{" "}
              <Link
                href="/airbnb-management"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                our Airbnb and short-stay service
              </Link>{" "}
              alongside this page, or run both through the{" "}
              <Link
                href="/yield-calculator"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                yield calculator
              </Link>
              . If you only need a tenant and intend to manage the property
              yourself, we also do{" "}
              <Link
                href="/tenant-finding"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                tenant finding on its own
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {city !== "accra" && (
        <section className="section bg-white/50">
          <div className="container-gs">
            <SectionHeader
              eyebrow="By neighbourhood"
              title="What a managed home earns, area by area."
              lede="Indicative long-let figures for well-finished 2-bed apartments in the Nairobi neighbourhoods we cover."
            />
            <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {profiledNeighbourhoods("nairobi").map((n, i) => (
                <Reveal key={n.name} delay={i * 0.03}>
                  <Link
                    href={`/${linkCity}/${neighbourhoodSlug(n.name)}`}
                    className="group flex items-center justify-between rounded-2xl border border-charcoal/10 bg-cream px-6 py-5 transition-colors duration-300 hover:border-gold-500/40"
                  >
                    <span>
                      <span className="font-serif text-xl">{n.name}</span>
                      <span className="mt-1 block font-mono text-xs text-charcoal/50">
                        USD {n.twoBrUsd.min.toLocaleString()} to{" "}
                        {n.twoBrUsd.max.toLocaleString()} / month
                      </span>
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
        eyebrow="Long-term management FAQ"
        title="The questions landlords abroad actually ask."
      />
      <TestimonialsSection />
      <CTABanner city={city ?? undefined} />
    </>
  );
}
