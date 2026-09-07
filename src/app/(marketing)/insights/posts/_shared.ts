// Shared author records and PostMeta type, factored out of the
// posts/index.ts barrel so individual post files can import authors
// without forming a circular dependency with the registry. The
// registry imports the post files; if those post files reached back
// into ./index for `authors`, the import graph cycles and the first
// access of `authors` hits a TDZ during build (`Cannot access 'I'
// before initialization`).

export type Author = {
  name: string;
  role: string;
  bio: string;
  url?: string;
  image?: string;
  // Whether this byline is a person or one of our editorial desks.
  //
  // It exists for the Article schema rather than for the page. Every
  // post used to emit `author: { "@type": "Person" }` regardless of
  // byline, which asserted that "Goldstay Editors" and "Goldstay Legal
  // Desk" were human beings with job titles. That is false for 324 of
  // the 350 posts, and false in the specific way that reads worst: a
  // masthead of Person entities that resolve to nobody is the shape of
  // a content farm, not of a firm that publishes what it learns. A
  // desk byline is honest and normal, but it is an Organization
  // writing, so it has to say so.
  kind: "person" | "desk";
};

export type Country = "kenya" | "ghana";

export type PostMeta = {
  slug: string;
  // The editorial headline. Rendered as the article's H1, as the
  // Article schema headline, and on every listing card.
  title: string;
  // The standfirst. Rendered under the H1 and as the blurb on listing
  // cards, so it is written to be read on the page rather than to fit
  // a search result.
  description: string;
  // Search-result overrides, used only in the <title> and meta
  // description. Both are optional and fall back to the editorial copy
  // above.
  //
  // They exist because the two jobs genuinely conflict. Google gives a
  // title about 600px and a description about 960px, and a headline
  // written to earn a click on the page ("Property valuation in Kenya:
  // how it actually works, and why your number differs from the
  // bank's") is a good H1 and a title that gets cut off mid-clause.
  // Shortening the H1 to fit a search result would take the editorial
  // quality off the page to serve a surface the reader never sees.
  //
  // Set these only where the editorial copy overflows. Widths are
  // asserted by scripts/check-snippets.mjs, which runs in the test
  // suite, so an article that overflows without an override fails.
  metaTitle?: string;
  metaDescription?: string;
  publishedAt: string;
  updatedAt?: string;
  readingMinutes: number;
  author: Author;
  tags: readonly string[];
  // Country attribution for host-aware routing. Kenya posts are
  // canonical on goldstay.com (with goldstay.co.ke as an en-KE
  // alternate). Ghana posts are canonical on goldstay.com.gh.
  // Requests to the "wrong" host 308-redirect to the canonical
  // host so each article ranks under one domain only.
  country: Country;
  // Hero image is rendered above the title on the post page and as
  // the OpenGraph image when the post is shared. /images/insights/<slug>.jpg
  // by convention; falls back to the city skyline if missing so we
  // never ship a broken share unfurl.
  heroImage?: string;
  heroAlt?: string;
};

// Single source of authors. Keeping bios here means every post page,
// listing card and Article JSON-LD entity reads from the same
// canonical record. Add a new author by extending this map.
//
// Most articles are bylined to the editorial team rather than to a
// single individual, so the catalogue reads as a coherent body of
// work rather than one person's blog. The desk-level bylines
// (Editors, Research, Legal) cover the bulk of the catalogue;
// Poonam's name appears on operational pieces where her on-the-
// ground experience in Nairobi is the actual source of the
// reporting.
export const authors: Record<string, Author> = {
  editors: {
    name: "Goldstay Editors",
    role: "Editorial Team",
    bio: "The Goldstay Editors team writes and reviews the Insights catalogue. Pieces are reported from our Nairobi and Accra offices, drawing on the property advisory, sourcing and management work the firm runs day to day for diaspora and resident clients.",
    image: "/images/team/editors.png",
    kind: "desk",
  },
  research: {
    name: "Goldstay Research",
    role: "Market Research Desk",
    bio: "Goldstay Research covers macro property data, neighbourhood pricing, rental yields and policy across the Kenyan and Ghanaian markets. The desk publishes the firm's view on market trends, oversupply, currency and the longer term direction of property values.",
    image: "/images/team/research.png",
    kind: "desk",
  },
  legal: {
    name: "Goldstay Legal Desk",
    role: "Legal & Compliance",
    bio: "The Goldstay Legal Desk covers Kenyan and Ghanaian property law, title diligence, sale agreements, stamp duty, succession and the regulatory environment that property owners and investors encounter. Pieces are written in collaboration with our advocate partners.",
    image: "/images/team/legal.png",
    kind: "desk",
  },
  poonam: {
    name: "Poonam Arora",
    role: "General Manager, Nairobi",
    bio: "Poonam runs Goldstay's day-to-day operations on the ground in Nairobi. She has handed over more than a hundred remote-managed homes to diaspora landlords and personally fronts every KRA, county and SRA filing on their behalf.",
    image: "/images/team/poonam.png",
    kind: "person",
  },
};
