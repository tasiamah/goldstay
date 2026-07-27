import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "nairobi-short-stay-licensing-2026-what-changed",
  title:
    "Nairobi short-stay licensing 2026: what changed and what didn't",
  description:
    "Short-stay licensing in Nairobi in 2026 is neither the wild west it was five years ago nor the fully-regulated regime some landlords fear. This is the honest 2026 snapshot: what the law actually says, what enforcement actually does, and what a compliant operator looks like.",
  publishedAt: "2026-07-12",
  updatedAt: "2026-07-27",
  readingMinutes: 8,
  author: authors.legal,
  tags: [
    "Kenya",
    "Nairobi",
    "Short-Stay",
    "Airbnb",
    "Licensing",
    "TRA",
    "Compliance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi short-stay licensing 2026 Airbnb TRA compliance landlord guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        Short-stay letting in Nairobi in 2026
        sits somewhere between the fully
        unregulated free-for-all of five years
        ago and the tightly regulated regime
        some landlords still fear it will
        become. Understanding what has
        actually changed, what has not, and
        what a genuinely compliant operator
        looks like matters for anyone
        underwriting short-stay economics on a
        Nairobi property in 2026. This is the
        honest snapshot.
      </Lede>

      <H2 id="what-actually-changed">
        What actually changed
      </H2>

      <H3 id="tra-registration">Tourism Regulatory Authority (TRA) registration</H3>
      <P>
        The TRA now requires all short-stay
        establishments (defined broadly enough
        to catch most Airbnb operations) to
        register with the Authority. Registration
        involves submitting property
        documentation, a health and safety
        compliance checklist, and payment of a
        registration and annual licence fee.
        The fee structure for a single
        residential unit is modest (typically
        KES 8,000 to KES 15,000 annually,
        subject to unit classification).
      </P>

      <H3 id="county-licensing">Nairobi County single business permit</H3>
      <P>
        Short-stay operations require a
        Nairobi County single business permit
        under the "accommodation" category.
        Fees vary by property size and
        classification but for a typical
        residential apartment operated as a
        short-stay, expect KES 15,000 to KES
        40,000 annually.
      </P>

      <H3 id="tax">Tourism Levy and VAT</H3>
      <P>
        The Tourism Levy of 2 per cent on
        accommodation charges continues to
        apply. VAT registration is required
        where the operator's turnover exceeds
        the KES 5m annual threshold, which is
        genuinely reachable for a small
        multi-unit short-stay operator.
        Individual landlords letting one or
        two units typically stay below the
        threshold and are not required to
        register for VAT.
      </P>

      <H3 id="platform-reporting">Platform-level reporting</H3>
      <P>
        Airbnb, Booking.com and other
        international platforms now share
        booking data with the Kenya Revenue
        Authority under bilateral
        information-exchange arrangements
        that became fully operational during
        2024 to 2025. Landlords who assumed
        offshore platform bookings were
        invisible to KRA should assume they
        are not.
      </P>

      <H2 id="what-did-not-change">
        What did not change
      </H2>

      <UL>
        <LI>
          There is no cap on the number of
          short-stay days per year for a
          residential property (unlike some
          jurisdictions overseas). Full-year
          short-stay operation remains
          permitted subject to compliance.
        </LI>
        <LI>
          There is no requirement to obtain
          consent from other unit owners in a
          sectional-title building to operate
          short-stay from your unit, subject
          to the specific building's
          management company rules. The
          building's own rules are the
          practical constraint, not the
          statutory framework.
        </LI>
        <LI>
          There is no minimum stay duration
          imposed by law. Single-night
          bookings remain permitted.
        </LI>
        <LI>
          Existing residential zoning
          continues to permit short-stay
          operation of residential units
          without a change-of-use application.
          This is important; some sub-Saharan
          jurisdictions have moved to require
          rezoning for short-stay, and Kenya
          has not.
        </LI>
      </UL>

      <Pullquote>
        The 2026 regulatory picture rewards
        compliant operators, penalises
        avoidance, and leaves the underlying
        economics intact. It is the
        transition that matters, not the
        end state.
      </Pullquote>

      <H2 id="what-compliant-operation-looks-like">
        What compliant short-stay operation looks like in 2026
      </H2>

      <UL>
        <LI>
          <strong>TRA registration.</strong>{" "}
          The property is registered with
          the Tourism Regulatory Authority
          under its correct classification.
          The certificate is displayed at
          the property.
        </LI>
        <LI>
          <strong>Nairobi County business
          permit.</strong> Current-year
          permit issued in the operator's
          name, referencing the property
          address.
        </LI>
        <LI>
          <strong>KRA PIN and iTax
          registration.</strong> The
          operator (individual landlord or
          management company) holds a
          current PIN and files monthly or
          annual returns as applicable.
        </LI>
        <LI>
          <strong>Tourism Levy remittance.</strong>{" "}
          Levied on every booking,
          remitted monthly to KRA.
        </LI>
        <LI>
          <strong>Income tax treatment.</strong>{" "}
          Short-stay rental income is
          treated as trading income (not
          rental income under the MRI
          regime), attracting ordinary
          income tax rates on profit
          after allowable expenses.
        </LI>
        <LI>
          <strong>Health, safety and
          insurance.</strong> Fire safety
          compliance, working smoke
          detectors and extinguishers,
          adequate public liability
          insurance. Insurance that
          specifically covers short-stay
          use is different from ordinary
          residential landlord
          insurance; the two are not
          interchangeable.
        </LI>
        <LI>
          <strong>Building consent.</strong>{" "}
          Where the property is in a
          managed sectional block, the
          management company's consent or
          notification is often required
          by the building rules. Non-
          compliance here typically
          produces a management company
          dispute rather than a legal
          issue but it is a real
          operational constraint.
        </LI>
      </UL>

      <H2 id="what-enforcement-actually-does">
        What enforcement actually does in 2026
      </H2>

      <P>
        The gap between what the law says and
        what enforcement actively pursues is
        real. In 2026 Nairobi, the practical
        enforcement priorities are (1) TRA
        registration of visible commercial
        short-stay operators, (2) KRA
        collection of income tax and Tourism
        Levy on platform-reported bookings,
        and (3) county business-permit
        compliance where the county has
        specific complaints. Enforcement
        against individual, low-volume,
        one-property Airbnb hosts remains
        limited but is no longer non-
        existent.
      </P>

      <P>
        The direction of travel is clear:
        compliance is becoming more likely
        to matter, not less. Landlords who
        register properly and pay tax
        properly are protected against a
        future enforcement wave. Landlords
        who do not are running an
        unquantified but growing tail risk.
      </P>

      <Callout title="The one number that changes the underwriting">
        On a Nairobi short-stay unit
        generating KES 1.8m of gross annual
        income, compliant operation
        (registration fees, business permit,
        Tourism Levy, insurance, tax on
        profit) reduces the net operating
        income by roughly 22 to 28 per cent
        versus the unregulated baseline that
        used to prevail. Landlords still
        planning against unregulated
        economics are underwriting a return
        they cannot legitimately achieve.
      </Callout>

      <H2 id="what-to-do-if-you-are-not-compliant">
        What to do if you are already operating and are not compliant
      </H2>

      <UL>
        <LI>
          Register with the TRA now.
          Retroactive fee accumulation is
          typically limited to the current
          year.
        </LI>
        <LI>
          Regularise the county business
          permit for the current year.
        </LI>
        <LI>
          Work with a tax adviser to
          disclose short-stay income to KRA
          for the past three years, pay
          the tax due plus interest, and
          settle. Voluntary disclosure is
          materially cheaper than
          enforcement.
        </LI>
        <LI>
          Adjust the underwriting model on
          the property to reflect compliant
          economics going forward.
        </LI>
      </UL>

      <H2 id="how-we-help">How Goldstay handles short-stay compliance</H2>

      <P>
        For diaspora landlords operating
        short-stay units under Goldstay
        management, we handle the TRA
        registration, county business
        permit, Tourism Levy remittance,
        monthly KRA reporting and tax
        computation as a single package.
        Every unit on the short-stay side of
        the book is fully registered and
        fully compliant. Landlords receive
        a monthly statement showing gross
        bookings, all statutory deductions,
        and net remittance in USD.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb vs long-term rental in Nairobi
        </Link>
        ,{" "}
        <Link
          href="/insights/kenya-mri-tax-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the MRI tax guide for long-let landlords
        </Link>
        , and{" "}
        <Link
          href="/insights/how-diaspora-landlords-get-paid-usd-from-kenyan-rent"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how diaspora landlords get paid USD
        </Link>
        .
      </P>
    </>
  );
}
