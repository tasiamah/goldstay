import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Hero } from "./Hero";
import { ProblemSection } from "./ProblemSection";
import { ServicesSection } from "./ServicesSection";
import { CompareSection } from "./CompareSection";
import { CalculatorTeaser } from "./CalculatorTeaser";
import { WhySection } from "./WhySection";
import { GuaranteesSection } from "./GuaranteesSection";
import { StatementPreview } from "./StatementPreview";
import { NeighbourhoodEconomics } from "./NeighbourhoodEconomics";
import { HowItWorks } from "./HowItWorks";
import { FAQSection } from "./FAQSection";
import { CTABanner } from "./CTABanner";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";
import { cities, cityFaq, waLink } from "@/lib/site";

export function CityPage({ city }: { city: "nairobi" | "accra" }) {
  const c = cities[city];
  const cityName = city === "nairobi" ? "Nairobi" : "Accra";
  const headline = (
    <>
      <em className="italic">Premium</em> property management in {cityName}.
    </>
  );

  return (
    <>
      <Hero
        eyebrow={`${c.country} · ${cityName}`}
        headline={headline}
        subheadline={c.heroRentClaim}
        city={city}
      />

      <section className="section bg-white/50">
        <div className="container-gs">
          <SectionHeader
            eyebrow="Where we operate"
            title={`We focus on the ${cityName} neighbourhoods with the strongest diaspora tenant demand.`}
            lede={`Our tenant base includes ${c.tenantProfile}. We know what they expect, what they pay, and how to keep them.`}
          />
          <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {c.neighbourhoods.map((n, i) => (
              <Reveal key={n.name} delay={i * 0.04}>
                <div className="flex items-center justify-between rounded-2xl border border-charcoal/10 bg-cream px-6 py-5 transition-colors duration-300 hover:border-gold-500/40">
                  <span className="font-serif text-xl">{n.name}</span>
                  <span className="font-mono text-[0.7rem] uppercase tracking-widest-xl text-charcoal/50">
                    {cityName}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-wrap items-center gap-3 text-sm text-charcoal/70">
              <span>Own property elsewhere in {c.country}?</span>
              <a
                href={waLink(
                  `Hi Goldstay, I own property outside the listed neighbourhoods in ${cityName}. Can you help?`,
                  city,
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="link-underline text-charcoal"
              >
                Ask us anyway →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <NeighbourhoodEconomics city={city} />

      <ProblemSection />
      <ServicesSection />
      <CompareSection city={city} />
      <CalculatorTeaser city={city} />
      <WhySection city={city} />
      <GuaranteesSection />
      <StatementPreview city={city} />

      <section className="section">
        <div className="container-gs">
          <SectionHeader
            eyebrow="Local currency, international comfort"
            title={`We collect rent locally in ${c.currency}. You get paid in USD.`}
            lede="Transparent wholesale FX. Wholesale wire fees absorbed into our management fee. You never touch the local banking system."
          />
          <Reveal delay={0.1}>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {[
                {
                  k: "01",
                  title: `Rent paid in ${c.currency}`,
                  body: `Tenants pay by local bank transfer or mobile money. We reconcile daily.`,
                },
                {
                  k: "02",
                  title: "Converted at wholesale FX",
                  body: "No margin hidden in the rate. You see the rate on your monthly statement.",
                },
                {
                  k: "03",
                  title: "USD wired to your account",
                  body: "Monthly transfers to your Europe, UK, US, UAE or Canada account.",
                },
              ].map((s) => (
                <div key={s.k} className="card">
                  <div className="font-mono text-xs text-gold-600">{s.k}</div>
                  <h3 className="mt-6 font-serif text-2xl">{s.title}</h3>
                  <p className="mt-3 text-sm text-charcoal/70">{s.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <HowItWorks />

      <FAQSection
        id="city-faq"
        eyebrow={`${c.country} specifics`}
        title={`Tax, licensing and the bits of ${c.country} law you need to know.`}
        items={cityFaq[city]}
        initialOpen={null}
      />

      <FAQSection />

      <section className="section bg-white/50">
        <div className="container-gs">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-charcoal/10 bg-cream p-6 sm:p-8 md:flex-row md:items-center md:p-10">
              <div>
                <div className="eyebrow">Other market</div>
                <h3 className="mt-3 font-serif text-2xl sm:text-3xl">
                  Own property in {city === "nairobi" ? "Accra" : "Nairobi"} too?
                </h3>
                <p className="mt-2 text-charcoal/70">
                  We operate in both cities with one team and one account.
                </p>
              </div>
              <Link
                href={city === "nairobi" ? "/accra" : "/nairobi"}
                className="btn-secondary shrink-0"
              >
                Visit {city === "nairobi" ? "Accra" : "Nairobi"}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <CTABanner city={city} />
    </>
  );
}
