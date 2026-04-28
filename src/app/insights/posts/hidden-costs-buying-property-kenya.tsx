import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "hidden-costs-buying-property-kenya",
  title:
    "The hidden costs of buying property in Kenya nobody talks about",
  description:
    "Buying property in Kenya is rarely just the purchase price. The hidden costs add 8 to 12 percent on top, and most first-time buyers do not budget for them. Here is the honest 2026 list of every cost beyond the asking price, with realistic ranges, who collects them and how to avoid the surprises.",
  publishedAt: "2026-02-10",
  readingMinutes: 7,
  author: authors.legal,
  tags: [
    "Kenya",
    "Buying",
    "Costs",
    "Hidden Fees",
    "Stamp Duty",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Hidden costs of buying property in Kenya 2026 honest breakdown",
};

export default function Article() {
  return (
    <>
      <Lede>
        Buying property in Kenya is rarely just the
        purchase price. The hidden costs add 8 to 12
        percent on top, and most first-time buyers
        do not budget for them. Here is the honest
        2026 list of every cost beyond the asking
        price, with realistic ranges, who collects
        them and how to avoid the surprises.
      </Lede>

      <H2 id="legal">Legal and professional</H2>

      <UL>
        <LI>
          <strong>Buyer&rsquo;s lawyer</strong>: 1
          to 2 percent of purchase price (LSK
          scale; some negotiation possible)
        </LI>
        <LI>
          <strong>Title search and registry
          searches</strong>: KES 5,000 to KES
          15,000
        </LI>
        <LI>
          <strong>Surveyor (where land or
          standalone home)</strong>: KES 25,000 to
          KES 90,000
        </LI>
        <LI>
          <strong>Valuer (typically lender
          required)</strong>: KES 25,000 to KES
          80,000
        </LI>
        <LI>
          <strong>Building inspection (where you
          should but rarely do)</strong>: KES
          25,000 to KES 80,000
        </LI>
      </UL>

      <H2 id="taxes">Taxes and government</H2>

      <UL>
        <LI>
          <strong>Stamp duty</strong>: 4 percent
          urban, 2 percent rural (covered in our{" "}
          <Link
            href="/insights/kenya-stamp-duty-2026-buyer-guide"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            stamp duty piece
          </Link>
          )
        </LI>
        <LI>
          <strong>Land Control Board consent fee
          (where applicable)</strong>: KES 5,000
          to KES 15,000
        </LI>
        <LI>
          <strong>Registration fees</strong>: KES
          1,500 to KES 6,000
        </LI>
        <LI>
          <strong>Outstanding county rates and
          land rent (passed at completion)</strong>:
          variable
        </LI>
      </UL>

      <H2 id="finance">Finance related</H2>

      <UL>
        <LI>
          <strong>Mortgage arrangement fee</strong>:
          1 to 1.5 percent of loan
        </LI>
        <LI>
          <strong>Mortgage life insurance and
          property insurance</strong>: 0.4 to 0.8
          percent of loan annually (years 1 onwards)
        </LI>
        <LI>
          <strong>FX margin (diaspora)</strong>: 0.5
          to 4 percent depending on transfer
          channel
        </LI>
      </UL>

      <H2 id="immediate">Immediate move-in costs</H2>

      <UL>
        <LI>
          <strong>Furnishing (if buying
          unfurnished)</strong>: KES 400,000 to
          KES 2.5m for a 2 to 3 bed
        </LI>
        <LI>
          <strong>Service charge prepayment (3 to
          6 months)</strong>: KES 30,000 to KES
          400,000+
        </LI>
        <LI>
          <strong>Reserve fund top-up (some
          compounds)</strong>: KES 50,000 to KES
          300,000
        </LI>
        <LI>
          <strong>Power and water connection
          deposits</strong>: KES 5,000 to KES
          25,000
        </LI>
        <LI>
          <strong>Initial maintenance and minor
          works</strong>: KES 100,000 to KES
          500,000
        </LI>
        <LI>
          <strong>Security setup (if standalone
          home)</strong>: KES 50,000 to KES
          200,000
        </LI>
        <LI>
          <strong>Internet, alarm, satellite
          subscription deposits</strong>: KES
          15,000 to KES 50,000
        </LI>
      </UL>

      <H2 id="annual">Annual costs to plan for</H2>

      <UL>
        <LI>
          <strong>Service charge (apartments)</strong>:
          KES 8,000 to KES 80,000 a month
        </LI>
        <LI>
          <strong>County rates</strong>: 0.2 to
          1.0 percent of property value annually
        </LI>
        <LI>
          <strong>Land rent (leasehold)</strong>:
          modest, KES 2,000 to KES 30,000 typically
        </LI>
        <LI>
          <strong>Property insurance</strong>: 0.2
          to 0.5 percent of value annually
        </LI>
        <LI>
          <strong>Property management</strong>: 8
          to 15 percent of rent (if rented)
        </LI>
        <LI>
          <strong>Income tax on rental
          income</strong>: typically MRI at 7.5
          percent of gross rent or standard income
          tax depending on structure
        </LI>
      </UL>

      <H2 id="total">The honest total</H2>

      <P>
        For a typical KES 12m apartment purchase
        with mortgage finance, the all-in cost is
        roughly KES 12.9m to KES 13.4m. For a KES
        50m standalone home with mortgage finance,
        the all-in cost is roughly KES 53.5m to
        KES 55m. Add furnishing where applicable.
      </P>

      <P>
        Buyers who budget only the asking price
        scramble through the last 30 days of the
        transaction, and sometimes accept
        compromises (lower spec, lower deposit on
        better property, cheaper lawyer) that
        cost more than the planning would have.
      </P>

      <Callout title="The hidden cost rule">
        Plan for 8 to 12 percent on top of the
        purchase price for transaction and immediate
        costs, then a defined annual operating
        cost on top. Surprise costs in property are
        always the cost of failing to ask the
        question early enough.
      </Callout>

      <Pullquote>
        Property costs are not hidden. They are
        unsearched. The buyers who run the
        spreadsheet at the start avoid the
        unwelcome maths at the end.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we run the full
        all-in cost spreadsheet at the offer letter
        stage so the budget reflects every cost
        before the buyer commits. Read also our
        pieces on{" "}
        <Link
          href="/insights/first-time-home-buyer-kenya-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the first-time buyer guide
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/hidden-costs-building-house-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          hidden costs of building
        </Link>
        .
      </P>
    </>
  );
}
