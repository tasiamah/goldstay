"use client";

import { useEffect } from "react";
import {
  appendSourceRef,
  isWhatsAppHref,
  surfaceLabel,
} from "@/lib/whatsapp-tracking";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

// One listener for every WhatsApp CTA on the site.
//
// There are 27 files calling waLink() and a delegated listener reaches
// all of them without touching any, which matters less for the saved
// edits than for the ones after this: a new CTA is tracked because it
// is a wa.me link, not because somebody remembered to annotate it.
//
// Capture phase on purpose. A bubble-phase listener can be cut off by
// any handler in between calling stopPropagation, and a silently
// untracked CTA is the failure mode this whole component exists to fix.
//
// Two things happen per click, and only one of them is analytics:
//
//   - The GA event, which records that a CTA was clicked. Note this is
//     a click on a wa.me link, not a sent message: it opens WhatsApp's
//     compose screen and the send happens somewhere no browser can see.
//     Treat the number as an upper bound on enquiries.
//   - The prefilled message gets the page written into it, which is the
//     only signal that crosses into the conversation ops actually read.
//     That is the half that tells you what produced a real enquiry.
//
// Rewriting href inside the handler rather than at render time is what
// keeps this out of the server: deriving the path in waLink() would
// need headers(), which opts all 417 marketing routes out of the CDN.
export function WhatsAppTracking() {
  useEffect(() => {
    function onClick(event: MouseEvent) {
      // Middle-click arrives as auxclick with button 1; anything above
      // that is a back/forward button and not a navigation we care for.
      if (event.type === "auxclick" && event.button !== 1) return;

      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!isWhatsAppHref(href) || !href) return;

      const surface = surfaceLabel({
        explicit: anchor.getAttribute("data-wa-source"),
        sectionId: anchor.closest("section")?.getAttribute("id") ?? null,
      });

      // Write the page into the message before the browser follows the
      // link. Synchronous and in capture phase, so the navigation that
      // follows uses the updated href.
      //
      // If this throws for any reason the click must still work, so the
      // rewrite and the analytics are each isolated: a lead reaching
      // WhatsApp beats a lead we could attribute.
      try {
        const withRef = appendSourceRef(href, {
          host: window.location.host,
          pathname: window.location.pathname,
        });
        if (withRef !== href) anchor.setAttribute("href", withRef);
      } catch {
        // Leave the original href in place.
      }

      try {
        // generate_lead is one of GA4's recommended event names, so it
        // can be marked a key event and reported as a conversion rather
        // than sitting in the pile of generic `click` events that
        // enhanced measurement already collects for outbound links.
        window.gtag?.("event", "generate_lead", {
          method: "whatsapp",
          surface,
          page_path: window.location.pathname,
          link_url: href,
        });
        window.fbq?.("track", "Lead", { content_name: surface });
      } catch {
        // Analytics is never worth an interrupted click.
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    document.addEventListener("auxclick", onClick, { capture: true });
    return () => {
      document.removeEventListener("click", onClick, { capture: true });
      document.removeEventListener("auxclick", onClick, { capture: true });
    };
  }, []);

  return null;
}
