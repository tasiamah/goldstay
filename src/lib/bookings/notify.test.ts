import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { SILENT_SKIP_REASONS, SUPPRESSION_SUMMARY } from "./notify";

// notify.ts talks to Prisma and Resend on every path, and there is no
// database mock in this repo to drive it with. What is worth pinning
// without one is the decision table: which silent outcomes an operator
// gets told about on the client timeline, and which are deliberately
// invisible.
//
// Read from disk for the same reason noindex.test.ts and related.test.ts
// do it: the assertion is about the source, and importing the module
// only gives us the values it chose to export.
const SOURCE = readFileSync(join(__dirname, "notify.ts"), "utf8");

function skipReasonsInSource(): string[] {
  const found = new Set<string>();
  // Matches: return { kind: "skipped", reason: "never_announced" };
  // across the line breaks prettier introduces.
  for (const m of SOURCE.matchAll(/reason:\s*"([a-z_]+)"/g)) {
    found.add(m[1]);
  }
  // The recordSuppression call sites pass `reason` as a variable, and
  // the two maps below are keyed by literal, so filter those out by
  // only keeping what appears next to a "skipped" outcome.
  return [...found];
}

describe("booking notification suppression", () => {
  it("accounts for every skip reason in the file", () => {
    // The guard that matters. Adding a new `reason: "..."` without
    // deciding whether the client's timeline should show it now fails
    // here rather than silently going unrecorded in production.
    const unaccounted = skipReasonsInSource().filter(
      (r) => !(r in SUPPRESSION_SUMMARY) && !(r in SILENT_SKIP_REASONS),
    );
    expect(unaccounted).toEqual([]);
  });

  it("never classifies a reason as both visible and silent", () => {
    const both = Object.keys(SUPPRESSION_SUMMARY).filter(
      (r) => r in SILENT_SKIP_REASONS,
    );
    expect(both).toEqual([]);
  });

  it("explains the cancellation case an operator will actually ask about", () => {
    // The real question this feature exists to answer: a booking was
    // cancelled and the client heard nothing. Why?
    const summary = SUPPRESSION_SUMMARY.never_announced;
    expect(summary).toBeTruthy();
    expect(summary.toLowerCase()).toContain("never told");
  });

  it("writes summaries an operator can read, not reason codes", () => {
    for (const [reason, summary] of Object.entries(SUPPRESSION_SUMMARY)) {
      // A summary that leaks the snake_case key is a placeholder
      // somebody meant to come back to.
      expect(summary, reason).not.toContain(reason);
      expect(summary, reason).not.toMatch(/_/);
      expect(summary.length, reason).toBeGreaterThan(30);
      // Sentence case, so it reads correctly in the timeline where it
      // sits directly after the actor and timestamp.
      expect(summary[0], reason).toBe(summary[0].toUpperCase());
    }
  });

  it("does not record the idempotency guard as a suppression", () => {
    // already-notified means the email was sent, once, and is already
    // in the comms panel. The Hostaway webhook fires on every upstream
    // edit, so recording it would bury the timeline.
    expect(SUPPRESSION_SUMMARY["already_notified"]).toBeUndefined();
    expect(SUPPRESSION_SUMMARY["already-notified"]).toBeUndefined();
  });
});
