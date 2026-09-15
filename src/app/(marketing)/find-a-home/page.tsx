import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { FindHomeSearch } from "@/components/FindHomeSearch";
import { getServerCity } from "@/lib/getServerCity";
import { alternateLanguagesFor, launchedCityPhrase, site } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/JsonLd";
import { HERO_IMAGE_QUALITY } from "@/lib/images";

// Tenant-facing front door. Unlike /list-your-property (which is for
// landlords signing us on) and /apply (which is the private deep-dossier
// form for invited applicants), this page is the public search + waitlist
// surface. It is what we link to from the navbar and from outbound
// marketing aimed at prospective tenants.

export function generateMetadata(): Metadata {
  const city = getServerCity();
  const cityPhrase =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : launchedCityPhrase();
  return {
    title: "Find a home",
    description: `Search vetted long-term and short-stay homes in ${cityPhrase}, or join the Goldstay tenant waitlist and we'll match you to the next property that fits.`,
    alternates: {
      canonical: "/find-a-home",
      languages: alternateLanguagesFor("/find-a-home"),
    },
  };
}

export default function Page() {
  const city = getServerCity();
  const cityPhrase =
    city === "nairobi"
      ? "Nairobi"
      : city === "accra"
        ? "Accra"
        : launchedCityPhrase();

  const baseUrl =
    city === "nairobi"
      ? `https://${site.domains.nairobi}`
      : city === "accra"
        ? `https://${site.domains.accra}`
        : `https://${site.domain}`;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: baseUrl },
          { name: "Find a Home", url: `${baseUrl}/find-a-home` },
        ]}
      />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        {/* next/image hero so the LCP element loads with priority and
            the asset is visible to Google Images. The previous CSS
            background image was crawler-invisible and skipped Next's
            optimisation pipeline. */}
        <Image
          src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=2400&q=80"
          alt={`Light-filled apartment interior. Goldstay vetted homes in ${cityPhrase.replace(" &", " and")}`}
          fill
          priority
          sizes="100vw"
          quality={HERO_IMAGE_QUALITY}
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/85 via-charcoal/70 to-charcoal/95" />
        <div className="container-gs pb-16 md:pb-24">
          <Reveal>
            <div className="max-w-3xl">
              <div className="eyebrow text-gold-400">For tenants</div>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                Find a <em className="italic">home</em> in {cityPhrase}.
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                Long stays and short stays. Every home professionally managed
                by Goldstay, with one team you talk to from viewing to move-in.
                If we don&apos;t have the right one today, join the waitlist
                and we&apos;ll match you before it goes public.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* The search block used to sit under the h1 with no heading of
          its own, which left the page with a single h1 and nothing
          under it, and left FindHomeSearch's own h3 as the next
          heading down, so the outline skipped a level. One h2 fixes
          both and names the thing a tenant came here to do. */}
      <section className="section">
        <div className="container-gs">
          <Reveal>
            <h2 className="font-serif text-2xl text-charcoal sm:text-3xl">
              Search homes to rent in {cityPhrase}
            </h2>
          </Reveal>
          <div className="mt-8">
            <FindHomeSearch />
          </div>
        </div>
      </section>

      {/* Quiet landlord nudge at the very bottom. Mirrors the "Own property
          elsewhere in Kenya?" pattern on the city pages: one line, no big
          CTA banner, easy to ignore for tenants but visible to the slice of
          visitors who landed here by mistake or are wearing the other hat. */}
      <section className="border-t border-charcoal/10 bg-white/40 py-10">
        <div className="container-gs">
          <Reveal>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-charcoal/70">
              <span>Looking to rent out your property instead?</span>
              <Link
                href="/list-your-property"
                className="link-underline text-charcoal"
              >
                List your property →
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
