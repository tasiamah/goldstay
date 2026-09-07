import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import {
  MAX_OBSERVERS_PER_CLIENT,
  checkObserverCandidate,
  describeObserver,
  isPlausibleUnsubscribeToken,
  isReceiving,
  unsubscribeUrl,
} from "./observers";

// ---------------------------------------------------------------------
// The invariant
// ---------------------------------------------------------------------

// This is the test the feature exists behind.
//
// A client has one address that may receive a Supabase magic link —
// `Client.email`, the account holder — and any number of observer
// addresses that must never receive one, because clicking a magic
// link signs the clicker in *as the client*, with the accept button
// on a management agreement. A co-owner copied on the wrong email
// could execute a contract in her sibling's name.
//
// Three of our four client emails mint such a link. The rule that
// keeps them safe is structural rather than careful: a send site
// either resolves recipients through lib/clients/recipients.ts, in
// which case it carries no credential, or it addresses
// `client.email` directly, in which case it may. So a module that
// does both is the bug, and it is detectable by reading imports.
//
// A comment asking the next person to be careful would not survive
// the first hurried afternoon. This does.

const SRC = join(process.cwd(), "src");

// The two functions that turn an address into a working credential.
const MINTERS = ["mintCallbackLink", "mintSetPasswordLink"];

// The modules that can put an observer on a send, as paths relative
// to src/. Both are listed: recipients.ts is the intended chokepoint,
// but importing the store directly would bypass it just as
// effectively.
const OBSERVER_REACH = ["lib/clients/recipients", "lib/clients/observers"];

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) return walk(full);
    return /\.(ts|tsx)$/.test(entry) && !/\.test\.tsx?$/.test(entry)
      ? [full]
      : [];
  });
}

// Comments are stripped before matching. This file's own subject
// matter means the words it looks for appear in prose all over the
// codebase — including in the modules under test, which explain the
// rule at length — and a test that failed on an explanation would
// teach people to stop writing them.
function sourceOf(path: string): string {
  return readFileSync(path, "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

// Only `import` statements count. A string that merely contains
// "clients/observers" is not reach; an import of it is.
//
// Specifiers are resolved to a path relative to src/ before they are
// compared, because "./observers" and "@/lib/clients/observers" are
// the same module and a matcher that only understood the second would
// have declared the chokepoint safe while missing every import inside
// the directory it guards. The first draft of this test did exactly
// that, and the canary below is what caught it.
function importsOf(path: string, source: string): string[] {
  const specifiers: string[] = [];
  const re =
    /(?:^|\n)\s*import\s[^;]*?from\s*["']([^"']+)["']|\bimport\(\s*["']([^"']+)["']\s*\)/g;
  let match: RegExpExecArray | null;
  while ((match = re.exec(source)) !== null) {
    const raw = match[1] ?? match[2];
    if (!raw) continue;
    specifiers.push(resolveSpecifier(path, raw));
  }
  return specifiers;
}

function resolveSpecifier(fromFile: string, specifier: string): string {
  if (specifier.startsWith("@/")) return specifier.slice(2);
  if (specifier.startsWith(".")) {
    return relative(SRC, resolve(dirname(fromFile), specifier));
  }
  // A bare package name. Cannot be one of ours.
  return specifier;
}

describe("observers cannot reach a credential-bearing email", () => {
  const files = walk(SRC).map((path) => {
    const source = sourceOf(path);
    return { path, source, imports: importsOf(path, source) };
  });

  // If this fails, the minters were renamed or moved and the rest of
  // the suite below is silently checking nothing.
  it("finds the modules that mint credentials", () => {
    const minting = files.filter((f) =>
      MINTERS.some((m) => f.source.includes(m)),
    );
    expect(minting.length).toBeGreaterThan(0);
  });

  it("finds the modules that can reach the observer list", () => {
    const reaching = files.filter((f) =>
      f.imports.some((i) => OBSERVER_REACH.some((r) => i.includes(r))),
    );
    expect(reaching.length).toBeGreaterThan(0);
  });

  // The invariant itself.
  it("has no module that both mints a credential and reads observers", () => {
    const both = files
      .filter(
        (f) =>
          MINTERS.some((m) => f.source.includes(m)) &&
          f.imports.some((i) => OBSERVER_REACH.some((r) => i.includes(r))),
      )
      .map((f) => f.path.replace(`${process.cwd()}/`, ""));

    expect(
      both,
      `These modules mint a sign-in credential AND can resolve observer ` +
        `addresses. A magic link signs the clicker in as the client, so an ` +
        `observer who received one could accept a management agreement in ` +
        `the account holder's name. Address the account holder directly ` +
        `with client.email instead, and see the comment at the top of ` +
        `src/lib/clients/recipients.ts.`,
    ).toEqual([]);
  });

  // The statement is the only send allowed to copy observers, and the
  // reason is that it carries no minted link. If one is ever added
  // there, the test above would not catch it on its own, because the
  // statement legitimately imports the recipient helper.
  it("keeps the statement send free of minted links", () => {
    for (const file of ["send.ts", "email.ts"]) {
      const source = sourceOf(join(SRC, "lib", "statements", file));
      for (const minter of MINTERS) {
        expect(source, `src/lib/statements/${file}`).not.toContain(minter);
      }
    }
  });
});

// ---------------------------------------------------------------------
// The rules
// ---------------------------------------------------------------------

const HOLDER = "asha@example.com";

function candidate(
  email: string,
  existing: {
    email: string;
    removedAt?: Date | null;
    unsubscribedAt?: Date | null;
  }[] = [],
) {
  return checkObserverCandidate({
    email,
    accountHolderEmail: HOLDER,
    existing: existing.map((e) => ({
      email: e.email,
      removedAt: e.removedAt ?? null,
      unsubscribedAt: e.unsubscribedAt ?? null,
    })),
  });
}

describe("checkObserverCandidate", () => {
  it("accepts a new address and returns it normalised", () => {
    const result = candidate("  Wanjiru@Example.COM ");
    expect(result).toEqual({ ok: true, email: "wanjiru@example.com" });
  });

  it("rejects something that is not an address", () => {
    expect(candidate("wanjiru").ok).toBe(false);
    expect(candidate("").ok).toBe(false);
    expect(candidate("a b@example.com").ok).toBe(false);
  });

  // The security-relevant one: the account holder is the only address
  // that receives magic links, so it must never end up in the table
  // whose purpose is to hold addresses that never do.
  it("refuses the account holder, however they are typed", () => {
    for (const variant of [HOLDER, " ASHA@example.com ", "Asha@Example.Com"]) {
      const result = candidate(variant);
      expect(result.ok, variant).toBe(false);
      if (!result.ok) expect(result.reason).toBe("is-account-holder");
    }
  });

  it("refuses somebody already on the list", () => {
    const result = candidate("wanjiru@example.com", [
      { email: "wanjiru@example.com" },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("already-listed");
  });

  it("allows re-adding somebody who was removed", () => {
    const result = candidate("wanjiru@example.com", [
      { email: "wanjiru@example.com", removedAt: new Date() },
    ]);
    expect(result.ok).toBe(true);
  });

  // An opt-out is the recipient's decision. The client removing and
  // re-adding them must not be a way to overturn it.
  it("will not let a client undo somebody's opt-out by re-adding them", () => {
    const result = candidate("wanjiru@example.com", [
      { email: "wanjiru@example.com", unsubscribedAt: new Date() },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("unsubscribed");
  });

  it("caps the live list", () => {
    const full = Array.from({ length: MAX_OBSERVERS_PER_CLIENT }, (_, i) => ({
      email: `observer${i}@example.com`,
    }));
    const result = candidate("one-more@example.com", full);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("limit-reached");
  });

  it("does not count removed or unsubscribed rows towards the cap", () => {
    const stale = Array.from({ length: MAX_OBSERVERS_PER_CLIENT }, (_, i) => ({
      email: `observer${i}@example.com`,
      removedAt: new Date(),
    }));
    expect(candidate("one-more@example.com", stale).ok).toBe(true);
  });

  // Reactivation is not a new slot, so a full list can still take a
  // returning observer back.
  it("lets a removed observer return even when the list is otherwise full", () => {
    const existing = [
      ...Array.from({ length: MAX_OBSERVERS_PER_CLIENT }, (_, i) => ({
        email: `observer${i}@example.com`,
      })),
      { email: "back@example.com", removedAt: new Date() },
    ];
    expect(candidate("back@example.com", existing).ok).toBe(true);
  });
});

describe("isReceiving", () => {
  it("is true only for a live row", () => {
    expect(isReceiving({ removedAt: null, unsubscribedAt: null })).toBe(true);
    expect(isReceiving({ removedAt: new Date(), unsubscribedAt: null })).toBe(
      false,
    );
    expect(isReceiving({ removedAt: null, unsubscribedAt: new Date() })).toBe(
      false,
    );
  });
});

describe("isPlausibleUnsubscribeToken", () => {
  it("accepts a base64url token of the right length", () => {
    expect(isPlausibleUnsubscribeToken("a".repeat(43))).toBe(true);
    expect(isPlausibleUnsubscribeToken("A-b_9".padEnd(40, "x"))).toBe(true);
  });

  it("rejects anything that is not one", () => {
    for (const bad of [
      undefined,
      null,
      42,
      "",
      "short",
      "x".repeat(200),
      "has spaces in it and is long enough to pass length",
      "../../../etc/passwd-padded-out-to-a-plausible-length",
    ]) {
      expect(isPlausibleUnsubscribeToken(bad), String(bad)).toBe(false);
    }
  });
});

describe("describeObserver", () => {
  it("prefers the name and adds the relationship", () => {
    expect(
      describeObserver({
        email: "w@example.com",
        name: "Wanjiru",
        relationship: "sister and co-owner",
      }),
    ).toBe("Wanjiru (sister and co-owner)");
  });

  it("falls back to the address when there is no name", () => {
    expect(
      describeObserver({
        email: "w@example.com",
        name: null,
        relationship: "accountant",
      }),
    ).toBe("w@example.com (accountant)");
  });

  it("reads properly with neither", () => {
    expect(
      describeObserver({ email: "w@example.com", name: null, relationship: null }),
    ).toBe("w@example.com");
  });

  it("ignores whitespace-only values", () => {
    expect(
      describeObserver({ email: "w@example.com", name: "   ", relationship: "  " }),
    ).toBe("w@example.com");
  });
});

describe("unsubscribeUrl", () => {
  it("builds an absolute URL and tolerates a trailing slash", () => {
    expect(unsubscribeUrl("tok", "https://goldstay.co.ke")).toBe(
      "https://goldstay.co.ke/statements/stop/tok",
    );
    expect(unsubscribeUrl("tok", "https://goldstay.co.ke/")).toBe(
      "https://goldstay.co.ke/statements/stop/tok",
    );
  });
});
