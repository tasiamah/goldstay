import { headers } from "next/headers";

export type City = "nairobi" | "accra";

// Server-side equivalent of useCurrentCity. Reads the incoming request's host
// header so server components and generateMetadata can render Kenya-only
// content on goldstay.co.ke and Ghana-only content on goldstay.com.gh, without
// having to hand the decision off to the client. Pathname-based detection is
// handled by the caller when needed (e.g. when /accra is opened directly from
// goldstay.com), because the host-only check is the conservative default:
// goldstay.com renders the neutral dual-city experience.
export function getServerCity(): City | null {
  const host = (headers().get("host") ?? "").toLowerCase();
  if (host === "goldstay.co.ke" || host === "www.goldstay.co.ke") {
    return "nairobi";
  }
  if (host === "goldstay.com.gh" || host === "www.goldstay.com.gh") {
    return "accra";
  }
  return null;
}
