import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Check,
  FileSignature,
  Handshake,
  KeyRound,
  LineChart,
  Search,
  ShieldCheck,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { CTABanner } from "@/components/CTABanner";
import { KeyFacts } from "@/components/KeyFacts";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import {
  BreadcrumbJsonLd,
  FaqJsonLd,
  ServiceJsonLd,
  ReviewJsonLd,
} from "@/components/JsonLd";
import { waLink, alternateLanguagesFor, site } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// Short-let management for operators who lease rather than own.
//
// Why this page exists. Four of the five short-let properties on the
// platform are held by authorised leaseholders rather than owners, so
// the single largest segment of the short-stay book is a reader the
// site addressed nowhere: /airbnb-management talks throughout about
// "your property" and "your title", which is the wrong second person
// for somebody whose whole question is what they are allowed to do
// with a unit they rent.
//
// The vocabulary here is taken from a Kenya-targeted autocomplete
// harvest rather than from guesswork. "Rent-to-rent" is a British
// term and barely registers in Kenya; what people actually search is
// "airbnb business in kenya", "how to start airbnb business without
// owning property in kenya", "airbnb arbitrage kenya", and, most
// often of all, the consent problem: whether they need the landlord's
// permission, whether the landlord can refuse, and how to ask. The
// URL carries "arbitrage" because "airbnb arbitrage management
// company" is a real query with commercial intent; the H1 and body
// carry "without owning" because that is the phrase the larger,
// earlier-stage audience uses.
//
// The positioning is deliberately explicit about consent. We manage
// for operators, and we do not manage a unit that is being short-let
// behind the owner's back. That is not a legal disclaimer bolted on
// the end, it is the reason a landlord can read this page without
// concluding we are the firm helping their tenant sublet on the
// quiet, and half our long-term book is landlords.

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const cityPhrase =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : "Nairobi and Accra";

  const title =
    city === "nairobi"
      ? "Airbnb Arbitrage Management Nairobi"
      : city === "accra"
        ? "Airbnb Arbitrage Management Accra"
        : "Airbnb Arbitrage Management in Nairobi & Accra";

  return {
    title,
    description: `Run an Airbnb business in ${cityPhrase} without owning the property. We manage short-let units for operators who lease and re-let with the owner's written consent: pricing, guests, turnovers and compliance for 20% of revenue.`,
    alternates: {
      canonical: "/airbnb-arbitrage-management",
      languages: alternateLanguagesFor("/airbnb-arbitrage-management"),
    },
    openGraph: { title, type: "website" },
  };
}

const steps = [
  {
    icon: Search,
    title: "We find units that permit it",
    body: "The hard part of this model is not the nightly rate, it is finding a landlord whose lease allows short-letting and who will say so in writing. We manage long-term property for landlords across the same neighbourhoods, so we know which buildings and which owners are open to it.",
  },
  {
    icon: Handshake,
    title: "We help you get consent properly",
    body: "We put the proposal to the owner the way an owner wants to hear it: who is accountable, what happens to the unit, who insures it, and what the recourse is if it goes wrong. A landlord is far more likely to agree when a managing agent is standing behind the arrangement.",
  },
  {
    icon: FileSignature,
    title: "You sign as an authorised leaseholder",
    body: "Our management agreement has a capacity written specifically for this: you warrant that you hold the head lease and that the owner has given written permission both to sublet and to appoint us. The contract says what you actually are rather than pretending you own the place.",
  },
  {
    icon: LineChart,
    title: "We run the unit",
    body: "Listing and photography, nightly pricing, guest screening, messaging, check-in, turnover cleaning, linen, consumables and maintenance. The same operation we run for owner-held units, because from the guest's side there is no difference.",
  },
  {
    icon: ShieldCheck,
    title: "We keep you compliant",
    body: "County single business permit, the tourism regulatory requirements, VAT position where turnover crosses the threshold, and rental income reported properly. Operators get caught by this more than owners do, because the model looks like a side hustle and is taxed like a business.",
  },
  {
    icon: KeyRound,
    title: "You get one statement",
    body: "Revenue, our fee, cleaning, consumables and repairs on one itemised monthly statement, so the margin between your rent and your revenue is a number you can actually see rather than one you estimate.",
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

  // Phrased from the harvest rather than from what we imagine gets
  // asked. Several of these are close to verbatim autocomplete
  // strings, including the legality question, the permission
  // question, and "can I rent an apartment and put it on Airbnb".
  const faqs = [
    {
      q: `Can I rent an apartment in ${cityPhrase} and put it on Airbnb?`,
      a: "Yes, if your lease permits it or the owner gives written permission, and no if it does not. This is the whole question and there is no clever way around it: a residential lease that is silent on subletting does not imply consent, and short-letting a unit in breach of the lease gives the owner a straightforward route to terminate and keep your deposit. Get the permission in writing before you commit to the rent, not after.",
    },
    {
      q: "Is Airbnb arbitrage legal in Kenya?",
      a: "The model itself is perfectly legal. Leasing a property and re-letting it on a short-stay basis is ordinary commercial subletting, which Kenyan law permits. What makes it unlawful in a particular case is doing it without the right to: without the owner's consent where the lease requires it, without the county business permit, or without declaring the income. None of those are difficulties with the model, they are things operators skip.",
    },
    {
      q: "Do I need the landlord's permission to sublet?",
      a: "Read the lease. Most Kenyan residential leases either prohibit subletting outright or require the landlord's prior written consent, and a growing number now name short-stay letting specifically because owners have caught on. If the lease is genuinely silent you are on better ground, but silence is not consent and a court will look at what the parties intended. Ask. A landlord who says yes in writing is worth more than an argument you might win.",
    },
    {
      q: "Will you manage a unit if I do not have the owner's consent?",
      a: "No. We will help you get it, and we are unusually well placed to because we manage long-term property for landlords in the same neighbourhoods, but we will not run a unit that is being short-let behind the owner's back. Our management agreement makes you warrant that the permission exists, and we ask to see it. This is not squeamishness: we would be the visible party in a dispute, and half our business is acting for landlords.",
    },
    {
      q: `What do you charge an operator in ${cityPhrase}?`,
      a: "20% of the revenue collected, the same as we charge an owner, with no onboarding fee, no listing fee and no exit fee. We take nothing from contractors or listing platforms. On a unit renting at KES 80,000 and grossing KES 160,000, our fee is KES 32,000 and your margin is what remains after rent, our fee and running costs.",
    },
    {
      q: "How much can an operator actually make on a Nairobi unit?",
      a: "Less than the courses claim. On a well-located furnished one or two bedroom, gross short-stay revenue is commonly 1.6 to 2.2 times the long-term rent, and out of that difference come our fee, cleaning, consumables, utilities, the void nights and the furnishing you paid for up front. A realistic operator margin on a single unit is thin, and the model only becomes a business at several units with the fixed costs spread across them.",
    },
    {
      q: "What does it cost to set up?",
      a: "Furnishing is the real number and it is yours, not ours: budget USD 4,000 to 9,000 for a one or two bedroom depending on how far you go, plus the deposit and first month on your own lease. Our side adds photography at USD 100 to 150 where the unit needs it. Nothing else is payable to us before the unit earns.",
    },
    {
      q: "Is this the same as co-hosting?",
      a: "Co-hosting usually means running someone else's listing for a share of the revenue while the owner keeps the booking relationship. What we do here is full management of a unit you hold on a lease, which is a different arrangement contractually even though the day-to-day work overlaps heavily. If you already have a listing running and want it taken over, that is fine too, and it is the same fee.",
    },
    {
      q: "What happens if my head lease ends or the owner withdraws consent?",
      a: "The management agreement follows the lease. You are obliged to tell us in writing as soon as your authority to let ends, lapses or is withdrawn, and we can then end the arrangement immediately without an exit fee, because continuing to take bookings for a unit you no longer control is the one thing neither of us can afford. We would help you rehouse confirmed guests.",
    },
    {
      q: "Do I need to register a business and pay tax?",
      a: "Yes. Short-stay letting as a business needs a county single business permit, and the income is taxable whether or not you registered anything. Once turnover crosses the VAT threshold you have a VAT obligation too, which catches operators at three or four units who were still treating it as informal income. We report your revenue properly and remit what is due rather than leaving you to reconstruct it later.",
    },
    {
      q: "Can you find me a unit as well as manage it?",
      a: "Yes, and for operators it is usually the more valuable half. We know which owners in which buildings will consider short-letting, because we already act for a lot of them. Sourcing is free to you: we are paid by managing the unit afterwards, not by placing you in it, which means we have no reason to put you into a unit that will not perform.",
    },
    {
      q: "Would you rather I just bought a property?",
      a: "Not necessarily, and we will say so honestly. Leasing lets you test a neighbourhood and a price point for the cost of a deposit rather than a purchase, and if it does not work you hand the keys back. Owning is the better long-term position and we help people do that too, but starting as an operator is a defensible way to learn the market with a bounded downside.",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          {
            name: "Airbnb Arbitrage Management",
            url: `${baseUrl}/airbnb-arbitrage-management`,
          },
        ]}
      />
      <ReviewJsonLd />
      <ServiceJsonLd
        name="Airbnb Arbitrage Management"
        description={`Short-let management in ${areaServed.join(" and ")} for operators who lease rather than own: unit sourcing, help obtaining the owner's written consent to sublet, listing and pricing, guest management, turnovers, maintenance and compliance.`}
        url={`${baseUrl}/airbnb-arbitrage-management`}
        serviceType="Short-stay management for leasehold operators"
        areaServed={areaServed}
        priceDescription="20% of revenue collected"
      />
      <FaqJsonLd items={faqs} />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <Image
          src="/images/locations/nairobi.jpg"
          alt={`Furnished apartment buildings in ${cityPhrase} let on short stays by leasehold operators`}
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
                For operators · 20% of revenue
              </div>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                Run Airbnb in <em className="italic">{cityPhrase}</em> without
                owning the property.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                You hold the lease. We find units whose owners allow
                short-letting, help you get that permission in writing, and then
                run the unit: pricing, guests, turnovers, maintenance and the
                compliance that operators get caught by. One itemised statement
                a month, so you can see your actual margin.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    "Hi Goldstay, I lease units and re-let them short-term. I'd like to talk about management",
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

      <KeyFacts
        question={`Can you run an Airbnb business in ${cityName ?? "Kenya"} without owning property?`}
        answer={`Yes. The model is variously called rent-to-rent, rental arbitrage or Airbnb arbitrage: you lease a property on an ordinary long lease, furnish it, and re-let it on short stays at a higher nightly rate, keeping the margin. It is entirely legal in Kenya provided the owner has given written permission to sublet, you hold a county business permit, and you declare the income. Goldstay manages these units for operators in ${cityPhrase} for 20% of the revenue collected, and will not take one on without sight of the owner's consent.`}
        facts={[
          { label: "Management fee", value: "20% of revenue collected" },
          { label: "Unit sourcing", value: "Free, we are paid by managing" },
          { label: "Owner's written consent", value: "Required, no exceptions" },
          { label: "Onboarding or exit fee", value: "None" },
          {
            label: "Your furnishing budget",
            value: "USD 4,000 to 9,000 for a 1 to 2 bed",
          },
          {
            label: "Typical gross vs long rent",
            value: "1.6x to 2.2x, before costs",
          },
          {
            label: "You sign as",
            value: "Authorised leaseholder, not owner",
          },
          {
            label: "If your lease ends",
            value: "We exit immediately, no fee",
          },
        ]}
        footnote="The margin on a single unit is thinner than the courses selling this model suggest. We would rather tell you that before you sign a lease than after."
      />

      <section className="section">
        <div className="container-gs max-w-4xl">
          <SectionHeader
            eyebrow="The line we hold"
            title="Consent in writing, or we do not take the unit."
          />
          <Reveal>
            <p className="mt-10 text-lg leading-relaxed text-charcoal/85 pretty">
              Most of the advice circulating about this model treats the
              landlord as an obstacle to be managed. Sign the lease, say
              nothing, and deal with it if it comes up. It is bad advice on its
              own terms, because the downside is not a warning letter: it is
              termination, forfeiture of your deposit, and the loss of a
              furnished unit you paid to furnish, usually in the middle of a
              booking calendar you cannot honour.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/85 pretty">
              So we ask to see the owner&rsquo;s written permission, and our{" "}
              management agreement makes you warrant that it exists. We are also
              the party best placed to help you get it. We manage long-term
              property for landlords across the same neighbourhoods, which means
              we know which owners will consider it, and it means a landlord
              hearing the proposal is hearing it from a managing agent who will
              be accountable for the unit rather than from a stranger who wants
              to sublet their apartment.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/85 pretty">
              If you are at the start of that conversation, we have written up
              how to have it:{" "}
              <Link
                href="/insights/ask-landlord-permission-short-let-nairobi"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                how to ask a landlord for permission to short-let
              </Link>
              , including a letter you can send, and{" "}
              <Link
                href="/insights/landlord-permission-to-sublet-kenya"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                what your lease actually has to say
              </Link>{" "}
              for consent to be needed in the first place.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-gs">
          <SectionHeader
            eyebrow="How it runs"
            title="Six things we do, in the order they happen."
            lede="The first two are the ones that decide whether the rest is worth doing."
          />
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <div className="card h-full">
                  <s.icon className="h-6 w-6 text-gold-600" />
                  <h3 className="mt-6 font-serif text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-gs max-w-4xl">
          <SectionHeader
            eyebrow="The honest economics"
            title="Where the money actually goes."
          />
          <Reveal>
            <p className="mt-10 text-lg leading-relaxed text-charcoal/85 pretty">
              An operator&rsquo;s pitch deck shows gross revenue against rent
              and calls the gap profit. The gap is not profit. Out of it come
              our fee, cleaning and linen on every turnover, consumables,
              utilities at short-stay consumption rather than tenant
              consumption, the void nights that no amount of pricing skill
              removes, and the furnishing you have already paid for and are
              amortising whether you think of it that way or not.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <ul className="mt-8 space-y-3 text-base">
              {[
                "Gross short-stay revenue commonly runs 1.6x to 2.2x the long-term rent on a well-located furnished unit",
                "Realistic occupancy is 55% to 75% across a full year, by neighbourhood, not the 90% a course will quote",
                "Cleaning and linen scale with turnovers, so a good month costs more to run than a quiet one",
                "One unit rarely justifies the effort; the model works at three or more",
                "A single month of a unit sitting empty while you still owe rent removes most of a quarter's margin",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
                    <Check className="h-3 w-3" />
                  </span>
                  <span className="text-charcoal/80">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 text-lg leading-relaxed text-charcoal/85 pretty">
              We would rather run three units for an operator who understood
              this before signing than one for someone who is going to hand the
              keys back in the fourth month. For the full picture, including the
              numbers we see across the book, read{" "}
              <Link
                href="/insights/airbnb-arbitrage-nairobi-2026"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                Airbnb arbitrage in Nairobi
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-gs max-w-4xl">
          <SectionHeader
            eyebrow="If you own instead"
            title="This page is for people who lease. The other one is for owners."
          />
          <Reveal>
            <p className="mt-10 text-lg leading-relaxed text-charcoal/85 pretty">
              If you own the property, you do not need any of the consent
              machinery above and the economics are considerably better, because
              the rent you are paying an owner is rent you are not paying. Go to{" "}
              <Link
                href="/airbnb-management"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                Airbnb management
              </Link>{" "}
              instead, which is the same operation at the same fee without the
              head lease in the middle. If you are weighing a short-let against
              a tenant, compare it with{" "}
              <Link
                href="/long-term-management"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                long-term management
              </Link>{" "}
              at 10% of collected rent, and if you are a landlord who has
              discovered a tenant short-letting your unit,{" "}
              <Link
                href="/insights/can-landlord-refuse-sublet-kenya"
                className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
              >
                here is where you stand
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <FAQSection
        items={faqs}
        eyebrow="Operator FAQ"
        title="What operators ask before they sign a lease."
      />
      <TestimonialsSection />
      <CTABanner
        headline="Leasing a unit to short-let it?"
        subheadline="Tell us the neighbourhood and the rent you are being asked for. We will tell you what it realistically grosses, and whether the owner is likely to agree."
        city={city ?? undefined}
      />
    </>
  );
}
