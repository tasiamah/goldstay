import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Percent, Receipt, UserCheck } from "lucide-react";
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
} from "@/components/JsonLd";
import { alternateLanguagesFor, site, waLink } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// Airbnb management companies in Kenya.
//
// The sibling of /property-management-companies-nairobi, built for the
// same reason and from the same harvest. /airbnb-management already
// records what Google's suggest data returns for Kenya: typing "airbnb
// management" completes first to "airbnb management companies in
// kenya", then "airbnb management", then "airbnb management services",
// then "airbnb management company". The plural, country-scoped phrase
// is the heaviest of the four and had no page.
//
// /airbnb-management answers "who will run my short let" for somebody
// who has decided to appoint a firm. This answers the question before
// it: which firm, out of the several a host is looking at. That is a
// different page, not a variant of the same one, and writing it as a
// pitch would waste it — a host reading four of these can tell.
//
// The short-stay comparison is not the long-term one with different
// numbers. Two things decide it that do not arise in letting at all.
//
// The first is what the percentage is charged on. A competitor ranking
// on "nairobi airbnb management" quotes "18% fee of net booking
// revenue", which reads cheaper than 20% and need not be. "Net" can be
// after platform fees, after cleaning, after consumables or after
// whatever the statement subtracts before the rate is applied, and a
// host comparing two numbers is usually not told which.
//
// The second has no equivalent in long-term management: whose Airbnb
// account the listing sits on. A listing on the manager's account
// takes its review history with it when you leave, which is most of
// what the first year of a short let is actually building. That is the
// switching cost nobody quotes, and it belongs on this page.
//
// Deliberately not here: any claim to be the best or the top of a
// list. The page ranks for those phrases by answering them honestly —
// see the FAQ — rather than by asserting them, and the ratings claim
// the site does make is the one with a verifiable source behind it.

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const country = city === "accra" ? "Ghana" : "Kenya";

  // "Compared" rather than "How to Choose": both signal the intent, and
  // the layout appends " | Goldstay", which put "How to Choose" at
  // 613px against the ~600px Google gives a title. A truncated title
  // loses its tail, which is the half carrying the intent.
  const title =
    city === "accra"
      ? "Airbnb Management Companies in Ghana: Compared"
      : "Airbnb Management Companies in Kenya: Compared";

  return {
    title,
    // Leads with the comparison this page exists to settle rather than
    // with a fee, because somebody at this stage is not yet choosing on
    // price — they are trying to work out why four quotes that look
    // alike are not.
    description: `What Airbnb management companies in ${country} charge, why a fee on "net booking revenue" can beat a higher rate, and who keeps your reviews.`,
    alternates: {
      canonical: "/airbnb-management-companies-kenya",
      languages: alternateLanguagesFor("/airbnb-management-companies-kenya"),
    },
    openGraph: { title, type: "website" },
  };
}

// The three bases a short-stay fee gets charged on. The spread between
// them is wider than the spread between the headline rates.
const feeModels = [
  {
    icon: Percent,
    title: "A percentage of revenue collected",
    body: "You pay on money that actually arrived from guests, before any operating cost is taken out. It is the only one of the three you can verify against your own Airbnb payout history without being shown anything, which is the reason to prefer it. It is what we charge on.",
  },
  {
    icon: Receipt,
    title: "A percentage of “net booking revenue”",
    body: "Net of what? Platform fees, cleaning, consumables and utilities are all deducted by somebody before somebody else's rate is applied, and the word does not say which. An 18% quoted on a base that has already had the cleaning fee added to it is not 18% of what you thought. Ask for the arithmetic on a real month.",
  },
  {
    icon: UserCheck,
    title: "A percentage, plus the things it excludes",
    body: "Onboarding and listing creation, photography, an exit fee, a linen or consumables surcharge, a markup on the cleaners, and a minimum monthly charge in a month with no bookings. The last is the one that hurts a seasonal unit, and it rarely appears next to the headline rate.",
  },
];

// Written so they work against us too. A host who asks all eight and
// compares the answers will choose well whether or not they choose us.
const questions = [
  {
    q: "Does the listing stay on my Airbnb account, or move to yours?",
    why: "The single most consequential answer on this page. A listing built on the manager's account keeps its reviews, its Superhost status and its search ranking when you part company, and you start from zero somewhere else. Ask it first, and get the answer in writing.",
  },
  {
    q: "Exactly what is the percentage charged on?",
    why: "Not the rate — the base. Ask them to take one real month and show you the gross guest payment, every deduction in order, and the point at which their percentage is applied. Two firms quoting 18% and 20% can be the dearer and the cheaper one respectively on this alone.",
  },
  {
    q: "Do you take a margin on cleaning, linen or maintenance?",
    why: "Short-stay has far more contractor throughput than letting does, so a quiet markup compounds monthly rather than annually. The answer you want is that you are charged what the cleaner and the handyman charged.",
  },
  {
    q: "What do I pay in a month with no bookings?",
    why: "A percentage of nothing should be nothing. If there is a minimum fee, a retainer or a standing charge, it turns a slow season into a bill, and it is worth knowing before the slow season rather than during it.",
  },
  {
    q: "Who holds the guest payouts, and how long do you hold them?",
    why: "If Airbnb pays them rather than you, your money sits in their account until they choose to remit it. Ask which day of the month, what happens if it slips, and whether the funds are separated from their operating cash.",
  },
  {
    q: "What occupancy and nightly rate are you forecasting, and from what?",
    why: "A number with no comparable behind it is a sales figure. Ask which specific buildings or streets it came from and over what period. An honest answer to this is usually lower than the one you were hoping for.",
  },
  {
    q: "Who is responsible for the building's rules and the county licence?",
    why: "A growing number of Nairobi buildings restrict or ban short lets outright, and operating against the house rules is the fastest way to lose the unit. Ask who confirms the building permits it, and who holds the single business permit.",
  },
  {
    q: "What are your notice and exit terms?",
    why: "Ask at the start, not when you want to leave. Combined with the first question, this is the real cost of being wrong about a manager: a notice period, possibly a fee, and possibly a review history you cannot take with you.",
  },
];

export default function Page() {
  const city = getServerCity();
  const cityName =
    city === "nairobi" ? "Nairobi" : city === "accra" ? "Accra" : null;
  const cityPhrase = cityName ?? "Nairobi";
  const country = city === "accra" ? "Ghana" : "Kenya";

  const baseUrl =
    city === "nairobi"
      ? `https://${site.domains.nairobi}`
      : city === "accra"
        ? `https://${site.domains.accra}`
        : `https://${site.domain}`;
  const areaServed = cityName ? [cityName] : ["Nairobi", "Accra"];

  const faqs = [
    {
      q: `How much do Airbnb management companies in ${country} charge?`,
      a: `The market sits broadly between 15% and 25% of revenue for full short-stay management, and the headline rate is the least useful thing to compare. What decides the bill is the base the percentage applies to — revenue collected, or some definition of "net" that has already had platform fees, cleaning and consumables taken out of it — and what sits outside the fee entirely: onboarding, listing creation, photography, a markup on the cleaners, an exit fee, or a minimum charge in a month with no bookings. Goldstay charges 20% of revenue collected, with no onboarding fee, no listing fee, no exit fee, no margin on any contractor, and nothing at all in a month with no bookings. The only setup cost is photography where we judge it necessary, at USD 100 for a studio or one-bed and USD 150 for two bedrooms or more.`,
    },
    {
      q: `What is the best Airbnb management company in ${cityPhrase}?`,
      a: `There is no answer to that which is true for every host, and a firm that tells you it is the best one is selling rather than advising. What the right choice depends on is what you own, where you live and how much of the work you want back. If you are in ${cityPhrase} with one furnished unit, enjoy hosting and can meet a guest at short notice, self-managing genuinely earns you more and you should keep doing it. If you are abroad, own more than one unit, or are losing evenings to guest messages, the things worth comparing are whose account the listing lives on, what the percentage is charged on, whether anyone takes a cut of the cleaners, and whether the money reaches your own overseas account on a stated date.`,
    },
    {
      q: `Is there a reliable list of the top Airbnb management companies in ${country}?`,
      a: `Not one worth trusting on its own. "Top 10 Airbnb management companies in Kenya" is almost always either a directory selling placement or a firm's own blog post with itself at number one, and nobody publishing those has read a host's monthly statement or seen what happens when a unit is handed back. Some of the best operators in Nairobi have no website at all and run on referral. A shortlist of three, built from hosts in buildings near yours and from the eight questions below, will serve you far better than any ranking — and it costs you one week.`,
    },
    {
      q: "Is an Airbnb co-host the same as an Airbnb management company?",
      a: "In practice, yes, and the words are used interchangeably in Nairobi. Co-host is Airbnb's own term for someone given permission to run a listing that stays on your account; Airbnb management company, short-stay agent and Airbnb agent all describe the same job. The label tells you nothing. What separates firms is whether the listing stays on your account or moves to theirs, what the fee is charged on, and whether you get an itemised monthly statement or a figure in a WhatsApp message.",
    },
    {
      q: `Can I manage my own Airbnb in ${cityPhrase} instead?`,
      a: "Often, yes, and you keep the whole fee by doing it. What you are taking on is the listing and its photography, nightly pricing across the year, every guest message including the ones at 2am, screening, arrival and security registration, a cleaning turnover reliable enough to survive a same-day changeover, linen and consumables, the prepaid meter, and maintenance at short notice. That is a part-time job with no days off, and it is entirely doable if you are in the city and want it. It becomes very hard from a different timezone, because almost every one of those tasks needs a person physically present within the hour.",
    },
    {
      q: `Do Airbnb management companies handle the licensing and the building's rules in ${cityPhrase}?`,
      a: `Some do and some quietly do not, and it is worth establishing which before you sign rather than after a notice from the management committee. A growing number of Nairobi buildings restrict or ban short lets in their house rules, and some cap how many units may operate one; operating against those rules is the commonest way a host loses the unit entirely. There is also a county single business permit, which starts at around KES 5,000. We confirm the building's position before listing anything, and if it does not permit short-letting we will say so and put the unit on a long lease instead. Our guide to what changed in ${cityPhrase} short-stay licensing sets out the current position.`,
    },
    {
      q: "What happens to my reviews if I change management company?",
      a: "It depends entirely on whose account the listing was on, which is why that is the first question to ask any firm. If the listing is on your own Airbnb account and the manager was added as a co-host, everything stays: the reviews, the Superhost status, the ranking history and the listing itself. If the listing was created on the manager's account, the review history is theirs, and you begin again as a new listing with no reviews — which in a competitive Nairobi building is worth considerably more than the difference between an 18% and a 20% fee.",
    },
    {
      q: `Where does Goldstay not make sense for a ${cityPhrase} host?`,
      a: "If you live in the city, own one furnished unit, enjoy the hosting side and have cleaners you trust, we are a convenience rather than a necessity and we will tell you that on the call. We are also the wrong answer for a unit outside the neighbourhoods we cover, because the whole model depends on getting a person there the same day, and for a host whose only criterion is the lowest headline percentage — ours is not the lowest number on the market, and the pages above explain what it includes instead.",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          {
            name: `Airbnb Management Companies in ${country}`,
            url: `${baseUrl}/airbnb-management-companies-kenya`,
          },
        ]}
      />
      <ServiceJsonLd
        name="Airbnb & Short-Stay Management"
        description={`Full short-stay management for hosts in ${areaServed.join(" and ")}: listing and photography, nightly pricing, guest screening and messaging, check-in, turnover cleaning and maintenance, with monthly USD remittance against an itemised statement.`}
        url={`${baseUrl}/airbnb-management-companies-kenya`}
        serviceType="Airbnb management company"
        areaServed={areaServed}
        priceDescription="20% of revenue collected"
      />
      <FaqJsonLd items={faqs} />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <Image
          src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2400&q=80"
          alt={`Furnished short-stay apartment interior in ${cityPhrase}, the stock that Airbnb management companies in ${country} operate`}
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
              <div className="eyebrow text-gold-400">Choosing a co-host</div>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                Airbnb management companies in {country}, and how to{" "}
                <em className="italic">tell them apart</em>.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                Every firm quotes a percentage and the same six services. Two
                things they do not put on the website decide more than the rate
                does: what the percentage is actually charged on, and whose
                Airbnb account your listing and its reviews end up living on.
                Here is how to ask — and where we are the wrong choice.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    "Hi Goldstay, I'm comparing Airbnb management companies and have a few questions",
                    city ?? undefined,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Ask us the eight questions
                </a>
                <Link href="/airbnb-management" className="btn-secondary-dark">
                  See what we actually do
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <KeyFacts
        question={`What do Airbnb management companies in ${country} charge, and what should you compare?`}
        answer={`Airbnb management companies in ${country} typically charge between 15% and 25% of revenue for full short-stay management. The headline percentage is a poor basis for comparison on its own: what matters more is whether the fee is charged on revenue collected or on a definition of "net booking revenue" that has already had platform fees, cleaning and consumables deducted, what sits outside the fee — onboarding, photography, exit fees, a markup on cleaners, a minimum charge in an empty month — and whether the listing stays on the host's own Airbnb account so the review history remains theirs. Goldstay charges 20% of revenue collected in ${cityPhrase}, with no onboarding, listing or exit fee, no margin on any contractor, nothing at all in a month with no bookings, the listing kept on the host's account, and net proceeds remitted to an overseas account in USD each month against an itemised statement.`}
        facts={[
          { label: "Typical market fee", value: "15%–25% of revenue" },
          { label: "Goldstay", value: "20% of revenue collected" },
          { label: "Charged on", value: "Revenue collected, not “net”" },
          { label: "In a month with no bookings", value: "Nothing" },
          { label: "Listing ownership", value: "Stays on your account" },
          { label: "What to compare first", value: "The base, not the rate" },
        ]}
        footnote="Every figure here is the figure you would be quoted on a call, and each one is written into the management agreement rather than described on a website."
      />

      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="The fee models"
            title="One firm quotes 18% and another 20%, and the 18% can be dearer."
            lede="Almost every short-stay manager prices as a percentage. The percentage is not the variable that decides what you pay."
          />
          <Reveal delay={0.1}>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {feeModels.map((m) => (
                <div key={m.title} className="card h-full">
                  <m.icon className="h-6 w-6 text-gold-600" strokeWidth={1.5} />
                  <h3 className="mt-6 font-serif text-2xl">{m.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70">{m.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* The switching cost that has no equivalent in long-term
          management, and the reason the first of the eight questions is
          the first. Given its own section rather than a bullet because
          a host who reads only one thing on this page should read this
          one. */}
      <section className="section bg-charcoal text-cream">
        <div className="container-gs">
          <div className="mx-auto max-w-3xl">
            <div className="eyebrow text-gold-400">The question to ask first</div>
            <h2 className="mt-6 font-serif text-display-sm balance">
              Whose account does the listing live on?
            </h2>
            <p className="mt-6 text-lg text-cream/80 pretty">
              A short let&rsquo;s first year is mostly spent building something
              that does not appear on any statement: reviews, Superhost status
              and a position in Airbnb&rsquo;s search results. That history
              belongs to the account the listing sits on, not to the property
              and not to you.
            </p>
            <p className="mt-4 text-lg text-cream/80 pretty">
              So if a manager created the listing on their own account, leaving
              them means leaving all of it. You relist as a new property with
              no reviews, in a building where the flat two floors up has
              forty — and it takes months of discounted nights to climb back.
              A host in that position is not really choosing whether to stay;
              the decision was made when the listing was set up.
            </p>
            <p className="mt-4 text-lg text-cream/80 pretty">
              Ours stay on the host&rsquo;s account, with us added as a
              co-host. It is the arrangement Airbnb designed for exactly this,
              it means the review history is yours on the day you leave, and
              it is the reason our notice period can be thirty days without an
              exit fee. A manager confident in the work does not need a hostage.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-sand/40">
        <div className="container-gs">
          <SectionHeader
            eyebrow="Eight questions"
            title="Ask every company the same eight things, including us."
            lede="The answers separate firms far more reliably than their websites do. Written so they work against us too."
          />
          <Reveal delay={0.1}>
            <ol className="mx-auto mt-14 max-w-3xl space-y-5">
              {questions.map((item, i) => (
                <li key={item.q} className="card flex gap-5">
                  <div className="font-mono text-xs text-gold-600">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl">{item.q}</h3>
                    <p className="mt-2 text-sm text-charcoal/70">{item.why}</p>
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="When you do not need us"
            title="Can you run your own Airbnb? Plenty of people should."
            lede="Worth saying plainly, because a page like this from a management company usually will not."
          />
          <Reveal delay={0.1}>
            <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
              <div className="card h-full">
                <h3 className="font-serif text-2xl">Host it yourself if…</h3>
                <ul className="mt-4 space-y-3 text-sm text-charcoal/70">
                  {[
                    "You live in the city and can reach the unit within the hour.",
                    "You own one furnished unit rather than several.",
                    "You have cleaners you already trust with a same-day changeover.",
                    "You do not mind guest messages arriving at any hour.",
                    "You genuinely enjoy the hosting part of it.",
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                        strokeWidth={2}
                      />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card h-full">
                <h3 className="font-serif text-2xl">Appoint a company if…</h3>
                <ul className="mt-4 space-y-3 text-sm text-charcoal/70">
                  {[
                    "You live abroad and cannot be present at short notice.",
                    "Your reviews are slipping on cleanliness or response time.",
                    "You need funds in a foreign account on a predictable date.",
                    "The calendar has gaps you have not had time to price for.",
                    "A relative is covering changeovers and it is straining.",
                  ].map((t) => (
                    <li key={t} className="flex gap-3">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                        strokeWidth={2}
                      />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mx-auto mt-10 max-w-3xl text-center text-sm text-charcoal/60 pretty">
              If you are weighing it up, our{" "}
              <Link href="/airbnb-management" className="link-gold">
                Airbnb management
              </Link>{" "}
              page sets out exactly what the service covers and{" "}
              <Link href="/pricing" className="link-gold">
                pricing
              </Link>{" "}
              shows every fee we charge. If you lease the unit rather than own
              it, that is{" "}
              <Link
                href="/airbnb-arbitrage-management"
                className="link-gold"
              >
                a different arrangement
              </Link>
              , and if you are weighing short-stay against a long lease,{" "}
              <Link
                href="/insights/airbnb-vs-long-term-rental-nairobi"
                className="link-gold"
              >
                we have compared the two
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* The country-scoped phrase is the heaviest in the harvest and
          our footprint is two cities, so this says where the checklist
          travels and where we do not. Same reasoning as the Kenya
          section on /property-management-companies-nairobi. */}
      <section className="section bg-white/50">
        <div className="container-gs">
          <div className="mx-auto max-w-3xl">
            <div className="eyebrow">Beyond the capital</div>
            <h2 className="mt-6 font-serif text-display-sm balance">
              Short-stay management elsewhere in {country}.
            </h2>
            <p className="mt-6 text-charcoal/75 pretty">
              Everything above applies wherever the unit is. The fee bases are
              the same, the listing-ownership question is the same, and the
              eight questions work identically on a firm in Diani, Nanyuki or
              Naivasha. Ask them there too, and ask the occupancy question
              harder — coastal and upcountry demand is far more seasonal than
              Nairobi&rsquo;s, so an annual average hides months that earn
              almost nothing.
            </p>
            <p className="mt-4 text-charcoal/75 pretty">
              On our own footprint, plainly: Goldstay operates short-stay in{" "}
              {cityName ? cityName : "Nairobi"} and long-term in Accra, and
              nowhere else. If your unit is on the coast this page is still the
              right checklist — we are simply not the answer at the end of it,
              and we would rather say so than take on a property we cannot
              reach the same day.
            </p>
          </div>
        </div>
      </section>

      <FAQSection
        items={faqs}
        eyebrow="Choosing a company"
        title="What hosts ask while they are still comparing."
      />
      <TestimonialsSection />
      <CTABanner
        headline="Put us up against the others."
        subheadline="Send us the unit and the questions above. We will answer all eight in writing, and tell you if we think you are better off running it yourself."
        city={city ?? undefined}
      />
    </>
  );
}
