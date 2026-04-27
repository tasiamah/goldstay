import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { CTABanner } from "@/components/CTABanner";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { posts } from "./posts";
import { alternateLanguagesFor, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Insights for diaspora landlords",
  description:
    "Plain-English writing on tax, buying remotely and running a property in Nairobi or Accra from abroad. Written by the team that does it day to day.",
  alternates: {
    canonical: "/insights",
    languages: alternateLanguagesFor("/insights"),
  },
  openGraph: {
    title: "Goldstay Insights",
    description:
      "Plain-English writing on tax, buying remotely and running a property in Nairobi or Accra from abroad.",
    type: "website",
  },
};

export default function InsightsIndex() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `https://${site.domain}` },
          { name: "Insights", url: `https://${site.domain}/insights` },
        ]}
      />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <div className="absolute inset-0 -z-10 grain opacity-40" />
        <div className="container-gs pb-16 md:pb-24">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">Insights</div>
              <h1 className="mt-6 font-serif text-display-lg balance">
                Writing for the <em className="italic">diaspora landlord</em>.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                Plain-English notes on tax, buying remotely, the
                operational reality of running an apartment in Nairobi
                or Accra from abroad, and the questions our clients
                actually ask. Written by the team that does it day
                to day, not a marketing department.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs max-w-5xl">
          <ul className="space-y-5">
            {posts.map((p, i) => (
              <li key={p.meta.slug}>
                <Reveal delay={i * 0.04}>
                  <Link
                    href={`/insights/${p.meta.slug}`}
                    className="group flex flex-col gap-6 rounded-3xl border border-charcoal/10 bg-cream p-7 transition-all duration-500 hover:border-gold-500/40 hover:shadow-lift sm:p-9 md:flex-row md:items-start"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.65rem] uppercase tracking-widest-xl text-charcoal/55">
                        {p.meta.tags.slice(0, 3).map((t) => (
                          <span key={t} className="text-gold-700">
                            {t}
                          </span>
                        ))}
                        <span className="text-charcoal/30">·</span>
                        <span>{p.meta.readingMinutes} min</span>
                      </div>
                      <h2 className="mt-4 font-serif text-2xl leading-tight text-charcoal balance md:text-3xl">
                        {p.meta.title}
                      </h2>
                      <p className="mt-4 max-w-2xl text-charcoal/75">
                        {p.meta.description}
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-charcoal/60">
                        <span className="font-serif italic text-charcoal">
                          {p.meta.author.name}
                        </span>
                        <span className="text-charcoal/30">·</span>
                        <span>{p.meta.author.role}</span>
                        <span className="text-charcoal/30">·</span>
                        <span>
                          {new Date(p.meta.publishedAt).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                    <span className="self-end inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-charcoal/15 text-charcoal/60 transition-transform group-hover:translate-x-1 md:self-start">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTABanner />
    </>
  );
}
