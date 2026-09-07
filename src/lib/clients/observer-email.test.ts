import { describe, expect, it } from "vitest";
import { renderObserverNoticeEmail } from "./observer-email";

// The notice an observer receives when somebody adds them.
//
// Worth testing more carefully than a typical template, because it is
// the only thing we ever send to a person who has no relationship
// with us, did not ask to hear from us, and is being told about
// somebody else's rental income. It has to be believable enough not
// to read as phishing, accurate about what the recipient can and
// cannot do, and it has to contain a working way out.

const BASE = {
  observerEmail: "wanjiru@example.com",
  observerName: "Wanjiru Kamau",
  relationship: "sister and co-owner",
  unsubscribeToken: "tok_".padEnd(43, "x"),
  clientName: "Asha Kimani",
  clientEmail: "asha@example.com",
  addedByClient: true,
  stopUrl: "https://goldstay.co.ke/statements/stop/abc",
};

describe("renderObserverNoticeEmail", () => {
  it("names the client in the subject", () => {
    const { subject } = renderObserverNoticeEmail(BASE);
    expect(subject).toContain("Asha Kimani");
  });

  it("greets the observer by first name when we have one", () => {
    const { text } = renderObserverNoticeEmail(BASE);
    expect(text.startsWith("Hi Wanjiru,")).toBe(true);
  });

  it("falls back to a neutral greeting without a name", () => {
    const { text } = renderObserverNoticeEmail({
      ...BASE,
      observerName: null,
    });
    expect(text.startsWith("Hello,")).toBe(true);
  });

  it("says who added them and how they were described", () => {
    const { text } = renderObserverNoticeEmail(BASE);
    expect(text).toContain("Asha Kimani");
    expect(text).toContain("sister and co-owner");
  });

  it("omits the relationship sentence when there isn't one", () => {
    const { text } = renderObserverNoticeEmail({
      ...BASE,
      relationship: null,
    });
    expect(text).not.toContain("They listed you as");
  });

  // The claim that matters most. An observer who believed they had
  // authority over the account is the confusion the whole feature is
  // designed around, so the email has to say otherwise in both parts.
  it("states plainly that the recipient has no account and cannot sign in", () => {
    const { text, html } = renderObserverNoticeEmail(BASE);
    for (const body of [text, html]) {
      expect(body).toMatch(/do not have a Goldstay account|not<\/strong> have/);
      expect(body).toContain("sign you in");
    }
  });

  it("carries a working way out in both parts", () => {
    const { text, html } = renderObserverNoticeEmail(BASE);
    expect(text).toContain(BASE.stopUrl);
    expect(html).toContain(BASE.stopUrl);
  });

  it("tells them they do not need the client's permission to stop", () => {
    const { text } = renderObserverNoticeEmail(BASE);
    expect(text).toContain("You do not need to ask Asha Kimani");
  });

  // An operator adding somebody on a phone call must not produce an
  // email claiming the client did it themselves from their portal.
  it("attributes the add honestly when an operator did it", () => {
    const byOps = renderObserverNoticeEmail({
      ...BASE,
      addedByClient: false,
    });
    expect(byOps.text).toContain("has asked Goldstay to copy you");

    const byClient = renderObserverNoticeEmail(BASE);
    expect(byClient.text).toContain("has asked us to copy you");
  });

  // The security property, asserted on the artefact rather than
  // trusted from the call graph. observers.test.ts proves this module
  // cannot reach a minter; this proves the output has no link that
  // could act as one.
  it("contains no sign-in link of any kind", () => {
    const { text, html } = renderObserverNoticeEmail(BASE);
    for (const body of [text, html]) {
      expect(body).not.toMatch(/magiclink/i);
      expect(body).not.toMatch(/access_token|hashed_token|token=/i);
      expect(body).not.toMatch(/supabase/i);
      expect(body).not.toMatch(/\/auth\/(callback|confirm)/i);
      // The only link in the email is the opt-out.
      const urls = body.match(/https?:\/\/[^\s"'<>]+/g) ?? [];
      expect(urls).toEqual([BASE.stopUrl]);
    }
  });

  // Both names are free text somebody typed into a form.
  it("escapes a client name that would otherwise break the markup", () => {
    const { html } = renderObserverNoticeEmail({
      ...BASE,
      clientName: `Ochieng & Sons <script>alert("x")</script>`,
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("&amp;");
    expect(html).toContain("&lt;script&gt;");
  });

  it("escapes an observer name too", () => {
    const { html } = renderObserverNoticeEmail({
      ...BASE,
      observerName: `<img src=x onerror=alert(1)>`,
    });
    expect(html).not.toContain("<img");
  });
});
