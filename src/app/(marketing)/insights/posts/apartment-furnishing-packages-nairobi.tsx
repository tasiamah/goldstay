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

// The commercial counterpart to cost-furnish-nairobi-apartment-2026.
//
// That article answers "what does furnishing cost", which is research.
// This one answers "who will furnish it for me and what will they
// charge", which is a buying question, and until v1.64.0 the site only
// had the first. A reader ready to hand the job over does not want a
// shopping list of line items, they want a price and a delivery date.
//
// Prices are published rather than quoted on a call, for the same
// reason the management fee is: a firm that will not put a number on a
// page is asking to be compared on something other than price, and
// every owner knows it.
//
// The five FAQ questions are H3 rather than H2 because
// scripts/check-insights.mjs only collects H3 headings when it checks
// that FAQPage schema describes answers the page actually contains.
// Each sits under an H2 that frames it, so the hierarchy still holds.
export const meta: PostMeta = {
  slug: "apartment-furnishing-packages-nairobi",
  title:
    "Apartment furnishing packages in Nairobi: what they include and what they cost",
  metaTitle: "Nairobi apartment furnishing packages and prices",
  description:
    "What a furnishing package costs in Nairobi, from a KES 700,000 studio to a KES 2.75m three bedroom across two tiers, what sits inside the price and what does not, how long delivery takes, and the rent differential that decides whether the spend is worth making.",
  metaDescription:
    "Nairobi furnishing package prices: a studio from KES 700,000 to a three bedroom at KES 2.75m, what is included, and how long delivery takes.",
  publishedAt: "2026-09-13",
  readingMinutes: 9,
  author: authors.editors,
  tags: ["Furnishing", "Nairobi", "Short Let", "Apartment", "Pricing", "2026"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Nairobi apartment furnishing packages and prices 2026",
  faq: [
    {
      q: "What does a furnishing package cost in Nairobi?",
      a: "Goldstay publishes two tiers. Short-let ready is KES 700,000 for a studio, 950,000 for a one bedroom, 1.4m for a two bedroom and 1.95m for a three bedroom. Premium is 1m, 1.45m, 2m and 2.75m for the same sizes. Across the Nairobi market, rental grade furnishing runs roughly KES 400,000 to 1.3m for a studio and 700,000 to 2.5m for a two bedroom, depending on tier.",
    },
    {
      q: "How long does furnishing an apartment in Nairobi take?",
      a: "Two to three weeks where the package is filled from stock already in Nairobi, and eight to twelve weeks where it is imported to order, because sea freight from China runs thirty to forty five days before clearing and inland haulage. Owners taking handover in a building that is still finishing usually have that time anyway, and take the cheaper imported route.",
    },
    {
      q: "Does furnishing increase the rent enough to pay for itself?",
      a: "On Riverside Drive a two bedroom lets at KES 140,000 to 150,000 a month unfurnished against KES 270,000 to 290,000 furnished, a differential of about 130,000 a month, so a 1.4m furnish is recovered in roughly eleven months. The differential is smaller in suburbs where furnished demand is thinner, which is why the arithmetic has to be run on the specific building rather than assumed.",
    },
    {
      q: "Who owns the furniture after it is installed?",
      a: "The owner does, outright, from the day it is installed. It is a purchase rather than a lease or a rental, there is no monthly charge for it, nothing is recovered out of booking revenue, and it is not tied to keeping a management agreement in place. An owner who leaves keeps everything they paid for.",
    },
    {
      q: "What is not included in a furnishing package?",
      a: "Anything structural or fitted: built-in wardrobes, joinery, kitchen cabinetry, air conditioning installation, electrical or plumbing work, tiling, painting and window fitting. Also excluded are white goods already installed by the developer, the Tourism Regulatory Authority licence and county permits, and the working capital a short let needs for its first two or three months.",
    },
  ],
};

export default function Article() {
  return (
    <>
      <Lede>
        A furnishing package is a fixed price to take an empty Nairobi
        apartment from bare floor to let-ready: furniture, appliances,
        kitchen, linen, window treatments and styling, delivered,
        installed and photographed. This is what ours cost, what sits
        inside the price, what does not, and the one number that decides
        whether the spend is worth making.
      </Lede>

      <KeySummary
        question="What does an apartment furnishing package cost in Nairobi in 2026?"
        answer="A furnishing package in Nairobi is a fixed price to take an empty apartment to let-ready, covering furniture, appliances, kitchen equipment, linen, window treatments and styling, installed and photographed. Goldstay publishes two tiers. Short-let ready runs KES 700,000 for a studio, 950,000 for a one bedroom, 1.4m for a two bedroom and 1.95m for a three bedroom. Premium runs 1m, 1.45m, 2m and 2.75m for the same sizes, buying a better sofa, a hardwood dining set, a higher grade mattress and imported soft furnishings. Across the wider market, rental grade furnishing runs roughly KES 400,000 to 1.3m for a studio and 700,000 to 2.5m for a two bedroom depending on tier. The figure that decides the spend is not the cost but the rent differential: on Riverside Drive a two bedroom lets at KES 140,000 to 150,000 a month unfurnished against 270,000 to 290,000 furnished, so a furnish at this level is recovered in about eleven months."
        facts={[
          { label: "Studio", value: "KES 700,000 or 1m premium" },
          { label: "One bedroom", value: "KES 950,000 or 1.45m premium" },
          { label: "Two bedroom", value: "KES 1.4m or 2m premium" },
          { label: "Three bedroom", value: "KES 1.95m or 2.75m premium" },
          { label: "From Nairobi stock", value: "2 to 3 weeks" },
          { label: "Imported to order", value: "8 to 12 weeks" },
          { label: "Ownership", value: "Yours outright on install" },
        ]}
      />

      <H2 id="what-it-is">What a package is, and what it is not</H2>

      <P>
        A package is a single price for a finished result. You are not
        buying a sofa, you are buying an apartment a guest can walk into,
        and the difference matters because most of the work is not the
        furniture. It is deciding the specification, sourcing it,
        negotiating it, receiving it, assembling it, discovering the
        wardrobe arrived with a cracked panel, replacing that panel, and
        then photographing the result well enough to list.
      </P>

      <P>
        It is also not interior design. A designer is paid to express a
        point of view about your apartment. A rental specification is paid
        to survive four hundred strangers a year and to photograph well on
        a phone screen, which is a narrower brief and a cheaper one. Where
        the two disagree the rental brief wins, and an owner who wants the
        other answer is better served by a designer.
      </P>

      <Pullquote>
        Your taste is not the brief. Durability, neutrality and
        photographing well are the brief, and the three together cost less
        than taste does.
      </Pullquote>

      <H2 id="included">What the price covers</H2>

      <UL>
        <LI>
          Beds and mattresses, sized for the room rather than for the
          floor plan
        </LI>
        <LI>Sofa, occasional seating, coffee and side tables</LI>
        <LI>Dining table and chairs</LI>
        <LI>
          Fridge, cooker or hob and oven, microwave, washing machine,
          kettle, toaster
        </LI>
        <LI>
          Television, wall mount and the aerial or streaming setup behind
          it
        </LI>
        <LI>
          A complete kitchen: pans, knives, boards, crockery, glassware,
          cutlery, and the bottle and tin openers every short let is
          missing
        </LI>
        <LI>
          Three full sets of bed linen and towels per bed, not one, so a
          turnover never waits on a wash
        </LI>
        <LI>Blackout curtains or blinds, fitted to the existing rails</LI>
        <LI>
          A working desk and chair, because the long stay guest filters on
          it
        </LI>
        <LI>
          Lamps, mirrors, art, rugs and the styling that makes the photo
          set work
        </LI>
        <LI>Smoke alarm, fire blanket, first aid kit, door safe</LI>
        <LI>Delivery, assembly, installation and snagging</LI>
        <LI>Professional photography of the finished unit</LI>
      </UL>

      <H3 id="excluded">What is not included in a furnishing package?</H3>

      <P>
        Everything structural or fitted, because it belongs to the
        building rather than to the furnishing: built-in wardrobes,
        joinery, kitchen cabinetry, air conditioning installation,
        electrical and plumbing work, tiling, painting and window fitting.
        Where a unit needs any of it we quote it separately rather than
        quietly thinning the furniture budget to pay for it.
      </P>

      <P>
        Also outside the price: white goods the developer has already
        installed, which we work around; the Tourism Regulatory Authority
        licence and county permits; and the working capital a short let
        needs for its first two or three months. That last one ends more
        launches than any other line, and it is set out in{" "}
        <Link
          href="/insights/airbnb-nairobi-startup-costs-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the full startup cost of a Nairobi short let
        </Link>
        .
      </P>

      <H2 id="tiers">The two tiers, and what separates them</H2>

      <P>
        The gap between the tiers is concentrated in about six items. The
        kettle is the same kettle. Where the money goes is the mattress,
        the sofa, the dining set, the appliances, the window treatments
        and the soft furnishings, and those six decide both how the unit
        photographs and how long it lasts.
      </P>

      <H3 id="short-let-ready">Short-let ready</H3>

      <P>
        Built to earn from the first week and to survive it. Mid-range
        appliances from brands with local service, a good foam or pocket
        sprung mattress, a fabric sofa in a colour that forgives a spill,
        a hardwearing dining set, lined curtains. It photographs cleanly
        and it will not embarrass you at KES 8,000 to 12,000 a night,
        which covers most Nairobi suburbs. This is the right tier for the
        large majority of one and two bedroom units.
      </P>

      <H3 id="premium">Premium</H3>

      <P>
        For buildings where the nightly rate justifies it, which in
        practice means Westlands, Riverside, Kilimani and the top of
        Karen. A pocket sprung or hybrid mattress, a leather or heavy
        weave sofa, a solid hardwood dining set, upper tier appliances,
        quality blinds and real art. The difference in the photo set is
        visible, which is the point: at KES 15,000 a night and above your
        guest is comparing you with hotels, and the comparison is made on
        twelve photographs.
      </P>

      <H2 id="prices">Prices</H2>

      <H3 id="package-prices">What does a furnishing package cost in Nairobi?</H3>

      <P>
        Published rather than quoted on a call. These are fixed prices
        including delivery, installation and photography, for a unit with
        working power, water and existing curtain rails.
      </P>

      <UL>
        <LI>
          <strong>Studio:</strong> KES 700,000 short-let ready, KES
          1,000,000 premium
        </LI>
        <LI>
          <strong>One bedroom:</strong> KES 950,000 short-let ready, KES
          1,450,000 premium
        </LI>
        <LI>
          <strong>Two bedroom:</strong> KES 1,400,000 short-let ready, KES
          2,000,000 premium
        </LI>
        <LI>
          <strong>Three bedroom:</strong> KES 1,950,000 short-let ready,
          KES 2,750,000 premium
        </LI>
      </UL>

      <P>
        For context on where those sit, rental grade furnishing in Nairobi
        runs roughly KES 400,000 to 1.3m for a studio, 500,000 to 1.8m for
        a one bedroom and 700,000 to 2.5m for a two bedroom depending on
        tier. The line by line arithmetic behind those ranges, and the
        lower numbers that apply when you are furnishing somewhere to live
        rather than to let, are in{" "}
        <Link
          href="/insights/cost-furnish-nairobi-apartment-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the cost to furnish a Nairobi apartment
        </Link>
        .
      </P>

      <H2 id="ownership">Ownership</H2>

      <H3 id="who-owns-it">Who owns the furniture after it is installed?</H3>

      <P>
        You do, outright, from the day it goes in. It is a purchase, not a
        lease and not a rental. There is no monthly charge for it, nothing
        is recovered out of booking revenue, and it is not conditional on
        keeping a management agreement in place. If you leave us a month
        later you keep every item you paid for.
      </P>

      <P>
        Worth stating plainly, because the alternative arrangements exist
        in this market and are not always explained. An operator who
        furnishes a unit at their own cost and recoups it from your
        bookings has lent you money against your own apartment, and the
        repayment term is what quietly sets your notice period. Our
        management notice is thirty days with no exit fee, and a
        furnishing debt would make that promise untrue.
      </P>

      <H2 id="payback">The number that should decide it</H2>

      <H3 id="rent-differential">
        Does furnishing increase the rent enough to pay for itself?
      </H3>

      <P>
        This is specific to the building rather than general. Riverside
        One Residency on Riverside Drive is the clearest published case: a
        two bedroom lets at roughly KES 140,000 to 150,000 a month
        unfurnished, and the same apartment furnished at KES 270,000 to
        290,000. That is a differential of about 130,000 a month, so a
        short-let ready furnish at 1.4m is recovered in about eleven
        months and a premium one at 2m in fifteen.
      </P>

      <P>
        It does not hold everywhere. In suburbs where furnished demand is
        thinner the differential narrows sharply, and a 648,000 annual
        uplift against 1.2m of furnishing is a twenty two month payback,
        which is still sound but is a different decision. We run the sum on
        your actual building and tell you when the answer is no.
      </P>

      <Callout title="The question to ask before any of this">
        Whether your building permits short lets at all. A growing number
        of Nairobi blocks restrict or ban them in their house rules, the
        committee usually wins the argument in practice whatever the legal
        position, and the most expensive way to find out is after the
        furniture is installed. Get the answer in writing first. It takes
        an afternoon.
      </Callout>

      <H2 id="lead-time">Delivery</H2>

      <H3 id="how-long">How long does furnishing an apartment in Nairobi take?</H3>

      <P>
        Two to three weeks where we fill the package from stock already in
        Nairobi, and eight to twelve weeks where it is imported to order,
        because sea freight from China runs thirty to forty five days
        before clearing and inland haulage are added. The imported route
        is meaningfully cheaper and buys better furniture for the same
        money, so it is the default wherever the calendar allows.
      </P>

      <P>
        Most owners find the calendar allows. If you are taking handover in
        a building that is still finishing you already have those weeks,
        and the real comparison is not fast against slow but cheaper
        against sooner. We will tell you which route your date supports
        and price both.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We furnish apartments in Nairobi at the prices above, and we
        specify for revenue rather than for taste, because we are the ones
        who then have to run the unit and answer for the reviews. The
        specification is standardised across the portfolio deliberately:
        the same bed sizes mean one linen inventory, the same appliances
        mean one spare of everything, and a cleaner moving between units
        knows where things live.
      </P>

      <P>
        Furnishing is a separate agreement from management and neither
        requires the other. You can have a unit furnished and run it
        yourself, hand it to us under{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb management at 20 percent of revenue collected
        </Link>{" "}
        once it is ready, or put it on a long lease through{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          full long-term management in Nairobi
        </Link>
        . Whether furnishing is the right call for your unit at all is
        answered in{" "}
        <Link
          href="/insights/furnished-or-unfurnished-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          furnished or unfurnished
        </Link>
        , which sets out the cases where it is not.
      </P>

      <Callout title="Send us the unit and we will price it">
        Give us the address, the size and what the developer has already
        fitted, and we will come back with a fixed price for both tiers, a
        delivery date for each route, and the rent differential your
        specific building supports. If the numbers say leave it
        unfurnished, we will say so.
      </Callout>
    </>
  );
}
