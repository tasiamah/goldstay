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
};

export type Country = "kenya" | "ghana";

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
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
  },
  research: {
    name: "Goldstay Research",
    role: "Market Research Desk",
    bio: "Goldstay Research covers macro property data, neighbourhood pricing, rental yields and policy across the Kenyan and Ghanaian markets. The desk publishes the firm's view on market trends, oversupply, currency and the longer term direction of property values.",
    image: "/images/team/research.png",
  },
  legal: {
    name: "Goldstay Legal Desk",
    role: "Legal & Compliance",
    bio: "The Goldstay Legal Desk covers Kenyan and Ghanaian property law, title diligence, sale agreements, stamp duty, succession and the regulatory environment that property owners and investors encounter. Pieces are written in collaboration with our advocate partners.",
    image: "/images/team/legal.png",
  },
  poonam: {
    name: "Poonam Arora",
    role: "General Manager, Nairobi",
    bio: "Poonam runs Goldstay's day-to-day operations on the ground in Nairobi. She has handed over more than a hundred remote-managed homes to diaspora landlords and personally fronts every KRA, county and SRA filing on their behalf.",
    image: "/images/team/poonam.png",
  },
};
