import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import {
  canSeeProperty,
  propertiesVisibleTo,
  propertyOwnedOrCoOwnedBy,
} from "./visibility";

describe("propertiesVisibleTo", () => {
  it("matches a property owned outright or co-owned", () => {
    expect(propertiesVisibleTo("c1")).toEqual({
      archivedAt: null,
      OR: [
        { clientId: "c1" },
        { coOwners: { some: { clientId: "c1", removedAt: null } } },
      ],
    });
  });

  it("ignores a co-ownership that has been removed", () => {
    const where = propertiesVisibleTo("c1");
    const coOwner = where.OR![1] as {
      coOwners: { some: { removedAt: null } };
    };
    // Removal is soft, so without this clause a removed co-owner
    // would keep seeing the unit forever.
    expect(coOwner.coOwners.some.removedAt).toBeNull();
  });

  it("hops through property for the tables that hang off one", () => {
    expect(propertyOwnedOrCoOwnedBy("c1")).toEqual({
      property: propertiesVisibleTo("c1"),
    });
  });
});

describe("canSeeProperty", () => {
  const base = { clientId: "owner" };

  it("lets the owner of record in", () => {
    expect(canSeeProperty(base, "owner")).toBe(true);
  });

  it("lets a current co-owner in", () => {
    expect(
      canSeeProperty(
        { ...base, coOwners: [{ clientId: "wes", removedAt: null }] },
        "wes",
      ),
    ).toBe(true);
  });

  it("keeps a removed co-owner out", () => {
    expect(
      canSeeProperty(
        { ...base, coOwners: [{ clientId: "wes", removedAt: new Date() }] },
        "wes",
      ),
    ).toBe(false);
  });

  it("keeps a stranger out", () => {
    expect(canSeeProperty({ ...base, coOwners: [] }, "nobody")).toBe(false);
  });
});

// The whole risk of co-ownership is that it widens the wrong query.
// Seeing a flat you co-own is the point; appearing in someone else's
// earnings, statement or payout details is a leak. These two lists
// are the boundary, asserted rather than left to a comment.
describe("co-ownership widens sight, not money", () => {
  const root = join(process.cwd(), "src");
  const read = (rel: string) => readFileSync(join(root, rel), "utf8");

  it("the dashboard widens only its property query", () => {
    const src = read("app/(platform)/client/page.tsx");
    // One call, on the property list.
    expect(src.match(/propertiesVisibleTo\(/g)).toHaveLength(1);
    // Every money query still keyed to the client's own id.
    expect(src).toContain("property: { clientId: client.id }");
  });

  it("the property page widens, because that data describes the asset", () => {
    const src = read("app/(platform)/client/properties/[id]/page.tsx");
    expect(src).toContain("propertiesVisibleTo(client.id)");
  });

  it.each([
    ["app/(platform)/client/statements/page.tsx", "statements"],
    ["app/(platform)/client/account/page.tsx", "account and payout methods"],
  ])("%s stays owner-only (%s)", (rel) => {
    const src = read(rel);
    // A co-owner reading these would be reading another person's
    // statement or bank details.
    expect(src).not.toContain("propertiesVisibleTo");
  });
});

// One apartment, one signature. Damary signed; Wesley co-owns the same
// flat and must never be asked to sign it again, nor be able to — a
// second acceptance would put the wrong name on an executed contract.
// Both halves are asserted: that the accept path stays owner-only, and
// that the one widened page does not prompt a co-owner to use it.
describe("a co-owner neither signs nor is asked to", () => {
  const root = join(process.cwd(), "src");
  const read = (rel: string) => readFileSync(join(root, rel), "utf8");

  it.each([
    ["app/(platform)/client/agreements/[id]/page.tsx", "reading it"],
    ["app/(platform)/client/agreements/[id]/actions.ts", "accepting it"],
  ])("%s stays keyed to the owner of record (%s)", (rel) => {
    const src = read(rel);
    expect(src).toContain("clientId");
    expect(src).not.toContain("propertiesVisibleTo");
    expect(src).not.toContain("coOwners");
  });

  it("the property page gates the accept banner on not being a co-owner", () => {
    const src = read("app/(platform)/client/properties/[id]/page.tsx");
    // Without this the co-owner is shown "Accept your management
    // agreement" and the link 404s, because the accept page is
    // owner-only.
    expect(src).toContain("!isCoOwner && agreementPending");
    // And the readiness summary must not list it as their blocker.
    expect(src).toContain("hasPendingAgreement: !isCoOwner && agreementPending");
  });
});

// Archiving a property is how an operator says it is not this
// client's any more, and the admin UI promises it disappears from
// their portal. Nothing enforced that, so an archived flat kept its
// card, its detail page and its unsigned agreement.
describe("an archived property leaves the portal", () => {
  const root = join(process.cwd(), "src");
  const read = (rel: string) => readFileSync(join(root, rel), "utf8");

  it("is filtered by the shared fragment, so both pages get it", () => {
    expect(propertiesVisibleTo("wes")).toMatchObject({ archivedAt: null });
  });

  it.each([
    ["app/(platform)/client/agreements/[id]/page.tsx", "cannot be opened"],
    ["app/(platform)/client/agreements/[id]/actions.ts", "cannot be signed"],
  ])("an archived property's agreement %s (%s)", (rel) => {
    expect(read(rel)).toContain("archivedAt");
  });

  it("does not nag the client to sign one", () => {
    const src = read("app/(platform)/client/page.tsx");
    expect(src).toContain(
      "property: { clientId: client.id, archivedAt: null },",
    );
  });
});
