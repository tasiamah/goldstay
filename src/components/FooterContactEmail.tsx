"use client";

import { emailFor } from "@/lib/site";
import { useCurrentCity } from "@/lib/useCurrentCity";

// Client-side only so the email shown matches the city the visitor is on.
// Falls back to the default goldstay.com address on shared pages (homepage,
// legal, forms) and on server-rendered first paint. When usePathname or the
// hostname resolves a city, the link flips to hello@goldstay.co.ke on Nairobi
// surfaces and hello@goldstay.com.gh on Accra surfaces.
export function FooterContactEmail() {
  const city = useCurrentCity();
  const email = emailFor(city);

  return (
    <a href={`mailto:${email}`} className="link-underline">
      {email}
    </a>
  );
}
