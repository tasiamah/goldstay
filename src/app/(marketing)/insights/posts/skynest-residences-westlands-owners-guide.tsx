import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  KeySummary,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "skynest-residences-westlands-owners-guide",
  title: "Skynest Residences, Westlands: what your unit actually earns",
  metaTitle: "Skynest Residences Westlands: what your unit earns",
  description:
    "Skynest on Mkungu Close is 249 furnished apartments with some of the highest nightly rates in Nairobi, roughly two and a half times the city average daily rate AirDNA records. Why that does not automatically make it a good investment, why occupancy is the whole argument, and the choice every owner there has to make.",
  metaDescription:
    "Skynest nightly rates run about 2.5x Nairobi's average. Why occupancy, not the building, decides what you earn, and the four routes for your unit.",
  publishedAt: "2026-09-13",
  readingMinutes: 13,
  author: authors.editors,
  tags: [
    "Skynest Residences",
    "Westlands",
    "Short Stay",
    "Airbnb",
    "Nairobi",
    "Property Management",
    "Kenya",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Skynest Residences, Mkungu Close, Westlands, Nairobi, guide for apartment owners",
};

export default function Article() {
  return (
    <>
      <Lede>
        Skynest Residences on Mkungu Close is, on the numbers, one of the
        strongest short stay addresses in Nairobi. Agents quote its furnished
        two bedrooms at KES 15,000 to 16,900 a night, which is roughly two and
        a half times the average daily rate AirDNA records across the whole
        Nairobi market. If you own a unit there, that is the good news, and it
        is not the part that decides what you earn. The part that decides what
        you earn is how many of those nights actually sell, and on that measure
        the average Nairobi listing is nowhere near where a Skynest unit ought
        to be.
      </Lede>

      <Callout title="Where these numbers come from">
        Skynest and CityBlue&rsquo;s published material, agent listings for the
        building current to late 2025 and 2026, AirDNA&rsquo;s public Nairobi
        market page as refreshed in July 2026, other short stay data platforms
        where noted, and our own Westlands letting and occupancy data, as at
        September 2026. AirDNA publishes market level figures publicly and
        keeps building level reads behind its paid product, so the building
        specific reading here is ours, set against their market baseline. Rates
        and asking rents both move, and an asking rent is not an achieved one.
      </Callout>

      <KeySummary
        question="Is a Skynest Residences apartment in Westlands a good Airbnb investment?"
        answer="Skynest Residences on Mkungu Close in Westlands is a 249 unit furnished apartment building brought to market by PDM Holdings, in configurations from one bedroom through one and a half, two, three and four bedrooms, next door to the Movenpick and walking distance from Sarit Centre. Agents quote furnished two bedrooms at KES 15,000 to 16,900 a night, roughly USD 115 to 130, against the USD 47 average daily rate AirDNA records across 13,110 active Nairobi listings as at July 2026. So on rate, Skynest is comfortably in the top tier of the city. Occupancy is where the investment case is actually won or lost. AirDNA puts average Nairobi occupancy at 41 percent, while the top quartile of listings runs above 57 percent and the top decile above 78 percent, and our own Westlands figure is 65 to 75 percent across a full year on corporate, UN and NGO demand that holds midweek. Run the arithmetic and it matters enormously: a Skynest two bedroom at 41 percent occupancy earns less than simply letting the same unit unfurnished on a long lease at KES 100,000 to 150,000 a month, while the same unit at 65 to 70 percent beats that long let by a wide margin. The building gives you the rate. It does not give you the occupancy, and the gap between those two outcomes is the entire reason to care who manages it."
        facts={[
          { label: "Location", value: "Mkungu Close, Westlands" },
          { label: "Scale", value: "249 furnished apartments" },
          { label: "Unit mix", value: "1, 1.5, 2, 3 and 4 bed" },
          { label: "Nightly, 2 bed", value: "KES 15,000 to 16,900" },
          { label: "Nairobi average", value: "USD 47 a night, 41% occupancy" },
          { label: "Our Westlands occupancy", value: "65% to 75%" },
          { label: "Unfurnished long let", value: "KES 100k to 150k a month" },
        ]}
      />

      <H2 id="what-it-is">What the building is</H2>

      <UL>
        <LI>
          <strong>Location:</strong> Mkungu Close, Westlands, immediately next
          to the M&ouml;venpick. Walking distance to Sarit Centre, close to
          Westgate, and about fifteen minutes to Jomo Kenyatta International
          via the Expressway
        </LI>
        <LI>
          <strong>Scale and mix:</strong> 249 fully furnished apartments in
          one, one and a half, two, three and four bedroom configurations. The
          one and a half bed is unusual in Nairobi and useful, because it sells
          as a small two bed to a guest while costing less to furnish
        </LI>
        <LI>
          <strong>Origin:</strong> brought to market by PDM Holdings, and
          operated as an aparthotel under the CityBlue brand as Skynest
          Residences by CityBlue
        </LI>
        <LI>
          <strong>Amenities:</strong> a rooftop with resident lawn, heated
          infinity pool, gym, sauna, squash court and a games room, plus an on
          site caf&eacute;, restaurant and minimarket, 24 hour security and
          CCTV, high speed internet and backup power. There is also a rooftop
          events and wedding venue
        </LI>
        <LI>
          <strong>Nearby medical:</strong> MP Shah and the Aga Khan are both
          close, which matters more than it sounds and we come back to it
        </LI>
        <LI>
          <strong>Quoted rents:</strong> furnished two bedrooms at KES 259,000
          to 361,200 a month or KES 15,000 to 16,900 a night, and unfurnished
          two bedrooms from about KES 100,000 to 150,000 a month plus a service
          charge of around KES 17,000
        </LI>
      </UL>

      <H2 id="the-rate">The rate really is among the best in the city</H2>

      <P>
        It is worth being precise about this rather than just asserting it,
        because the gap is large enough to be interesting.
      </P>

      <P>
        AirDNA&rsquo;s public Nairobi page, refreshed in July 2026, records
        13,110 active short stay listings in the city running at 41 percent
        average occupancy and a USD 47 average daily rate, with the average
        active listing earning about USD 3,500 across the trailing twelve
        months. Other platforms land in a similar place on rate, between the
        mid forties and the mid fifties in dollars.
      </P>

      <P>
        Skynest&rsquo;s quoted KES 15,000 to 16,900 a night is roughly USD 115
        to 130 at the rates prevailing through 2026. That is about two and a
        half to two and three quarter times the city average. Some of that is
        the building and the furnishing standard, and a good deal of it is
        simply where it stands: platform data puts a meaningful premium on
        listings clustered around Westgate and Sarit Centre and on Westlands as
        a neighbourhood, and Skynest is inside that cluster rather than a
        ten minute drive from it. In Westlands specifically, a one bedroom
        within walking distance of Sarit behaves differently from an identical
        unit in the same postcode that needs a car.
      </P>

      <P>
        Our own reading of the submarket says the same thing from the other
        direction. Westlands is the strongest short stay market in Nairobi
        because it is the only part of the city where a guest can walk to
        offices, Sarit and Village Market without touching a car, and its
        demand is corporate, UN and NGO rather than tourist, so it holds
        midweek and through the low season. We put the area at USD 100 to 150 a
        night at 65 to 75 percent occupancy for a well presented unit. Skynest
        sits at the upper end of that rate band.
      </P>

      <H2 id="the-catch">Why the rate is not the investment case</H2>

      <P>
        Here is the part that owners at Skynest most often get wrong, and it is
        the reason this article exists.
      </P>

      <Pullquote>
        A high nightly rate on an empty calendar is a number in a brochure.
        AirDNA has the average Nairobi listing selling 41 percent of its
        nights. At that occupancy, a Skynest two bedroom earns less than the
        same flat let unfurnished on a boring twelve month lease.
      </Pullquote>

      <P>
        Take the arithmetic properly, on a furnished two bedroom at KES 15,000
        a night.
      </P>

      <UL>
        <LI>
          <strong>At 41 percent, the Nairobi average:</strong> about KES
          187,000 a month gross. Take off a 20 percent management fee and you
          have roughly KES 150,000, and out of that you still fund
          electricity, water, internet, cleaning, consumables, linen and the
          roughly KES 17,000 service charge. Call it KES 88,000 net
        </LI>
        <LI>
          <strong>At 57 percent, the Nairobi top quartile:</strong> about KES
          260,000 gross, and roughly KES 146,000 net on the same deductions
        </LI>
        <LI>
          <strong>At 70 percent, our Westlands figure:</strong> about KES
          319,000 gross, and roughly KES 193,000 net
        </LI>
        <LI>
          <strong>The unfurnished long let, for comparison:</strong> KES
          120,000 a month in the middle of the range, less a 10 percent
          management fee, with the tenant paying the utilities and the service
          charge. Call it KES 108,000 net, and it arrives whether or not
          anyone is travelling
        </LI>
      </UL>

      <P>
        So the honest conclusion is not that Skynest prints money. It is that
        at average Nairobi occupancy, short letting a Skynest unit
        underperforms an unfurnished lease, and at genuine Westlands occupancy
        it roughly doubles it. The whole investment case lives in the distance
        between 41 percent and 70 percent, and that distance is not a property
        of the building. Every owner in those 249 units has the same address,
        the same rooftop pool and the same walk to Sarit.
      </P>

      <P>
        Which is a more useful thing to know than a headline rate, because it
        tells you where to put your attention. AirDNA&rsquo;s own figures show
        Nairobi listings up 23.9 percent year on year while average daily rate
        slipped 3.8 percent. More supply, slightly softer pricing, and rising
        occupancy for the operators who are good at it. That is a market where
        the spread between a well run listing and an average one widens, not
        one where a good address carries you.
      </P>

      <H2 id="your-choice">The choice every Skynest owner has to make</H2>

      <P>
        Skynest is unusual in Nairobi in that the building is run as an
        aparthotel under the CityBlue brand while individual units are
        privately owned, and at least one independent operator markets its own
        Skynest apartments separately. So you have real options, and they are
        genuinely different businesses rather than variations on one.
      </P>

      <OL>
        <LI>
          <strong>Into the operator&rsquo;s programme.</strong> Simple,
          professional, and somebody else&rsquo;s problem. The trade is that
          you are in a pool: the guest relationship, the reviews and the rate
          decisions belong to the operator, you take what the pool distributes,
          and if you later want to leave you have built no listing, no review
          history and no direct guests of your own. Ask what the split is, how
          rate decisions get made, and what happens to your unit&rsquo;s
          performance record if you exit
        </LI>
        <LI>
          <strong>An independent manager, with the listing in your name.</strong>{" "}
          More upside and more accountability, because the reviews accrue to
          your unit and the calendar is visibly yours. This is what we do, and
          we say why the account question matters more than the fee rate in{" "}
          <Link
            href="/airbnb-management-companies-kenya"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            how to tell Airbnb management companies apart
          </Link>
        </LI>
        <LI>
          <strong>Run it yourself.</strong> Viable in a building like this,
          because the amenities, the security and the on site retail do a lot
          of the guest experience for you. It is a real job at 65 percent
          occupancy, and it is the difference between the top quartile and the
          average, so be honest about whether you will do it in a year
        </LI>
        <LI>
          <strong>Let it unfurnished on a long lease.</strong> The quiet
          option, around KES 100,000 to 150,000 a month plus service charge. It
          is the right answer if you do not want an operating business, and on
          the arithmetic above it beats a badly run short stay listing
        </LI>
      </OL>

      <Callout title="The demand stream most Skynest hosts ignore">
        MP Shah and the Aga Khan are both nearby, and Nairobi draws regional
        medical travel from across East and Central Africa. Those guests book
        longer than a business traveller, book at short notice, care about
        proximity and quiet rather than nightlife, and are markedly less price
        sensitive. A two bedroom that can take a patient plus family is well
        suited to it, and almost nobody in the building is writing a listing
        aimed at them. It is also counter cyclical to the corporate calendar,
        which is exactly what you want filling the weeks that business travel
        does not.
      </Callout>

      <H2 id="what-to-do">What to do if you own a unit there</H2>

      <OL>
        <LI>
          <strong>Find out your actual occupancy, not your rate.</strong> If
          you are in a pool, ask for your unit&rsquo;s occupancy and average
          achieved rate separately. A good rate and a thin calendar is the
          failure mode here and it is easy to miss when the money arrives in
          one line
        </LI>
        <LI>
          <strong>Confirm what your unit may and may not do.</strong> In a
          building operated under a hotel brand, establish in writing what a
          private owner is permitted to do independently, and whether entering
          the operator&rsquo;s programme restricts you later
        </LI>
        <LI>
          <strong>Photograph the rooftop and the walk.</strong> The heated
          infinity pool, the squash court and the games room are the reasons a
          guest picks this building over a cheaper flat in Kilimani, and being
          able to walk to Sarit is worth saying in the first line of the
          listing rather than the eighth
        </LI>
        <LI>
          <strong>Price the one and a half bed as a small two bed.</strong> If
          that is your layout, the guest search that finds it is the two
          bedroom search. How it is titled and configured decides which pool of
          demand ever sees it
        </LI>
        <LI>
          <strong>Do not compete with 248 neighbours on rate.</strong> You are
          in a building where many units are near identical. Discounting is
          matched within a week and resets the whole building. Differentiate on
          presentation and on the guest you are writing for
        </LI>
        <LI>
          <strong>Model both routes before you commit.</strong> Use your real
          service charge and your real furnishing cost. At Skynest the short
          stay usually wins, but only at occupancy you can actually achieve
        </LI>
      </OL>

      <P>
        The general versions of these are in{" "}
        <Link
          href="/insights/airbnb-vs-long-term-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          short let against long term rental
        </Link>
        ,{" "}
        <Link
          href="/insights/how-to-price-nairobi-rental"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          pricing a Nairobi rental
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/airbnb-westlands-2026-host-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Westlands host guide
        </Link>
        .
      </P>

      <H2 id="guests">If you are looking to stay at Skynest</H2>

      <P>
        A note for the other half of the people searching this building.
        Skynest is a straightforward recommendation for a business stay in
        Nairobi: you can walk to Sarit and to a good deal of Westlands, the
        Expressway puts the airport about fifteen minutes away, and the
        building carries backup power, a borehole standard of servicing and 24
        hour security, which removes most of the ordinary friction of a Nairobi
        stay.
      </P>

      <P>
        The thing worth knowing is that units in the building are sold both
        through the aparthotel operator and privately by individual owners, so
        the same building is available at more than one price. On a stay longer
        than a week or two it is worth asking a private owner directly, because
        that is where the rate has room to move. If you want us to tell you
        what is genuinely available,{" "}
        <Link
          href="/find-a-home"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          find a home
        </Link>{" "}
        is the place to start.
      </P>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We manage short stay and long let apartments in Westlands, and we would
        like to manage yours at Skynest. Twenty percent of revenue on a short
        stay, ten percent of rent collected on a long let, no setup fee and no
        exit fee. The listing stays on your own account, which means the review
        history and the direct guests you build are yours and they stay yours
        if you ever leave us.
      </P>

      <P>
        What we will actually do first is the sum in the middle of this
        article, with your unit, your floor, your layout and your real service
        charge. If your unit is in a pool already, we will tell you what we
        think we can add to its occupancy and what we cannot, and if the honest
        answer is that you should let it unfurnished on a long lease and stop
        thinking about it, we will say that and manage it at half the fee. We
        have written the same conclusion about{" "}
        <Link
          href="/insights/gtc-residences-pan-pacific-westlands-owners-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          GTC Residences
        </Link>
        , where the long let usually does win.
      </P>

      <P>
        Skynest is the more clearly short stay building of the two, which is
        why we are keen on it. If you own there,{" "}
        <Link
          href="/list-your-property"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          send us the unit
        </Link>{" "}
        with the floor and the layout and we will come back with both numbers
        side by side. What each service covers is on{" "}
        <Link
          href="/airbnb-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Airbnb management
        </Link>
        ,{" "}
        <Link
          href="/long-term-management"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          long term management
        </Link>{" "}
        and{" "}
        <Link
          href="/tenant-finding"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          tenant finding
        </Link>
        .
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/westlands-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Westlands guide
        </Link>
        ,{" "}
        <Link
          href="/insights/shangri-la-residency-westlands-letting-guide"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Shangri-La Residency
        </Link>{" "}
        for the opposite case, where a building of near identical units is
        struggling to let at all, and{" "}
        <Link
          href="/insights/choosing-airbnb-management-company-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          choosing an Airbnb management company
        </Link>
        .
      </P>
    </>
  );
}
