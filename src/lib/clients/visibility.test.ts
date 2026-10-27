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
