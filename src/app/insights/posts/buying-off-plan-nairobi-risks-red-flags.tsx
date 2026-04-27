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
  slug: "buying-off-plan-nairobi-risks-red-flags",
  title:
    "Buying off plan in Nairobi: when it works and when it ruins you",
  description:
    "A frank look at off plan apartments in Nairobi in 2026. Why developers price them aggressively, the seven red flags that predict a failed project, the protections that actually work, and when off plan is genuinely the right call.",
  publishedAt: "2026-02-04",
  readingMinutes: 9,
  author: authors.poonam,
  tags: ["Nairobi", "Buying", "Off Plan", "Developers", "Risk"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi construction site, off plan apartment buying risks and red flags",
};

export default function Article() {
  return (
    <>
      <Lede>
        Off plan can be the best entry point into Nairobi
        property, or it can be a five year nightmare that
        ends with a half-built tower and a cancelled bank
        cheque. The difference is not luck. It is a small
        number of structural factors that, if you check them
        properly, predict outcomes with very high reliability.
        Here is what off plan actually is, why developers
        offer it on the terms they do, the seven red flags
        that almost always precede a failed project, and the
        protections that actually work.
      </Lede>

      <H2 id="what-it-is">What off plan actually is</H2>

      <P>
        Off plan means buying a unit before construction is
        complete, sometimes before construction has begun.
        The buyer pays in stages tied to construction
        milestones: typically 10 to 20% on signing, then
        instalments at foundation, slab levels, finishing,
        and handover.
      </P>

      <P>
        Developers offer off plan because they need cash to
        finance construction. The buyer in turn gets a
        discount of 10 to 25% relative to the price the unit
        will sell at on completion, plus the option to
        customise finishes. On a project that completes on
        time and to spec, off plan is the highest-return way
        to buy in Nairobi.
      </P>

      <H2 id="why-they-fail">Why projects actually fail</H2>

      <P>
        Failure modes are not random. The Nairobi off plan
        market over the last decade has produced enough
        delayed and abandoned projects that the patterns are
        now well-documented. Six recurring causes:
      </P>

      <UL>
        <LI>
          The developer used buyer deposits to finance the
          land purchase, not the construction. When sales
          slow, construction stalls.
        </LI>
        <LI>
          The developer was relying on continued price
          appreciation to make the project work. When the
          market slowed (2018 to 2021), the unit-economics
          collapsed.
        </LI>
        <LI>
          Costs in KES rose materially due to currency
          depreciation, while sale prices were fixed in
          KES. The margin disappeared.
        </LI>
        <LI>
          The developer was over-leveraged on the
          construction debt. A single late payment from a
          single buyer caused a cascade.
        </LI>
        <LI>
          County approvals were not in place at the start.
          Approvals took years, costs accumulated, the
          project never recovered.
        </LI>
        <LI>
          The developer had no track record, was operating
          their first project, and underestimated every
          cost.
        </LI>
      </UL>

      <H2 id="seven-red-flags">Seven red flags that predict failure</H2>

      <H3 id="red-1">1. No completed projects on the developer&rsquo;s record</H3>

      <P>
        First-time developers fail at materially higher rates
        than experienced ones. Always ask for the
        developer&rsquo;s previous completed projects. Visit
        one. Speak to current owners. If the developer cannot
        produce a completed project to walk through, the
        project you are buying into is their first, and the
        risk is structural.
      </P>

      <H3 id="red-2">2. Aggressive discount for cash up-front</H3>

      <P>
        A 30% discount for paying 100% up-front is not
        generosity. It is a signal that the developer is
        cash-strapped and willing to give up margin in
        exchange for liquidity now. The bigger the
        up-front-discount, the higher the project risk.
      </P>

      <H3 id="red-3">3. No escrow on deposits</H3>

      <P>
        In a properly structured off plan transaction, buyer
        deposits are held in an escrow account at a
        commercial bank, drawn down only against verified
        construction milestones. If the developer wants
        deposits paid into a general operating account, they
        are using your money for whatever they need, which
        often is not your project.
      </P>

      <H3 id="red-4">4. No bank involvement</H3>

      <P>
        Reputable Nairobi off plan projects in 2026 have
        commercial bank construction financing, and the bank
        in turn provides an off-plan mortgage facility for
        end-buyers. The bank&rsquo;s due diligence on the
        developer is a separate independent check. If no
        bank is touching the project, the bank&rsquo;s due
        diligence has presumably failed already.
      </P>

      <H3 id="red-5">5. Sale agreement that does not mention completion date</H3>

      <P>
        Or that mentions a completion date with no penalty
        for delay. The standard structure is a target
        completion date with a grace period (typically 6
        months) and then an automatic refund clause if
        completion does not happen. Without that clause, you
        have no remedy if the project takes five years
        instead of two.
      </P>

      <H3 id="red-6">6. Glossy marketing, vague structural detail</H3>

      <P>
        The brochure is beautiful. The website is animated.
        The structural drawings are not available. The
        approvals from the County are described as
        &ldquo;in progress&rdquo;. The contractor is unnamed.
        Every cost-cutting and corner-cutting decision shows
        up downstream as either a delay or a quality
        compromise.
      </P>

      <H3 id="red-7">7. The developer&rsquo;s entity is brand new</H3>

      <P>
        Many Nairobi off plan projects are sold through a
        special purpose vehicle (SPV) registered specifically
        for the project. This is not inherently a problem,
        but if the SPV has no track record and the parent
        company has no completed projects, you are
        contracting with a one-project entity. If the project
        fails, the entity dissolves, your remedy is against a
        company with no assets.
      </P>

      <Pullquote>
        Glossy marketing, vague structural detail. Every
        cost-cutting decision the developer made shows up
        downstream as either a delay or a quality
        compromise.
      </Pullquote>

      <H2 id="protections">The protections that actually work</H2>

      <OL>
        <LI>
          <strong>Stage payments tied to verified milestones.</strong>
          Not calendar dates, milestones. Foundation, slab on
          each floor, completion of each phase. Each stage
          confirmed by an independent surveyor before payment
          releases.
        </LI>
        <LI>
          <strong>Escrow.</strong> All deposits in a
          commercial bank escrow account, not the developer
          operating account.
        </LI>
        <LI>
          <strong>Performance bond.</strong> Some developers
          provide a bank-issued performance bond covering
          buyer deposits if the project fails. This is the
          gold standard and increasingly common in 2026.
        </LI>
        <LI>
          <strong>Hard-stop refund clause.</strong> If
          completion does not happen by the target date plus
          grace period, the buyer&rsquo;s right is automatic
          refund of all paid deposits plus interest. Make
          sure this is in the sale agreement, not just
          assumed.
        </LI>
        <LI>
          <strong>Your own lawyer, paid by you.</strong> Not
          the developer&rsquo;s, not the agent&rsquo;s. A
          property lawyer paid by you reads every clause for
          you, not for the seller.
        </LI>
      </OL>

      <H2 id="when-it-works">When off plan is genuinely the right call</H2>

      <UL>
        <LI>
          The developer has at least three completed
          projects, walkable, with current owners willing to
          speak.
        </LI>
        <LI>
          A commercial bank is providing the construction
          finance and the buyer-mortgage facility.
        </LI>
        <LI>
          Buyer deposits sit in escrow.
        </LI>
        <LI>The sale agreement has a hard-stop refund clause.</LI>
        <LI>
          The discount to projected completion price is in
          the 10 to 20% range. Discounts of 30%+ are flares.
        </LI>
        <LI>
          You have personal tolerance for an 18 to 24 month
          completion timeline and are not buying for
          immediate income.
        </LI>
      </UL>

      <Callout title="The hardest question to ask">
        Ask the developer: &ldquo;If I want to assign my
        contract to another buyer halfway through, what is
        your process?&rdquo; A developer running a real
        project has a clear answer (typically a 1 to 2%
        assignment fee, no questions). A developer with
        problems gets defensive, because they need new
        deposits, not transferred ones.
      </Callout>

      <H2 id="how-we-help">How we help</H2>

      <P>
        Through our{" "}
        <Link
          href="/property-sourcing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          buy-side service
        </Link>
        , Goldstay shortlists off plan projects against the
        full red flag and protection checklist, walks through
        each, speaks to current owners of the developer&rsquo;s
        previous projects, reviews the sale agreement with our
        partner law firm, and makes a written go or no-go
        recommendation. The buyer pays nothing for this. We
        are paid by the developer on completion.
      </P>

      <P>
        Off plan can be a great Nairobi entry point. With
        the right diligence, the discount is real and the
        risk is manageable. Without it, off plan is the most
        common way diaspora buyers lose serious money in
        Kenya.
      </P>
    </>
  );
}
