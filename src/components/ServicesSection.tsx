import Link from "next/link";
import { Check } from "lucide-react";
import { services, waLink } from "@/lib/site";
import { SectionHeader } from "./SectionHeader";
import { Reveal } from "./Reveal";

export function ServicesSection() {
  const featured = services.slice(0, 3);
  return (
    <section id="services" className="section bg-white/50">
      <div className="container-gs">
        <SectionHeader
          eyebrow="Services"
          title="From finding the property to wiring you the rent."
          lede="Three services covering the full diaspora landlord lifecycle. Buy well, rent smart, collect in USD."
        />

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {featured.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.05}>
              <article className="group relative flex h-full flex-col rounded-3xl border border-charcoal/10 bg-cream p-6 transition-all duration-500 ease-premium hover:-translate-y-1 hover:border-gold-500/50 hover:shadow-lift sm:p-8 md:p-10">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                  <h3 className="font-serif text-2xl sm:text-3xl md:text-4xl">
                    {s.title}
                  </h3>
                  <div className="shrink-0 sm:text-right">
                    <div className="font-serif text-4xl text-gold-600">
                      {s.fee}
                    </div>
                    <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/50">
                      {s.feeLabel}
                    </div>
                  </div>
                </div>
                <p className="mt-5 text-charcoal/70">{s.blurb}</p>
                <ul className="mt-8 space-y-3">
                  {s.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-gold-700">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="text-charcoal/80">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-10">
                  <a
                    href={waLink(
                      `Hi Goldstay, I'm interested in ${s.title}`,
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                  >
                    Enquire
                  </a>
                  <Link
                    href="/list-your-property"
                    className="text-sm link-underline text-charcoal/70"
                  >
                    Or list your property →
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-10 text-center text-sm text-charcoal/60">
            Not sure which of these fits your situation?{" "}
            <a
              className="link-underline text-charcoal"
              href={waLink(
                "Hi Goldstay, I'd like advice on which of your services fits my situation",
              )}
              target="_blank"
              rel="noopener noreferrer"
            >
              Message us and we&apos;ll advise
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
