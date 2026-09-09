import Link from "next/link";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";
import { authors, type PostMeta } from "./_shared";

export const meta: PostMeta = {
  slug: "airbnb-vs-booking-com-nairobi",
  title:
    "Airbnb or Booking.com for a Nairobi short stay: which one actually pays more?",
  description:
    "The fees are now within a percentage point of each other, which makes the question owners ask first the least useful one. What separates the two platforms for a Nairobi unit is who the guest turns out to be, when the money arrives, and what happens the first time both calendars sell the same night.",
  metaTitle: "Airbnb vs Booking.com for Nairobi Hosts",
  metaDescription:
    "Airbnb charges hosts 15.5 percent, Booking.com around 15. What actually differs for a Nairobi short let, and the double-booking risk of running both.",
  publishedAt: "2026-09-09",
  readingMinutes: 9,
  author: authors.editors,
  tags: ["Airbnb", "Short Let", "Property Management", "Nairobi", "Kenya"],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Furnished Nairobi apartment listed for short stays",
};

export default function Article() {
  return (
    <>
      <Lede>
        Owners ask which platform is better, and expect an answer naming one of
        them. For a furnished unit in Nairobi the honest answer is almost
        always both, which sounds like a dodge until you look at what actually
        separates them. It is not the commission, because that gap has just
        closed. It is that the two platforms deliver different guests, pay you
        on different terms, and will cheerfully sell the same night twice if
        nobody has connected the calendars.
      </Lede>

      <H2 id="fees">The fees are now nearly identical, and that is new</H2>

      <P>
        Most of what is written about this comparison is out of date, because
        Airbnb changed how it charges hosts and a lot of advice still describes
        the old arrangement.
      </P>

      <UL>
        <LI>
          <strong>Airbnb</strong> now charges a single host-only service fee of
          15.5 percent, taken from the booking subtotal. Note what the
          subtotal includes: your nightly rate plus any cleaning fee, extra
          guest fee or pet fee you have set. Raise your cleaning fee and
          Airbnb&apos;s cut of it rises too. The guest sees no separate service
          fee at all.
        </LI>
        <LI>
          <strong>Booking.com</strong> charges a commission set when you
          register, which is typically around 15 percent, within a published
          range of roughly 10 to 25 percent depending on your market, property
          type and cancellation policy. The Preferred Partner programme, which
          buys better placement, adds about 2 to 3 points on top. If you use
          Booking.com to process the guest&apos;s card, that is roughly 1 to 3
          points more again.
        </LI>
      </UL>

      <P>
        On a 100 dollar booking with no add-ons, Airbnb leaves you about 84.50
        and Booking.com leaves you somewhere between 82 and 85. For practical
        purposes they are the same number. If you read somewhere that Airbnb
        is far cheaper for hosts, you were reading about the old split fee,
        where the host paid roughly 3 percent and the guest was charged the
        rest at checkout. That model is being retired.
      </P>

      <Callout title="If you are still on the old Airbnb split fee, check this week">
        Airbnb&apos;s published timetable puts the final cutoff for hosts
        outside the European Economic Area at 15 September 2026. Kenya is
        outside it. Listings connected to management software moved earlier, so
        if your unit is run through an agent it has almost certainly already
        switched. Do not take this paragraph&apos;s word for it: the rollout
        has moved in stages and the only reliable answer is the fee setting in
        your own account. It matters because the change is not cosmetic. If you
        were on the split fee, your take from an unchanged nightly rate falls
        by about twelve points, and the fix is to reprice rather than to
        absorb it.
      </Callout>

      <Pullquote>
        The fee question is the one owners ask first and now the least
        interesting difference between the two.
      </Pullquote>

      <H2 id="differences">What genuinely differs for a Nairobi unit</H2>

      <H3 id="guest">The guest is a different person</H3>

      <P>
        This is the difference that changes your revenue, and it barely gets
        mentioned. Booking.com&apos;s audience skews towards business travel:
        older, international, booking later, staying fewer nights, and far more
        likely to be travelling on someone else&apos;s budget. Airbnb skews
        leisure and longer stays, and in Nairobi it carries a particular
        segment nothing else reaches, which is diaspora Kenyans visiting family
        and wanting a whole apartment rather than a hotel room.
      </P>

      <P>
        In Nairobi specifically that split is worth money, because the
        organisational travel around Gigiri, the UN complex and the embassies
        is a real and steady market that mostly does not book on Airbnb. The
        shape of that demand is set out in{" "}
        <Link
          href="/insights/diplomatic-tenant-market-gigiri-rosslyn-runda-un-embassy-rent"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the diplomatic tenant market
        </Link>
        , and if it turns out to be most of your demand you may be running the
        wrong product altogether, which is the argument in{" "}
        <Link
          href="/insights/airbnb-vs-serviced-apartment-nairobi-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb versus serviced apartment
        </Link>
        .
      </P>

      <P>
        The practical upshot is unglamorous and useful: for most Nairobi units
        Airbnb fills weekends and long stays, and Booking.com fills the
        midweek gaps that were going to sit empty. Those are not competing
        bookings. That is the whole case for running both.
      </P>

      <H3 id="money">The money arrives on different terms</H3>

      <P>
        Airbnb collects from the guest and pays you roughly a day after
        check-in. You do nothing, and the amount that lands is the amount you
        were promised.
      </P>

      <P>
        Booking.com&apos;s default is close to the opposite. The guest pays the
        property rather than the platform, and Booking.com invoices you its
        commission monthly. That means you need a way to actually take the
        money, and you need to settle an invoice on time every month or the
        listing gets suspended. For an owner who lives in Manchester and
        visits Nairobi twice a year, this is the single most common way a
        Booking.com listing quietly dies: not bad reviews, an unpaid
        commission invoice.
      </P>

      <H3 id="cancellations">Cancellations, and the gap between booked and stayed</H3>

      <P>
        A large share of Booking.com&apos;s demand arrives on free
        cancellation, because that is what the platform&apos;s audience expects
        and what its search results reward. Bookings therefore look better than
        they settle, and a calendar that appears full in October can thin out
        considerably by the time October arrives. Airbnb&apos;s cancellation
        policies are chosen by you and enforced by the platform, so a confirmed
        booking is closer to money.
      </P>

      <P>
        This has a direct consequence for pricing. If you set rates off gross
        bookings on Booking.com you will overestimate demand and underprice.
        How to think about that is in{" "}
        <Link
          href="/insights/airbnb-nairobi-pricing-strategy-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          pricing strategy for Nairobi
        </Link>
        .
      </P>

      <H3 id="verification">Guest verification, and who carries the risk</H3>

      <P>
        Airbnb verifies guest identity and shows you a review history from
        other hosts. Booking.com is lighter on both, which shifts risk onto
        you. In Nairobi the concrete version of this is the party let: a
        one-night booking on a Friday for two guests that arrives as fifteen.
        It is a solvable problem, with minimum stays, no same-day bookings and
        house rules that are actually enforced, but it is a bigger problem on
        the platform that tells you less about who is coming.
      </P>

      <H3 id="reviews">Reviews do not travel between platforms</H3>

      <P>
        You will build two reputations from zero, and neither counts on the
        other. Splitting your nights across two listings means both accumulate
        reviews at roughly half the rate, and the first three months on any
        platform are the ones where reviews matter most for placement. This is
        the one genuine argument for not launching on both at once: get an
        Airbnb listing ranking first, then add Booking.com to fill the midweek.
      </P>

      <H2 id="double-bookings">
        The real risk of running both is selling the same night twice
      </H2>

      <P>
        Two listings, two calendars, one bedroom. Nothing in Airbnb knows what
        Booking.com has just sold. The first time it happens you will discover
        that the cost is not the refund. Cancelling a confirmed guest carries a
        platform penalty, it damages your placement in search, and on Airbnb a
        host cancellation can leave a public note on the listing that every
        future guest reads.
      </P>

      <P>
        The free fix is an iCal link between the two calendars, and it is worth
        knowing exactly how much protection that buys. iCal is a file each
        platform fetches from the other on a polling interval measured in
        hours, not seconds. For a quiet cottage that books three weeks out it
        is genuinely fine. For a Kilimani one-bed in December, where two people
        can book the same Saturday forty minutes apart, it is not, and the
        owners who get burned are almost always the ones who were told iCal
        counted as syncing.
      </P>

      <P>
        A channel manager is the version that actually works, because both
        listings read from one calendar rather than copying each other on a
        delay. If you are running the unit yourself, this is the piece of
        software to buy before you add a second platform.
      </P>

      <H2 id="what-we-do">What we do with a unit, and what you see</H2>

      <P>
        We list on both, plus Vrbo where the unit suits it, with all of them
        reading from a single calendar through a channel manager. Airbnb
        generally carries the leisure and long stays, Booking.com takes
        corporate and midweek, and quotes for organisational bookings go out
        against an invoice directly, which neither platform charges commission
        on.
      </P>

      <P>
        The part worth knowing is what lands on your statement. Every booking
        records which channel it came from and what that channel charged, kept
        separate from our own fee. So a line reads: gross, the
        platform&apos;s commission, cleaning, our 20 percent, your net. You can
        see what Airbnb took and what Booking.com took, per booking, rather
        than a single blended number you have to trust.
      </P>

      <P>
        One thing we should be straight about, because it gets oversold
        elsewhere. We do not get a cheaper commission rate from either platform
        than you would get yourself. Nobody at this scale does. What the fee
        buys is the synced calendar, the pricing decisions, the person who
        reconciles the Booking.com invoice every month, and somebody in
        Nairobi when a guest is locked out at eleven at night. If a manager
        tells you they have negotiated a better platform rate for you, ask to
        see it on a statement.
      </P>

      <Callout title="Not sure which platforms your unit should be on?">
        Send us the unit, where it is and how it is furnished, and we will tell
        you which channels we would list it on and why, including the case for
        only using one. If the honest answer is that it earns more as a
        furnished long let with no platform at all, we will tell you that too,
        and it pays us less.
      </Callout>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/short-term-rental-management-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short-term rental management in Nairobi
        </Link>
        {", "}
        <Link
          href="/insights/airbnb-nairobi-occupancy-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what occupancy to actually expect
        </Link>
        {", "}
        <Link
          href="/insights/airbnb-tax-kenya-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how short-let income is taxed in Kenya
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/how-much-do-airbnb-managers-charge-kenya"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          what short-let management costs
        </Link>
        .
      </P>
    </>
  );
}
