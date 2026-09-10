// The platform's version number, and what build is actually running.
//
// APP_VERSION is the single source of truth. package.json and the top
// entry of CHANGELOG.md are both asserted against it in version.test.ts,
// so the three cannot drift: bump the version without writing a
// changelog entry and the test suite fails.
//
// Deliberately a plain constant rather than an import of package.json.
// Importing that file would work — resolveJsonModule is on — but it
// would also mean that the day someone renders the version in a client
// component, the entire dependency list ships to the browser. A string
// cannot do that.

export const APP_VERSION = "1.45.0";

// Semantic versioning, tagged on GitHub as v<APP_VERSION>:
//   MAJOR — breaking change to a contract someone outside this repo
//           relies on: a data migration that is not backwards
//           compatible, a removed route, a changed agreement template.
//   MINOR — new capability, backwards compatible.
//   PATCH — fix or internal change with no new capability.
export type ReleaseKind = "major" | "minor" | "patch";

// Vercel injects these at build time and they are readable at runtime on
// the server. Absent in local development, which is itself the useful
// signal — "dev" means you are not looking at a deployed build.
export function buildSha(): string | null {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA;
  return sha ? sha.slice(0, 7) : null;
}

export function buildEnvironment(): "production" | "preview" | "development" {
  const env = process.env.VERCEL_ENV;
  if (env === "production" || env === "preview") return env;
  return "development";
}

export type BuildInfo = {
  version: string;
  sha: string | null;
  environment: ReturnType<typeof buildEnvironment>;
};

export function buildInfo(): BuildInfo {
  return {
    version: APP_VERSION,
    sha: buildSha(),
    environment: buildEnvironment(),
  };
}

// "v1.0.0", or "v1.0.0 · a1b2c3d" once deployed. The bare version is
// what an operator quotes in a bug report; the sha is what tells us
// which build they were actually on when the version has not moved.
export function formatBuildLabel(info: BuildInfo = buildInfo()): string {
  const base = `v${info.version}`;
  return info.sha ? `${base} · ${info.sha}` : base;
}

// Parses "1.2.3" into comparable parts. Returns null for anything that
// is not exactly three dot-separated integers, so the tests can reject
// a malformed version rather than silently sorting it wrong.
export type SemVer = { major: number; minor: number; patch: number };

export function parseSemVer(raw: string): SemVer | null {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(raw.trim());
  if (!match) return null;
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
  };
}

export function compareSemVer(a: SemVer, b: SemVer): number {
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.patch - b.patch;
}
