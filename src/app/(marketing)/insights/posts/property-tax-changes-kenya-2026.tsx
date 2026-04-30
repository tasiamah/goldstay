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
  slug: "property-tax-changes-kenya-2026",
  title:
    "Property tax changes Kenya 2026: what buyers and landlords must know",
  description:
    "Property-related taxation in Kenya has evolved meaningfully through the Finance Act and KRA enforcement focus. Here is the honest 2026 summary on what changed, what is enforced harder, and what every buyer and landlord must know.",
  publishedAt: "2026-01-28",
  readingMinutes: 5,
  author: authors.legal,
  tags: [
    "Tax",
    "Property",
    "Kenya",
    "Buyer",
    "Landlord",
    "Compliance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Property tax changes Kenya 2026 buyers landlords must know",
};

export default function Article() {
  return (
    <>
      <Lede>
        Property-related taxation in Kenya has
        evolved meaningfully through the
        Finance Act and KRA enforcement focus.
        Here is the honest 2026 summary.
      </Lede>

      <H2 id="purchase">Purchase-side taxation</H2>

      <UL>
        <LI>
          Stamp duty on Nairobi property:
          4 percent of purchase price
        </LI>
        <LI>
          Land Control Board consent fees
          (where applicable)
        </LI>
        <LI>
          KRA PIN required for both buyer
          and seller; Lands Office cross-checks
        </LI>
        <LI>
          Withholding tax on commission to
          agents
        </LI>
      </UL>

      <H2 id="rental">Rental income taxation</H2>

      <UL>
        <LI>
          Monthly Rental Income (MRI)
          regime: 7.5 percent of gross
          rental income (where applicable)
        </LI>
        <LI>
          Above the MRI threshold or where
          owner elects: corporate or
          personal income tax (up to 30
          percent)
        </LI>
        <LI>
          KRA enforcement on undeclared
          rental income strengthened
        </LI>
        <LI>
          iTax filing required regardless
          of regime
        </LI>
      </UL>

      <H2 id="capital-gains">Capital Gains Tax (CGT)</H2>

      <UL>
        <LI>
          15 percent of net gain on sale
          of property
        </LI>
        <LI>
          Primary residence exemption
          applies under specific
          conditions
        </LI>
        <LI>
          Exemptions and deductions clarified
          in recent Finance Acts
        </LI>
        <LI>
          KRA enforcement on undeclared
          gains tightened
        </LI>
      </UL>

      <H2 id="vat">VAT on commercial and serviced</H2>

      <UL>
        <LI>
          VAT applies to commercial property
          sale and rental above threshold
        </LI>
        <LI>
          Serviced apartments above
          threshold: VAT applies
        </LI>
        <LI>
          Pure long-term residential rent:
          VAT exempt
        </LI>
      </UL>

      <H2 id="tourism-levy">Tourism Levy on short-let</H2>

      <UL>
        <LI>
          2 percent of revenue (Tourism
          Levy) on short-let where
          applicable
        </LI>
        <LI>
          Plus VAT above threshold
        </LI>
        <LI>
          Plus income tax on net
        </LI>
      </UL>

      <H2 id="rates">Land Rates and Rent</H2>

      <UL>
        <LI>
          Annual Land Rates (county): 0.115
          percent of unimproved value in
          Nairobi (varies by county)
        </LI>
        <LI>
          Annual Land Rent (national, on
          leasehold): nominal but must be
          paid; arrears block transfers
        </LI>
        <LI>
          County rates clearance
          certificate required for transfer
        </LI>
      </UL>

      <H2 id="enforcement">Enforcement focus 2026</H2>

      <UL>
        <LI>
          KRA on undeclared rental income
          (data sharing with utilities and
          banks)
        </LI>
        <LI>
          KRA on undeclared CGT on
          property sale
        </LI>
        <LI>
          County rates clearance enforcement
          at Lands Office on transfer
        </LI>
        <LI>
          Cross-referencing iTax with bank
          and Lands data
        </LI>
      </UL>

      <H2 id="practical">Practical implications</H2>

      <UL>
        <LI>
          Declare rental income properly;
          MRI is straightforward and
          relatively low
        </LI>
        <LI>
          Plan CGT in any sale; document
          original cost basis carefully
        </LI>
        <LI>
          Pay rates and rent annually;
          do not let arrears accumulate
        </LI>
        <LI>
          Engage qualified tax counsel for
          structuring decisions
        </LI>
        <LI>
          Diaspora landlords: KRA non-resident
          process applies; 7.5 percent MRI
          option useful
        </LI>
      </UL>

      <Callout title="The compliance rule">
        Property tax compliance in Kenya is
        not optional in 2026. KRA cross-references
        more data than ever. The cost of
        compliance is small; the cost of
        non-compliance is large. Pay tax
        properly and sleep well.
      </Callout>

      <Pullquote>
        Tax compliance is the cheapest
        professional service a Nairobi
        landlord buys. It also produces
        the most peace of mind.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For landlord clients we coordinate
        with qualified tax counsel for
        ongoing compliance. Read also our
        pieces on{" "}
        <Link
          href="/insights/property-taxes-fees-buying-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property taxes Kenya
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/rental-income-tax-kenya-mri-7-5-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          rental income tax MRI
        </Link>
        .
      </P>
    </>
  );
}
