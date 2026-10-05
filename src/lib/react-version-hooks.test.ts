import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// `useActionState` compiles cleanly on this project but does not exist
// at runtime. Next pulls in @types/react's canary definitions, which
// declare the hook, while the installed react is 18.3.1, where it was
// never shipped — it landed in React 19. So `tsc`, `next lint` and
// `next build` all pass and the page throws
// "useActionState is not a function" the moment a browser opens it.
//
// That is how the admin property page 500'd in production for every
// short-term unit: one client component used the React 19 hook and
// every automated gate we run said it was fine.
//
// The rest of the codebase uses `useFormState` + `useFormStatus` from
// react-dom, which is the React 18 spelling. This test holds that line
// until react itself is upgraded, at which point delete it and migrate
// the call sites together.
const BANNED = [
  "useActionState",
  // Same story: React 19 only, declared by the canary types.
  "useOptimistic",
];

const SRC = join(process.cwd(), "src");

// This file names the banned hooks in order to ban them, so it has to
// leave itself out of its own scan.
const SELF = "react-version-hooks.test.ts";

function sourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...sourceFiles(full));
    } else if (/\.tsx?$/.test(entry.name) && entry.name !== SELF) {
      out.push(full);
    }
  }
  return out;
}

describe("React 18 runtime compatibility", () => {
  const files = sourceFiles(SRC);

  it("scans the whole source tree", () => {
    // Guards the guard: if the walk silently returned nothing, every
    // assertion below would pass vacuously.
    expect(files.length).toBeGreaterThan(100);
  });

  it("installs a react whose major matches the hooks we allow", () => {
    const { version } = JSON.parse(
      readFileSync(
        join(process.cwd(), "node_modules", "react", "package.json"),
        "utf8",
      ),
    ) as { version: string };
    // When this fails, React has been upgraded and the ban below is
    // obsolete rather than wrong — remove the file, don't loosen it.
    expect(version.startsWith("18.")).toBe(true);
  });

  for (const hook of BANNED) {
    it(`does not use ${hook}, which React 18 does not ship`, () => {
      const offenders = files.filter((f) =>
        readFileSync(f, "utf8").includes(hook),
      );
      // Report paths, not just a count — a bare "expected 1 to be 0"
      // tells whoever hits this nothing about where to look.
      expect(
        offenders.map((f) => f.slice(SRC.length + 1)),
        `${hook} is React 19 only; use the react-dom useFormState / useFormStatus pair instead`,
      ).toEqual([]);
    });
  }
});
