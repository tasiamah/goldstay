"use client";

import { useEffect, useState } from "react";
import { waLink } from "@/lib/site";

export function WhatsAppFloat() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <a
      href={waLink(
        "Hi Goldstay, I'd like to discuss managing my property",
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Goldstay on WhatsApp"
      className={`fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#25D366] pl-4 pr-5 py-3 text-sm font-medium text-white shadow-lift transition-all duration-500 ease-premium hover:bg-[#1ebe5b] md:hidden ${visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0 pointer-events-none"}`}
    >
      <svg
        viewBox="0 0 32 32"
        className="h-5 w-5"
        aria-hidden
        fill="currentColor"
      >
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.06 2.995.244.415.47.713.694.983 1.403 1.678 3.53 3.136 5.645 3.922.9.33 2.354.817 3.317.817.542 0 1.058-.13 1.376-.47.37-.374.68-.775.68-1.26 0-.184-.037-.352-.087-.512-.157-.487-1.944-1.344-2.378-1.344zM16.19 27.1c-5.88 0-10.66-4.78-10.66-10.67 0-2.16.644-4.25 1.845-6.05l-.07.055L6 15.825l4.6-1.13a10.667 10.667 0 0 0 5.6 1.57c5.88 0 10.66-4.8 10.66-10.66 0-5.89-4.78-10.66-10.67-10.66zM16.2 29c-1.87 0-3.68-.47-5.29-1.36L4.34 29.33l1.77-6.48C4.96 21 4.34 18.93 4.34 16.82c0-6.57 5.33-11.9 11.9-11.9 3.18 0 6.17 1.24 8.42 3.48a11.8 11.8 0 0 1 3.48 8.43c-.02 6.55-5.35 11.88-11.94 11.88z" />
      </svg>
      WhatsApp
    </a>
  );
}
