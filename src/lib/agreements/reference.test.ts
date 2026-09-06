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
  const dbWith = (references: (string | null)[]) => {
    let captured: unknown;
    const db = {
      managementAgreement: {
        findMany: async (args: unknown) => {
          captured = args;
          return references.map((reference) => ({ reference }));
        },
      },
    } as never;
    return { db, seen: () => captured };
  };

  const at = new Date("2026-09-02T09:00:00Z");

  it("scopes to the current UTC year and returns the next number", async () => {
    const { db, seen } = dbWith(["GS-2026-001", "GS-2026-002", "GS-2026-003"]);

    expect(await nextAgreementReference(db, at)).toBe("GS-2026-004");
    // Scoped by the year in the reference itself, so an agreement
    // issued on 1 January in Nairobi (UTC+3) can't be counted against
    // the wrong year's sequence.
    expect(seen()).toEqual({
      where: { reference: { startsWith: "GS-2026-" } },
      select: { reference: true },
    });
  });

  it("steps past the highest reference, not the number of rows", async () => {
    // A hard-deleted agreement leaves a gap. Counting rows would hand
    // back GS-2026-003, which the unique index is still holding, and
    // every issue from then on would fail.
    const { db } = dbWith(["GS-2026-001", "GS-2026-003"]);

    expect(await nextAgreementReference(db, at)).toBe("GS-2026-004");
  });

  it("compares sequences numerically once past 999", async () => {
    // Sorted as text GS-2026-999 outranks GS-2026-1000, which would
    // reissue a reference already in use.
    const { db } = dbWith(["GS-2026-999", "GS-2026-1000"]);

    expect(await nextAgreementReference(db, at)).toBe("GS-2026-1001");
  });

  it("starts at 001 in a year with nothing issued yet", async () => {
    const { db } = dbWith([]);

    expect(await nextAgreementReference(db, at)).toBe("GS-2026-001");
  });

  it("ignores references that aren't a plain sequence", async () => {
    const { db } = dbWith(["GS-2026-002", "GS-2026-draft", null]);

    expect(await nextAgreementReference(db, at)).toBe("GS-2026-003");
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
