import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// The whole point of the share route, asserted against the source.
//
// A shared agreement goes to somebody who is not our client and has no
// session: an advocate reviewing a contract for the person who will
// sign it. The guarantee we make to that client, on the shared page
// and in the share email, is that the link is read-only and that only
// they can accept their own agreement.
//
// Nothing at runtime enforces that. It holds because the route simply
// does not import the accept path — and an import is exactly the kind
// of thing that gets added later by someone reusing the client page as
// a starting point, with no test failing to tell them the promise just
// broke. Hence a source-level test.
//
// If you are here because this failed: the fix is almost certainly to
// take the import back out, not to relax the test. Acceptance is
// session-based on purpose, because the acceptance record is evidence
// of who accepted (see signAgreementAction and clause 12.3). A third
// party accepting through a bearer token would produce a record
// asserting the client did it personally.

const ROUTE_DIR = join(process.cwd(), "src/app/agreements/shared/[token]");

// Comments are stripped before matching. Both of these files explain
// at length what they deliberately do *not* do, naming requireClient
// and the client route to do it, and a test that read the prose would
// fail on the explanation of the very property it is checking.
function read(relative: string): string {
  return readFileSync(join(ROUTE_DIR, relative), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
}

describe("shared agreement route", () => {
  const page = read("page.tsx");
  const pdf = read("pdf/route.ts");

  it("does not import the sign action or the sign form", () => {
    for (const source of [page, pdf]) {
      expect(source).not.toMatch(/signAgreementAction/);
      expect(source).not.toMatch(/SignAgreementForm/);
    }
  });

  it("does not reach the client agreement actions module at all", () => {
    for (const source of [page, pdf]) {
      expect(source).not.toMatch(/client\/agreements/);
    }
  });

  // requireClient() would throw or redirect for a recipient who has no
  // session, and its presence would mean somebody had confused this
  // route for a portal page.
  it("does not depend on a client session", () => {
    for (const source of [page, pdf]) {
      expect(source).not.toMatch(/requireClient/);
      expect(source).not.toMatch(/requireAdmin/);
    }
  });

  // Every read of a share has to go through the module that checks
  // revocation and expiry. A direct prisma.agreementShare query in the
  // route would be a way to accidentally serve a withdrawn link.
  it("resolves the token only through the share module", () => {
    expect(page).toMatch(/from "@\/lib\/agreements\/share"/);
    expect(pdf).toMatch(/from "@\/lib\/agreements\/share"/);
    for (const source of [page, pdf]) {
      expect(source).not.toMatch(/prisma\.agreementShare/);
    }
  });

  // The token is a bearer credential for one of our clients'
  // contracts. It must not be written to logs.
  it("never logs the token", () => {
    for (const source of [page, pdf]) {
      expect(source).not.toMatch(/console\.\w+\([^)]*token/);
    }
  });
});

describe("shared agreement layout", () => {
  const layout = readFileSync(
    join(process.cwd(), "src/app/agreements/layout.tsx"),
    "utf8",
  );

  it("marks the whole subtree noindex", () => {
    expect(layout).toMatch(/robots:\s*\{[^}]*index:\s*false/);
  });
});

describe("robots.txt", () => {
  const robots = readFileSync(
    join(process.cwd(), "src/app/robots.ts"),
    "utf8",
  );

  it("disallows the shared agreement path", () => {
    expect(robots).toMatch(/"\/agreements\/"/);
  });
});
