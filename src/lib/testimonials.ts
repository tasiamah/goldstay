// What landlords say, in their own words.
//
// This array is the single source for both the visible testimonials
// section and the Review nodes in the structured data, so the two can
// never disagree. Google treats schema that claims reviews a page does
// not display as a policy violation, and the usual way a site ends up
// there is by keeping the markup and the markup's subject in two
// different files.
//
// ---------------------------------------------------------------
// It is empty on purpose. Do not seed it with examples.
// ---------------------------------------------------------------
//
// Every component that reads it renders nothing while it is empty, so
// shipping with no testimonials is a smaller section, not a broken one.
// An invented quote is the same category of mistake as a phantom office
// address — see the note on `offices` in site.ts — except worse, because
// it puts words in a named person's mouth.
//
// To add one:
//
//   1. Ask the landlord. Their own phrasing is the point; a quote that
//      reads like marketing copy persuades nobody.
//   2. Get permission to use their name. If they would rather not be
//      named, use a first name and initial and set `nameIsPartial` so
//      the section can say so rather than looking evasive.
//   3. Put the same quote on the Google Business Profile if they are
//      willing. That is where reviews actually earn ranking: Google
//      does not show star ratings for a business's own reviews on its
//      own site, for either `review` or `aggregateRating` markup. The
//      value here is that a human reads it before enquiring.
//
// `rating` is deliberately absent from the type. An aggregate rating
// would produce no stars in search for a RealEstateAgent and would add
// a claim to defend, so there is nothing to gain by carrying one.

export type Testimonial = {
  // Verbatim. Trim only whitespace; do not tidy the grammar.
  quote: string;
  // The name they agreed to be published under.
  name: string;
  // True when `name` is shortened at their request, so the section can
  // be open about it instead of appearing to hide something.
  nameIsPartial?: boolean;
  // Where they live, which is the detail a diaspora reader checks
  // first: "Manchester, UK" carries more than "Landlord".
  location: string;
  // What we run for them, in their words or ours. Short.
  // e.g. "Two-bed in Kilimani, long let since 2025"
  context: string;
  // ISO date the testimonial was given. Used for datePublished in the
  // Review node, and to retire quotes that have gone stale.
  date: string;
};

export const testimonials: readonly Testimonial[] = [];
