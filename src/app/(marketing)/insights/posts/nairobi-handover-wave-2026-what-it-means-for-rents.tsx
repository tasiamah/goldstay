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
  slug: "nairobi-handover-wave-2026-what-it-means-for-rents",
  title: "The 2026 handover wave: what all this new supply does to your rent",
  description:
    "A cluster of large Nairobi towers is completing across 2026 and 2027, concentrated in Westlands and the Riverside corridor. What that does to rents, voids and short let rates, and what existing landlords should do about it now.",
  publishedAt: "2026-08-06",
  readingMinutes: 8,
  author: authors.research,
  tags: [
    "Nairobi",
    "Westlands",
    "Oversupply",
    "Market",
    "Rent",
    "Handover",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt: "Nairobi 2026 handover wave and what it means for rents",
};

export default function Article() {
  return (
    <>
      <Lede>
        The towers that were sold off plan in 2023 and 2024 are finishing now.
        They are concentrated in a narrow band of the city, they are almost
        entirely one and two bedroom units, and a large share of them were
        bought by investors rather than occupiers. That combination has a
        predictable effect on rents, and landlords who already own in these
        corridors should be planning for it rather than discovering it.
      </Lede>

      <H2 id="shape">The shape of what is arriving</H2>

      <P>
        Three features of this wave matter more than the raw unit count.
      </P>

      <UL>
        <LI>
          <strong>It is geographically concentrated.</strong> Westlands, the
          Riverside corridor, Kilimani and Kileleshwa are absorbing most of it.
          Karen, Runda and the eastern estates are barely affected
        </LI>
        <LI>
          <strong>It is format concentrated.</strong> Overwhelmingly one and two
          bedroom apartments. Three beds, family houses and genuinely large
          units are not part of this wave, and that is where the scarcity now
          sits
        </LI>
        <LI>
          <strong>It is investor owned.</strong> When occupiers buy, the units
          disappear from the rental market. When investors buy, every single
          unit becomes a competing listing on handover
        </LI>
      </UL>

      <P>
        That last point is the one people miss. A 400 unit building sold to
        owner occupiers changes the rental market very little. The same building
        sold to investors adds 400 listings to the same suburb in the same
        quarter.
      </P>

      <Pullquote>
        A building sold to occupiers is new housing. A building sold to
        investors is new competition, and it all arrives on the same day.
      </Pullquote>

      <H2 id="effects">What it does, in order</H2>

      <OL>
        <LI>
          <strong>Voids lengthen first.</strong> Before rents visibly fall, the
          time to let goes up. This is the early signal and it is the one that
          shows in your own bank account before it shows in any market report
        </LI>
        <LI>
          <strong>Incentives appear next.</strong> A month rent free, service
          charge covered, furniture included. Headline rents hold while the
          effective rent drops, which is why published data lags reality
        </LI>
        <LI>
          <strong>Then headline rents soften,</strong> in the affected formats
          and corridors only
        </LI>
        <LI>
          <strong>Older stock discounts hardest.</strong> A ten year old one bed
          two streets away has to compete with a brand new one at a similar
          rent, and the only lever it has is price
        </LI>
        <LI>
          <strong>Quality separates.</strong> Buildings with reliable water,
          full power backup and working lifts hold rent. Buildings without them
          discount and keep discounting
        </LI>
        <LI>
          <strong>Absorption, eventually.</strong> Nairobi’s population and
          household formation are genuinely growing. The supply gets absorbed.
          The question is only how much rent you gave up while waiting
        </LI>
      </OL>

      <H2 id="short-let">The knock on effect for short lets</H2>

      <P>
        This is where it gets more interesting, and where a lot of the new
        investor supply is heading. When several hundred investor owners cannot
        find a long term tenant at their projected rent, a good number of them
        conclude that the answer is to furnish and put it on Airbnb.
      </P>

      <P>
        The result is a second wave of supply into the short let market a few
        months behind the handover, made up of hurriedly furnished one beds run
        by owners with no operating experience. Two things follow.
      </P>

      <UL>
        <LI>
          <strong>Downward pressure on nightly rates</strong> in the affected
          suburbs, particularly at the lower end where these units land
        </LI>
        <LI>
          <strong>A widening quality gap.</strong> These units are typically
          under furnished, badly photographed and poorly run, so they compete
          only on price and they collect mediocre reviews. Well operated
          listings pull further ahead precisely because the average gets worse
        </LI>
      </UL>

      <P>
        For a good operator this is closer to an opportunity than a threat, but
        only if you are genuinely in the top quartile. If you are an average
        listing, this wave is aimed directly at you. See{" "}
        <Link
          href="/insights/why-nairobi-airbnb-hosts-losing-money-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          why Nairobi Airbnb hosts are losing money
        </Link>
        .
      </P>

      <H2 id="what-to-do">What to do if you already own here</H2>

      <OL>
        <LI>
          <strong>Secure your tenant early.</strong> If your lease is up for
          renewal in the window when a big building near you completes,
          renewing at a slightly soft rent beats an empty three months. Certainty
          is worth paying for in a softening market
        </LI>
        <LI>
          <strong>Do the small capital work now.</strong> Paint, taps, a decent
          shower, working sockets. When your unit is being compared with a brand
          new one, tired finishes cost you more than they used to
        </LI>
        <LI>
          <strong>Consider furnishing.</strong> In a corridor about to fill with
          empty investor owned flats, furnished is the differentiator that lets
          first
        </LI>
        <LI>
          <strong>Fix water and power if you can influence it.</strong> This is
          the one thing new buildings usually do better, and the one thing that
          will decide who holds rent
        </LI>
        <LI>
          <strong>Stop using the brochure rent.</strong> Price against what is
          actually letting this month, not what your unit achieved in 2024
        </LI>
        <LI>
          <strong>Do not chase the market down.</strong> Cutting rent on a tired
          unit attracts the tenants who cost you the most. Fixing the unit and
          holding a fair rent beats a race to the bottom
        </LI>
      </OL>

      <Callout title="Where the scarcity actually is">
        Almost none of this wave is three bedroom stock, family houses, or
        properly large apartments. If you own one of those, the next two years
        are better for you than the last two, because the supply is going
        somewhere else entirely. Price accordingly rather than assuming the
        market is soft everywhere.
      </Callout>

      <H2 id="buying">What it means if you are buying</H2>

      <UL>
        <LI>
          Buying a one bed in a corridor about to absorb several hundred of them
          means accepting a soft first year. That can be fine, if you have
          priced it in
        </LI>
        <LI>
          Completed stock is worth more than it was relative to off plan. You
          can inspect it, let it immediately, and you are not carrying delivery
          risk into a softening rental market
        </LI>
        <LI>
          Developer yield projections written in 2023 assumed 2023 rents. Rebuild
          them
        </LI>
        <LI>
          The formats nobody is building are where the pricing power is
        </LI>
      </UL>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        We price against what is letting now rather than against last year’s
        comparables, and we tell owners in affected corridors to renew early and
        furnish rather than hold out for a rent that is not there. It is not the
        advice people want in month one and it is usually right by month six.
      </P>

      <P>
        We can take just this stage: here is{" "}
        <Link
          href="/tenant-finding"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how tenant finding in Nairobi works
        </Link>
        .
      </P>

      <P>
        Related reading:{" "}
        <Link
          href="/insights/emerald-springs-residences-review-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the Emerald Springs Residences review
        </Link>
        ,{" "}
        <Link
          href="/insights/nairobi-apartment-oversupply-2026-suburbs-to-avoid"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Nairobi apartment oversupply
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/nairobi-property-market-review-2026-h2"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          the H2 2026 market review
        </Link>
        .
      </P>
    </>
  );
}
