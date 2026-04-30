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
  slug: "how-much-rent-can-you-afford-nairobi-2026",
  title:
    "How much rent can you actually afford in Nairobi 2026: the honest formula",
  description:
    "Most Nairobi tenants overspend on rent and underspend on everything else. The honest 2026 affordability formula sits below the global 30 percent rule for most Nairobi salaries because cost of living and informal costs are higher than people realise.",
  publishedAt: "2026-04-23",
  readingMinutes: 5,
  author: authors.editors,
  tags: [
    "Affordability",
    "Rent",
    "Nairobi",
    "Tenant",
    "Budget",
    "2026",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "How much rent can you afford Nairobi 2026 honest formula",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most Nairobi tenants overspend on
        rent and underspend on everything
        else. The honest 2026 affordability
        formula sits below the global 30
        percent rule for most Nairobi
        salaries because cost of living and
        informal costs are higher than
        people realise.
      </Lede>

      <H2 id="rule">The honest Nairobi rule</H2>

      <UL>
        <LI>
          Below KES 80,000 net monthly:
          rent should be 25 percent of
          net (KES 20,000 max)
        </LI>
        <LI>
          KES 80,000 to KES 200,000 net:
          rent 25 to 30 percent of net
        </LI>
        <LI>
          KES 200,000 to KES 500,000 net:
          rent 25 to 30 percent of net
        </LI>
        <LI>
          Above KES 500,000 net: rent can
          extend to 35 percent if other
          fixed costs are low
        </LI>
      </UL>

      <H2 id="why-lower">Why Nairobi sits lower than global rules</H2>

      <UL>
        <LI>
          School fees: KES 30,000 to KES
          150,000 monthly per child
          (private)
        </LI>
        <LI>
          Transport: fuel and traffic time
          add real cost
        </LI>
        <LI>
          Power, water, internet: KES
          15,000 to KES 30,000 monthly
        </LI>
        <LI>
          Domestic staff
        </LI>
        <LI>
          Family obligations and remittance
        </LI>
        <LI>
          SACCO contributions
        </LI>
        <LI>
          Tax: PAYE compresses gross to
          net more sharply at upper bands
        </LI>
      </UL>

      <H2 id="examples">Worked examples</H2>

      <UL>
        <LI>
          KES 60,000 net professional in
          their twenties: target rent KES
          15,000 to KES 18,000
        </LI>
        <LI>
          KES 120,000 net mid-career: target
          rent KES 30,000 to KES 36,000
        </LI>
        <LI>
          KES 280,000 net senior
          professional: target rent KES
          70,000 to KES 84,000
        </LI>
        <LI>
          KES 600,000 net senior corporate
          family: target rent KES 150,000
          to KES 200,000
        </LI>
      </UL>

      <H2 id="hidden">Hidden rent-related costs</H2>

      <UL>
        <LI>
          Deposit (often 1 to 2 months)
        </LI>
        <LI>
          Letting fee (often 1 month rent)
        </LI>
        <LI>
          Service charge (sometimes paid
          tenant, sometimes landlord)
        </LI>
        <LI>
          Generator levy
        </LI>
        <LI>
          Internet provider activation
        </LI>
        <LI>
          DSTV setup
        </LI>
        <LI>
          Furnishing if unfurnished
        </LI>
      </UL>

      <H2 id="trap">The Nairobi rent trap</H2>

      <P>
        The most common Nairobi rent mistake:
        signing for an aspirational suburb
        that absorbs 40 to 45 percent of net
        income. The first 6 months work; the
        next 6 months pressure savings; the
        next 12 months erode mental
        bandwidth. Stay below 30 percent.
      </P>

      <Callout title="The rent affordability rule">
        Nairobi rent should sit at 25 to
        30 percent of net income for
        most cohorts. Above that the cost
        of living, school fees, transport
        and family obligations compress
        the rest of life. Below that the
        flexibility compounds.
      </Callout>

      <Pullquote>
        Cheap rent is not status. But
        flexible cash flow is wealth.
        The Nairobi tenants who get this
        often outpace the ones who chased
        the postcode.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For tenant clients we match suburb
        to honest budget. Read also our
        pieces on{" "}
        <Link
          href="/insights/how-to-rent-in-nairobi-foreigner"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to rent in Nairobi foreigner
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/cost-of-living-nairobi-2026-diaspora-returnees"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          cost of living Nairobi
        </Link>
        .
      </P>
    </>
  );
}
