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
  slug: "someone-to-manage-my-airbnb-nairobi",
  title:
    "I need someone to manage my Airbnb: what handing a Nairobi unit over involves",
  description:
    "You have decided you want somebody else to run it. This is what actually happens next: what you hand over, what you should keep, what it costs, and the four weeks that decide whether the handover works.",
  metaTitle: "Someone to Manage My Airbnb in Nairobi",
  metaDescription:
    "Want someone to manage your Airbnb in Nairobi? What to hand over, what to keep, what it costs, and how the handover actually runs.",
  publishedAt: "2026-09-08",
  readingMinutes: 10,
  author: authors.poonam,
  tags: [
    "Airbnb",
    "Property Management",
    "Nairobi",
    "Short Let",
    "Co-Hosting",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Handing over a Nairobi Airbnb apartment to a management company",
};

export default function Article() {
  return (
    <>
      <Lede>
        Almost nobody arrives at this decision because of a spreadsheet. They
        arrive because of a specific evening: a guest locked out at eleven, a
        cleaner who did not turn up between two back to back stays, a message
        that went unanswered for six hours and cost a five star review. The
        arithmetic of the management fee comes later, and by then the decision
        is usually already made. What follows is what actually happens after
        it.
      </Lede>

      <H2 id="can-i-hire-someone">Can I hire someone to manage my Airbnb?</H2>

      <P>
        Yes, and in Nairobi there are three arrangements to choose between.
        They are frequently described in the same language and they are not
        the same thing.
      </P>

      <UL>
        <LI>
          <strong>A co-host.</strong> Your listing, your account, your reviews.
          Somebody else runs it and takes a percentage. This is the arrangement
          most owners want when they say they want someone to manage it.
        </LI>
        <LI>
          <strong>An operator who lists it themselves.</strong> The unit goes on
          their account. Simpler for them, and you should understand that the
          review history you build belongs to them rather than to you.
        </LI>
        <LI>
          <strong>Rent to rent.</strong> They lease the unit from you at a fixed
          monthly rent and keep whatever the short let earns above it. You get
          certainty and hand over the upside.
        </LI>
      </UL>

      <P>
        The mechanics of the first one, including how a co-host is paid and
        what happens when you remove them, are set out in{" "}
        <Link
          href="/insights/airbnb-co-host-nairobi-what-they-do"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what an Airbnb co-host does
        </Link>
        . The third is a legitimate model with a specific risk profile, covered
        in{" "}
        <Link
          href="/insights/airbnb-arbitrage-nairobi-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our piece on Nairobi arbitrage
        </Link>
        .
      </P>

      <H2 id="can-i-pay-someone">
        Can I pay someone to manage my Airbnb and still own the listing?
      </H2>

      <P>
        Yes, and you should want to. It is the single most valuable thing to
        insist on and it costs the operator nothing to agree to.
      </P>

      <P>
        The reason is that a mature listing is an asset in its own right. Two
        years of consistent five star reviews changes your position in search
        results, lets you hold price against newer units in the same building,
        and reduces the discount you have to offer in a slow month. If that
        history sits on an operator account, you cannot take it with you.
        Which means that every year the relationship continues, your ability
        to renegotiate the fee gets weaker rather than stronger, because
        leaving costs you more than it did the year before.
      </P>

      <Pullquote>
        An operator who insists on holding the listing is asking you to build
        an asset on their land. It may still be the right deal. Just price the
        exit before you sign, not after.
      </Pullquote>

      <H2 id="how-do-i-find-someone">
        How do I find someone to manage my Airbnb in Nairobi?
      </H2>

      <P>
        There is no licensing regime that filters this market, so reputation is
        doing all of the work. In rough order of how reliable they have proven
        to be:
      </P>

      <OL>
        <LI>
          <strong>Other owners in your building.</strong> Best source by a
          distance. They have watched the operator work, they know whether the
          cleaner turns up, and they have no incentive to sell you anything.
        </LI>
        <LI>
          <strong>Your existing cleaner or caretaker.</strong> They know who
          else operates in the building and, more usefully, who pays on time.
        </LI>
        <LI>
          <strong>Management companies that advertise short let work.</strong>{" "}
          Including us. Judge on the answers to the questions below rather than
          on the pitch.
        </LI>
        <LI>
          <strong>Airbnb own co-host directory.</strong> Real, but thin in
          Nairobi. Worth ten minutes, not worth waiting for.
        </LI>
      </OL>

      <P>
        The full set of filtering questions is in{" "}
        <Link
          href="/insights/choosing-airbnb-management-company-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to choose an Airbnb management company in Nairobi
        </Link>
        . If you only ask four, ask whose account the listing sits on, how many
        units one coordinator handles, what they can spend without asking you,
        and what the notice period is.
      </P>

      <H2 id="how-much-should-i-pay">
        How much should I pay someone to manage my Airbnb?
      </H2>

      <P>
        Full short let management in Nairobi runs 15 to 25 percent of revenue.
        Our own fee is 20 percent. Below about 10 percent for genuinely full
        service, somebody is either not doing the work or is making the margin
        somewhere you cannot see, usually on cleaning charged to the guest or
        on a markup on every repair.
      </P>

      <P>
        The more important question is what the percentage is charged on, which
        is where two identical looking quotes stop being identical. Gross
        booking value, revenue after platform commission, and revenue after
        cleaning are three different bases and the gap between them is larger
        than the gap between a 15 and a 20 percent headline rate. The worked
        arithmetic is in{" "}
        <Link
          href="/insights/how-much-do-airbnb-managers-charge-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how much Airbnb managers charge in Kenya
        </Link>
        .
      </P>

      <H2 id="what-you-hand-over">What you hand over, and what you keep</H2>

      <P>
        Handover goes wrong through omission rather than bad faith. This is the
        list we work through, and it is worth having whoever you appoint work
        through the same one.
      </P>

      <UL>
        <LI>
          <strong>Hand over:</strong> co-host permissions on the listing, keys
          and access codes, the gate and building contacts, the cleaner and any
          existing vendor relationships, the inventory with photographs, the
          wifi and utility account details, and the prepaid electricity meter
          number.
        </LI>
        <LI>
          <strong>Keep:</strong> ownership of the Airbnb account and listing,
          the payout bank details, the title and insurance documents, and the
          building association contact in your own name.
        </LI>
        <LI>
          <strong>Agree in writing:</strong> the fee and its basis, the expense
          limit above which you approve, who pays for what between guests, the
          notice period, and what happens to bookings that straddle the end of
          the relationship.
        </LI>
      </UL>

      <Callout title="Photograph the inventory before you hand over">
        Not after. An inventory taken on the first day of somebody else
        management is the only version both sides can rely on, and it is the
        thing that settles the argument about the missing blender or the
        scratched table eighteen months later. Date stamped photographs of every
        room, and a written list, take an hour and save considerably more.
      </Callout>

      <H2 id="the-first-month">The four weeks that decide it</H2>

      <P>
        You can tell within a month whether a handover has worked. The pattern
        is consistent enough to describe.
      </P>

      <OL>
        <LI>
          <strong>Week one.</strong> Access, inventory, a deep clean and an
          honest assessment of what the unit is missing. Expect a list of
          things to buy. A manager who finds nothing wrong has not looked.
        </LI>
        <LI>
          <strong>Week two.</strong> Listing rewritten, photographs reshot if
          they need it, pricing reset. This is usually where the number moves,
          because most self managed listings are priced once and then left.
        </LI>
        <LI>
          <strong>Week three.</strong> First guests under the new operation.
          Watch the response times and read the reviews as they land.
        </LI>
        <LI>
          <strong>Week four.</strong> First statement. This is the real test.
          It should reconcile to the platform payout, itemise every cost, and
          need no explanation from you to be legible.
        </LI>
      </OL>

      <P>
        If the first statement is a WhatsApp message with a number in it, that
        is what the next twenty four will be too. Say so immediately or leave.
      </P>

      <H2 id="what-goes-wrong">What goes wrong</H2>

      <UL>
        <LI>
          <strong>Occupancy projections nobody believes.</strong> Anyone quoting
          85 or 90 percent has not run a Nairobi calendar through a January.
          Realistic figures are in{" "}
          <Link
            href="/insights/airbnb-nairobi-occupancy-2026"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            our occupancy piece
          </Link>
          .
        </LI>
        <LI>
          <strong>A revenue figure with no cost stack next to it.</strong> Gross
          is easy to promise. Ask what reaches your account.
        </LI>
        <LI>
          <strong>Silence in the slow months.</strong> The test of a manager is
          February, not December.
        </LI>
        <LI>
          <strong>Nobody named.</strong> If no individual is accountable for
          your unit, every problem is everybody problem and therefore nobody
          problem.
        </LI>
        <LI>
          <strong>Expenses that appear without approval.</strong> A repair
          history with no receipts is not a repair history.
        </LI>
      </UL>

      <H2 id="how-goldstay-works">How this works with us</H2>

      <P>
        We manage short lets end to end in Westlands, Kilimani, Riverside,
        Kileleshwa and the surrounding areas: listing and photography, nightly
        pricing, guest screening and communication, changeover cleaning,
        maintenance between stays, and a monthly statement that reconciles.
        Owners abroad are paid by wire in US dollars. The listing stays in your
        name.
      </P>

      <P>
        The fee is 20 percent of revenue. Expenses above USD 50 come with a
        receipt, anything above USD 250 is approved by you first, notice is 30
        days with no exit fee, and the records come with you. If you would
        rather compare us against others properly, the questions to put to all
        of us are on our{" "}
        <Link
          href="/property-management-companies-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          page comparing Nairobi management companies
        </Link>
        .
      </P>

      <Callout title="Send us the unit and we will tell you honestly">
        The building, the bedroom count, and what it earned last month. We will
        come back with what we think it should be doing and whether we would
        take it on. We do turn units down.{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          List your property
        </Link>{" "}
        or see what is included in{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb management in Nairobi
        </Link>
        .
      </Callout>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/diaspora-airbnb-nairobi-remote-owner-playbook"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          running a Nairobi Airbnb from abroad
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/should-i-fire-my-nairobi-property-manager-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          should I fire my Nairobi property manager
        </Link>
        .
      </P>
    </>
  );
}
