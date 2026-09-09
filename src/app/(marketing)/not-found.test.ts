import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

// The 404 page and the catch-all that routes to it are easy to break
// without noticing, because nothing links to them and a broken 404 is
// invisible until a real visitor hits a real dead link.
const MARKETING = join(process.cwd(), "src/app/(marketing)");
const NOT_FOUND = join(MARKETING, "not-found.tsx");
const CATCH_ALL = join(MARKETING, "[...notFound]/page.tsx");

describe("marketing 404", () => {
  it("keeps the catch-all that gives unmatched URLs the branded page", () => {
    // Without this file an unmatched URL falls through to Next's own
    // unstyled "404: This page could not be found."
    expect(existsSync(CATCH_ALL)).toBe(true);
    expect(readFileSync(CATCH_ALL, "utf8")).toMatch(/notFound\(\)/);
  });

  it("still has no root layout, which is why the catch-all is needed", () => {
    // If someone later collapses the two root layouts into a single
    // src/app/layout.tsx, a plain src/app/not-found.tsx starts working
    // and this whole arrangement can be deleted. This assertion is the
    // reminder to revisit it rather than a constraint worth keeping.
    expect(existsSync(join(process.cwd(), "src/app/layout.tsx"))).toBe(false);
  });

  it("does not render Navbar or Footer, which cannot work here", () => {
    // Both render empty in the not-found shell. Importing them looks
    // like it should work, so the failure is worth pinning: the
    // destination cards are the page's only navigation.
    const source = readFileSync(NOT_FOUND, "utf8");
    expect(source).not.toMatch(/from "@\/components\/(Navbar|Footer)"/);
  });

  it("sets the font variables the error shell does not provide", () => {
    // <html id="__next_error__"> carries no className, so font-serif
    // falls back to the browser default unless the variables are set
    // on an element inside the page.
    expect(readFileSync(NOT_FOUND, "utf8")).toMatch(
      /instrumentSerif\.variable/,
    );
  });

  it("points every destination at a route that exists", () => {
    const source = readFileSync(NOT_FOUND, "utf8");
    const hrefs = [...source.matchAll(/href="(\/[a-z0-9/-]*)"/g)].map(
      (m) => m[1],
    );

    expect(hrefs.length).toBeGreaterThan(0);

    for (const href of hrefs) {
      if (href === "/") continue;
      const segment = href.replace(/^\//, "");
      expect(
        existsSync(join(MARKETING, segment, "page.tsx")),
        `404 page links to ${href}, which has no page.tsx`,
      ).toBe(true);
    }
  });
});
