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
  slug: "why-have-a-lawyer-read-your-kenyan-sale-agreement",
  title:
    "Why a property lawyer should read your Kenyan sale agreement before you sign",
  description:
    "Sale agreements drafted by the seller's side routinely contain three to five clauses that quietly tilt the deal against the buyer. Here is what a Kenyan property lawyer actually checks, the four most common buyer-hostile clauses we still see in Nairobi, and why the KES 25,000 to 60,000 review fee is the cheapest insurance you will ever buy.",
  publishedAt: "2025-10-20",
  readingMinutes: 8,
  author: authors.legal,
  tags: ["Kenya", "Buying", "Legal", "Sale Agreement", "Diaspora", "Due Diligence"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Kenyan sale agreement on a desk with a property lawyer reviewing it for diaspora buyer",
};

export default function Article() {
  return (
    <>
      <Lede>
        We have lost count of the diaspora buyers who came to us
        after signing a Nairobi sale agreement and discovered, two
        months later, that the deposit was non-refundable on terms
        they did not understand, the completion deadline was
        impossible to meet from abroad, or the seller had reserved
        the right to a price escalation no buyer would ever
        consciously agree to. None of those clauses were hidden.
        They were just written by the seller’s side, and
        nobody on the buyer’s side actually read the
        document with a lawyer’s eye before the buyer
        signed.
      </Lede>

      <P>
        A Kenyan property lawyer reading the sale agreement is
        not a formality. It is the single highest-leverage thing
        you do during the entire purchase. The fee is small, the
        downside of skipping it is enormous, and the right lawyer
        will catch issues you would not spot even if you read
        the document ten times.
      </P>

      <H2 id="what-a-lawyer-checks">What the lawyer actually checks</H2>

      <P>
        A competent conveyancing lawyer in Kenya runs through six
        things on every sale agreement. The order matters because
        the first three can kill the deal entirely; the second
        three change the price you should pay.
      </P>

      <OL>
        <LI>
          <strong>Title authenticity and registry status.</strong>
          The lawyer pulls the title at Ardhi House, confirms the
          seller is the registered proprietor, and checks the
          encumbrance section for any caveats, charges, court
          orders or restrictions. If the title is leasehold, they
          check the unexpired term and any conditions of the
          head lease.
        </LI>
        <LI>
          <strong>Capacity to sell.</strong> Is the seller a
          natural person, a company, an estate, or a beneficiary
          under a trust? Each requires different supporting
          documents (CR12, board resolution, grant of probate,
          spousal consent under the Matrimonial Property Act).
          Missing any one of these voids the transfer.
        </LI>
        <LI>
          <strong>Land use and zoning.</strong> Especially for
          commercial or mixed-use buyers, the lawyer confirms
          the actual zoning permits the use you intend. A title
          that looks clean for a residential apartment can be
          unusable for short-stay if the building bylaws or the
          local zoning forbid it.
        </LI>
        <LI>
          <strong>Deposit and completion mechanics.</strong> When
          is the deposit paid, who holds it (escrow account is
          the only acceptable answer for diaspora buyers), under
          what circumstances is it refundable, and what happens
          to it if completion fails through no fault of either
          side. The default in seller-drafted agreements is that
          the buyer loses everything; that is negotiable.
        </LI>
        <LI>
          <strong>Risk and possession transfer.</strong> Who
          bears the risk between exchange and completion (fire,
          flood, vandalism), and at exactly what moment does
          possession pass. For off-plan, this is doubly
          important because the gap can be eighteen months.
        </LI>
        <LI>
          <strong>Default and remedy.</strong> What happens if
          the seller fails to deliver clean title at completion,
          or if you, the buyer, fail to wire the balance on
          time. Most seller-drafted agreements are asymmetric on
          this point. A lawyer rebalances it.
        </LI>
      </OL>

      <H2 id="four-buyer-hostile-clauses">
        Four buyer-hostile clauses we still see in Nairobi
      </H2>

      <H3 id="time-of-essence">1. “Time is of the essence” against the buyer only</H3>

      <P>
        Standard clause, fine in principle, except it is often
        applied one-way: if you delay payment you forfeit your
        deposit, but if the seller delays delivery of clean
        title nothing happens. A lawyer rewrites this so the
        time obligation is mutual.
      </P>

      <H3 id="non-refundable-deposit">2. The 100% non-refundable deposit</H3>

      <P>
        Buyers pay 10% on signing and the agreement says the
        deposit is forfeit if the buyer fails to complete.
        Acceptable. The same agreement then says the deposit is
        also forfeit if completion is delayed by failure of the
        seller to produce searches, consent to transfer, or
        capital gains tax clearance from KRA. That is a trap.
        The buyer ends up paying for the seller’s
        administrative slowness.
      </P>

      <H3 id="price-escalation">3. Hidden price escalation on off-plan</H3>

      <P>
        A common developer clause: “The purchase price
        shall be subject to adjustment in line with material
        cost inflation.” Translation: the developer can
        add 8 to 15 percent at completion and call it
        commodities. Either strip this clause out entirely or
        cap it at a number you can live with (3 percent
        maximum, with audited evidence required).
      </P>

      <H3 id="snag-list">4. Snag list signed off in 7 days</H3>

      <P>
        On handover, the buyer is given seven days to
        identify defects, after which the property is deemed
        accepted “as is”. Seven days is not enough
        time for a diaspora buyer to fly in, inspect properly,
        and document everything. Push to thirty days, and
        require the developer to remedy major defects at their
        own cost.
      </P>

      <Pullquote>
        Most seller-drafted agreements are asymmetric on
        default. A good lawyer rebalances the risk so both
        sides have skin in the deal completing.
      </Pullquote>

      <H2 id="cost">What it actually costs</H2>

      <P>
        For a typical Nairobi residential transaction below USD
        250,000, expect a conveyancing legal fee of KES 25,000
        to KES 60,000 for a clean review and standard
        transfer work. The Law Society of Kenya publishes a
        scale (the Advocates Remuneration Order) and most
        reputable firms charge slightly above the floor.
      </P>

      <P>
        For larger deals, the fee scales with property value.
        For complex structures (company purchase, leasehold
        with sub-leases, joint ownership across borders), expect
        an extra KES 30,000 to KES 80,000 in advisory time.
      </P>

      <Callout title="A frame for the cost">
        At a USD 200,000 purchase, KES 50,000 is roughly
        0.2% of the price. The cheapest mistake we see in
        sale agreements typically costs the buyer 2 to 5
        percent of the price. The lawyer fee pays for itself
        ten to twenty times over on the very first issue
        they catch.
      </Callout>

      <H2 id="who-should-read-it">Who should read it</H2>

      <P>
        Three rules:
      </P>

      <UL>
        <LI>
          A current, practising member of the Law Society of
          Kenya. Verify the practising certificate online; it
          takes thirty seconds.
        </LI>
        <LI>
          Conveyancing experience specifically, not litigation
          or general practice. Conveyancing is a specialism and
          the patterns are particular.
        </LI>
        <LI>
          No relationship with the developer, the seller, or
          the agent. If the agent is the one introducing the
          lawyer, walk away from that lawyer. Conflicts of
          interest in Kenyan property transactions are not
          rare.
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For every property we source, two independent property
        lawyers (not on retainer to any developer or seller in
        the market) review the sale agreement before you see
        it. They send back a marked-up version with the clauses
        they would change, the rationale for each, and a clear
        risk score from green to red. We negotiate the changes
        with the seller’s counsel and only present you a
        final version when the document is balanced.
      </P>

      <P>
        You pay the lawyers directly. Goldstay does not take a
        margin on legal work and does not accept referral fees.
        If you want to use your own lawyer instead, that is
        also fine, and we will provide them with the full
        transaction file.
      </P>

      <P>
        See our{" "}
        <Link
          href="/property-sourcing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property sourcing
        </Link>{" "}
        service for the full picture, or read our companion
        piece on{" "}
        <Link
          href="/insights/how-to-verify-kenyan-title-deed-from-abroad"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          verifying a Kenyan title deed from abroad
        </Link>{" "}
        for the title side of the same workflow.
      </P>
    </>
  );
}
