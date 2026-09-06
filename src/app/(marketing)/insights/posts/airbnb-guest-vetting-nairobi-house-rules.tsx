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
  slug: "airbnb-guest-vetting-nairobi-house-rules",
  title: "Guest vetting and house rules for a Nairobi short let",
  description:
    "How to screen short let guests in Nairobi without insulting the good ones, the specific signals that precede a party booking, and house rules that are actually enforceable rather than decorative.",
  publishedAt: "2026-08-13",
  readingMinutes: 8,
  author: authors.editors,
  tags: ["Airbnb", "Nairobi", "Guest Vetting", "Short Let", "House Rules", "Kenya"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Airbnb guest vetting and house rules Nairobi",
};

export default function Article() {
  return (
    <>
      <Lede>
        One bad booking can cost you a deposit, a weekend of repairs, your
        rating and your relationship with the building. In Nairobi the risk is
        concentrated and predictable: it is the local weekend party booking, and
        it announces itself clearly if you know what to look for.
      </Lede>

      <H2 id="risk">What you are actually screening for</H2>

      <P>
        Be clear about the risk, because vague suspicion makes you rude to good
        guests without protecting you from bad ones.
      </P>

      <UL>
        <LI>
          <strong>Parties.</strong> The main event. Noise, damage, extra
          occupants, and a complaint to the building management that becomes
          your problem permanently
        </LI>
        <LI>
          <strong>Unauthorised occupancy.</strong> Two booked, eight arrive.
          Wear, safety and a breach of your building's rules
        </LI>
        <LI>
          <strong>Subletting your booking.</strong> Rare and serious. Somebody
          books your unit and relists it
        </LI>
        <LI>
          <strong>Chargeback and payment fraud,</strong> mostly handled by the
          platform if you keep everything on it
        </LI>
        <LI>
          <strong>Ordinary carelessness,</strong> which is not screenable and
          should be insured and budgeted rather than feared
        </LI>
      </UL>

      <H2 id="signals">The signals that precede trouble</H2>

      <P>
        None of these on its own condemns a booking. Two or three together, on a
        weekend, is a pattern worth a conversation.
      </P>

      <OL>
        <LI>
          <strong>One or two nights over a Friday or Saturday,</strong> booked
          within a day or two of arrival
        </LI>
        <LI>
          <strong>A local booking.</strong> Someone who lives in Nairobi
          booking a Nairobi apartment for one night is not there to sleep, and
          this is the strongest single signal
        </LI>
        <LI>
          <strong>Guest count well below the unit's capacity,</strong> paired
          with questions about how many people are allowed
        </LI>
        <LI>
          <strong>No reviews, new account, no profile photograph, no
          verification</strong>
        </LI>
        <LI>
          <strong>Questions about noise, neighbours or how late the music can
          go</strong>
        </LI>
        <LI>
          <strong>Asking to communicate off platform,</strong> or to pay
          directly
        </LI>
        <LI>
          <strong>Vagueness about the purpose of the stay,</strong> where a
          normal guest volunteers it in a sentence
        </LI>
        <LI>
          <strong>Booking around a public holiday or a major event,</strong>
          when the demand is specifically for a venue
        </LI>
      </OL>

      <Callout title="The one question that resolves most of it">
        Ask warmly and directly: "Happy to have you. Can I just check who is
        staying and what brings you to Nairobi?" Genuine guests answer in a
        sentence and think nothing of it. Party bookers become evasive, annoyed
        or stop replying. The response tells you more than any filter setting,
        and it costs you nothing with the guests you want.
      </Callout>

      <H2 id="settings">Set the platform up to do the work</H2>

      <UL>
        <LI>
          <strong>Require verified identity.</strong> Removes a category of
          problem before you see it
        </LI>
        <LI>
          <strong>Set a two night minimum, and three over holidays.</strong> The
          single most effective anti party measure available, because a party
          booker will not take three nights
        </LI>
        <LI>
          <strong>Turn off instant book, or restrict it</strong> to guests with
          good history and recommendations
        </LI>
        <LI>
          <strong>State maximum occupancy clearly</strong> and price additional
          guests. It makes the number meaningful rather than aspirational
        </LI>
        <LI>
          <strong>Say no parties and no events in the house rules,</strong>
          because enforcement and platform support both depend on it being
          written
        </LI>
        <LI>
          <strong>Note the building's rules explicitly.</strong> Guests respect
          a compound with a manned gate and quiet hours when told in advance
        </LI>
      </UL>

      <Pullquote>
        A three night minimum over a public holiday weekend does more to protect
        your apartment than any amount of instinct about a guest's messages.
      </Pullquote>

      <H2 id="rules">House rules that actually work</H2>

      <P>
        Long rule lists are ignored. Short, specific and explained rules are
        followed, because the guest understands what the rule is protecting.
      </P>

      <UL>
        <LI>
          <strong>Six to eight rules maximum.</strong> Past that nobody reads
          them, including the ones that matter
        </LI>
        <LI>
          <strong>Give a reason.</strong> "Quiet after 10pm, the building has
          families and a manned gate" works. "No noise" does not
        </LI>
        <LI>
          <strong>Be specific and checkable.</strong> "Maximum four guests" beats
          "no large groups"
        </LI>
        <LI>
          <strong>Cover the things that actually cost you money:</strong>
          occupancy, parties, smoking, pets, and the electricity or water
          arrangement if there is one
        </LI>
        <LI>
          <strong>Say what you provide,</strong> not just what you forbid. Rules
          that read as generous get followed more than rules that read as
          suspicious
        </LI>
        <LI>
          <strong>Put them in the listing and repeat them in the check in
          message.</strong> Once is not communication
        </LI>
      </UL>

      <H2 id="declining">How to decline gracefully</H2>

      <P>
        You will occasionally need to turn a booking away. Do it politely, on
        the platform, and without accusation.
      </P>

      <P>
        A line like "Thanks for the enquiry. We have a three night minimum for
        this weekend and the building does not permit gatherings, so it may not
        be the right fit" declines clearly, cites a rule rather than a
        judgement, and leaves no room for a complaint. Never accuse a guest of
        planning a party. Cite the rule and let the rule do the work.
      </P>

      <H2 id="when-it-happens">When it happens anyway</H2>

      <OL>
        <LI>
          Document immediately: photographs, timestamps, any complaint from the
          building
        </LI>
        <LI>
          Keep everything on the platform. Off platform conversations weaken
          your position on a claim
        </LI>
        <LI>
          Raise the claim promptly and specifically, with receipts for
          replacement
        </LI>
        <LI>
          Speak to the building yourself before they hear it from a neighbour.
          Managing that relationship matters more than the deposit
        </LI>
        <LI>
          Then change one setting so it cannot recur the same way. Usually the
          minimum stay
        </LI>
      </OL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We screen on stay length, locality and account history, ask the one
        direct question, and decline the bookings that do not pass. We would
        rather lose a Friday than lose a building.
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/tenant-screening-nairobi-how-we-do-it"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how we screen long term tenants
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/airbnb-kilimani-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Kilimani host guide
        </Link>
        .
      </P>
    </>
  );
}
