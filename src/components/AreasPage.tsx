import Link from "next/link";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { SectionHeader } from "./SectionHeader";
import { CTABanner } from "./CTABanner";
import { CalculatorTeaser } from "./CalculatorTeaser";
import { BreadcrumbJsonLd } from "./JsonLd";
import {
  cities,
  cityTrail,
  neighbourhoodSlug,
  site,
  type Neighbourhood,
} from "@/lib/site";
import { getServerCity } from "@/lib/getServerCity";

type City = "nairobi" | "accra";

// One page comparing every area we manage in, replacing the thin
// per-area pages that used to exist for areas we have nothing
// particular to say about.
//
// The per-area data — rent bands, tenant mix, nightly rates and
// occupancy — was always the good part of those pages; it was the
// nine hundred words of shared template around it that made them
// near-duplicates of each other. Collected here it becomes something
// none of them was individually: a straight comparison a landlord can
// read in one sitting to work out where their money goes furthest.
//
// It also gives the consolidated URLs somewhere honest to redirect
// to. A thin page redirected to the homepage is a soft 404; redirected
// to the table that contains its actual content, it is the same
// information in a better place.
export function AreasPage({ city }: { city: City }) {
  const c = cities[city];
  const cityName = city === "nairobi" ? "Nairobi" : "Accra";
  const domainCity = getServerCity();
  const baseUrl =
    domainCity === "nairobi"
      ? `https://${site.domains.nairobi}`
      : domainCity === "accra"
        ? `https://${site.domains.accra}`
        : `https://${site.domain}`;
  const selfUrl = `${baseUrl}/${city}/areas`;

  // Sorted by the top of the rent band, because "where is the rent
  // highest" is the question the table gets opened for. Annotated
  // because the cities map is a const literal, so mapping it raw
  // yields a union in which shortLet only exists on some members.
  const areas: Neighbourhood[] = [...c.neighbourhoods].sort(
    (a, b) => b.twoBrUsd.max - a.twoBrUsd.max,
  );

  const lowest = areas[areas.length - 1];
  const highest = areas[0];
  const withShortLet = areas.filter((n) => n.shortLet);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          ...cityTrail(city, domainCity),
          { name: "Areas", url: selfUrl },
        ]}
      />

      <section className="relative overflow-hidden bg-charcoal pt-32 text-cream sm:pt-40">
        <Image
          src={
            city === "nairobi"
              ? "/images/locations/nairobi.jpg"
              : "/images/locations/accra.jpg"
          }
          alt={`${cityName} residential areas Goldstay manages property in`}
          fill
          priority
          sizes="100vw"
          quality={80}
          className="-z-10 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-charcoal/65 via-charcoal/70 to-charcoal/95" />
        <div className="container-gs pb-20 md:pb-28">
          <Reveal>
            <div className="max-w-3xl">
              <Link
                href={`/${city}`}
                className="inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-widest-xl text-gold-400 hover:text-gold-300"
              >
                {c.country} · {cityName}
              </Link>
              <h1 className="mt-6 font-serif text-display-lg text-cream balance">
                {cityName} rents by area,{" "}
                <em className="italic">compared.</em>
              </h1>
              <p className="mt-6 max-w-2xl text-lg text-cream/80 pretty md:text-xl">
                What a well-finished two-bedroom lets for in each of the{" "}
                {areas.length} {cityName} areas we manage in, who rents there,
                and where nightly letting makes more than a lease. Indicative
                bands from recently let stock — directional, not guarantees.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-gs max-w-5xl">
          <SectionHeader
            eyebrow="Long-term rents"
            title={`What a two-bed lets for across ${cityName}.`}
            lede={`${highest.name} sits at the top of the range and ${lowest.name} at the bottom, a spread of roughly ${Math.round(((highest.twoBrUsd.max - lowest.twoBrUsd.max) / lowest.twoBrUsd.max) * 100)}% on the same size of apartment. The difference is tenant type more than square metres.`}
          />

          <div className="mt-14 overflow-hidden rounded-2xl border border-charcoal/10 bg-cream">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-charcoal/10 bg-white/60">
                  <tr>
                    <th className="px-5 py-4 font-medium">Area</th>
                    <th className="px-5 py-4 font-medium">
                      2-bed, per month
                    </th>
                    <th className="px-5 py-4 font-medium">Who rents there</th>
                    <th className="px-5 py-4 font-medium">Nightly letting</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/5">
                  {areas.map((n) => (
                    <AreaRow key={n.name} city={city} n={n} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-6 text-sm text-charcoal/60">
            Bands assume a well-finished apartment in a well-run building. A
            unit at the bottom of its band is usually there because of
            presentation, parking or water rather than location.
          </p>
        </div>
      </section>

      {withShortLet.length > 0 ? (
        <section className="section bg-white/50">
          <div className="container-gs max-w-3xl">
            <SectionHeader
              eyebrow="Long lease or nightly"
              title="Where short letting beats a lease."
              lede={`Of the ${areas.length} areas above, ${withShortLet.length} carry enough nightly demand for us to take on a short let. The rest we would rather manage on a lease, and we will say so.`}
            />
            <div className="mt-12 space-y-8">
              {withShortLet.map((n) => (
                <Reveal key={n.name}>
                  <div>
                    <h3 className="font-serif text-2xl text-charcoal">
                      {n.name}
                    </h3>
                    <p className="mt-1 font-mono text-sm text-charcoal/70">
                      USD {n.shortLet!.nightlyUsd.min}–
                      {n.shortLet!.nightlyUsd.max} a night ·{" "}
                      {n.shortLet!.occupancyPct.min}–
                      {n.shortLet!.occupancyPct.max}% occupancy
                    </p>
                    <p className="mt-3 text-charcoal/75 pretty">
                      {n.shortLet!.note}
                    </p>
                    <p className="mt-3 text-charcoal/60 pretty">
                      {n.shortLet!.caveat}
                    </p>
                    {city === "nairobi" ? (
                      <Link
                        href={`/${city}/${neighbourhoodSlug(n.name)}/airbnb-management`}
                        className="mt-3 inline-block text-sm underline decoration-gold-500 underline-offset-4"
                      >
                        Airbnb management in {n.name} →
                      </Link>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CalculatorTeaser />
      <CTABanner />
    </>
  );
}

function AreaRow({ city, n }: { city: City; n: Neighbourhood }) {
  const slug = neighbourhoodSlug(n.name);
  return (
    <tr className="align-top">
      <td className="px-5 py-4">
        {/* Only areas with a page of their own are linked. Linking the
            rest would point at a redirect, which wastes the click and
            the crawl. */}
        {n.profile ? (
          <Link
            href={`/${city}/${slug}`}
            className="font-medium underline decoration-charcoal/25 underline-offset-4 hover:decoration-gold-500"
          >
            {n.name}
          </Link>
        ) : (
          <span className="font-medium">{n.name}</span>
        )}
      </td>
      <td className="whitespace-nowrap px-5 py-4 font-mono text-charcoal/80">
        ${n.twoBrUsd.min.toLocaleString()}–${n.twoBrUsd.max.toLocaleString()}
      </td>
      <td className="px-5 py-4 text-charcoal/70">{n.tenant}</td>
      <td className="px-5 py-4 text-charcoal/70">
        {n.shortLet ? (
          <span>
            ${n.shortLet.nightlyUsd.min}–${n.shortLet.nightlyUsd.max}/night
          </span>
        ) : (
          <span className="text-charcoal/40">Lease only</span>
        )}
      </td>
    </tr>
  );
}
