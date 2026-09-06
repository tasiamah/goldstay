import { describe, expect, it } from "vitest";
import { formatRunSummary, type RunSummary } from "./remind";

// The runner itself talks to Postgres and Resend, so its scheduling
// decisions are tested in reminder-schedule.test.ts and its wording in
// reminder-email.test.ts. What is left here is the job summary, which
// matters more than it looks: it is the only thing the system-health
// page shows about a run, so an unhelpful string means an operator
// cannot tell a healthy quiet hour from a broken job.

const EMPTY: RunSummary = {
  considered: 0,
  emailed: 0,
  escalated: 0,
  failed: 0,
  waited: 0,
  skippedSteps: 0,
  capped: false,
  dryRun: false,
  outcomes: [],
};

describe("formatRunSummary", () => {
  it("reports a quiet run as quiet rather than as nothing", () => {
    expect(formatRunSummary({ ...EMPTY, considered: 6, waited: 6 })).toBe(
      "considered=6 emailed=0 escalated=0 failed=0 waited=6",
    );
  });

  it("reports what a working run did", () => {
    expect(
      formatRunSummary({
        ...EMPTY,
        considered: 9,
        emailed: 2,
        escalated: 1,
        waited: 6,
      }),
    ).toBe("considered=9 emailed=2 escalated=1 failed=0 waited=6");
  });

  it("surfaces failures", () => {
    const out = formatRunSummary({ ...EMPTY, considered: 3, failed: 2 });
    expect(out).toContain("failed=2");
  });

  it("only mentions superseded steps when some were superseded", () => {
    // Noise in the common case would make the interesting case harder
    // to spot on the health page.
    expect(formatRunSummary(EMPTY)).not.toContain("superseded");
    expect(formatRunSummary({ ...EMPTY, skippedSteps: 3 })).toContain(
      "superseded=3",
    );
  });

  it("flags a capped run, since it means work is left over", () => {
    expect(formatRunSummary(EMPTY)).not.toContain("capped");
    expect(formatRunSummary({ ...EMPTY, capped: true })).toContain(
      "capped=true",
    );
  });

  it("flags a dry run, so it is never mistaken for real sends", () => {
    expect(formatRunSummary({ ...EMPTY, dryRun: true })).toContain(
      "dryRun=true",
    );
  });
});
