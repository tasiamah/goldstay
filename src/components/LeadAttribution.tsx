"use client";

import { useEffect } from "react";
import {
  captureFirstTouch,
  FIRST_TOUCH_KEY,
  parseFirstTouch,
  type FirstTouch,
} from "@/lib/lead-attribution";

// Records how a visitor arrived, once per session, so the lead form can
// send it along with the enquiry.
//
// Mounted in the marketing layout next to WhatsAppTracking, for the
// same reason that one is: the capture has to happen on whatever page
// the visitor lands on, and there are several hundred of them. A
// component in the layout reaches all of them without touching any.
//
// sessionStorage rather than a cookie. Nothing here needs to reach the
// server on its own — the form posts it explicitly — so a cookie would
// add a consent surface and a header on every request to buy nothing.
// Session scope is also the right lifetime: it expires when the visit
// does, which is the window over which "how did you get here" means
// anything.
//
// Runs in an effect and not during render because it touches storage,
// and it writes only when there is nothing there already, which is
// what makes the attribution first-touch. See lead-attribution.ts for
// why last-touch would give back the useless answer we started with.
export function LeadAttribution() {
  useEffect(() => {
    try {
      const existing = window.sessionStorage.getItem(FIRST_TOUCH_KEY);
      const touch = captureFirstTouch(
        {
          host: window.location.host,
          pathname: window.location.pathname,
          search: window.location.search,
        },
        document.referrer || null,
        existing,
      );
      if (touch) {
        window.sessionStorage.setItem(FIRST_TOUCH_KEY, JSON.stringify(touch));
      }
    } catch {
      // Safari in private mode throws on sessionStorage, and some
      // in-app browsers disable it outright. Attribution is a nice to
      // have; the enquiry is not. Swallow and carry on.
    }
  }, []);

  return null;
}

// Read back at submit time by the form. Returns null when storage is
// unavailable or empty, and the form posts without the block — an
// unattributed lead is still a lead.
export function readFirstTouch(): FirstTouch | null {
  try {
    return parseFirstTouch(window.sessionStorage.getItem(FIRST_TOUCH_KEY));
  } catch {
    return null;
  }
}
