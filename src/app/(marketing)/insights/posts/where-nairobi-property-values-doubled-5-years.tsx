import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "where-nairobi-property-values-doubled-5-years",
  title:
    "Where Nairobi property values doubled in the last 5 years",
  description:
    "Some Nairobi pockets have meaningfully outperformed the wider market over 5 years, with values doubling or close to doubling on quality stock. Here is the honest 2026 map of the corridors and compounds where this happened, and what it tells us about the next 5 years.",
  publishedAt: "2026-02-12",
  readingMinutes: 5,
  author: authors.research,
  tags: [
    "Capital Growth",
    "Nairobi",
    "Outperform",
    "Buyer Guide",
    "5 Years",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Where Nairobi property values doubled in 5 years honest map",
};

export default function Article() {
  return (
    <>
      <Lede>
        Some Nairobi pockets have meaningfully
        outperformed the wider market over 5
        years, with values doubling or close
        to doubling on quality stock. Here
        is the honest 2026 map of where this
        happened, and what it tells us about
        the next 5 years.
      </Lede>

      <H2 id="corridors">The corridors that doubled</H2>

      <UL>
        <LI>
          <strong>Tatu City and Ruiru
          northern belt</strong>: from
          modest plot prices in 2020 to
          materially higher 2026 levels;
          residential delivery and
          infrastructure caught up
        </LI>
        <LI>
          <strong>Westlands core</strong>:
          The Concord Extension corridor;
          tower delivery and Westlands
          consolidation
        </LI>
        <LI>
          <strong>Karen Plains and
          ultra-premium Karen ring</strong>:
          standalone family stock at the
          top of the segment
        </LI>
        <LI>
          <strong>Lavington core</strong>:
          quality compounds with strong
          governance
        </LI>
        <LI>
          <strong>Riverside Drive
          ultra-premium</strong>: top-tier
          apartments with rising
          replacement cost
        </LI>
      </UL>

      <H2 id="why">Why these pockets outperformed</H2>

      <UL>
        <LI>
          Infrastructure delivery (roads,
          fibre, services) caught up
        </LI>
        <LI>
          Demand exceeded supply within the
          segment
        </LI>
        <LI>
          Replacement cost inflation made
          delivered stock more valuable
        </LI>
        <LI>
          Diaspora demand concentrated in
          recognisable suburbs
        </LI>
        <LI>
          Currency weakness pushed dollar
          equivalent higher
        </LI>
      </UL>

      <H2 id="what-didnt">What did not double</H2>

      <UL>
        <LI>
          Oversupplied tower clusters
        </LI>
        <LI>
          Mass-market estates with weak
          governance
        </LI>
        <LI>
          Marketed serviced plots in remote
          locations
        </LI>
        <LI>
          Off-plan that delivered late or
          below specification
        </LI>
      </UL>

      <H2 id="next">Where the next doubling could happen</H2>

      <UL>
        <LI>
          Lower Kabete and Loresho if
          infrastructure continues to
          improve
        </LI>
        <LI>
          Tatu City core within Tatu
          delivery cycle
        </LI>
        <LI>
          Quality Karen Plains expansion
        </LI>
        <LI>
          Selected Lavington and Brookside
          compound replacement-cost-driven
          appreciation
        </LI>
        <LI>
          High-quality value-add multi-unit
          in mid-market suburbs
        </LI>
      </UL>

      <Callout title="The doubling rule">
        Doubling in 5 years happens in
        specific pockets that combine
        infrastructure delivery, demand
        absorption and replacement cost
        inflation. The rest of the market
        appreciates at the headline 5 to
        8 percent per year. Find the
        pocket. Skip the headline.
      </Callout>

      <Pullquote>
        The headline market and the
        winning pockets are not the same
        thing. The buyers who study the
        pockets outperform the buyers
        who buy the headline.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we identify
        outperforming pockets through
        comparable transaction analysis.
        Read also our pieces on{" "}
        <Link
          href="/insights/best-neighbourhoods-nairobi-rental-yield-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          best neighbourhoods rental yield
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/hidden-nairobi-suburbs-nobody-talking-about"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          hidden Nairobi suburbs
        </Link>
        .
      </P>
    </>
  );
}
