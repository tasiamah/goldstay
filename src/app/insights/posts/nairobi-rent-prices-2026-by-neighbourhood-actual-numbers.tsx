import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
import {
  Callout,
  H2,
  H3,
  LI,
  Lede,
  OL,
  P,
  Pullquote,
  UL,
} from "@/components/ArticleProse";

export const meta: PostMeta = {
  slug: "nairobi-rent-prices-2026-by-neighbourhood-actual-numbers",
  title:
    "Nairobi rent prices 2026 by neighbourhood: the actual numbers",
  description:
    "What does it actually cost to rent in Nairobi in 2026? This is the honest neighbourhood by neighbourhood guide to monthly rents for 1-bed, 2-bed, 3-bed and family homes, drawn from achieved rents on managed stock rather than asking prices on listings sites.",
  publishedAt: "2025-02-26",
  readingMinutes: 8,
  author: authors.research,
  tags: [
    "Nairobi",
    "Rent",
    "Prices",
    "Neighbourhoods",
    "2026",
    "Tenants",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi rent prices 2026 by neighbourhood, actual achieved rents 1 2 3 bed",
};

export default function Article() {
  return (
    <>
      <Lede>
        Asking rents on listing sites in Nairobi are
        consistently 10 to 25 percent above achieved
        rents. Anyone budgeting from listings ends up
        with the wrong number. This is the honest 2026
        rent guide by neighbourhood, drawn from achieved
        rents on managed stock rather than from the
        optimistic numbers on websites. Useful for
        tenants comparing offers, for landlords pricing
        properly, and for diaspora investors modelling
        yield.
      </Lede>

      <H2 id="premium">Premium suburbs</H2>

      <H3 id="karen-runda">Karen, Runda, Nyari, Kitisuru, Loresho</H3>

      <UL>
        <LI>
          3-bed townhouse compound: KES 220,000 to KES
          400,000 per month
        </LI>
        <LI>
          4-bed townhouse compound: KES 320,000 to KES
          550,000
        </LI>
        <LI>
          4-bed standalone home: KES 450,000 to KES
          900,000
        </LI>
        <LI>
          5-bed standalone home: KES 600,000 to KES
          1.4m
        </LI>
        <LI>
          Service charge added: KES 25,000 to KES 70,000
        </LI>
      </UL>

      <H3 id="lavington-kileleshwa">Lavington and Kileleshwa</H3>

      <UL>
        <LI>
          1-bed apartment: KES 75,000 to KES 110,000
        </LI>
        <LI>
          2-bed apartment: KES 100,000 to KES 175,000
        </LI>
        <LI>
          3-bed apartment: KES 150,000 to KES 280,000
        </LI>
        <LI>
          3-bed townhouse: KES 200,000 to KES 350,000
        </LI>
        <LI>
          4-bed townhouse: KES 280,000 to KES 480,000
        </LI>
      </UL>

      <H3 id="westlands-spring-valley">Westlands and Spring Valley</H3>

      <UL>
        <LI>
          1-bed apartment: KES 80,000 to KES 130,000
        </LI>
        <LI>
          2-bed apartment: KES 110,000 to KES 200,000
        </LI>
        <LI>
          3-bed apartment in premium tower: KES 175,000
          to KES 320,000
        </LI>
        <LI>
          3-bed townhouse: KES 220,000 to KES 380,000
        </LI>
      </UL>

      <H3 id="gigiri-rosslyn">Gigiri and Rosslyn</H3>

      <P>
        The diplomatic corridor pricing reflects the UN
        and embassy tenant base. Covered in our{" "}
        <Link
          href="/insights/diplomatic-tenant-market-gigiri-rosslyn-runda-un-embassy-rent"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          diplomatic tenant piece
        </Link>
        .
      </P>

      <UL>
        <LI>
          3-bed apartment: KES 200,000 to KES 350,000
        </LI>
        <LI>
          3-bed townhouse: KES 280,000 to KES 480,000
        </LI>
        <LI>
          4-bed standalone: KES 500,000 to KES 1m
        </LI>
      </UL>

      <H2 id="upper-mid">Upper mid suburbs</H2>

      <H3 id="riverside-parklands">Riverside and Parklands</H3>

      <UL>
        <LI>
          1-bed apartment: KES 55,000 to KES 90,000
        </LI>
        <LI>
          2-bed apartment: KES 80,000 to KES 140,000
        </LI>
        <LI>
          3-bed apartment: KES 120,000 to KES 220,000
        </LI>
      </UL>

      <H3 id="kilimani">Kilimani</H3>

      <UL>
        <LI>
          1-bed apartment: KES 50,000 to KES 85,000
        </LI>
        <LI>
          2-bed apartment: KES 75,000 to KES 130,000
        </LI>
        <LI>
          3-bed apartment: KES 110,000 to KES 200,000
        </LI>
      </UL>

      <H3 id="ruaka">Ruaka and Two Rivers corridor</H3>

      <UL>
        <LI>
          1-bed apartment: KES 35,000 to KES 60,000
        </LI>
        <LI>
          2-bed apartment: KES 55,000 to KES 95,000
        </LI>
        <LI>
          3-bed apartment in premium compound: KES
          90,000 to KES 160,000
        </LI>
      </UL>

      <H2 id="mid-market">Mid market</H2>

      <H3 id="south-bc">South B and South C</H3>

      <UL>
        <LI>
          1-bed apartment: KES 28,000 to KES 45,000
        </LI>
        <LI>
          2-bed apartment: KES 45,000 to KES 75,000
        </LI>
        <LI>
          3-bed apartment: KES 70,000 to KES 110,000
        </LI>
      </UL>

      <H3 id="kasarani">Kasarani, Roysambu, Mountain View</H3>

      <UL>
        <LI>
          1-bed apartment: KES 22,000 to KES 38,000
        </LI>
        <LI>
          2-bed apartment: KES 35,000 to KES 60,000
        </LI>
        <LI>
          3-bed apartment: KES 55,000 to KES 90,000
        </LI>
      </UL>

      <H3 id="syokimau">Syokimau, Mlolongo, Athi River</H3>

      <UL>
        <LI>
          1-bed apartment: KES 22,000 to KES 38,000
        </LI>
        <LI>
          2-bed apartment: KES 35,000 to KES 65,000
        </LI>
        <LI>
          3-bed apartment in premium compound near
          expressway: KES 60,000 to KES 110,000
        </LI>
      </UL>

      <H3 id="ruiru">Ruiru, Kitengela, Kahawa Sukari</H3>

      <UL>
        <LI>
          1-bed apartment: KES 18,000 to KES 32,000
        </LI>
        <LI>
          2-bed apartment: KES 30,000 to KES 55,000
        </LI>
        <LI>
          3-bed apartment: KES 50,000 to KES 85,000
        </LI>
      </UL>

      <H2 id="mass-market">Mass market</H2>

      <H3 id="eastlands">Donholm, Buruburu, Umoja, Embakasi</H3>

      <UL>
        <LI>
          1-bed apartment: KES 14,000 to KES 25,000
        </LI>
        <LI>
          2-bed apartment: KES 22,000 to KES 40,000
        </LI>
        <LI>
          3-bed apartment: KES 35,000 to KES 65,000
        </LI>
      </UL>

      <H3 id="kayole">Kayole, Komarock, Tena, Pipeline</H3>

      <UL>
        <LI>
          1-bed apartment: KES 9,000 to KES 18,000
        </LI>
        <LI>
          2-bed apartment: KES 15,000 to KES 28,000
        </LI>
        <LI>
          3-bed apartment: KES 25,000 to KES 45,000
        </LI>
      </UL>

      <H2 id="furnished-premium">The furnished premium</H2>

      <P>
        Fully furnished rentals across all neighbourhoods
        typically command 30 to 60 percent over the
        unfurnished equivalent. Covered in our{" "}
        <Link
          href="/insights/furnished-or-unfurnished-rental-nairobi"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          furnished vs unfurnished piece
        </Link>
        .
      </P>

      <H2 id="diplomatic-corporate">Diplomatic and corporate housing premium</H2>

      <P>
        Where the tenant is the UN, an embassy, an
        international NGO or a major corporate
        employer, rents at the premium end run 15 to 30
        percent above the equivalent local-market
        figure. The premium reflects the security spec,
        the immediate availability of housing, and the
        contractual reliability of the institutional
        tenant.
      </P>

      <H2 id="trends">Where rents have moved in 2024 to 2026</H2>

      <UL>
        <LI>
          Premium suburb rents recovered modestly in
          2024 as the UN and embassy rotation cycle
          completed and the diplomatic tenant pool
          stabilised
        </LI>
        <LI>
          The Nairobi expressway corridor (Westlands to
          Mlolongo) saw rents on premium expressway
          adjacent compounds rise 8 to 15 percent over
          the period
        </LI>
        <LI>
          Apartment oversupply in Kilimani and Kileleshwa
          pushed rents on lower quality stock down 5 to
          12 percent, while top-tier compounds held or
          rose
        </LI>
        <LI>
          The Tatu City school catchment created a 10
          to 20 percent premium on stock within easy
          reach of the international schools
        </LI>
        <LI>
          Eastlands rents tracked inflation closely with
          modest real growth on better managed compounds
        </LI>
      </UL>

      <H2 id="how-to-use">How to use these numbers</H2>

      <H3 id="tenants">If you are a tenant</H3>

      <P>
        Treat the lower end of each range as the
        achievable price for a unit that is not freshly
        renovated and not newly furnished. The middle of
        the range is the realistic price for a decent
        unit in an established compound. The upper end
        is for high spec, high amenity or new-build
        stock.
      </P>

      <H3 id="landlords">If you are a landlord</H3>

      <P>
        Price slightly below the achieved range to fill
        quickly, or at the achieved range to wait for
        the right tenant. Avoid pricing above the range
        unless you have specific reasons; the property
        will sit empty.
      </P>

      <H3 id="investors">If you are an investor</H3>

      <P>
        Yields work out to 6 to 9 percent net on premium
        suburbs, 7 to 11 percent on upper mid, 8 to 12
        percent on mid market, and 10 to 14 percent on
        mass market with materially higher operational
        intensity.
      </P>

      <Callout title="The two number rule">
        Use achieved rents as the benchmark, not asking
        rents. The gap between asking and achieved is
        the difference between disappointment and a
        property that lets in a fortnight. For tenants
        and landlords alike, the achieved number is the
        only number that matters.
      </Callout>

      <Pullquote>
        Nairobi rents in 2026 are predictable enough
        once you separate asking prices from achieved
        prices. Use the achieved number, price for the
        tenant pool you actually have, and the market
        works.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For our managed portfolio we benchmark rents
        every six months against the achieved figures
        across the suburbs above. For landlords pricing
        a new let we recommend on the basis of recent
        comparable lets in the specific compound, not on
        listings site asking prices. The result is a
        property that lets faster and stays let longer.
      </P>

      <P>
        Read also our pieces on{" "}
        <Link
          href="/insights/how-to-price-nairobi-rental"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          how to price a Nairobi rental
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/best-neighbourhoods-nairobi-rental-yield-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          best neighbourhoods for rental yield
        </Link>{" "}
        for the related strategic context.
      </P>
    </>
  );
}
