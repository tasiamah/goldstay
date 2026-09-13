import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Camera,
  Check,
  ClipboardList,
  ShoppingCart,
  Truck,
  Wrench,
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
  ReviewJsonLd,
  ServiceJsonLd,
} from "@/components/JsonLd";
import { alternateLanguagesFor, site, waLink } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// Furnishing service page.
//
// Deliberately not city-switched, unlike the other service pages. The
// prices below are KES and the goods are imported into Kenya, so a
// Ghana-domain render of this page would be quoting a currency and a
// supply chain that do not apply there. When Accra launches this needs
// its own numbers rather than an interpolated city name.
//
// It exists separately from the two insight articles because they
// answer different questions. The cost guide is research, the packages
// article is the detailed buying answer, and this is the page that
// should rank for "furnishing company nairobi" and its variants, which
// are commercial queries an article ranks badly for.

export function generateMetadata(): Metadata {
  const title = "Apartment Furnishing Nairobi: Packages & Prices";

  return {
    title,
    description:
      "Fixed-price apartment furnishing in Nairobi, from a KES 700,000 studio to a KES 2.75m three bedroom. Specified, delivered, installed and photographed.",
    alternates: {
      canonical: "/furnishing",
      languages: alternateLanguagesFor("/furnishing"),
    },
    openGraph: { title, type: "website" },
  };
}

const steps = [
  {
    icon: ClipboardList,
    title: "We specify it",
    body: "A written specification against your actual unit, allowing for what the developer has already fitted. Built for revenue and durability rather than for taste, because we are the ones who answer for the reviews afterwards.",
  },
  {
    icon: ShoppingCart,
    title: "We source it",
    body: "From Nairobi trade stock where the date is tight, or imported to order where it is not. Imported is materially cheaper for the same quality, and we price both so the choice is yours.",
  },
  {
    icon: Truck,
    title: "We take delivery",
    body: "Receiving, checking and chasing. Furniture arrives damaged more often than anyone expects, and the replacement conversation is ours to have rather than yours.",
  },
  {
    icon: Wrench,
    title: "We install and snag",
    body: "Assembly, wall mounting, curtain fitting and the walk-through that finds the drawer that does not close. Delivery hours in most compounds are restricted, and we work around them.",
  },
  {
    icon: Camera,
    title: "We photograph it",
    body: "Professional photography of the finished unit, included in the price. The photo set decides how often the listing is seen at all, so it is not an optional extra.",
  },
];

const packages = [
  {
    unit: "Studio",
    ready: "700,000",
    premium: "1,000,000",
  },
  {
    unit: "One bedroom",
    ready: "950,000",
    premium: "1,450,000",
  },
  {
    unit: "Two bedroom",
    ready: "1,400,000",
    premium: "2,000,000",
  },
  {
    unit: "Three bedroom",
    ready: "1,950,000",
    premium: "2,750,000",
  },
];

export default function Page() {
  const city = getServerCity();

  const baseUrl =
    city === "nairobi"
      ? `https://${site.domains.nairobi}`
      : city === "accra"
        ? `https://${site.domains.accra}`
        : `https://${site.domain}`;

  const faqs = [
    {
      q: "What does a furnishing package cost in Nairobi?",
      a: "Two tiers, published rather than quoted. Short-let ready is KES 700,000 for a studio, 950,000 for a one bedroom, 1.4m for a two bedroom and 1.95m for a three bedroom. Premium is 1m, 1.45m, 2m and 2.75m for the same sizes. Each price includes specification, sourcing, delivery, installation, snagging and professional photography.",
    },
    {
      q: "Who owns the furniture afterwards?",
      a: "You do, outright, from the day it is installed. It is a purchase rather than a lease or a rental. There is no monthly charge for it, nothing is recovered out of booking revenue, and it is not conditional on keeping a management agreement in place. If you leave us a month later you keep every item you paid for.",
    },
    {
      q: "How long does it take?",
      a: "Two to three weeks where we fill the package from stock already in Nairobi, and eight to twelve weeks where it is imported to order, because sea freight runs thirty to forty five days before clearing and inland haulage are added. Owners taking handover in a building that is still finishing usually have the time, and take the cheaper imported route.",
    },
    {
      q: "What is not included?",
      a: "Anything structural or fitted, because it belongs to the building rather than to the furnishing: built-in wardrobes, joinery, kitchen cabinetry, air conditioning installation, electrical and plumbing work, tiling, painting and window fitting. Also excluded are white goods the developer has already installed, the Tourism Regulatory Authority licence and county permits, and the working capital a short let needs for its first months. Where a unit needs any of the fitted work we quote it separately rather than thinning the furniture budget to pay for it.",
    },
    {
      q: "Do I have to use Goldstay to manage the unit afterwards?",
      a: "No, and the two are separate agreements. You can have a unit furnished and run it yourself, hand it to us for Airbnb management at 20% of revenue collected, or put it on a long lease under long-term management at 10% of rent collected. Furnishing does not commit you to any of them, and none of them is cheaper or dearer because you furnished with us.",
    },
    {
      q: "Is furnishing actually worth it?",
      a: "It depends on the building, and we will tell you when the answer is no. At Riverside One Residency a two bedroom lets at roughly KES 140,000 to 150,000 a month unfurnished against 270,000 to 290,000 furnished, a differential of about 130,000 a month, so a short-let ready furnish is recovered in around eleven months. In suburbs where furnished demand is thinner the differential narrows and the payback stretches past two years, which is a different decision.",
    },
    {
      q: "Can you furnish a unit you are not managing?",
      a: "Yes. Roughly half the reason owners ask is that they are abroad and cannot do it themselves, and that is true whether or not they want a manager afterwards. We will furnish it, photograph it and hand it over, and you can list it yourself or give it to another firm.",
    },
    {
      q: "What if I only need part of it?",
      a: "We will quote it, but be aware that partial jobs lose most of the advantage. The package price works because the specification is standardised across a portfolio, which is also what makes a spare of everything cheap to hold. A one-off list of six items priced individually will not beat what you can buy yourself on Mombasa Road.",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          { name: "Furnishing", url: `${baseUrl}/furnishing` },
        ]}
      />
      <ReviewJsonLd />
      <ServiceJsonLd
        name="Apartment Furnishing"
        description="Fixed-price apartment furnishing in Nairobi for landlords and short-let owners: specification, sourcing, delivery, installation, snagging and professional photography, with the furniture owned outright by the client on installation."
        url={`${baseUrl}/furnishing`}
        serviceType="Apartment furnishing and fit-out"
        areaServed={["Nairobi"]}
        priceDescription="Fixed price from KES 700,000 for a studio to KES 2.75m for a premium three bedroom"
      />
      <FaqJsonLd items={faqs} />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <Image
          src="/images/locations/nairobi.jpg"
          alt="Nairobi apartment buildings where Goldstay furnishes units for letting"
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
                Furnishing · Fixed price
              </div>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                Apartment furnishing in <em className="italic">Nairobi</em>, at
                a published price.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                Empty floor to let-ready: furniture, appliances, kitchen, linen,
                blinds and styling, specified, delivered, installed and
                photographed. From KES 700,000 for a studio. The furniture is
                yours outright the day it goes in.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    "Hi Goldstay, I'd like a furnishing quote for my apartment",
                    city ?? undefined,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Get a fixed price
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
        question="What does it cost to furnish an apartment in Nairobi?"
        answer="Goldstay furnishes Nairobi apartments at published fixed prices across two tiers. Short-let ready is KES 700,000 for a studio, 950,000 for a one bedroom, 1.4m for a two bedroom and 1.95m for a three bedroom. Premium is 1m, 1.45m, 2m and 2.75m for the same sizes, buying a better sofa, a hardwood dining set, a higher grade mattress and imported soft furnishings. Every price covers specification, sourcing, delivery, installation, snagging and professional photography, and the furniture belongs to the owner outright on installation with nothing recovered out of booking revenue. Delivery runs two to three weeks from Nairobi stock or eight to twelve weeks imported to order, the imported route being meaningfully cheaper for the same quality. Whether the spend is worth making depends on the rent differential in the specific building: at Riverside One a two bedroom lets at KES 140,000 to 150,000 unfurnished against 270,000 to 290,000 furnished, so a furnish is recovered inside a year."
        facts={[
          { label: "Studio", value: "KES 700,000, or 1m premium" },
          { label: "One bedroom", value: "KES 950,000, or 1.45m premium" },
          { label: "Two bedroom", value: "KES 1.4m, or 2m premium" },
          { label: "Three bedroom", value: "KES 1.95m, or 2.75m premium" },
          { label: "From Nairobi stock", value: "2 to 3 weeks" },
          { label: "Imported to order", value: "8 to 12 weeks" },
          { label: "Ownership", value: "Yours outright on install" },
          { label: "Photography", value: "Included" },
        ]}
        footnote="These are the prices you would be quoted on a call, for a unit with working power, water and existing curtain rails. Fitted joinery, air conditioning installation and electrical work are quoted separately."
      />

      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="What we do"
            title="Five steps, and none of them is shopping."
            lede="The furniture is the easy part. The work is the specification, the chasing, and the panel that arrives cracked."
          />
          <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.05}>
                <div className="card h-full">
                  <s.icon className="h-6 w-6 text-gold-600" strokeWidth={1.5} />
                  <h3 className="mt-6 font-serif text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-sand/40">
        <div className="container-gs">
          <SectionHeader
            eyebrow="Prices"
            title="Published, not quoted on a call."
            lede="Two tiers. The difference between them is about six items: the mattress, the sofa, the dining set, the appliances, the window treatments and the soft furnishings. The kettle is the same kettle."
          />
          <Reveal delay={0.1}>
            <div className="mt-14 overflow-hidden rounded-2xl border border-charcoal/12 bg-white/60">
              <div className="grid grid-cols-3 gap-4 border-b border-charcoal/10 px-6 py-4 font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/50">
                <div>Unit</div>
                <div className="text-right">Short-let ready</div>
                <div className="text-right">Premium</div>
              </div>
              {packages.map((p) => (
                <div
                  key={p.unit}
                  className="grid grid-cols-3 items-baseline gap-4 border-b border-charcoal/8 px-6 py-5 last:border-b-0"
                >
                  <div className="font-serif text-lg text-charcoal">
                    {p.unit}
                  </div>
                  <div className="text-right font-serif text-lg text-gold-700">
                    {p.ready}
                  </div>
                  <div className="text-right font-serif text-lg text-charcoal/80">
                    {p.premium}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 text-sm text-charcoal/60 pretty">
              Kenya shillings, fixed, including delivery, installation and
              photography. For where these sit against the wider market, and the
              line by line arithmetic behind them, see{" "}
              <Link
                href="/insights/cost-furnish-nairobi-apartment-2026"
                className="link-gold"
              >
                the cost to furnish a Nairobi apartment
              </Link>{" "}
              and{" "}
              <Link
                href="/insights/apartment-furnishing-packages-nairobi"
                className="link-gold"
              >
                what each package includes
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      <section className="section bg-charcoal text-cream">
        <div className="container-gs">
          <div className="mx-auto max-w-3xl">
            <div className="eyebrow text-gold-400">The part worth reading</div>
            <h2 className="mt-6 font-serif text-display-sm balance">
              The furniture is yours, and nothing is recouped from your
              bookings.
            </h2>
            <p className="mt-6 text-lg text-cream/80 pretty">
              You pay for it, you own it, from the day it is installed. There is
              no monthly charge for the furniture, no rental, and nothing
              deducted from booking revenue to pay it off.
            </p>
            <p className="mt-4 text-lg text-cream/80 pretty">
              This is worth spelling out because the other arrangement exists
              and is rarely explained. An operator who furnishes a unit at their
              own cost and recovers it out of your bookings has lent you money
              against your own apartment, and the repayment period is what
              quietly sets how long you are tied in. A million shillings
              recovered at a few percent of revenue is a three-year relationship
              whether or not anyone called it that.
            </p>
            <p className="mt-4 text-lg text-cream/80 pretty">
              Our management notice is thirty days with no exit fee. A
              furnishing debt on the other side of that promise would make it
              untrue, so we do not offer one.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-gs max-w-4xl">
          <SectionHeader
            eyebrow="Is it worth it"
            title="Judge it on the rent differential, not the price list."
          />
          <Reveal>
            <p className="mt-10 text-lg leading-relaxed text-charcoal/85 pretty">
              Furnishing is the only line in a letting budget that changes the
              rent, so the question is never what it costs but what it adds. At
              Riverside One Residency on Riverside Drive, a two bedroom lets at
              roughly KES 140,000 to 150,000 a month unfurnished and at KES
              270,000 to 290,000 furnished. On a differential of about 130,000 a
              month, a short-let ready furnish is recovered in about eleven
              months and a premium one in fifteen.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="mt-6 text-lg leading-relaxed text-charcoal/85 pretty">
              It does not hold everywhere. In suburbs where furnished demand is
              thinner the gap narrows sharply and the payback stretches past two
              years, which is a different decision and sometimes the wrong one.
              We run the sum on your building before quoting, and we will tell
              you when the answer is to leave it unfurnished.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-8 space-y-3 text-base">
              {[
                "A written specification against your actual unit, not a template",
                "Both sourcing routes priced, so you can trade cost against time",
                "Three sets of linen per bed, so a turnover never waits on a wash",
                "Standardised across the portfolio, so one spare covers every unit",
                "Professional photography of the finished unit, included",
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
        </div>
      </section>

      <section className="section bg-white/50">
        <div className="container-gs max-w-4xl">
          <SectionHeader
            eyebrow="Before you spend anything"
            title="Check the building allows short lets."
          />
          <Reveal>
            <p className="mt-10 text-lg leading-relaxed text-charcoal/85 pretty">
              A growing number of Nairobi blocks restrict or ban short lets in
              their house rules, and the committee usually wins that argument in
              practice whatever the legal position says. The most expensive way
              to discover it is after the furniture is installed, and we have
              been called in to unwind exactly that. Getting the answer in
              writing takes an afternoon, and{" "}
              <Link
                href="/insights/airbnb-building-permission-nairobi-committee"
                className="link-gold"
              >
                getting your building to allow short lets
              </Link>{" "}
              sets out how. If the answer is no, a furnished long lease is
              usually still the better use of the same money.
            </p>
          </Reveal>
        </div>
      </section>

      <FAQSection
        items={faqs}
        eyebrow="Furnishing FAQ"
        title="What owners ask before commissioning a furnish."
      />
      <TestimonialsSection />
      <CTABanner
        headline="Send us the unit and we will price it."
        subheadline="Give us the address, the size and what the developer has already fitted. You will get a fixed price for both tiers, a delivery date for each route, and the rent differential your building actually supports."
        city={city ?? undefined}
      />
    </>
  );
}
