import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

// The article catalogue has had its search snippets measured since the
// overrides landed, and catalogue.test.ts has held them there. The
// routes under src/app never were: check-snippets.mjs read only
// insights/posts, so it measured 387 articles and none of the pages
// that sell the service.
//
// Fourteen of those pages were overflowing when this was first
// measured, /tenant-finding at 1.7x the width Google renders. A
// truncated description is not a ranking penalty, but Google rewrites
// the snippet from page copy once it has to cut, so the sentence
// written to earn the click is replaced by whatever the crawler liked
// the look of. That is the low-CTR fault diagnosed from Search Console
// and fixed on the articles, and it was sitting on the money pages the
// whole time because nothing looked.
describe("route search snippets", () => {
  it("has no route title or description that Google will truncate", () => {
    let output: string;
    try {
      output = execFileSync(
        "node",
        ["scripts/check-snippets.mjs", "--routes", "--strict"],
        {
          encoding: "utf8",
          cwd: process.cwd(),
        },
      );
    } catch (err) {
      // The script prints the route and its width. Pass that through:
      // the failure should tell you which page to open.
      const e = err as { stdout?: string; stderr?: string };
      throw new Error(e.stdout ?? e.stderr ?? "check-snippets.mjs failed");
    }
    expect(output).toContain("No problems found.");
  });
});
