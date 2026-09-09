import { describe, expect, it } from "vitest";
import {
  decodeAdsCookie,
  encodeAdsCookie,
  hasClickId,
  parseAdsParams,
} from "./attribution";

const AT = new Date("2026-09-09T12:00:00.000Z");

describe("parseAdsParams", () => {
  it("captures a gclid from a default auto-tagged ad click", () => {
    // The case the whole module exists for: Google Ads auto-tagging
    // appends gclid and nothing else, so there is no utm_medium to
    // classify on.
    const click = parseAdsParams(
      "?gclid=EAIaIQobChMIxyz-123_ABC",
      "/manage-my-property",
      AT,
    );
    expect(click?.gclid).toBe("EAIaIQobChMIxyz-123_ABC");
    expect(click?.utmMedium).toBeNull();
    expect(click?.landingPath).toBe("/manage-my-property");
    expect(click?.clickedAt).toBe(AT.toISOString());
  });

  it("captures wbraid and gbraid, which replace gclid on restricted iOS traffic", () => {
    expect(parseAdsParams("?wbraid=Cj0abc", "/", AT)?.wbraid).toBe("Cj0abc");
    expect(parseAdsParams("?gbraid=0AAAdef", "/", AT)?.gbraid).toBe("0AAAdef");
  });

  it("returns null when there is nothing campaign related", () => {
    // Middleware uses this to decide whether to set a cookie at all.
    // Returning a record here would put a Set-Cookie on every
    // marketing request and take the static routes out of the edge
    // cache.
    expect(parseAdsParams("", "/insights", AT)).toBeNull();
    expect(parseAdsParams("?page=2", "/insights", AT)).toBeNull();
  });

  it("captures utm params on their own, for campaigns we tag ourselves", () => {
    const click = parseAdsParams(
      "?utm_source=google&utm_medium=cpc&utm_campaign=manage-ke&utm_term=property+manager+nairobi",
      "/manage-my-property",
      AT,
    );
    expect(click?.utmMedium).toBe("cpc");
    expect(click?.utmCampaign).toBe("manage-ke");
    expect(click?.utmTerm).toBe("property manager nairobi");
    expect(click?.gclid).toBeNull();
  });

  it("rejects a click id that is not shaped like one", () => {
    // This value gets uploaded to Google as the key of a conversion,
    // and it arrives on a query string anyone can write.
    expect(parseAdsParams("?gclid=<script>", "/", AT)).toBeNull();
    expect(parseAdsParams("?gclid=a b c", "/", AT)).toBeNull();
  });

  it("caps an absurdly long click id rather than storing it", () => {
    const long = "a".repeat(500);
    const click = parseAdsParams(`?gclid=${long}`, "/", AT);
    expect(click?.gclid?.length).toBe(200);
  });
});

describe("ads cookie round trip", () => {
  it("survives encode and decode", () => {
    const click = parseAdsParams(
      "?gclid=EAIaIQ_abc&utm_campaign=manage-ke&utm_term=airbnb+manager",
      "/manage-my-property",
      AT,
    );
    expect(click).not.toBeNull();
    const decoded = decodeAdsCookie(encodeAdsCookie(click!));
    expect(decoded).toEqual(click);
  });

  it("rejects a forged cookie carrying a junk click id", () => {
    expect(decodeAdsCookie("g=not%20a%20click%20id")).toBeNull();
  });

  it("drops a landing path that tries to assert a host", () => {
    const decoded = decodeAdsCookie("g=EAIabc&p=https%3A%2F%2Fevil.example");
    expect(decoded?.gclid).toBe("EAIabc");
    expect(decoded?.landingPath).toBeNull();
  });

  it("returns null for empty and unparseable values", () => {
    expect(decodeAdsCookie(null)).toBeNull();
    expect(decodeAdsCookie("")).toBeNull();
    expect(decodeAdsCookie("nonsense")).toBeNull();
  });
});

describe("hasClickId", () => {
  it("is true when any of the three ids is present", () => {
    const none = { gclid: null, wbraid: null, gbraid: null };
    expect(hasClickId(none)).toBe(false);
    expect(hasClickId({ ...none, gclid: "a" })).toBe(true);
    expect(hasClickId({ ...none, wbraid: "a" })).toBe(true);
    expect(hasClickId({ ...none, gbraid: "a" })).toBe(true);
  });
});
