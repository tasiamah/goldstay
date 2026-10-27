import { describe, expect, it } from "vitest";

import { groupByApartment, type GroupableProperty } from "./apartment-groups";

function prop(over: Partial<GroupableProperty> = {}): GroupableProperty {
  return {
    id: "p1",
    name: "Riverside One Residency",
    unitNumber: "AM01",
    status: "ACTIVE",
    units: [{ leases: [] }],
    coOwners: [],
    client: { id: "damary", fullName: "Damary Masakhwe Ayuku" },
    ...over,
  };
}

describe("one apartment, two agreements", () => {
  it("collapses rows that are the same flat under a different contract", () => {
    const groups = groupByApartment(
      [prop({ id: "long" }), prop({ id: "short" })],
      "damary",
    );
    expect(groups).toHaveLength(1);
    expect(groups[0]!.rows.map((r) => r.id)).toEqual(["long", "short"]);
  });

  it("keeps a handle on every row, because both agreements are real", () => {
    const groups = groupByApartment(
      [prop({ id: "long" }), prop({ id: "short" })],
      "damary",
    );
    // Nothing is merged or discarded — this is presentation only.
    expect(groups[0]!.rows).toHaveLength(2);
  });

  it("leads with the live row when one is live and one is onboarding", () => {
    const groups = groupByApartment(
      [
        prop({ id: "onboarding", status: "ONBOARDING" }),
        prop({ id: "live", status: "ACTIVE" }),
      ],
      "damary",
    );
    expect(groups[0]!.primary.id).toBe("live");
    expect(groups[0]!.isActive).toBe(true);
  });

  it("counts the flat as occupied if any of its rows has a live lease", () => {
    const groups = groupByApartment(
      [
        prop({ id: "a", units: [{ leases: [] }] }),
        prop({ id: "b", units: [{ leases: [{ id: "l1" }] }] }),
      ],
      "damary",
    );
    expect(groups[0]!.occupied).toBe(true);
  });

  it("does not merge two different flats", () => {
    const groups = groupByApartment(
      [prop({ id: "a", unitNumber: "AM01" }), prop({ id: "b", unitNumber: "AM02" })],
      "damary",
    );
    expect(groups).toHaveLength(2);
  });
});

// Purple haze B804 is recorded against two unrelated landlords right
// now. Keying on address alone would have shown one of them the
// other's flat the moment they both appeared in one list.
describe("never merges across owners of record", () => {
  it("keeps same-address rows apart when the owner differs", () => {
    const groups = groupByApartment(
      [
        prop({ id: "goldrick", client: { id: "g", fullName: "Goldrick Ndombi" } }),
        prop({ id: "kishan", client: { id: "k", fullName: "Kishan Mavdia" } }),
      ],
      "g",
    );
    expect(groups).toHaveLength(2);
  });
});

describe("telling a co-owner what they are looking at", () => {
  const coOwned = prop({
    coOwners: [{ clientId: "wes", relationship: "mother" }],
  });

  it("marks it co-owned and names the owner of record", () => {
    const [g] = groupByApartment([coOwned], "wes");
    expect(g!.isCoOwned).toBe(true);
    expect(g!.ownerOfRecord).toBe("Damary Masakhwe Ayuku");
    expect(g!.relationship).toBe("mother");
  });

  it("says nothing of the sort to the owner of record themselves", () => {
    const [g] = groupByApartment([coOwned], "damary");
    expect(g!.isCoOwned).toBe(false);
    // Naming an owner of record to the owner of record would be noise.
    expect(g!.ownerOfRecord).toBeNull();
  });
});

describe("grouping is insensitive to how the address was typed", () => {
  it("treats spacing and case differences as the same flat", () => {
    const groups = groupByApartment(
      [
        prop({ id: "a", name: "Riverside One Residency", unitNumber: "AM01" }),
        prop({ id: "b", name: "  riverside one residency ", unitNumber: " am01 " }),
      ],
      "damary",
    );
    expect(groups).toHaveLength(1);
  });

  it("preserves the order the caller sorted them in", () => {
    const groups = groupByApartment(
      [
        prop({ id: "x", unitNumber: "A1" }),
        prop({ id: "y", unitNumber: "A2" }),
        prop({ id: "z", unitNumber: "A3" }),
      ],
      "damary",
    );
    expect(groups.map((g) => g.primary.id)).toEqual(["x", "y", "z"]);
  });
});
