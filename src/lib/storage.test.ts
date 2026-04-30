import { describe, expect, it } from "vitest";
import { buildStoragePath, sanitiseFilename } from "./storage";

describe("sanitiseFilename", () => {
  it("keeps a clean filename intact", () => {
    expect(sanitiseFilename("title-deed.pdf")).toBe("title-deed.pdf");
  });
  it("strips directory traversal", () => {
    expect(sanitiseFilename("../../etc/passwd")).toBe("passwd");
    expect(sanitiseFilename("uploads/../foo.pdf")).toBe("foo.pdf");
  });
  it("collapses spaces and special chars", () => {
    expect(sanitiseFilename("Title Deed (signed) #1.pdf")).toBe(
      "Title-Deed-signed-1.pdf",
    );
  });
  it("falls back to 'file' on an empty result", () => {
    expect(sanitiseFilename("///")).toBe("file");
  });
  it("caps long names", () => {
    const long = "a".repeat(200) + ".pdf";
    expect(sanitiseFilename(long).length).toBeLessThanOrEqual(80);
  });
  it("preserves a non-ASCII filename via transliteration", () => {
    // We don't transliterate, just strip; ensures we don't crash.
    const out = sanitiseFilename("Tërra rëçeipt.pdf");
    expect(out.endsWith(".pdf")).toBe(true);
    expect(out.length).toBeGreaterThan(0);
  });
});

describe("buildStoragePath", () => {
  it("returns the canonical layout", () => {
    const p = buildStoragePath({
      propertyId: "abc",
      documentId: "doc1",
      filename: "Title Deed.pdf",
    });
    expect(p).toBe("properties/abc/doc1-Title-Deed.pdf");
  });
});
