import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  KeySummary,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "1870-west-westlands-handover-guide",
  title: "1870 West: what to settle before your handover",
  metaTitle: "1870 West Westlands: handover, and who gets to let your unit",
  description:
    "1870 West is HassConsult's thirty storey tower beside Sarit Centre, sold out and now published for completion in the fourth quarter of 2026 against an original target of Q4 2025. The clause in your sale agreement that decides who may let your apartment, what a year of delay is worth, and what to check before you take keys.",
  metaDescription:
    "1870 West completes Q4 2026, a year past target. The letting clause to find in your agreement, what the delay is worth, and what to check at handover.",
  publishedAt: "2026-09-13",
  readingMinutes: 13,
  author: authors.editors,
  tags: [
    "1870 West",
    "Westlands",
    "Handover",
    "Off-plan",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "1870 West, Lower Kabete and Peponi Road, Westlands, handover guide for owners",
};

export default function Article() {
  return (
    <>
      <Lede>
        1870 West is HassConsult&rsquo;s tower at the crossroads of Lower Kabete
        and Peponi Roads, next door to Sarit Centre: twenty nine residential
        floors under a thirtieth floor amenity summit, which will make it among
        the tallest residential buildings in Nairobi. It is sold out, it was
        heavily bought by diaspora investors, and it is now published for
        completion in the fourth quarter of 2026 against an original programme
        that targeted the fourth quarter of 2025. If you own a unit there,
        there is one clause in your sale agreement worth finding before you
        think about anything else, because it may decide who is allowed to let
        your apartment.
      </Lede>

      <Callout title="Where these numbers come from">
        HassConsult&rsquo;s published material for the development, its
        project microsite, third party project records and trade press, the
        consultants&rsquo; own public progress updates through August 2026, and
        our own Westlands letting data, as at September 2026. We did not sell
        anything in this building and we are not the appointed managing agent.
        Where a point turns on what your contract says rather than on what has
        been published, we say so, because the two are not the same thing and
        the difference is the whole subject of the next section.
      </Callout>

      <KeySummary
        question="What should I check before handover at 1870 West in Westlands?"
        answer="1870 West is HassConsult's development at the junction of Lower Kabete Road and Peponi Road adjacent to Sarit Centre, comprising twenty nine floors of apartments beneath a thirtieth floor amenity level with pools, lounges, workspaces and fitness facilities, over nine floors of parking. The mix runs from studios through one bedroom, one bedroom and study, two bedroom, two bedroom and study and three bedroom units, with one bedrooms published between 570 and 829 square feet from KES 9.4 million and two bedrooms from KES 16.3 million, sold on a three year plan of twenty percent down and instalments after that. HassConsult now lists it as sold out for completion in the fourth quarter of 2026, where the original thirty six month programme targeted the fourth quarter of 2025, so owners are roughly a year past the date they budgeted against. Before handover the single most important thing to establish is whether your sale agreement obliges you to use a nominated management company for letting, because published analysis of the scheme describes a dedicated company handling letting and resale exclusively, and if that is binding on you it decides your fee, your tenant and your rent rather than you deciding them. After that, read the delay clause to see whether compensation or an instalment credit is due, put your unit's plumbing pressure test and lift provision in writing, and plan for the fact that a sold out tower of this size hands over to a great many investor owners in the same few weeks in the most heavily supplied letting market in Nairobi."
        facts={[
          { label: "Developer", value: "HassConsult" },
          { label: "Location", value: "Lower Kabete at Peponi, by Sarit" },
          { label: "Scale", value: "29 residential floors, 30th amenity" },
          { label: "Parking", value: "Nine floors" },
          { label: "1 bed", value: "570 to 829 sq ft, from KES 9.4m" },
          { label: "2 bed", value: "From KES 16.3m" },
          { label: "Completion", value: "Q4 2026, first targeted Q4 2025" },
          { label: "Status", value: "Sold out" },
        ]}
      />

      <H2 id="the-clause">The clause to find before anything else</H2>

      <P>
        Published analysis of 1870 West describes a management structure
        operated by a dedicated company, 1870 West Residences Ltd, with that
        company handling the letting and the resale of units exclusively, on
        the stated rationale of standardising tenant quality. HassConsult
        &rsquo;s own marketing for the scheme leans on its property management
        arm in the same breath as the investment case.
      </P>

      <P>
        We want to be careful here, because this matters too much to be loose
        about. What a brochure or a trade article describes is not necessarily
        what binds you. An exclusive letting mandate is a contractual
        obligation, and it either appears in your sale agreement and the
        management company documents or it does not. Plenty of developments
        describe a dedicated management company as a service on offer, which is
        a genuinely useful thing and entirely optional. Others make it a
        condition of sale, sometimes in perpetuity, sometimes for a fixed
        number of years.
      </P>

      <Pullquote>
        You cannot tell which of those two you have bought from the marketing.
        You can only tell by reading your own agreement, and almost nobody who
        bought off plan in 2022 on a three year payment plan has read it since.
      </Pullquote>

      <P>
        So this is the first job, and it is worth doing before handover rather
        than after. Ask your lawyer, or ask HassConsult directly in writing,
        and get the answer to these:
      </P>

      <UL>
        <LI>
          <strong>Is the appointment exclusive, or optional?</strong> If the
          word exclusive appears anywhere near letting, everything else on this
          list matters. If it does not, you are free and the rest of this
          article is about a different set of decisions
        </LI>
        <LI>
          <strong>For how long does it run?</strong> A mandate for the first
          two or three years after handover is a very different proposition
          from one that attaches to the unit indefinitely and passes to your
          buyer
        </LI>
        <LI>
          <strong>Does it cover short stays as well as long lets?</strong> Some
          mandates cover tenancies only and are silent on nightly letting,
          which leaves a route open. Others prohibit short letting outright.
          Given where this building stands, the answer changes the economics
          materially
        </LI>
        <LI>
          <strong>What is the fee, and what is it charged on?</strong> A
          percentage of rent collected and a percentage of rent invoiced are
          not the same number. Ask which, and ask what is deducted before the
          percentage is taken
        </LI>
        <LI>
          <strong>What happens if you are not satisfied?</strong> An exclusive
          appointment with no performance standard and no exit is the part
          worth negotiating, and handover is the last moment you have any
          leverage to do it
        </LI>
        <LI>
          <strong>Does it extend to resale?</strong> If the same company has
          the exclusive right to sell your unit as well as let it, you have
          pre-committed your exit as well as your income
        </LI>
      </UL>

      <Callout title="The conflict worth naming out loud">
        HassConsult is the developer of this building, one of the best known
        estate agencies in Kenya, and, on the published description, connected
        to the company that will let and resell your unit. Those are three
        roles, and they do not always point the same way. A letting agent with
        a hundred units in one tower has no particular reason to care which one
        lets first. An agent who also handles resale has a view on your exit
        that is not purely yours. None of that makes them the wrong choice. It
        does mean you should know it is the arrangement, rather than discover
        it at handover.
      </Callout>

      <P>
        We wrote the same caution about{" "}
        <Link
          href="/insights/coco-brookside-westlands-handover-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Coco in Brookside
        </Link>
        , which is the same developer, and the general version is in{" "}
        <Link
          href="/insights/buying-off-plan-nairobi-risks-red-flags"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          buying off plan in Nairobi
        </Link>
        .
      </P>

      <H2 id="the-delay">What a year of delay is actually worth</H2>

      <P>
        The project has been on third party project registers since 2019, was
        launched to buyers in the early 2020s on a three year payment plan of
        twenty percent down and instalments after, and ran a thirty six month
        construction programme slated to finish in the fourth quarter of 2025.
        The current published completion is the fourth quarter of 2026. Show
        units opened to the public in July 2026, and the consultants were
        posting in late August that finishes were progressing floor by floor
        from the top down and the project was entering its final stages.
      </P>

      <P>
        For an owner, that gap is not an abstraction. If you bought on the
        payment plan, you have spent roughly a year making instalments against
        an asset that was supposed to be producing rent by now, and if you
        borrowed to do it you have been paying interest across the same period
        with nothing coming the other way. On a one bedroom at KES 9.4 million
        in a building beside Sarit Centre, a year of foregone rent is a
        substantial number in its own right.
      </P>

      <P>
        Which is why the second document to read is the delay provision in your
        sale agreement. Most Kenyan off plan agreements contain something:
        liquidated damages, a rent equivalent credit, an interest abatement on
        outstanding instalments, or at minimum a defined longstop date after
        which you have rights. Almost nobody ever claims under these clauses,
        largely because buyers do not know they are there and because raising it
        feels combative when you still need the developer to hand you a
        finished flat.
      </P>

      <P>
        Our suggestion is narrower than a dispute. Read the clause, work out
        what it entitles you to, and raise it as a credit against your final
        instalment rather than as a claim. A developer at the handover stage of
        a sold out building is far more willing to discuss an instalment
        adjustment than to write a cheque, and you have more leverage now,
        while you still owe them money, than you will ever have again once you
        have paid in full and taken keys.
      </P>

      <H2 id="handover">What to check at the handover itself</H2>

      <P>
        Two items here are specific to how this building has been built, and
        they are worth more than a generic snagging list.
      </P>

      <OL>
        <LI>
          <strong>Ask for the plumbing pressure test, floor by floor.</strong>{" "}
          The consultants have described finishing top down, floor by floor,
          which is efficient. It is also precisely the sequence in which
          pipework gets sealed behind tile and drywall, and this exact question
          was put publicly to the team on their own progress update: was each
          floor pressure tested and signed off before the finishes closed it
          in, or does that check only happen at final handover. Ask for your
          floor&rsquo;s certificate. A leak found in year two behind a tiled
          wall in a thirty storey tower is somebody&rsquo;s expensive argument,
          and you want documentation that it is not yours
        </LI>
        <LI>
          <strong>Count the lifts and ask their speed and capacity.</strong>{" "}
          Twenty nine residential floors above nine floors of parking is a lot
          of vertical traffic. In a tower this shape, lift provision decides
          whether the building is pleasant to live in and therefore whether it
          lets well, and it is fixed forever on the day it is commissioned. Ask
          how many serve your floor, and what happens when one is down
        </LI>
        <LI>
          <strong>Get the service charge in writing, with a budget.</strong>{" "}
          The amenity level, the pools, the gym, the lifts and the security
          across a building this size are a substantial quarterly bill, and the
          published structure is quarterly rather than monthly, which matters
          for your cash flow. Ask for the budget behind the figure and not just
          the figure, and ask what the reserve fund position will be at
          handover
        </LI>
        <LI>
          <strong>Establish which floor band you are actually in.</strong> The
          premium units were marketed from the twentieth floor up. Where your
          unit sits against that line affects both what it lets for and what
          you should be paying in service charge relative to your neighbours
        </LI>
        <LI>
          <strong>Photograph and list defects before you sign anything.</strong>{" "}
          Signing a handover acknowledgment without a defects schedule attached
          is how a snag becomes your repair. Do it in daylight, with water
          running, with every socket tested
        </LI>
        <LI>
          <strong>Confirm the parking bay allocation in writing.</strong> Nine
          floors of parking sounds generous until you find your entitlement is
          one bay and your tenant has two cars. In Westlands this decides lets
          more often than owners expect
        </LI>
      </OL>

      <H2 id="the-market">The thing about handing over sold out and all at once</H2>

      <P>
        This is the part the handover desk will not raise, and it is the part
        that most affects what your unit earns in its first year.
      </P>

      <P>
        A sold out tower with twenty nine residential floors, bought heavily by
        investors rather than occupiers, hands keys to a great many owners
        within the same few weeks. A large share of them will list for rent in
        the same month, in the part of Nairobi where more apartments have been
        delivered than anywhere comparable. We have written up what that looks
        like in practice at{" "}
        <Link
          href="/insights/shangri-la-residency-westlands-letting-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Shangri-La Residency
        </Link>
        , a few minutes away, where around eighty units came to market together
        and owners are still looking for tenants. 1870 West is that situation at
        several times the scale.
      </P>

      <P>
        Our own reading of the submarket is that this is survivable and that
        the mechanism is not what owners assume. Westlands rents have not
        collapsed. What happens is that the gap between the top and the bottom
        of the same rent band widens, and an averagely presented unit sits at
        the bottom of it while a well presented one on the same street lets in a
        fortnight. Void periods in Westlands are a presentation problem far
        more often than a pricing problem, and the answer is not to be the
        cheapest unit in your own building, because a rent cut in a tower of
        near identical flats is matched within a week and resets the achievable
        rent for everybody including you.
      </P>

      <P>
        There is a real advantage here worth using. Being adjacent to Sarit
        Centre is the single most valuable locational fact about this building,
        because in Westlands a unit within walking distance of the amenity
        cluster behaves measurably better than an identical unit in the same
        postcode that needs a car. Lead with it. The wider context is in{" "}
        <Link
          href="/insights/nairobi-handover-wave-2026-what-it-means-for-rents"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the 2026 handover wave
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/westlands-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Westlands guide
        </Link>
        .
      </P>

      <H2 id="which-route">Long let, short stay, or the nominated agent</H2>

      <P>
        Assuming you establish that you are free to choose, the honest answer
        depends on your unit and it is not the same for everyone in the
        building.
      </P>

      <P>
        The studios and smaller one bedrooms at 570 square feet face the
        problem we have described: dozens of near identical flats, no way to
        differentiate on space, and a tenant viewing four of them in an
        afternoon. For those, nightly letting is often the stronger business,
        because size matters much less to a guest than presentation does, and
        this building has a rooftop amenity level and a walk to Sarit that
        photograph extremely well. Westlands is the strongest short stay market
        in Nairobi, at USD 100 to 150 a night and 65 to 75 percent occupancy on
        corporate, UN and NGO demand that holds midweek and through the low
        season.
      </P>

      <P>
        The two bedroom and three bedroom units, and anything above the
        twentieth floor, have a stronger long let case, because they can
        actually differentiate on space, light and view against the rest of the
        tower, and because the corporate and allowance backed tenants who pay
        the best rents in Westlands want two and three bedrooms. We have
        written up where that calculation lands in two nearby buildings, and it
        genuinely goes both ways:{" "}
        <Link
          href="/insights/skynest-residences-westlands-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Skynest
        </Link>{" "}
        favours nightly letting and{" "}
        <Link
          href="/insights/gtc-residences-pan-pacific-westlands-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          GTC Residences
        </Link>{" "}
        favours the long let.
      </P>

      <P>
        The arithmetic for both is in{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short let against long term rental
        </Link>
        , pricing against real comparables is in{" "}
        <Link
          href="/insights/how-to-price-nairobi-rental"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          pricing a Nairobi rental
        </Link>
        , and the service charge question in{" "}
        <Link
          href="/insights/hoa-and-management-company-fees-nairobi-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          management company fees explained
        </Link>
        .
      </P>

      <H2 id="what-to-do-now">What to do in the months before keys</H2>

      <OL>
        <LI>
          <strong>Read the letting clause.</strong> Everything else depends on
          the answer, and it takes one email to your lawyer
        </LI>
        <LI>
          <strong>Read the delay clause and price it.</strong> Raise it as a
          credit against your final instalment, while you still owe money
        </LI>
        <LI>
          <strong>Get the completion date in writing, with a longstop.</strong>{" "}
          A project that has moved once can move again, and if you are
          coordinating a furnishing budget or a flight from abroad you need a
          date you can plan against rather than a quarter
        </LI>
        <LI>
          <strong>Decide your route before handover, not after.</strong> The
          furnishing decision follows from it, and furnishing after you have
          already advertised unfurnished wastes a quarter
        </LI>
        <LI>
          <strong>
            If you are abroad, appoint someone to attend the handover.
          </strong>{" "}
          This building was sold heavily to diaspora buyers. A handover
          inspection done by video call finds a fraction of what someone
          standing in the flat with the taps running will find, and the
          defects schedule you attach on the day is the one that binds
        </LI>
        <LI>
          <strong>Do not be the first to cut your rent.</strong> Decide now
          that presentation is your lever, because in month three with an empty
          flat the temptation is to discount, and in a tower like this that
          helps nobody
        </LI>
      </OL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We let and manage apartments in Westlands on both routes, long term at
        10 percent of rent collected and short stay at 20 percent of revenue,
        with no setup fee and no exit fee.
        We did not sell anything in this building, we are not the nominated
        agent, and we have no interest in defending a completion date or a
        rental projection that somebody else published.
      </P>

      <P>
        If it turns out you are contractually bound to the nominated management
        company, we will tell you that plainly and we will not try to talk you
        into breaching your own agreement. What we will do instead is give you
        the benchmark: what your unit should be achieving, how long it should
        take to let, and what the fee ought to be, so that you can tell whether
        the arrangement you are in is serving you. That is worth having whether
        or not you can act on it, and if the mandate is time limited, it is
        worth having before it ends.
      </P>

      <P>
        If you are free to choose, send us the unit with the floor, the layout
        and the square footage and we will come back with an achievable rent, a
        realistic time to let, and both the long let and the nightly numbers
        side by side so you can see which one your specific apartment should be
        on.{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Send us the unit
        </Link>{" "}
        is the place to start, and what each service covers is on{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long term management
        </Link>
        ,{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb management
        </Link>{" "}
        and{" "}
        <Link
          href="/tenant-finding"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          tenant finding
        </Link>
        .
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/lower-kabete-hidden-premium-suburb"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Lower Kabete Road
        </Link>
        ,{" "}
        <Link
          href="/insights/furnished-or-unfurnished-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          furnished against unfurnished
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/best-nairobi-off-plans-2026-ranked"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Nairobi off plans ranked
        </Link>
        .
      </P>
    </>
  );
}
