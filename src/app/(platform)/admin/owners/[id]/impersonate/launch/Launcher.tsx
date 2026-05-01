"use client";

import { useEffect } from "react";

// Auto-opens the magic link in a new tab on mount. We also render a
// fallback button so popup-blocker users have a clean recovery path
// instead of bouncing back to the admin with no feedback.

export function ImpersonationLauncher({ token }: { token: string }) {
  useEffect(() => {
    const w = window.open(token, "_blank", "noopener,noreferrer");
    if (!w) {
      console.warn(
        "[impersonation] popup blocked; user must click fallback button",
      );
    }
  }, [token]);

  return (
    <a
      href={token}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center justify-center rounded-md bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800"
    >
      Open owner portal
    </a>
  );
}
