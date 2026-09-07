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
  slug: "ask-landlord-permission-short-let-nairobi",
  title:
    "How to ask a Nairobi landlord for permission to short-let",
  metaTitle: "How to Ask a Landlord for Permission to Short-Let",
  description:
    "Most operators ask badly, and get refused for reasons that had nothing to do with the money. What an owner is actually weighing, how to answer it, and a letter you can adapt and send.",
  metaDescription:
    "How to ask a Nairobi landlord for permission to short-let: what owners actually worry about, and a consent letter you can adapt.",
  publishedAt: "2026-09-07",
  readingMinutes: 9,
  author: authors.editors,
  tags: ["Nairobi", "Sublet", "Operator", "Short-Let", "Landlord", "Kenya"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi landlord and operator agreeing written consent to short-let an apartment",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost every operator we deal with asked
        their first landlord badly, and most were
        refused for reasons that had nothing to do
        with money. The pitch was about upside the
        owner does not get a share of, and it
        skipped every question the owner was
        actually asking.
      </Lede>

      <P>
        Start from the owner&rsquo;s position. A
        landlord with a tenanted unit has an
        income they mostly do not think about. You
        are proposing to replace one occupant they
        vetted with a stream of strangers they
        will never meet, in exchange for nothing
        additional. Framed that way it is an
        obviously bad trade, and it is how most
        proposals land.
      </P>

      <H2 id="what-they-are-weighing">What an owner is actually weighing</H2>

      <P>
        Not the nightly rate. Five things, roughly
        in this order.
      </P>

      <UL>
        <LI>
          <strong>Wear.</strong> Short-stay
          turnover puts more traffic through a
          unit in a year than a tenant does in
          three. Owners know this even if they
          cannot quantify it.
        </LI>
        <LI>
          <strong>The neighbours and the
          committee.</strong> The owner still has
          to exist in that building after you have
          moved on. A complaint about noise or
          strangers in the lift is a problem that
          lands on them, and a management
          committee that objects can make their
          life difficult for years.
        </LI>
        <LI>
          <strong>Insurance and liability.</strong>{" "}
          A residential policy generally does not
          cover commercial short-stay occupation.
          If a guest floods the flat below, the
          owner wants to know whose insurer
          answers.
        </LI>
        <LI>
          <strong>Getting the unit back.</strong>{" "}
          Their real fear, usually unspoken, is a
          furnished unit full of confirmed
          bookings that they cannot recover when
          they want it.
        </LI>
        <LI>
          <strong>Whether you will still be
          there.</strong> Owners have watched
          people try this and stop in month five.
          They are assessing whether you are a
          business or an experiment.
        </LI>
      </UL>

      <Callout title="The reframe that works">
        Do not sell the owner on your margin. Sell
        them on a tenant who pays on time, treats
        the unit as a revenue-generating asset
        rather than a place to sleep, has a
        managing agent accountable for it, and
        carries the right insurance. That tenant
        is genuinely better than their current one,
        and it is a claim you can support.
      </Callout>

      <H2 id="before-you-ask">Do this before you ask</H2>

      <H3 id="read-the-lease">Read the whole lease</H3>

      <P>
        Know which clause you are asking to be
        released from, because it changes the
        conversation. An absolute prohibition
        needs a waiver. A qualified covenant needs
        consent the owner may be obliged not to
        withhold unreasonably. A use covenant or
        incorporated house rules may be the real
        obstacle even where the subletting clause
        is silent.{" "}
        <Link
          href="/insights/landlord-permission-to-sublet-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Whether you need permission at all
        </Link>{" "}
        goes through the four clause types.
      </P>

      <H3 id="check-the-building">Check the building first</H3>

      <P>
        Ask the caretaker or the committee whether
        short-stay letting happens in the block
        and whether anybody has been stopped.
        Doing this before you approach the owner
        can save the whole exercise, and turning
        up already knowing the answer makes you
        look like an operator rather than a
        chancer.
      </P>

      <H3 id="ask-before-you-sign">Ask before you sign, not after</H3>

      <P>
        This is the single biggest error. An
        operator who has already committed to
        twelve months of rent has no leverage and
        every incentive to proceed regardless, and
        owners can sense it. Asking as a condition
        of taking the unit is a normal commercial
        negotiation. Asking afterwards is a
        confession.
      </P>

      <Pullquote>
        Ask as a condition of taking the unit and
        you are negotiating. Ask once you have
        signed and you are confessing.
      </Pullquote>

      <H2 id="what-to-offer">What to put on the table</H2>

      <P>
        You are asking for something worth money,
        so expect to pay for it in one currency or
        another. The options, cheapest first:
      </P>

      <UL>
        <LI>
          <strong>A longer term.</strong> Two or
          three years rather than one. Costs you
          flexibility, gives the owner exactly
          what they want, and you needed the
          length anyway to earn back the
          furnishing.
        </LI>
        <LI>
          <strong>A larger deposit.</strong> Two
          or three months rather than one,
          explicitly as security against the extra
          wear. Cheap, since you get it back.
        </LI>
        <LI>
          <strong>A managing agent named in the
          consent.</strong> Costs you nothing and
          is often the thing that closes it,
          because it converts a proposal from one
          person into an arrangement with a firm
          standing behind it.
        </LI>
        <LI>
          <strong>Insurance evidence.</strong> A
          policy covering short-stay occupation
          with the owner&rsquo;s interest noted,
          produced before the first guest.
        </LI>
        <LI>
          <strong>A break in their favour.</strong>{" "}
          A right for the owner to end the consent
          on, say, ninety days for cause. Feels
          frightening and is worth more than any
          money you could offer, because it
          answers the fear about getting the unit
          back.
        </LI>
        <LI>
          <strong>Rent above asking.</strong> The
          last resort, not the first. Paying a
          premium turns your margin into their
          margin, and an owner who says yes only
          for the premium will renegotiate it
          upwards at every renewal.
        </LI>
      </UL>

      <H2 id="the-letter">A letter you can adapt</H2>

      <P>
        Send something written. A conversation at
        the gate produces a permission nobody can
        evidence later, which is the same as no
        permission when it matters.
      </P>

      <Callout title="How to use the draft below">
        Square brackets are yours to fill in.
        Adapt the numbers freely and keep the
        structure, because the structure is the
        part that works: it names each of the
        owner&rsquo;s five worries before they
        have to raise it, and answers each one
        with something concrete rather than with
        reassurance.
      </Callout>

      <H3 id="draft-letter">Draft: request for consent to short-stay letting</H3>

      <P>Dear [Owner],</P>

      <P>
        I am interested in taking [unit, building,
        road] on a [two] year lease at the asking
        rent of KES [x] per month. Before
        committing I want to be straightforward
        about how I intend to use it, and to ask
        for your written consent.
      </P>

      <P>
        I let furnished apartments on a short-stay
        basis to business travellers and visiting
        families. I would furnish the unit to a
        standard well above ordinary rental
        condition, at my own cost of roughly KES
        [x], and I would appoint [managing agent]
        to run it. They would handle guest
        screening, cleaning between every stay,
        maintenance and compliance, and they would
        be accountable to you as well as to me for
        the condition of the unit.
      </P>

      <P>
        I recognise this asks more of you than a
        conventional tenancy, so I would propose
        the following:
      </P>

      <UL>
        <LI>
          A [two] year term, giving you certainty
          of income
        </LI>
        <LI>
          A deposit of [three] months rather than
          one, as security against the additional
          wear
        </LI>
        <LI>
          Insurance covering short-stay
          occupation, with your interest noted and
          evidenced before the first guest
        </LI>
        <LI>
          That I meet the building management and
          comply with the house rules, including
          any visitor register
        </LI>
        <LI>
          A right for you to withdraw this consent
          on ninety days written notice if the
          arrangement causes you difficulty, with
          the tenancy then continuing on ordinary
          residential terms or ending as you
          prefer
        </LI>
      </UL>

      <P>
        I would rather have this agreed in writing
        at the outset than discover later that we
        had different expectations. I am happy to
        meet, and happy for you to speak to
        [managing agent] directly.
      </P>

      <P>Kind regards, [Name, phone, email]</P>

      <H2 id="if-they-say-no">If they say no</H2>

      <P>
        Ask what would change the answer. Often it
        is one thing: the committee, a nervous
        co-owner, a bad experience two years ago.
        Sometimes it is genuinely nothing, and
        where the covenant is absolute the owner
        is entitled to refuse without giving a
        reason at all.{" "}
        <Link
          href="/insights/can-landlord-refuse-sublet-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          When a refusal can be challenged
        </Link>{" "}
        sets out how narrow that is.
      </P>

      <P>
        What you should not do is proceed anyway.
        The downside is not a warning letter, it
        is losing a furnished unit mid-calendar.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We are the managing agent in that letter,
        and being able to name one is often what
        turns a no into a yes. We manage long-term
        property for owners across the same
        Nairobi neighbourhoods, so we know which
        buildings and which owners will consider
        short-letting, and an owner hearing the
        proposal hears it from a firm that already
        acts for people like them.
      </P>

      <P>
        We will speak to your prospective landlord
        directly if that helps, and we will tell
        you honestly when a building is not worth
        approaching. What we will not do is manage
        a unit without the owner&rsquo;s written
        consent.{" "}
        <Link
          href="/airbnb-arbitrage-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Management for operators
        </Link>{" "}
        sets out the service and the fee. This
        article is general information rather than
        legal advice, and the draft above is a
        starting point rather than a document to
        send unread.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/is-airbnb-arbitrage-legal-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          whether Airbnb arbitrage is legal in
          Kenya
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/sublease-agreement-kenya-operators"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what the paperwork has to contain
        </Link>
        .
      </P>
    </>
  );
}
