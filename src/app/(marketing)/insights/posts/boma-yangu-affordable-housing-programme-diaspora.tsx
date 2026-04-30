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
  slug: "boma-yangu-affordable-housing-programme-diaspora",
  title:
    "Boma Yangu and the Affordable Housing Programme: the diaspora application playbook",
  description:
    "Boma Yangu is the registration platform for Kenya’s Affordable Housing Programme. Diaspora Kenyans can apply, qualify and ultimately own under the same scheme as residents, with some important differences. Here is the practical 2026 playbook covering eligibility, the categories, the application process, the price points and the realistic timelines.",
  publishedAt: "2025-03-12",
  readingMinutes: 8,
  author: authors.editors,
  tags: [
    "Kenya",
    "Boma Yangu",
    "Affordable Housing",
    "AHP",
    "Diaspora",
    "Buying",
    "Government",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Boma Yangu Affordable Housing Programme Kenya, diaspora application playbook 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Boma Yangu, the digital platform for Kenya’s
        Affordable Housing Programme, has registered
        millions of Kenyans since launch and is steadily
        delivering units across the country. For diaspora
        Kenyans the programme is genuinely accessible, but
        the process is misunderstood by most applicants.
        This is the 2026 playbook for diaspora households
        looking at AHP units, covering eligibility, the
        three pricing tiers, the application sequence,
        the realistic timelines and the trade offs versus
        the open market.
      </Lede>

      <H2 id="overview">What the Affordable Housing Programme actually is</H2>

      <P>
        AHP is the government-led programme to deliver
        below-market housing across Kenya, funded in part
        by the Affordable Housing Levy described in our{" "}
        <Link
          href="/insights/kenya-affordable-housing-levy-1-5-percent-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          housing levy piece
        </Link>
        . Units are delivered in three tiers:
      </P>

      <OL>
        <LI>
          <strong>Social housing</strong>. Below KES 1m
          per unit, targeted at the lowest income
          bracket, allocated by lottery and means test.
        </LI>
        <LI>
          <strong>Affordable housing</strong>. KES 1m to
          KES 3m per unit, the broad middle of the
          programme, targeted at the “missing
          middle” of formal sector workers.
        </LI>
        <LI>
          <strong>Market housing</strong>. KES 3m to KES
          10m per unit, market priced, available to anyone
          including diaspora buyers without the income
          based qualification.
        </LI>
      </OL>

      <H2 id="boma-yangu">Boma Yangu, the platform</H2>

      <P>
        Boma Yangu is the online registration and
        application platform managed by the State
        Department for Housing and Urban Development. To
        apply:
      </P>

      <OL>
        <LI>
          Register on bomayangu.go.ke with KRA PIN, ID or
          passport, mobile number and email
        </LI>
        <LI>
          Upload supporting documents (ID, payslip or
          income proof for income tested categories,
          marital status, dependents)
        </LI>
        <LI>
          Browse available projects across counties
        </LI>
        <LI>
          Apply for the specific project and unit type
          you want
        </LI>
        <LI>
          Track the application through the platform
        </LI>
      </OL>

      <H2 id="diaspora">How diaspora Kenyans qualify</H2>

      <P>
        Kenyan citizens abroad can register on Boma Yangu
        with a passport and KRA PIN. The eligibility
        rules vary by tier:
      </P>

      <UL>
        <LI>
          <strong>Social tier</strong>. Targeted at low
          income Kenyan households resident in Kenya.
          Diaspora applicants typically fall outside this
          tier on the income test.
        </LI>
        <LI>
          <strong>Affordable tier</strong>. Targeted at
          formal sector employees in defined income
          ranges. Diaspora applicants can apply where the
          income test is met from documented Kenyan or
          foreign income.
        </LI>
        <LI>
          <strong>Market tier</strong>. Open to any
          Kenyan citizen including diaspora, no income
          test, allocation by ballot or first come first
          served on the project basis.
        </LI>
      </UL>

      <P>
        For most diaspora households the most realistic
        path is the market tier or the upper end of the
        affordable tier. The pricing on these tiers is
        meaningfully below comparable open market stock
        in equivalent suburbs, which is the value
        proposition.
      </P>

      <H2 id="non-citizen">Non-citizen diaspora applicants</H2>

      <P>
        AHP units are restricted to Kenyan citizens. Non
        citizen spouses or children can be co-applicants
        only where they hold Kenyan citizenship by descent
        or registration. For non citizen diaspora buyers
        the AHP is not available; the open market route
        applies. We cover the citizenship picture in our{" "}
        <Link
          href="/insights/freehold-vs-leasehold-kenya-citizenship-rules"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          citizenship and freehold piece
        </Link>{" "}
        and our{" "}
        <Link
          href="/insights/kenya-citizenship-by-investment-residence-permits-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          citizenship and residence piece
        </Link>
        .
      </P>

      <H2 id="how-allocation">How allocation actually works</H2>

      <P>
        Once your application is registered, allocation
        depends on the tier:
      </P>

      <UL>
        <LI>
          <strong>Social and affordable tiers</strong>:
          Lottery and ballot system, with verification
          of the income and other eligibility criteria
          before the offer is made.
        </LI>
        <LI>
          <strong>Market tier</strong>: First come first
          served at project launch, sometimes with a
          ballot if oversubscribed.
        </LI>
      </UL>

      <P>
        Successful applicants receive an offer letter for
        a specific unit. From offer letter to handover the
        steps are similar to an off-plan private project,
        with the difference that the State Department or
        the project SPV (Special Purpose Vehicle) is the
        counterparty rather than a private developer.
      </P>

      <H2 id="financing">Financing the unit</H2>

      <P>
        AHP units can be paid:
      </P>

      <UL>
        <LI>
          In cash through the project payment schedule
        </LI>
        <LI>
          Through the Kenya Mortgage Refinance Company
          (KMRC) backed mortgage products at preferential
          rates
        </LI>
        <LI>
          Through the Tenant Purchase Scheme (TPS) on
          social and affordable tier units, where the
          buyer pays a fixed monthly amount over a long
          term and takes title at the end
        </LI>
        <LI>
          Through a regular commercial mortgage
        </LI>
      </UL>

      <P>
        For diaspora buyers, the KMRC route via a
        partner bank is the most practical. The mortgage
        is in KES, secured on the AHP unit, with a tenor
        typically 15 to 25 years and rates currently
        meaningfully below standard commercial mortgage
        rates. We cover diaspora mortgage mechanics in our{" "}
        <Link
          href="/insights/kenya-mortgage-rates-2026-diaspora-buyer-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          mortgage rates piece
        </Link>
        .
      </P>

      <H2 id="benefits">The actual benefits versus open market</H2>

      <UL>
        <LI>
          Below market price for comparable specification
          in equivalent suburb
        </LI>
        <LI>
          Stamp duty waiver on social and affordable tier
          units
        </LI>
        <LI>
          Access to KMRC backed mortgages at lower rates
        </LI>
        <LI>
          Title is freehold or long leasehold, no
          peculiarities
        </LI>
        <LI>
          Government delivery accountability, in
          principle stronger than typical private off-plan
        </LI>
      </UL>

      <H2 id="trade-offs">The realistic trade offs</H2>

      <UL>
        <LI>
          <strong>Delivery timelines</strong>. AHP
          projects do slip, sometimes materially. The
          structural drivers are similar to private off
          plan as covered in our{" "}
          <Link
            href="/insights/why-nairobi-off-plan-delivery-dates-slip"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            off-plan delays piece
          </Link>
          .
        </LI>
        <LI>
          <strong>Specification variance</strong>. Build
          quality and finishes vary by project and
          contractor. Diligence on the specific project
          is required.
        </LI>
        <LI>
          <strong>Location</strong>. Many AHP projects
          sit in Park Road, Pangani, Mukuru, Starehe, the
          Eastlands corridor and similar areas. The
          locations are commuter friendly but are not the
          premium suburbs. For diaspora households who
          want Karen, Lavington or Westlands, AHP is not
          the answer.
        </LI>
        <LI>
          <strong>Resale liquidity</strong>. AHP units
          have modest resale liquidity; the secondary
          market is thinner than for private compounds.
          For long term hold or owner occupation this is
          fine. For pure trade in trade out investment it
          is a constraint.
        </LI>
        <LI>
          <strong>Tenure restrictions</strong>. Some AHP
          schemes include resale restrictions for the
          first few years to prevent flipping. Confirm
          the specific project terms.
        </LI>
      </UL>

      <H2 id="who-it-suits">Who AHP suits</H2>

      <OL>
        <LI>
          Diaspora Kenyans who plan to return and live in
          the unit
        </LI>
        <LI>
          Diaspora households buying as long-term let
          investors at sensible price points
        </LI>
        <LI>
          First-time buyers needing access to KMRC
          mortgage rates
        </LI>
        <LI>
          Buyers willing to accept the AHP location set
          and trade off premium suburb access for price
        </LI>
      </OL>

      <P>
        It does not suit:
      </P>

      <UL>
        <LI>
          Buyers wanting premium Nairobi suburbs
          specifically
        </LI>
        <LI>
          Buyers wanting fast resale with high turnover
        </LI>
        <LI>
          Non-citizen diaspora buyers
        </LI>
        <LI>
          Buyers needing immediate occupation
        </LI>
      </UL>

      <Callout title="The fast-track checklist">
        Register on bomayangu.go.ke with your KRA PIN.
        Upload your passport, marital and dependent
        information. Browse projects, shortlist two or
        three that match your needs. Apply, track and be
        ready to commit when the offer letter comes in.
        For mortgage backed purchases, prequalify with a
        KMRC partner bank in parallel.
      </Callout>

      <Pullquote>
        AHP is not the right route for every diaspora
        Kenyan, but for those it does suit, the price and
        finance package is materially better than the
        open market alternative. Treat it like any other
        off-plan: diligence the project, plan the
        timeline conservatively and finance it cleanly.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For diaspora clients exploring AHP we help with
        Boma Yangu registration, project diligence on
        specific schemes, mortgage prequalification with
        KMRC partner banks, and the eventual completion
        and tenant find when the unit is delivered. We
        will say plainly when AHP is the right answer and
        when it is not, given the client’s broader
        objectives.
      </P>

      <P>
        Read the related{" "}
        <Link
          href="/insights/kenya-affordable-housing-levy-1-5-percent-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          housing levy piece
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/kenya-mortgage-rates-2026-diaspora-buyer-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          mortgage rates piece
        </Link>{" "}
        for the wider funding context.
      </P>
    </>
  );
}
