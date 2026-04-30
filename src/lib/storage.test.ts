import { describe, expect, it } from "vitest";
import { buildStoragePath, sanitiseFilename } from "./storage";

describe("sanitiseFilename", () => {
  it("strips directory traversal", () => {
    expect(sanitiseFilename("../../etc/passwd")).toBe("passwd");
    expect(sanitiseFilename("uploads/../foo.pdf")).toBe("foo.pdf");
  });

  it("collapses spaces and special chars to dashes", () => {
    expect(sanitiseFilename("Title Deed (signed) #1.pdf")).toBe(
      "Title-Deed-signed-1.pdf",
    );
  });

  it("falls back to 'file' when the input contains nothing usable", () => {
    expect(sanitiseFilename("///")).toBe("file");
  });

  it("caps the on-disk key at 80 chars", () => {
    expect(sanitiseFilename("a".repeat(200) + ".pdf").length).toBeLessThanOrEqual(80);
  });
});

describe("buildStoragePath", () => {
  it("namespaces by property and prefixes the file with the document id", () => {
    expect(
      buildStoragePath({
        propertyId: "abc",
        documentId: "doc1",
        filename: "Title Deed.pdf",
      }),
    ).toBe("properties/abc/doc1-Title-Deed.pdf");
  });
});
