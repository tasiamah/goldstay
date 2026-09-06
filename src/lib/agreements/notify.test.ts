import { describe, expect, it } from "vitest";
import { renderAgreementAcceptedEmail, renderAgreementEmail } from "./notify";

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

// The inbound notification. This one goes to our own inbox, so the
// requirement is different: it has to carry enough of the acceptance
// record to act on and to file, and it has to make the next step
// obvious, because acceptance is the gate on the property going live.
const accepted = {
  agreementId: "agr_1",
  reference: "GS-2026-014",
  propertyId: "prop_1",
  propertyLabel: "Riverside Apartments 4B",
  propertyCity: "Nairobi",
  clientName: "Asha Wanjiru",
  clientEmail: "asha@example.com",
  signedByName: "Asha Wanjiru",
  signedAt: new Date("2026-09-06T08:29:00Z"),
  signingCapacity: "REGISTERED_OWNER" as const,
  templateTitle: "Long-term property management agreement",
  templateVersion: "long-let-ke-v1",
  acceptanceReference: "GS-A-7F3K2Q",
  signedByIp: "41.90.64.12",
  adminLink: "https://goldstay.co.ke/admin/properties/prop_1",
};

describe("renderAgreementAcceptedEmail", () => {
  it("identifies the property and client in the subject", () => {
    // Several of these can land in a day, and the inbox is shared, so
    // the subject has to be triageable without opening it.
    expect(renderAgreementAcceptedEmail(accepted).subject).toBe(
      "Agreement accepted · Riverside Apartments 4B · Asha Wanjiru",
    );
  });

  it("points at the admin property page and names the next step", () => {
    const { text } = renderAgreementAcceptedEmail(accepted);
    expect(text).toContain(accepted.adminLink);
    expect(text).toMatch(/no longer blocked from going live/i);
  });

  it("carries the full acceptance record", () => {
    // These are the fields a dispute turns on. If the email is the
    // only thing someone kept, it should still answer "who accepted
    // what, when, and under which words".
    const { text } = renderAgreementAcceptedEmail(accepted);
    expect(text).toContain("long-let-ke-v1");
    expect(text).toContain("Long-term property management agreement");
    expect(text).toContain("GS-2026-014");
    expect(text).toContain("GS-A-7F3K2Q");
    expect(text).toContain("41.90.64.12");
    expect(text).toContain("asha@example.com");
    expect(text).toContain("Registered owner");
  });

  it("reports the time in Nairobi, not UTC", () => {
    // 08:29 UTC is 11:29 in Nairobi. An ops team in EAT reading a UTC
    // timestamp will misjudge how long a property has been sitting.
    const { text } = renderAgreementAcceptedEmail(accepted);
    expect(text).toContain("11:29");
    expect(text).toContain("EAT");
  });

  it("distinguishes the executing name from the client's name", () => {
    // A company client accepts as "Acme Ltd (accepted by Asha)", and
    // which human clicked is the part worth knowing.
    const { text } = renderAgreementAcceptedEmail({
      ...accepted,
      clientName: "Acme Holdings Ltd",
      signedByName: "Acme Holdings Ltd (accepted by Asha Wanjiru)",
    });
    expect(text).toContain("Accepted as: Acme Holdings Ltd (accepted by Asha");
  });

  it("says so rather than printing null for a record we don't have", () => {
    // Agreements predating references, and acceptances where the proxy
    // gave us no forwarded IP.
    const { text } = renderAgreementAcceptedEmail({
      ...accepted,
      reference: null,
      acceptanceReference: null,
      signedByIp: null,
    });
    expect(text).not.toContain("null");
    expect(text).toContain("Agreement reference: none");
    expect(text).toContain("IP: not recorded");
  });
});
