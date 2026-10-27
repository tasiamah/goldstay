// There was no test here, which is how the welcome email shipped
// telling landlords their link was "valid for 60 minutes" and stayed
// that way while three of seventeen of them failed to get in. The
// body of an email nobody asserts on is the easiest thing in a
// codebase to get quietly wrong, because it is never read by anyone
// who could tell.

import { beforeEach, describe, expect, it, vi } from "vitest";

const { send, createInvite, logCommunication, recordAudit } = vi.hoisted(
  () => ({
    send: vi.fn(),
    createInvite: vi.fn(),
    logCommunication: vi.fn(),
    recordAudit: vi.fn(),
  }),
);

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
  },
}));
vi.mock("@/lib/clients/invite", async () => {
  const actual = await vi.importActual<
    typeof import("@/lib/clients/invite")
  >("@/lib/clients/invite");
  return { ...actual, createInvite };
});
vi.mock("@/lib/comms", () => ({ logCommunication }));
vi.mock("@/lib/audit", () => ({ recordAudit }));

const { sendClientWelcomeEmail } = await import("./client-welcome");

const BASE = {
  email: "lucy@example.com",
  fullName: "Lucy Odhoch",
  country: "KE" as const,
  clientId: "c1",
};

beforeEach(() => {
  send.mockReset().mockResolvedValue({ data: { id: "re_1" } });
  createInvite.mockReset().mockResolvedValue("TOKEN123456789012345678901");
  logCommunication.mockReset().mockResolvedValue(undefined);
  recordAudit.mockReset().mockResolvedValue(undefined);
  process.env.RESEND_API_KEY = "re_test";
  process.env.PUBLIC_SITE_URL = "https://goldstay.co.ke";
});

// Plain-text bodies are hard-wrapped, so a phrase can straddle a
// newline. Assertions are about the words, not where the wrap lands,
// and a test that breaks on rewrapping teaches people not to rewrap.
const flat = (s: string) => s.replace(/\s+/g, " ");

function sent() {
  const call = send.mock.calls[0]![0];
  return {
    subject: call.subject,
    text: flat(call.text),
    html: flat(call.html),
    rawText: call.text as string,
  };
}

describe("the link we email", () => {
  it("is a Goldstay invite link, not a Supabase one", async () => {
    await sendClientWelcomeEmail(BASE);
    const { text, html } = sent();
    const url = "https://goldstay.co.ke/welcome/TOKEN123456789012345678901";
    expect(text).toContain(url);
    expect(html).toContain(url);
    // Emailing the Supabase token directly is the bug this replaced:
    // single use, one hour, and burned by any scanner that prefetches.
    expect(text).not.toContain("/auth/callback");
    expect(html).not.toContain("/auth/callback");
    expect(text).not.toContain("token_hash");
  });

  it("never repeats the old sixty-minute claim", async () => {
    await sendClientWelcomeEmail(BASE);
    const { text, html } = sent();
    for (const body of [text, html]) {
      expect(body).not.toMatch(/60 minutes/i);
      expect(body).not.toMatch(/valid for an hour/i);
    }
  });

  it("tells them how long it lasts and that it is reusable", async () => {
    await sendClientWelcomeEmail(BASE);
    const { text, html } = sent();
    for (const body of [text, html]) {
      expect(body).toMatch(/7 days/);
      expect(body).toMatch(/more than once|as many times/i);
    }
  });

  it("falls back to a sign-in instruction when no invite can be made", async () => {
    createInvite.mockRejectedValue(new Error("db down"));
    await sendClientWelcomeEmail(BASE);
    const { text } = sent();
    // A broken link is worse than no link: say what to do instead.
    expect(text).not.toContain("/welcome/");
    expect(text).toContain("/login");
    expect(text).toMatch(/Forgot password/);
  });
});

describe("the nudge to someone who never signed in", () => {
  const nudge = { ...BASE, tone: "never-signed-in" as const };

  it("gets its own subject so it does not read as a duplicate welcome", async () => {
    await sendClientWelcomeEmail(nudge);
    const a = sent().subject;
    send.mockClear();
    await sendClientWelcomeEmail(BASE);
    expect(a).not.toBe(sent().subject);
    expect(a).toMatch(/fresh link/i);
  });

  it("takes the blame rather than implying they never bothered", async () => {
    await sendClientWelcomeEmail(nudge);
    const { text, html } = sent();
    for (const body of [text, html]) {
      expect(body).toMatch(/on us, not you/i);
      // Nothing that reads as a telling-off.
      expect(body).not.toMatch(/you (have )?(failed|neglected|did not bother)/i);
      expect(body).not.toMatch(/reminder/i);
    }
  });

  it("reassures them nothing was missed while they were locked out", async () => {
    await sendClientWelcomeEmail(nudge);
    expect(sent().text).toMatch(/nothing has been missed/i);
  });

  it("skips the what-is-Goldstay tour they do not need", async () => {
    await sendClientWelcomeEmail(nudge);
    const { text } = sent();
    expect(text).not.toMatch(/From your portal you can/);
    // The ordinary welcome still has it.
    send.mockClear();
    await sendClientWelcomeEmail(BASE);
    expect(sent().text).toMatch(/From your portal you can/);
  });

  it("is recorded against the right reason so it is traceable later", async () => {
    await sendClientWelcomeEmail(nudge);
    expect(createInvite).toHaveBeenCalledWith(
      expect.objectContaining({ clientId: "c1", reason: "NEVER_SIGNED_IN" }),
    );
  });
});

describe("the link someone asked for themselves", () => {
  const asked = { ...BASE, tone: "self-requested" as const };

  it("reads as a reply to a request, not as a discovery", async () => {
    await sendClientWelcomeEmail(asked);
    const { text, html } = sent();
    for (const body of [text, html]) {
      expect(body).toMatch(/you just asked for/i);
      // The apologetic copy would be absurd three seconds after they
      // pressed a button.
      expect(body).not.toMatch(/going through our records/i);
    }
  });

  it("gets its own subject", async () => {
    await sendClientWelcomeEmail(asked);
    expect(sent().subject).toMatch(/new Goldstay sign-in link/i);
  });

  it("still says how long the new one lasts", async () => {
    await sendClientWelcomeEmail(asked);
    for (const body of [sent().text, sent().html]) {
      expect(body).toMatch(/7 days/);
    }
  });

  it("is recorded as self-requested, not as an operator resend", async () => {
    await sendClientWelcomeEmail(asked);
    expect(createInvite).toHaveBeenCalledWith(
      expect.objectContaining({ reason: "SELF_REQUESTED" }),
    );
  });

  it("skips the tour, like the other rescue note", async () => {
    await sendClientWelcomeEmail(asked);
    expect(sent().text).not.toMatch(/From your portal you can/);
  });
});

describe("delivery reporting", () => {
  it("separates 'nothing went wrong' from 'it actually went out'", async () => {
    delete process.env.RESEND_API_KEY;
    const res = await sendClientWelcomeEmail(BASE);
    // An operator chasing a landlord who got nothing must not be told
    // the email was sent.
    expect(res).toMatchObject({ ok: true, delivered: false });
    expect(send).not.toHaveBeenCalled();
  });

  it("reports a failed send as not ok", async () => {
    send.mockRejectedValue(new Error("resend exploded"));
    const res = await sendClientWelcomeEmail(BASE);
    expect(res).toMatchObject({ ok: false, delivered: false });
  });
});
