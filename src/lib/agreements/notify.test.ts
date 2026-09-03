import { describe, expect, it } from "vitest";
import { renderAgreementEmail } from "./notify";

// Property names are operator free text and land in an HTML email
// unescaped unless we say otherwise. The plain-text half has the
// opposite requirement: it must stay readable, entities and all.
const base = {
  agreementId: "agr_1",
  reference: "GS-2026-014",
  propertyLabel: "Riverside Apartments 4B",
  client: {
    id: "cl_1",
    email: "asha@example.com",
    fullName: "Asha Wanjiru",
  },
  link: "https://goldstay.co.ke/auth/callback?token_hash=abc&next=%2Fclient",
};

describe("renderAgreementEmail", () => {
  it("names the property in the subject", () => {
    // The client may have several properties with us, so a subject of
    // just "Your management agreement" tells them nothing about which
    // one is waiting.
    expect(renderAgreementEmail(base).subject).toBe(
      "Your management agreement for Riverside Apartments 4B",
    );
  });

  it("greets the client by first name only", () => {
    const { text, html } = renderAgreementEmail(base);
    expect(text).toContain("Hi Asha,");
    expect(html).toContain("Hi Asha,");
  });

  it("falls back to a greeting when the name is unusable", () => {
    const { text } = renderAgreementEmail({
      ...base,
      client: { ...base.client, fullName: "   " },
    });
    expect(text).toContain("Hi there,");
  });

  it("puts the acceptance link in both halves", () => {
    const { text, html } = renderAgreementEmail(base);
    expect(text).toContain(base.link);
    // Ampersands in the query string have to be entity-encoded in the
    // href or the token_hash param is silently truncated by strict
    // clients — the exact failure that makes a link look expired.
    expect(html).toContain("token_hash=abc&amp;next=%2Fclient");
  });

  it("quotes the reference when there is one", () => {
    const { text, html } = renderAgreementEmail(base);
    expect(text).toContain("GS-2026-014");
    expect(html).toContain("GS-2026-014");
  });

  it("omits the reference line on legacy rows that have none", () => {
    const { text, html } = renderAgreementEmail({ ...base, reference: null });
    expect(text).not.toContain("Reference");
    expect(html).not.toContain("Reference");
  });

  it("escapes a property name that looks like markup", () => {
    const { html } = renderAgreementEmail({
      ...base,
      propertyLabel: 'Ochieng & Sons <script>alert("x")</script>',
    });
    expect(html).not.toContain("<script>");
    expect(html).toContain("Ochieng &amp; Sons &lt;script&gt;");
  });

  it("leaves the plain-text body unescaped", () => {
    // Text bodies are rendered literally, so an escaped entity here
    // shows up as "&amp;" in the client's inbox.
    const { text } = renderAgreementEmail({
      ...base,
      propertyLabel: "Ochieng & Sons",
    });
    expect(text).toContain("Ochieng & Sons");
  });

  it("says the property stays off the market until accepted", () => {
    // The whole reason for the email: acceptance gates going live, so
    // the client needs to know inaction has a cost.
    const { text, html } = renderAgreementEmail(base);
    expect(text).toMatch(/stays off the market until/i);
    expect(html).toMatch(/stays off the market until/i);
  });
});
