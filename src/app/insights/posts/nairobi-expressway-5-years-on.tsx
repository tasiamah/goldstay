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
  slug: "nairobi-expressway-5-years-on",
  title:
    "The Nairobi Expressway five years on: what it actually changed",
  description:
    "Five years after the Nairobi Expressway opened, the picture is clearer than the hype that surrounded it. Here is the honest 2026 audit of what the expressway actually changed for property values, suburb access, commuter behaviour and the longer term shape of the city.",
  publishedAt: "2024-09-15",
  readingMinutes: 6,
  author: authors.research,
  tags: [
    "Nairobi",
    "Expressway",
    "Infrastructure",
    "Suburbs",
    "Property",
    "2026",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Nairobi Expressway five years on impact analysis 2026",
};

export default function Article() {
  return (
    <>
      <Lede>
        Five years after the Nairobi Expressway opened
        in 2022, the picture is clearer than the hype
        that surrounded it. Some of what was promised
        landed. Some of what was promised did not. The
        expressway has materially reshaped commuter
        behaviour and certain micro-markets, while
        leaving large parts of the city untouched.
        Here is the honest audit.
      </Lede>

      <H2 id="what-changed">What actually changed</H2>

      <UL>
        <LI>
          Mlolongo to Westlands cut from 60 to 90
          minutes (in peak hour) to 12 to 18 minutes
        </LI>
        <LI>
          Airport (JKIA) to Westlands cut from 50 to
          80 minutes to 15 to 20 minutes
        </LI>
        <LI>
          Mombasa Road property values benefited
          materially in the first 24 months
        </LI>
        <LI>
          Eastern corridor (Syokimau, Athi River,
          Mlolongo) became viable for white collar
          commuters working in Westlands and Upper
          Hill
        </LI>
        <LI>
          Westlands further consolidated as
          Nairobi&rsquo;s premium business district
        </LI>
      </UL>

      <H2 id="winners">The winners</H2>

      <H3 id="syokimau">Syokimau and Mlolongo</H3>

      <P>
        These suburbs went from quasi-dormitory towns
        to legitimate commuter neighbourhoods. Apartment
        prices have firmed materially. Rental demand
        has grown as professionals working in Westlands
        accept the expressway-assisted commute. Detail
        in our{" "}
        <Link
          href="/insights/nairobi-emerging-suburbs-ruiru-kitengela-syokimau-athi-river"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          emerging suburbs piece
        </Link>
        .
      </P>

      <H3 id="south-c">South C and South B</H3>

      <P>
        Direct expressway access put these suburbs
        within 10 to 15 minutes of Westlands and the
        airport. Modest premium realised on the older
        stock; new apartment supply has come into the
        market.
      </P>

      <H3 id="airport-corridor">Airport corridor commercial</H3>

      <P>
        Logistics and warehouse zones along Mombasa
        Road benefited from improved connectivity.
        Industrial land prices firmed.
      </P>

      <H3 id="westlands">Westlands itself</H3>

      <P>
        Westlands became more accessible to senior
        professionals living in eastern corridor
        suburbs. The expressway is part of the story
        behind Westlands continuing to consolidate as
        the city&rsquo;s premium business district.
      </P>

      <H2 id="losers">The relative losers</H2>

      <UL>
        <LI>
          Lavington and Kileleshwa lost some of their
          location premium to Westlands as the
          expressway brought eastern commuters within
          easy Westlands reach
        </LI>
        <LI>
          Some Mombasa Road business centres bypassed
          by people who used to stop and now drive
          past
        </LI>
        <LI>
          Surface road businesses along Mombasa Road
          (restaurants, fuel stations, retail) lost
          drive-by traffic
        </LI>
      </UL>

      <H2 id="not-changed">What did not change</H2>

      <UL>
        <LI>
          Internal Nairobi traffic at peak hour
          remains heavy. The expressway is a
          highway, not a city solution
        </LI>
        <LI>
          School-run traffic in residential
          neighbourhoods unchanged
        </LI>
        <LI>
          Western suburbs (Karen, Runda, Lower
          Kabete) saw little direct benefit
        </LI>
        <LI>
          Northern corridor (Thika Road, Kiambu
          Road) is on its own infrastructure cycle
        </LI>
        <LI>
          Toll cost remains a real barrier for
          mass-market commuters; the expressway is
          not equally accessible to all incomes
        </LI>
      </UL>

      <H2 id="property-impact">Property impact in numbers</H2>

      <UL>
        <LI>
          Syokimau apartment prices: roughly +25 to
          +40 percent over 5 years
        </LI>
        <LI>
          Mlolongo apartment prices: roughly +15 to
          +30 percent over 5 years
        </LI>
        <LI>
          South C apartment prices: roughly +10 to
          +20 percent over 5 years
        </LI>
        <LI>
          Westlands apartment prices: roughly +20 to
          +50 percent over 5 years (multiple drivers
          including but not limited to expressway)
        </LI>
        <LI>
          Karen and Runda standalone home prices:
          roughly flat to +10 percent over 5 years
          in real terms
        </LI>
      </UL>

      <H2 id="future">What the next five years look like</H2>

      <OL>
        <LI>
          Eastern corridor continues to develop as
          mainstream commuter geography
        </LI>
        <LI>
          Northern Bypass and Western Bypass spurs
          shift the property thesis north
        </LI>
        <LI>
          Tatu City and Konza on their own multi
          decade trajectory (covered in our{" "}
          <Link
            href="/insights/tatu-city-northlands-konza-investing-kenya-smart-cities"
            className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
          >
            smart cities piece
          </Link>
          )
        </LI>
        <LI>
          Mass transit (BRT, longer-term LRT)
          becomes the next chapter of Nairobi
          transport infrastructure
        </LI>
      </OL>

      <Callout title="The honest verdict">
        The expressway delivered on its core promise
        of compressing a specific commute. It did
        not solve Nairobi traffic or transform every
        property market it touched. The suburbs that
        benefited the most are the ones that paired
        the expressway with their own underlying
        story (housing supply, lifestyle, school
        catchment).
      </Callout>

      <Pullquote>
        Infrastructure rarely transforms property
        markets on its own. It accelerates the
        markets that were already going somewhere
        and quietly bypasses the ones that were not.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For sourcing clients we factor expressway
        access into suburb selection where it is
        relevant, while continuing to weight school
        catchment, security, build quality and
        compound governance more heavily. The
        expressway helps, but it is not a property
        thesis on its own.
      </P>

      <P>
        Read also our pieces on{" "}
        <Link
          href="/insights/nairobi-expressway-effect-on-property-prices"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          expressway effect on prices
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/adani-sgr-nairobi-property-impact-explained"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Adani and SGR impact
        </Link>
        .
      </P>
    </>
  );
}
