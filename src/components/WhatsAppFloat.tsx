"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/site";

export function WhatsAppFloat() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={waLink("Hi Goldstay, I'd like to discuss managing my property")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Goldstay on WhatsApp"
      className={`fixed bottom-5 right-5 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lift ring-1 ring-black/5 transition-all duration-500 ease-premium hover:scale-105 hover:bg-[#1ebe5b] md:inline-flex md:bottom-6 md:right-6 ${mounted ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full bg-[#25D366] opacity-50 motion-safe:animate-ping"
      />
      <svg
        viewBox="0 0 32 32"
        className="relative h-7 w-7"
        aria-hidden
        fill="currentColor"
      >
        <path d="M27.2 4.66A15.86 15.86 0 0 0 15.98.05C7.18.05.02 7.2.02 16c0 2.81.74 5.56 2.15 7.97L0 32l8.22-2.15a15.93 15.93 0 0 0 7.76 1.98h.01c8.8 0 15.96-7.16 15.96-15.96 0-4.27-1.66-8.28-4.75-11.21zM15.99 29.14h-.01a13.23 13.23 0 0 1-6.75-1.85l-.48-.28-4.88 1.28 1.3-4.76-.32-.5A13.18 13.18 0 0 1 2.76 16C2.76 8.71 8.7 2.77 16 2.77c3.55 0 6.89 1.38 9.4 3.9A13.16 13.16 0 0 1 29.24 16c0 7.29-5.94 13.14-13.25 13.14zm7.27-9.86c-.4-.2-2.35-1.16-2.71-1.29-.37-.13-.63-.2-.9.2-.26.4-1.02 1.29-1.25 1.55-.23.27-.46.3-.86.1-.4-.2-1.67-.62-3.18-1.97-1.18-1.05-1.97-2.35-2.2-2.75-.23-.4-.02-.61.18-.81.18-.18.4-.47.6-.7.2-.23.26-.4.4-.66.13-.27.07-.5-.03-.7-.1-.2-.9-2.17-1.23-2.97-.32-.78-.65-.67-.9-.68a15.8 15.8 0 0 0-.77-.01c-.27 0-.7.1-1.06.5-.37.4-1.4 1.37-1.4 3.35s1.43 3.88 1.63 4.15c.2.27 2.81 4.29 6.8 6.02.95.41 1.69.65 2.27.84.95.3 1.82.26 2.51.16.77-.12 2.35-.96 2.69-1.89.33-.93.33-1.72.23-1.89-.1-.17-.36-.27-.77-.47z" />
      </svg>
    </a>
  );
}
