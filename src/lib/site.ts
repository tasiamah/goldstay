export const site = {
  name: "Goldstay",
  // The host every absolute URL we emit is built from: canonicals,
  // hreflang, JSON-LD @id values, breadcrumbs, referral links.
  //
  // This is .co.ke rather than .com because .co.ke is the only domain
  // we actually own and serve. goldstay.com is a parked for-sale lander
  // at buydomains.com and goldstay.com.gh does not resolve at all, so
  // naming either here published a canonical pointing at a domain that
  // is not ours. See `liveDomains` below.
  domain: "goldstay.co.ke",
  tagline: "Your Property. Professionally Managed.",
  description:
    "Premium property management in Nairobi and Accra for diaspora landlords. We handle everything. You receive monthly USD transfers.",
  // Display email shown on the neutral .com surface and any page that
  // renders without a city context. We intentionally use the .co.ke
  // address as the default until goldstay.com is purchased and its MX
  // is live, otherwise we'd be printing a dead address on the site.
  // Flip back to hello@goldstay.com once that domain is configured.
  email: "hello@goldstay.co.ke",
  parent: "A TADCO Company",
  socials: {
    instagram: "https://instagram.com/goldstay.ke",
    // A personal LinkedIn profile, not a Company Page. Fine to link to
    // from the footer, which is why it is still here; see sameAs below
    // for why it is not an identity claim.
    linkedin: "https://www.linkedin.com/in/goldstay-kenya",
  },
  // The subset of the profiles above that we are willing to assert, in
  // structured data, *are* the Goldstay organisation.
  //
  // Not the same list, and the difference matters. `sameAs` on the
  // RealEstateAgent node is how Google resolves scattered mentions
  // into one entity, so everything in it should be a profile that
  // genuinely represents the company. The LinkedIn URL is an /in/
  // profile, which is a Person, and claiming a Person is also the
  // Organization muddies the exact entity the rest of the schema
  // exists to sharpen. It is the same mistake the article bylines made
  // before v1.9.1, when 324 posts asserted the editorial desks were
  // human beings.
  //
  // A footer link is a human following a link. `sameAs` is a
  // machine-readable claim about identity. Only the second one has to
  // be true in that stricter sense.
  //
  // Add the LinkedIn back the day there is a /company/ page to point
  // at, and add the Google Business Profile here too once it is
  // verified, since that is the highest-value corroboration available.
  sameAs: ["https://instagram.com/goldstay.ke"],
  domains: {
    main: "goldstay.com",
    nairobi: "goldstay.co.ke",
    accra: "goldstay.com.gh",
  },
  // Which of the domains above are registered and serving traffic.
  //
  // The three-domain layout above is the plan, not the present: only
  // .co.ke is live. Everything that emits a cross-domain URL filters
  // through this list, because a canonical, an hreflang alternate or a
  // 308 aimed at a domain that does not resolve is worse than not
  // emitting it at all. Google reads a canonical as "the real version
  // of this page lives there", so pointing 338 Kenya articles at an
  // unowned .com told it to rank none of them here.
  //
  // Add a domain to this list the day its DNS and TLS are live, not the
  // day it is bought. Nothing else needs to change: hreflang, canonicals
  // and the city redirects all widen automatically.
  liveDomains: ["goldstay.co.ke"] as readonly string[],
  emails: {
    // Same rationale as `email` above: .co.ke is the only live mailbox
    // right now, so every city-agnostic surface routes to it. The
    // Ghana entry is kept as a placeholder so when the .com.gh domain
    // and inbox are provisioned, only this file needs to change.
    default: "hello@goldstay.co.ke",
    nairobi: "hello@goldstay.co.ke",
    accra: "hello@goldstay.com.gh",
  },
};

export type Office = {
  city: string;
  country: string;
  countryCode: string;
  building: string;
  street: string;
  locality: string;
  district?: string;
  postalCode: string;
  postalBox?: string;
  // Coordinates of the building, for LocalBusiness.geo. Optional so a
  // market can be listed before it has been surveyed, and omitted
  // rather than approximated when it has not — a pin in the wrong place
  // sends people to the wrong door.
  geo?: { latitude: number; longitude: number };
};

// Physical offices on display in the footer and JSON-LD. Only include a
// market here once we have a real, registered address in that city;
// phantom addresses are a trust killer.
export const offices: Partial<Record<"nairobi" | "accra", Office>> = {
  nairobi: {
    city: "Nairobi",
    country: "Kenya",
    countryCode: "KE",
    building: "Pinetree Plaza",
    street: "Kindaruma Road",
    locality: "Kilimani",
    district: "Westlands",
    postalCode: "00606",
    postalBox: "P.O. Box 1730, Sarit Centre",
    // Pinetree Plaza, from three independent listings that agree to
    // within about 8 metres. Note those listings all place the building
    // on Kaburu Drive off Ngong Road rather than Kindaruma Road; if the
    // street above is the registered postal address and Kaburu Drive is
    // the physical one, the Google Business Profile should carry
    // whichever Google's own map data uses, because a mismatch between
    // the profile and this page is read as two different businesses.
    geo: { latitude: -1.2985, longitude: 36.793 },
  },
};

// Slug helpers for neighbourhood URLs. Kept here next to the cities
// map so any place that lists neighbourhoods can build the same URL
// without re-deriving the slug rule.
export function neighbourhoodSlug(name: string) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export function findNeighbourhood(
  city: "nairobi" | "accra",
  slug: string,
): Neighbourhood | undefined {
  return cities[city].neighbourhoods.find(
    (n) => neighbourhoodSlug(n.name) === slug,
  );
}

// Areas that have earned a standalone page, i.e. those with enough
// area-specific substance to say something their siblings cannot.
// Drives generateStaticParams, the sitemap and the sibling links, so
// there is one answer to "does this area have a page" rather than
// three places to keep in step.
export function profiledNeighbourhoods(
  city: "nairobi" | "accra",
): Neighbourhood[] {
  // Annotated before filtering: the cities map is a const literal, so
  // its neighbourhood arrays infer as a union in which `profile` and
  // `shortLet` exist only on the members that set them.
  const all: Neighbourhood[] = cities[city].neighbourhoods;
  return all.filter((n) => n.profile);
}

// The rest. They keep their rent band and tenant mix on
// /<city>/areas, which is everything we can honestly say about them,
// instead of a URL that pads two facts into a thousand words.
export function unprofiledNeighbourhoods(
  city: "nairobi" | "accra",
): Neighbourhood[] {
  const all: Neighbourhood[] = cities[city].neighbourhoods;
  return all.filter((n) => !n.profile);
}

// A neighbourhood we are willing to publish a short-let service page
// for, which is to say one carrying real short-stay data.
export type ShortLetNeighbourhood = Neighbourhood & {
  shortLet: NonNullable<Neighbourhood["shortLet"]>;
};

export function hasShortLet(n: Neighbourhood): n is ShortLetNeighbourhood {
  return n.shortLet !== undefined;
}

// Drives generateStaticParams for the service-plus-location route.
// Neighbourhoods without short-stay data get no page at all rather than
// a templated one, so the route only ever serves URLs with something of
// their own to say.
export function shortLetNeighbourhoods(
  city: "nairobi" | "accra",
): ShortLetNeighbourhood[] {
  // Widened to Neighbourhood[] first on purpose. `cities` is `as const`,
  // so the element type is a union of literal shapes and Array.filter's
  // type-predicate overload cannot narrow to ShortLetNeighbourhood
  // against it.
  const all: readonly Neighbourhood[] = cities[city].neighbourhoods;
  return all.filter(hasShortLet);
}

export function findShortLetNeighbourhood(
  city: "nairobi" | "accra",
  slug: string,
): ShortLetNeighbourhood | undefined {
  const n = findNeighbourhood(city, slug);
  return n && hasShortLet(n) ? n : undefined;
}

// hreflang helper. Returns the alternates.languages map for a given
// path so each page declares the correct cross-domain equivalents.
//
// - Routes that exist on every domain (services, calculators, legal)
//   get all three language tags.
// - /nairobi-rooted routes are Kenya-relevant: en-KE points at the
//   equivalent URL on goldstay.co.ke, x-default at the .com URL.
// - /accra-rooted routes mirror that on goldstay.com.gh.
//
// Special case: the .co.ke root rewrites to /nairobi at the edge (see
// next.config.mjs rewrites), so the .co.ke alias of /nairobi is "/"
// and not "/nairobi". Same for .com.gh and /accra. Sub-paths like
// /nairobi/buy or /nairobi/kilimani keep their full prefix on every
// host because the rewrite is scoped to source "/".
//
// Without an explicit map per page Google picks one domain as canonical
// and treats the other two as duplicates, the opposite of what we want
// for local-pack visibility in Nairobi and Accra.
export function isLiveDomain(domain: string) {
  return site.liveDomains.includes(domain);
}

// The domain to fall back to whenever the one we'd naturally name is not
// live yet. Prefers the Kenya host, which is both the only live domain
// today and the one we want ranking in Nairobi.
export function fallbackDomain() {
  return isLiveDomain(site.domains.nairobi)
    ? site.domains.nairobi
    : (site.liveDomains[0] ?? site.domains.nairobi);
}

// Resolves an intended domain to one that actually serves. Used by every
// caller that would otherwise emit a URL on an unregistered domain.
export function liveDomainOr(domain: string) {
  return isLiveDomain(domain) ? domain : fallbackDomain();
}

// The only domain in production, when there is only one.
//
// Every per-request branch on the marketing surface exists to tell the
// country domains apart: which city to render, which market's copy to
// use, whether to redirect a city page to its own TLD. When exactly one
// domain is live, all of it has one answer, and reading the Host header
// to find it costs more than the answer is worth — `headers()` opts the
// whole marketing tree out of static generation, so no page can be
// cached at the CDN and every crawl pays a full server render.
//
// Returning a domain here lets those callers resolve at build time.
// Returning null puts them back on the request, which is what has to
// happen the moment a second domain goes live and the answer genuinely
// varies. See site.liveDomains: adding a domain there is what flips it.
//
// Trade-off, deliberate: while this returns a domain, preview and
// localhost render that domain's market rather than the neutral
// dual-market surface. Production is the case worth optimising for, and
// previews now match it.
export function soleLiveDomain(): string | null {
  return site.liveDomains.length === 1 ? (site.liveDomains[0] ?? null) : null;
}

// Stable identifiers for the structured-data graph.
//
// Every schema node that named Goldstay used to repeat an inline
// `Organization { name: "Goldstay" }` — the homepage, each Service page,
// all 350 articles. To Google that is a fresh, unlinked entity on every
// URL rather than one company with a lot of pages. These give the
// company and the site one @id each so the rest of the graph can point
// at them and the signals consolidate.
//
// Built from site.domain, not from the serving host: an @id is an
// identifier rather than a link, so it has to be the same string on
// every domain or it defeats the point.
export function orgId() {
  return `https://${site.domain}/#organization`;
}

export function websiteId() {
  return `https://${site.domain}/#website`;
}

// The brand mark, as an ImageObject.
//
// Google documents a publisher logo as required for article rich
// results, and the Article schema on all 350 posts was omitting it, so
// none of them was eligible. Dimensions are declared because they are
// known and Google prefers them stated over inferred.
export function logoObject() {
  return {
    "@type": "ImageObject",
    url: `https://${site.domain}/images/brand/email-logo.png`,
    width: 256,
    height: 256,
  };
}

// The one canonical URL for a city landing page.
//
// The country domain serves this page at its *root* — next.config.mjs
// rewrites "/" to /nairobi on .co.ke and to /accra on .com.gh — so the
// root and /{city} are the same page under two addresses. The root is
// the version to keep: it is what people type, link and share, and it
// carries the brand query. /{city} therefore canonicalises into it and
// 301s there (same file), and the sitemap lists only the root.
//
// Absolute and host-independent on purpose. A relative "/" would resolve
// against whichever host served the request, so the neutral .com copy of
// /nairobi would declare itself canonical instead of pointing home.
//
// While a country domain is dark the page only exists on the fallback
// host, so the canonical is the /{city} URL there — the address that
// actually resolves.
export function cityCanonical(city: "nairobi" | "accra") {
  const domain = city === "nairobi" ? site.domains.nairobi : site.domains.accra;
  return isLiveDomain(domain)
    ? `https://${domain}`
    : `https://${fallbackDomain()}/${city}`;
}

// Absolute origin for the host currently being served. Schema and
// breadcrumb URLs have to be absolute, and on a country domain they
// have to be that domain rather than the neutral one, or the markup
// describes a different site to the one the page was served from.
// Routed through liveDomainOr so this can never name a domain that does
// not resolve, the way every other URL helper here is.
export function baseUrlFor(domainCity: "nairobi" | "accra" | null) {
  const domain =
    domainCity === "nairobi"
      ? site.domains.nairobi
      : domainCity === "accra"
        ? site.domains.accra
        : site.domain;
  return `https://${liveDomainOr(domain)}`;
}

// The leading steps of a breadcrumb trail: the site root, then the city
// landing page.
//
// On a country domain those are the same URL — goldstay.co.ke IS the
// Nairobi page — so they collapse into one step. Emitting both would
// put two different names on one URL, which leaves the trail ambiguous
// about where the page actually sits and is the kind of thing Google
// drops the whole BreadcrumbList over.
export function cityTrail(
  city: "nairobi" | "accra",
  domainCity: "nairobi" | "accra" | null,
): { name: string; url: string }[] {
  const cityName = city === "nairobi" ? "Nairobi" : "Accra";
  const home = baseUrlFor(domainCity);
  const cityUrl = cityCanonical(city);
  return home === cityUrl
    ? [{ name: cityName, url: cityUrl }]
    : [
        { name: "Home", url: home },
        { name: cityName, url: cityUrl },
      ];
}

// hreflang helper. Drops any alternate whose domain is not live, so we
// never advertise a translation that 404s, and collapses duplicates
// (while .com.gh is dark, en-GH and en-KE would both resolve to .co.ke,
// and declaring the same URL under two language tags is a contradiction
// Google resolves by ignoring the whole cluster).
// `fallbackPath` is where this page lives on the fallback domain, which
// is not always the same path: the .co.ke root rewrites to /nairobi, so
// /nairobi's Kenya URL is "/" and not "/nairobi".
function alternatesFrom(
  entries: Array<[tag: string, domain: string, path: string]>,
  fallbackPath: string,
) {
  const out: Record<string, string> = {};
  const seen = new Set<string>();
  for (const [tag, domain, path] of entries) {
    if (!isLiveDomain(domain)) continue;
    const url = `https://${domain}${path}`;
    if (seen.has(url)) continue;
    seen.add(url);
    out[tag] = url;
  }
  // x-default has to point somewhere real even when every domain this
  // path was meant to span is still dark.
  if (!out["x-default"]) {
    out["x-default"] =
      Object.values(out)[0] ?? `https://${fallbackDomain()}${fallbackPath}`;
  }
  return out;
}

export function alternateLanguagesFor(path: string) {
  const { main, nairobi: ke, accra: gh } = site.domains;

  if (path === "/" || path === "") {
    return alternatesFrom(
      [
        ["en-KE", ke, ""],
        ["en-GH", gh, ""],
        ["x-default", main, ""],
      ],
      "",
    );
  }

  if (path === "/nairobi") {
    return alternatesFrom(
      [
        ["en-KE", ke, ""],
        ["x-default", main, "/nairobi"],
      ],
      "",
    );
  }

  if (path === "/accra") {
    return alternatesFrom(
      [
        ["en-GH", gh, ""],
        ["x-default", main, "/accra"],
      ],
      "/accra",
    );
  }

  if (path.startsWith("/nairobi/") || path.startsWith("/accra/")) {
    const cityDomain = path.startsWith("/nairobi/") ? ke : gh;
    const tag = path.startsWith("/nairobi/") ? "en-KE" : "en-GH";
    return alternatesFrom(
      [
        [tag, cityDomain, path],
        ["x-default", main, path],
      ],
      path,
    );
  }

  return alternatesFrom(
    [
      ["en-KE", ke, path],
      ["en-GH", gh, path],
      ["x-default", main, path],
    ],
    path,
  );
}

// Country routing for the /insights hub. The catalogue is split so each
// domain only ranks for its own market: goldstay.co.ke serves Kenya
// articles, goldstay.com.gh serves Ghana articles. Hosts that don't
// match the requested article 308-redirect to the canonical host, but
// only when that host is live (see /insights/[slug]/page.tsx).
export function countryForHost(host: string): "kenya" | "ghana" {
  const lower = host.toLowerCase();
  if (lower.endsWith(site.domains.accra)) return "ghana";
  return "kenya";
}

export function canonicalHostForCountry(country: "kenya" | "ghana") {
  return liveDomainOr(
    country === "ghana" ? site.domains.accra : site.domains.nairobi,
  );
}

// hreflang + canonical for an /insights/<slug> URL. Each market's posts
// are canonical on that market's domain, falling back to a domain that
// is actually live.
//
// Kenya posts used to be canonical on goldstay.com with .co.ke as the
// en-KE alternate. We do not own goldstay.com, so every Kenya article
// served on .co.ke was telling Google its real home was a parked
// for-sale lander. That is an instruction not to rank the .co.ke copy,
// and it withheld the entire catalogue's authority from the only domain
// we actually run.
//
// Absolute rather than relative canonicals on purpose: it lets us name
// the correct host even when the request arrives on a different domain,
// which matters if a 308 ever fails to fire.
export function insightAlternates(slug: string, country: "kenya" | "ghana") {
  const path = `/insights/${slug}`;
  const { nairobi: ke, accra: gh } = site.domains;

  if (country === "ghana") {
    return {
      canonical: `https://${liveDomainOr(gh)}${path}`,
      languages: alternatesFrom([["en-GH", gh, path]], path),
    };
  }

  return {
    canonical: `https://${liveDomainOr(ke)}${path}`,
    languages: alternatesFrom([["en-KE", ke, path]], path),
  };
}

export function emailFor(city?: "nairobi" | "accra" | null) {
  if (city === "nairobi") return site.emails.nairobi;
  if (city === "accra") return site.emails.accra;
  return site.emails.default;
}

// Kenyan WhatsApp line. Every Nairobi CTA and the neutral .com fallback
// route here. Kept in the source as a default so a Vercel env-var typo
// or unset environment doesn't silently 404 our inbound funnel; the
// NEXT_PUBLIC_WHATSAPP_NUMBER_NAIROBI override still wins so we can
// swap in an alternate line (e.g. a WhatsApp Business API number)
// without a code deploy. Accra keeps its placeholder because .com.gh
// is not live yet.
const NAIROBI_WHATSAPP_NUMBER = "254702471993";
export const whatsapp = {
  number:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ||
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_NAIROBI ||
    NAIROBI_WHATSAPP_NUMBER,
  nairobi:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_NAIROBI || NAIROBI_WHATSAPP_NUMBER,
  accra: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER_ACCRA || "233500000000",
};

// The same Nairobi line as the WhatsApp number above, published as a
// number you can actually dial.
//
// It was already in the JSON-LD `telephone` field, so this does not
// expose anything new — it makes it callable and visible. Until now the
// entire public contact surface was WhatsApp, which reads as a business
// that might not exist to anyone who wants to hear a voice before
// handing over a house. Every property manager we compete with in
// Nairobi leads with a phone number.
//
// Derived from `whatsapp` rather than duplicated so the env-var
// override applies to both and the two can never disagree — a phone
// number that differs between the page and the schema is worse for
// local search than having none.
export const phone = {
  nairobi: {
    // "+254702471993" — what tel: needs.
    href: `tel:+${whatsapp.nairobi}`,
    // "+254 702 471 993" — what a human reads.
    display: `+${whatsapp.nairobi}`.replace(
      /^(\+\d{3})(\d{3})(\d{3})(\d{3})$/,
      "$1 $2 $3 $4",
    ),
  },
};

// Office hours, as openingHours in schema.org's day-time notation.
//
// These are the hours the platform already behaves according to:
// SEND_WINDOW in reminder-schedule.ts holds client email to 08:00–18:00
// local, and the callback promise on every lead form is "within two
// hours during business hours". Declaring anything wider here would
// contradict code that is already live.
//
// Saturday is deliberately absent rather than guessed. If the Nairobi
// office does take calls on a Saturday, add it — a business that shows
// as closed when it is open loses the enquiry to whoever shows as open.
export const openingHours = ["Mo-Fr 08:00-18:00"] as const;

export function waLink(message: string, city?: "nairobi" | "accra") {
  const number =
    city === "nairobi"
      ? whatsapp.nairobi
      : city === "accra"
        ? whatsapp.accra
        : whatsapp.number;
  const text = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${text}`;
}

export const services = [
  {
    slug: "property-sourcing",
    title: "Property Sourcing",
    fee: "Free",
    feeLabel: "for buyers",
    detailHref: "/property-sourcing",
    blurb:
      "For diaspora landlords buying remotely. We find the right property, run the inspections, negotiate the price, verify the title and hand you a turnkey asset ready to rent.",
    features: [
      "On-the-ground property search to your investment brief",
      "Remote video walk-through and in-person inspection",
      "Price negotiation on your behalf",
      "Legal and title verification with our property lawyers",
      "Due diligence on the developer, building and service charge history",
      "Full handover pack at completion: keys, documents, inventory, utilities",
      "Seamless transition into Goldstay long-term or short-stay management",
    ],
  },
  {
    slug: "long-term",
    title: "Long-Term Management",
    fee: "10%",
    feeLabel: "of collected rent",
    detailHref: "/long-term-management",
    blurb:
      "End-to-end management for landlords who want stable, long-term tenants in Nairobi or Accra.",
    features: [
      "Tenant sourcing and rigorous vetting",
      "Lease agreement drafting",
      "Rent collection and USD remittance to your foreign account",
      "Routine and emergency maintenance coordination",
      "Monthly financial statements",
      "24/7 landlord WhatsApp support",
    ],
  },
  {
    slug: "short-stay",
    title: "Airbnb / Short-Stay Management",
    fee: "20%",
    feeLabel: "of revenue",
    detailHref: "/airbnb-management",
    blurb:
      "Full Airbnb operations for landlords who want maximum yield without lifting a finger.",
    features: [
      "Professional photography and listing creation",
      "Dynamic pricing optimisation",
      "Guest communication and screening",
      "Turnover cleaning coordination",
      "Maintenance management",
      "Monthly revenue statements and USD remittance",
    ],
  },
  {
    slug: "tenant-finding",
    title: "Tenant Finding Only",
    fee: "1 month",
    feeLabel: "one-time fee",
    detailHref: "/tenant-finding",
    blurb:
      "For self-managing landlords who simply need a vetted, high-quality tenant in place.",
    features: [
      "Targeted tenant sourcing",
      "Full background and reference checks",
      "Employment and income verification",
      "Lease drafting and signing support",
      "Move-in inventory and handover",
    ],
  },
];

// Neighbourhood-level economics. Ranges are indicative monthly rent in USD
// for a recently let, well-finished 2-bedroom apartment. They're directional,
// not guarantees, and explicitly framed as such on the page. Sourced from
// publicly available listings and our own managed/advised stock.
export type Neighbourhood = {
  name: string;
  twoBrUsd: { min: number; max: number };
  // What the range above is actually measuring, where "2-bed apartment"
  // would be wrong. Karen and Runda are standalone-house suburbs with
  // almost no apartment stock, so a page quoting apartment comparables
  // next to a profile explaining that apartments are absent contradicts
  // itself in the space of one screen. Defaults to apartments, because
  // for the other nine areas that is what the figure is.
  benchmarkUnit?: string;
  tenant: string;
  // Short-stay profile, and deliberately optional.
  //
  // Only filled in where we would actually take on a short let in that
  // neighbourhood. Karen and Runda are the obvious omissions: both are
  // standalone-house suburbs a long way from any business district,
  // where nightly demand is thin and the long-let economics are simply
  // better. Leaving them blank means no /airbnb-management page is
  // generated for them.
  //
  // That restraint is the point. Spinning up a service page for every
  // neighbourhood on one shared template is the textbook doorway-page
  // pattern, and Google demotes exactly that. A page only earns its URL
  // if it can say something true that the others cannot, which is why
  // `note` and `caveat` are required rather than nice to have.
  shortLet?: {
    // Indicative nightly rate for a well-finished 2-bed, in USD.
    nightlyUsd: { min: number; max: number };
    // Realistic annual occupancy band, as a percentage.
    occupancyPct: { min: number; max: number };
    // Who actually books here, which differs sharply by area: medical
    // visitors in Parklands, UN assignments in Gigiri, weekend leisure
    // in Kilimani.
    guests: string;
    // What is genuinely specific about short-letting in this
    // neighbourhood. One or two sentences, no filler.
    note: string;
    // What caps the rate or the demand. Every area has something, and
    // naming it is both honest with the landlord and the thing that
    // stops these pages reading as the same page nine times.
    caveat: string;
  };
  // Long-let profile, and the same bargain as `shortLet` above: an
  // area earns a standalone /<city>/<area> page only if there is
  // something true to say about letting there that no sibling page
  // could claim.
  //
  // The restraint above was applied to the /airbnb-management pages
  // and never to their parents, and it showed. Measured across eight
  // of them, 88% of every parent page was text shared with its
  // siblings — around 120 unique words in 1,000 — because `name`,
  // `tenant` and a rent range were the only things that varied inside
  // a fixed template. That is the doorway pattern the comment above
  // warns about, and Google had duly collapsed the cluster.
  //
  // So this is required for publication, not decoration. Areas
  // without a profile are listed on /<city>/areas with their rent
  // band and tenant mix, which is all we can honestly say about them,
  // rather than being given a URL that pads those two facts out to a
  // thousand words.
  profile?: {
    // What the place physically is: the roads that define it, what
    // sits on them, how it has changed. The orientation a landlord
    // who last visited five years ago does not have.
    character: string;
    // Who rents here and why — the specific employers, institutions
    // and schools that generate the demand, not "professionals".
    demand: string;
    // The building stock. Age, typical unit mix, what a service
    // charge buys locally, what "well-finished" means on this street
    // as opposed to two miles away.
    stock: string;
    // What actually goes wrong for a landlord here. The section that
    // earns the page, and the one that cannot be templated: water,
    // access, oversupply, whatever it genuinely is.
    friction: string;
    // Questions specific to this area. These replace the city-level
    // FAQ, which was 373 words repeated byte-for-byte on all eleven
    // neighbourhood pages — the single largest block of duplication —
    // and which emitted the same FAQPage schema eleven times over.
    faq: { q: string; a: string }[];
  };
};

export const cities = {
  nairobi: {
    country: "Kenya",
    currency: "KES",
    tenantProfile: "UN, diplomats, corporates, international NGOs and expats",
    heroRentClaim:
      "Typical 2BR in Kilimani or Westlands nets USD 1,400 to 1,900 a month, wired to your account on the 5th.",
    neighbourhoods: [
      {
        name: "Westlands",
        twoBrUsd: { min: 1400, max: 2000 },
        tenant: "Corporate, UN, NGO",
        shortLet: {
          nightlyUsd: { min: 100, max: 150 },
          occupancyPct: { min: 65, max: 75 },
          guests:
            "Regional business travel, conference delegates, corporate assignments",
          note: "The strongest short-stay market in Nairobi, because it is the only one where guests can walk to offices, Sarit Centre and Village Market without touching a car. Midweek demand is corporate and holds through the low season, which is what makes occupancy here steadier than anywhere else in the city.",
          caveat:
            "It is also where most of the new supply has landed. A unit with generic furniture and phone photography discounts hard against a hundred near-identical neighbours, so the rate band above assumes the listing is genuinely well presented.",
        },
        profile: {
          character:
            "Nairobi's second business district, and the one that behaves like a city centre. The commercial spine runs along Waiyaki Way and Ring Road Westlands, with Sarit Centre and Westgate anchoring the retail and a row of office towers that have gone up since the mid-2010s. Behind them, Rhapta Road, Peponi Road and the streets off them were low-rise family housing within living memory and are now largely apartment blocks. A landlord who bought a maisonette here in 2010 owns something in a materially different neighbourhood today.",
          demand:
            "Tenants who work within a fifteen-minute walk. Several multinationals run their East Africa operations from the towers along Ring Road and Waiyaki Way, and their staff make up the bulk of the corporate lets. Beyond them: UN and NGO staff who want to be nearer town than Gigiri, embassy support staff, and regional managers on one- to three-year postings with a housing allowance. That last group matters more than its size, because an allowance-backed tenant negotiates less on rent and stays for the length of the posting.",
          stock:
            "Overwhelmingly apartments, mostly one to three bed, most of it built in the last decade. The better blocks carry a borehole, a backup generator, a lift, parking and often a gym or pool, and the service charge reflects all of it — expect it to be noticeably higher here than in an older, lower-density suburb, because lifts and generators are what you are paying for. Finish standards are set by the newest completions on the street rather than by the age of your own block, which is the uncomfortable part of owning a 2015 unit next to a 2024 one.",
          friction:
            "Supply is the problem worth planning for. More apartments have been delivered in Westlands than in any comparable part of Nairobi, and the practical effect is that a unit which is merely adequate sits empty while a well-presented one on the same street lets in a fortnight. Void periods here are a presentation problem more than a pricing one. Traffic on Waiyaki Way shapes tenant behaviour to a degree outsiders underestimate — a unit on the wrong side of the road for a tenant's commute is a harder let than the map suggests. Two further things to check before buying: how many parking bays actually come with the unit, since older blocks were built for a car per household and tenants now often have two, and whether the block's management company is competent, because a badly run service charge is the single fastest way for a good building to lose its rent premium.",
          faq: [
            {
              q: "Is Westlands oversupplied for long-term lets?",
              a: "For undifferentiated units, yes. There is a lot of stock and a tenant viewing four similar two-beds in an afternoon will choose on finish, natural light and parking rather than on a fifty-dollar rent difference. Well-presented units in well-run blocks still let quickly. The risk is not that Westlands rents have collapsed — they have not — it is that the gap between the top and bottom of the same rent band has widened, and an averagely finished unit now sits at the bottom of it.",
            },
            {
              q: "Should I furnish a Westlands apartment?",
              a: "For the corporate and allowance-backed tenants that make up most of the demand here, furnished lets at a premium and turns over faster, which suits an owner who wants the option of switching to short stays later. For a longer, quieter tenancy, unfurnished attracts tenants who bring their own things and therefore stay longer. Both work in Westlands specifically because both tenant types are present in volume, which is not true of every Nairobi suburb.",
            },
            {
              q: "How much should I expect to pay in service charge?",
              a: "More than you would in Kileleshwa or Lavington, because you are funding lifts, a generator, a borehole and usually security staffing across a larger building. The number matters less than what it covers and whether the managing agent collects reliably: a low service charge in a block with arrears means deferred maintenance that lands on owners as a special levy later. We read the service charge accounts before recommending a purchase, not the headline figure.",
            },
            {
              q: "Does the Nairobi Expressway help or hurt Westlands rents?",
              a: "It helps, indirectly. Faster access to the airport and to Upper Hill widened the pool of tenants for whom Westlands is a sensible base, which supports demand at the upper end. It has not changed the local congestion on Waiyaki Way and Ring Road at peak times, so a tenant's day-to-day commute feels much as it did.",
            },
          ],
        },
      },
      {
        name: "Kilimani",
        twoBrUsd: { min: 1300, max: 1800 },
        tenant: "Young professionals, expats",
        shortLet: {
          nightlyUsd: { min: 90, max: 130 },
          occupancyPct: { min: 62, max: 74 },
          guests:
            "Remote workers, weekend leisure, young professionals, medium-stay relocations",
          note: "The highest-volume short-let market in the country and the most competitive. Demand is real and year-round, skewing to leisure and remote work rather than corporate, which means weekends fill first and midweek needs pricing work.",
          caveat:
            "Two things bite here. Supply is saturated, so pricing has to be actively managed rather than set and left. And a growing number of Kilimani buildings now restrict or ban short lets outright, so the building matters more than the apartment.",
        },
        profile: {
          character:
            "The most comprehensively rebuilt neighbourhood in Nairobi. Kilimani was bungalows on half-acre plots within the last twenty years; rezoning turned it into the densest apartment district in the city. Argwings Kodhek Road and Lenana Road carry most of the traffic, Yaya Centre and Adlife Plaza carry most of the retail, and the streets between them — Kirichwa, Denis Pritt, Ring Road Kilimani — are now largely mid-rise blocks. It sits closer to the central business district and Upper Hill than any other premium residential area, which is the whole basis of its rental demand.",
          demand:
            "Younger and more mobile than the Westlands or Riverside tenant. Single professionals and couples rather than families, a substantial remote-working population, NGO and development-sector staff, and medical professionals working at the hospitals in and around Upper Hill. Kilimani is also where most new arrivals to Nairobi start, because it is the easiest place to find a one-bedroom at short notice. That cuts both ways: the pool of tenants is deep, and it is also the least sticky tenant base in the city, so plan on shorter average tenancies than you would get in Kileleshwa or Lavington.",
          stock:
            "More apartments, of a wider range of quality, than anywhere else in Nairobi. Heavy on studios and one-beds, which is why the two-bed band above is narrower than the volume of construction would suggest. Quality varies enormously street to street and even block to block, because a lot of it was built quickly during the rezoning boom. The specific things worth checking are water storage capacity, the state of the borehole if there is one, and whether the parking allocation is real or notional.",
          friction:
            "Water is the practical issue a diaspora landlord tends not to anticipate. Mains supply across Kilimani is unreliable enough that serious blocks run a borehole and substantial storage, and the ones that do not end up buying bowser water, which either lands on the service charge or lands on your tenant's patience. Ask about water before you ask about the finish. The second issue is oversupply, which is more acute here than in Westlands: there is simply more competing stock, and a tenant has real choice, so rent is set by the market and not by what you paid. The third is construction — rezoning means the plot next door can become a building site with little warning, and a tenant living beside one negotiates hard or leaves. Finally, if you have any thought of short-letting later, check the building's rules first, because a growing number of Kilimani blocks now prohibit it outright.",
          faq: [
            {
              q: "Why are Kilimani rents lower than Kileleshwa's for a similar apartment?",
              a: "Density and choice. Kilimani has far more competing units, so a tenant comparing two similar two-beds has more alternatives and less reason to stretch. Kileleshwa is quieter, greener and lower-rise, which families and diplomatic tenants pay a premium for. If you own in Kilimani the answer is not to price against Kileleshwa but to compete on the things tenants there actually choose on: water reliability, light, parking and how the unit shows.",
            },
            {
              q: "Is a one-bedroom or a two-bedroom the better let in Kilimani?",
              a: "One-beds let faster because the tenant pool is dominated by singles and couples, but they turn over more often, and each turnover costs you a void and a clean. Two-beds take longer to let and hold the tenant longer, and they keep the option of a couple sharing. Given the tenant base here we would generally rather own the two-bed and accept a slower initial let, unless the unit is genuinely well located for a short walk to Upper Hill.",
            },
            {
              q: "How badly does the water situation affect a tenancy?",
              a: "Enough to be the first thing we check. A block with a working borehole and proper storage is a normal tenancy. A block dependent on mains and bowser deliveries produces recurring complaints, and recurring complaints produce notice. It is the most common reason we advise against an otherwise attractive Kilimani unit.",
            },
            {
              q: "Should I be worried about all the new construction?",
              a: "About the building next door, yes, in the short term — noise and dust cost you rent or cost you the tenant. About the neighbourhood, less so. Kilimani's proximity to the business districts is structural and is not going away, and the density that makes it competitive is the same density that keeps it liquid when you want to sell or re-let.",
            },
          ],
        },
      },
      {
        name: "Kileleshwa",
        twoBrUsd: { min: 1400, max: 1900 },
        tenant: "Families, diplomats",
        shortLet: {
          nightlyUsd: { min: 80, max: 120 },
          occupancyPct: { min: 55, max: 68 },
          guests:
            "Relocating families, longer stays, visiting relatives, NGO staff on assignment",
          note: "Quiet, green and residential, which makes it a stay-of-a-month neighbourhood rather than a stay-of-two-nights one. Booking lengths here are the longest of any Nairobi suburb we manage, and that changes the economics: fewer turnovers, lower cleaning costs, lower churn.",
          caveat:
            "Not walkable. Guests without a car feel it immediately, so the listing has to be honest about that and parking is close to essential rather than a bonus.",
        },
        profile: {
          character:
            "Twenty years ago this was bungalows on half-acre plots under a canopy of old trees along Gitanga and Othaya Roads. The zoning changed, the plots were bought and subdivided, and Kileleshwa is now one of the densest apartment suburbs in Nairobi while still being sold to buyers on the greenery that the building programme has spent a decade removing. Laikipia, Mandera and Kandara Roads carry more dwellings between them today than the whole neighbourhood held in 2005. A landlord picturing the Kileleshwa they last visited is picturing somewhere else.",
          demand:
            "Families and mid-senior diplomatic and NGO staff who want Kilimani's proximity without Kilimani's noise. Kileleshwa sits between the Kilimani office cluster and Lavington, so Upper Hill, the central business district and Westlands are all a short run in different directions, which is the practical reason a tenant picks it over somewhere cheaper further out. The mix skews older and more settled than Kilimani's — couples with young children, staff on a second or third posting — and tenancies run appreciably longer as a result.",
          stock:
            "Almost entirely apartments put up since about 2012 on former bungalow plots, and unusually for Nairobi the unit mix leans to three-beds rather than ones and twos, because developers built for the family demand the area already had. Rooms tend to be larger than a Kilimani equivalent at the same rent. Most blocks carry a borehole and many carry a generator, while service charges sit below Westlands because the buildings are lower and far fewer of them run lifts.",
          friction:
            "The infrastructure was laid for bungalows and is now serving apartment blocks, and that is the honest problem with Kileleshwa. Roads and storm drainage designed for a low-density suburb take a beating through the long rains, and water and sewer capacity are the constraints developers do not put in the brochure — which is why a borehole here is closer to essential than to a nice extra. Redevelopment is still live rather than finished, so construction next door is a present risk: a tenant who signed for a quiet street can find a site hoarding outside within months, and that is a real cause of early notice. There is also no walkable retail worth the name, leaving a tenant without a car dependent on Kilimani or Lavington for everything.",
          faq: [
            {
              q: "Has Kileleshwa been overbuilt?",
              a: "It has been built out, which is not quite the same thing. The density arrived fast and the supply of three-bed apartments is genuinely deep, so an averagely finished unit competes hard. What protects Kileleshwa is that the family demand it was built for is still there and is stickier than the young-professional demand a mile away — those tenants move less often, so once a unit is let it tends to stay let.",
            },
            {
              q: "Why are so many Kileleshwa apartments three-bedroom?",
              a: "Because developers followed the tenants who were already here rather than building the smallest sellable unit. That is useful to know as a buyer: the one- and two-bed segment is comparatively thin in Kileleshwa, so a well-finished smaller unit faces less direct competition than the headline supply figures for the area would suggest.",
            },
            {
              q: "Do I really need a borehole in Kileleshwa?",
              a: "In practice, yes, and you should treat a block without one as carrying a standing risk rather than a saving. Mains supply was sized for a fraction of the current population, and the buildings that ride out a dry spell without tankering water are the ones with their own source. Tenants at this rent level notice within a week when water is intermittent.",
            },
            {
              q: "Will construction next door cost me a tenant?",
              a: "It can, and in Kileleshwa specifically it is worth checking before you buy rather than hoping. Look at the plots on either side and opposite: a remaining bungalow on a large plot is a development site waiting to happen. Noise and dust during a build are the most common reason a good Kileleshwa tenant gives notice early.",
            },
          ],
        },
      },
      {
        name: "Riverside",
        twoBrUsd: { min: 1500, max: 2100 },
        tenant: "Diplomats, NGO staff, corporate executives",
        shortLet: {
          nightlyUsd: { min: 110, max: 160 },
          occupancyPct: { min: 60, max: 70 },
          guests:
            "Diplomatic and NGO visitors, premium business travel, consultants",
          note: "A short, quiet corridor that happens to sit between the CBD and Westlands, with embassies and NGO offices along it. Guests pay a premium for a secure, low-noise address they can still reach the city from in ten minutes, and rates hold better through the low season than the volume suburbs.",
          caveat:
            "Inventory is tiny and a good number of the buildings do not permit short lets at all. Worth confirming the building's position before buying here specifically to short let.",
        },
        profile: {
          character:
            "A single leafy spine — Riverside Drive, running off Chiromo Road — and the streets hanging off it, following the line of the Nairobi River. It is the most contained of the premium areas: not a district like Westlands or a grid like Kilimani, but essentially one road with embassies, diplomatic residences, a handful of offices and a small number of apartment buildings along it. Being walkable to neither a mall nor an office tower is part of the appeal for the tenants who choose it, and the reason it stays quiet while Westlands, ten minutes away, does not.",
          demand:
            "Narrow, wealthy and fairly stable. Several embassies and international organisations sit on or immediately off Riverside Drive, and their staff and the consultants who work with them form most of the tenant base, alongside senior corporate tenants who want a short commute to both the central business district and Westlands without living in either. These are allowance-backed tenancies as a rule, which is why the rent band here sits above Westlands for a comparable apartment. Expect a smaller number of prospective tenants per vacancy and a higher proportion of them who can actually pay.",
          stock:
            "Very little of it, which is the defining commercial fact about Riverside. A mix of older diplomatic-style compounds on generous plots and a small number of newer, high-specification apartment buildings. Finish expectations are the highest of any area we cover: a tenant paying at this level and choosing Riverside specifically for its quiet is not going to accept a builder-standard kitchen. Service charges are correspondingly high and generally well administered, because the buildings are few and the owner base is engaged.",
          friction:
            "The single access road is the practical constraint. Riverside Drive funnels into Chiromo Road, and at peak times that junction is the whole neighbourhood's route in and out, which is worth understanding before assuming a ten-minute commute. The thin tenant pool is the commercial constraint: when a unit falls vacant there are fewer people looking, so a void here can run longer than in Kilimani even though the rent is higher — the arithmetic still favours Riverside, but only if you can absorb a slower let rather than needing the unit occupied next month. Security provisioning along the road was substantially upgraded following the attack at 14 Riverside Drive in 2019, and the area is now among the more heavily secured in the city; tenants at this level ask about it directly, so it is worth knowing what your building actually provides. Finally, there is almost no retail within walking distance, so a tenant without a car will find the address impractical no matter how good the apartment is.",
          faq: [
            {
              q: "Why does Riverside command more rent than Westlands?",
              a: "Scarcity and tenant mix. There are only so many apartments on Riverside Drive, and the tenants who want them are largely allowance-backed diplomatic and senior corporate staff who are buying quiet and security rather than proximity to shops. Westlands has more of everything, including more competing units, which caps what any individual unit can ask.",
            },
            {
              q: "How long should I expect a Riverside unit to take to let?",
              a: "Longer than Kilimani and often longer than Westlands, because the pool of tenants is small. That is the trade for the higher rent and the longer tenancies that tend to follow. If you need occupancy quickly — a mortgage to service from month one, for instance — Riverside is the wrong area to buy into, and we would say so before you did.",
            },
            {
              q: "Do Riverside buildings allow short letting?",
              a: "Many do not. The buildings are few, the owner bodies are engaged and several have taken an explicit position against nightly lets. If short stays are part of your plan, confirm the building's rules in writing before committing, because the rate potential here is genuinely good and the permission is genuinely uncertain.",
            },
            {
              q: "Is the traffic on and off Riverside Drive a real problem for tenants?",
              a: "It is a real consideration rather than a real problem. One road in and out means the Chiromo junction backs up at peak times, and tenants notice it. It has not stopped Riverside letting at the top of the market, because the people renting here are generally leaving at hours that avoid the worst of it.",
            },
          ],
        },
      },
      {
        name: "Gigiri",
        twoBrUsd: { min: 1700, max: 2400 },
        tenant: "UN staff, diplomats, international NGOs",
        shortLet: {
          nightlyUsd: { min: 120, max: 180 },
          occupancyPct: { min: 58, max: 72 },
          guests:
            "UN and embassy assignments, visiting delegations, consultants on contract",
          note: "Demand here is almost entirely generated by the UN complex and the diplomatic missions around it, which makes it unlike anywhere else in Nairobi: bookings arrive as three-week to three-month assignments with organisational budgets behind them, and they are booked well in advance.",
          caveat:
            "Effectively a long-stay market only. Nightly leisure demand is close to nonexistent, so a unit priced and marketed for weekend breaks will sit empty. Inventory also skews to houses rather than apartments.",
        },
      },
      {
        name: "Lavington",
        twoBrUsd: { min: 1500, max: 2200 },
        tenant: "Diplomats, corporate executives",
        shortLet: {
          nightlyUsd: { min: 100, max: 140 },
          occupancyPct: { min: 55, max: 68 },
          guests:
            "Relocating families, NGO and embassy staff, school-term visitors",
          note: "A family neighbourhood, and the short-let demand reflects it: larger units, longer stays and a booking calendar that moves with international school terms rather than with tourist seasons.",
          caveat:
            "Most of the stock is townhouses and larger apartments, which cost more to furnish and clean per booking. The monthly rate is good; the nightly rate rarely justifies a short-stay setup on a small unit.",
        },
      },
      {
        name: "Parklands",
        twoBrUsd: { min: 1000, max: 1500 },
        tenant: "Mixed corporate, mid-tier expat",
        shortLet: {
          nightlyUsd: { min: 70, max: 100 },
          occupancyPct: { min: 62, max: 74 },
          guests:
            "Medical visitors, regional business travel, visiting families",
          note: "The one Nairobi neighbourhood with a genuine medical-stay market, because Aga Khan University Hospital sits in it. Patients and accompanying family book for weeks at a time, they book at short notice, and they care about being able to walk to the hospital far more than about styling.",
          caveat:
            "The rate ceiling is the lowest of the areas we manage, so this works on occupancy and low turnover cost rather than on nightly rate. It rewards a practical, spotless unit over a beautiful one.",
        },
      },
      {
        name: "Brookside",
        twoBrUsd: { min: 1700, max: 2500 },
        tenant: "Premium families, embassies",
        shortLet: {
          nightlyUsd: { min: 110, max: 150 },
          occupancyPct: { min: 55, max: 68 },
          guests: "Embassy staff, premium families, corporate relocations",
          note: "A small, quiet and genuinely premium pocket next to Westlands, so guests get a residential address within reach of the business district. Stays are long and guests are undemanding, which keeps operating costs down.",
          caveat:
            "Long-let economics here are strong enough that short-letting only wins on a well-presented unit at the top of the nightly band. On anything average, the stable long lease is the better business.",
        },
        profile: {
          character:
            "A short spine of lanes hanging off Brookside Drive, tucked behind Westlands and above the river. Embassy residences, walled family houses and a handful of high-specification apartment buildings, and little else — no retail, no offices, no through route. The whole neighbourhood can be driven in a couple of minutes. Brookside's entire commercial proposition is that it is not Westlands while sitting three minutes from it, and what a tenant pays the premium for is insulation from the density immediately next door.",
          demand:
            "Embassy and high commission staff, senior corporate relocations and premium families, nearly all allowance-backed and, crucially, nearly all placed by relocation agents rather than by finding a listing themselves. That changes how Brookside actually lets. The agents work from a short roster of buildings and compounds they already trust, so a unit outside that roster can sit empty while apparently comparable stock one lane over turns over inside a fortnight. Being known to the relocation channel matters more here than the quality of the advertisement.",
          stock:
            "A split with no real parallel elsewhere in Nairobi: older diplomatic-style houses on generous walled plots alongside a small number of recent, tightly specified apartment blocks, and almost nothing in between. Finish expectations are set by the embassy tenancies rather than by the local average, which means fitted kitchens, proper built-in wardrobes and dependable hot water are assumed rather than sold. Service charges on the apartment stock are high and, because the owner bodies are small and engaged, generally well administered.",
          friction:
            "The address itself is where money is lost in Brookside. It borders Westlands closely enough that agents routinely market Westlands-side buildings under the Brookside name, which inflates the comparables a seller will show you — the rent actually achieved on a genuine Brookside address versus a borrowed one can differ by a couple of hundred dollars a month for two units that photograph identically. Establish which side of the boundary a building truly sits on before pricing off a neighbour. Past that, the tenant pool is small and concentrated in a handful of institutions, so demand here is correlated rather than diversified and a diplomatic drawdown empties several houses at once. Access is through Westlands traffic whichever way you are travelling, which tempers the apparent convenience.",
          faq: [
            {
              q: "Why does Brookside let for more than Westlands, three minutes away?",
              a: "Because the tenants are buying the absence of what Westlands has. No towers, no mall traffic, no construction, no through route — for an embassy family relocating with children that is worth a premium, and there are only so many addresses in Nairobi that offer it this close to the business district.",
            },
            {
              q: "How do I get in front of the relocation agents who place Brookside tenants?",
              a: "Deliberately, because they will not find you. The agents maintain working relationships with managers and landlords they have placed tenants with before, and they shortlist from that. This is a substantial part of what we do on a Brookside instruction: the unit has to be in front of the four or five people who actually decide where an arriving family is shown.",
            },
            {
              q: "House or apartment — which is the better buy in Brookside?",
              a: "They serve different tenants. The houses draw the embassy and family end and command the top of the rent band, but carry garden, compound and staffing costs and let more slowly. The apartments let faster to senior corporate tenants and are far simpler to run. If it is your first Nairobi property, the apartment is the more forgiving purchase.",
            },
            {
              q: "How do I check a building is actually in Brookside?",
              a: "Ask for the physical address and the land reference rather than accepting the marketing name, then look at which road it is genuinely accessed from. If the entrance is off a Westlands road and the block is simply near the boundary, price it as Westlands, because that is what it will let as.",
            },
          ],
        },
      },
      {
        name: "Rosslyn",
        twoBrUsd: { min: 1600, max: 2300 },
        tenant: "UN, diplomats, international school families",
        shortLet: {
          nightlyUsd: { min: 110, max: 150 },
          occupancyPct: { min: 55, max: 68 },
          guests:
            "International school families, UN staff, diplomatic assignments",
          note: "Rosslyn works on proximity to the international schools and to Gigiri, so its calendar is driven by academic terms and posting cycles. Enquiries cluster in the weeks before a term starts and the stays that follow are measured in months.",
          caveat:
            "Car-dependent and quiet, with no walkable amenity to speak of. Short nightly bookings are rare, and a listing built around them will underperform badly.",
        },
      },
      {
        name: "Karen",
        twoBrUsd: { min: 1500, max: 2000 },
        tenant: "Expat families, diplomats, school faculty",
        benchmarkUnit: "2-bed cottages and guest wings",
        profile: {
          character:
            "Old coffee-estate land at the southern edge of the city, subdivided into plots measured in acres rather than square metres. Karen Road, Bogani Road, Ndege Road and Marula Lane are lanes between hedges more than streets, the housing is detached, and the apartment blocks that define the rest of Nairobi are essentially absent. Karen Shopping Centre and the Hub carry the retail; everything else is a drive. This is the one part of the city where owning a rental means owning a small property rather than a flat in someone else's building.",
          demand:
            "Overwhelmingly expat and diaspora families with school-age children, and the schools are the actual mechanism. Brookhouse, Hillcrest and Banda sit in or beside Karen, and a family holding a place at one of them will look here first and compromise on nearly everything else to be within the run. Add diplomats who want land, teaching faculty on institutional housing budgets, and a persistent trade in tenants who keep horses or several dogs and simply cannot rent anywhere else in Nairobi. The consequence is that Karen demand is a school calendar wearing the costume of a property market.",
          stock:
            "Detached houses, guest cottages and converted outbuildings on large compounds — typically four or five bedrooms in the main house with staff quarters attached, a garden, and frequently a pool. Mains water and sewerage are unreliable or simply absent across much of Karen, so boreholes and septic tanks are the norm rather than the exception, and a generator or a solar array is common. The handful of apartments that exist let to an entirely different tenant and should be underwritten as a different asset.",
          friction:
            "A Karen tenancy is an operating business, not a passive holding, and this is where owners are most often caught out. The garden, the pool, the borehole pump, the septic tank and usually a guard all need paying for and supervising whether the house is occupied or empty, and a landlord who budgeted like an apartment owner will find the monthly running cost a genuine shock. The school calendar is the commercial risk: letting concentrates into the weeks before the September and January intakes, so a house still standing empty in October will very often stay empty until the next one, which makes a Karen void a matter of months rather than weeks. Distance is the third constraint — the run to Westlands or Upper Hill is long enough that Karen never competes for a tenant who must be at a desk daily, and that narrows the pool to precisely the families above.",
          faq: [
            {
              q: "Why is letting in Karen so seasonal?",
              a: "Because the tenants are following school admissions, not job moves. Families arrive to start a term, which concentrates almost all serious viewing into the run-up to September and, to a lesser degree, January. Miss that window with a vacant house and the realistic options are a short-let bridge or accepting a lower rent from whoever is looking out of season.",
            },
            {
              q: "Do I have to provide a gardener and a guard?",
              a: "On a compound of this size, effectively yes, and tenants at this rent expect the arrangement to be in place rather than something they organise. The important part is that these are standing costs on an empty house too — the garden does not stop growing between tenancies, which is the single biggest difference between running a Karen house and running a Kilimani flat.",
            },
            {
              q: "Is a cottage a better investment than the main house?",
              a: "Often, and it is underrated. A well-converted two-bed cottage lets to a much wider pool — single diplomats, teaching staff, couples without children — so it is far less hostage to the school calendar, and it costs a fraction of the main house to furnish, clean and turn over. The rent per square metre is usually better too.",
            },
            {
              q: "Do I need a borehole in Karen?",
              a: "Assume so, and check what exists before you buy. Large parts of Karen have no dependable mains supply, and a compound with a garden and a pool consumes far more than a flat does. A property relying on tankered water is carrying a cost and a reliability problem that will surface in the first dry season.",
            },
          ],
        },
      },
      {
        name: "Runda",
        twoBrUsd: { min: 1800, max: 2500 },
        tenant: "Corporate executives, embassies",
        benchmarkUnit: "2-bed apartments on the estate fringes",
        profile: {
          character:
            "A planned low-density estate north of the city, and the planning is exactly what separates it from Karen. Runda is large detached family houses on roughly half-acre plots, laid out along private internal roads, built to a standard the Runda Association enforces, and consequently far more uniform than the organic sprawl further south. There is no commercial development inside the estate at all — no shops, no offices, no through traffic — which is precisely what its tenants are paying to have. Gigiri and the UN complex are minutes up the road.",
          demand:
            "The UN and the diplomatic missions, more directly than anywhere else in Nairobi including Gigiri itself. Runda is where staff posted to the Nairobi complex live when they want a house and a garden rather than an apartment, and the tenancies arrive shaped like postings: two or three years, allowance-backed, negotiated by an organisation's housing office rather than by the person moving in. Embassy families and a smaller cohort of corporate executives make up the balance. Rents sit at the top of the Nairobi band for family houses as a direct result.",
          stock:
            "Detached houses almost exclusively — typically four to five bedrooms with staff quarters, a walled compound and a mature garden, built or rebuilt to the Association's specification. A handful of newer apartment developments have appeared on the fringes and let to a younger, different tenant entirely. Boreholes are standard. Because the Association polices external appearance and construction quality, the spread in condition between one Runda house and the next is narrower than anywhere comparable, which cuts both ways for an owner hoping to win a tenant on finish alone.",
          friction:
            "The Runda Association is the thing nobody explains before you buy. Membership carries an annual levy funding the private roads, the perimeter and the security patrols, and it carries approval requirements on building, extending or altering anything externally visible — so an owner planning to add a wing or convert the outbuildings needs to establish what is permitted beforehand rather than afterwards. The commercial risk is concentration: when a UN agency trims its Nairobi footprint or a mission restructures, several Runda houses reach the market in the same quarter and compete directly with one another, because they all draw on one employer base. And the estate is car-dependent by design with no retail inside it, which is a feature for the tenant living there and a hard limit on who will ever consider it.",
          faq: [
            {
              q: "What does the Runda Association levy actually cost me?",
              a: "It varies by section and is reset periodically, so treat the current figure as something to verify rather than assume. What matters more than the amount is that it is a standing obligation on the owner, payable whether the house is let or empty, and that it buys the private roads and perimeter security the address is valued for. Ask for the accounts, not just the rate.",
            },
            {
              q: "Is Runda demand really almost all UN and diplomatic?",
              a: "Yes, and it is the central thing to understand before buying. It is why the rents are high and the tenancies long, and equally why the demand is correlated — a single agency's decision can put several comparable houses on the market at once. Diversification is not available within Runda, so the protection is a well-presented house and a realistic view of void risk.",
            },
            {
              q: "Can I extend or subdivide a Runda house?",
              a: "Not freely. The Association's rules govern external alterations and build standards, and subdivision in particular runs against the low-density character the estate exists to preserve. If your investment case depends on adding units or splitting a plot, get written confirmation of what is allowed before committing, because assuming it will be fine is an expensive way to find out.",
            },
            {
              q: "Are the newer Runda apartments worth buying?",
              a: "They are a different business from the houses and should be assessed as one. They let faster, cost far less to run, and reach a younger professional tenant who would not rent a five-bedroom compound. What they do not get is the diplomatic family premium that makes Runda's house rents what they are, so do not underwrite an apartment using house comparables.",
            },
          ],
        },
      },
    ] satisfies Neighbourhood[],
    domain: "goldstay.co.ke",
  },
  accra: {
    country: "Ghana",
    currency: "GHS",
    tenantProfile:
      "NGOs, embassies, oil & gas executives and expat professionals",
    heroRentClaim:
      "Typical 2BR in East Legon or Airport Residential nets USD 1,300 to 1,900 a month, wired to your account on the 5th.",
    neighbourhoods: [
      {
        name: "East Legon",
        twoBrUsd: { min: 1200, max: 1800 },
        tenant: "Oil & gas execs, embassies",
      },
      {
        name: "Adjiringanor",
        twoBrUsd: { min: 1300, max: 1900 },
        tenant: "Corporate executives, NGOs",
      },
      {
        name: "Airport Residential",
        twoBrUsd: { min: 1400, max: 2200 },
        tenant: "Diplomats, senior expats",
      },
      {
        name: "Cantonments",
        twoBrUsd: { min: 1800, max: 2800 },
        tenant: "Embassies, premium expats",
      },
      {
        name: "Labone",
        twoBrUsd: { min: 1000, max: 1500 },
        tenant: "Young professionals, corporate mid-tier",
      },
    ] satisfies Neighbourhood[],
    domain: "goldstay.com.gh",
  },
} as const;

// Per-city content for the "Buy" page at /nairobi/buy and /accra/buy.
// Kept here so the page itself stays purely presentational and new
// claims (price ranges, yield bands, registry references) are updated
// in one place when the market moves.
export const citySourcing = {
  nairobi: {
    heroNeighbourhoods: "Kilimani, Westlands, Lavington or Karen",
    yieldAreaName: "Kilimani or Westlands",
    priceRange: "USD 180,000 to 220,000",
    longTermRent: "USD 1,400 to 1,900 / month",
    shortStayRent: "USD 2,200 to 2,800 / month",
    netYield: "7 to 8.5% per year",
    projectsTracked: 30,
    projectsLabel:
      "New-build projects currently on our Nairobi inspection list across Kilimani, Westlands, Riverside, Lavington, Kileleshwa and Karen.",
    titleAuthority: "the Ministry of Lands",
    taxAuthority: "KRA",
    titlePillarBody:
      "Our Kenyan property lawyers pull the title at Ardhi House, verify there are no undisclosed caveats or charges, confirm service charge arrears and draft a watertight sale agreement in your name.",
    buildingPillarBody:
      "For apartments, we pull service charge history, reserve fund health, AGM minutes and developer track record. For standalone homes, we run the physical survey against the title deed.",
    riskNote:
      "In Nairobi the most common buyer trap is a clean-looking title that hides a charge against the property, a survey discrepancy or a service charge in arrears. We catch all three before you wire a cent.",
  },
  accra: {
    heroNeighbourhoods:
      "East Legon, Airport Residential, Cantonments or Labone",
    yieldAreaName: "East Legon or Airport Residential",
    priceRange: "USD 160,000 to 210,000",
    longTermRent: "USD 1,300 to 1,900 / month",
    shortStayRent: "USD 2,000 to 2,600 / month",
    netYield: "6.5 to 8% per year",
    projectsTracked: 20,
    projectsLabel:
      "New-build projects currently on our Accra inspection list across East Legon, Airport Residential, Cantonments, Labone and Ridge.",
    titleAuthority: "the Lands Commission",
    taxAuthority: "GRA",
    titlePillarBody:
      "Our Ghanaian property lawyers trace the full title chain at the Lands Commission, confirm it is not stool, family or disputed land, and draft a sale agreement registered in your name.",
    buildingPillarBody:
      "For apartments, we pull service charge history, reserve fund health and developer track record. For standalone homes, we run the physical survey and confirm the building matches the registered plot.",
    riskNote:
      "In Accra the single biggest buyer trap is a title that looks clean on the deed but sits on stool or family land with a disputed chain. We verify the full chain at the Lands Commission before you wire a cent.",
  },
} as const;

// City-specific FAQ that sits on top of the global FAQ on each city page.
// These are the questions every diaspora landlord in that specific market
// actually asks in month one of ownership.
export const cityFaq = {
  nairobi: [
    {
      q: "Do I need a KRA PIN to rent out my property in Kenya?",
      a: "By Kenyan law, yes. If you don't already have one, we handle the registration for you end-to-end. Send us a scanned passport and proof of ownership and your KRA PIN is live in roughly a week, with no visit to Kenya required. The reason we insist on this isn't paperwork. It's to protect your title from any future KRA action on undeclared income.",
    },
    {
      q: "Who handles the 7.5% monthly residential rental income tax?",
      a: "Kenya charges a 7.5% MRI (Monthly Rental Income) tax on gross rent for residential landlords (reduced from 10% under the Finance Act 2023). We calculate it, withhold it from each month's collection, and remit it to KRA by the 20th on your behalf. The tax line appears on your monthly statement with the KRA receipt reference.",
    },
    {
      q: "What about land rates, service charge and SRA levies?",
      a: "All paid from your collected rent, all handled by us. Recurring charges like service charge to your apartment committee, annual land rates to Nairobi City County and any SRA (Special Rating Area) levies such as Karen or Westlands are set up once at onboarding and run on auto-pilot after that, so you're not approving the same bill every month. Anything new, one-off or above USD 250 comes to you in writing first. Every payment lands on your monthly statement with the receipt attached.",
    },
    {
      q: "Do I need NEMA or county licences to run my property as an Airbnb?",
      a: "No. When we operate your short-stay, the licensing sits with us, not with you. Goldstay holds the Nairobi City County single business permit, the Tourism Regulatory Authority registration and any NEMA clearance required for the building. You hold ownership; we hold every operating permit the property needs. Nothing for you to file, renew or worry about.",
    },
  ],
  accra: [
    {
      q: "Do I need a Ghana TIN to rent out my property?",
      a: "By Ghanaian law, yes. If you don't already have one, we handle the registration for you end-to-end. Send us a scanned passport and your title documents and your TIN is live in under two weeks, with no visit to Ghana required. The reason we insist on this isn't paperwork. It's to keep your title clean of any future GRA action on undeclared income.",
    },
    {
      q: "Who handles the 8% rental income tax?",
      a: "Ghana applies an 8% final withholding tax on gross residential rental income. We deduct it from each month's collection and remit it to GRA by the 15th of the following month on your behalf. You receive the GRA acknowledgement reference on every monthly statement.",
    },
    {
      q: "What about property rates and ground rent?",
      a: "All paid from your collected rent, all handled by us. Accra property rates to AMA (or your relevant municipal assembly) and annual ground rent to the Lands Commission are set up once at onboarding and run on auto-pilot after that, so you're not approving the same bill every year. Anything new, one-off or above USD 250 comes to you in writing first. Every payment lands on your monthly statement with the official receipt attached.",
    },
    {
      q: "Do I need a GTA licence to list my property on Airbnb?",
      a: "No. When we operate your short-stay, the Ghana Tourism Authority (GTA) licensing sits with us, not with you. Goldstay holds the GTA operator licence, the municipal business operating permit and any other short-stay permits the property needs. You hold ownership; we hold every operating permit. Nothing for you to file or renew.",
    },
  ],
} as const;

export const faq = [
  // First because it is the question a landlord is actually asking when
  // they arrive, and because the agency-seeking phrasing had no home on
  // the site: a keyword audit found "property management company
  // nairobi", "property management companies in nairobi" and
  // "property management services nairobi" claimed by no page, while
  // the singular abstract noun was claimed twice over. The plural and
  // the word "company" are what somebody shopping for a firm types.
  {
    q: "How do I choose a property management company in Nairobi?",
    a: "Ask four questions and the field narrows fast. What is the fee, and what gets added to it later? Will you send an itemised monthly statement with receipts, or a figure on WhatsApp? Do you take commission from contractors or listing platforms, because that decides whether a repair quote is in your interest or theirs? And what does leaving cost, since a company confident in the service does not need an exit fee to keep you. Any property management company in Nairobi should answer all four in writing before you sign. Ours are answered on our pricing page.",
  },
  {
    q: "What is your management fee?",
    a: "For long-term management we charge 10% of rent collected. For Airbnb and short-stay we charge 20% of revenue. Tenant finding only is a one-time fee equivalent to one month's rent. No hidden charges, no surprise deductions.",
  },
  {
    q: "How do you remit rent to my foreign account?",
    a: "We collect rent locally in KES or GHS, convert at a transparent wholesale FX rate, and wire USD to your bank account in Europe, the UK, USA, UAE or Canada. You receive a statement every month showing every shilling collected and every cent remitted.",
  },
  {
    q: "What currency do you collect and remit in?",
    a: "We collect in local currency (KES in Nairobi, GHS in Accra) and remit in US dollars by default. We can also remit in EUR, GBP or AED on request. FX is done at wholesale interbank rate with the spread disclosed on every statement.",
  },
  {
    q: "Do I need to be in Kenya or Ghana to sign you on?",
    a: "No. Everything from the first call to contract signing happens remotely. Documents are signed electronically and witnessed under Kenyan or Ghanaian law where required. Your first visit to the property can be long after you've started earning.",
  },
  {
    q: "How do you vet tenants?",
    a: "Every applicant goes through ID verification, employer confirmation, income verification, referee checks and a face-to-face interview. For corporate tenants we verify the entity and signatory. We only present shortlisted tenants to you for final approval, and nothing is signed without you.",
  },
  {
    q: "What happens if a tenant doesn't pay?",
    a: "We chase on day one, not day thirty. Our lease agreements are enforceable and we have legal partners in both Nairobi and Accra who can serve notice and begin eviction proceedings within the statutory window. You'll know within 48 hours of the first missed payment.",
  },
  {
    q: "What happens to my property if Goldstay closes?",
    a: "Your property is yours. Your tenant relationship is yours. Your bank details stay on your own accounts. If we ever wound down, every landlord would receive a full onboarding pack within 14 days: tenant contact, lease, statements, vendor list, keys. No lock-in is built into our operating model.",
  },
  {
    q: "Do you manage Airbnb properties?",
    a: "Yes. We run full short-stay operations including listing creation, dynamic pricing, guest communication, cleaning and maintenance. We pay only the portion of our fee that corresponds to revenue actually collected. We do not guarantee a specific revenue number, we guarantee the execution.",
  },
  {
    q: "Can Goldstay help me buy a property I don't own yet?",
    a: "Yes. Our Property Sourcing service is built for diaspora buyers who want to buy remotely without getting burned. We search to your brief, run in-person inspections, negotiate the price, verify the title with our property lawyers, and hand you a turnkey asset at completion. The service is free for you as the buyer.",
  },
  {
    q: "Who pays for repairs and maintenance?",
    a: "You do. It's your asset, after all. But the job is entirely ours. We source quotes, supervise the work, pay vendors directly from your collected rent, and send you the receipts. Anything under USD 50 is handled without disturbing you. Anything between USD 50 and USD 250 appears on your statement with a photo receipt. Anything above USD 250 is pre-approved with you in writing before we spend a shilling.",
  },
  {
    q: "How is Goldstay different from my current local agent?",
    a: "Three things: we live on the ground full time, our entire operating model is built around diaspora reporting and USD remittance, and we take zero commissions from contractors or listing platforms. If your current agent offers all three of those and you're happy, we'd genuinely tell you to stay.",
  },
];

// Returns the operational FAQ with cross-city references swapped out so
// a reader on /nairobi only sees Nairobi/Kenya phrasing and a reader on
// /accra only sees Accra/Ghana phrasing. The homepage still uses the
// unscoped `faq` because it serves both markets.
export function localizedFaq(city: "nairobi" | "accra") {
  const cityName = city === "nairobi" ? "Nairobi" : "Accra";
  const country = city === "nairobi" ? "Kenya" : "Ghana";
  const countryAdj = city === "nairobi" ? "Kenyan" : "Ghanaian";
  const currency = city === "nairobi" ? "KES" : "GHS";
  const currencyWord = city === "nairobi" ? "shilling" : "cedi";
  const currencyFull =
    city === "nairobi" ? "Kenyan shillings (KES)" : "Ghanaian cedis (GHS)";

  return [
    faq[0],
    {
      q: "How do you remit rent to my foreign account?",
      a: `We collect rent in ${cityName} in ${currency}, convert at a transparent wholesale FX rate, and wire USD to your bank account in Europe, the UK, USA, UAE or Canada. You receive a statement every month showing every ${currencyWord} collected and every cent remitted.`,
    },
    {
      q: "What currency do you collect and remit in?",
      a: `In ${cityName} we collect in ${currencyFull} and remit in US dollars by default. We can also remit in EUR, GBP or AED on request. FX is done at wholesale interbank rate with the spread disclosed on every statement.`,
    },
    {
      q: `Do I need to be in ${country} to sign you on?`,
      a: `No. Everything from the first call to contract signing happens remotely. Documents are signed electronically and witnessed under ${countryAdj} law where required. Your first visit to the property can be long after you've started earning.`,
    },
    faq[4],
    {
      q: "What happens if a tenant doesn't pay?",
      a: `We chase on day one, not day thirty. Our lease agreements are enforceable and we have ${countryAdj} legal partners in ${cityName} who can serve notice and begin eviction proceedings within the statutory window. You'll know within 48 hours of the first missed payment.`,
    },
    faq[6],
    faq[7],
    {
      q: `Can Goldstay help me buy a property in ${cityName}?`,
      a: `Yes. Our Property Sourcing service is built for diaspora buyers who want to buy in ${cityName} remotely without getting burned. We search to your brief, run in-person inspections, negotiate the price, verify the title with our ${countryAdj} property lawyers, and hand you a turnkey asset at completion. The service is free for you as the buyer.`,
    },
    {
      q: "Who pays for repairs and maintenance?",
      a: `You do. It's your asset, after all. But the job is entirely ours. We source quotes, supervise the work, pay vendors directly from your collected rent, and send you the receipts. Anything under USD 50 is handled without disturbing you. Anything between USD 50 and USD 250 appears on your statement with a photo receipt. Anything above USD 250 is pre-approved with you in writing before we spend a ${currencyWord}.`,
    },
    {
      q: `How is Goldstay different from my current ${cityName} agent?`,
      a: `Three things: we live in ${cityName} full time, our entire operating model is built around diaspora reporting and USD remittance, and we take zero commissions from contractors or listing platforms. If your current ${cityName} agent offers all three of those and you're happy, we'd genuinely tell you to stay.`,
    },
  ];
}

export const painPoints = [
  {
    title: "Unreliable Agents",
    body: "Local agents who stop communicating after the first month and go silent when it matters most.",
  },
  {
    title: "Late Rent Payments",
    body: "Chasing tenants from six thousand miles away is exhausting, awkward and rarely effective.",
  },
  {
    title: "Maintenance Surprises",
    body: "Finding out about a burst pipe or damaged floor six months after the fact, with no invoices to show.",
  },
  {
    title: "Currency Friction",
    body: "Collecting rent in KES or GHS and wrestling with conversion, wire fees and timing every single month.",
  },
];

export const differentiators = [
  {
    title: "Based On The Ground",
    body: "We are physically present in both Nairobi and Accra. Not remote agents who've never seen your property.",
  },
  {
    title: "USD Remittances",
    body: "Rent collected locally and wired to your foreign bank every month in US dollars. No conversion headaches.",
  },
  {
    title: "Full Transparency",
    body: "Monthly statements showing every shilling collected and every expense incurred. Access your dashboard anytime.",
  },
  {
    title: "Diaspora Specialists",
    body: "We were built specifically for landlords living abroad. We understand your situation because we've lived it.",
  },
];

export const steps = [
  {
    n: "01",
    title: "Contact Us",
    body: "Message us on WhatsApp or fill in the form. We'll call you within 2 hours during business hours.",
  },
  {
    n: "02",
    title: "We Assess Your Property",
    body: "Virtual or in-person assessment. We advise on pricing, furnishing and the optimal rental strategy.",
  },
  {
    n: "03",
    title: "We Handle Everything",
    body: "Tenant sourcing, management, maintenance and monthly USD remittances. You do nothing.",
  },
];
