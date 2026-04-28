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
  slug: "ghana-8-percent-withholding-tax-landlords",
  title:
    "Ghana's 8% rental withholding tax: a complete guide for diaspora landlords",
  description:
    "What the GRA actually expects from residential landlords in Accra in 2026, who is liable to withhold, the filing mechanic, the three traps that catch most diaspora owners, and how a manager handles all of it.",
  publishedAt: "2025-07-31",
  readingMinutes: 8,
  author: authors.poonam,
  tags: ["Ghana", "Tax", "Withholding", "GRA", "Accra", "Diaspora"],
  country: "ghana",
  heroImage: "/images/locations/accra.jpg",
  heroAlt: "Accra skyline, Ghana 8% rental withholding tax explained",
};

export default function Article() {
  return (
    <>
      <Lede>
        If you own residential property in Ghana and let it out,
        the Ghana Revenue Authority expects 8% of your gross
        rent. Whether you live in Accra or Atlanta. Whether your
        agent has mentioned it or not. The structure is simpler
        than Kenya&rsquo;s and the penalties are smaller, but the
        compliance gap among diaspora landlords is, if anything,
        wider. Here is what the rule actually says, who pays it,
        the filing mechanic, and the three traps that catch most
        diaspora Ghanaians and Ghana-based foreign owners.
      </Lede>

      <H2 id="what-the-rule-says">What the rule actually says</H2>

      <P>
        Section 116 of the Income Tax Act 2015 (Act 896), as
        amended, imposes a final withholding tax on rental income
        from residential premises at a flat rate of 8% of the
        gross rent. It is a final tax, meaning the landlord owes
        nothing further on that income. There is no further
        income tax computation, no allowable deductions, no
        offset for service charge or repairs.
      </P>

      <P>
        Two sentences buried in that paragraph are worth a closer
        look. &ldquo;Final withholding&rdquo; means the tax is
        deducted at source by the person paying the rent and
        remitted directly to GRA. &ldquo;Gross rent&rdquo; means
        the headline rent agreed in the lease, before any
        deductions for service charge, ground rent, or
        management fees.
      </P>

      <Callout title="Commercial vs residential">
        The 8% rate applies only to residential rent. Commercial
        rent is taxed at 15%. If you have a mixed-use property,
        the rent must be apportioned between the two on a
        reasonable basis and each portion taxed at its
        respective rate.
      </Callout>

      <H2 id="who-withholds">Who is supposed to withhold</H2>

      <P>
        This is the part that catches most diaspora owners. Under
        Ghanaian law, the obligation to withhold sits with the
        person paying the rent, that is, the tenant. In practice,
        when a tenant is an individual paying their own rent,
        almost nobody withholds. The tenant pays gross to the
        landlord, the landlord is then expected to self-assess
        and remit, and most do not.
      </P>

      <P>
        When the tenant is a company (corporate let, embassy
        housing, multinational-paid expat housing), the company
        is well aware of the withholding obligation and will
        deduct 8% from the rent before paying. The landlord
        receives the net 92% plus a withholding tax certificate
        as proof of remittance.
      </P>

      <H3 id="if-self-managed">If you are self-managing</H3>

      <P>
        With an individual tenant, you, the landlord, are the
        responsible party for ensuring the 8% reaches GRA. Most
        self-managed diaspora landlords either do not file at all,
        or file infrequently and inaccurately. The penalties
        compound. We have onboarded landlords with five-figure
        cedi liabilities accrued over three or four years
        without anybody flagging it.
      </P>

      <H3 id="if-managed">If you have a manager</H3>

      <P>
        A reputable manager withholds the 8% from rent at the
        point of collection, files monthly with GRA, and gives
        you the e-receipt on each statement. This is what
        Goldstay does for every Accra unit by default. Managers
        who do not handle this should not be charging full
        management fees.
      </P>

      <H2 id="filing-mechanic">The filing mechanic</H2>

      <OL>
        <LI>
          Withhold 8% from gross rent at the point of collection.
        </LI>
        <LI>
          File the monthly withholding tax return on the GRA
          taxpayer portal by the 15th of the following month.
        </LI>
        <LI>
          Pay the withheld amount via the portal, GhIPSS, or any
          GCB / Stanbic / Ecobank branch.
        </LI>
        <LI>
          Issue a withholding tax credit certificate to the
          landlord, in the case of corporate tenants.
        </LI>
        <LI>
          Retain the e-receipt; GRA can request it in audit.
        </LI>
      </OL>

      <P>
        For diaspora landlords, the only complication in the
        mechanic is that you need a Ghana TIN to be the tax
        person of record. We register clients remotely against
        their passport and proof of ownership; takes about two
        weeks.
      </P>

      <H2 id="the-three-traps">
        Three traps that catch most diaspora landlords
      </H2>

      <H3 id="trap-one">1. The &ldquo;cedi rent&rdquo; vs USD lease problem</H3>

      <P>
        Some Accra leases are denominated in USD (especially
        Cantonments, Airport Residential, East Legon expat
        market). The 8% applies to the cedi-equivalent of the
        USD rent at the rate on the day of payment. Many owners
        report the USD figure to GRA and pay 8% of that without
        FX conversion, which under-states the cedi rent owed in
        a depreciating-cedi environment. GRA has been
        increasingly active in re-assessing these.
      </P>

      <H3 id="trap-two">2. Service charge bundled into rent</H3>

      <P>
        In some Accra estates, service charge is bundled into
        the headline rent figure on the lease. The 8% applies
        to the entire bundled figure, not to the rent net of
        service charge. Owners who think of service charge as a
        separate cost often under-declare. The cleaner structure
        is to separate the two on the lease itself.
      </P>

      <H3 id="trap-three">3. Vacancy assumptions</H3>

      <P>
        Unlike Kenya&rsquo;s MRI, Ghana does not require a nil
        return for vacant months. There is no monthly KES 2,000
        equivalent penalty. But landlords who file in months when
        rent was collected and stay silent in vacant months
        sometimes raise GRA queries about rent that was paid in
        cash and not declared. Best practice is to file the
        return monthly even when zero, with a written note that
        the unit was vacant.
      </P>

      <Pullquote>
        The simpler the rule, the wider the compliance gap.
        Ghana&rsquo;s 8% withholding is one of the easier
        African residential rental tax regimes to comply with,
        and one of the most under-complied with.
      </Pullquote>

      <H2 id="penalties">Penalties for non-compliance</H2>

      <UL>
        <LI>
          Failure to withhold or remit: 100% of the tax due, plus
          interest at the Bank of Ghana rate plus 5% per annum.
        </LI>
        <LI>
          Failure to file: GHS 500 for the first month, GHS 10
          for every additional day the return is outstanding.
        </LI>
        <LI>
          Wilful non-payment: prosecution as a tax offence,
          though we have not seen this enforced against an
          individual residential landlord in our experience.
        </LI>
      </UL>

      <P>
        The financial cost of non-compliance is rarely the GHS
        500 monthly penalty. It is the 100% penalty plus interest
        on the tax itself when it is finally assessed, sometimes
        years later, often at the worst possible time, like when
        you want to sell.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For every Accra residential property we manage:
      </P>

      <UL>
        <LI>
          We register the landlord&rsquo;s Ghana TIN if they do
          not have one.
        </LI>
        <LI>
          We withhold 8% from rent at the point of collection.
        </LI>
        <LI>
          We file the monthly withholding return on the GRA
          portal by the 15th and pay the same week.
        </LI>
        <LI>
          We attach the GRA e-receipt to the monthly statement.
        </LI>
        <LI>
          For corporate tenants withholding at source, we
          collect the withholding tax credit certificate from
          the tenant and file it on your behalf.
        </LI>
      </UL>

      <P>
        If you are not sure whether you are compliant, send the
        property address and your TIN (if you have one) on{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          this form
        </Link>
        . We will pull your GRA file, confirm what has been
        filed, calculate any back-balance and walk you through
        bringing the file current. The diagnostic is free and
        you do not need to switch to use it.
      </P>

      <P>
        For the Kenyan equivalent of this guide, see{" "}
        <Link
          href="/insights/kenya-mri-tax-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our MRI tax write-up
        </Link>
        .
      </P>
    </>
  );
}
