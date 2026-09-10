import { describe, expect, it } from "vitest";
import { ratingClaim } from "./site";

// The site makes exactly one claim that is checkable rather than
// subjective, and these tests exist to stop it becoming a claim nobody
// can check.
//
// Not testing that the claim is true — no test can know that, since it
// depends on other companies' Google ratings. Testing that whoever
// edits it cannot drop the things that make it defensible: a source, a
// date somebody verified it, and wording that is actually a superlative
// rather than a hedge.
describe("ratingClaim", () => {
  it("carries a third-party source, not our own markup", () => {
    // Self-published stars are not substantiation, for a reader or for
    // Google Ads. It has to point somewhere we do not control the
    // number.
    expect(ratingClaim.sourceUrl).toMatch(/^https:\/\/www\.google\.com\/maps\//);
    expect(ratingClaim.sourceLabel.length).toBeGreaterThan(8);
  });

  it("records when it was last verified, as a real past date", () => {
    // A superlative with no verification date cannot be audited, and
    // this one goes stale on its own as competitors gain reviews.
    expect(ratingClaim.verifiedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);

    const verified = new Date(`${ratingClaim.verifiedOn}T00:00:00Z`);
    expect(Number.isNaN(verified.getTime())).toBe(false);
    // A future date would mean the claim was never actually checked.
    expect(verified.getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("is stated as a superlative rather than hedged", () => {
    // "One of the highest-rated" persuades nobody and still has to be
    // defended, so it is the worst of both. If the claim stops being
    // true the answer is to delete it, not to soften it.
    expect(ratingClaim.text).toMatch(/highest-rated/i);
    expect(ratingClaim.text).not.toMatch(/one of|among|amongst/i);
  });

  it("names the market it is a superlative within", () => {
    // "Highest-rated property manager" unqualified is a claim about
    // the planet. The scope is what makes it provable.
    expect(ratingClaim.text).toMatch(/Nairobi/);
  });
});
