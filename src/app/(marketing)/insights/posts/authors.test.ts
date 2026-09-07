import { describe, expect, it } from "vitest";
import { authors } from "./_shared";

// Guards the one distinction the Article schema depends on.
//
// Every post used to emit `author: { "@type": "Person" }` whatever the
// byline said, so 324 of 350 articles told Google that "Goldstay
// Editors", "Goldstay Research" and "Goldstay Legal Desk" were people.
// Publishing under a desk is normal and honest; asserting in structured
// data that the desk is a human is neither, and a masthead of Person
// entities that resolve to no actual person is a content-farm signal on
// a site trying to be read as an operator.
//
// ArticleLayout now branches on `kind`. These tests exist so that the
// next author added to the record cannot silently get it wrong, since
// the failure mode is invisible on the page — the byline renders
// identically either way and only the JSON-LD is wrong.
describe("insights authors", () => {
  it("declares every byline as either a person or a desk", () => {
    for (const [key, author] of Object.entries(authors)) {
      expect(["person", "desk"], `authors.${key}.kind`).toContain(author.kind);
    }
  });

  it("names desk bylines after the firm, and person bylines after a person", () => {
    for (const [key, author] of Object.entries(authors)) {
      if (author.kind === "desk") {
        // A desk byline resolves to the Organization entity, so the
        // name has to actually be the organisation. "Jane Doe" as a
        // desk would put a real person's name on a company node.
        expect(author.name, `authors.${key}.name`).toMatch(/^Goldstay\b/);
      } else {
        // And the converse: a Person node named "Goldstay Something"
        // is the bug this whole distinction exists to prevent.
        expect(author.name, `authors.${key}.name`).not.toMatch(/^Goldstay\b/);
      }
    }
  });

  it("gives every byline a role and a bio", () => {
    for (const [key, author] of Object.entries(authors)) {
      expect(author.role.trim(), `authors.${key}.role`).not.toBe("");
      expect(author.bio.trim().length, `authors.${key}.bio`).toBeGreaterThan(40);
    }
  });
});
