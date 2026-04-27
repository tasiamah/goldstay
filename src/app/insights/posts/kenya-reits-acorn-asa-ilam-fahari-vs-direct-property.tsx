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
  slug: "kenya-reits-acorn-asa-ilam-fahari-vs-direct-property",
  title:
    "Kenyan REITs in 2026: Acorn ASA, ILAM Fahari and direct property compared",
  description:
    "Real Estate Investment Trusts have been pitched as the easy way for diaspora investors to get Nairobi property exposure. The pitch has merit but the trade-off is real. Here is how Acorn ASA, ILAM Fahari and the other listed Kenyan REITs actually perform versus directly owning a Nairobi apartment.",
  publishedAt: "2026-04-13",
  readingMinutes: 9,
  author: authors.poonam,
  tags: ["Kenya", "REIT", "Investment", "Acorn", "ILAM Fahari", "Diaspora"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Kenyan REITs comparison Acorn ASA ILAM Fahari versus direct Nairobi property investment",
};

export default function Article() {
  return (
    <>
      <Lede>
        Real Estate Investment Trusts (REITs) get pitched to
        diaspora Kenyans as the simple, no-headache way to
        get exposure to the Nairobi property market. No
        title diligence, no tenants, no maintenance, no
        management fees. Just buy units, collect dividends,
        sell when you want to exit. The pitch has merit.
        The trade-off is also real, and the honest comparison
        between the listed Kenyan REITs and directly owning
        a Nairobi apartment looks different from the
        glossy version.
      </Lede>

      <H2 id="what-is-a-reit">What a Kenyan REIT actually is</H2>

      <P>
        A REIT is a regulated investment vehicle that holds
        income-producing real estate and distributes the
        rental income to unit holders. Kenya&rsquo;s REIT
        framework, supervised by the Capital Markets
        Authority, allows three categories: Income REITs
        (I-REITs) that hold completed rented property,
        Development REITs (D-REITs) that hold property
        under construction, and Restricted I-REITs sold
        only to professional investors.
      </P>

      <H2 id="kenyan-reits">The Kenyan REITs available in 2026</H2>

      <UL>
        <LI>
          <strong>Acorn Student Accommodation Income REIT
          (ASA I-REIT).</strong> Listed on the Nairobi
          Securities Exchange, holds a portfolio of purpose
          built student accommodation in Nairobi (Qwetu and
          Qejani brands) targeting university students at
          USIU, Strathmore, JKUAT and others. Distributes
          income quarterly. Typical historical distribution
          yield: 7 to 9 percent.
        </LI>
        <LI>
          <strong>Acorn Student Accommodation Development
          REIT (ASA D-REIT).</strong> Funds new construction
          of student accommodation. Higher target return,
          higher risk, no current income.
        </LI>
        <LI>
          <strong>ILAM Fahari I-REIT.</strong> ICEA Lion
          asset management vehicle holding commercial
          property (offices and retail) in Nairobi. Smaller,
          less liquid. Distribution yield has been more
          variable, recently in the 4 to 7 percent range.
        </LI>
        <LI>
          <strong>Stanlib Fahari I-REIT.</strong> A separate
          earlier REIT that has had liquidity and
          performance challenges; treated as a cautionary
          tale rather than an active recommendation.
        </LI>
      </UL>

      <H2 id="reit-pros">The case for REITs</H2>

      <OL>
        <LI>
          <strong>Liquidity.</strong> Listed REITs trade on
          the NSE. You can buy and sell in lot sizes far
          smaller than a property. Settlement is days, not
          months.
        </LI>
        <LI>
          <strong>Diversification.</strong> A USD 5,000
          REIT investment gives you exposure across many
          properties. A USD 5,000 direct property purchase
          is impossible.
        </LI>
        <LI>
          <strong>No operational involvement.</strong> No
          tenants, no leaks, no service charge committee
          AGM. The fund manager runs everything.
        </LI>
        <LI>
          <strong>Tax simplicity.</strong> Distributions
          received are subject to a 5% withholding tax for
          residents, often final. Acquisition is via
          standard share purchase with no stamp duty on
          property transfer.
        </LI>
        <LI>
          <strong>Low entry threshold.</strong> Minimum
          investment via NSE is the price of one unit
          plus brokerage. Acorn ASA units typically trade
          around KES 20 per unit, so KES 50,000 buys a
          meaningful position.
        </LI>
      </OL>

      <H2 id="reit-cons">The case against REITs</H2>

      <OL>
        <LI>
          <strong>You do not own a property.</strong> You own
          units in a fund that owns properties. If you want
          to walk a tenant through your apartment, see your
          asset, eventually pass it to your children, REITs
          do not give you that.
        </LI>
        <LI>
          <strong>Lower net yield, by design.</strong> The
          REIT manager takes a fee (typically 1 to 2% of
          fund value annually) and the portfolio carries
          its own operating costs. Net distribution yield
          to investors is structurally lower than the gross
          yield on the underlying assets. A 7 to 9% REIT
          distribution maps to roughly 9 to 11% gross yield
          on the underlying student accommodation.
        </LI>
        <LI>
          <strong>Liquidity sounds better than it is.</strong>{" "}
          Acorn ASA and ILAM Fahari trade lightly on the
          NSE. Buying KES 200,000 of units at the quoted
          price is easy. Selling KES 5m of units in a
          single day without moving the price is much
          harder. Liquidity is real for small positions and
          modest for institutional sizes.
        </LI>
        <LI>
          <strong>No leverage option.</strong> You cannot
          mortgage REIT units. You cannot scale a property
          portfolio through a REIT the way you can through
          owned apartments.
        </LI>
        <LI>
          <strong>Concentration in narrow segments.</strong>{" "}
          Acorn is exclusively student accommodation. ILAM
          Fahari is mostly older commercial. There is no
          listed REIT today that gives you broad Nairobi
          residential apartment exposure.
        </LI>
      </OL>

      <Callout title="The honest distribution comparison">
        A direct Nairobi apartment in Kilimani or Westlands
        delivers 6.5 to 8% net yield, retains the asset, and
        offers leverage and capital appreciation upside. A
        Kenyan I-REIT typically distributes 5 to 9% yield
        depending on the fund, with much less operational
        burden and much more liquidity. Neither dominates.
        The question is which trade-off matches your goals.
      </Callout>

      <H2 id="when-reits-win">When a REIT is the right answer</H2>

      <UL>
        <LI>
          You want Kenyan property exposure but the operating
          load of direct ownership is genuinely off the
          table for you.
        </LI>
        <LI>
          Your investable amount is below USD 50,000 and the
          minimum scale for direct property does not work.
        </LI>
        <LI>
          You want to test Kenyan property allocation before
          committing to a direct purchase.
        </LI>
        <LI>
          You want exposure to a sector (purpose-built
          student accommodation, commercial office) that you
          would not access directly as a single buyer.
        </LI>
      </UL>

      <H2 id="when-direct-wins">When direct ownership is the right answer</H2>

      <UL>
        <LI>
          Your target investment is USD 100,000 or more, the
          scale at which direct property starts to work
          economically.
        </LI>
        <LI>
          You want USD-denominated income via remittance,
          rather than KES distributions held in a Kenyan
          brokerage account.
        </LI>
        <LI>
          You want long-run capital appreciation on land plus
          building, which REIT units do not capture as
          directly.
        </LI>
        <LI>
          You want the option to use the property yourself,
          gift it to family, or pass it on as a legacy
          asset.
        </LI>
        <LI>
          You want leverage to scale.
        </LI>
      </UL>

      <H2 id="hybrid">The hybrid approach we see most often</H2>

      <P>
        Many of our clients run a barbell. Direct ownership
        of one or two Nairobi apartments at USD 180,000 to
        220,000 each for the durable yield, capital
        appreciation and legacy asset. A modest REIT
        allocation (KES 500,000 to KES 5m) for liquidity
        and sector diversification (typically Acorn ASA for
        the student accommodation exposure). The combination
        captures the upside of both vehicles and smooths the
        operational profile.
      </P>

      <Pullquote>
        REITs are the right answer for some Kenyan property
        exposure questions and the wrong answer for others.
        Get clear on which question you are asking before
        you let the simplicity argument decide.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Goldstay does not sell REIT units, take referral
        fees from REIT managers or earn anything if you
        choose a REIT over direct property. We mention REITs
        in advisory conversations where they fit a
        client&rsquo;s profile, and we say so when they do
        not. For direct property, our{" "}
        <Link
          href="/property-sourcing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property sourcing service
        </Link>{" "}
        runs the full purchase, and our{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          management service
        </Link>{" "}
        runs the operations.
      </P>

      <P>
        Read our broader{" "}
        <Link
          href="/insights/kenya-emerging-market-property-investment-thesis-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Kenya emerging market thesis
        </Link>{" "}
        for the wider context, or the{" "}
        <Link
          href="/insights/best-neighbourhoods-nairobi-rental-yield-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          neighbourhood yield analysis
        </Link>{" "}
        for direct property comparable returns.
      </P>
    </>
  );
}
