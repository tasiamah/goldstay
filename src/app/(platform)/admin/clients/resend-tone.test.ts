// The resend button is the only way an operator rescues someone who
// never got in, so it is the one place the warmer copy has to be
// chosen automatically. Relying on whoever presses it to remember
// would mean it never happened.

import { beforeEach, describe, expect, it, vi } from "vitest";

const { findUnique, sendClientWelcomeEmail, currentAuditActor } = vi.hoisted(
  () => ({
    findUnique: vi.fn(),
    sendClientWelcomeEmail: vi.fn(),
    currentAuditActor: vi.fn(),
  }),
);

vi.mock("@/lib/db", () => ({ prisma: { client: { findUnique } } }));
vi.mock("@/lib/client-welcome", () => ({ sendClientWelcomeEmail }));
vi.mock("@/lib/auth", () => ({ currentAuditActor }));
vi.mock("@/lib/audit", () => ({ recordAudit: vi.fn() }));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("@/lib/format-client", () => ({ formatClientDisplayName: () => "X" }));
vi.mock("@/lib/validation/schemas", () => ({ ClientInput: {} }));
vi.mock("@/lib/validation/preprocessors", () => ({
  flattenZodErrors: () => ({}),
}));

const { resendClientWelcomeAction } = await import("./actions");

const CLIENT = {
  email: "lucy@example.com",
  fullName: "Lucy Odhoch",
  companyName: null,
  country: "KE",
};

beforeEach(() => {
  findUnique.mockReset();
  sendClientWelcomeEmail.mockReset().mockResolvedValue({
    ok: true,
    delivered: true,
  });
  currentAuditActor.mockReset().mockResolvedValue({ email: "a@goldstay.co.ke" });
});

describe("resend picks its own tone", () => {
  it("apologises to someone who has never signed in", async () => {
    findUnique.mockResolvedValue({ ...CLIENT, authUserId: null });
    await resendClientWelcomeAction("c1");
    expect(sendClientWelcomeEmail).toHaveBeenCalledWith(
      expect.objectContaining({ tone: "never-signed-in" }),
    );
  });

  it("does not apologise to someone who has been in before", async () => {
    findUnique.mockResolvedValue({ ...CLIENT, authUserId: "auth-123" });
    await resendClientWelcomeAction("c1");
    expect(sendClientWelcomeEmail).toHaveBeenCalledWith(
      expect.objectContaining({ tone: "welcome" }),
    );
  });

  it("never leaks authUserId into the email payload", async () => {
    findUnique.mockResolvedValue({ ...CLIENT, authUserId: "auth-123" });
    await resendClientWelcomeAction("c1");
    expect(sendClientWelcomeEmail.mock.calls[0]![0]).not.toHaveProperty(
      "authUserId",
    );
  });

  it("still records it as a resend either way", async () => {
    findUnique.mockResolvedValue({ ...CLIENT, authUserId: null });
    await resendClientWelcomeAction("c1");
    expect(sendClientWelcomeEmail).toHaveBeenCalledWith(
      expect.objectContaining({ auditAction: "client.welcomed.resent" }),
    );
  });
});
