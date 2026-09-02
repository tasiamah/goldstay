import { describe, expect, it } from "vitest";
import {
  REQUIRED_PROPERTY_DOC_KINDS,
  labelForRequiredDoc,
  missingPropertyDocKinds,
} from "./property-documents";

// Required-document logic drives a dashboard banner, so the risks
// worth covering are: a property with no documents at all is fully
// missing the required set; a property with the required set is
// clean even if it has extra unrelated kinds; the helper is tolerant
// to unknown kinds in the uploaded list (forward-compat with new
// DocumentKind enum values added in future migrations).

describe("missingPropertyDocKinds", () => {
  it("returns the full required set for a property with no uploads", () => {
    expect(missingPropertyDocKinds([])).toEqual(REQUIRED_PROPERTY_DOC_KINDS);
  });

  it("returns nothing when every required kind is uploaded", () => {
    expect(missingPropertyDocKinds(["TITLE_DEED"])).toEqual([]);
  });

  it("ignores unrelated kinds and uploaded duplicates", () => {
    expect(
      missingPropertyDocKinds([
        "TITLE_DEED",
        "TITLE_DEED",
        "SALE_AGREEMENT",
        "PHOTO",
      ]),
    ).toEqual([]);
  });

  it("does not regress when only adjacent kinds are uploaded", () => {
    expect(missingPropertyDocKinds(["SALE_AGREEMENT", "PHOTO"])).toEqual([
      "TITLE_DEED",
    ]);
  });
});

describe("labelForRequiredDoc", () => {
  it("returns the registered human label for known kinds", () => {
    expect(labelForRequiredDoc("TITLE_DEED")).toBe("Title deed");
    expect(labelForRequiredDoc("SALE_AGREEMENT")).toBe("Sale agreement");
  });

  it("falls back to a humanised enum name for unregistered kinds", () => {
    expect(labelForRequiredDoc("PHOTO")).toBe("Photo");
    expect(labelForRequiredDoc("MANAGEMENT_AGREEMENT")).toBe(
      "Management agreement",
    );
  });
});
