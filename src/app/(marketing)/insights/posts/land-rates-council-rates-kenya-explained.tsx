import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  KeySummary,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "land-rates-council-rates-kenya-explained",
  title:
    "Land rates and council rates in Kenya: what the county actually charges in 2026",
  metaTitle: "Land rates and council rates in Kenya, 2026",
  description:
    "Land rates, ground rent and county service charges are confusing line items every Kenyan property owner pays but few understand. Here is the honest 2026 guide on what each charge is, who collects it, how it is calculated and what happens when you do not pay.",
  metaDescription:
    "Land rates, ground rent and county service charges are confusing line items every Kenyan property owner pays but few understand.",
  publishedAt: "2026-01-13",
  readingMinutes: 6,
  author: authors.research,
  tags: [
    "Kenya",
    "Land Rates",
    "Council Rates",
    "Tax",
    "County",
    "Property",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Land rates and council rates Kenya 2026 honest guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Land rates, ground rent and county service
        charges are confusing line items every
        Kenyan property owner pays but few
        understand. Three different charges, three
        different collectors, three different
        methods of calculation. Here is the honest
        2026 guide.
      </Lede>

      <KeySummary
        question="What is the difference between land rates and ground rent in Kenya?"
        answer="They are two separate annual charges, collected by two different governments, and a leasehold owner in Nairobi pays both. Land rates are a county tax on the unimproved site value of the land, roughly 0.115 percent of that value in Nairobi, due by 31 March, with interest of 2 to 3 percent a month once you are late. Ground rent is a national government charge that applies to leasehold land only, fixed by the lease itself and typically KES 2,000 to KES 30,000 a year, now collected mostly through Ardhisasa. Freehold owners pay no ground rent. Anyone running the property as a short stay also needs a county Single Business Permit, which starts around KES 5,000."
        facts={[
          {
            label: "Land rates",
            value: "County. About 0.115% of site value in Nairobi",
          },
          {
            label: "Ground rent",
            value: "National. KES 2,000 to 30,000 a year, leasehold only",
          },
          { label: "Land rates due", value: "31 March in most counties" },
          { label: "Late payment", value: "2% to 3% a month, on rates" },
          {
            label: "Short-stay operators",
            value: "Single Business Permit too, from KES 5,000",
          },
          { label: "Freehold land", value: "Rates yes, ground rent no" },
        ]}
      />

      <H2 id="rates">County land rates</H2>

      <P>
        County government tax on the unimproved
        site value of land within the county.
        Charged annually under the Rating Act and
        the various county finance acts.
      </P>

      <UL>
        <LI>
          <strong>Who collects</strong>: the
          county government (Nairobi City County,
          Kiambu County, etc)
        </LI>
        <LI>
          <strong>What it covers</strong>: a
          general property tax; not earmarked
          for specific services
        </LI>
        <LI>
          <strong>How it is calculated</strong>:
          a percentage of the unimproved site
          value as determined by the county
          valuation roll. Nairobi typically 0.115
          percent. Other counties vary
        </LI>
        <LI>
          <strong>When due</strong>: annually,
          by 31 March in most counties
        </LI>
        <LI>
          <strong>Penalty for late payment</strong>:
          interest typically 2 to 3 percent per
          month
        </LI>
      </UL>

      <H2 id="ground-rent">Ground rent (land rent)</H2>

      <P>
        Annual rent payable to the national
        government on leasehold land. Under the
        Land Act, the national government is the
        ultimate landlord of leasehold property,
        and ground rent is the formal recognition
        of that.
      </P>

      <UL>
        <LI>
          <strong>Who collects</strong>: Ministry
          of Lands (national government), now
          mostly through Ardhisasa
        </LI>
        <LI>
          <strong>Applies to</strong>: leasehold
          property only (not freehold)
        </LI>
        <LI>
          <strong>How calculated</strong>: defined
          in the lease as a fixed amount or
          formula. Typical residential leasehold:
          KES 2,000 to KES 30,000 a year
        </LI>
        <LI>
          <strong>When due</strong>: annually
        </LI>
        <LI>
          <strong>Consequence of non-payment</strong>:
          can prevent registration of subsequent
          dealings; long-term arrears can
          theoretically lead to forfeiture (rare
          in practice)
        </LI>
      </UL>

      <H2 id="single">Single Business Permit</H2>

      <P>
        Annual county business permit. Applies to
        commercial property and short-stay
        rental operations.
      </P>

      <UL>
        <LI>
          <strong>Who pays</strong>: business or
          commercial property operator
        </LI>
        <LI>
          <strong>Applies to</strong>: Airbnb and
          serviced apartment operators, commercial
          tenants and landlords
        </LI>
        <LI>
          <strong>Cost</strong>: KES 5,000 to
          KES 100,000+ depending on category
        </LI>
      </UL>

      <H2 id="service-charge">County service charge</H2>

      <P>
        Some counties charge an additional service
        charge for waste collection, sewerage and
        related local services. Nairobi has a
        Sewerage and Solid Waste Management charge
        in addition to the rates above.
      </P>

      <H2 id="how-pay">How to pay</H2>

      <UL>
        <LI>
          <strong>County rates</strong>: Nairobi
          via the Nairobi e-citizen portal or
          NCRPS; other counties via county
          revenue offices and increasingly via
          digital platforms
        </LI>
        <LI>
          <strong>Ground rent</strong>: Ardhisasa
          for properties already on the platform;
          paper at the Ministry of Lands offices
          for the rest
        </LI>
        <LI>
          <strong>Single Business Permit</strong>:
          county portal or county offices
        </LI>
      </UL>

      <H2 id="diaspora">For diaspora owners</H2>

      <UL>
        <LI>
          Set up annual reminders; the bills do
          not arrive at your foreign address
        </LI>
        <LI>
          Pay through your property manager or
          your lawyer
        </LI>
        <LI>
          Keep digital receipts; you will need
          them for transfer or sale
        </LI>
        <LI>
          Check arrears every 24 months; small
          arrears compound silently with
          penalties
        </LI>
      </UL>

      <H2 id="when-not-pay">What happens when you do not pay</H2>

      <UL>
        <LI>
          Rates clearance certificate is
          required for property transfer; arrears
          block sale
        </LI>
        <LI>
          Penalties accumulate at 2 to 3 percent
          per month
        </LI>
        <LI>
          Formal demand notices issued by the
          county
        </LI>
        <LI>
          County publishes lists of defaulters;
          serious arrears can lead to property
          attachment and auction (rare but real)
        </LI>
      </UL>

      <Callout title="The rates rule">
        Pay every annual charge promptly. The
        amounts are modest. The penalties for
        default are not. Build the annual
        payment routine into property
        management; do not leave it to the
        moment of sale.
      </Callout>

      <Pullquote>
        Land rates and ground rent are the
        smallest property taxes Kenyan owners
        pay. They are also the ones owners forget
        most often. The bill arrives quietly. The
        penalty does not.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For management clients we maintain the
        annual rates and ground rent payment
        calendar and ensure clearance
        certificates are in good order at all
        times. Read also our pieces on{" "}
        <Link
          href="/insights/ardhisasa-using-kenya-digital-land-platform-from-abroad"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          using Ardhisasa
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/kenya-property-tax-2026-policy-debate"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the property tax debate
        </Link>
        .
      </P>
      <P>
        If you want the tenancy run end to end, that is{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long-term rental management
        </Link>
        .
      </P>
    </>
  );
}
