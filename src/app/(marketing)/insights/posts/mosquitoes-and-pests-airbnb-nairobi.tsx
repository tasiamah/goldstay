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
  slug: "mosquitoes-and-pests-airbnb-nairobi",
  title: "One mosquito can cost you a five star review",
  description:
    "Nairobi's altitude makes it a mild pest environment, which is exactly why hosts ignore it and guests do not. Screens, ants, the rainy season, and how to handle a pest report without losing the review.",
  publishedAt: "2026-09-02",
  readingMinutes: 5,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Pest Control", "Short Let", "Tips", "Reviews"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Mosquito screens and pest control in a Nairobi Airbnb",
};

export default function Article() {
  return (
    <>
      <Lede>
        Nairobi sits high enough that mosquitoes are a nuisance rather than a
        health emergency, and local hosts internalise that so completely they
        stop noticing them. A guest lying awake at 3am listening to one does not
        care about altitude or malaria maps. They care that they cannot sleep,
        and they will say so.
      </Lede>

      <H2 id="screens">Fit screens and stop thinking about it</H2>

      <P>
        Everything else in this article is a workaround. Screens are the actual
        solution, they are cheap, and they are permanent.
      </P>

      <UL>
        <LI>
          <strong>Bedroom windows first,</strong> which is where the complaint
          comes from. Living room second
        </LI>
        <LI>
          <strong>Fitted properly, without gaps</strong> at the frame. A screen
          with a two centimetre gap is decoration
        </LI>
        <LI>
          <strong>On windows guests will actually open.</strong> A screen that
          prevents the window opening will be removed by somebody eventually
        </LI>
        <LI>
          <strong>Check the balcony door,</strong> which in most Nairobi
          apartments is the real entry point and is almost never screened
        </LI>
        <LI>
          <strong>Inspect them at each deep clean,</strong> because they tear
          and nobody reports it
        </LI>
      </UL>

      <P>
        Screens also mean guests can open windows at night, which solves the
        temperature complaint at the same time. See{" "}
        <Link
          href="/insights/airbnb-air-conditioning-nairobi-worth-it"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          whether air conditioning is worth it
        </Link>
        .
      </P>

      <Pullquote>
        Screens let guests sleep with the window open, which fixes the mosquito
        and the heat with one purchase.
      </Pullquote>

      <H2 id="rest">Everything else worth doing</H2>

      <UL>
        <LI>
          <strong>A plug in repellent</strong> in each bedroom, with spare
          refills in the drawer. Cheap and effective
        </LI>
        <LI>
          <strong>Repellent spray</strong> left for the guest, which reads as
          thoughtful rather than as a warning
        </LI>
        <LI>
          <strong>A net over the bed</strong> only where the property genuinely
          warrants it. In most of central Nairobi it looks alarming and suggests
          a problem the guest had not considered
        </LI>
        <LI>
          <strong>No standing water</strong> on the balcony, in plant saucers or
          in the drainage. This is the actual breeding source and it is usually
          on your own property
        </LI>
        <LI>
          <strong>A fan,</strong> which genuinely discourages them and helps with
          sleep anyway
        </LI>
      </UL>

      <H2 id="others">The other pests</H2>

      <UL>
        <LI>
          <strong>Ants,</strong> which appear in the kitchen with the rains
          regardless of how clean it is. Seal food containers, keep bait
          discreetly in the cupboards, and treat before the rainy season rather
          than during it
        </LI>
        <LI>
          <strong>Cockroaches,</strong> which are a building level problem more
          often than a unit level one and travel through shared drainage and
          risers. Treat your unit, and raise it with the building, because
          treating alone accomplishes little
        </LI>
        <LI>
          <strong>Drain flies,</strong> which appear in bathrooms that stand
          unused between guests. Running the taps and pouring water down the
          floor drain at each turnover prevents them entirely
        </LI>
        <LI>
          <strong>Rodents,</strong> rare in upper floor apartments and a serious
          matter on the ground floor and near bins. Escalate to the building
          immediately
        </LI>
        <LI>
          <strong>Bedbugs,</strong> uncommon and severe. Mattress and pillow
          protectors are the front line, and a suspected case means stopping
          bookings and treating properly rather than hoping. See{" "}
          <Link
            href="/insights/linen-and-towels-airbnb-nairobi"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            linen and protectors
          </Link>
        </LI>
      </UL>

      <Callout title="Treat between guests, on a schedule">
        Pest treatment in an occupied short let is disruptive and smells, so it
        has to happen in the gaps. Book it quarterly, and before the long rains,
        as a standing item rather than a reaction. An empty night used for
        treatment costs far less than a review that uses the word infestation.
      </Callout>

      <H2 id="report">Handling a report during a stay</H2>

      <P>
        How you respond in the first hour determines whether this appears in the
        review at all.
      </P>

      <UL>
        <LI>
          Reply immediately and take it seriously. Never explain that Nairobi is
          too high for malaria. It is true and it is not the point
        </LI>
        <LI>
          Send something the same day: repellent, a plug in, a fan, or a person
        </LI>
        <LI>
          For anything beyond a single mosquito, offer to move the guest or to
          treat properly. Ants in the kitchen is a treatment, not a conversation
        </LI>
        <LI>
          Follow up the next morning, unprompted. This is the step that turns
          the incident into a compliment about responsiveness
        </LI>
        <LI>
          Record it, and check the same unit at the next turnover. Pests repeat
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        Managed units get screens on bedroom windows and balcony doors as
        standard, quarterly treatment scheduled into empty nights, and drains
        run at every turnover. A pest report gets a same day response, because
        the review is decided by the response rather than by the insect.
      </P>

      <P>
        This is standard on every unit under{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          our Airbnb management
        </Link>
        , rather than something an owner has to ask for.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/how-clean-is-clean-enough-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how clean is clean enough
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/noise-and-blackout-curtains-airbnb-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          light and noise
        </Link>
        .
      </P>
    </>
  );
}
