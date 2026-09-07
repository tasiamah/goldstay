import { describe, expect, it } from "vitest";
import { testimonials } from "./testimonials";

// Testimonials are the one kind of content on the site where a mistake
// is not a typo but a fabricated quote attributed to a named person.
// These checks are cheap and they run on every commit, so the cost of
// keeping them is lower than the cost of one seeded example escaping
// into production because it looked plausible in review.
//
// All of them pass trivially while the array is empty. They start
// earning their keep the moment somebody adds the first entry.
describe("testimonials", () => {
  it("is empty, or every entry is complete", () => {
    for (const t of testimonials) {
      expect(t.quote.trim().length, `quote for ${t.name}`).toBeGreaterThan(0);
      expect(t.name.trim().length, "name").toBeGreaterThan(0);
      expect(t.location.trim().length, `location for ${t.name}`).toBeGreaterThan(0);
      expect(t.context.trim().length, `context for ${t.name}`).toBeGreaterThan(0);
    }
  });

  it("dates are real ISO dates, not in the future", () => {
    for (const t of testimonials) {
      expect(t.date, `date for ${t.name}`).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      const parsed = new Date(t.date);
      expect(Number.isNaN(parsed.getTime()), `date for ${t.name}`).toBe(false);
      // datePublished feeds the Review node. A future date is either a
      // typo or an invented quote; both want catching here.
      expect(parsed.getTime(), `date for ${t.name} is in the future`).toBeLessThanOrEqual(
        Date.now(),
      );
    }
  });

  it("carries no placeholder or sample copy", () => {
    // The failure mode this exists for: someone adds a realistic-looking
    // example to see the section render, and it ships.
    const banned = [
      "lorem",
      "ipsum",
      "john doe",
      "jane doe",
      "example",
      "placeholder",
      "sample",
      "test testimonial",
      "your name here",
      "tbd",
      "todo",
      "coming soon",
    ];
    for (const t of testimonials) {
      const haystack = `${t.quote} ${t.name} ${t.location} ${t.context}`.toLowerCase();
      for (const word of banned) {
        expect(haystack, `${t.name} contains "${word}"`).not.toContain(word);
      }
    }
  });

  it("quotes read like a person, not a brochure", () => {
    for (const t of testimonials) {
      // Long enough to say something, short enough to be read. A
      // one-liner ("Great service!") is not persuasive and a 600
      // character essay does not get read.
      expect(t.quote.length, `quote for ${t.name} is too short to be worth showing`).toBeGreaterThan(40);
      expect(t.quote.length, `quote for ${t.name} is too long for a card`).toBeLessThan(500);
      // Curly quotes are added by the component. A quote that arrives
      // already wrapped renders as ""like this"".
      expect(t.quote.trim().startsWith("\u201c"), `quote for ${t.name} is pre-wrapped`).toBe(false);
      expect(t.quote.trim().startsWith('"'), `quote for ${t.name} is pre-wrapped`).toBe(false);
    }
  });

  it("does not show the same person twice", () => {
    const keys = testimonials.map((t) => `${t.name}|${t.date}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
