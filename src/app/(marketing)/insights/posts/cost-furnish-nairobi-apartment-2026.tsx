import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  KeySummary,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

// Restructured in v1.64.0. The original indexed its three tiers by
// quality and bedroom count at the same time: "mid-market 1 to 2-bed",
// "mid-premium 2 to 3-bed", "premium 3 to 4-bed". That reads fine until
// somebody asks what a premium one bedroom costs, at which point the
// article has no answer, because the two variables were collapsed into
// one axis. Splitting them is the whole change.
//
// The second thing it missed is that furnishing somewhere to live and
// furnishing somewhere to let are different jobs at different prices.
// The old line items are an owner-occupier minimum and are kept as
// such, because they add up correctly. A rental specification carries
// three sets of linen rather than one, blackout, a workspace, a spare
// of everything and a mattress chosen for four hundred strangers, and
// costs accordingly. Quoting the owner-occupier number to a landlord
// was underselling the work and undercutting our own packages.
export const meta: PostMeta = {
  slug: "cost-furnish-nairobi-apartment-2026",
  title: "How much does it cost to furnish a Nairobi apartment in 2026?",
  metaTitle: "Cost to furnish a Nairobi apartment in 2026",
  description:
    "Furnishing a Nairobi apartment in 2026 costs from about KES 200,000 for an owner-occupier minimum to KES 5m and above at the premium end. The line by line budget, by unit size and by specification tier, and why furnishing to let costs more than furnishing to live in.",
  metaDescription:
    "What it costs to furnish a Nairobi apartment in 2026, line by line, by unit size and specification tier, with rental grade budgets.",
  publishedAt: "2026-04-05",
  updatedAt: "2026-09-13",
  readingMinutes: 8,
  author: authors.editors,
  tags: ["Furnishing", "Nairobi", "Apartment", "Budget", "Buyer Guide", "2026"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "How much cost furnish Nairobi apartment 2026 honest budget",
  faq: [
    {
      q: "How much does it cost to furnish a one bedroom apartment in Nairobi?",
      a: "For an owner-occupier buying essentials, roughly KES 200,000 to 400,000. For a unit being let furnished, KES 500,000 to 750,000 at an essential rental specification, 750,000 to 1.15m at mid-premium and 1.15m to 1.8m at premium. The rental figures are higher because a let unit needs three sets of linen rather than one, blackout window treatments, a workspace, a spare of everything and a mattress chosen for durability.",
    },
    {
      q: "Why does furnishing to let cost more than furnishing to live in?",
      a: "Because the specification is different, not because anyone is being overcharged. A home needs one set of bed linen, a let needs three so a turnover never waits on a wash. A home can have a mattress you personally like, a let needs one that survives four hundred strangers a year. Add blackout curtains, a desk guests filter on, a spare of every breakable item, and safety equipment, and the same apartment costs about half again.",
    },
    {
      q: "What percentage of the purchase price should I budget for furnishing?",
      a: "Ten to fifteen percent of the unit purchase price is a workable planning figure for a full furnish, rising towards twenty percent for a small unit because the fixed cost of a kitchen and a bathroom does not shrink with floor area. Treat it as a planning number only. The real budget comes from a line by line list against the specific unit, since what the developer has already fitted changes it substantially.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        Furnishing a Nairobi apartment in 2026 runs from about KES 200,000
        for an owner-occupier minimum to KES 5m and beyond at the premium
        end. The spread is wide because two separate things drive it: how
        big the unit is, and what standard you are furnishing it to. They
        are worth pricing separately.
      </Lede>

      <KeySummary
        question="How much does it cost to furnish an apartment in Nairobi in 2026?"
        answer="Furnishing a Nairobi apartment in 2026 costs from about KES 200,000 to over KES 5m, and the range is wide because unit size and specification tier are separate variables. For an owner-occupier buying essentials, a one to two bedroom comes in at KES 200,000 to 600,000, a larger or better specified unit at 600,000 to 1.5m, and a premium three or four bedroom at 1.5m to 5m and above. Furnishing the same apartment to let costs roughly half again, because a let unit needs three sets of linen rather than one, blackout window treatments, a desk, safety equipment, a spare of every breakable item and a mattress chosen to survive four hundred strangers a year. On rental grade specifications, expect KES 400,000 to 1.3m for a studio, 500,000 to 1.8m for a one bedroom, 700,000 to 2.5m for a two bedroom and 950,000 to 3.5m for a three bedroom, moving from essential through mid-premium to premium. The largest single line in any of these budgets is the bed, ahead of the sofa, every time."
        facts={[
          { label: "Owner-occupier, 1 to 2 bed", value: "KES 200,000 to 600,000" },
          { label: "Rental grade studio", value: "KES 400,000 to 1.3m" },
          { label: "Rental grade one bed", value: "KES 500,000 to 1.8m" },
          { label: "Rental grade two bed", value: "KES 700,000 to 2.5m" },
          { label: "Premium three to four bed", value: "KES 1.5m to 5m+" },
          { label: "Biggest single line", value: "The bed, then the sofa" },
          { label: "Contingency to hold back", value: "10% to 15%" },
        ]}
      />

      <H2 id="two-variables">Two variables, not one</H2>

      <P>
        Most furnishing budgets go wrong at the first step, by treating
        cost as a function of bedroom count. It is not. A premium one
        bedroom costs more than a basic three bedroom, and the two
        questions have to be answered separately: how many rooms are you
        filling, and to what standard.
      </P>

      <P>
        The second question is the one that moves the number. Between an
        essential specification and a premium one, the same apartment can
        treble. And the gap is concentrated in six items: the mattress, the
        sofa, the dining set, the appliances, the window treatments and the
        soft furnishings. Everything else, the kettle and the chopping
        board and the bin, costs roughly the same whatever tier you are
        buying.
      </P>

      <Pullquote>
        Spend where the guest&rsquo;s body touches the property and save
        where it does not. The bed, the sofa, the shower and the wifi are
        the four lines nobody forgives.
      </Pullquote>

      <H2 id="owner-occupier">Furnishing somewhere to live</H2>

      <P>
        These are the numbers for a home. One set of linen, your own taste,
        and no requirement that anything survive a stranger.
      </P>

      <H3 id="mid-market">Essential, one to two bed: KES 200,000 to 600,000</H3>

      <UL>
        <LI>Bed and mattress: KES 30,000 to 70,000</LI>
        <LI>Sofa set, three plus two or L-shape: KES 40,000 to 100,000</LI>
        <LI>Dining set, four to six seater: KES 25,000 to 60,000</LI>
        <LI>Cooker, gas or electric: KES 25,000 to 60,000</LI>
        <LI>Fridge, 200 to 350 litre: KES 35,000 to 75,000</LI>
        <LI>Washing machine: KES 30,000 to 60,000</LI>
        <LI>Television, 43 to 55 inch: KES 35,000 to 80,000</LI>
        <LI>Curtains, kitchenware, linens, basics: KES 30,000 to 80,000</LI>
      </UL>

      <H3 id="mid-premium">Mid-premium, two to three bed: KES 600,000 to 1.5m</H3>

      <UL>
        <LI>Quality leather or fabric sofa set: KES 150,000 to 350,000</LI>
        <LI>Solid hardwood dining set: KES 80,000 to 200,000</LI>
        <LI>Quality king or queen bed and mattress: KES 100,000 to 250,000</LI>
        <LI>
          Built-in or quality wardrobes: KES 80,000 to 200,000 if not
          already fitted
        </LI>
        <LI>
          Mid-tier appliances, Bosch, Samsung or LG: KES 250,000 to 500,000
          in total
        </LI>
        <LI>
          Quality curtains or blinds: KES 50,000 to 150,000
        </LI>
        <LI>Soft furnishings, decor, art: KES 60,000 to 200,000</LI>
      </UL>

      <H3 id="premium">Premium, three to four bed: KES 1.5m to 5m and above</H3>

      <UL>
        <LI>Designer or imported furniture</LI>
        <LI>Premium appliances, Miele or the top of the Bosch range</LI>
        <LI>Custom joinery and built-ins</LI>
        <LI>Designer lighting</LI>
        <LI>Imported soft furnishings</LI>
        <LI>Art and accessories</LI>
        <LI>Smart home integration</LI>
      </UL>

      <H2 id="rental-grade">Furnishing somewhere to let</H2>

      <H3 id="why-more">Why does furnishing to let cost more than furnishing to live in?</H3>

      <P>
        Because the specification is different, not because anybody is
        being overcharged. A home needs one set of bed linen; a let needs
        three, so a turnover never waits on a wash. A home can have a
        mattress you personally like; a let needs one that survives four
        hundred strangers a year. Add blackout curtains, a desk the long
        stay guest filters on, a spare of every breakable item, smoke alarm
        and fire blanket, and a full kitchen rather than the pans you
        happen to own, and the same apartment costs about half again.
      </P>

      <P>
        It buys something back. A unit specified for letting photographs
        better, which decides how often it is seen at all, and it breaks
        less, which is the cost nobody budgets and every operator pays.
      </P>

      <H3 id="rental-ranges">Rental grade budgets by unit size</H3>

      <P>
        Essential through mid-premium to premium, for a unit being let
        furnished either on a long lease or nightly.
      </P>

      <UL>
        <LI>
          <strong>Studio:</strong> KES 400,000 to 600,000 essential,
          600,000 to 900,000 mid-premium, 900,000 to 1.3m premium
        </LI>
        <LI>
          <strong>One bedroom:</strong> KES 500,000 to 750,000 essential,
          750,000 to 1.15m mid-premium, 1.15m to 1.8m premium
        </LI>
        <LI>
          <strong>Two bedroom:</strong> KES 700,000 to 1m essential, 1m to
          1.55m mid-premium, 1.55m to 2.5m premium
        </LI>
        <LI>
          <strong>Three bedroom:</strong> KES 950,000 to 1.35m essential,
          1.35m to 2.1m mid-premium, 2.1m to 3.5m premium
        </LI>
      </UL>

      <H3 id="one-bed-cost">
        How much does it cost to furnish a one bedroom apartment in Nairobi?
      </H3>

      <P>
        Taking the single most asked version of the question: about KES
        200,000 to 400,000 if you are moving in yourself and buying
        essentials, and KES 500,000 to 1.8m if you are letting it,
        depending on tier. Most one bedrooms being let in Westlands,
        Kilimani or Riverside land between 750,000 and 1.15m, which is the
        mid-premium band and the tier the majority of owners should be
        buying.
      </P>

      <H2 id="payback">What the extra spend earns back</H2>

      <P>
        Furnishing is the only line in a letting budget that changes the
        rent, so it should be judged against the differential rather than
        against a cost table. The clearest published case in Nairobi is
        Riverside One Residency, where a two bedroom lets at roughly KES
        140,000 to 150,000 a month unfurnished and KES 270,000 to 290,000
        furnished. On a differential of about 130,000 a month, a 1.5m
        furnish is recovered inside a year.
      </P>

      <P>
        That is unusually strong and does not hold citywide. A 648,000
        annual differential against 1.2m of furnishing is a twenty two
        month payback, which is still worth doing but is a different
        decision. The case where it is not worth doing at all is set out
        in{" "}
        <Link
          href="/insights/furnished-or-unfurnished-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          furnished or unfurnished rental
        </Link>
        .
      </P>

      <H2 id="where">Where to buy in Nairobi</H2>

      <UL>
        <LI>
          <strong>Essential:</strong> the Mombasa Road furniture cluster,
          Mlolongo, Naivas Hyper, Carrefour
        </LI>
        <LI>
          <strong>Mid-premium:</strong> Yaya Centre, Karen Mall, Westgate,
          Westside
        </LI>
        <LI>
          <strong>Premium:</strong> Riverside designer showrooms, Westlands
          importers, custom Karen workshops
        </LI>
        <LI>
          <strong>Online:</strong> Jumia, Sky Garden and Kilimall at the
          essential end; showroom-led above it
        </LI>
        <LI>
          <strong>Imported to order:</strong> materially cheaper for the
          same quality, at eight to twelve weeks from order to install
          once sea freight and clearing are counted
        </LI>
      </UL>

      <H2 id="tips">Practical 2026 notes</H2>

      <UL>
        <LI>
          Custom joinery from a Karen workshop often beats imports on both
          price and quality for built-ins
        </LI>
        <LI>
          Check appliance warranty terms and whether the brand has local
          service, which matters more than the badge
        </LI>
        <LI>
          Plan delivery and assembly windows early, because many compounds
          restrict delivery hours and some require committee notice
        </LI>
        <LI>
          Standardise across units if you own more than one. One spare of
          everything then covers the lot
        </LI>
        <LI>
          Hold back 10 to 15 percent of the budget for what you forgot. You
          will need it
        </LI>
      </UL>

      <H3 id="percentage">
        What percentage of the purchase price should I budget for furnishing?
      </H3>

      <P>
        Ten to fifteen percent of the purchase price is a workable planning
        figure, rising towards twenty for a small unit, because the fixed
        cost of kitting out a kitchen and a bathroom does not shrink with
        floor area. Treat it as a planning number only. The real budget
        comes from a line by line list against the actual unit, since what
        the developer has already fitted moves it substantially.
      </P>

      <Callout title="The line that ends projects">
        Furnishing is roughly half the cost of launching a short let, not
        all of it. Permits, photography, deposits and two or three months
        of working capital sit behind it, and running out at that point
        leaves a half furnished unit earning nothing. The full picture is
        in{" "}
        <Link
          href="/insights/airbnb-nairobi-startup-costs-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what it costs to launch a Nairobi Airbnb
        </Link>
        .
      </Callout>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We furnish apartments in Nairobi at{" "}
        <Link
          href="/furnishing"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          published fixed prices
        </Link>
        , from KES 700,000 for a short-let ready studio to KES 2.75m for a
        premium three bedroom, covering specification, sourcing, delivery,
        installation, snagging and photography. What is inside each price,
        what sits outside it, and the delivery time for each route are in{" "}
        <Link
          href="/insights/apartment-furnishing-packages-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our furnishing packages and prices
        </Link>
        . The furniture is yours outright on installation, with no monthly
        charge and nothing recovered out of booking revenue.
      </P>

      <P>
        Once a unit is furnished it can go onto nightly stays under{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb management
        </Link>{" "}
        or onto a lease under{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          full long-term management in Nairobi
        </Link>
        , and neither requires the other. The costs the developer does not
        mention are in{" "}
        <Link
          href="/insights/hidden-costs-nairobi-developer-doesnt-tell-you"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          hidden costs a Nairobi developer will not tell you
        </Link>
        .
      </P>
    </>
  );
}
