import { describe, expect, it } from "vitest";
import {
  formatAgreementReference,
  newAcceptanceReference,
  nextAgreementReference,
} from "./reference";

describe("formatAgreementReference", () => {
  it("zero-pads to three digits and keeps growing past 999", () => {
    expect(formatAgreementReference(2026, 1)).toBe("GS-2026-001");
    expect(formatAgreementReference(2026, 47)).toBe("GS-2026-047");
    // Padding is a minimum width, not a cap — the 1000th agreement
    // must still get a reference rather than wrap to 000.
    expect(formatAgreementReference(2026, 1234)).toBe("GS-2026-1234");
  });
});

describe("nextAgreementReference", () => {
  it("counts only the current UTC year and returns the next number", async () => {
    let captured: unknown;
    const db = {
      managementAgreement: {
        count: async (args: unknown) => {
          captured = args;
          return 3;
        },
      },
    } as never;

    const ref = await nextAgreementReference(db, new Date("2026-09-02T09:00:00Z"));
    expect(ref).toBe("GS-2026-004");
    // The window has to be the calendar year in UTC, otherwise an
    // agreement issued on 1 January in Nairobi (UTC+3) lands in the
    // wrong year's sequence.
    expect(captured).toEqual({
      where: {
        createdAt: {
          gte: new Date("2026-01-01T00:00:00Z"),
          lt: new Date("2027-01-01T00:00:00Z"),
        },
      },
    });
  });
});

describe("newAcceptanceReference", () => {
  it("is unguessable, unambiguous and year-stamped", () => {
    const refs = new Set(
      Array.from({ length: 200 }, () =>
        newAcceptanceReference(new Date("2026-09-02T09:00:00Z")),
      ),
    );
    // Random, so 200 draws should not collide.
    expect(refs.size).toBe(200);

    for (const ref of refs) {
      expect(ref).toMatch(/^GS-A-2026-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{8}$/);
      // Glyphs a client could misread when typing a receipt back to
      // us must not appear.
      expect(ref.slice(9)).not.toMatch(/[01OIL]/);
    }
  });
});
