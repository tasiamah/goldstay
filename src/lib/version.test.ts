import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import {
  APP_VERSION,
  buildInfo,
  compareSemVer,
  formatBuildLabel,
  parseSemVer,
} from "./version";

// These tests are the enforcement mechanism for the release process, not
// just a check on a string. The version lives in three places that must
// agree — src/lib/version.ts, package.json and the top of CHANGELOG.md —
// and the point of asserting it here is that bumping one without the
// others fails CI rather than shipping a build whose version number is
// a lie.

const ROOT = path.resolve(__dirname, "../..");

function readRoot(file: string): string {
  return readFileSync(path.join(ROOT, file), "utf8");
}

// Version headings in the changelog, newest first, ignoring Unreleased.
function changelogVersions(): string[] {
  const body = readRoot("CHANGELOG.md");
  return [...body.matchAll(/^## \[(\d+\.\d+\.\d+)\]/gm)].map((m) => m[1]);
}

describe("the version is the same in all three places", () => {
  it("matches package.json", () => {
    const pkg = JSON.parse(readRoot("package.json")) as { version: string };
    expect(pkg.version).toBe(APP_VERSION);
  });

  it("matches the newest release heading in CHANGELOG.md", () => {
    // If this fails you have bumped the version without writing down
    // what changed, which is the failure the changelog exists to stop.
    expect(changelogVersions()[0]).toBe(APP_VERSION);
  });

  it("is a valid semantic version", () => {
    expect(parseSemVer(APP_VERSION)).not.toBeNull();
  });
});

describe("CHANGELOG.md structure", () => {
  it("has at least one released version", () => {
    expect(changelogVersions().length).toBeGreaterThan(0);
  });

  it("keeps an Unreleased section to collect work in progress", () => {
    expect(readRoot("CHANGELOG.md")).toMatch(/^## \[Unreleased\]/m);
  });

  it("lists releases newest first with no duplicates", () => {
    // Out-of-order or duplicated headings make the top entry — the one
    // every other test trusts — meaningless.
    const versions = changelogVersions();
    expect(new Set(versions).size).toBe(versions.length);

    for (let i = 1; i < versions.length; i++) {
      const newer = parseSemVer(versions[i - 1]);
      const older = parseSemVer(versions[i]);
      expect(newer, versions[i - 1]).not.toBeNull();
      expect(older, versions[i]).not.toBeNull();
      expect(
        compareSemVer(newer!, older!),
        `${versions[i - 1]} should sort above ${versions[i]}`,
      ).toBeGreaterThan(0);
    }
  });

  it("dates every release as YYYY-MM-DD", () => {
    const headings = [
      ...readRoot("CHANGELOG.md").matchAll(/^## \[(\d+\.\d+\.\d+)\] - (.+)$/gm),
    ];
    expect(headings.length).toBe(changelogVersions().length);
    for (const [, version, date] of headings) {
      expect(date.trim(), version).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(Number.isNaN(Date.parse(date.trim())), version).toBe(false);
    }
  });

  it("says something under the newest release", () => {
    // A version heading with nothing under it is worse than no entry:
    // it looks like the change was recorded when it was not.
    const body = readRoot("CHANGELOG.md");
    const newest = changelogVersions()[0];
    const start = body.indexOf(`## [${newest}]`);
    const rest = body.slice(start);
    const nextHeading = rest.indexOf("\n## ", 1);
    const section = nextHeading === -1 ? rest : rest.slice(0, nextHeading);
    // Strip the heading line itself before measuring.
    const content = section.split("\n").slice(1).join("\n").trim();
    expect(content.length).toBeGreaterThan(40);
  });
});

describe("parseSemVer", () => {
  it("parses a well-formed version", () => {
    expect(parseSemVer("1.2.3")).toEqual({ major: 1, minor: 2, patch: 3 });
    expect(parseSemVer("10.20.30")).toEqual({
      major: 10,
      minor: 20,
      patch: 30,
    });
  });

  it("tolerates surrounding whitespace", () => {
    expect(parseSemVer("  1.0.0 ")).toEqual({ major: 1, minor: 0, patch: 0 });
  });

  it("rejects anything that is not three integers", () => {
    // A leading "v" is how the git tag is written, not the version, and
    // accepting it here would let "v1.0.0" into package.json.
    for (const bad of ["v1.0.0", "1.0", "1.0.0.0", "1.0.x", "", "abc"]) {
      expect(parseSemVer(bad), bad).toBeNull();
    }
  });
});

describe("compareSemVer", () => {
  it("orders by major, then minor, then patch", () => {
    const v = (s: string) => parseSemVer(s)!;
    expect(compareSemVer(v("2.0.0"), v("1.9.9"))).toBeGreaterThan(0);
    expect(compareSemVer(v("1.2.0"), v("1.1.9"))).toBeGreaterThan(0);
    expect(compareSemVer(v("1.1.2"), v("1.1.1"))).toBeGreaterThan(0);
    expect(compareSemVer(v("1.1.1"), v("1.1.1"))).toBe(0);
    expect(compareSemVer(v("1.0.0"), v("1.0.1"))).toBeLessThan(0);
  });

  it("compares numerically, not as strings", () => {
    // "10" sorts before "9" lexically, which would put 1.10.0 below
    // 1.9.0 and break the changelog ordering test.
    const v = (s: string) => parseSemVer(s)!;
    expect(compareSemVer(v("1.10.0"), v("1.9.0"))).toBeGreaterThan(0);
  });
});

describe("build labelling", () => {
  it("shows the bare version when there is no deployed sha", () => {
    expect(
      formatBuildLabel({
        version: "1.0.0",
        sha: null,
        environment: "development",
      }),
    ).toBe("v1.0.0");
  });

  it("appends the short sha once deployed", () => {
    // Two deploys can share a version, so the sha is the only thing
    // that identifies which build an operator was actually looking at.
    expect(
      formatBuildLabel({
        version: "1.0.0",
        sha: "a1b2c3d",
        environment: "production",
      }),
    ).toBe("v1.0.0 · a1b2c3d");
  });

  it("reports the real version through buildInfo", () => {
    expect(buildInfo().version).toBe(APP_VERSION);
  });

  it("treats a machine with no Vercel env as development", () => {
    expect(buildInfo().environment).toBe("development");
  });
});
