import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { DIASPORA_ORIGINS } from "@/lib/diaspora-origins";
import { alternateLanguagesFor } from "@/lib/site";

export function generateMetadata(): Metadata {
  return {
    title: "Property Management for the African Diaspora",
    description:
      "Pick where you live. We handle Nairobi and Accra property management for landlords across the UK, USA, UAE, Australia, Canada, Ireland and more.",
    alternates: {
      canonical: "/from",
      languages: alternateLanguagesFor("/from"),
    },
  };
}

export default function Page() {
  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <div className="absolute inset-0 -z-10 grain opacity-40" />
        <div className="container-gs pb-16 md:pb-24">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">For the diaspora</div>
              <h1 className="mt-6 font-serif text-display-lg balance">
                Tell us where you live. <em className="italic">We&apos;ll</em>{" "}
                tailor the conversation.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                Tax, FX, time zone and banking work differently for every
                diaspora. Pick your home and we&apos;ll show you exactly what
                Goldstay looks like for landlords like you.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-16 md:py-24">
        <div className="container-gs">
          <Reveal>
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
              Choose your home
            </h2>
          </Reveal>
          <Reveal>
            <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {DIASPORA_ORIGINS.map((o) => (
                <div
                  key={o.code}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft"
                >
                  <div className="font-serif text-xl text-charcoal">
                    {o.short}
                  </div>
                  <p className="mt-1 text-sm text-stone-600">
                    Remit currency: {o.remitCurrency}
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <Link
                      href={`/from/${o.code}/nairobi`}
                      className="text-sm font-medium text-forest underline-offset-4 hover:underline"
                    >
                      Nairobi · for landlords in {o.short} →
                    </Link>
                    <Link
                      href={`/from/${o.code}/accra`}
                      className="text-sm font-medium text-forest underline-offset-4 hover:underline"
                    >
                      Accra · for landlords in {o.short} →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
