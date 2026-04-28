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
  slug: "centum-real-estate-review-2026",
  title:
    "Centum Real Estate review 2026: the honest investor guide",
  description:
    "Centum Real Estate is the property arm of Centum Investment Company Limited and a major large-scale developer in Kenya, with master-planned developments at Two Rivers and Pearl Marina (Uganda). Here is the honest 2026 investor and buyer guide.",
  publishedAt: "2026-02-11",
  readingMinutes: 5,
  author: authors.research,
  tags: [
    "Centum",
    "Developer",
    "Two Rivers",
    "Master-Planned",
    "Investor Guide",
    "Nairobi",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Centum Real Estate Nairobi 2026 honest review",
};

export default function Article() {
  return (
    <>
      <Lede>
        Centum Real Estate is the property arm
        of Centum Investment Company Limited and
        a major large-scale developer in Kenya,
        with master-planned developments at Two
        Rivers in Nairobi and Pearl Marina in
        Uganda. Here is the honest 2026 investor
        and buyer guide.
      </Lede>

      <H2 id="background">Background</H2>

      <UL>
        <LI>
          Listed parent: Centum Investment
          Company Limited (NSE: ICDC)
        </LI>
        <LI>
          Real Estate division: master-planned
          developments and standalone projects
        </LI>
        <LI>
          Flagship: Two Rivers, a 102-acre
          mixed-use development in Runda area
        </LI>
        <LI>
          Other projects: Vipingo Ridge
          (coastal estate), Pearl Marina
          (Uganda)
        </LI>
      </UL>

      <H2 id="two-rivers">Two Rivers</H2>

      <UL>
        <LI>
          Master-planned mixed-use
          development with retail (Two Rivers
          Mall), residential phases and
          commercial offices
        </LI>
        <LI>
          Residential phases include luxury
          apartments and townhouses
        </LI>
        <LI>
          Anchor tenants include Carrefour
          and other international retail
        </LI>
        <LI>
          Service charge and governance
          professionally managed
        </LI>
      </UL>

      <H2 id="strengths">Where Centum wins</H2>

      <UL>
        <LI>
          Listed parent provides governance
          and reporting transparency
        </LI>
        <LI>
          Master-planned scale and
          integrated amenity
        </LI>
        <LI>
          Long delivery track record
        </LI>
        <LI>
          Institutional capital partnerships
        </LI>
      </UL>

      <H2 id="trade-offs">Trade-offs</H2>

      <UL>
        <LI>
          Pricing at the premium end; not
          a discount-developer
        </LI>
        <LI>
          Delivery on some early Two Rivers
          phases was slower than planned;
          recent phases delivered more
          consistently
        </LI>
        <LI>
          Resale liquidity strong in
          well-leased phases, slower in
          newer ones
        </LI>
      </UL>

      <H2 id="who">Who suits Centum</H2>

      <UL>
        <LI>
          Mid-premium and premium buyers
          wanting master-planned amenity
        </LI>
        <LI>
          Diaspora buyers wanting listed-
          parent counterparty risk
        </LI>
        <LI>
          Investors seeking integrated
          mixed-use exposure
        </LI>
      </UL>

      <Callout title="The Centum rule">
        For premium and mid-premium buyers
        wanting master-planned amenity and
        listed-parent governance, Centum is
        a credible choice. Headline pricing
        is at the premium end; the
        trade-off is institutional delivery.
      </Callout>

      <Pullquote>
        Master-planned developments are
        rare in Nairobi at this scale.
        Centum&rsquo;s execution at Two
        Rivers is one of the few credible
        examples.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For Centum sourcing clients we run
        compound and unit diligence. Read
        also our pieces on{" "}
        <Link
          href="/insights/two-rivers-runda-area-deep-dive-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Two Rivers and Runda area deep dive
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/best-property-developers-kenya-2026-ranked"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          best property developers Kenya 2026
        </Link>
        .
      </P>
    </>
  );
}
