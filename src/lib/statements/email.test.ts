import { describe, expect, it } from "vitest";
import { copiedLine, renderEmailBody, renderEmailHtml } from "./email";
import { firstStatementNote } from "./first-statement";

// The statement is the only client email that reaches anybody other
// than the account holder, so the line disclosing that is worth
// testing: it is read by co-owners who are not our client, and it
// makes a claim about what they can do.

const PERIOD = { year: 2026, month: 8 };
const CLIENT = { fullName: "Asha Kimani", companyName: null };

function body(observers: { email: string; name: string | null }[]) {
  return renderEmailBody({
    client: CLIENT,
    period: PERIOD,
    siteUrl: "https://goldstay.co.ke",
    isEmpty: false,
    summary: "12 transactions",
    observers,
  });
}

describe("copiedLine", () => {
  // The common case by a wide margin. Most clients copy nobody, and
  // their statement must be byte-identical to what it was before this
  // feature existed.
  it("is absent when nobody is copied", () => {
    expect(copiedLine([], "Asha Kimani")).toBeNull();
    expect(body([])).not.toContain("Copied to");
  });

  it("names a single observer", () => {
    const line = copiedLine(
      [{ email: "w@example.com", name: "Wanjiru" }],
      "Asha Kimani",
    );
    expect(line).toContain("Copied to Wanjiru, at Asha Kimani's request");
  });

  it("reads as a list for two or more", () => {
    const line = copiedLine(
      [
        { email: "w@example.com", name: "Wanjiru" },
        { email: "j@example.com", name: "Jane" },
        { email: "k@example.com", name: "Kioko" },
      ],
      "Asha Kimani",
    );
    expect(line).toContain("Copied to Wanjiru, Jane and Kioko");
  });

  it("falls back to the address when an observer has no name", () => {
    const line = copiedLine([{ email: "w@example.com", name: null }], "Asha");
    expect(line).toContain("w@example.com");
  });

  it("ignores a whitespace-only name", () => {
    const line = copiedLine([{ email: "w@example.com", name: "  " }], "Asha");
    expect(line).toContain("w@example.com");
  });

  // The claim the line exists to make. An observer must not come away
  // thinking they can act on the account.
  it("says the copies are read-only and how to stop them", () => {
    const line = copiedLine([{ email: "w@example.com", name: "Wanjiru" }], "Asha")!;
    expect(line).toContain("cannot sign in");
    expect(line).toContain("remove them under Account");
  });

  it("degrades to a readable sentence without a client name", () => {
    const line = copiedLine([{ email: "w@example.com", name: null }], "   ")!;
    expect(line).toContain("the account holder's request");
    expect(line).not.toContain("'s request. They receive the statement only and cannot sign in or change anything. .");
  });
});

describe("renderEmailBody", () => {
  it("puts the disclosure after the sign-off, not in the middle", () => {
    const text = body([{ email: "w@example.com", name: "Wanjiru" }]);
    expect(text.indexOf("— The Goldstay team")).toBeLessThan(
      text.indexOf("Copied to Wanjiru"),
    );
  });

  it("still carries the portal link and the payout terms", () => {
    const text = body([{ email: "w@example.com", name: "Wanjiru" }]);
    expect(text).toContain("/client/statements/2026/8");
    expect(text).toContain("remitted by the 10th");
  });

  // An observer receives this email, and it must not be a credential.
  it("contains no sign-in link", () => {
    const text = body([{ email: "w@example.com", name: "Wanjiru" }]);
    expect(text).not.toMatch(/magiclink|access_token|hashed_token|supabase/i);
  });
});

// The note explaining a low first month has to reach the body of the
// email, not only the attached PDF: the figure a client reacts to is
// the one they read on their phone, and the attachment is opened
// later if at all.
describe("first-statement note in the email", () => {
  const note = firstStatementNote({ isPartMonth: true });

  function withNote(render: typeof renderEmailBody | typeof renderEmailHtml) {
    return render({
      client: CLIENT,
      period: PERIOD,
      siteUrl: "https://goldstay.co.ke",
      isEmpty: false,
      summary: "12 transactions",
      observers: [],
      firstStatementNote: note,
    });
  }

  it("carries every sentence into the text body", () => {
    const text = withNote(renderEmailBody);
    for (const line of note) expect(text).toContain(line);
    expect(text).toContain("About your first statement");
  });

  it("carries every sentence into the HTML body", () => {
    const html = withNote(renderEmailHtml);
    for (const line of note) {
      // The apostrophe in "August 2026's" is escaped in HTML, which
      // is correct and means comparing against the raw sentence
      // would pass for the wrong reason.
      expect(html).toContain(line.replace(/'/g, "&#39;"));
    }
  });

  it("leaves a normal month's email exactly as it was", () => {
    expect(body([])).not.toContain("About your first statement");
    expect(
      renderEmailHtml({
        client: CLIENT,
        period: PERIOD,
        siteUrl: "https://goldstay.co.ke",
        isEmpty: false,
        summary: "12 transactions",
        observers: [],
      }),
    ).not.toContain("About your first statement");
  });
});
