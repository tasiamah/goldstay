import Link from "next/link";
import { authors, type PostMeta } from "./_shared";
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

export const meta: PostMeta = {
  slug: "spring-valley-vs-lavington-vs-riverside",
  title:
    "Spring Valley vs Lavington vs Riverside: which one suits you in 2026?",
  description:
    "Spring Valley, Lavington and Riverside are the three premium suburbs that returning diaspora professionals usually choose between. Each one has a distinct personality, price level, tenant pool and trade-off. Here is the honest 2026 comparison.",
  publishedAt: "2026-03-20",
  readingMinutes: 7,
  author: authors.editors,
  tags: [
    "Nairobi",
    "Spring Valley",
    "Lavington",
    "Riverside",
    "Premium",
    "Comparison",
  ],
  country: "kenya",
  heroImage: "/images/locations/nairobi.jpg",
  heroAlt:
    "Spring Valley vs Lavington vs Riverside Nairobi 2026 comparison",
};

export default function Article() {
  return (
    <>
      <Lede>
        Spring Valley, Lavington and Riverside are
        the three premium Nairobi suburbs returning
        diaspora professionals usually choose
        between. Each one has a distinct personality,
        price level, tenant pool and trade-off. Here
        is the honest 2026 comparison.
      </Lede>

      <H2 id="character">Character</H2>

      <H3 id="spring-valley">Spring Valley</H3>

      <P>
        Quiet, leafy, family. Larger plots than
        Lavington. Lower density. The aesthetic is
        country-suburb adjacent to Westlands.
        Walking access to Westlands amenity within
        10 minutes. Tenant pool weighted to senior
        corporate, embassy senior staff and
        established Nairobi families.
      </P>

      <H3 id="lavington">Lavington</H3>

      <P>
        Established premium family suburb. Mid
        density. Mix of standalone homes, compound
        townhouses and a small number of premium
        apartment buildings. Returning diaspora
        family default. Detail in our{" "}
        <Link
          href="/insights/lavington-complete-guide-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Lavington complete guide
        </Link>
        .
      </P>

      <H3 id="riverside">Riverside Drive</H3>

      <P>
        Small premium corridor anchored by embassy,
        UN and senior corporate tenant base. More
        apartment-led than the other two. Detail in
        our{" "}
        <Link
          href="/insights/riverside-drive-nairobi-old-money-corridor"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Riverside Drive piece
        </Link>
        .
      </P>

      <H2 id="prices">Price comparison</H2>

      <UL>
        <LI>
          <strong>Spring Valley standalone</strong>:
          KES 100m to KES 350m+
        </LI>
        <LI>
          <strong>Lavington standalone</strong>:
          KES 80m to KES 500m+
        </LI>
        <LI>
          <strong>Riverside premium apartment</strong>:
          KES 22m to KES 80m
        </LI>
        <LI>
          <strong>Spring Valley townhouse</strong>:
          KES 60m to KES 150m
        </LI>
        <LI>
          <strong>Lavington townhouse</strong>:
          KES 45m to KES 110m
        </LI>
        <LI>
          <strong>Riverside townhouse</strong>:
          KES 60m to KES 150m
        </LI>
      </UL>

      <H2 id="trade-offs">Trade-offs</H2>

      <H3 id="sv-trade">Spring Valley</H3>

      <UL>
        <LI>
          Pros: quiet, leafy, larger plots, walking
          distance to Westlands amenity, top
          tenant pool
        </LI>
        <LI>
          Cons: pricier than Lavington for similar
          size, school commute longer than Karen
          options, slightly less density of
          immediate amenity than Lavington
        </LI>
      </UL>

      <H3 id="lavington-trade">Lavington</H3>

      <UL>
        <LI>
          Pros: best schools-within-reach
          combination of the three, deepest
          tenant pool, best resale liquidity, most
          choice in supply
        </LI>
        <LI>
          Cons: densifying at edges, traffic to
          Westlands offices is variable
        </LI>
      </UL>

      <H3 id="riverside-trade">Riverside</H3>

      <UL>
        <LI>
          Pros: best embassy and UN tenant
          access, walking distance to Westlands
          and Hurlingham, smaller geography means
          easier life
        </LI>
        <LI>
          Cons: smallest of the three, fewer
          school options, mostly apartment supply,
          variable build quality on older mid-rise
          stock
        </LI>
      </UL>

      <H2 id="who-suits">Who suits which</H2>

      <UL>
        <LI>
          <strong>Pick Spring Valley</strong> if you
          want larger plot, quiet streets, walking
          access to Westlands, and you can pay the
          modest premium for a comparable size unit
        </LI>
        <LI>
          <strong>Pick Lavington</strong> if you
          want the broadest combination of school
          access, supply choice and resale
          liquidity at the family stage
        </LI>
        <LI>
          <strong>Pick Riverside</strong> if your
          tenant strategy is embassy or UN, or your
          unit type preference is premium
          apartment rather than family townhouse
        </LI>
      </UL>

      <Callout title="The selection rule">
        For most family buyers Lavington is the
        default. Spring Valley wins when the buyer
        wants larger plot at the same family
        stage. Riverside wins when the buyer’s
        priority is the embassy or UN tenant pool
        in apartment format.
      </Callout>

      <Pullquote>
        These three suburbs answer slightly
        different questions about how you want to
        live. Match the suburb to the question, not
        to the suburb’s reputation.
      </Pullquote>

      <H2 id="how-goldstay-handles-it">How Goldstay handles it</H2>

      <P>
        For premium clients we walk through the
        actual life implications of each suburb
        rather than reflecting back assumptions.
        Read also our pieces on{" "}
        <Link
          href="/insights/karen-vs-runda-honest-comparison"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          Karen vs Runda
        </Link>{" "}
        and{" "}
        <Link
          href="/insights/best-gated-communities-nairobi-2026"
          className="underline decoration-gold-500 underline-offset-4 hover:text-gold-700"
        >
          best gated communities
        </Link>
        .
      </P>
    </>
  );
}
