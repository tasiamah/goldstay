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
  slug: "gra-8-percent-rental-withholding-tax-2026-guide",
  title:
    "GRA 8% rental withholding tax: the honest 2026 diaspora landlord guide",
  description:
    "Ghana's 8 per cent final withholding tax on residential rental income is not complicated, but the diaspora landlord version is. Who withholds, when, on what base, and what happens if you get it wrong.",
  publishedAt: "2026-06-17",
  updatedAt: "2026-07-27",
  readingMinutes: 8,
  author: authors.legal,
  tags: ["Ghana", "Tax", "GRA", "Withholding", "Landlord", "Diaspora"],
  country: "ghana",
  heroImage: "/images/locations/accra.jpg",
  heroAlt:
    "Ghana GRA 8 per cent rental withholding tax diaspora landlord 2026 guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        The mechanics of Ghana’s 8 per cent residential
        rental withholding tax are simple in the
        headline and detailed in the practice. The
        diaspora landlord version, where the landlord
        is not resident in Ghana, adds two layers of
        friction that resident landlords do not face.
        This guide is the operating manual we hand
        every diaspora client on onboarding.
      </Lede>

      <H2 id="the-headline">The headline</H2>

      <P>
        Ghana applies a final withholding tax of 8 per
        cent on gross rental income from residential
        property. “Final” means the withholding
        satisfies the landlord’s income tax obligation
        on that rental stream in full. There is no
        further filing obligation on that income and
        no ability to deduct expenses against it. The
        rate has been stable since the Income Tax Act,
        2015 (Act 896) came into force and has been
        confirmed in every subsequent Budget through
        to 2026.
      </P>

      <P>
        The tax is due monthly, based on rent received
        in that month. It is remitted to the Ghana
        Revenue Authority (GRA) by the 15th of the
        following month, together with a return
        detailing the property, the tenant, and the
        rent paid.
      </P>

      <H2 id="who-actually-withholds">Who actually withholds</H2>

      <H3 id="corporate-tenant">Corporate tenant</H3>
      <P>
        Where the tenant is a company registered in
        Ghana, the tenant withholds. The tenant
        deducts 8 per cent of gross rent at the point
        of payment, remits to GRA on the landlord’s
        behalf, and issues the landlord a withholding
        tax credit certificate. This is the cleanest
        model, and it is why diaspora landlords with
        corporate tenants have the smoothest
        compliance experience.
      </P>

      <H3 id="individual-tenant">Individual tenant</H3>
      <P>
        Where the tenant is an individual, the tenant
        does not withhold. The landlord (or the
        landlord’s agent) is responsible for the
        remittance. This is where most compliance
        errors happen with diaspora landlords: the
        assumption that “the tenant handles it”
        applies to every case, when in reality it
        only applies to corporate tenants.
      </P>

      <H3 id="managing-agent">Managing agent</H3>
      <P>
        Where the property is under a managing agent,
        the agent typically handles the remittance
        for the landlord and issues the landlord a
        monthly statement showing gross rent, 8 per
        cent withheld, and net remitted. This is the
        model we operate for diaspora Goldstay
        clients: the landlord sees the tax line and
        the GRA acknowledgement reference on the
        monthly statement.
      </P>

      <Pullquote>
        The tax is simple. The diaspora landlord
        error is assuming an individual tenant
        withholds when only a corporate tenant does.
      </Pullquote>

      <H2 id="the-base">What counts as “gross rent”</H2>

      <UL>
        <LI>
          Cash rent received in Ghana or overseas from
          the tenant, in cedis or in foreign currency,
          converted at the Bank of Ghana reference
          rate on the date of receipt.
        </LI>
        <LI>
          Service charges recharged to the tenant that
          exceed the actual documented cost. The
          documented pass-through is not rent; the
          margin is.
        </LI>
        <LI>
          Furniture and fixtures rental where the
          landlord is providing furnished
          accommodation.
        </LI>
        <LI>
          Rent-free periods paid up front and
          amortised across the lease. GRA looks at
          the substance, not the label.
        </LI>
      </UL>

      <P>
        What does not count: refundable security
        deposits (held on trust), actual documented
        pass-through of utilities, and any capital
        contribution from the tenant towards a
        specific fit-out.
      </P>

      <H2 id="usd-rents">Handling USD-denominated rents</H2>

      <P>
        A material share of Accra rentals in
        Cantonments, East Legon and Airport
        Residential are denominated in USD. GRA
        accepts the tax computation in USD but
        expects the remittance in cedis converted at
        the Bank of Ghana reference rate on the date
        of receipt. In a year like 2026, where the
        cedi has continued to move, the timing of
        rent receipt versus the timing of remittance
        matters for the cedi amount that actually
        lands with GRA. Landlords who receive rent
        early in the month and remit at month-end can
        find the cedi amount owed is materially
        different from what it would have been on the
        receipt date. Reconcile monthly, do not batch.
      </P>

      <Callout title="The withholding tax credit certificate">
        Insist on receiving the GRA acknowledgement
        or the withholding certificate for every
        month, whether the withholder is the tenant
        or you. It is the only piece of paper that
        proves the tax was actually remitted, and it
        is the piece of paper you need if any future
        query, sale or refinancing arises.
      </Callout>

      <H2 id="what-if-you-fail-to-remit">If you have not been remitting</H2>

      <P>
        The realistic scenario. A diaspora landlord
        has been receiving rent for several years and
        has not been withholding, because the tenant
        is an individual and nobody explained the
        obligation. GRA can and does look back. The
        cleanest way out is a voluntary disclosure
        through an advocate, calculating the arrears
        plus interest (25 per cent per annum on
        unpaid tax, capped by the primary tax
        amount), and settling before enforcement
        starts. Voluntary disclosures typically
        settle at 100 to 130 per cent of the
        outstanding primary tax; enforcement
        settlements at 180 per cent and up.
      </P>

      <H2 id="the-diaspora-landlord-workflow">The diaspora landlord workflow, month by month</H2>

      <OL>
        <LI>
          <strong>Day of rent receipt:</strong>{" "}
          record gross rent in cedis at the Bank of
          Ghana reference rate for the day. If rent
          is in USD, record both the USD amount and
          the cedi equivalent.
        </LI>
        <LI>
          <strong>Within 7 days:</strong> compute the
          8 per cent withholding on the cedi amount.
          If you are on our monthly statement, this
          line is already computed and shown.
        </LI>
        <LI>
          <strong>By the 15th of the following
          month:</strong> remit to GRA and obtain the
          acknowledgement. Filing is done through the
          GRA taxpayer portal on the landlord’s TIN.
        </LI>
        <LI>
          <strong>Retain the acknowledgement</strong>{" "}
          in the property file. You will need it on
          any future sale for the buyer’s diligence,
          on any mortgage application, and if a GRA
          enquiry arises.
        </LI>
      </OL>

      <H2 id="how-we-do-it">How Goldstay handles it</H2>

      <P>
        For diaspora landlords on Goldstay management,
        we compute, withhold and remit the 8 per cent
        on every monthly collection. The tax line
        appears on each monthly statement together
        with the GRA acknowledgement reference. The
        landlord receives the net rent already
        remitted in USD, with the tax already
        settled. Nothing to file, nothing to chase,
        and a clean audit trail if the property is
        ever sold or refinanced.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/ghana-8-percent-withholding-tax-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our earlier withholding-tax primer
        </Link>
        ,{" "}
        <Link
          href="/insights/buying-property-accra-diaspora-2026-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Accra buying guide
        </Link>
        , and, for the equivalent Kenyan tax
        exercise,{" "}
        <Link
          href="/insights/kenya-mri-tax-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our Kenya MRI guide
        </Link>
        .
      </P>
    </>
  );
}
