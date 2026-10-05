import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import * as React from "react";

// `useActionState` compiles cleanly on this project but does not exist
// at runtime. Next pulls in @types/react's canary definitions, which
// declare the React 19 surface, while the installed react is 18.3.1.
// So `tsc`, `next lint` and `next build` all pass, and the page throws
// "useActionState is not a function" the moment a browser opens it.
//
// That is how the admin property page 500'd for every short-term unit,
// and both CSV import screens with it.
//
// Rather than keep a hand-written list of banned names, this asks the
// installed React whether each thing we import from it actually
// exists. It needs no maintenance, and it covers hooks nobody has
// thought to ban yet.

const SRC = join(process.cwd(), "src");
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

// Named, value-position imports from "react" only. `import type` is
// erased before it can fail, and a namespace import gives us no names
// to check.
const IMPORT_FROM_REACT =
  /import\s+(?!type\s)\{([^}]*)\}\s*from\s*["']react["']/g;

// Exports React only ships under the "react-server" condition, which
// is what Next resolves for Server Components but not what a plain
// require() in this test sees. Real, and not checkable this way.
const SERVER_CONDITION_EXPORTS = new Set(["cache"]);

function reactImports(source: string): string[] {
  const names: string[] = [];
  for (const match of source.matchAll(IMPORT_FROM_REACT)) {
    for (const raw of match[1].split(",")) {
      const specifier = raw.trim();
      // `import { useState, type FormEvent }` — the inline type is
      // erased at compile time and can never fail at runtime, so it
      // is skipped rather than looked up.
      if (!specifier || /^type\s/.test(specifier)) continue;
      const name = specifier.split(/\s+as\s+/)[0].trim();
      if (name && !SERVER_CONDITION_EXPORTS.has(name)) names.push(name);
    }
  }
  return names;
}

describe("everything imported from react exists in the installed react", () => {
  const files = sourceFiles(SRC);

  it("scans the whole source tree", () => {
    // Guards the guard: a walk that silently returned nothing would
    // make every assertion below pass vacuously.
    expect(files.length).toBeGreaterThan(100);
  });

  it("finds the react imports that are actually there", () => {
    // Likewise for the regex. If it stops matching, nothing is checked.
    const all = files.flatMap((f) => reactImports(readFileSync(f, "utf8")));
    expect(all).toContain("useState");
    expect(all.length).toBeGreaterThan(20);
  });

  it("imports nothing react does not export", () => {
    const offenders: string[] = [];
    for (const file of files) {
      for (const name of reactImports(readFileSync(file, "utf8"))) {
        if (!(name in React)) {
          offenders.push(`${file.slice(SRC.length + 1)} imports ${name}`);
        }
      }
    }
    expect(
      offenders,
      `react ${React.version} does not export these. A React 19 API on a ` +
        `React 18 runtime type-checks but throws in the browser; the ` +
        `react-dom useFormState / useFormStatus pair is the 18 spelling.`,
    ).toEqual([]);
  });
});
