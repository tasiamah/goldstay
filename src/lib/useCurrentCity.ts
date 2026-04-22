"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export type City = "nairobi" | "accra";

// Resolves the current city from either the URL path (/nairobi, /accra and
// their sub-routes) or the hostname (goldstay.co.ke -> Nairobi, goldstay.com.gh
// -> Accra). The hostname check exists because middleware rewrites "/" to the
// city root without changing the URL the client sees, so on goldstay.co.ke the
// pathname alone will report "/" even though Nairobi content is served.
export function useCurrentCity(): City | null {
  const pathname = usePathname() ?? "";

  const [hostCity, setHostCity] = useState<City | null>(null);
  useEffect(() => {
    const host = window.location.hostname.toLowerCase();
    if (host === "goldstay.co.ke" || host === "www.goldstay.co.ke") {
      setHostCity("nairobi");
    } else if (host === "goldstay.com.gh" || host === "www.goldstay.com.gh") {
      setHostCity("accra");
    } else {
      setHostCity(null);
    }
  }, []);

  if (pathname === "/nairobi" || pathname.startsWith("/nairobi/")) {
    return "nairobi";
  }
  if (pathname === "/accra" || pathname.startsWith("/accra/")) {
    return "accra";
  }

  return hostCity;
}
