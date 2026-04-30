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
  slug: "house-hacking-nairobi-strategy",
  title:
    "House hacking Nairobi: the local investor strategy",
  description:
    "House hacking, the strategy of living in part of a property and renting out the rest, works in Nairobi if adapted to the local market. Maisonettes, multi-unit residences, the SQ rental and townhouses with rentable wings. Here is the honest 2026 guide for Nairobi investors.",
  publishedAt: "2025-12-16",
  readingMinutes: 5,
  author: authors.research,
  tags: [
    "House Hacking",
    "Nairobi",
    "Investor Strategy",
    "Rental Income",
    "Property",
    "Investment",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "House hacking Nairobi 2026 investor strategy guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        House hacking, the strategy of living in
        part of a property and renting out the
        rest, works in Nairobi if adapted to
        the local market. Maisonettes with SQ
        rental, multi-unit residences,
        townhouses with rentable wings. Here is
        the honest 2026 guide for Nairobi
        investors.
      </Lede>

      <H2 id="strategies">The local strategies</H2>

      <UL>
        <LI>
          <strong>Maisonette + SQ</strong>:
          live in the main house, rent the
          servant’s quarters as
          studio
        </LI>
        <LI>
          <strong>Duplex apartment</strong>:
          live upstairs, rent downstairs
          (where compound permits separate
          access)
        </LI>
        <LI>
          <strong>Townhouse with rentable
          wing</strong>: live in the main
          house, rent the wing as separate
          unit
        </LI>
        <LI>
          <strong>Multi-unit residence</strong>:
          buy a small block (2 to 4 units),
          live in one, rent the rest
        </LI>
        <LI>
          <strong>House-share with
          friends</strong>: own a 3 to
          4-bed, rent rooms to vetted
          housemates
        </LI>
      </UL>

      <H2 id="numbers">The numbers</H2>

      <UL>
        <LI>
          Maisonette + SQ: SQ rental KES
          15,000 to KES 35,000 per month
          covers a meaningful chunk of
          mortgage
        </LI>
        <LI>
          Multi-unit residence (3 units):
          rental from 2 covers 60 to 90
          percent of mortgage in many
          mid-market suburbs
        </LI>
        <LI>
          House-share (3 rooms rented):
          KES 60,000 to KES 150,000
          monthly rental income depending
          on suburb
        </LI>
      </UL>

      <H2 id="suburbs">Where it works</H2>

      <UL>
        <LI>
          Mountain View Estate, Garden
          Estate (maisonette + SQ)
        </LI>
        <LI>
          South B, South C (multi-unit
          residences)
        </LI>
        <LI>
          Kilimani, Lavington, Westlands
          (house-share rooms)
        </LI>
        <LI>
          Kahawa Sukari, Buruburu
          (maisonette + SQ)
        </LI>
        <LI>
          Embakasi, Donholm (multi-unit
          residences)
        </LI>
      </UL>

      <H2 id="financing">Financing considerations</H2>

      <UL>
        <LI>
          Owner-occupier mortgage typically
          requires the owner to live in the
          property
        </LI>
        <LI>
          Multi-unit residence financing is
          available but treated as
          investment property
        </LI>
        <LI>
          Construction of additional rental
          unit on existing plot may require
          county and NEMA approvals
        </LI>
      </UL>

      <H2 id="risks">Risks</H2>

      <UL>
        <LI>
          Tenant management while sharing
          the property
        </LI>
        <LI>
          Compound rules may restrict
          short-let or sub-letting
        </LI>
        <LI>
          Tax: rental income is taxable
          (MRI 7.5 percent or normal
          income tax) even if owner-occupied
        </LI>
        <LI>
          Privacy and lifestyle trade-off
        </LI>
      </UL>

      <Callout title="The house hack rule">
        Done right, house hacking accelerates
        Kenyan property ownership by 5 to
        10 years for the disciplined
        investor. Done wrong, it produces
        ongoing tenant disputes and
        regulatory headaches. Pick the
        strategy that matches your
        lifestyle.
      </Callout>

      <Pullquote>
        The most successful young Kenyan
        property investors are quietly
        running house-hack strategies most
        of the wider market does not
        notice. The maths works.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For house-hack investors we run
        property selection and tenant
        management. Read also our pieces
        on{" "}
        <Link
          href="/insights/multi-unit-property-investment-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          multi-unit property investment
          Nairobi
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/best-neighbourhoods-nairobi-rental-yield-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          best neighbourhoods rental yield
        </Link>
        .
      </P>
    </>
  );
}
