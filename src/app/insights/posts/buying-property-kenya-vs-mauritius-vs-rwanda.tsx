import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "buying-property-kenya-vs-mauritius-vs-rwanda",
  title:
    "Buying property in Kenya vs Mauritius vs Rwanda: an East African comparison for 2026",
  description:
    "Diaspora Africans and international investors increasingly compare Kenya, Mauritius and Rwanda as the three serious property markets in or near East Africa. Each has very different rules on foreign ownership, residency, tax and currency. Here is the practical 2026 comparison from a diaspora investor lens.",
  publishedAt: "2026-02-12",
  readingMinutes: 9,
  author: authors.poonam,
  tags: [
    "Kenya",
    "Mauritius",
    "Rwanda",
    "Comparison",
    "Diaspora",
    "Investment",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Buying property Kenya vs Mauritius vs Rwanda comparison 2026 diaspora investor",
};

export default function Article() {
  return (
    <>
      <Lede>
        Kenya, Mauritius and Rwanda are the three property
        markets diaspora Africans and international
        investors most commonly compare in or near East
        Africa. Each has a different proposition and
        plays a different role in a portfolio. Kenya is
        the deepest market with the broadest tenant base.
        Mauritius offers a transparent, fully tax-efficient
        structure with formal residency-by-investment.
        Rwanda offers the cleanest digital administration
        and the most predictable execution. This is the
        2026 honest comparison from a diaspora investor
        perspective.
      </Lede>

      <H2 id="overview">High-level comparison</H2>

      <UL>
        <LI>
          <strong>Kenya</strong>: market depth, broad
          rental yields, citizenship by descent route for
          diaspora Kenyans, 99-year leasehold for non
          citizens
        </LI>
        <LI>
          <strong>Mauritius</strong>: programme-based
          ownership for foreigners (PDS, IRS, RES, Smart
          Cities), formal residency by investment, low
          tax, clean USD-equivalent settlement
        </LI>
        <LI>
          <strong>Rwanda</strong>: clean digital land
          registry, modest market size, growing
          diplomatic and corporate tenant base, strong
          governance signals
        </LI>
      </UL>

      <H2 id="ownership">Foreign ownership rules</H2>

      <H3 id="kenya">Kenya</H3>

      <P>
        Kenyan citizens, including diaspora Kenyans by
        descent under Article 14 of the 2010 Constitution,
        can own freehold land. Non citizens can own
        99-year leasehold and apartments under sectional
        title without restriction. Agricultural land is
        restricted from non citizens. The detail is in
        our{" "}
        <Link
          href="/insights/freehold-vs-leasehold-kenya-citizenship-rules"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          freehold piece
        </Link>
        .
      </P>

      <H3 id="mauritius">Mauritius</H3>

      <P>
        Foreigners can own immovable property in
        Mauritius only through specific government
        approved schemes:
      </P>

      <UL>
        <LI>
          <strong>PDS (Property Development Scheme)</strong>.
          The current main vehicle, allowing foreigners
          to buy in approved developments
        </LI>
        <LI>
          <strong>IRS and RES (Integrated Resort Scheme,
          Real Estate Scheme)</strong>. Older schemes,
          still active for legacy stock
        </LI>
        <LI>
          <strong>Smart Cities</strong>. Approved master
          developments combining residential, commercial
          and lifestyle
        </LI>
        <LI>
          <strong>Apartments above ground level</strong>.
          Apartments in buildings of at least two
          storeys, above ground floor, can be bought by
          foreigners outside the schemes at a minimum
          price threshold
        </LI>
      </UL>

      <P>
        Foreign buyers in approved schemes above USD
        375,000 qualify for Mauritian residency for
        themselves and their dependents.
      </P>

      <H3 id="rwanda">Rwanda</H3>

      <P>
        Rwandan land is held under emphyteutic leasehold
        rather than freehold. Foreigners can hold these
        leases on the same terms as Rwandans (typically
        99-year), with formal registration through the
        Rwanda Land Management and Use Authority (RLMUA).
        The Land Tenure Regularisation programme has
        already registered the vast majority of parcels
        nationwide, giving the cleanest cadastre in the
        region.
      </P>

      <H2 id="residency">Residency by property investment</H2>

      <UL>
        <LI>
          <strong>Mauritius</strong>: formal scheme.
          Property purchase above USD 375,000 in approved
          development qualifies the buyer (and dependents)
          for residency, with renewable status
        </LI>
        <LI>
          <strong>Kenya</strong>: no residency by property
          purchase. Class G investor permit (USD 100k
          active business investment, not passive
          property), Class K retiree permit (USD 24k
          annual income from outside Kenya). Detail in
          our{" "}
          <Link
            href="/insights/kenya-citizenship-by-investment-residence-permits-2026"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            citizenship piece
          </Link>
        </LI>
        <LI>
          <strong>Rwanda</strong>: residency-by-investment
          available with a USD 250,000 capital threshold
          and qualifying business or property investment,
          renewable
        </LI>
      </UL>

      <H2 id="tax">Tax picture</H2>

      <H3 id="mauritius-tax">Mauritius</H3>

      <UL>
        <LI>
          <strong>Income tax</strong>: 15 percent flat
          rate for individuals
        </LI>
        <LI>
          <strong>Corporate tax</strong>: 15 percent,
          with material reductions on qualifying foreign
          source income
        </LI>
        <LI>
          <strong>Capital gains tax</strong>: none on
          immovable property held in personal name
        </LI>
        <LI>
          <strong>Inheritance tax</strong>: none
        </LI>
        <LI>
          <strong>Rental income</strong>: taxed at 15
          percent
        </LI>
      </UL>

      <H3 id="kenya-tax">Kenya</H3>

      <UL>
        <LI>
          <strong>Personal income tax</strong>: progressive
          up to 35 percent
        </LI>
        <LI>
          <strong>Corporate tax</strong>: 30 percent
          (lower for SMEs)
        </LI>
        <LI>
          <strong>Capital gains tax</strong>: 15 percent
          on disposal
        </LI>
        <LI>
          <strong>Stamp duty</strong>: 4 percent urban,
          2 percent rural
        </LI>
        <LI>
          <strong>Rental income</strong>: 7.5 percent of
          gross rent under MRI for residential landlords
          up to KES 15m gross
        </LI>
      </UL>

      <H3 id="rwanda-tax">Rwanda</H3>

      <UL>
        <LI>
          <strong>Personal income tax</strong>: progressive
          up to 30 percent
        </LI>
        <LI>
          <strong>Corporate tax</strong>: 30 percent,
          with significant incentives for qualifying
          investors
        </LI>
        <LI>
          <strong>Capital gains tax</strong>: 5 percent
          on most asset disposals
        </LI>
        <LI>
          <strong>Property registration tax</strong>:
          modest, often 0.5 to 1 percent of value
        </LI>
        <LI>
          <strong>Rental income</strong>: progressive
          rates, with deductions for actual costs
        </LI>
      </UL>

      <P>
        Mauritius is the most tax efficient of the three.
        Rwanda is the second. Kenya carries the highest
        tax friction but offsets it with deeper rental
        market and broader capital appreciation history.
      </P>

      <H2 id="prices">Pricing benchmarks</H2>

      <P>
        Approximate USD per square metre for premium
        residential apartment stock in 2026:
      </P>

      <UL>
        <LI>
          <strong>Nairobi premium</strong>: USD 2,000 to
          USD 4,000 per sqm
        </LI>
        <LI>
          <strong>Mauritius PDS</strong>: USD 4,500 to
          USD 12,000 per sqm depending on coastal
          location and development quality
        </LI>
        <LI>
          <strong>Kigali premium</strong>: USD 1,500 to
          USD 3,000 per sqm
        </LI>
      </UL>

      <H2 id="yields">Rental yields</H2>

      <UL>
        <LI>
          <strong>Kenya (Nairobi)</strong>: 6 to 9
          percent net on well-managed stock
        </LI>
        <LI>
          <strong>Mauritius</strong>: 3 to 5 percent net,
          driven by lower yield on capital-intensive
          coastal product
        </LI>
        <LI>
          <strong>Rwanda (Kigali)</strong>: 5 to 8
          percent net
        </LI>
      </UL>

      <P>
        Kenya offers the strongest yield. Mauritius is
        the lowest yield but pays back through capital
        preservation, residency value and tax efficiency.
        Rwanda sits in between.
      </P>

      <H2 id="liquidity">Liquidity and resale</H2>

      <UL>
        <LI>
          <strong>Kenya</strong>: deepest secondary
          market, broadest buyer pool, longest selling
          time on premium top end (12 to 24 months
          typical for top tier)
        </LI>
        <LI>
          <strong>Mauritius</strong>: organised resale
          market within PDS schemes, foreign buyers can
          buy second hand within the same schemes,
          generally good liquidity for stock at the
          lifestyle quality end
        </LI>
        <LI>
          <strong>Rwanda</strong>: thin secondary market,
          limited resale liquidity, buy and hold is the
          natural strategy
        </LI>
      </UL>

      <H2 id="currency">Currency</H2>

      <UL>
        <LI>
          <strong>KES</strong>: stable through 2024 to
          2026 in the 125 to 135 range against USD
        </LI>
        <LI>
          <strong>MUR</strong>: managed against a basket,
          historically gradual depreciation, predictable
        </LI>
        <LI>
          <strong>RWF</strong>: gentle long-term
          weakening against USD, relatively predictable
        </LI>
      </UL>

      <H2 id="management">Management and operations</H2>

      <UL>
        <LI>
          <strong>Mauritius</strong>: most professionalised
          property management, with PDS schemes typically
          including operator management as part of the
          structure
        </LI>
        <LI>
          <strong>Kenya</strong>: maturing rapidly,
          credible managers exist at professional scale
        </LI>
        <LI>
          <strong>Rwanda</strong>: small but professional
          management market, relatively easy to find
          credible operators given the size
        </LI>
      </UL>

      <H2 id="who-suits">Who each market suits</H2>

      <OL>
        <LI>
          <strong>Diaspora Kenyan looking at home plus
          diversification</strong>: Kenya as anchor,
          Mauritius for residency-by-investment plus tax
          play, Rwanda as a clean second market
        </LI>
        <LI>
          <strong>Pure yield investor</strong>: Kenya in
          Nairobi premium serviced apartments
        </LI>
        <LI>
          <strong>Lifestyle and residency seeker</strong>:
          Mauritius PDS over USD 375,000
        </LI>
        <LI>
          <strong>Long-hold capital preservation</strong>:
          Mauritius PDS premium coastal, Cape Town
          (covered in our{" "}
          <Link
            href="/insights/nairobi-vs-lagos-vs-cape-town-vs-kigali-property-compared"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            African capitals piece
          </Link>
          ), or Nairobi premium gated communities
        </LI>
        <LI>
          <strong>Investor wanting cleanest
          administration</strong>: Rwanda
        </LI>
      </OL>

      <Callout title="The portfolio thesis many diaspora investors land on">
        Anchor in Kenya for yield and exposure to the
        deepest East African market. Diversify a portion
        into Mauritius for tax efficiency, residency
        optionality and capital preservation. Add Rwanda
        as a smaller second market for clean
        administration and exposure to the Rwandan growth
        story. Each plays a distinct role rather than
        being interchangeable.
      </Callout>

      <Pullquote>
        Mauritius pays you back in residency and tax
        efficiency. Kenya pays you back in yield and
        market depth. Rwanda pays you back in execution
        cleanness and predictable governance. The right
        answer is not one market; it is the right mix.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Our direct expertise sits in Kenya and Ghana. For
        diaspora clients exploring Mauritius PDS or
        Rwanda we can give an honest perspective on how
        the markets compare to Kenya and refer to
        established partners in those markets where we
        work with them. We do not pretend to be the right
        firm for an isolated Mauritius purchase; we are
        the right firm for the Kenya leg of a multi
        country East African portfolio.
      </P>

      <P>
        Read also our{" "}
        <Link
          href="/insights/nairobi-vs-lagos-vs-cape-town-vs-kigali-property-compared"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          African capitals piece
        </Link>{" "}
        and our{" "}
        <Link
          href="/insights/kenya-as-an-emerging-market-real-estate-thesis"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Kenya emerging market piece
        </Link>{" "}
        for the wider context.
      </P>
    </>
  );
}
