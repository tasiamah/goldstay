import { describe, expect, it } from "vitest";
import {
  appendSourceRef,
  isWhatsAppHref,
  surfaceLabel,
} from "./whatsapp-tracking";
import { waLink } from "./site";

const at = (pathname: string, host = "goldstay.co.ke") => ({ host, pathname });

describe("isWhatsAppHref", () => {
  it("matches the links waLink builds", () => {
    expect(isWhatsAppHref(waLink("Hi Goldstay", "nairobi"))).toBe(true);
  });

  it("ignores everything else, including our own tel: links", () => {
    for (const href of [
      "/list-your-property",
      "https://goldstay.co.ke/about",
      "tel:+254702471993",
      "mailto:hello@goldstay.co.ke",
      "https://web.whatsapp.com/send?phone=254702471993",
      "",
      null,
      undefined,
    ]) {
      expect(isWhatsAppHref(href), String(href)).toBe(false);
    }
  });
});

describe("appendSourceRef", () => {
  it("names the page in the prefilled message", () => {
    const out = appendSourceRef(
      waLink("Hi Goldstay, I'd like to discuss managing my property"),
      at("/airbnb-management"),
    );
    const text = new URL(out).searchParams.get("text");
    expect(text).toContain("I'd like to discuss managing my property");
    expect(text).toContain("(Sent from goldstay.co.ke/airbnb-management)");
  });

  it("keeps the original message first and the ref as a footnote", () => {
    const out = appendSourceRef(waLink("Hi Goldstay"), at("/nairobi/kilimani"));
    const text = new URL(out).searchParams.get("text") ?? "";
    expect(text.startsWith("Hi Goldstay")).toBe(true);
    expect(text).toBe("Hi Goldstay\n\n(Sent from goldstay.co.ke/nairobi/kilimani)");
  });

  it("does not change the number being messaged", () => {
    const href = waLink("Hi", "nairobi");
    const before = new URL(href).pathname;
    expect(new URL(appendSourceRef(href, at("/"))).pathname).toBe(before);
  });

  it("is idempotent, so a double-fire cannot append twice", () => {
    const once = appendSourceRef(waLink("Hi Goldstay"), at("/tenant-finding"));
    const twice = appendSourceRef(once, at("/tenant-finding"));
    expect(twice).toBe(once);
    const text = new URL(twice).searchParams.get("text") ?? "";
    expect(text.match(/Sent from/g)).toHaveLength(1);
  });

  it("handles the root path without a trailing slash artefact", () => {
    const text = new URL(
      appendSourceRef(waLink("Hi"), at("/")),
    ).searchParams.get("text");
    expect(text).toContain("(Sent from goldstay.co.ke/)");
  });

  it("strips a trailing slash from a real path", () => {
    const text = new URL(
      appendSourceRef(waLink("Hi"), at("/about/")),
    ).searchParams.get("text");
    expect(text).toContain("(Sent from goldstay.co.ke/about)");
  });

  it("works on a link with no prefilled text at all", () => {
    const text = new URL(
      appendSourceRef("https://wa.me/254702471993", at("/refer")),
    ).searchParams.get("text");
    expect(text).toBe("(Sent from goldstay.co.ke/refer)");
  });

  it("carries the Accra host through when that domain goes live", () => {
    const text = new URL(
      appendSourceRef(waLink("Hi"), at("/accra", "goldstay.com.gh")),
    ).searchParams.get("text");
    expect(text).toContain("(Sent from goldstay.com.gh/accra)");
  });

  it("passes non-WhatsApp and unparseable hrefs straight through", () => {
    // This runs on the only route a lead has to reach us. Every failure
    // has to end in the click still opening WhatsApp.
    for (const href of ["/list-your-property", "tel:+254702471993", "wa.me/254", "::::"]) {
      expect(appendSourceRef(href, at("/")), href).toBe(href);
    }
  });

  it("preserves the message when it already contains an emoji or newline", () => {
    const href = waLink("Hi Goldstay\nI have two units");
    const text = new URL(appendSourceRef(href, at("/"))).searchParams.get("text");
    expect(text).toContain("Hi Goldstay\nI have two units");
  });
});

describe("surfaceLabel", () => {
  it("prefers an explicit annotation", () => {
    expect(surfaceLabel({ explicit: "hero", sectionId: "services" })).toBe("hero");
  });

  it("falls back to the enclosing section, so unannotated CTAs still report", () => {
    expect(surfaceLabel({ sectionId: "testimonials" })).toBe("section:testimonials");
  });

  it("reports unknown rather than throwing when there is nothing to go on", () => {
    expect(surfaceLabel({})).toBe("unknown");
    expect(surfaceLabel({ explicit: "  ", sectionId: null })).toBe("unknown");
  });
});
