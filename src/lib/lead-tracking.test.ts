import { describe, expect, it } from "vitest";
import { leadEventPayload } from "./lead-tracking";

describe("leadEventPayload", () => {
  it("marks the method as form, to separate it from wa.me clicks", () => {
    // Both paths emit generate_lead so GA4 has one key event. If this
    // value stops distinguishing them the two sources become one
    // undifferentiated number.
    const payload = leadEventPayload({
      form: "list-property",
      pathname: "/list-your-property",
    });

    expect(payload.method).toBe("form");
    expect(payload.form).toBe("list-property");
  });

  it("separates landlord conversions from tenant supply", () => {
    expect(
      leadEventPayload({ form: "list-property", pathname: "/" }).audience,
    ).toBe("landlord");
    expect(leadEventPayload({ form: "start", pathname: "/" }).audience).toBe(
      "landlord",
    );
    expect(
      leadEventPayload({ form: "tenant-application", pathname: "/" }).audience,
    ).toBe("tenant");
    expect(
      leadEventPayload({ form: "tenant-waitlist", pathname: "/" }).audience,
    ).toBe("tenant");
  });

  it("strips a trailing slash so one page is not counted as two", () => {
    expect(
      leadEventPayload({ form: "start", pathname: "/pricing/" }).page_path,
    ).toBe("/pricing");
    expect(
      leadEventPayload({ form: "start", pathname: "/pricing" }).page_path,
    ).toBe("/pricing");
  });

  it("keeps the root as a single slash rather than emptying it", () => {
    expect(leadEventPayload({ form: "start", pathname: "/" }).page_path).toBe(
      "/",
    );
  });
});
