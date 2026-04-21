"use client";

import { useEffect, useState } from "react";

const KEY = "gs-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (!saved) setVisible(true);
    } catch {
      /* ignore */
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(KEY, "accepted");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  const decline = () => {
    try {
      localStorage.setItem(KEY, "declined");
    } catch {
      /* ignore */
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 md:inset-auto md:bottom-5 md:left-5 md:right-auto md:max-w-md">
      <div className="rounded-2xl border border-charcoal/10 bg-cream p-5 shadow-lift">
        <p className="text-sm text-charcoal/80">
          We use a small number of cookies to understand how visitors use
          Goldstay and improve the site. No creepy tracking. Full details in our{" "}
          <a className="underline underline-offset-2" href="/privacy">
            privacy notice
          </a>
          .
        </p>
        <div className="mt-4 flex items-center gap-2">
          <button type="button" onClick={accept} className="btn-primary">
            Accept
          </button>
          <button type="button" onClick={decline} className="btn-secondary">
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
