import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const { findUnique, create, update, updateMany } = vi.hoisted(() => ({
  findUnique: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  updateMany: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  prisma: { clientInvite: { findUnique, create, update, updateMany } },
}));

const {
  createInvite,
  generateInviteToken,
  hashInviteToken,
  inviteUrl,
  INVITE_TTL_DAYS,
  lookupInvite,
  recordInviteUse,
  retireInvitesForClient,
} = await import("./invite");

const CLIENT = { id: "c1", email: "a@b.com", fullName: "Lucy Odhoch" };

beforeEach(() => {
  findUnique.mockReset();
  create.mockReset();
  update.mockReset();
  updateMany.mockReset();
  create.mockResolvedValue({});
});

describe("token generation", () => {
  it("produces URL-safe tokens that survive a round trip through a URL", () => {
    for (let i = 0; i < 50; i++) {
      const token = generateInviteToken();
      expect(token).toMatch(/^[A-Za-z0-9_-]+$/);
      const url = inviteUrl(token, "https://goldstay.co.ke");
      // The whole point of base64url: no escaping, so the token we
      // read back off the path is the token we minted. A "+" or "/"
      // here would silently break a fraction of links.
      expect(new URL(url).pathname).toBe(`/welcome/${token}`);
    }
  });

  it("does not repeat itself", () => {
    const seen = new Set(Array.from({ length: 500 }, generateInviteToken));
    expect(seen.size).toBe(500);
  });

  it("hashes deterministically and irreversibly", () => {
    const token = generateInviteToken();
    expect(hashInviteToken(token)).toBe(hashInviteToken(token));
    expect(hashInviteToken(token)).toMatch(/^[0-9a-f]{64}$/);
    expect(hashInviteToken(token)).not.toContain(token);
  });
});

describe("createInvite", () => {
  it("stores only the hash, never the token itself", async () => {
    const token = await createInvite({ clientId: "c1" });
    const data = create.mock.calls[0]![0].data;
    expect(data.tokenHash).toBe(hashInviteToken(token));
    // A leak of this table must not hand over working sign-in links.
    expect(JSON.stringify(data)).not.toContain(token);
  });

  it("expires a week out", async () => {
    const now = new Date("2026-10-23T09:00:00Z");
    await createInvite({ clientId: "c1", now });
    const { expiresAt } = create.mock.calls[0]![0].data;
    expect(expiresAt.getTime() - now.getTime()).toBe(
      INVITE_TTL_DAYS * 86_400_000,
    );
    expect(INVITE_TTL_DAYS).toBe(7);
  });

  it("records why it was sent", async () => {
    await createInvite({ clientId: "c1", reason: "NEVER_SIGNED_IN" });
    expect(create.mock.calls[0]![0].data.reason).toBe("NEVER_SIGNED_IN");
    await createInvite({ clientId: "c1" });
    expect(create.mock.calls[1]![0].data.reason).toBe("WELCOME");
  });
});

describe("lookupInvite", () => {
  const live = {
    id: "i1",
    expiresAt: new Date("2026-10-30T09:00:00Z"),
    retiredAt: null,
    client: CLIENT,
  };
  const NOW = new Date("2026-10-23T09:00:00Z");

  it("accepts a live invite and looks it up by hash, not plaintext", async () => {
    findUnique.mockResolvedValue(live);
    const got = await lookupInvite("a-token-long-enough-to-pass", NOW);
    expect(got).toEqual({ status: "valid", inviteId: "i1", client: CLIENT });
    expect(findUnique.mock.calls[0]![0].where.tokenHash).toBe(
      hashInviteToken("a-token-long-enough-to-pass"),
    );
  });

  it("rejects an expired invite but still knows who they are", async () => {
    findUnique.mockResolvedValue({
      ...live,
      expiresAt: new Date("2026-10-22T09:00:00Z"),
    });
    const got = await lookupInvite("a-token-long-enough-to-pass", NOW);
    expect(got.status).toBe("expired");
    // So the page can greet them rather than asking who they are.
    expect(got).toMatchObject({ client: { fullName: "Lucy Odhoch" } });
  });

  it("treats the exact expiry instant as expired", async () => {
    findUnique.mockResolvedValue({ ...live, expiresAt: NOW });
    expect((await lookupInvite("a-token-long-enough-to-pass", NOW)).status).toBe(
      "expired",
    );
  });

  it("rejects a retired invite even while it is still in date", async () => {
    findUnique.mockResolvedValue({ ...live, retiredAt: new Date() });
    expect((await lookupInvite("a-token-long-enough-to-pass", NOW)).status).toBe(
      "retired",
    );
  });

  it("reveals nothing for an unknown token", async () => {
    findUnique.mockResolvedValue(null);
    expect(await lookupInvite("a-token-long-enough-to-pass", NOW)).toEqual({
      status: "unknown",
    });
  });

  it("does not hit the database for implausible input", async () => {
    for (const bad of ["", "short", "x".repeat(500)]) {
      expect((await lookupInvite(bad, NOW)).status).toBe("unknown");
    }
    expect(findUnique).not.toHaveBeenCalled();
  });
});

describe("use and retirement", () => {
  it("counts a use rather than consuming the invite", async () => {
    await recordInviteUse("i1");
    const data = update.mock.calls[0]![0].data;
    // Incrementing, not setting a usedAt flag: the link has to keep
    // working for the rest of the week.
    expect(data.useCount).toEqual({ increment: 1 });
    expect(data).not.toHaveProperty("retiredAt");
  });

  it("retires every outstanding invite for the client, not just one", async () => {
    await retireInvitesForClient("c1");
    const call = updateMany.mock.calls[0]![0];
    expect(call.where).toEqual({ clientId: "c1", retiredAt: null });
    expect(call.data.retiredAt).toBeInstanceOf(Date);
  });
});

// The reason this feature exists. A mail scanner issues GETs; if
// loading the page spent the token we would be back where we started,
// with landlords clicking links that had already been used.
describe("opening the welcome page spends nothing", () => {
  const dir = join(process.cwd(), "src", "app", "(platform)", "welcome", "[token]");

  it("the page never mutates", () => {
    const src = readFileSync(join(dir, "page.tsx"), "utf8");
    for (const forbidden of [
      "recordInviteUse",
      "mintCallbackLink",
      "retireInvitesForClient",
    ]) {
      expect(src).not.toContain(forbidden);
    }
    expect(src).toContain("lookupInvite");
  });

  it("signing in lives behind a server action, which is a POST", () => {
    const src = readFileSync(join(dir, "actions.ts"), "utf8");
    expect(src.startsWith('"use server"')).toBe(true);
    expect(src).toContain("recordInviteUse");
    expect(src).toContain("mintCallbackLink");
  });

  it("the action re-checks the invite before minting anything", () => {
    const src = readFileSync(join(dir, "actions.ts"), "utf8");
    // A tab left open over the weekend must not still mint a link.
    expect(src.indexOf("lookupInvite")).toBeLessThan(
      src.indexOf("mintCallbackLink"),
    );
  });
});
