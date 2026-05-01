import { describe, expect, it } from "vitest";
import {
  PALETTE_ACTIONS,
  filterPaletteActions,
} from "./search";

describe("filterPaletteActions", () => {
  it("returns all actions for an empty query", () => {
    expect(filterPaletteActions("")).toHaveLength(PALETTE_ACTIONS.length);
  });

  it("matches on label substring (case insensitive)", () => {
    const got = filterPaletteActions("OWN");
    expect(got.some((a) => a.id === "create-owner")).toBe(true);
    expect(got.some((a) => a.id === "open-owners")).toBe(true);
  });

  it("matches on hint when label doesn't match", () => {
    const got = filterPaletteActions("landlord");
    expect(got.some((a) => a.id === "create-owner")).toBe(true);
  });

  it("returns empty array when nothing matches", () => {
    expect(filterPaletteActions("xyzz123")).toEqual([]);
  });
});
