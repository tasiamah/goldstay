// Whoever holds an expired welcome link can press "email me a new
// one". That is safe only because of where the new link goes, so
// these tests are mostly about the things the action refuses to do.

import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  lookupInvite,
  mintedRecentlyFor,
  sendClientWelcomeEmail,
  findUnique,
  redirect,
} = vi.hoisted(() => ({
  lookupInvite: vi.fn(),
  mintedRecentlyFor: vi.fn(),
  sendClientWelcomeEmail: vi.fn(),
  findUnique: vi.fn(),
  redirect: vi.fn((url: string) => {
    // The real one throws to halt the request. Mirroring that is what
    // makes "redirects, then stops" testable rather than assumed.
    const err = new Error(`REDIRECT:${url}`);
    (err as { digest?: string }).digest = "NEXT_REDIRECT";
    throw err;
  }),
}));

vi.mock("next/navigation", () => ({ redirect }));
vi.mock("@/lib/db", () => ({ prisma: { client: { findUnique } } }));
vi.mock("@/lib/client-welcome", () => ({ sendClientWelcomeEmail }));
vi.mock("@/lib/supabase/magic-link", () => ({ mintCallbackLink: vi.fn() }));
vi.mock("@/lib/clients/invite", () => ({
  lookupInvite,
  mintedRecentlyFor,
  recordInviteUse: vi.fn(),
  RESEND_COOLDOWN_MS: 600_000,
}));

const { requestNewLinkAction } = await import("./actions");

const form = (token: string) => {
  const fd = new FormData();
  fd.set("token", token);
  return fd;
};

// Swallows the redirect throw and hands back where it went.
async function run(token: string): Promise<string> {
  try {
    await requestNewLinkAction(form(token));
  } catch (err) {
    const m = /^REDIRECT:(.*)$/.exec((err as Error).message);
    if (m) return m[1]!;
    throw err;
  }
  return "(no redirect)";
}

beforeEach(() => {
  lookupInvite.mockReset();
  mintedRecentlyFor.mockReset().mockResolvedValue(false);
  sendClientWelcomeEmail.mockReset().mockResolvedValue({ ok: true });
  findUnique.mockReset().mockResolvedValue({
    email: "lucy@example.com",
    fullName: "Lucy Odhoch",
    companyName: null,
    country: "KE",
  });
  redirect.mockClear();
});

describe("who gets a replacement link", () => {
  it("sends one for an expired invite", async () => {
    lookupInvite.mockResolvedValue({
      status: "expired",
      client: { id: "c1", fullName: "Lucy Odhoch" },
    });
    const to = await run("tok");
    expect(sendClientWelcomeEmail).toHaveBeenCalledTimes(1);
    expect(to).toBe("/welcome/tok?sent=1");
  });

  it.each(["retired", "unknown", "valid"] as const)(
    "sends nothing for a %s invite",
    async (status) => {
      lookupInvite.mockResolvedValue({
        status,
        client: { id: "c1", fullName: "Lucy", email: "l@e.com" },
        inviteId: "i1",
      });
      await run("tok");
      expect(sendClientWelcomeEmail).not.toHaveBeenCalled();
    },
  );
});

describe("what stops it being an email cannon", () => {
  beforeEach(() => {
    lookupInvite.mockResolvedValue({
      status: "expired",
      client: { id: "c1", fullName: "Lucy Odhoch" },
    });
  });

  it("sends nothing if one went out moments ago", async () => {
    mintedRecentlyFor.mockResolvedValue(true);
    const to = await run("tok");
    expect(sendClientWelcomeEmail).not.toHaveBeenCalled();
    // Still claims success: the landlord does not need to know which
    // press of the button did the work.
    expect(to).toBe("/welcome/tok?sent=1");
  });

  it("checks the cooldown before composing anything", async () => {
    mintedRecentlyFor.mockResolvedValue(true);
    await run("tok");
    expect(findUnique).not.toHaveBeenCalled();
  });
});

describe("where the link goes", () => {
  beforeEach(() => {
    lookupInvite.mockResolvedValue({
      status: "expired",
      client: { id: "c1", fullName: "Lucy Odhoch" },
    });
  });

  it("goes to the address on the client record, never anything supplied", async () => {
    const fd = form("tok");
    // An attacker holding the expired link tries to redirect the mail.
    fd.set("email", "attacker@evil.com");
    try {
      await requestNewLinkAction(fd);
    } catch {
      /* redirect */
    }
    const payload = sendClientWelcomeEmail.mock.calls[0]![0];
    expect(payload.email).toBe("lucy@example.com");
    expect(JSON.stringify(payload)).not.toContain("attacker@evil.com");
  });

  it("looks the address up by the id on the invite, not by anything in the form", async () => {
    await run("tok");
    expect(findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: "c1" } }),
    );
  });

  it("attributes the send to nobody, because no operator was involved", async () => {
    await run("tok");
    expect(sendClientWelcomeEmail.mock.calls[0]![0].actor).toBeNull();
  });

  it("marks it as self-requested so it is distinguishable later", async () => {
    await run("tok");
    expect(sendClientWelcomeEmail.mock.calls[0]![0].tone).toBe(
      "self-requested",
    );
  });
});
