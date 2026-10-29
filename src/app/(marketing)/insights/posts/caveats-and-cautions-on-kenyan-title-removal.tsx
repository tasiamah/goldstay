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
  slug: "caveats-and-cautions-on-kenyan-title-removal",
  title:
    "Caveats and cautions on a Kenyan title: what they are and how to deal with them",
  metaTitle: "Caveats and cautions on a Kenyan title, and removal",
  description:
    "Caveats and cautions are the most common reason Kenyan property transactions get stuck. Here is the honest 2026 guide to what they actually are, the differences between them, why they get registered, who can register them, and how to remove them so a transaction can complete.",
  metaDescription:
    "Caveats and cautions are the most common reason Kenyan property transactions get stuck.",
  publishedAt: "2024-07-28",
  readingMinutes: 7,
  author: authors.legal,
  tags: [
    "Kenya",
    "Title",
    "Caveat",
    "Caution",
    "Land Law",
    "Diligence",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Caveats and cautions Kenyan title 2026 land registration removal guide",
  faq: [
    {
      q: "How do you remove a caveat on land in Kenya?",
      a: "By one of four routes. By agreement, where the caveator lodges a withdrawal application at the lands registry once the underlying claim is settled, which is the simplest and most common. By lapse, where a time limited caveat expires unless renewed. By court order, where the caveator refuses to withdraw and the registered owner applies to court, which will order removal and may award costs against the caveator if the claim is baseless. Or by substituting security, lodging a bond in place of the caveat so the transaction can proceed while the dispute continues. Start by establishing what the claim actually is, because that decides which route is open to you.",
    },
    {
      q: "Can a property be sold if it has a caveat?",
      a: "Not freely. The registrar cannot register any subsequent dealing without notifying the caveator and complying with the caveat's terms, so a sale can be agreed but the transfer cannot be registered while the entry stands. A buyer can therefore sign and even pay, then find the title will not move into their name. The caveat has to be cleared before completion rather than after, which is why an official title search on the day before completion is not optional: a caveat can be registered at any time, including after your diligence is finished and before you have paid.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        Caveats and cautions are the most common
        reason a Kenyan property transaction gets
        stuck mid-way. Buyers run a title search,
        find an entry they did not expect, and the
        deal pauses while everyone works out what to
        do. Here is the honest 2026 guide to what
        caveats and cautions actually are, why they
        get registered, and how to remove them
        cleanly when they appear.
      </Lede>

      <H2 id="what-are">What they are</H2>

      <H3 id="caveat">Caveat</H3>

      <P>
        A caveat is a notice registered on the
        title by a person claiming an interest in
        the land. Once registered, the registrar
        cannot register any subsequent dealing in
        the land without notifying the caveator and
        without complying with the caveat’s
        terms. The caveat is a defensive instrument
        that pauses transactions until the
        underlying claim is resolved.
      </P>

      <H3 id="caution">Caution</H3>

      <P>
        A caution is similar in effect to a caveat.
        Under the Land Registration Act 2012, the
        terminology has been simplified somewhat,
        and the operational effect of a caution is
        broadly the same: a third party has
        registered a claim or interest that the
        registrar must take into account before
        any further dealing.
      </P>

      <P>
        For practical purposes, both caveats and
        cautions on a Kenyan title mean: there is
        a claim outstanding, and the title cannot
        transact freely until it is dealt with.
      </P>

      <H3 id="can-a-property-be-sold-with-a-caveat">
        Can a property be sold if it has a caveat?
      </H3>

      <P>
        Not freely. The registrar cannot register
        a subsequent dealing without notifying
        the caveator and complying with the
        caveat&apos;s terms, so a sale can be
        agreed but the transfer cannot be
        registered while the entry stands. In
        practice that means a buyer can sign and
        even pay, and then find the title will
        not move into their name.
      </P>

      <P>
        This is why the caveat has to be removed
        before completion rather than after, and
        why an official title search on the day
        before completion is not optional. A
        caveat can be registered at any point,
        including after you have done your
        diligence and before you have paid.
      </P>

      <H2 id="why">Why they get registered</H2>

      <UL>
        <LI>
          Spouse claiming matrimonial interest
        </LI>
        <LI>
          Beneficiary or co-heir claiming under a
          deceased estate
        </LI>
        <LI>
          Bank or SACCO claiming charge or
          discharge dispute
        </LI>
        <LI>
          Buyer with deposit claiming under a
          sale agreement that has not completed
        </LI>
        <LI>
          Boundary or neighbour claiming
          encroachment
        </LI>
        <LI>
          Counter-party in a court dispute (the
          court can order registration of a
          caution to preserve the position
          pending resolution)
        </LI>
        <LI>
          Trustee or director claiming on behalf
          of a company
        </LI>
        <LI>
          Government agency (KRA, county) claiming
          unpaid charges
        </LI>
      </UL>

      <H2 id="who-register">Who can register</H2>

      <P>
        Any person claiming an interest in the
        land that is not adequately protected by
        registration of a formal instrument can
        apply to register a caveat or caution. The
        applicant must demonstrate the basis of
        the claim. The registrar accepts the
        application if it appears bona fide on
        its face.
      </P>

      <H2 id="discover">Discovering one in your transaction</H2>

      <OL>
        <LI>
          The official title search shows the
          entry
        </LI>
        <LI>
          The buyer’s lawyer raises the
          issue with the seller’s lawyer
        </LI>
        <LI>
          The seller is asked to explain and
          remove
        </LI>
        <LI>
          The transaction pauses pending removal
        </LI>
        <LI>
          If the buyer proceeds without removal,
          the buyer takes the title subject to
          whatever the caveator can ultimately
          establish
        </LI>
      </OL>

      <H2 id="removal">How to remove</H2>

      <H3 id="how-to-remove-a-caveat">
        How do you remove a caveat on land in
        Kenya?
      </H3>

      <P>
        There are four routes, and which one
        applies depends entirely on whether the
        caveator will cooperate and whether their
        underlying claim has merit. By agreement,
        by lapse, by court order, or by
        substituting security. Each is set out
        below.
      </P>

      <P>
        The ordering matters in practice. Start
        by establishing what the claim actually
        is, because a caveat lodged over an
        unpaid debt is removed by settling it,
        while one lodged to frustrate a sale is
        removed by a court that can also award
        costs against the person who lodged it.
      </P>

      <H3 id="agreement">By agreement</H3>

      <P>
        The simplest route. The caveator agrees
        to withdraw, lodges a withdrawal
        application at the lands registry, and
        the registrar removes the entry. This is
        what happens when the underlying claim
        has been resolved (settlement payment,
        consent agreement, withdrawn dispute).
      </P>

      <H3 id="lapse">By lapse</H3>

      <P>
        Some caveats are time limited and lapse
        automatically after a defined period
        unless renewed. Older title regimes had
        more aggressive lapse rules; modern
        practice is more cautious.
      </P>

      <H3 id="court">By court order</H3>

      <P>
        Where the caveator refuses to withdraw,
        the registered owner can apply to court
        for an order to remove. The court
        considers whether the caveator’s
        underlying claim has any prospect of
        success. If the claim is baseless, the
        court orders removal and may award costs
        against the caveator. If the claim has
        merit, the court typically directs the
        underlying dispute to be resolved before
        removal.
      </P>

      <H3 id="bond">By substituting security</H3>

      <P>
        In some circumstances, the registered
        owner can lodge a bond or security in
        place of the caveat, allowing the
        transaction to proceed while the
        underlying dispute continues against the
        substituted security.
      </P>

      <H2 id="practical">Practical advice for buyers</H2>

      <UL>
        <LI>
          Always run an official title search on
          the day before completion. Caveats can
          be registered at any time
        </LI>
        <LI>
          Never complete a transaction with a
          caveat or caution outstanding without
          full understanding of the underlying
          claim
        </LI>
        <LI>
          Do not accept the seller’s
          assurance that “it will be
          removed soon”. Removal has to
          happen before completion, not after
        </LI>
        <LI>
          Where the caveat reflects a real
          dispute (matrimonial, succession, bank
          charge), the underlying issue must be
          resolved, not just the entry removed
        </LI>
      </UL>

      <H2 id="practical-sellers">Practical advice for sellers</H2>

      <UL>
        <LI>
          Run your own title search before you
          list, not after the buyer’s
          lawyer raises the issue
        </LI>
        <LI>
          If you find caveats or cautions, deal
          with them before listing. Buyers
          discount aggressively on encumbered
          titles
        </LI>
        <LI>
          For matrimonial property, secure the
          spousal consent up front
        </LI>
        <LI>
          For succession titles, complete
          succession before listing
        </LI>
        <LI>
          For property under bank charge, get a
          discharge plan in writing from the bank
          before listing
        </LI>
      </UL>

      <Callout title="The title rule">
        Buyers commit to titles, not to
        properties. A beautiful house with a
        clouded title is not the same asset as
        the same beautiful house with a clean
        title. The official title search through
        your own lawyer, on the day before
        completion, is the moment to discover any
        problem.
      </Callout>

      <Pullquote>
        Caveats and cautions are not a defect in
        the Kenyan land system. They are how the
        system protects third party claims. The
        defect is the buyer who proceeds without
        understanding what a particular caveat
        actually represents.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we run thorough
        title diligence and require a clean title
        search at completion. Where a caveat or
        caution exists, we work through it
        properly with our legal partners rather
        than papering it over.
      </P>

      <P>
        Read also our pieces on{" "}
        <Link
          href="/insights/how-to-verify-kenyan-title-deed-from-abroad"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to verify a Kenyan title deed
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/ardhisasa-using-kenya-digital-land-platform-from-abroad"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          using Ardhisasa
        </Link>
        .
      </P>
      <P>
        If you want somebody in Nairobi doing this on your behalf, that is{" "}
        <Link
          href="/property-sourcing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what we source for
        </Link>
        .
      </P>
    </>
  );
}
