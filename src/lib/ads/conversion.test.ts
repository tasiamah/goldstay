import { describe, expect, it } from "vitest";
import { adsSendTo } from "./conversion";

const ID = "AW-18434399811";
const LABEL = "inUuCJKsrvIcEMD8mtZE";

describe("adsSendTo", () => {
  it("joins a valid id and label", () => {
    expect(adsSendTo(ID, LABEL)).toBe(`${ID}/${LABEL}`);
  });

  it("tolerates the whole send_to pasted into the label field", () => {
    expect(adsSendTo(ID, `${ID}/${LABEL}`)).toBe(`${ID}/${LABEL}`);
  });

  it("tolerates the whole send_to pasted into the id field", () => {
    expect(adsSendTo(`${ID}/${LABEL}`, undefined)).toBe(`${ID}/${LABEL}`);
  });

  it("trims whitespace, which a copy-paste routinely carries", () => {
    expect(adsSendTo(` ${ID} `, ` ${LABEL} `)).toBe(`${ID}/${LABEL}`);
  });

  // Every rejection below is silence at runtime rather than an error,
  // so the tests are the only place the difference is visible.
  it("returns null when unconfigured", () => {
    expect(adsSendTo(undefined, undefined)).toBeNull();
    expect(adsSendTo("", "")).toBeNull();
  });

  it("returns null when only one half is set", () => {
    expect(adsSendTo(ID, undefined)).toBeNull();
    expect(adsSendTo(undefined, LABEL)).toBeNull();
  });

  // The GA4 measurement id is the neighbouring env var and the
  // likeliest thing to end up in the wrong one.
  it("rejects a GA4 measurement id", () => {
    expect(adsSendTo("G-SWF0NXR0RE", LABEL)).toBeNull();
  });

  it("rejects an id that is not an AW id", () => {
    expect(adsSendTo("18434399811", LABEL)).toBeNull();
    expect(adsSendTo("AW-", LABEL)).toBeNull();
  });

  it("rejects a malformed combined value rather than sending it", () => {
    expect(adsSendTo("AW-18434399811/", undefined)).toBeNull();
    expect(adsSendTo("G-123/abc", undefined)).toBeNull();
  });

  it("rejects a label containing separators", () => {
    expect(adsSendTo(ID, "label with space")).toBeNull();
    expect(adsSendTo(ID, "label,other")).toBeNull();
  });
});
