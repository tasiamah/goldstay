import { headers } from "next/headers";
import { site, soleLiveDomain } from "@/lib/site";

export type City = "nairobi" | "accra";

// Which market this request is for.
//
// Server-side equivalent of useCurrentCity. Lets server components and
// generateMetadata render Kenya-only content on goldstay.co.ke and
// Ghana-only content on goldstay.com.gh without handing the decision to
// the client. Pathname-based detection is left to the caller (e.g. when
// /accra is opened directly from goldstay.com), because the host-only
// check is the conservative default: goldstay.com renders the neutral
// dual-city experience.
//
// Resolved at build time whenever only one domain is live, because then
// the host cannot change the answer. That matters more than it sounds:
// this is called from the marketing layout's generateMetadata, so
// reading `headers()` here made every marketing route dynamic and left
// all 394 URLs uncacheable at the edge. See soleLiveDomain.
export function getServerCity(): City | null {
  const sole = soleLiveDomain();
  const host = sole ?? (headers().get("host") ?? "").toLowerCase();

  if (host === site.domains.nairobi || host === `www.${site.domains.nairobi}`) {
    return "nairobi";
  }
  if (host === site.domains.accra || host === `www.${site.domains.accra}`) {
    return "accra";
  }
  return null;
}
