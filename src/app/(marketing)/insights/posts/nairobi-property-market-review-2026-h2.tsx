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
  slug: "nairobi-property-market-review-2026-h2",
  title:
    "Nairobi property market review: the honest H2 2026 update",
  description:
    "Rents, yields, transaction volumes, off-plan delivery, and the two things nobody in the market wants to say out loud. Our half-year read on Nairobi property, six months on from the H1 review.",
  publishedAt: "2026-07-25",
  readingMinutes: 9,
  author: authors.research,
  tags: ["Nairobi", "Market", "Rents", "Yields", "Off-plan", "H2 2026"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi skyline from Upper Hill, H2 2026 property market review",
};

export default function Article() {
  return (
    <>
      <Lede>
        Six months on from our H1 read, Nairobi property looks
        superficially calm and structurally more fragile than a
        casual glance suggests. Rents in the premium belt are
        holding, transaction volumes in the mid-market have
        thinned, and the off-plan queue is quietly re-pricing.
        Here is what the numbers show, what we are seeing on the
        ground with owners, and the two things the industry is
        not saying out loud.
      </Lede>

      <H2 id="headline">The headline</H2>

      <P>
        The market did not crash. It also did not run. Median
        asking rents across the premium suburbs we track (Karen,
        Runda, Muthaiga, Gigiri, Lavington, Kileleshwa, Westlands,
        Kilimani, Riverside, Spring Valley) are up between 2 and 6
        percent year on year, a range that trails inflation. Sales
        transaction volumes at the county are down roughly 12
        percent versus H2 2025. Off-plan units listed at H1 launch
        prices are quietly being repositioned with soft discounts
        and closing incentives that were unthinkable eighteen
        months ago.
      </P>

      <P>
        The story is not the aggregate, it is the dispersion. A
        well-located, well-finished 2-bed in Kileleshwa or
        Lavington still lets in under fourteen days and sells at
        or above asking. A poorly-positioned 3-bed in the same
        suburb, or almost any unit in the oversupplied Kilimani
        apartment belt, sits for months. The distance between the
        two has widened this year.
      </P>

      <Pullquote>
        The market did not crash. It also did not run. What
        changed is the distance between the best-positioned
        stock and everything else. That gap is now large enough
        to punish laziness.
      </Pullquote>

      <H2 id="rents">Rents: which way, at what pace</H2>

      <H3 id="premium">Premium suburbs</H3>

      <P>
        Karen and Runda 4 and 5-bed family homes are seeing
        clearing rents 4 to 6 percent above the same period last
        year, driven mainly by diaspora returnee demand and by a
        growing cohort of senior corporate expats being posted
        into Nairobi rather than into Johannesburg or
        Johannesburg-plus-remote arrangements. The premium is
        real but is concentrated in properties with fibre,
        reliable water, professionally managed compound
        security, and a functioning back-up power set-up. Same
        square metreage without those attributes is flat.
      </P>

      <H3 id="mid-market">Mid-market suburbs</H3>

      <P>
        Kilimani, Kileleshwa, Lavington 1 and 2-bed apartments
        are flat to marginally up in headline asking, but
        landlord-reported clearing rents (which is what actually
        matters) are down 2 to 3 percent on new leases signed
        this year. Vacancy periods between tenancies have crept
        from a median of nineteen days last year to twenty-six
        this year. The visible pain is in the newer
        stock: units delivered in 2024 and 2025 are competing
        against each other on rent because they cannot compete
        on location.
      </P>

      <H3 id="emerging">Emerging corridors</H3>

      <P>
        Ruiru, Kitengela, Syokimau, Athi River and the Thika
        Road corridor beyond Kasarani are in a different
        conversation entirely. Rents there are up 5 to 9
        percent, driven by first-time buyer families priced out
        of the mid-market suburbs, and by the completion of
        infrastructure (expressway spurs, the SGR commuter
        service) that has genuinely shortened commutes. This is
        where the yields are, if you can accept the property
        management overhead of being further from town.
      </P>

      <H2 id="yields">Yields, honestly</H2>

      <P>
        Gross yields on well-positioned Nairobi apartments this
        year sit roughly as follows. These are Goldstay-managed
        figures, so they reflect real clearing rents net of
        broker fluff, and gross of everything (management fees,
        service charge, MRI, vacancy). Read them as an upper
        bound on what a self-managed owner would actually
        achieve.
      </P>

      <UL>
        <LI>
          Kilimani / Kileleshwa 1 and 2-bed apartments: 6.5 to
          7.5 percent gross, 4.5 to 5.5 percent net.
        </LI>
        <LI>
          Lavington 2 and 3-bed apartments: 6.0 to 7.0 percent
          gross, 4.0 to 5.0 percent net.
        </LI>
        <LI>
          Westlands and Parklands apartments (excluding the
          highest-end towers, which yield noticeably less):
          6.5 to 8.0 percent gross, 4.5 to 5.5 percent net.
        </LI>
        <LI>
          Karen and Runda villas: 3.5 to 5.0 percent gross, 2.5
          to 3.5 percent net. Villas are a capital appreciation
          asset, not a yield asset.
        </LI>
        <LI>
          Ruiru, Kitengela, Syokimau 2-bed apartments: 8.5 to
          10.0 percent gross, 6.5 to 7.5 percent net. Highest
          gross yields in the metropolitan area, offset by
          higher vacancy and higher management complexity.
        </LI>
      </UL>

      <P>
        The gap between gross and net has widened this year for
        two reasons. Service charges are rising above headline
        inflation because compounds are absorbing higher power
        and water costs, and the affordable housing levy plus
        MRI compliance are eating more of net rent than most
        owners project. Anyone quoting net yields more than one
        percentage point above these ranges is quoting gross.
      </P>

      <H2 id="off-plan">Off-plan: the quiet re-pricing</H2>

      <P>
        The H1 view was that developer discipline would be
        tested by the end of 2026 as inventory from the
        2022–2024 launch boom started completing. H2 has
        confirmed it. We are seeing four things at once.
      </P>

      <OL>
        <LI>
          Handover-stage discounts of 5 to 12 percent that
          are not on any published price list. They are
          negotiated privately with the buyer&apos;s
          representative and papered as &quot;furnishing
          allowances&quot; or &quot;service charge holidays.&quot;
        </LI>
        <LI>
          Extended payment plans on completed units. Two years
          ago these were reserved for pre-completion buyers.
          Now they are being offered on ready stock, which is a
          strong tell that units are not moving on cash-and-mortgage.
        </LI>
        <LI>
          Rental guarantees quietly appearing on unsold ready
          stock. A one to two-year rent guarantee is a
          disguised price cut of roughly the same magnitude,
          and creates operational headaches when the guarantee
          expires and the actual clearing rent is lower.
        </LI>
        <LI>
          A rising number of assignments (buyers offloading
          their off-plan reservation before completion) at par
          or slight discounts to original purchase price. The
          appreciation that off-plan buyers priced into their
          model in 2023 is not showing up.
        </LI>
      </OL>

      <Callout title="What this means for a diaspora buyer">
        The window to negotiate on ready off-plan stock is
        open, but it will not stay open forever. Developers
        with balance sheet stress will clear inventory over the
        next twelve to eighteen months. Developers who survive
        that clean-out will price the next launch cycle from a
        stronger position. If you were waiting for prices to
        come to you, this is the phase.
      </Callout>

      <H2 id="short-let">Short-let / Airbnb</H2>

      <P>
        The Airbnb thesis has weakened, not collapsed. Nairobi
        occupancy on managed short-lets is still respectable
        (mid-60s to mid-70s percent), but ADR has flattened as
        supply has grown, and the delta versus a long-let has
        narrowed. On our books, a well-run short-let now beats
        a well-run long-let by roughly 20 to 35 percent on
        gross, not the 60 to 90 percent that was the going
        story in 2023. Net of the operational overhead of
        short-let (cleaning, laundry, guest management, higher
        wear), the crossover point where short-let stops being
        worth the extra work has moved.
      </P>

      <P>
        Our operational read: short-let makes sense on a very
        narrow set of units. Well-located, professionally
        finished 1 and 2-bed apartments near Westlands, Kilimani,
        Karen shopping, or the CBD, held by an owner who can
        tolerate variability and who has an operator with real
        pricing discipline. Everywhere else, long-let with a
        careful tenant screening pipeline is the boring,
        higher-net-of-effort answer.
      </P>

      <H2 id="finance">Finance and buyer profile</H2>

      <P>
        Commercial mortgage rates spent H1 in the 14 to 15
        percent range and H2 has crept toward 15.5 to 16.
        KMRC-fronted affordable mortgages remain the most
        interesting product in the market for buyers who
        qualify, but the qualification window is narrower than
        the marketing suggests. Cash buyers still dominate the
        top end of the market. Diaspora cash into the mid and
        upper mid tier is the single biggest transactional
        cohort we handle, and that cohort has become more
        price-disciplined this year, not less.
      </P>

      <H2 id="two-things">The two things nobody wants to say</H2>

      <H3 id="one">One: developer bankruptcies are not over</H3>

      <P>
        We wrote about developer bankruptcies eighteen months
        ago as a leading indicator. The H1 uptick has not
        reversed. There are at least four Nairobi developers
        whose 2024–2025 projects are visibly behind schedule,
        who have quietly stopped launching, and whose payment
        collection cadence with contractors has slipped. We are
        not naming them here for reasons that are obvious, but
        any diaspora buyer entering an off-plan reservation in
        H2 2026 needs to do proper counterparty diligence, not
        marketing-brochure diligence. The{" "}
        <Link
          href="/insights/how-actually-verify-nairobi-developer-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          developer verification piece
        </Link>{" "}
        is the honest playbook.
      </P>

      <H3 id="two">Two: the property manager churn is beginning</H3>

      <P>
        The volume of enquiries we take from owners looking to
        change their existing property manager has roughly
        doubled year on year. The pattern is consistent: a
        low-touch manager who was fine when rents were rising
        automatically has become expensive-to-tolerate now that
        tenants are more selective and vacancy periods are
        longer. Owners who ignored the low-grade issues for
        years (delayed payouts, missing statements, one-line
        maintenance emails) are finally moving. This is a
        healthy market signal but a genuinely painful eighteen
        months for the operators being fired.
      </P>

      <H2 id="what-to-do">What to actually do</H2>

      <OL>
        <LI>
          If you own well-located mid-market stock, prioritise
          tenant retention over rent increases this cycle. A
          two-year lease at flat rent beats twenty-six days
          vacant plus turnover cost plus a marginal rent bump.
        </LI>
        <LI>
          If you own emerging-corridor stock, harvest the
          higher yield with your eyes open. Institutionalise
          the operations (proper leases, banked rent, quarterly
          audits) so you are not the one holding the bag when
          the corridor eventually normalises.
        </LI>
        <LI>
          If you are buying, this is the negotiation year.
          Bring your own valuation, ignore the asking, and
          write low. Sellers who are motivated will meet you;
          the rest are not the right sellers.
        </LI>
        <LI>
          If you are managing yourself from abroad and things
          are working, keep going. If they are not,{" "}
          <Link
            href="/list-your-property"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            get in touch
          </Link>{" "}
          before the next lease cycle.
        </LI>
      </OL>

      <H2 id="closing">Closing</H2>

      <P>
        The Nairobi property market this year is doing what
        healthy markets do: separating carefully-owned, well-run
        properties from the rest. That is not comfortable if
        you own on the wrong side of the separation, but it is
        an unambiguously good thing for the market. We expect
        the same dispersion to continue into H1 2027, with the
        key variables being the pace of developer clean-out and
        the election-cycle capital flight signal, which so far
        has been quieter than usual.
      </P>

      <P>
        We will publish the H1 2027 read in January. In the
        meantime, our{" "}
        <Link
          href="/insights"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Insights archive
        </Link>{" "}
        covers the deeper neighbourhood and mechanics pieces.
      </P>
    </>
  );
}
