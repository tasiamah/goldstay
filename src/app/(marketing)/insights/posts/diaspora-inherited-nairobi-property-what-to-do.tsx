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
  slug: "diaspora-inherited-nairobi-property-what-to-do",
  title:
    "You inherited a Nairobi property from abroad: a calm playbook",
  description:
    "Succession, title transfer, tenants, tax and family, in the order they actually hit you. Written for diaspora Kenyans who have lost a parent and now hold property they never planned to own.",
  publishedAt: "2026-07-25",
  readingMinutes: 10,
  author: authors.legal,
  tags: [
    "Kenya",
    "Diaspora",
    "Inheritance",
    "Succession",
    "Title",
    "Family",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Inherited Nairobi property paperwork, succession and title transfer",
};

export default function Article() {
  return (
    <>
      <Lede>
        This is a piece we get asked to write in private more
        than any other. A parent dies. You are abroad. The
        family lawyer in Nairobi calls to say there is a house,
        or three plots, or an apartment let to a tenant nobody
        can find records for. You are grieving, you are jet-lagged,
        and you now hold Kenyan property you never planned to own.
        Here is the calm order of operations, written from many
        years of walking families through it.
      </Lede>

      <Callout title="Before you read on">
        This piece is written to help you think clearly, not to
        replace an advocate. Every succession in Kenya turns on
        the specific documents that exist, the specific people
        involved, and the specific court file. If any of what
        follows does not match your situation, that is a signal
        to consult a Kenyan succession advocate directly. We
        list good ones in the closing section.
      </Callout>

      <H2 id="first-30-days">The first thirty days</H2>

      <P>
        The single most important thing in the first month is to
        do less, not more. Do not rush to sell, do not accept
        any offer, do not sign anything a distant relative
        presents to you. In Kenyan succession there is no
        deadline that requires you to make a permanent decision
        in month one. Everything that has to happen is
        procedural and can be started in parallel while you
        take the time you need.
      </P>

      <P>
        Practically, in the first thirty days you want to:
      </P>

      <OL>
        <LI>
          Collect and photograph every document you can find
          that touches the property. Title deed, past
          conveyances, land rates receipts, any transfer forms,
          any court orders, any lease agreements, any KRA
          correspondence, any utility bills. Photograph front
          and back. Save to a private cloud folder.
        </LI>
        <LI>
          Confirm the exact legal shape of what your parent
          held. Freehold or leasehold. Sole name, joint names
          with your other parent, or held through a company.
          Whether there is a spousal consent constraint under
          the Matrimonial Property Act. The answers change
          everything downstream.
        </LI>
        <LI>
          Instruct one advocate to act for the estate. Not
          three advocates from three siblings, one. Family
          conflicts in Kenyan succession almost always trace
          back to multiple advocates giving different advice to
          different siblings on the same estate.
        </LI>
        <LI>
          If there is a tenant in the property, do not evict,
          do not increase rent, do not renegotiate the lease.
          Existing leases survive the owner. Continuing them
          on the existing terms protects you legally and
          maintains cashflow while the estate is settled.
        </LI>
      </OL>

      <H2 id="succession">The succession process, in one page</H2>

      <P>
        Kenyan succession is governed by the Law of Succession
        Act. Two paths, depending on whether there is a valid
        will.
      </P>

      <H3 id="testate">If there is a will (testate)</H3>

      <P>
        The named executor petitions the High Court for a Grant
        of Probate. Timeline: three to nine months if
        uncontested, twelve to twenty-four if contested. Once
        the Grant is issued and confirmed (a further six to
        twelve months from issue to confirmation), the executor
        can transmit the property into the beneficiaries&apos;
        names at the Land Registry.
      </P>

      <H3 id="intestate">If there is no will (intestate)</H3>

      <P>
        A spouse or child petitions the Court for Letters of
        Administration. Under intestacy, if there is a
        surviving spouse and children, the spouse takes an
        absolute interest in the household chattels plus a life
        interest in the estate&apos;s net residue; on the
        spouse&apos;s death or remarriage, the children take.
        If there is no spouse, the children share equally. The
        specifics get complicated if there are children from
        multiple relationships, or if the deceased contributed
        to another dependant&apos;s upkeep. This is where the
        estate advocate earns their fee.
      </P>

      <Pullquote>
        Kenyan succession looks slow and bureaucratic because
        it is designed to protect against exactly the kinds of
        cross-family disputes that emerge when there is
        property and grief in the same room. Do not fight the
        process. Move it forward, quietly, in the right order.
      </Pullquote>

      <H2 id="title-transfer">Transferring the title</H2>

      <P>
        Once the Grant is confirmed, the property can be
        formally transferred at the Land Registry. This is
        called transmission (not transfer), and the tax and fee
        treatment is materially different from a normal
        transfer between arm&apos;s length parties. Key points:
      </P>

      <UL>
        <LI>
          Transmission from a deceased estate to the legal
          beneficiaries is not a chargeable event for stamp
          duty in the usual buyer sense. There is a nominal
          registration fee, not the 2 to 4 percent stamp duty
          that a normal transfer would incur.
        </LI>
        <LI>
          Capital gains tax is not triggered on the
          transmission itself. It is triggered later when the
          beneficiary sells, at which point the base cost is
          the market value at the date of death (not the
          original acquisition cost by the deceased).
        </LI>
        <LI>
          Land rates must be up to date at the county level
          before the Registry will process transmission. If
          there are historical arrears, budget to clear them.
          They are typically smaller than families fear (KES
          20,000 to 200,000 for a typical residential parcel,
          not millions).
        </LI>
        <LI>
          If the property is held on leasehold and the lease
          has less than roughly forty years remaining, get the
          renewal application started in parallel. Leasehold
          renewals through the National Land Commission take
          eighteen to thirty-six months and are dramatically
          easier to run in your name after transmission than
          in your late parent&apos;s.
        </LI>
      </UL>

      <H2 id="family">The family conversation</H2>

      <P>
        This is the hardest part of every inherited property we
        touch, and none of it is legal. It is family. There are
        four common patterns.
      </P>

      <H3 id="pattern-one">One sibling wants to sell, others do not</H3>

      <P>
        This is the most frequent. The advocate&apos;s answer
        is that beneficiaries can either agree a buy-out (one
        sibling pays the others their share and takes sole
        title) or force a sale via partition. The human answer
        is that forcing a sale destroys relationships in ways
        that outlast the money. Whenever possible, negotiate a
        buy-out at a valuation done by an independent registered
        valuer, not by an interested relative. Pay in
        instalments if needed; put it in writing.
      </P>

      <H3 id="pattern-two">Extended family has been living there rent-free</H3>

      <P>
        A cousin, an uncle, a sibling&apos;s spouse. This
        happens often when the parent&apos;s home was a family
        anchor for years. Legally, once transmission completes,
        the beneficiaries can serve notice. Practically, this
        needs to be handled with a written arrangement that
        acknowledges the historical situation, sets a
        transition period (three to twelve months), and offers
        a soft landing rather than a shock eviction. The
        emotional cost of getting this wrong is very real and
        very lasting.
      </P>

      <H3 id="pattern-three">The tenant is a friend of the deceased</H3>

      <P>
        Frequently on a below-market handshake rent. Treat this
        as a legal tenancy regardless of the informality. Give
        the existing tenant a formal lease at the current
        market rent with a reasonable transition (typically
        allow six months at the old rate, then step up). If
        they cannot afford the market rent, they will leave
        with dignity. If they can, you have converted a soft
        arrangement into a proper one without the drama of
        eviction.
      </P>

      <H3 id="pattern-four">A relative claims the parent promised them the property</H3>

      <P>
        Kenyan succession law recognises dependants and
        certain equitable claims, but does not recognise
        undocumented oral promises to non-dependants. Do not
        ignore the claim (it can be filed as an objection in
        the succession court), but do not concede on it either.
        Route it to the estate advocate.
      </P>

      <H2 id="keep-or-sell">Keep, sell, or manage</H2>

      <P>
        Once title transmission is complete and the family
        conversation is settled, the last decision is what to
        do with the property itself. The answer usually falls
        into one of three buckets.
      </P>

      <H3 id="sell">Sell</H3>

      <P>
        Sensible when the property is not something you would
        have chosen to own on its own merits, when the family
        needs the capital, or when there is meaningful capital
        gain to be crystallised. Bear in mind the CGT base cost
        is the market value at date of death, not original
        purchase; this often means the taxable gain is smaller
        than families expect. Our{" "}
        <Link
          href="/insights/selling-kenyan-property-from-abroad-diaspora-seller-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          diaspora seller&apos;s guide
        </Link>{" "}
        covers the mechanics.
      </P>

      <H3 id="keep-and-let">Keep and let</H3>

      <P>
        The right answer more often than families realise.
        Rental yield in a mid-market Nairobi apartment or a
        Karen family home is not spectacular, but it is real,
        it is in a growing market, and it preserves the
        family&apos;s Kenyan foothold. This is the path that
        needs a real property manager, because self-managing
        from Manchester or Toronto goes badly the first time
        the tenant misses rent or the geyser bursts.
      </P>

      <H3 id="hold-empty">Hold empty</H3>

      <P>
        The wrong answer, almost always. Empty Kenyan property
        depreciates faster than most owners understand
        (theft, break-ins, service charge accruing, land rates
        accruing, opportunistic squatter attempts). If the
        emotional value of holding it empty is high, at
        minimum retain a caretaker, insure it comprehensively,
        and re-evaluate every twelve months. In our experience
        families who hold empty for &quot;a year or two&quot;
        end up holding empty for five, and the property is in
        worse condition than the day they inherited it.
      </P>

      <H2 id="tax">A quick tax word</H2>

      <UL>
        <LI>
          Inheritance itself is not taxed in Kenya. There is no
          estate duty or inheritance tax.
        </LI>
        <LI>
          Land rates and any KRA arrears attached to the
          deceased attach to the estate and must be cleared
          before transmission.
        </LI>
        <LI>
          Once you own it and let it, you owe MRI (Monthly
          Rental Income tax) at 7.5 percent of gross rent from
          the first shilling. Set this up from day one; do not
          let it accrue.
        </LI>
        <LI>
          When you eventually sell, CGT is 15 percent on the
          gain, with the base cost being market value at date
          of death. Keep the valuation report from date of
          death safely; you will need it years later.
        </LI>
        <LI>
          If you are UK or US tax resident, this property will
          be reportable in your annual return under
          worldwide-income rules. Talk to a diaspora-savvy
          accountant early; do not discover this three years
          in.
        </LI>
      </UL>

      <H2 id="closing">Closing thoughts</H2>

      <P>
        Losing a parent and inheriting property are two very
        different events happening on the same calendar week.
        You do not need to be efficient about the second while
        you are grieving the first. Kenyan law will hold the
        property in the estate for as long as it takes; there
        is no financial punishment for taking six months to
        instruct the estate advocate, or for taking a year to
        decide what to do with the house.
      </P>

      <P>
        If it helps to have a Nairobi-based team hold the
        property together while the family works through the
        rest, that is what we do.{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Get in touch here
        </Link>{" "}
        and we will start with the calmest possible
        conversation. If you need names of advocates, our{" "}
        <Link
          href="/insights/buying-property-lawyer-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          lawyer piece
        </Link>{" "}
        lists the firms we work with; several handle succession
        as their primary practice.
      </P>
    </>
  );
}
