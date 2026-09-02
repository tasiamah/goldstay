"use client";

import { useEffect, useState } from "react";

// Ops-facing control for the /start intake link.
//
// The point of the link is that ops never types a landlord's details in
// again: paste it into the WhatsApp thread, the landlord fills it in,
// and the lead lands in this list already tiered. So the link has to be
// one tap away from the leads queue, not something anyone has to
// remember the spelling of.
//
// ?c=wa tags every lead that arrives through it as WHATSAPP, which is
// what makes the source filter on this page meaningful.
const INTAKE_PATH = "/start?c=wa";

export function CopyIntakeLink() {
  // Built from the admin's own origin rather than a hardcoded domain so
  // the copied link points at whichever host they're signed in to —
  // localhost in dev, the right country domain in production. Resolved
  // in an effect because there's no window during SSR.
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => setOrigin(window.location.origin), []);

  const url = origin ? `${origin}${INTAKE_PATH}` : INTAKE_PATH;

  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <h3 className="text-sm font-medium text-stone-900">
          Landlord intake link
        </h3>
        <span className="text-xs text-stone-500">
          Send this instead of taking details down by hand
        </span>
      </div>
      <p className="mt-1 text-xs text-stone-500">
        Paste it into a WhatsApp chat. Whatever the landlord fills in
        arrives here as a new lead, tagged WhatsApp and ready to convert.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-stretch">
        <input
          readOnly
          value={url}
          aria-label="Landlord intake link"
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 rounded-md border border-stone-300 bg-white px-3 py-2 font-mono text-xs text-stone-700"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(url);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              } catch {
                // Clipboard access can be blocked by permissions or a
                // non-secure origin; the readonly input above is still
                // selectable so the link is never unreachable.
              }
            }}
            className="rounded-md bg-stone-900 px-3 py-2 text-sm font-medium text-white hover:bg-stone-800"
          >
            {copied ? "Copied" : "Copy"}
          </button>
          {/* wa.me with no number opens WhatsApp's contact picker, so
              ops can choose the thread and send in two taps. */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `Hi, please fill in your property details here and we'll come back to you within two business hours: ${url}`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-stone-300 bg-white px-3 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
          >
            Send on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
