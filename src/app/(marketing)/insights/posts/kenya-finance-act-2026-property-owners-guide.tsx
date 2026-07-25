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
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "kenya-finance-act-2026-property-owners-guide",
  title:
    "Kenya Finance Act 2026: what property owners actually need to know",
  description:
    "MRI, CGT, stamp duty, VAT on commercial rents, the affordable housing levy, and the digital services tax overlaps. A plain-English guide to the 2026 Finance Act for residential landlords and diaspora investors.",
  publishedAt: "2026-07-25",
  readingMinutes: 8,
  author: authors.legal,
  tags: [
    "Kenya",
    "Tax",
    "Finance Act",
    "MRI",
    "CGT",
    "Stamp duty",
    "Compliance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Kenya Finance Act 2026 property tax guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        The Finance Act 2026 is now in force. For property
        owners the changes are meaningful but narrower than the
        press cycle suggested. Here is the plain-English guide
        to what actually changed, what stayed the same, and
        what a diaspora residential landlord needs to be doing
        differently this financial year.
      </Lede>

      <Callout title="A note on scope">
        This is a plain-English orientation, not a personal tax
        opinion. For anything material you should route through
        a Kenyan tax advisor or KRA directly, and if you are
        also UK, US, or EU tax resident, through a diaspora-savvy
        accountant in your home jurisdiction. The rules
        summarised here reflect the position at publication;
        KRA guidance can and does evolve mid-year.
      </Callout>

      <H2 id="mri">Monthly Rental Income (MRI) tax</H2>

      <P>
        MRI stays at 7.5 percent of gross residential rent,
        payable monthly by the 20th of the following month.
        This is unchanged. Two operational nuances did change:
      </P>

      <UL>
        <LI>
          The turnover threshold above which MRI is mandatory
          (rather than optional) remains KES 15 million gross
          rent per annum. Below that, landlords can elect out
          onto normal individual income tax rates, but almost
          nobody should. MRI at 7.5 percent flat is
          dramatically simpler and usually lower than income
          tax on rental after allowable deductions, and does
          not require you to file rental accounts.
        </LI>
        <LI>
          The Act clarifies that MRI applies whether the
          landlord is resident or non-resident, on rental
          income from Kenyan-situated residential property.
          Diaspora landlords have always been in scope; the
          clarification removes ambiguity that a small number
          of aggressive tax advisors were exploiting.
        </LI>
      </UL>

      <H3 id="mri-enforcement">Enforcement is real this year</H3>

      <P>
        KRA has been visibly more aggressive in 2026 on MRI
        collection. Cross-referencing lease agreements filed
        with the Land Registry, county land rates records, and
        M-Pesa Paybill activity is now routine. The average
        assessment we are seeing on non-compliant properties
        includes three to five years of back MRI plus penalties
        (5 percent of tax due) plus interest (1 percent per
        month, compounding). On a KES 100,000/month property
        held three years without MRI compliance, the
        catch-up bill runs to KES 400,000 to 500,000 including
        penalties. The window to voluntarily disclose and
        settle without prosecution risk is narrowing.
      </P>

      <H2 id="cgt">Capital Gains Tax (CGT)</H2>

      <P>
        CGT remains at 15 percent on the gain from disposal of
        land or property, unchanged in headline rate. The
        practically-important 2026 change is on the base cost
        for inherited property: the Act codifies what KRA
        practice already was, namely that the base cost is
        market value at date of death, not the original
        acquisition cost by the deceased. This is helpful for
        beneficiaries and removes years of ambiguity that
        occasionally saw KRA assessing on original cost when
        it suited them.
      </P>

      <P>
        Two things to watch:
      </P>

      <UL>
        <LI>
          The CGT return filing window is now sixty days from
          transfer registration, tightened from the previous
          quarterly cycle. Miss it and penalties apply from
          day sixty-one.
        </LI>
        <LI>
          Losses on property disposal are ring-fenced (can only
          offset gains on other property disposals, not general
          income). This has always been the case but was more
          leniently enforced pre-2026.
        </LI>
      </UL>

      <H2 id="stamp-duty">Stamp duty</H2>

      <P>
        Stamp duty on transfer of immovable property is
        unchanged in structure. Two percent within municipality
        boundaries, four percent outside. What did change is
        the KRA Cash Office collection cadence and the digital
        stamping workflow: the assessment is now generated
        automatically off eCitizen once the sale agreement is
        uploaded, and physical stamping is being phased out
        through 2027. Practically, this means no more losing
        weeks to a mis-filed physical stamp; also means less
        wiggle room for creative sale price valuations, which
        KRA can now cross-check instantly against comparable
        registered transfers.
      </P>

      <H2 id="housing-levy">Affordable Housing Levy</H2>

      <P>
        The 1.5 percent affordable housing levy remains in
        force. The 2026 clarification is important for
        residential landlords: the levy applies to salaried
        income only, not to rental income. Rental income is
        already subject to MRI and does not attract a
        secondary levy. Some tax advisors in 2024–2025 were
        conservatively deducting a second 1.5 percent from
        landlords&apos; net; that is not the correct treatment
        and should be reversed if you are still being charged
        it. If your manager is charging you a &quot;housing
        levy on rent&quot; over and above MRI, that is a red
        flag and worth challenging.
      </P>

      <H2 id="vat">VAT on commercial rents (short-let context)</H2>

      <P>
        For short-let and hospitality operators specifically:
        the Act confirms that furnished short-stay accommodation
        (Airbnb, serviced apartments, Booking.com listings)
        remains VATable at 16 percent once the operator&apos;s
        annual turnover exceeds KES 5 million. This threshold
        is easily crossed by a single well-performing
        short-let unit in Westlands or Karen at Nairobi ADRs,
        and the compliance obligation includes VAT
        registration, monthly filing, and issuing tax invoices
        to guests.
      </P>

      <P>
        The practical consequence: a serious Nairobi short-let
        operation needs to be run as a properly VAT-registered
        business, not as an informal side income. This is one
        of the reasons the short-let-vs-long-let net-of-effort
        crossover has moved: the compliance overhead is real.
        Long-let residential rent remains outside VAT scope
        (it is exempt), so residential landlords who let on
        twelve-month leases do not have to worry about this.
      </P>

      <H2 id="digital-services">Digital services and platform reporting</H2>

      <P>
        The Digital Services Tax provisions in the Act were
        expanded to formally require online platforms
        (Airbnb, Booking.com, Jumia House, BuyRentKenya,
        Property24) to report host and landlord earnings
        directly to KRA. This is now live. If you have been
        earning from any of these platforms without declaring,
        KRA has the data. The right move is voluntary
        disclosure via the KRA Amnesty programme (still open at
        the time of writing) rather than waiting for an
        assessment.
      </P>

      <H2 id="what-to-do">What a diaspora landlord should do this year</H2>

      <OL>
        <LI>
          Confirm your MRI is being remitted monthly with an
          e-slip. If it is not, get current within the next
          two calendar months. Amnesty terms right now are
          more forgiving than they will be next year.
        </LI>
        <LI>
          Check your last twelve months of statements for a
          &quot;housing levy&quot; deduction on top of MRI. If
          present, ask the manager to justify it. In almost
          all cases it should not be there.
        </LI>
        <LI>
          If you are also UK, US, or EU tax resident, ensure
          your Kenyan rental income is being reported under
          your home jurisdiction&apos;s worldwide-income
          rules. Kenya has a double-tax treaty with most
          diaspora-source countries; you claim credit for
          Kenyan tax paid rather than paying twice.
        </LI>
        <LI>
          If you inherited property recently, get a valuation
          report as at the date of death (not today) and store
          it safely. You will need it whenever you eventually
          sell, and the base cost cannot be reconstructed
          later.
        </LI>
        <LI>
          If you own commercial or short-let stock, review
          VAT registration status against the KES 5 million
          threshold. Cross the threshold silently and the
          catch-up bill compounds fast.
        </LI>
      </OL>

      <H2 id="what-did-not-change">What did not change</H2>

      <P>
        For most diaspora residential landlords, the big-ticket
        items are actually stable this year. MRI rate, stamp
        duty structure, CGT rate, freehold and leasehold
        transfer mechanics, and residency rules for owning
        Kenyan property are all unchanged. The Act tightened
        collection and closed some ambiguities; it did not
        rewrite the framework.
      </P>

      <H2 id="closing">Closing</H2>

      <P>
        Tax in Kenya keeps getting easier to comply with and
        harder to hide from. That is a good thing for
        properly-run properties: the ceiling on
        &quot;informal operator&quot; competition has come
        down, which raises the value of running your property
        with a manager who does compliance as core
        infrastructure rather than as afterthought.
      </P>

      <P>
        If you want us to audit whether your current setup is
        in line with the 2026 Act,{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          get in touch
        </Link>
        . Related reading:{" "}
        <Link
          href="/insights/rental-income-tax-calculator-kenya-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          rental income tax calculator
        </Link>
        ,{" "}
        <Link
          href="/insights/kenya-mri-tax-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          MRI for diaspora landlords
        </Link>
        , and the{" "}
        <Link
          href="/insights/capital-gains-tax-kenya-property-sellers"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          CGT guide for sellers
        </Link>
        .
      </P>
    </>
  );
}
