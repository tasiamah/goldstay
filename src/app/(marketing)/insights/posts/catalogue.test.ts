import { execFileSync } from "node:child_process";
import { describe, expect, it } from "vitest";

// Runs scripts/check-insights.mjs as part of the suite.
//
// The script existed and passed for months, then quietly accumulated 53
// links pointing at slugs that were never written — every one a live 404
// reached from a published article. Nothing ran it, so nothing noticed.
// A checker only guards what it is wired into, so it is wired in here:
// the pre-push list in AGENTS.md ends with `npx vitest run`, and this is
// what makes that command cover the catalogue.
//
// The script is the single source of truth for the rules; this test only
// runs it and surfaces its output on failure, so the two cannot drift.
describe("insights catalogue", () => {
  it("has no broken internal links, slug drift or house-style violations", () => {
    let output: string;
    try {
      output = execFileSync("node", ["scripts/check-insights.mjs"], {
        encoding: "utf8",
        cwd: process.cwd(),
      });
    } catch (err) {
      const e = err as { stdout?: string; stderr?: string };
      // The script prints one line per problem and exits non-zero. Pass
      // that straight through: the failure message should tell you which
      // article to open, not just that a count changed.
      throw new Error(e.stdout ?? e.stderr ?? "check-insights.mjs failed");
    }
    expect(output).toContain("No problems found.");
  });
});
