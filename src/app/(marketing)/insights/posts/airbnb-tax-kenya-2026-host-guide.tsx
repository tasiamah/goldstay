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
  slug: "airbnb-tax-kenya-2026-host-guide",
  title: "Tax on Airbnb income in Kenya: what short let hosts get wrong",
  description:
    "Short stay income is generally not taxed like residential rent in Kenya, and hosts who assume the 7.5 percent rental regime applies are frequently filing the wrong thing. The regimes that actually bite, and the thresholds to watch.",
  publishedAt: "2026-08-17",
  readingMinutes: 8,
  author: authors.legal,
  tags: ["Airbnb", "Tax", "Kenya", "Short Let", "Compliance", "KRA"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Tax on Airbnb income in Kenya 2026 host guide",
};

export default function Article() {
  return (
    <>
      <Lede>
        The most common tax mistake among Nairobi short let hosts is assuming
        that because they own a property and receive money for it, they are a
        residential landlord. Short stay accommodation is generally treated as a
        business rather than as residential letting, and that single distinction
        changes the rate, the filing, the deductions and whether VAT ever
        applies.
      </Lede>

      <Callout title="Scope of this piece">
        This is general information about how the regimes fit together, not
        advice on your position, and tax law and thresholds change. Anyone
        earning short let income in Kenya should take advice from a Kenyan tax
        practitioner on their own facts before filing.
      </Callout>

      <H2 id="regimes">Why short lets sit in a different box</H2>

      <P>
        Kenya’s simplified residential rental income regime exists for
        landlords letting residential property to tenants. Short stay
        accommodation, offered to the public on a nightly basis, with cleaning,
        linen, consumables and guest services attached, generally looks like a
        hospitality business rather than a letting.
      </P>

      <P>
        That means the default expectation is business income, taxed under the
        ordinary rules that apply to a business, rather than the flat rental
        regime. Practically, the consequences are:
      </P>

      <UL>
        <LI>
          You are taxed on profit rather than on gross receipts, so your costs
          matter
        </LI>
        <LI>
          You are expected to keep proper books, because profit has to be
          computed rather than assumed
        </LI>
        <LI>
          The rate depends on how you hold the property, as an individual or
          through a company
        </LI>
        <LI>
          Other regimes can be triggered by turnover, which never happens under
          the flat rental approach
        </LI>
      </UL>

      <P>
        For contrast, the residential regime is covered in{" "}
        <Link
          href="/insights/kenya-mri-tax-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the MRI guide for diaspora landlords
        </Link>
        . If you let long term, that is your world. If you let nightly, it
        probably is not.
      </P>

      <Pullquote>
        Being taxed on profit rather than on gross is usually better for a
        short let host, because a short let has real costs. It is only better if
        you have kept the records to prove them.
      </Pullquote>

      <H2 id="deductions">What being a business gets you</H2>

      <P>
        This is the part hosts under use. Because you are taxed on profit, the
        cost of running the operation reduces the taxable amount, provided it is
        genuinely incurred for the business and documented.
      </P>

      <UL>
        <LI>Cleaning and laundry</LI>
        <LI>Consumables and guest supplies</LI>
        <LI>Utilities attributable to the letting</LI>
        <LI>Platform commission and payment fees</LI>
        <LI>Management and letting fees</LI>
        <LI>Repairs and maintenance, as distinct from capital improvement</LI>
        <LI>Insurance for the activity</LI>
        <LI>Internet and subscriptions used for the business</LI>
        <LI>Permits and professional fees</LI>
        <LI>
          Capital allowances or depreciation on furniture and equipment, subject
          to the rules
        </LI>
      </UL>

      <P>
        The catch is documentation. A cost you cannot evidence is a cost you
        cannot claim, and short let costs are exactly the kind that get paid in
        cash and forgotten. This is the practical reason to run the whole
        operation through one bank account.
      </P>

      <H2 id="vat">The VAT question nobody expects</H2>

      <P>
        Accommodation services are a vatable supply in Kenya, and there is a
        turnover threshold above which registration is compulsory. A single
        well performing unit is unlikely to reach it. A portfolio of several,
        or one high performing serviced operation, can.
      </P>

      <P>
        This matters more than it sounds. Registering changes your effective
        pricing, because you either absorb the VAT or add it to the guest’s
        bill, and your platform pricing has to accommodate that. Hosts who
        expand from one unit to five and never revisit this can find themselves
        past the threshold without having registered.
      </P>

      <UL>
        <LI>
          Track your rolling annual turnover across all units, not per unit
        </LI>
        <LI>
          Understand what your gross booking value is versus what the platform
          remits to you, because the relevant figure is the value of the supply
        </LI>
        <LI>
          Take advice before you cross, not after
        </LI>
      </UL>

      <H2 id="other">The other charges that apply to accommodation</H2>

      <OL>
        <LI>
          <strong>County single business permit.</strong> Short stay
          accommodation is a commercial activity and the county expects to
          licence it
        </LI>
        <LI>
          <strong>Tourism sector levies.</strong> Accommodation establishments
          are subject to a levy on accommodation revenue under the tourism
          framework. Whether and how it applies to a small operator is a point
          to confirm, and it is increasingly enforced
        </LI>
        <LI>
          <strong>Withholding on payments you make.</strong> If you pay a
          Kenyan management company, professional fees or certain services, you
          may have withholding obligations of your own
        </LI>
        <LI>
          <strong>Non resident considerations.</strong> Living abroad does not
          remove Kenyan tax on Kenyan source income, and it may create a
          reporting obligation where you live too. See{" "}
          <Link
            href="/insights/how-diaspora-landlords-get-paid-usd-from-kenyan-rent"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            how diaspora landlords get paid
          </Link>
        </LI>
      </OL>

      <H2 id="structure">Individual or company</H2>

      <P>
        Worth deciding deliberately rather than by default, because changing
        later means transferring the property, which has its own cost.
      </P>

      <UL>
        <LI>
          <strong>Individual.</strong> Simpler and cheaper to run, taxed at
          graduated personal rates, and the whole thing sits on your personal
          return. Fine for one or two units
        </LI>
        <LI>
          <strong>Company.</strong> More administration and cost, a flat
          corporate rate, cleaner separation of the business, and easier to
          invoice organisations from. Frequently the right answer once you are
          running several units or chasing the corporate market, where a
          compliant invoice in a company name is the price of entry
        </LI>
      </UL>

      <P>
        The trade offs are worked through in{" "}
        <Link
          href="/insights/personal-name-vs-company-buying-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          personal name versus company
        </Link>
        .
      </P>

      <Callout title="The compliance dividend">
        Getting registered properly is usually presented as a cost. For short
        let hosts it is also the entry ticket to the best segment in the
        market, because NGO, UN and corporate guests can only book from someone
        who can issue a compliant invoice. The compliance you were avoiding is
        the thing that unlocks six week bookings.
      </Callout>

      <H2 id="practical">What to actually do</H2>

      <OL>
        <LI>
          Establish whether your activity is business income or residential
          rental income, with an adviser, and file accordingly
        </LI>
        <LI>
          Get the county permit and the registration in place before revenue
          rather than after
        </LI>
        <LI>
          Run everything through one dedicated bank account. This single habit
          makes the rest possible
        </LI>
        <LI>
          Keep every receipt, including the small cash ones. They are money
        </LI>
        <LI>
          Track rolling turnover so the VAT threshold does not arrive
          unannounced
        </LI>
        <LI>
          Reconcile monthly rather than reconstructing in a panic before a
          filing deadline
        </LI>
      </OL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We produce monthly statements with itemised costs and receipts, which is
        the record an accountant needs to compute profit properly. We are not
        tax advisers and we do not file for owners, but we make sure the
        underlying records exist.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/nairobi-short-stay-licensing-2026-what-changed"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Nairobi short stay licensing
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/kenya-finance-act-2026-property-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Finance Act 2026 guide for property owners
        </Link>
        .
      </P>
    </>
  );
}
