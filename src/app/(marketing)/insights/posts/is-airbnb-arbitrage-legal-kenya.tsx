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
  slug: "is-airbnb-arbitrage-legal-kenya",
  title:
    "Is Airbnb arbitrage legal in Kenya?",
  // "airbnb arbitrage kenya" returned zero autocomplete suggestions;
  // "can i airbnb a rented apartment" returned 164. Same question,
  // and this article already answers it. The arbitrage wording stays
  // in the H1 and throughout the body, so the phrase is not lost.
  metaTitle: "Can I Airbnb a Rented Apartment? Kenya Law",
  description:
    "Leasing a property and re-letting it on short stays is legal in Kenya. What makes a particular operation unlawful is doing it without the owner's consent, without a county permit, or without declaring the income.",
  metaDescription:
    "Can you Airbnb a rented apartment in Kenya? Legally yes, and four requirements decide whether your particular operation is lawful.",
  publishedAt: "2026-09-07",
  readingMinutes: 8,
  author: authors.legal,
  tags: [
    "Kenya",
    "Airbnb Arbitrage",
    "Legal",
    "Operator",
    "Short-Let",
    "Compliance",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi short-let apartment operated by a leasehold operator under owner consent",
};

export default function Article() {
  return (
    <>
      <Lede>
        Yes, with a qualification that does most
        of the work. The model is lawful in Kenya.
        Whether your operation is lawful depends
        on four things, and the people who get
        into trouble have almost always skipped
        one of them rather than fallen foul of the
        model itself.
      </Lede>

      <P>
        Airbnb arbitrage, also called rent-to-rent
        or rental arbitrage, means leasing a
        property on an ordinary long lease,
        furnishing it, and re-letting it on
        nightly or weekly stays at a higher rate.
        Nothing about that is prohibited in Kenya.
        Subletting is an ordinary incident of
        leasehold, commercial subletting at a
        margin is a normal business, and
        short-stay letting is a recognised and
        regulated activity rather than a legal
        grey zone.
      </P>

      <P>
        What is not lawful is doing it without the
        right to. There are four requirements, and
        they are cumulative.
      </P>

      <H2 id="can-i-airbnb-a-rented-apartment">
        Can I Airbnb a rented apartment?
      </H2>

      <P>
        Only if your lease permits it, and most
        Kenyan residential leases do not. This is
        the version of the question we are asked
        most often, usually by somebody who has
        already signed a twelve month lease and is
        hoping the answer is yes. Nothing in
        Kenyan law stops you putting a rented
        apartment on Airbnb. Your own lease
        very likely does, and that is a contract
        you are bound by regardless of what the
        statute allows.
      </P>

      <P>
        Doing it anyway is not a criminal matter.
        It is a breach of covenant, which gives
        the landlord grounds to forfeit the lease
        and evict you, and it is the single most
        common way a Nairobi operation ends. You
        lose the unit, the furniture is somewhere
        you no longer have access to, and any
        forward bookings become your problem to
        refund. Whether you need consent and how
        to get it is covered in{" "}
        <Link
          href="/insights/landlord-permission-to-sublet-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          do you need your landlord&rsquo;s
          permission to sublet
        </Link>
        .
      </P>

      <H2 id="consent">One: the owner&rsquo;s consent, where the lease requires it</H2>

      <P>
        This is where nearly every problem starts.
        Most Kenyan residential leases prohibit
        subletting outright or require the
        landlord&rsquo;s prior written consent,
        and newer leases in managed blocks name
        short-stay letting specifically. Operating
        in breach is a breach of covenant that
        exposes you to termination, loss of your
        deposit and the loss of a unit you paid to
        furnish.
      </P>

      <P>
        Note what this is and is not. Breaching
        your lease is a civil wrong against your
        landlord, not a criminal offence, and
        nobody is going to prosecute you for it.
        That is cold comfort, because the civil
        consequence is the one that destroys the
        economics. See{" "}
        <Link
          href="/insights/landlord-permission-to-sublet-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          whether you need permission to sublet
        </Link>{" "}
        for how to read your own lease.
      </P>

      <Callout title="The most expensive misconception">
        &ldquo;It is legal, so I am fine.&rdquo;
        The model being legal tells you nothing
        about whether you are permitted to run it
        in that particular unit. Legality and
        authority are different questions and it
        is the second one that ends operations.
      </Callout>

      <H2 id="permit">Two: a county business permit</H2>

      <P>
        Short-stay letting run as a business needs
        a single business permit from the county
        in which the property sits. In Nairobi
        that is the Nairobi City County single
        business permit, and the category and fee
        depend on how the activity is classified
        and on the size of the operation.
      </P>

      <P>
        Operators routinely skip this on the
        reasoning that they are letting a home
        rather than running premises. The county
        does not see it that way, and enforcement
        has become noticeably more active as the
        sector has grown. For what changed
        recently, see{" "}
        <Link
          href="/insights/nairobi-short-stay-licensing-2026-what-changed"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Nairobi short-stay licensing
        </Link>
        .
      </P>

      <H2 id="tourism">Three: the tourism regulatory position</H2>

      <P>
        Short-stay accommodation falls within the
        tourism regulatory framework, which brings
        registration and classification
        requirements for regulated accommodation
        and, depending on the operation, a levy on
        turnover. The practical position for a
        single furnished apartment differs from
        that of an operator running a portfolio,
        and the threshold questions are worth
        taking advice on once you are past two or
        three units rather than at the first.
      </P>

      <H2 id="tax">Four: tax, which is the one that arrives late</H2>

      <P>
        Short-stay income is taxable. It is not
        rental income taxed under the monthly
        residential rental income regime in the
        way a long tenancy is, because the
        activity is a trade rather than passive
        letting, and that distinction changes both
        the rate and the return you file.
      </P>

      <UL>
        <LI>
          <strong>Income tax on trading
          profit.</strong> You are running a
          business, so profit is computed after
          deductible expenses: rent paid to the
          owner, management fees, cleaning, linen,
          consumables, utilities, platform
          commission and the capital allowances on
          furnishing.
        </LI>
        <LI>
          <strong>VAT above the threshold.</strong>{" "}
          This is the one that catches operators
          at three or four units who were still
          treating the whole thing as informal
          income. Accommodation services are
          within the VAT net, and once turnover
          crosses the registration threshold you
          have an obligation whether or not you
          registered.
        </LI>
        <LI>
          <strong>Withholding on what you
          pay.</strong> Rent you pay to your own
          landlord may carry withholding
          obligations depending on the
          arrangement, which surprises operators
          who assumed the obligation ran only in
          the other direction.
        </LI>
        <LI>
          <strong>Records.</strong> The reason
          most operators cannot compute any of the
          above is that nightly revenue arrives
          from several platforms, in several
          currencies, net of commission, and was
          never reconciled. Reconstructing two
          years of it under audit is worse than
          keeping it.
        </LI>
      </UL>

      <P>
        The general host tax position is set out
        in{" "}
        <Link
          href="/insights/airbnb-tax-kenya-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Airbnb tax guide for Kenya
        </Link>
        , and an operator&rsquo;s differs from an
        owner&rsquo;s chiefly in that the rent you
        pay is a deductible cost and the activity
        is more clearly a trade.
      </P>

      <Pullquote>
        The model is legal. Your operation is
        legal if the owner consented, the county
        licensed it, the tourism position is
        right, and the income is declared. Three
        out of four is not a pass.
      </Pullquote>

      <H2 id="building-rules">The fifth thing, which is not law but ends operations anyway</H2>

      <P>
        Building management. A management
        committee resolution banning short-stay
        guests binds you where the lease
        incorporates the house rules, and most
        apartment leases do. Even where it does
        not bind you cleanly, a committee that
        wants you out can make the operation
        unworkable through access control, visitor
        registers, service charge disputes and
        pressure on your landlord. Committees have
        become the most common practical cause of
        a Nairobi short-let closing, ahead of any
        regulator.
      </P>

      <H3 id="what-good-looks-like">What a compliant operation looks like</H3>

      <UL>
        <LI>
          Written consent from the owner naming
          short-stay letting specifically, not a
          general permission to sublet
        </LI>
        <LI>
          A head lease long enough to earn back
          the furnishing, with the consent
          referenced in it or annexed to it
        </LI>
        <LI>
          Building management informed rather than
          worked around, ideally before the first
          guest
        </LI>
        <LI>County single business permit in place</LI>
        <LI>
          Revenue reconciled monthly across
          platforms, and the trade declared
        </LI>
        <LI>
          Insurance that covers short-stay
          occupation, since a residential policy
          generally does not
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We manage short-let units for operators
        who lease rather than own, and we will not
        take a unit on without sight of the
        owner&rsquo;s written consent. Our
        management agreement makes you warrant
        that you hold the head lease and that the
        owner has permitted both the subletting
        and our appointment, and it lets either of
        us end the arrangement immediately if that
        authority lapses, because continuing to
        take bookings for a unit you no longer
        control is the one outcome neither party
        survives well.
      </P>

      <P>
        On the other three requirements we do the
        work rather than remind you about it: the
        county permit, the revenue reconciliation
        across platforms, and a monthly itemised
        statement that makes the trading position
        computable at year end.{" "}
        <Link
          href="/airbnb-arbitrage-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Management for operators
        </Link>{" "}
        sets out the whole service and what it
        costs. This article is general information
        and not legal or tax advice on your
        particular operation.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/airbnb-arbitrage-nairobi-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the honest economics of Airbnb arbitrage
          in Nairobi
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/sublease-agreement-kenya-operators"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what an operator&rsquo;s sublease must
          say
        </Link>
        . If you have not committed to this model
        yet,{" "}
        <Link
          href="/insights/airbnb-without-owning-property-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          running an Airbnb business without
          owning property
        </Link>{" "}
        compares it with the three routes that
        carry less risk.
      </P>
    </>
  );
}
