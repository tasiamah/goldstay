import { describe, expect, it } from "vitest";
import type { AgreementStatus, PropertyStatus } from "@prisma/client";
import {
  CLIENT_AGREEMENT_FILTERS,
  clientAgreementWhere,
  parseClientAgreementFilter,
  rollupClientAgreements,
} from "./client-agreements";

// Terse builders, because the interesting part of each case is the
// status mix and not the object literal around it.
function property(status: PropertyStatus, ...agreements: AgreementStatus[]) {
  return { status, agreements: agreements.map((s) => ({ status: s })) };
}

const active = (...a: AgreementStatus[]) => property("ACTIVE", ...a);
const onboarding = (...a: AgreementStatus[]) => property("ONBOARDING", ...a);
const exited = (...a: AgreementStatus[]) => property("EXITED", ...a);

describe("rollupClientAgreements", () => {
  it("reports a client with no properties as having nothing to sign", () => {
    const r = rollupClientAgreements([]);
    expect(r.state).toBe("no-properties");
    expect(r.label).toBe("No properties");
  });

  it("separates 'no agreement issued' from 'sent and ignored'", () => {
    // These look identical if you only ask "is anything signed", but
    // they need different actions: one is ours to issue, the other is
    // the client's to sign.
    const r = rollupClientAgreements([active()]);
    expect(r.state).toBe("not-issued");
    expect(r.notIssued).toBe(1);
    expect(r.label).toBe("Not issued");
  });

  it("flags a single outstanding signature", () => {
    const r = rollupClientAgreements([active("SENT")]);
    expect(r.state).toBe("awaiting");
    expect(r.awaiting).toBe(1);
    expect(r.label).toBe("Awaiting signature");
  });

  it("treats DRAFT as outstanding, not as nothing", () => {
    const r = rollupClientAgreements([active("DRAFT")]);
    expect(r.state).toBe("awaiting");
    expect(r.awaiting).toBe(1);
  });

  it("confirms a fully signed client", () => {
    const r = rollupClientAgreements([active("SIGNED")]);
    expect(r.state).toBe("signed");
    expect(r.signed).toBe(1);
    expect(r.label).toBe("Signed");
  });

  it("counts signatures when there are several properties", () => {
    // "Signed" alone against a three-property client reads as though
    // one document covered all three.
    const r = rollupClientAgreements([
      active("SIGNED"),
      active("SIGNED"),
      onboarding("SIGNED"),
    ]);
    expect(r.label).toBe("3 signed");
  });

  it("spells out the partially signed client", () => {
    const r = rollupClientAgreements([
      active("SIGNED"),
      active("SIGNED"),
      onboarding("SENT"),
    ]);
    expect(r.state).toBe("awaiting");
    expect(r.awaiting).toBe(1);
    expect(r.signed).toBe(2);
    expect(r.label).toBe("1 of 3 awaiting");
  });

  it("pluralises multiple outstanding signatures", () => {
    const r = rollupClientAgreements([active("SENT"), onboarding("SENT")]);
    expect(r.label).toBe("2 awaiting signature");
  });

  it("ignores cancelled agreements entirely", () => {
    // Cancelled rows are kept for audit and superseded by a new
    // agreement. Counting them either way would be wrong.
    const r = rollupClientAgreements([active("CANCELLED")]);
    expect(r.state).toBe("not-issued");
    expect(r.awaiting).toBe(0);
    expect(r.signed).toBe(0);
  });

  it("does not let a cancelled row mask a real signature", () => {
    const r = rollupClientAgreements([active("CANCELLED", "SIGNED")]);
    expect(r.state).toBe("signed");
    expect(r.signed).toBe(1);
  });

  it("still chases a reissued agreement on an already signed property", () => {
    // Terms changed after signature, so a new agreement went out. The
    // client genuinely does owe us another signature, and showing this
    // as done would lose that.
    const r = rollupClientAgreements([active("SIGNED", "SENT")]);
    expect(r.state).toBe("awaiting");
    expect(r.awaiting).toBe(1);
    expect(r.signed).toBe(0);
  });

  it("excludes exited properties from the rollup", () => {
    // Nobody is chasing a signature on a property we have finished
    // with, and counting it would leave the client permanently amber.
    const r = rollupClientAgreements([active("SIGNED"), exited("SENT")]);
    expect(r.state).toBe("signed");
    expect(r.awaiting).toBe(0);
    expect(r.label).toBe("Signed");
  });

  it("treats a client whose only property has exited as having none", () => {
    const r = rollupClientAgreements([exited("SIGNED")]);
    expect(r.state).toBe("no-properties");
  });

  it("uses amber for action-required and emerald for done", () => {
    // The palette is shared with the agreement pills elsewhere in the
    // admin, so the colour means the same thing on every surface.
    expect(rollupClientAgreements([active("SENT")]).className).toContain(
      "amber",
    );
    expect(rollupClientAgreements([active("SIGNED")]).className).toContain(
      "emerald",
    );
  });
});

describe("parseClientAgreementFilter", () => {
  it("accepts the supported filters", () => {
    for (const f of CLIENT_AGREEMENT_FILTERS) {
      expect(parseClientAgreementFilter(f)).toBe(f);
    }
  });

  it("rejects anything else rather than throwing", () => {
    // Filters come straight off the URL, so junk has to degrade to
    // "unfiltered" instead of erroring the page.
    for (const junk of ["", "SIGNED", "pending", "../", "true"]) {
      expect(parseClientAgreementFilter(junk)).toBeNull();
    }
  });
});

describe("clientAgreementWhere", () => {
  it("returns null when unfiltered so the caller omits the clause", () => {
    expect(clientAgreementWhere(null)).toBeNull();
  });

  it("builds a predicate for every supported filter", () => {
    for (const f of CLIENT_AGREEMENT_FILTERS) {
      expect(clientAgreementWhere(f)).not.toBeNull();
    }
  });

  it("makes 'all signed' exclude the partially signed client", () => {
    // Otherwise the two filters overlap and a client who owes us a
    // signature hides inside the reassuring one.
    const where = clientAgreementWhere("signed");
    expect(JSON.stringify(where)).toContain("NOT");
  });

  it("scopes every predicate to non-exited properties", () => {
    // Matching the rollup matters: a filter that counted exited
    // properties would return rows whose badge says something else.
    for (const f of CLIENT_AGREEMENT_FILTERS) {
      const json = JSON.stringify(clientAgreementWhere(f));
      expect(json, f).toContain("ONBOARDING");
      expect(json, f).toContain("ACTIVE");
      expect(json, f).not.toContain("EXITED");
    }
  });

  it("never treats a cancelled agreement as outstanding", () => {
    const json = JSON.stringify(clientAgreementWhere("awaiting"));
    expect(json).toContain("DRAFT");
    expect(json).toContain("SENT");
    expect(json).not.toContain("CANCELLED");
  });
});
