import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Check, Receipt, Percent, ShieldQuestion } from "lucide-react";
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
import { waLink, alternateLanguagesFor, site } from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

// Property management companies in Nairobi.
//
// This page exists because of a query harvest, not a hunch. Pulling
// Google's own suggest data for Kenya across thirty management-intent
// seeds, the two heaviest queries by a wide margin were "property
// management companies in kenya" and "property management companies in
// nairobi" — together 41% of all the management-intent volume that
// surfaced. Their long tail is the same intent restated: "list of
// property management companies in nairobi", "top 10 property
// management companies in nairobi", "best property management
// companies in nairobi", "real estate management companies in
// nairobi".
//
// The site could not rank for any of them. Not because the pages were
// weak but because the plural does not appear anywhere on the site:
// "property management company" occurred 26 times, "property
// management companies" zero. Every page was written to say what we
// are, and none to answer someone still deciding between us and four
// others.
//
// That is a different intent from /nairobi, which sells the service to
// someone who has decided they want a manager. This page is for the
// stage before: comparing. Which is why it is written as a buyer's
// guide and not a pitch, and why it says plainly where we are the
// wrong choice. A comparison page that concludes "pick us" on every
// axis is not a comparison page, and a landlord reading four of these
// can tell.
//
// Deliberately omitted: anything about Estate Agents Registration
// Board licensing. Cap 533 does cover management, so "is your agent
// registered" is genuinely one of the questions a landlord should ask
// — but publishing it while our own registration status is unconfirmed
// would invite the question straight back with no answer ready. It
// goes in once that is settled, and it is the strongest single item
// this page is missing.

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const cityPhrase =
    city === "accra" ? "Accra" : city === "nairobi" ? "Nairobi" : "Nairobi";

  const title =
    city === "accra"
      ? "Property Management Companies in Accra: How to Choose"
      : "Property Management Companies in Nairobi: How to Choose";

  return {
    title,
    description: `Comparing property management companies in ${cityPhrase}? How property management companies in Kenya price the work, what the percentage is charged on, the costs that sit outside it, and eight questions to ask before you sign.`,
    alternates: {
      canonical: "/property-management-companies-nairobi",
      languages: alternateLanguagesFor(
        "/property-management-companies-nairobi",
      ),
    },
    openGraph: { title, type: "website" },
  };
}

// The distinction that decides more of the bill than the headline rate,
// and the one most landlords do not know to ask about.
const feeModels = [
  {
    icon: Percent,
    title: "A percentage of rent collected",
    body: "You pay on money that actually arrived. If the tenant does not pay, the agent does not earn, which puts you and them on the same side of an arrears problem. This is the model to prefer, and it is the one we use.",
  },
  {
    icon: Receipt,
    title: "A percentage of rent due",
    body: "You pay on the rent the lease says is owed, whether or not it was paid. A void or a defaulting tenant becomes your problem twice: no income, and a management fee on income you did not receive. Two agents quoting 8% and 10% can be the more expensive and the cheaper one respectively, purely on this.",
  },
  {
    icon: ShieldQuestion,
    title: "A percentage, plus the things it excludes",
    body: "The headline rate is rarely the whole cost. Ask specifically about onboarding or setup fees, tenant placement charged separately, lease renewal fees, an exit or termination fee, inspection fees, and whether the agent takes a margin on contractor invoices. That last one is the least visible and often the largest.",
  },
];

// Written to be usable against any agent, including us. A landlord who
// asks all eight and compares the answers will pick well whether or
// not they pick Goldstay.
const questions = [
  {
    q: "Is your fee charged on rent collected or rent due?",
    why: "Decides who carries the cost of a void or a default. See above — it can invert which of two quotes is cheaper.",
  },
  {
    q: "What does the monthly statement show, and can I see a real one?",
    why: "Ask for a redacted example before you sign. If it is a figure in a message rather than an itemised statement with rent received, each deduction against a named vendor, tax withheld and the balance remitted, you will not be able to audit the relationship later.",
  },
  {
    q: "Do you take any margin on repairs or contractor invoices?",
    why: "A common and quiet source of income. The answer you want is that you are charged what the contractor charged, evidenced by the contractor's own invoice.",
  },
  {
    q: "Who holds the deposit, and in what account?",
    why: "It should be identifiable and returnable. If it has gone into a general operating account, it is funding the business rather than sitting against your tenancy.",
  },
  {
    q: "How is withholding tax on my rental income handled?",
    why: "Residential rental income tax is the landlord's liability, and an agent who is silent on it is leaving you exposed rather than saving you money. Ask whether they deduct and remit, and whether you get the KRA reference.",
  },
  {
    q: "How do I get paid if I live abroad?",
    why: "Ask the currency, the day of the month, the exchange rate used and who absorbs the wire fee. 'We can arrange it' is not an answer; a named date and a stated FX basis is.",
  },
  {
    q: "How many properties does the person managing mine actually handle?",
    why: "Responsiveness is a function of caseload. It is a fair question and the answer is revealing.",
  },
  {
    q: "What are your notice and exit terms?",
    why: "Ask before you join, not when you want to leave. A long notice period or an exit fee is the cost of being wrong about them, and it is worth knowing at the start.",
  },
];

export default function Page() {
  const city = getServerCity();
  const cityName =
    city === "nairobi" ? "Nairobi" : city === "accra" ? "Accra" : null;
  const cityPhrase = cityName ?? "Nairobi";

  const baseUrl =
    city === "nairobi"
      ? `https://${site.domains.nairobi}`
      : city === "accra"
        ? `https://${site.domains.accra}`
        : `https://${site.domain}`;
  const areaServed = cityName ? [cityName] : ["Nairobi", "Accra"];

  const faqs = [
    {
      q: `How much do property management companies in ${cityPhrase} charge?`,
      a: "For long-term residential letting the market sits broadly between 8% and 12% of rent, and for furnished short-stay work between 15% and 25% of revenue. The spread matters far less than what the percentage is charged on and what it excludes: a rate quoted on rent due rather than rent collected, or one with tenant placement, renewals and a contractor margin charged on top, can cost more than a higher headline rate that includes everything. Goldstay charges 10% of rent collected for long-term management and 20% of revenue for short-stay, with no onboarding, renewal or exit fee and no margin on contractor invoices.",
    },
    {
      q: `What is the best property management company in ${cityPhrase}?`,
      a: "There is no single answer, and any company telling you it is the best one for every landlord is selling rather than advising. The right choice depends on what you own and where you live. If you are resident in Nairobi with one flat nearby and time to deal with it, self-management is genuinely viable and an agent is a convenience rather than a necessity. If you are abroad, own furnished stock, or need money to arrive in a foreign account on a predictable date, the things to compare are the fee basis, the quality of the monthly statement, how repairs are priced and whether the firm actually remits internationally.",
    },
    {
      q: `Is there a reliable list of property management companies in ${cityPhrase}?`,
      a: `Not one worth trusting by itself. Most of what ranks is a directory or a paid placement, and "top 10 property management companies in ${cityPhrase}" is a headline rather than a finding: nobody publishing those has read a monthly statement or spoken to a landlord who was three months in arrears. Worth knowing too that real estate management companies and property management companies are the same firms under two names in Kenya, so searching both only returns you the same pool. Build a shortlist of three from evidence instead — the best-run building near yours, other landlords in your block, and property advocates who see what bad management leaves behind.`,
    },
    {
      q: `Can I manage my own rental property in ${cityPhrase} instead?`,
      a: "Yes, and if you live in the city and own one or two units it may well be the right decision. What you are taking on is tenant sourcing and referencing, the lease, collecting the rent and chasing it when it is late, being reachable when something breaks, finding and supervising trades, holding and reconciling the deposit, and handling your own rental income tax. That is manageable locally. It becomes hard when you are in a different timezone, because every one of those tasks needs someone physically present at short notice, and a relative doing it as a favour is the arrangement that most often fails.",
    },
    {
      q: "Are letting agents worth it?",
      a: "It depends entirely on what you would otherwise do with the property. On a 10% fee, an agent has to earn back roughly five weeks of rent a year to be free — which they do if they cut your void periods, place a better tenant, or stop one arrears problem escalating. If your flat sits empty for two months because nobody was marketing it, or a bad tenant takes a year to remove, the fee was never the expensive part. If you are local, organised and already have a good long-standing tenant, honestly, you may be paying for very little.",
    },
    {
      q: "Who can I hire to manage my rental property if I live abroad?",
      a: "You are looking for a firm rather than an individual, because an individual has no cover when they travel or fall ill, and no separation between your rent and their bank account. The specific things to check when you are not in the country: that you receive an itemised monthly statement without asking, that funds are remitted to your own overseas account rather than held for collection, that the exchange rate basis is stated rather than chosen, and that someone can attend the property the same day when a tenant reports a leak.",
    },
    {
      q: `Where does Goldstay not make sense for a ${cityPhrase} landlord?`,
      a: "If you live in Nairobi, own a single unit close to home and have a tenant who has paid on time for years, our fee buys you convenience and little else, and we will tell you that on the call. We are also the wrong fit for unfurnished lets far outside the areas we cover, because our value depends on being able to get a person to the property quickly, and for landlords who want the cheapest possible headline rate rather than the fully-inclusive one.",
    },
  ];

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          {
            name: "Property Management Companies in Nairobi",
            url: `${baseUrl}/property-management-companies-nairobi`,
          },
        ]}
      />
      <ServiceJsonLd
        name="Residential Property Management"
        description={`Property management for residential landlords in ${areaServed.join(" and ")}: tenant placement and vetting, rent collection, arrears recovery, inspections, maintenance and cleaning, and monthly reporting with USD remittance.`}
        url={`${baseUrl}/property-management-companies-nairobi`}
        serviceType="Property management company"
        areaServed={areaServed}
        priceDescription="10% of rent collected for long-term management"
      />
      <FaqJsonLd items={faqs} />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <Image
          src="/images/locations/nairobi.jpg"
          alt={`Residential apartment blocks in ${cityPhrase}, the stock that property management companies in the city let and manage`}
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/80 via-charcoal/70 to-charcoal/95" />
        <div className="container-gs pb-20 md:pb-32">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">
                Choosing a manager
              </div>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                Property management companies in {cityPhrase}, and how to{" "}
                <em className="italic">tell them apart</em>.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                Search for the best property management companies in{" "}
                {cityPhrase} and you get rankings nobody has verified. The
                firms themselves quote a percentage and a list of services
                that reads identically. The differences that decide what you
                actually pay, and whether you can audit it, are two levels
                below the brochure. Here is where to look — and where we are
                the wrong choice.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <a
                  href={waLink(
                    "Hi Goldstay, I'm comparing property management companies in Nairobi and have a few questions",
                    city ?? undefined,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Ask us the eight questions
                </a>
                <Link href="/pricing" className="btn-secondary-dark">
                  See our fees in full
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <KeyFacts
        question={`What do property management companies in ${cityPhrase} charge, and what should you compare?`}
        answer={`Property management companies in ${cityPhrase} typically charge 8% to 12% of rent for long-term residential letting and 15% to 25% of revenue for furnished short-stay management. The headline percentage is the least useful basis for comparison: what matters more is whether the fee is charged on rent collected or rent due, and which costs sit outside it — onboarding, tenant placement, lease renewals, exit fees and any margin taken on contractor invoices. Goldstay charges 10% of rent collected for long-term management and 20% of revenue for short-stay, with no onboarding, renewal or exit fee, no contractor margin, and net proceeds remitted to overseas accounts in USD each month against an itemised statement.`}
        facts={[
          { label: "Typical long-term fee", value: "8%–12% of rent" },
          { label: "Typical short-stay fee", value: "15%–25% of revenue" },
          { label: "Goldstay, long-term", value: "10% of rent collected" },
          { label: "Goldstay, short-stay", value: "20% of revenue" },
          { label: "What to compare first", value: "Collected vs due" },
        ]}
      />

      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="The fee models"
            title="Two agents can quote 8% and 10%, and the 8% can be dearer."
            lede="Almost every management company in the city prices as a percentage. The percentage is not the variable that matters most."
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

      {/* "letting agents responsibilities", "letting agents nairobi" and
          "are letting agents worth it" all surfaced in the harvest, and
          the site had no heading covering any of them. Worth answering
          on its own terms: a landlord asking what a letting agent is
          responsible for has not yet decided to appoint one. */}
      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="The remit"
            title="What a letting agent or managing agent is responsible for."
            lede="Letting agent, managing agent, property management agency, property management firms, property management services — in Nairobi the labels are used interchangeably, and the scope varies far more between firms than between the names. This is the full remit; check which parts a quote actually includes."
          />
          <Reveal delay={0.1}>
            <div className="mx-auto mt-14 max-w-3xl space-y-4">
              {[
                {
                  k: "Letting",
                  v: "Marketing the unit, running viewings, referencing applicants, and drawing and executing the tenancy agreement. Some firms charge this separately from management, as a placement fee.",
                },
                {
                  k: "Money",
                  v: "Collecting rent, following up arrears, holding the deposit identifiably, deducting and remitting withholding tax, and reporting all of it monthly in a form you can audit.",
                },
                {
                  k: "The property",
                  v: "Periodic inspections, instructing and supervising repairs, managing cleaning and grounds, dealing with the service charge and utilities, and being reachable when something fails.",
                },
                {
                  k: "The tenancy",
                  v: "Renewals and rent reviews, notices, deposit deductions at check-out, and — where it goes wrong — arrears escalation and the tribunal process.",
                },
                {
                  k: "Not included, usually",
                  v: "Your own tax filing, buildings insurance, capital works and anything requiring an owner's decision. An agent who implies these are covered is worth a second question.",
                },
              ].map((row) => (
                <div
                  key={row.k}
                  className="card flex flex-col gap-2 sm:flex-row sm:gap-6"
                >
                  <div className="shrink-0 font-mono text-xs uppercase tracking-wider text-gold-600 sm:w-40">
                    {row.k}
                  </div>
                  <p className="text-sm text-charcoal/70">{row.v}</p>
                </div>
              ))}
            </div>
          </Reveal>
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
            title="Can you manage your own rental property? Often, yes."
            lede="Worth saying plainly, because a page like this from a management company usually will not."
          />
          <Reveal delay={0.1}>
            <div className="mx-auto mt-14 grid max-w-4xl gap-6 md:grid-cols-2">
              <div className="card h-full">
                <h3 className="font-serif text-2xl">
                  Manage it yourself if…
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-charcoal/70">
                  {[
                    "You live in the city and can reach the property the same day.",
                    "You own one or two units rather than a portfolio.",
                    "Your tenant is long-standing and pays on time.",
                    "You are comfortable finding and supervising trades yourself.",
                    "You are willing to handle your own rental income tax filing.",
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
                <h3 className="font-serif text-2xl">
                  Appoint a company if…
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-charcoal/70">
                  {[
                    "You live abroad and cannot be present at short notice.",
                    "The unit is furnished or let short-stay, which is a daily job.",
                    "You need funds in a foreign account on a predictable date.",
                    "A relative is doing it as a favour and it is straining.",
                    "You have arrears, a dispute or a void you have not resolved.",
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
              If you are weighing the two, our{" "}
              <Link href="/long-term-management" className="link-gold">
                long-term management
              </Link>{" "}
              and{" "}
              <Link href="/tenant-finding" className="link-gold">
                letting agent
              </Link>{" "}
              pages set out exactly what each service covers, and{" "}
              <Link href="/pricing" className="link-gold">
                pricing
              </Link>{" "}
              shows every fee we charge. If you already have a manager and it
              is going wrong, that is a{" "}
              <Link href="/change-property-manager" className="link-gold">
                different problem
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </section>

      {/* "property management companies in kenya" was the single heaviest
          query in the harvest — heavier than the Nairobi version — and
          the honest position is that the comparison applies nationally
          while we do not. Saying so is better than either ignoring the
          query or implying a national footprint we do not have. */}
      <section className="section bg-charcoal text-cream">
        <div className="container-gs">
          <div className="mx-auto max-w-3xl">
            <div className="eyebrow text-gold-400">Beyond Nairobi</div>
            <h2 className="mt-6 font-serif text-display-sm balance">
              Property management companies in Kenya, outside the capital.
            </h2>
            <p className="mt-6 text-lg text-cream/80 pretty">
              Everything above applies anywhere in the country. The fee
              models are the same, the collected-versus-due distinction is
              the same, and the eight questions work identically on a firm
              in Mombasa, Nakuru or Kisumu. Ask them there too.
            </p>
            <p className="mt-4 text-lg text-cream/80 pretty">
              What changes is depth of market. Nairobi has enough managing
              agents that you can afford to reject one on a bad answer;
              in smaller towns the choice is narrower, references matter
              more, and you should be more insistent about seeing a real
              statement before you commit. Coastal short-stay stock is a
              different business again, priced closer to hospitality than
              to letting.
            </p>
            <p className="mt-4 text-lg text-cream/80 pretty">
              We should be straightforward about our own footprint: Goldstay
              manages in {cityName ? `${cityName} ` : "Nairobi "}
              and in Accra, and nowhere else. If your property is upcountry
              or on the coast, this page is still the right checklist — we
              are simply not the answer at the end of it, and would rather
              say so than take on a property we cannot reach the same day.
            </p>
          </div>
        </div>
      </section>

      <FAQSection
        items={faqs}
        eyebrow="Choosing a company"
        title="What landlords ask while they are still comparing."
      />
      <TestimonialsSection />
      <CTABanner
        headline="Put us up against the others."
        subheadline="Send us the property and the questions above. We will answer all eight in writing, and tell you if we think you are better off managing it yourself."
        city={city ?? undefined}
      />
    </>
  );
}
