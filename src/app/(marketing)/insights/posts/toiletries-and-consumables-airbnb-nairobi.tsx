import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "toiletries-and-consumables-airbnb-nairobi",
  title: "Running out of toilet paper on day two is a self inflicted review",
  description:
    "Consumables are the cheapest thing in a short let and the most reliably underprovided. What to leave, how much, why hotel miniatures are the wrong answer, and what it actually costs per stay.",
  publishedAt: "2026-09-03",
  readingMinutes: 5,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Hospitality", "Short Let", "Tips", "Operations"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Toiletries and consumables in a Nairobi short let",
};

export default function Article() {
  return (
    <>
      <Lede>
        There is a category of Airbnb review that begins "the apartment was
        lovely, but" and then describes running out of toilet paper. It is
        entirely avoidable, it costs almost nothing to avoid, and it happens
        constantly because consumables are the one line hosts think of as a cost
        rather than as part of the product.
      </Lede>

      <H2 id="quantities">Leave more than the stay requires</H2>

      <P>
        The rule is simple: whatever you think is enough, leave roughly double,
        and never leave an amount that runs out exactly at checkout.
      </P>

      <UL>
        <LI>
          <strong>Toilet paper:</strong> two rolls per bathroom in place, plus a
          visible spare pack. Not one roll and a hopeful attitude
        </LI>
        <LI>
          <strong>Hand soap:</strong> full dispensers at every basin and in the
          kitchen
        </LI>
        <LI>
          <strong>Shower gel, shampoo and conditioner:</strong> full bottles.
          Conditioner is the one hosts skip and guests notice
        </LI>
        <LI>
          <strong>Washing up liquid, sponge and a cloth,</strong> plus dishwasher
          tablets if there is a machine
        </LI>
        <LI>
          <strong>Bin liners,</strong> in the cupboard, in the right size. A
          guest with no liner puts waste straight in the bin and it is your
          cleaner who deals with it
        </LI>
        <LI>
          <strong>Laundry detergent,</strong> essential on any stay over a week
          and a genuine differentiator for long stays
        </LI>
        <LI>
          <strong>Salt, pepper, oil, tea, coffee, sugar and long life
          milk.</strong> See{" "}
          <Link
            href="/insights/kettle-and-kitchen-basics-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            the kitchen basics that matter
          </Link>
        </LI>
      </UL>

      <Pullquote>
        Never leave an amount that runs out exactly at checkout. Guests do not
        experience precision as efficiency, they experience it as meanness.
      </Pullquote>

      <H2 id="format">Bottles, not miniatures</H2>

      <P>
        Hotel style miniatures feel like hospitality and are the wrong choice
        for a short let, where stays are longer and guests self cater.
      </P>

      <UL>
        <LI>
          <strong>Refillable wall dispensers or full bottles</strong> last a
          whole stay, cost less per guest, and generate far less waste
        </LI>
        <LI>
          <strong>They read as generous</strong> rather than rationed. A full
          bottle says take what you need
        </LI>
        <LI>
          <strong>Buy in bulk and decant,</strong> which is where the cost
          advantage comes from
        </LI>
        <LI>
          <strong>Use something that smells good.</strong> Guests remember
          scent, and the cheapest possible option is identifiable as such the
          moment it is used
        </LI>
        <LI>
          <strong>Keep it consistent across your units,</strong> which makes
          restocking a single repeat order. See{" "}
          <Link
            href="/insights/scaling-airbnb-nairobi-one-to-five-units"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            scaling to five units
          </Link>
        </LI>
      </UL>

      <H2 id="forgotten">The things guests forgot to pack</H2>

      <P>
        A small drawer of rescues costs very little and produces a
        disproportionate number of warm reviews, because it addresses somebody
        at the exact moment they are annoyed with themselves.
      </P>

      <UL>
        <LI>Toothbrush and toothpaste, spares</LI>
        <LI>A razor, and a small sewing kit</LI>
        <LI>Plasters and basic painkillers</LI>
        <LI>Common phone charging cables</LI>
        <LI>An umbrella by the door, which in the Nairobi rains is a gift</LI>
        <LI>A travel adaptor, for the guest who arrived without one</LI>
        <LI>Insect repellent. See{" "}
          <Link
            href="/insights/mosquitoes-and-pests-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            mosquitoes and pests
          </Link>
        </LI>
      </UL>

      <Callout title="Restock long stays rather than overloading the start">
        A guest staying a month does not need a month of everything on day one,
        and giving it to them means nobody visits until checkout. Plan a mid
        stay drop with fresh consumables and clean towels. It costs the same and
        it puts a person in the apartment while there is still time to fix
        whatever is quietly wrong.
      </Callout>

      <H2 id="cost">What it actually costs</H2>

      <P>
        A fully stocked Nairobi apartment consumes a small fraction of one
        night's rate per stay. Against that, a single consumables complaint
        knocks the rating that determines your placement in search for months.
        The arithmetic is not close.
      </P>

      <UL>
        <LI>
          Budget consumables per stay in your numbers rather than treating each
          purchase as an unwelcome surprise
        </LI>
        <LI>
          Buy bulk and hold a supply cupboard, so nobody is buying soap on the
          way to a turnover
        </LI>
        <LI>
          Put restocking on the turnover checklist as specific quantities, not
          as "check supplies"
        </LI>
        <LI>
          Track it. If one unit consumes far more than another, something is
          leaking or somebody is taking it
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Managed units are stocked to a fixed list with counted quantities at
        every turnover, refillable dispensers rather than miniatures, and a
        rescue drawer as standard. Consumables appear as a line in the owner
        statement, because they are part of the product rather than an overrun.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/welcome-basket-airbnb-nairobi-what-works"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what belongs in a welcome basket
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/how-clean-is-clean-enough-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how clean is clean enough
        </Link>
        .
      </P>
    </>
  );
}
