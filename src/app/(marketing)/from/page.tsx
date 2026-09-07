import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { DIASPORA_ORIGINS } from "@/lib/diaspora-origins";
import { getServerCity } from "@/lib/getServerCity";
import { alternateLanguagesFor, baseUrlFor } from "@/lib/site";

export function generateMetadata(): Metadata {
  return {
    // "Property Management for the African Diaspora" described the
    // audience in our words rather than theirs. Nobody searches
    // "African diaspora property management"; they search for managing
    // a property from wherever they are living.
    title: "Manage Your Kenya Property From Abroad",
    description:
      "Property management in Nairobi for landlords living abroad. Rent collected, tax withheld and remitted, and your net paid to your overseas account in USD on the 5th. UK, USA, UAE, Canada, Australia, Ireland and more.",
    alternates: {
      canonical: "/from",
      languages: alternateLanguagesFor("/from"),
    },
  };
}

export default function Page() {
  const baseUrl = baseUrlFor(getServerCity());

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          { name: "By where you live", url: `${baseUrl}/from` },
        ]}
      />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <div className="absolute inset-0 -z-10 grain opacity-40" />
        <div className="container-gs pb-16 md:pb-24">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">For the diaspora</div>
              {/* Was "Tell us where you live. We'll tailor the
                  conversation." A fine instruction and a wasted H1: the
                  strongest on-page signal on the hub of a 21 page
                  cluster said nothing about what the cluster is for.
                  The diaspora phrases landlords actually search
                  ("manage my property in Kenya from abroad", "rent out
                  my house while abroad") were unclaimed anywhere on the
                  site. The instruction moves to the standfirst below,
                  where it still reads as one. */}
              <h1 className="mt-6 font-serif text-display-lg balance">
                Manage my property in Kenya{" "}
                <em className="italic">from abroad</em>.
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
