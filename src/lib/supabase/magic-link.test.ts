import { beforeEach, describe, expect, it, vi } from "vitest";

const { generateLink } = vi.hoisted(() => ({ generateLink: vi.fn() }));

vi.mock("@/lib/supabase/admin", () => ({
  createSupabaseAdminClient: () => ({ auth: { admin: { generateLink } } }),
}));

const { mintCallbackLink } = await import("./magic-link");

const SITE = "https://goldstay.co.ke";
const HASH = "453e1dfdfb2976529855de025095d1cc";
const ACTION_LINK =
  "https://proj.supabase.co/auth/v1/verify?token=abc&type=magiclink&redirect_to=x";

beforeEach(() => {
  generateLink.mockReset();
  generateLink.mockResolvedValue({
    data: {
      properties: {
        action_link: ACTION_LINK,
        hashed_token: HASH,
        verification_type: "magiclink",
      },
    },
    error: null,
  });
});

// The failure this guards against is silent: an action_link looks like
// a perfectly good URL, sends fine, and only fails when a landlord
// clicks it and gets "We didn't receive a valid sign-in token".
describe("mintCallbackLink", () => {
  it("never hands back Supabase's action_link", async () => {
    const link = await mintCallbackLink({
      email: "a@b.com",
      siteUrl: SITE,
      next: "/account/password",
    });

    expect(link).not.toBe(ACTION_LINK);
    expect(link).not.toContain("/auth/v1/verify");
    expect(link).not.toContain("supabase.co");
  });

  it("points at our own callback with the params it can actually read", async () => {
    const link = await mintCallbackLink({
      email: "a@b.com",
      siteUrl: SITE,
      next: "/account/password",
    });

    const url = new URL(link!);
    expect(url.origin).toBe(SITE);
    expect(url.pathname).toBe("/auth/callback");
    // All three must be query params, not a fragment — a fragment is
    // exactly what broke the original link.
    expect(url.hash).toBe("");
    expect(url.searchParams.get("token_hash")).toBe(HASH);
    expect(url.searchParams.get("next")).toBe("/account/password");
  });

  it("declares the type the token was minted under", async () => {
    // verifyOtp rejects a token_hash presented under the wrong type,
    // so this has to match generateLink's `type` exactly.
    const link = await mintCallbackLink({
      email: "a@b.com",
      siteUrl: SITE,
      next: "/client",
    });

    expect(new URL(link!).searchParams.get("type")).toBe("magiclink");
    expect(generateLink).toHaveBeenCalledWith(
      expect.objectContaining({ type: "magiclink" }),
    );
  });

  it("returns null rather than a link that cannot work", async () => {
    // Callers treat null as "no link" and fall back to plain /login
    // wording. Emailing a broken link instead would be worse.
    generateLink.mockResolvedValue({
      data: { properties: { action_link: ACTION_LINK, hashed_token: null } },
      error: null,
    });
    await expect(
      mintCallbackLink({ email: "a@b.com", siteUrl: SITE, next: "/client" }),
    ).resolves.toBeNull();

    generateLink.mockResolvedValue({
      data: null,
      error: { message: "boom" },
    });
    await expect(
      mintCallbackLink({ email: "a@b.com", siteUrl: SITE, next: "/client" }),
    ).resolves.toBeNull();
  });
});
