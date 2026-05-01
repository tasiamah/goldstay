import { describe, expect, it } from "vitest";
import { buildStoragePath, sanitiseFilename } from "./storage";

// File upload sanitiser. The catastrophic bug class is path traversal
// — an `accountant.pdf` upload that ends up overwriting a system file
// because the "../" wasn't stripped. The 80-char cap also matters
// because S3 keys above the storage backend's limit silently 500.

describe("sanitiseFilename + buildStoragePath", () => {
  it("strips traversal, slugifies, caps length, and namespaces under properties/<id>/", () => {
    expect(sanitiseFilename("../../etc/passwd")).toBe("passwd");
    expect(sanitiseFilename("Title Deed (signed) #1.pdf")).toBe(
      "Title-Deed-signed-1.pdf",
    );
    expect(sanitiseFilename("///")).toBe("file");
    expect(sanitiseFilename("a".repeat(200) + ".pdf").length).toBeLessThanOrEqual(80);
    expect(
      buildStoragePath({
        propertyId: "abc",
        documentId: "doc1",
        filename: "Title Deed.pdf",
      }),
    ).toBe("properties/abc/doc1-Title-Deed.pdf");
  });
});
