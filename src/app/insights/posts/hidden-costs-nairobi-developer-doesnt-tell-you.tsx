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
  slug: "hidden-costs-nairobi-developer-doesnt-tell-you",
  title:
    "The hidden costs no Nairobi developer tells you about",
  description:
    "Nairobi developers market the headline price. The honest cost of an apartment purchase is materially higher once stamp duty, legal, valuation, sectional title, service charge, AOA setup, internet, parking and a dozen other line items are added.",
  publishedAt: "2026-02-15",
  readingMinutes: 5,
  author: authors.editors,
  tags: [
    "Hidden Costs",
    "Nairobi",
    "Developer",
    "Buyer Guide",
    "Property",
    "Honest",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Hidden costs Nairobi developer doesnt tell you 2026 buyer",
};

export default function Article() {
  return (
    <>
      <Lede>
        Nairobi developers market the headline
        price. The honest cost of an apartment
        purchase is materially higher. Here
        is the 2026 list of the hidden costs
        no developer puts on the brochure.
      </Lede>

      <H2 id="purchase">Purchase-side hidden costs</H2>

      <UL>
        <LI>
          Stamp duty: 4 percent of the
          purchase price (in Nairobi)
        </LI>
        <LI>
          Legal fees: 1 to 1.5 percent of
          purchase price plus VAT
        </LI>
        <LI>
          Valuation fees on mortgage
          purchase: KES 60,000 to KES
          150,000
        </LI>
        <LI>
          Mortgage application and
          processing fees
        </LI>
        <LI>
          Bank lawyer fees on mortgage
          (paid by buyer)
        </LI>
        <LI>
          Title registration fee
        </LI>
        <LI>
          Land Rates and Land Rent updates
        </LI>
        <LI>
          Insurance premiums (mortgage
          life, fire and perils)
        </LI>
      </UL>

      <H2 id="handover">Handover-stage hidden costs</H2>

      <UL>
        <LI>
          Sectional title transfer cost
        </LI>
        <LI>
          AOA (owners&rsquo; association)
          setup contribution
        </LI>
        <LI>
          Capital reserve fund contribution
        </LI>
        <LI>
          Initial service charge advance
          (often 6 to 12 months upfront)
        </LI>
        <LI>
          Furniture and fittings if
          unfurnished
        </LI>
        <LI>
          KPLC token meter setup
        </LI>
        <LI>
          Water meter setup
        </LI>
        <LI>
          Internet provider installation
        </LI>
        <LI>
          DSTV or similar entertainment
          installation
        </LI>
      </UL>

      <H2 id="ongoing">Ongoing hidden costs</H2>

      <UL>
        <LI>
          Service charge (KES 8,000 to KES
          25,000 monthly typical)
        </LI>
        <LI>
          Parking levy (sometimes separate)
        </LI>
        <LI>
          Generator fuel levy on power
          outages
        </LI>
        <LI>
          Special assessments for major
          repairs
        </LI>
        <LI>
          Annual rates and rent
        </LI>
        <LI>
          Insurance renewals
        </LI>
        <LI>
          Maintenance and replacement (sinking
          fund needed even if not separately
          itemised)
        </LI>
      </UL>

      <H2 id="rental-side">Rental-side hidden costs (if you let it)</H2>

      <UL>
        <LI>
          Letting fee: 1 month rent
        </LI>
        <LI>
          Property management fee: 6 to
          10 percent of rent collected
        </LI>
        <LI>
          Income tax on rent: 7.5 percent
          MRI or 30 percent corporate
        </LI>
        <LI>
          Vacancy risk
        </LI>
        <LI>
          Tenant default and turnover
          costs
        </LI>
      </UL>

      <H2 id="total">The honest total</H2>

      <P>
        On a KES 20m apartment purchase,
        all-in transaction cost (stamp,
        legal, valuation, registration,
        AOA, advance service charge,
        utility setups, basic furnishing
        adjustments) typically lands
        between 6 and 9 percent of the
        purchase price. Plan for it. The
        unprepared buyer is the one who
        is shocked at handover.
      </P>

      <Callout title="The hidden cost rule">
        Add 7 to 10 percent to the
        headline purchase price for the
        all-in cost into the keys.
        Annual carrying cost is 2 to 4
        percent of the purchase price
        before mortgage. Net rental yield
        is gross yield minus 2 to 3
        percentage points. Plan
        accordingly.
      </Callout>

      <Pullquote>
        The price on the brochure is the
        floor, not the cost. Honest
        buyer modelling adds the hidden
        line items. The buyers who do
        this never get surprised.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we model the
        all-in number before purchase.
        Read also our pieces on{" "}
        <Link
          href="/insights/cost-of-buying-property-kenya-honest-numbers"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          cost of buying property Kenya
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/service-charge-nairobi-honest-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          service charge Nairobi explained
        </Link>
        .
      </P>
    </>
  );
}
