import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import {
  DIASPORA_ORIGINS,
  findDiasporaOrigin,
  type DiasporaOrigin,
} from "@/lib/diaspora-origins";
import { alternateLanguagesFor, site, waLink } from "@/lib/site";

// Programmatic diaspora-origin pages.
//
// URL: /from/[origin]/[city]   e.g. /from/uk/nairobi, /from/usa/accra
//
// Each page is a unique entry into the funnel for a specific
// diaspora cluster, so the searcher who Googles "Nairobi property
// management for landlords in the UK" lands on a page that already
// understands their tax + FX + time-zone situation, instead of a
// generic homepage. Content per origin lives in src/lib/diaspora-
// origins.ts; the page itself is data-driven and contains no copy
// that varies between origins outside that source of truth.
//
// All combinations are pre-rendered at build time so SEO ingests
// every URL with full HTML on first crawl.

const SUPPORTED_CITIES = ["nairobi", "accra"] as const;
type SupportedCity = (typeof SUPPORTED_CITIES)[number];

export function generateStaticParams() {
  return DIASPORA_ORIGINS.flatMap((o) =>
    SUPPORTED_CITIES.map((city) => ({ origin: o.code, city })),
  );
}

export const dynamicParams = false;

type Props = { params: { origin: string; city: string } };

function resolve(params: Props["params"]) {
  const origin = findDiasporaOrigin(params.origin);
  if (!origin) return null;
  if (!SUPPORTED_CITIES.includes(params.city as SupportedCity)) return null;
  return { origin, city: params.city as SupportedCity };
}

export function generateMetadata({ params }: Props): Metadata {
  const r = resolve(params);
  if (!r) return {};
  const cityName = r.city === "nairobi" ? "Nairobi" : "Accra";
  const path = `/from/${r.origin.code}/${r.city}`;
  const title = `${cityName} Property Management for Landlords in ${r.origin.short}`;
  const description = `Goldstay manages ${cityName} property end-to-end for landlords based in ${r.origin.name}. USD remittance, transparent statements, full tax handling. Built for the diaspora.`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      languages: alternateLanguagesFor(path),
    },
    openGraph: { title, description, type: "website" },
  };
}

export default function Page({ params }: Props) {
  const r = resolve(params);
  if (!r) notFound();
  return <DiasporaOriginPage origin={r.origin} city={r.city} />;
}

function DiasporaOriginPage({
  origin,
  city,
}: {
  origin: DiasporaOrigin;
  city: SupportedCity;
}) {
  const cityName = city === "nairobi" ? "Nairobi" : "Accra";
  const country = city === "nairobi" ? "Kenya" : "Ghana";
  const tzPhrase =
    origin.eatOffsetHours === 0
      ? `in the same time zone as ${cityName}`
      : origin.eatOffsetHours > 0
        ? `${origin.eatOffsetHours} hours ahead of ${cityName}`
        : `${Math.abs(origin.eatOffsetHours)} hours behind ${cityName}`;

  const waMsg = `Hi Goldstay, I'm a ${origin.short}-based landlord with property in ${cityName}. I'd like to talk.`;

  return (
    <>
      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <div className="absolute inset-0 -z-10 grain opacity-40" />
        <div className="container-gs pb-16 md:pb-24">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">
                {cityName} property · for landlords in {origin.short}
              </div>
              <h1 className="mt-6 font-serif text-display-lg balance">
                {cityName} property management,{" "}
                <em className="italic">built for landlords in {origin.name}</em>.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                You&apos;re {tzPhrase}. We&apos;re on the ground in {cityName},
                handling tenants, repairs, tax and remittance, so your
                property earns in USD while you sleep.
              </p>
              <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Link href="/list-your-property" className="btn-primary">
                  List your {cityName} property
                </Link>
                <a
                  href={waLink(waMsg, city)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost-light"
                >
                  Or message us on WhatsApp →
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-cream-100 py-16 md:py-24">
        <div className="container-gs grid gap-12 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div>
              <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
                Why {origin.short}-based landlords own in {cityName}
              </h2>
              <p className="mt-4 text-lg text-stone-700 pretty">
                {origin.whyDiasporaOwn}
              </p>

              <h3 className="mt-12 font-serif text-2xl text-charcoal">
                The pain we solve for landlords in {origin.short}
              </h3>
              <p className="mt-4 text-lg text-stone-700 pretty">
                {origin.paragraphPain}
              </p>
            </div>
          </Reveal>

          <Reveal>
            <aside className="rounded-2xl border border-stone-200 bg-white p-6 shadow-soft md:p-8">
              <div className="eyebrow text-gold-600">FX corridor</div>
              <p className="mt-3 text-stone-700">
                We collect rent in{" "}
                <strong>{country === "Kenya" ? "KES" : "GHS"}</strong>, convert
                at a transparent wholesale rate, and remit in{" "}
                <strong>USD</strong> by default, or directly into{" "}
                <strong>{origin.remitCurrency}</strong> if your bank prefers.
                The spread is itemised on every monthly statement.
              </p>
              <div className="mt-6 border-t border-stone-200 pt-6">
                <div className="eyebrow text-gold-600">Most common question</div>
                <p className="mt-3 font-serif text-lg text-charcoal">
                  {origin.topQuestion.q}
                </p>
                <p className="mt-2 text-stone-700">{origin.topQuestion.a}</p>
              </div>
              <Link
                href="/yield-calculator"
                className="mt-6 inline-block text-sm font-medium text-forest underline-offset-4 hover:underline"
              >
                Run the {cityName} yield calculator →
              </Link>
            </aside>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-stone-200 bg-white py-16 md:py-20">
        <div className="container-gs">
          <Reveal>
            <h2 className="font-serif text-3xl text-charcoal md:text-4xl">
              We also serve landlords in
            </h2>
            <p className="mt-2 text-stone-600">
              Goldstay is built for diaspora-first management. Pick your home.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {DIASPORA_ORIGINS.filter((o) => o.code !== origin.code).map(
                (o) => (
                  <Link
                    key={o.code}
                    href={`/from/${o.code}/${city}`}
                    className="rounded-xl border border-stone-200 bg-cream-100 px-4 py-3 text-charcoal transition hover:border-forest/40 hover:bg-cream-200"
                  >
                    <span className="font-medium">{o.short}</span>{" "}
                    <span className="text-stone-500">→ {cityName}</span>
                  </Link>
                ),
              )}
            </div>
            <p className="mt-8 text-sm text-stone-600">
              Owning in the other city?{" "}
              <Link
                href={`/from/${origin.code}/${city === "nairobi" ? "accra" : "nairobi"}`}
                className="font-medium text-forest underline-offset-4 hover:underline"
              >
                We do {city === "nairobi" ? "Accra" : "Nairobi"} too →
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-forest py-14 text-cream">
        <div className="container-gs flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="font-serif text-2xl md:text-3xl">
              Ready to put your {cityName} property to work?
            </h2>
            <p className="mt-2 text-cream/85">
              Tell us about it. We&apos;ll call you within two business hours.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/list-your-property" className="btn-primary">
              List your property
            </Link>
            <a
              href={waLink(waMsg, city)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-light"
            >
              WhatsApp →
            </a>
          </div>
        </div>
        <p className="container-gs mt-4 text-xs text-cream/60">
          Goldstay · A TADCO Company · {site.email}
        </p>
      </section>
    </>
  );
}
