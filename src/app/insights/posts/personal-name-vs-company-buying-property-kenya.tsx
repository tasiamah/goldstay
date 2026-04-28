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
  slug: "personal-name-vs-company-buying-property-kenya",
  title:
    "Personal name or company name: how to hold Kenyan property as a diaspora investor",
  description:
    "Holding Kenyan property in your personal name versus a Kenyan or offshore company has real consequences for tax, succession, exit liquidity and asset protection. Here is the practical comparison for diaspora landlords, when each structure makes sense, and the costs nobody mentions until you are deep into setup.",
  publishedAt: "2026-04-28",
  readingMinutes: 9,
  author: authors.legal,
  tags: ["Kenya", "Ownership Structure", "Tax", "Estate Planning", "Diaspora", "Legal"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Kenyan property ownership structure comparison, personal name versus limited company for diaspora",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost every diaspora client we onboard arrives with
        a strong opinion about whether they want to hold their
        Kenyan property in their personal name or in a
        company. About a third of the time, the opinion they
        arrive with is the wrong one for their actual
        situation. Here is the honest, practical comparison.
        It is not legal advice for your specific case (you
        should still walk through this with a Kenyan tax
        advisor or property lawyer) but it is the framework
        we use day to day.
      </Lede>

      <H2 id="three-options">The three real options</H2>

      <UL>
        <LI>
          <strong>Personal name.</strong> Title registered in
          your individual name, or jointly with a spouse.
          Income taxed under personal income tax rules in
          Kenya (the 7.5% Monthly Rental Income tax for
          residential rent up to a threshold).
        </LI>
        <LI>
          <strong>Kenyan limited company.</strong> A locally
          registered company (you and any co-shareholders
          hold the shares) takes title. Income taxed under
          corporate tax rules, currently 30% on net taxable
          profit for resident companies.
        </LI>
        <LI>
          <strong>Offshore holding company.</strong> A
          non-Kenyan company (commonly Mauritius, BVI, UAE
          free zone, sometimes UK) holds the Kenyan
          property, often through a Kenyan subsidiary.
          Used by larger portfolios and clients with
          existing offshore structures.
        </LI>
      </UL>

      <H2 id="personal-name">When personal name wins</H2>

      <P>
        For most diaspora landlords with one to three
        residential properties in Nairobi or Mombasa,
        personal ownership is the cleanest answer. The
        reasons:
      </P>

      <OL>
        <LI>
          <strong>Tax simplicity.</strong> The 7.5% MRI tax on
          gross residential rent is a final tax up to the
          relevant threshold (currently KES 15m of annual
          rent, revised under the Finance Act). No corporate
          accounts, no audited financials, no separate tax
          return for the structure.
        </LI>
        <LI>
          <strong>Lower setup cost.</strong> No company
          registration, no annual filings, no company
          secretary fee, no statutory audit when revenue
          crosses thresholds. You pay the lawyer to acquire
          and that is broadly it.
        </LI>
        <LI>
          <strong>Cleaner mortgage routes.</strong> Most
          Kenyan mortgages are designed for individual
          borrowers. Company purchases face stricter
          underwriting, higher rates, and shorter terms.
        </LI>
        <LI>
          <strong>Stamp duty on transfer.</strong> If you
          ever move the property between structures
          (personal to company, or sell out), there is a 4%
          stamp duty hit on the value. Starting in personal
          name avoids needing to do this if your portfolio
          stays small.
        </LI>
      </OL>

      <P>
        For a single or pair of investment apartments
        producing under KES 15m a year of rent, personal
        ownership is almost always the right answer.
      </P>

      <H2 id="company">When a Kenyan limited company wins</H2>

      <P>
        Once your Kenyan portfolio passes a certain scale,
        the calculus shifts. The triggers we see most often:
      </P>

      <OL>
        <LI>
          <strong>Annual residential rent above the MRI
          threshold (KES 15m).</strong> Above this threshold
          the simplified MRI regime no longer applies and
          rental income is taxed under standard income tax
          rules. At that point, the corporate route starts
          to compete because corporate tax (30%) on net
          profit can be lower than personal income tax (up
          to 35%) on gross-net rent.
        </LI>
        <LI>
          <strong>Multiple co-investors.</strong> Holding
          through a company with a clean shareholder
          structure is materially simpler than holding
          jointly on title with three or four co-owners.
          Disputes, exits and succession are all cleaner
          inside a company wrapper.
        </LI>
        <LI>
          <strong>Mixed-use or commercial property.</strong>{" "}
          Commercial rental income does not benefit from
          the MRI regime. The choice is between personal
          income tax (graduated) or corporate tax. For
          commercial scale, corporate usually wins.
        </LI>
        <LI>
          <strong>Asset protection from personal
          litigation.</strong> A company structure provides
          a meaningful (though not absolute) layer between
          your personal life and the asset. Useful for
          clients in litigation-heavy industries or with
          significant other personal exposure.
        </LI>
      </OL>

      <P>
        Costs of running a Kenyan limited company for
        property: company registration KES 25,000 to KES
        50,000 one-off, company secretary KES 30,000 to
        KES 80,000 a year, statutory audit (once revenue
        passes KES 5m) KES 60,000 to KES 200,000 a year,
        and tax return preparation KES 30,000 to KES 80,000
        a year. Budget roughly KES 150,000 to KES 350,000
        a year of overhead.
      </P>

      <Callout title="Rough threshold">
        Below KES 12m of annual rent and a single property,
        personal almost always wins after running costs.
        Above KES 18m of annual rent or three or more
        properties, the company structure usually wins.
        Between those numbers it depends on your other
        income, your tax residency, and your succession
        plans.
      </Callout>

      <H2 id="offshore">When an offshore holding makes sense</H2>

      <P>
        Offshore structures (Mauritius is the most common for
        Kenyan property given the double tax treaty) tend to
        be appropriate for three specific situations:
      </P>

      <OL>
        <LI>
          <strong>Larger portfolios, typically USD 2m or
          more.</strong> The structuring cost (USD 5,000 to
          USD 15,000 setup, USD 3,000 to USD 8,000 a year
          ongoing) only pays back at scale.
        </LI>
        <LI>
          <strong>Mixed-jurisdiction exposure.</strong>{" "}
          Investors with property in both Kenya and a third
          country sometimes use a holding to consolidate.
        </LI>
        <LI>
          <strong>Specific exit planning.</strong> If the
          long-term plan is to sell shares of the holding
          rather than the underlying property, offshore can
          be more tax-efficient on exit. This requires
          careful planning at acquisition. Most diaspora
          clients we see do not actually need this and
          would do better with a Kenyan limited company.
        </LI>
      </OL>

      <P>
        Offshore structuring is also where most diaspora
        clients hear the most aggressive sales pitches. Be
        wary of any advisor who recommends offshore as a
        default answer regardless of your portfolio scale.
        It is rarely the right answer at small portfolio
        sizes and the ongoing compliance load is real.
      </P>

      <H2 id="estate-planning">The estate planning factor</H2>

      <P>
        One factor diaspora buyers consistently underweight:
        what happens to the property if you die.
      </P>

      <UL>
        <LI>
          <strong>Personal name without a will.</strong>{" "}
          Property passes under Kenyan succession law,
          which can be slow and expensive for non-resident
          heirs. A grant of probate and confirmation of
          grant easily takes 12 to 24 months. The property
          cannot be sold or transferred during this time.
        </LI>
        <LI>
          <strong>Personal name with a Kenyan-recognised
          will.</strong> Significantly faster, but still
          requires a Kenyan probate process. The will must
          be executed under rules a Kenyan court will
          accept.
        </LI>
        <LI>
          <strong>Company with clear shareholder
          succession.</strong> Shares transfer under company
          law, often much faster. The property does not
          need to move on title; only the shareholding
          does.
        </LI>
      </UL>

      <P>
        For a diaspora buyer with significant family stakes
        in the property, the estate-planning argument can on
        its own justify the company structure even at
        smaller portfolio sizes. Talk to your lawyer about
        this specifically. Most do not raise it
        proactively.
      </P>

      <Pullquote>
        Most diaspora buyers spend more time choosing tile
        finishes than they spend deciding whether the
        property should be in their name or in a company.
        The second decision is worth roughly twenty times
        more over a 10 year hold.
      </Pullquote>

      <H2 id="changing-mind">If you got the structure wrong</H2>

      <P>
        Moving a property between structures (personal to
        company, joint names to single name, or vice versa)
        is a transfer for stamp duty purposes. The hit is
        4% of value at urban locations. There are limited
        exemptions (intra-spousal transfers, certain
        intra-group reorganisations) but in most cases a
        change of structure mid-stream costs 4% of the
        property&rsquo;s current market value plus legal
        fees.
      </P>

      <P>
        That cost is the reason it is worth getting this
        decision right at acquisition. Once you are 18
        months in and the property has appreciated,
        restructuring becomes meaningfully more expensive.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For every sourcing client we run a brief
        ownership-structure conversation before the offer
        letter, with two outcomes: a clear recommendation
        for personal, Kenyan company or offshore, and an
        introduction to a Kenyan tax advisor for clients
        whose situation is genuinely complex enough to
        warrant the deeper conversation. We do not earn
        anything from those introductions and we do not
        push offshore solutions clients do not need.
      </P>

      <P>
        Read alongside our pieces on{" "}
        <Link
          href="/insights/kenya-mri-tax-diaspora-landlords"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the 7.5% MRI tax for diaspora landlords
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/capital-gains-tax-kenya-property-sellers"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          capital gains tax on Kenyan property sales
        </Link>
        .
      </P>
    </>
  );
}
