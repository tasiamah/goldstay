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
  slug: "can-you-make-50-percent-nairobi-property-3-years",
  title:
    "Can you really make 50 percent on Nairobi property in 3 years?",
  description:
    "The 50 percent in 3 years pitch is everywhere on social media. Here is the honest 2026 maths on what is actually realistic across mid-market apartments, off-plan, plots and value-add multi-unit residences in Nairobi.",
  publishedAt: "2026-02-27",
  readingMinutes: 5,
  author: authors.research,
  tags: [
    "Returns",
    "Nairobi",
    "Investor",
    "Realistic",
    "Property",
    "Strategy",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Can you make 50 percent Nairobi property 3 years honest",
};

export default function Article() {
  return (
    <>
      <Lede>
        The “50 percent in 3 years”
        pitch is everywhere on social media.
        Marketing decks promise it, influencer
        videos confirm it, the comments
        section celebrates it. Here is the
        honest 2026 maths on what is
        actually realistic.
      </Lede>

      <H2 id="appreciation">Capital appreciation alone</H2>

      <UL>
        <LI>
          Quality Nairobi mid-market apartment
          appreciation: 5 to 8 percent per
          year compounded
        </LI>
        <LI>
          Premium suburb appreciation: 4 to
          7 percent per year
        </LI>
        <LI>
          Over 3 years compounded: 16 to
          26 percent capital appreciation
        </LI>
        <LI>
          50 percent in 3 years on
          appreciation alone requires 14
          percent per year compounded;
          historically rare
        </LI>
      </UL>

      <H2 id="rental">Plus rental income</H2>

      <UL>
        <LI>
          Mid-market gross yield: 9 to 13
          percent
        </LI>
        <LI>
          Net yield after costs: 6 to 9
          percent
        </LI>
        <LI>
          Over 3 years rental income: 18
          to 27 percent of original
          capital
        </LI>
        <LI>
          Total return (appreciation + rent):
          34 to 53 percent over 3 years
          on mid-market quality stock
        </LI>
      </UL>

      <H2 id="leverage">Plus leverage</H2>

      <UL>
        <LI>
          With 70 percent loan-to-value,
          equity returns multiply
        </LI>
        <LI>
          Capital appreciation falls on the
          full property value but applies
          to the equity slice
        </LI>
        <LI>
          On well-performing stock with 70
          percent LTV, 3-year equity
          returns can reach 70 to 100
          percent (after rental cash flow,
          interest and amortisation)
        </LI>
        <LI>
          Caveat: leverage cuts both ways;
          a soft market produces equity
          losses, not gains
        </LI>
      </UL>

      <H2 id="off-plan">Off-plan-specific maths</H2>

      <UL>
        <LI>
          Off-plan deposit at launch
          typically 20 to 30 percent
        </LI>
        <LI>
          On delivery, capital paid plus
          appreciation is the realised
          value
        </LI>
        <LI>
          Where the launch was priced at
          comparable per-square-metre,
          appreciation matches market;
          where launch was priced above
          comparable, the appreciation is
          from a higher base
        </LI>
        <LI>
          Off-plan timing risk and delivery
          slippage can wipe out projected
          gains
        </LI>
      </UL>

      <H2 id="plots">Serviced plot maths</H2>

      <UL>
        <LI>
          Marketing claims of 50 percent in
          3 years are common
        </LI>
        <LI>
          Reality: resale to a non-marketed
          buyer often returns to
          fundamentals (which can be 30
          to 80 percent below the marketed
          purchase price)
        </LI>
        <LI>
          Plot in a confirmed development
          corridor is different from
          marketed plot in a remote area
        </LI>
      </UL>

      <Callout title="The honest return rule">
        50 percent total return in 3 years
        on Nairobi property is achievable
        through quality stock plus rental
        plus leverage. It is not the
        baseline; it is the upper end.
        Most disciplined investors in
        2026 should plan for 25 to 40
        percent total return in 3 years
        ungeared, and 50 to 90 percent
        geared on quality stock with
        manageable risk.
      </Callout>

      <Pullquote>
        Most viral “50 percent in 3
        years” pitches are
        misleading on the maths. The
        underlying truth is that quality
        Nairobi property pairs durable
        appreciation with strong rental
        yield. Together they can produce
        meaningful returns for the
        disciplined investor.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For investor clients we model
        honest expected returns before
        purchase. Read also our pieces on{" "}
        <Link
          href="/insights/best-neighbourhoods-nairobi-rental-yield-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          best neighbourhoods rental yield
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/btl-portfolio-building-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          BTL portfolio building Nairobi
        </Link>
        .
      </P>
    </>
  );
}
