"use client";

// Makes a <details>-based popover behave the way people expect a
// popover to behave.
//
// The notifications bell and the client portal's mobile menu are
// plain <details>/<summary>, which opens and closes with no client
// JavaScript at all. What <details> will not do is close itself, and
// the App Router keeps the layout mounted across navigations — so
// picking a notification left the panel hanging open over the page
// it had just taken you to. Clicking away and pressing Escape did
// nothing either, which is what made it read as a stuck modal.
//
// Progressive enhancement on purpose: with JS unavailable the panels
// behave exactly as they did before rather than not opening at all.
//
// Renders nothing. Mount it inside the <details> it should manage.

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function PopoverAutoClose() {
  const marker = useRef<HTMLSpanElement>(null);
  const pathname = usePathname();

  // Catches navigations we never see a click for. A no-op when the
  // panel is already closed, which is the common case.
  useEffect(() => {
    const details = marker.current?.closest("details");
    if (details?.open) details.open = false;
  }, [pathname]);

  useEffect(() => {
    const details = marker.current?.closest("details");
    if (!details) return;

    const close = () => {
      if (details.open) details.open = false;
    };

    // Clicking away. pointerdown rather than click so the panel gets
    // out of the way on the press, matching every other menu.
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (target instanceof Node && details.contains(target)) return;
      close();
    };

    // A link inside means the user has chosen something and is done
    // with the panel. Needed on top of the pathname effect above,
    // because choosing the page you are already on doesn't change
    // the pathname — precisely the case where a menu that stays open
    // looks broken.
    //
    // This one listens for click, not pointerdown: closing a
    // <details> stops rendering its contents, so tearing the link
    // out from under a press that hasn't completed can lose the
    // navigation entirely.
    //
    // Submit buttons are deliberately excluded. "Mark all read" and
    // the per-row dismiss both prune the list in place, and closing
    // after each one would turn clearing three notifications into
    // three trips.
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (!details.contains(target)) return;
      if (target.closest("a[href]")) close();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("click", onClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("click", onClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return <span ref={marker} hidden />;
}
