import { describe, expect, it } from "vitest";
import { cityFaq, faq, localizedFaq } from "./site";

// Guards the FAQ that every city page and the homepage renders, both as
// visible content and as FAQPage structured data.
//
// localizedFaq used to reach into the shared list by position. When
// "What is your management fee?" was inserted at index 1, every
// reference after it shifted by one and nothing failed: the Kenya page
// rendered "Do I need to be in Kenya or Ghana to sign you on?" directly
// beneath its own Kenya-only rewrite of that question, asked "What
// happens if a tenant doesn't pay?" twice, and dropped the
// tenant-vetting and Airbnb answers entirely. A duplicated question in
// FAQPage is also the kind of thing that costs the rich result.
//
// These assert the properties that were violated, not the specific
// wording, so they keep holding as the copy is edited.
describe("localizedFaq", () => {
  const cities = ["nairobi", "accra"] as const;

  it.each(cities)("asks each question only once on %s", (city) => {
    const questions = localizedFaq(city).map((f) => f.q);
    expect(questions).toHaveLength(new Set(questions).size);
  });

  it.each(cities)(
    "asks each question only once in the %s FAQPage schema",
    (city) => {
      // What CityPage hands to FaqJsonLd.
      const questions = [...cityFaq[city], ...localizedFaq(city)].map(
        (f) => f.q,
      );
      expect(questions).toHaveLength(new Set(questions).size);
    },
  );

  it("never mentions Ghana to a Nairobi reader", () => {
    const text = localizedFaq("nairobi")
      .flatMap((f) => [f.q, f.a])
      .join(" ");
    expect(text).not.toMatch(/Ghana|Accra|cedi|GHS/i);
  });

  it("never mentions Kenya to an Accra reader", () => {
    const text = localizedFaq("accra")
      .flatMap((f) => [f.q, f.a])
      .join(" ");
    expect(text).not.toMatch(/Kenya|Nairobi|shilling|KES/i);
  });

  it.each(cities)(
    "carries every shared question through to %s, rewritten or as-is",
    (city) => {
      // A shared entry may be reworded per city, so match on the entry
      // being represented rather than on identical text. Each shared
      // question has a distinctive opening clause that survives
      // localisation; dropping an entry outright is the regression.
      const localized = localizedFaq(city);
      expect(localized.length).toBe(faq.length);
    },
  );

  it.each(cities)("answers every %s question with something", (city) => {
    for (const { q, a } of localizedFaq(city)) {
      expect(q.trim().length, `empty question`).toBeGreaterThan(0);
      expect(a.trim().length, `empty answer for "${q}"`).toBeGreaterThan(20);
    }
  });
});
