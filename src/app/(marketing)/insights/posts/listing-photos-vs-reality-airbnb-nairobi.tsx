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
  slug: "listing-photos-vs-reality-airbnb-nairobi",
  title: "The gap between your photos and your apartment is your rating",
  description:
    "Flattering photographs win the booking and lose the review. Why accuracy outperforms beauty in Nairobi short letting, what a wide angle lens really costs you, and how to photograph a small apartment honestly.",
  metaDescription:
    "Flattering photographs win the booking and lose the review. Why accuracy beats beauty in Nairobi short letting, and what a wide angle costs you.",
  publishedAt: "2026-09-05",
  readingMinutes: 6,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Photography", "Short Let", "Tips", "Reviews"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Listing photography and guest expectations in Nairobi",
};

export default function Article() {
  return (
    <>
      <Lede>
        A guest’s rating is not a measure of your apartment. It is a measure of
        the distance between your apartment and what they expected when they
        booked it, and you wrote the expectation yourself. This is why a plain,
        accurately photographed unit often outrates a beautiful one that was
        shot to look larger than it is.
      </Lede>

      <H2 id="wide">What a wide angle lens actually costs</H2>

      <P>
        Very wide photography is standard in property listings and it is quietly
        destructive for short lets, because unlike a buyer, your guest never
        views before committing. They arrive already paid.
      </P>

      <UL>
        <LI>
          <strong>The room is smaller than they expected,</strong> and that
          disappointment lands in the first thirty seconds
        </LI>
        <LI>
          <strong>They feel misled rather than mistaken,</strong> which is a
          different and more damaging emotion
        </LI>
        <LI>
          <strong>Every other flaw is now read as concealment.</strong> Trust
          gone at the door does not come back over the stay
        </LI>
        <LI>
          <strong>It shows up in accuracy scores specifically,</strong> which
          platforms weight and which are hard to recover
        </LI>
      </UL>

      <P>
        Shoot from the corner at a normal focal length, at roughly eye height.
        The room looks like the room. That is the objective.
      </P>

      <Pullquote>
        Your rating measures the distance between the apartment and the
        expectation you created. You control both ends of that gap, and only one
        of them is expensive to change.
      </Pullquote>

      <H2 id="show">Show the whole apartment, including the dull parts</H2>

      <UL>
        <LI>
          <strong>Every room,</strong> including the small second bedroom, the
          kitchen from the doorway and each bathroom in full
        </LI>
        <LI>
          <strong>The actual view from the window,</strong> not a crop that
          excludes the building opposite. Guests find out
        </LI>
        <LI>
          <strong>The building entrance and the parking,</strong> which also
          helps them find it on arrival
        </LI>
        <LI>
          <strong>The workspace,</strong> photographed as a workspace, because
          it is a booking filter for the best paying guests. See{" "}
          <Link
            href="/insights/wifi-speed-airbnb-nairobi-what-guests-expect"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            wifi and workspaces
          </Link>
        </LI>
        <LI>
          <strong>A floor plan or dimensions,</strong> which very few Nairobi
          listings provide and which removes the size question entirely
        </LI>
        <LI>
          <strong>Anything unusual about the layout,</strong> a bedroom without a
          window, a shower without a screen, stairs. Disclose in pictures, not
          in the fine print
        </LI>
      </UL>

      <H2 id="quality">Accurate does not mean unflattering</H2>

      <P>
        Honesty is about geometry and inclusion, not about lighting. Take the
        best possible photograph of the apartment as it truly is.
      </P>

      <UL>
        <LI>
          <strong>Daylight, mid morning,</strong> curtains open, all lamps on to
          balance the shadows
        </LI>
        <LI>
          <strong>Straight verticals.</strong> Tilted walls make a space feel
          unstable and amateurish
        </LI>
        <LI>
          <strong>Styled to the standard a guest will find,</strong> which means
          the styling has to be reproducible at every turnover
        </LI>
        <LI>
          <strong>Clear surfaces,</strong> no personal items, no cleaning
          products, no visible cables
        </LI>
        <LI>
          <strong>Hire a professional once.</strong> It is a small one off cost
          against the revenue it influences over years, and it is the single
          highest return line in a launch budget
        </LI>
        <LI>
          <strong>Reshoot when the apartment changes.</strong> Photographs of
          furniture you replaced two years ago are an accuracy complaint waiting
          to happen
        </LI>
      </UL>

      <Callout title="Underpromise in the description too">
        Photographs are only half the expectation. “Ten minutes from Westlands”
        at 8am is not ten minutes and your guest will time it. Describe
        distances honestly, name the noise you cannot fix, and say what the
        apartment is not. Every unpleasant surprise you remove in advance is a
        review you do not have to answer. See{" "}
        <Link
          href="/insights/noise-and-blackout-curtains-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          light and noise
        </Link>
        .
      </Callout>

      <H2 id="order">Order them the way a guest walks in</H2>

      <UL>
        <LI>
          Lead with your strongest genuine image, usually the living space or a
          real view
        </LI>
        <LI>
          Then follow the actual route through the apartment, which helps guests
          build a mental map and reduces confusion on arrival
        </LI>
        <LI>
          Bedrooms before bathrooms, then kitchen, then building and
          surroundings
        </LI>
        <LI>
          Caption them. A one line caption is free and it is where you say the
          honest thing that a photograph cannot
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We shoot at a normal focal length rather than the widest available,
        photograph every room including the unflattering ones, and style to a
        standard that the turnover can actually reproduce. Where a unit has a
        real drawback, it is in the photographs and in the description, because
        the alternative is finding it in the reviews.
      </P>

      <P>
        See what else is covered under{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Goldstay’s Airbnb management in Nairobi
        </Link>
        .
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/turnover-checklist-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the turnover checklist
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/airbnb-reviews-nairobi-getting-to-4-9"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to get from 4.6 to 4.9
        </Link>
        .
      </P>
    </>
  );
}
