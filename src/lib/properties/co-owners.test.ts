import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  propertyFindUnique,
  clientFindFirst,
  coOwnerFindUnique,
  coOwnerCreate,
  coOwnerUpdate,
  recordAudit,
} = vi.hoisted(() => ({
  propertyFindUnique: vi.fn(),
  clientFindFirst: vi.fn(),
  coOwnerFindUnique: vi.fn(),
  coOwnerCreate: vi.fn(),
  coOwnerUpdate: vi.fn(),
  recordAudit: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: {
    property: { findUnique: propertyFindUnique },
    client: { findFirst: clientFindFirst },
    propertyCoOwner: {
      findUnique: coOwnerFindUnique,
      create: coOwnerCreate,
      update: coOwnerUpdate,
    },
  },
}));
vi.mock("@/lib/audit", () => ({ recordAudit }));

const { addCoOwnerByEmail, removeCoOwner } = await import("./co-owners");

const ACTOR = { email: "ops@goldstay.co.ke" } as never;

const PROPERTY = {
  id: "prop1",
  name: "Riverside One Residency",
  unitNumber: "AM01",
  clientId: "damary",
  client: { fullName: "Damary Masakhwe Ayuku", email: "d@example.com" },
};

beforeEach(() => {
  propertyFindUnique.mockReset().mockResolvedValue(PROPERTY);
  clientFindFirst.mockReset().mockResolvedValue({
    id: "wes",
    fullName: "Wesley Epiche Angulu",
    archivedAt: null,
  });
  coOwnerFindUnique.mockReset().mockResolvedValue(null);
  coOwnerCreate.mockReset().mockResolvedValue({});
  coOwnerUpdate.mockReset().mockResolvedValue({});
  recordAudit.mockReset().mockResolvedValue(undefined);
});

describe("adding a co-owner", () => {
  it("links an existing client and says who still gets paid", async () => {
    const res = await addCoOwnerByEmail({
      propertyId: "prop1",
      email: "wes@example.com",
      relationship: "son",
      actor: ACTOR,
    });
    expect(res.ok).toBe(true);
    expect(coOwnerCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          propertyId: "prop1",
          clientId: "wes",
          relationship: "son",
        }),
      }),
    );
    // The operator is usually on a call; the confirmation has to
    // settle the question they will be asked next.
    expect(res.ok && res.message).toMatch(/Damary Masakhwe Ayuku/);
  });

  it("matches the address case-insensitively", async () => {
    await addCoOwnerByEmail({
      propertyId: "prop1",
      email: "  WES@Example.com  ",
      actor: ACTOR,
    });
    expect(clientFindFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { email: { equals: "wes@example.com", mode: "insensitive" } },
      }),
    );
  });

  it("stores no relationship rather than an empty string", async () => {
    await addCoOwnerByEmail({
      propertyId: "prop1",
      email: "wes@example.com",
      relationship: "   ",
      actor: ACTOR,
    });
    expect(coOwnerCreate.mock.calls[0]![0].data.relationship).toBeNull();
  });

  it("records it on the property timeline", async () => {
    await addCoOwnerByEmail({
      propertyId: "prop1",
      email: "wes@example.com",
      actor: ACTOR,
    });
    expect(recordAudit).toHaveBeenCalledWith(
      expect.objectContaining({
        entity: "PROPERTY",
        entityId: "prop1",
        action: "property.coowner.added",
      }),
    );
  });
});

describe("what it refuses, and whether the refusal is useful", () => {
  it("refuses an address with no client record, and says what to do", async () => {
    clientFindFirst.mockResolvedValue(null);
    const res = await addCoOwnerByEmail({
      propertyId: "prop1",
      email: "stranger@example.com",
      actor: ACTOR,
    });
    expect(res.ok).toBe(false);
    // A co-owner gets a login, so there has to be someone to log in
    // as. "Not found" alone would send the operator hunting.
    expect(res.ok === false && res.error).toMatch(/Create them as a client/i);
    expect(coOwnerCreate).not.toHaveBeenCalled();
  });

  it("refuses the owner of record as their own co-owner", async () => {
    clientFindFirst.mockResolvedValue({
      id: "damary",
      fullName: "Damary Masakhwe Ayuku",
      archivedAt: null,
    });
    const res = await addCoOwnerByEmail({
      propertyId: "prop1",
      email: "d@example.com",
      actor: ACTOR,
    });
    expect(res.ok).toBe(false);
    expect(coOwnerCreate).not.toHaveBeenCalled();
  });

  it("refuses an archived client, because they could not sign in anyway", async () => {
    clientFindFirst.mockResolvedValue({
      id: "wes",
      fullName: "Wesley Epiche Angulu",
      archivedAt: new Date(),
    });
    const res = await addCoOwnerByEmail({
      propertyId: "prop1",
      email: "wes@example.com",
      actor: ACTOR,
    });
    expect(res.ok).toBe(false);
    expect(res.ok === false && res.error).toMatch(/archived/i);
  });

  it("refuses a second row for someone already co-owning", async () => {
    coOwnerFindUnique.mockResolvedValue({ id: "co1", removedAt: null });
    const res = await addCoOwnerByEmail({
      propertyId: "prop1",
      email: "wes@example.com",
      actor: ACTOR,
    });
    expect(res.ok).toBe(false);
    expect(coOwnerCreate).not.toHaveBeenCalled();
  });

  it("refuses an empty address without touching the database", async () => {
    const res = await addCoOwnerByEmail({
      propertyId: "prop1",
      email: "  ",
      actor: ACTOR,
    });
    expect(res.ok).toBe(false);
    expect(propertyFindUnique).not.toHaveBeenCalled();
  });
});

describe("re-adding someone previously removed", () => {
  it("revives the existing row rather than creating a second", async () => {
    coOwnerFindUnique.mockResolvedValue({ id: "co1", removedAt: new Date() });
    const res = await addCoOwnerByEmail({
      propertyId: "prop1",
      email: "wes@example.com",
      relationship: "son",
      actor: ACTOR,
    });
    expect(res.ok).toBe(true);
    expect(coOwnerCreate).not.toHaveBeenCalled();
    // Keeping the history in one place is the point of the unique
    // constraint; a second row would split it.
    expect(coOwnerUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "co1" },
        data: expect.objectContaining({ removedAt: null }),
      }),
    );
  });
});

describe("removing a co-owner", () => {
  const ROW = {
    id: "co1",
    propertyId: "prop1",
    removedAt: null,
    client: { fullName: "Wesley Epiche Angulu" },
    property: { name: "Riverside One Residency", unitNumber: "AM01" },
  };

  it("removes softly, so who could see what and when survives", async () => {
    coOwnerFindUnique.mockResolvedValue(ROW);
    const res = await removeCoOwner({
      coOwnerId: "co1",
      propertyId: "prop1",
      actor: ACTOR,
    });
    expect(res.ok).toBe(true);
    expect(coOwnerUpdate.mock.calls[0]![0].data.removedAt).toBeInstanceOf(Date);
  });

  it("refuses to remove a co-owner reached through the wrong property", async () => {
    coOwnerFindUnique.mockResolvedValue({ ...ROW, propertyId: "someone-else" });
    const res = await removeCoOwner({
      coOwnerId: "co1",
      propertyId: "prop1",
      actor: ACTOR,
    });
    expect(res.ok).toBe(false);
    expect(coOwnerUpdate).not.toHaveBeenCalled();
  });

  it("is idempotent for an already removed row", async () => {
    coOwnerFindUnique.mockResolvedValue({ ...ROW, removedAt: new Date() });
    const res = await removeCoOwner({
      coOwnerId: "co1",
      propertyId: "prop1",
      actor: ACTOR,
    });
    expect(res.ok).toBe(false);
    expect(coOwnerUpdate).not.toHaveBeenCalled();
  });
});
