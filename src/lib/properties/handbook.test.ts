import { describe, expect, it } from "vitest";
import {
  HANDBOOK_FIELDS,
  changedHandbookFields,
  handbookCompleteness,
  handbookValuesFrom,
  type HandbookValues,
} from "./handbook";
import {
  HandbookInput,
  handbookValuesFromFormData,
} from "./handbook-input";

function formOf(values: Record<string, string>): FormData {
  const fd = new FormData();
  for (const [k, v] of Object.entries(values)) fd.set(k, v);
  return fd;
}

function parse(values: Record<string, string>) {
  return HandbookInput.safeParse(handbookValuesFromFormData(formOf(values)));
}

describe("handbook field definitions", () => {
  // The two forms render from this list and the zod schema is built
  // from it, so a duplicate name would silently drop a field from one
  // of them.
  it("has no duplicate field names", () => {
    const names = HANDBOOK_FIELDS.map((f) => f.name);
    expect(new Set(names).size).toBe(names.length);
  });

  it("gives every field a label, a hint and a positive max length", () => {
    for (const f of HANDBOOK_FIELDS) {
      expect(f.label.length).toBeGreaterThan(0);
      expect(f.hint.length).toBeGreaterThan(0);
      expect(f.maxLength).toBeGreaterThan(0);
    }
  });

  // The single-line fields are the two that are a value rather than an
  // instruction. If a paragraph-length field ever became "line" the
  // form would put a 2000-character instruction in a text input.
  it("only uses single-line inputs for short values", () => {
    for (const f of HANDBOOK_FIELDS) {
      if (f.kind === "line") expect(f.maxLength).toBeLessThanOrEqual(200);
    }
  });

  it("marks what an operator cannot run a changeover without", () => {
    const essentials = HANDBOOK_FIELDS.filter((f) => f.essential).map(
      (f) => f.name,
    );
    expect(essentials).toEqual([
      "checkInNotes",
      "wifiNetwork",
      "wifiPassword",
      "electricityNotes",
    ]);
  });
});

describe("HandbookInput", () => {
  it("collapses blank and whitespace-only fields to null", () => {
    const r = parse({ wifiNetwork: "   ", checkInNotes: "" });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.wifiNetwork).toBeNull();
    expect(r.data.checkInNotes).toBeNull();
  });

  it("treats an entirely absent field as null rather than an error", () => {
    // A form post that omits a field must not fail: both forms render
    // every field, but a partial POST should clear rather than 500.
    const r = HandbookInput.safeParse(handbookValuesFromFormData(new FormData()));
    expect(r.success).toBe(true);
    if (!r.success) return;
    for (const f of HANDBOOK_FIELDS) expect(r.data[f.name]).toBeNull();
  });

  it("trims surrounding whitespace but keeps the text", () => {
    const r = parse({ wifiPassword: "  Sun$hine2026  " });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.wifiPassword).toBe("Sun$hine2026");
  });

  it("preserves newlines inside a block field", () => {
    const r = parse({ checkInNotes: "Gate 2.\nAsk for Joseph.\nFlat 4B." });
    expect(r.success).toBe(true);
    if (!r.success) return;
    expect(r.data.checkInNotes).toBe("Gate 2.\nAsk for Joseph.\nFlat 4B.");
  });

  // Refusing the save beats truncating it. These are instructions
  // someone follows at a locked gate, and dropping the last sentence
  // silently is worse than an error the owner can act on.
  it("rejects an over-length field instead of truncating it", () => {
    const field = HANDBOOK_FIELDS.find((f) => f.name === "wifiNetwork")!;
    const r = parse({ wifiNetwork: "a".repeat(field.maxLength + 1) });
    expect(r.success).toBe(false);
    if (r.success) return;
    expect(r.error.issues[0].path[0]).toBe("wifiNetwork");
  });

  it("accepts a field at exactly its maximum length", () => {
    const field = HANDBOOK_FIELDS.find((f) => f.name === "otherNotes")!;
    const r = parse({ otherNotes: "a".repeat(field.maxLength) });
    expect(r.success).toBe(true);
  });
});

describe("handbookValuesFrom", () => {
  it("returns every field as null when there is no handbook row", () => {
    const v = handbookValuesFrom(null);
    expect(Object.keys(v).sort()).toEqual(
      HANDBOOK_FIELDS.map((f) => f.name).sort(),
    );
    for (const f of HANDBOOK_FIELDS) expect(v[f.name]).toBeNull();
  });

  // The row carries ids, timestamps and the author alongside the ten
  // editable values. A form must receive only the ten.
  it("drops everything that is not an editable field", () => {
    const v = handbookValuesFrom({
      wifiNetwork: "Goldstay-4B",
      id: "abc",
      propertyId: "prop_1",
      updatedByEmail: "ops@goldstay.co.ke",
    } as never);
    expect(v.wifiNetwork).toBe("Goldstay-4B");
    expect(Object.keys(v)).toHaveLength(HANDBOOK_FIELDS.length);
    expect("updatedByEmail" in v).toBe(false);
  });
});

describe("handbookCompleteness", () => {
  const empty = handbookValuesFrom(null);

  it("reports nothing done for an empty handbook", () => {
    const c = handbookCompleteness(empty);
    expect(c.filled).toBe(0);
    expect(c.essentialFilled).toBe(0);
    expect(c.essentialsDone).toBe(false);
    expect(c.missingEssentialLabels).toHaveLength(c.essentialTotal);
  });

  // The point of splitting essentials out: a handbook with the four
  // that matter answered is usable, and a progress bar over all ten
  // would call that 40% done and imply otherwise.
  it("is done once the four essentials are answered, with six blank", () => {
    const c = handbookCompleteness({
      ...empty,
      checkInNotes: "Gate 2, ask for Joseph.",
      wifiNetwork: "Goldstay-4B",
      wifiPassword: "Sun$hine2026",
      electricityNotes: "Meter 14203887761, Kenya Power paybill 888880.",
    });
    expect(c.essentialsDone).toBe(true);
    expect(c.essentialFilled).toBe(4);
    expect(c.filled).toBe(4);
    expect(c.missingEssentialLabels).toEqual([]);
  });

  it("does not count a whitespace-only answer as filled", () => {
    const c = handbookCompleteness({ ...empty, wifiNetwork: "   " });
    expect(c.filled).toBe(0);
    expect(c.essentialsDone).toBe(false);
  });

  it("names the missing essentials so the UI can list them", () => {
    const c = handbookCompleteness({
      ...empty,
      checkInNotes: "Gate 2.",
      wifiNetwork: "Goldstay-4B",
    });
    expect(c.missingEssentialLabels).toEqual([
      "WiFi password",
      "Electricity and tokens",
    ]);
  });

  it("counts the optional fields towards the overall total only", () => {
    const c = handbookCompleteness({ ...empty, parkingNotes: "Bay 14." });
    expect(c.filled).toBe(1);
    expect(c.essentialFilled).toBe(0);
    expect(c.total).toBe(HANDBOOK_FIELDS.length);
  });
});

describe("changedHandbookFields", () => {
  const empty = handbookValuesFrom(null);

  it("reports nothing when a save changes nothing", () => {
    const values: HandbookValues = { ...empty, wifiNetwork: "Goldstay-4B" };
    expect(changedHandbookFields(values, values)).toEqual([]);
  });

  it("names only the fields that moved", () => {
    const before: HandbookValues = {
      ...empty,
      wifiNetwork: "Goldstay-4B",
      wifiPassword: "old-one",
    };
    const after: HandbookValues = {
      ...before,
      wifiPassword: "Sun$hine2026",
      parkingNotes: "Bay 14.",
    };
    expect(changedHandbookFields(before, after)).toEqual([
      "wifiPassword",
      "parkingNotes",
    ]);
  });

  it("treats a first save against no existing row as all-new", () => {
    const after: HandbookValues = { ...empty, wifiNetwork: "Goldstay-4B" };
    expect(changedHandbookFields(null, after)).toEqual(["wifiNetwork"]);
  });

  it("counts clearing a field as a change", () => {
    const before: HandbookValues = { ...empty, parkingNotes: "Bay 14." };
    expect(changedHandbookFields(before, empty)).toEqual(["parkingNotes"]);
  });
});
