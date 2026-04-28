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
  slug: "how-to-tell-if-relative-kenya-scamming-you",
  title:
    "How to tell if your relative back in Kenya is scamming you on a property project",
  description:
    "Most diaspora Kenyans who lose money on Kenyan property do not lose it to strangers. They lose it to relatives or family friends managing the project on the ground. Here are the patterns, the red flags, the ways to verify quietly, and what to do when the suspicion is correct.",
  publishedAt: "2025-04-03",
  readingMinutes: 8,
  author: authors.editors,
  tags: [
    "Kenya",
    "Diaspora",
    "Family",
    "Scams",
    "Property",
    "Trust",
    "Money",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "How to tell if relative in Kenya is scamming you on property project, diaspora red flags",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most diaspora Kenyans who lose money on Kenyan
        property do not lose it to strangers in dramatic
        scams. They lose it slowly, over months and
        years, to a relative or family friend who is
        managing the project on the ground. The pattern
        is consistent enough across the cases we see
        that it is almost a checklist. The relative
        starts with good intentions, the project gets
        more expensive than expected, the relative
        stretches the truth on one item, the diaspora
        owner accepts the explanation, the next item is
        easier to stretch, and a year later there is a
        gap in the file that nobody can quite account
        for. This is the practical 2026 guide to spotting
        the pattern early and acting on it without
        destroying the relationship in the process.
      </Lede>

      <H2 id="setup">The setup that makes this possible</H2>

      <P>
        Three structural factors create the conditions:
      </P>

      <OL>
        <LI>
          You are far away and rarely on the ground
        </LI>
        <LI>
          The relative has access to the site, the
          contractor and the local supply chain
        </LI>
        <LI>
          You trust them more than you would trust a
          professional manager, so you supervise them
          less
        </LI>
      </OL>

      <P>
        The professional manager who hardly knows you
        gets supervised carefully. The cousin who grew up
        in your family home gets a free pass. The cousin
        is not necessarily less honest. The cousin is
        less supervised, and the absence of supervision
        is what creates the gap.
      </P>

      <H2 id="patterns">Patterns to look for</H2>

      <H3 id="financial">Financial signals</H3>

      <UL>
        <LI>
          Costs that creep up in small increments rather
          than a single large request
        </LI>
        <LI>
          Receipts that are vague or hand-written
          consistently, even though shops in the area
          would issue printed receipts
        </LI>
        <LI>
          The same supplier appearing across many
          categories (cement, tiles, electrical, paint)
          when these are usually separate suppliers
        </LI>
        <LI>
          A reluctance to put price quotes in writing in
          advance
        </LI>
        <LI>
          Material deliveries that are reported but not
          photographed, or photographed in ways you
          cannot verify quantities
        </LI>
        <LI>
          A consistent gap between the bid and the actual
          spend that grows over time
        </LI>
      </UL>

      <H3 id="behaviour">Behavioural signals</H3>

      <UL>
        <LI>
          Reluctance to introduce you directly to the
          contractor or to other family members involved
          in the project
        </LI>
        <LI>
          Discomfort when you ask for a site visit by
          someone independent
        </LI>
        <LI>
          Increasing emotional reactions when you ask
          financial questions, treating them as personal
          attacks
        </LI>
        <LI>
          Defensive language about how hard they are
          working, used to deflect specific questions
        </LI>
        <LI>
          A pattern of not sending updates unless
          chased, then sending too much detail when
          asked
        </LI>
        <LI>
          A pattern of only being able to discuss
          financial matters by phone, not by message,
          and rarely by video call from the site
        </LI>
      </UL>

      <H3 id="project">Project signals</H3>

      <UL>
        <LI>
          Progress that does not match the spend
        </LI>
        <LI>
          Items that were paid for that do not appear
          on site (a missing water tank, a kitchen that
          looks different from the spec, a generator
          that is not where it should be)
        </LI>
        <LI>
          Inflated material quantities (more bags of
          cement than the build can have used)
        </LI>
        <LI>
          Renovations or extensions to the relative&rsquo;s
          own property happening at the same time, on
          materials that look similar to yours
        </LI>
        <LI>
          The relative becoming visibly more comfortable
          financially over the course of the project
        </LI>
      </UL>

      <H2 id="verify">Quiet ways to verify</H2>

      <P>
        Verification needs to happen without escalating
        into accusation. Some practical approaches:
      </P>

      <OL>
        <LI>
          Engage an independent quantity surveyor or
          construction professional to do a site visit
          and produce a written report. Frame it as
          standard practice for owner side oversight,
          not as a check on the relative.
        </LI>
        <LI>
          Ask the contractor directly for their copy of
          the BoQ, the payment schedule and the material
          deliveries. Compare to what you have been told
          by the relative.
        </LI>
        <LI>
          Phone the supplier on a major line item and
          confirm the unit price and the quantity
          delivered. Suppliers are usually willing to
          confirm.
        </LI>
        <LI>
          Visit unannounced. The single most useful tool
          for any diaspora project is a visit you did
          not pre-warn about.
        </LI>
        <LI>
          Send a friend who is in Kenya for unrelated
          reasons to drop in on the site. Their
          observations are often more informative than
          formal site visits.
        </LI>
      </OL>

      <H2 id="confirmed">When the suspicion is confirmed</H2>

      <P>
        The temptation when you find out is to confront
        the relative immediately and forcefully. This
        almost always makes the situation worse. A
        better sequence:
      </P>

      <OL>
        <LI>
          Get the documentation in order quietly first.
          Receipts, photographs, BoQ versus actuals,
          supplier confirmations, the QS report.
        </LI>
        <LI>
          Decide on the outcome you actually want.
          Recovery of money. Removal of the relative
          from project management. End of the project.
          Reconciliation. You need to know your goal
          before you have the conversation.
        </LI>
        <LI>
          Have the conversation in person if possible,
          or by video call, not by WhatsApp message.
          State the facts as you have them. Give the
          relative a chance to explain.
        </LI>
        <LI>
          Whatever the explanation, make a clean
          structural change. New project manager, new
          financial controls, new sign off process.
          Good intentions are not enough.
        </LI>
        <LI>
          Decide what to share with the wider family
          and what not to. Most cases are handled
          better quietly than publicly.
        </LI>
      </OL>

      <H2 id="prevention">Prevention is cheaper than cure</H2>

      <P>
        Far easier than catching it after the fact:
      </P>

      <UL>
        <LI>
          Do not let any one person be both site
          supervisor and money holder. Separate the
          roles.
        </LI>
        <LI>
          Use a professional construction manager or
          property manager from the start. Pay the fee.
          The fee is much smaller than the leakage you
          would otherwise see.
        </LI>
        <LI>
          Pay contractors directly, not through
          relatives.
        </LI>
        <LI>
          Insist on documented BoQ, milestone payments
          and signed receipts.
        </LI>
        <LI>
          Do not pay for materials in advance. Pay on
          delivery to site, against signed delivery
          notes.
        </LI>
        <LI>
          Visit twice during a major build, not once
          and never again.
        </LI>
      </UL>

      <H2 id="emotional">The emotional dimension</H2>

      <P>
        The hardest part of this is not financial. It is
        the realisation that someone you trusted was
        less trustworthy than you needed them to be.
        Most diaspora Kenyans who go through this
        describe a year of grieving the relationship
        before they can move on.
      </P>

      <P>
        Two things help with that:
      </P>

      <UL>
        <LI>
          Recognising that the structural setup made
          the temptation hard to resist. Removing the
          structure does not require burning the
          relationship.
        </LI>
        <LI>
          Choosing not to repeat the structure with
          the next relative. Once is unfortunate; twice
          is a pattern you control.
        </LI>
      </UL>

      <Callout title="The defensive default">
        Treat the property as a business and the family
        relationship as something separate. Use
        professional managers, separate roles, written
        documentation, milestone payments and
        independent oversight. The family relationship
        survives properly managed structures much
        better than it survives loose money flows.
      </Callout>

      <Pullquote>
        Most diaspora Kenyan property leakage is not
        about bad relatives. It is about structures
        that made it too easy to drift. Fix the
        structure and almost all of it goes away.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For diaspora clients we provide the
        structural alternative: regulated property
        management, separated roles, contractual
        accountability, signed receipts, and a clear
        owner statement that does not have to pass
        through a family member. Family relationships
        are kept for what they should be (support,
        connection, love) rather than being asked to
        carry the financial weight of a property
        operation.
      </P>

      <P>
        Read also our{" "}
        <Link
          href="/insights/black-tax-diaspora-kenyans-property-family-pressure"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          black tax piece
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/how-diaspora-kenyans-get-scammed-buying-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          property scams piece
        </Link>{" "}
        for the wider context this sits inside.
      </P>
    </>
  );
}
