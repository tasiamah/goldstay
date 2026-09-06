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
  slug: "airbnb-nairobi-insurance-damage-liability",
  title: "Insurance, damage and liability on a Nairobi short let",
  description:
    "Your landlord policy may not cover paying guests, and platform protection is narrower than most hosts assume. What actually covers what, how to document damage so a claim succeeds, and the risks worth insuring properly.",
  metaDescription:
    "Your landlord policy may not cover paying guests, and platform protection is narrower than most hosts assume.",
  publishedAt: "2026-08-18",
  readingMinutes: 8,
  author: authors.legal,
  tags: ["Airbnb", "Insurance", "Nairobi", "Short Let", "Risk", "Kenya"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Airbnb Nairobi insurance damage and liability",
};

export default function Article() {
  return (
    <>
      <Lede>
        Most Nairobi hosts are carrying two assumptions that do not survive
        contact with a claim: that their existing property insurance covers
        paying guests, and that the platform will make them whole if something
        goes wrong. Both are usually wrong, and the moment you find out is the
        worst possible moment to find out.
      </Lede>

      <Callout title="Scope">
        General information rather than advice on your policy. Insurance wording
        varies enormously between Kenyan insurers and every question below has
        to be answered against your own policy document. Ask your broker in
        writing and keep the answer.
      </Callout>

      <H2 id="policy">Your existing policy is probably the wrong policy</H2>

      <P>
        Residential property insurance is written on an assumption about
        occupancy. A policy sold for an owner occupied home, or for a home let
        to a long term tenant, is priced for that risk. Paying guests coming and
        going nightly is a commercial use, and commercial use is frequently
        excluded or requires disclosure.
      </P>

      <P>
        The specific questions to put to your broker, in writing:
      </P>

      <OL>
        <LI>
          Does this policy cover the property while it is let on a short stay
          basis to paying guests?
        </LI>
        <LI>
          Does it cover accidental damage caused by a guest, as opposed to a
          tenant?
        </LI>
        <LI>
          Does it cover theft by a guest, given that they were admitted
          lawfully? This is a common and important exclusion
        </LI>
        <LI>
          Is there public liability cover if a guest is injured in the property,
          and to what limit?
        </LI>
        <LI>
          Are contents and furnishings covered, at replacement value or
          indemnity?
        </LI>
        <LI>
          Is there loss of income cover if the unit becomes unlettable after an
          insured event?
        </LI>
        <LI>
          Does the cover survive periods when the property is unoccupied
          between guests, and for how long?
        </LI>
      </OL>

      <P>
        If the answer to the first question is no, you are uninsured for the
        activity you are actually conducting, and a declined claim is the
        cheapest way that ends.
      </P>

      <Pullquote>
        Not disclosing the short let use to keep the premium down does not save
        money. It converts an insurance policy into a receipt.
      </Pullquote>

      <H2 id="platform">What platform protection actually does</H2>

      <P>
        Airbnb and Booking.com both offer host protection, and it is genuinely
        useful. It is also narrower and more conditional than the marketing
        suggests, and it is not insurance you control.
      </P>

      <UL>
        <LI>
          <strong>It generally requires the booking to have been made and paid
          through the platform.</strong> An off platform arrangement typically
          voids it entirely, which is one of several reasons never to take a
          direct payment from a platform guest
        </LI>
        <LI>
          <strong>It is time limited.</strong> Claims must be raised within a
          short window after checkout, frequently before the next guest arrives.
          Miss it and there is no recourse
        </LI>
        <LI>
          <strong>It requires evidence.</strong> Photographs, receipts, a
          documented before and after. Assertion is not enough
        </LI>
        <LI>
          <strong>It excludes ordinary wear and tear,</strong> which is where
          most of your actual costs live
        </LI>
        <LI>
          <strong>It is not liability cover for every scenario,</strong> and it
          does not replace your own policy
        </LI>
        <LI>
          <strong>The decision is theirs.</strong> There is no independent
          adjuster and limited appeal
        </LI>
      </UL>

      <H2 id="documenting">Documenting so a claim actually succeeds</H2>

      <P>
        The difference between a paid claim and a refused one is almost always
        the records that existed before the damage, not the argument made
        afterwards.
      </P>

      <UL>
        <LI>
          <strong>A photographic inventory,</strong> taken at launch, of every
          room and every item of value, with model numbers where relevant
        </LI>
        <LI>
          <strong>Turnover photographs after every clean.</strong> This is the
          control that wins claims, because it establishes the condition the
          guest received the property in
        </LI>
        <LI>
          <strong>Purchase receipts kept somewhere retrievable,</strong> so
          replacement value can be evidenced rather than estimated
        </LI>
        <LI>
          <strong>Timestamps.</strong> Photographs with dates are evidence,
          photographs without them are opinions
        </LI>
        <LI>
          <strong>All correspondence on the platform,</strong> because it is the
          only record the platform will consider
        </LI>
        <LI>
          <strong>Report immediately,</strong> before the next guest checks in.
          Once another guest has been in the unit, causation is gone
        </LI>
      </UL>

      <H2 id="risks">The risks worth taking seriously</H2>

      <UL>
        <LI>
          <strong>Water damage.</strong> The most common and most expensive
          incident in Nairobi apartments, and the one most likely to become a
          liability to the flat below rather than a cost in your own
        </LI>
        <LI>
          <strong>Liability for guest injury.</strong> A wet floor, a loose
          balcony rail, a faulty socket, a badly lit stair. Low probability,
          uncapped consequence, and the reason public liability cover matters
          more than contents cover
        </LI>
        <LI>
          <strong>Fire.</strong> Guests cook unfamiliar kitchens. Smoke alarm,
          fire blanket, extinguisher, and a policy that covers the activity
        </LI>
        <LI>
          <strong>Theft of contents.</strong> Televisions and appliances, and
          check the exclusion for theft by someone lawfully admitted
        </LI>
        <LI>
          <strong>Loss of income</strong> while the unit is repaired, which for
          a short let is a real and immediate loss rather than a deferred one
        </LI>
        <LI>
          <strong>Building level liability.</strong> If your guest floods two
          floors, the committee will look to you and your policy needs to
          respond
        </LI>
      </UL>

      <Callout title="The deposit is not your protection">
        Security deposits on short lets are small, frequently waived by
        platforms, and slow to recover. Treat them as a behavioural deterrent
        rather than as cover. Real protection is an appropriate policy plus a
        documented inventory, and hosts who rely on the deposit are effectively
        self insuring without having decided to.
      </Callout>

      <H2 id="budget">Budget for wear rather than claiming for it</H2>

      <P>
        Most of what actually costs a short let host money is not insurable and
        should not be treated as a shock. Linen greys, glassware breaks, a
        kettle dies, the sofa takes a year of use in a year. That is the cost of
        the business.
      </P>

      <P>
        Provision for it monthly. Hosts who treat every replacement as an
        unexpected event both overestimate their profit and underinvest in the
        unit, which shows up in the reviews long before it shows up in the
        accounts.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We hold a photographic inventory for every unit and take turnover
        photographs after each clean, which is what makes a damage claim
        winnable. We keep guest communication on the platform for the same
        reason. Owners are responsible for their own insurance, and we tell them
        to confirm short stay use is covered before the first guest.
      </P>

      <P>
        Handing the operation over is the other option: here is{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how our Nairobi short-stay management works
        </Link>
        .
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/nairobi-property-insurance-2026-diaspora-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Nairobi property insurance for diaspora landlords
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/airbnb-guest-vetting-nairobi-house-rules"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          guest vetting and house rules
        </Link>
        .
      </P>
    </>
  );
}
