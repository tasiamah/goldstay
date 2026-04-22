import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Maps Kenya/Ghana apex and www hostnames to the city root they should
// render when a visitor lands on "/". Deep paths keep flowing through
// normal routing on all domains so shared pages (/list-your-property,
// /airbnb-management, /yield-calculator, /privacy, /terms) stay shared.
const HOST_TO_CITY: Record<string, string> = {
  "goldstay.co.ke": "/nairobi",
  "www.goldstay.co.ke": "/nairobi",
  "goldstay.com.gh": "/accra",
  "www.goldstay.com.gh": "/accra",
};

export function middleware(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const cityRoot = HOST_TO_CITY[host];
  if (!cityRoot) return NextResponse.next();

  if (req.nextUrl.pathname !== "/") return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = cityRoot;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    // Skip Next.js internals, API, file-based metadata and static
    // images. Middleware only needs to see page requests.
    "/((?!_next/|api/|icon\\.svg|apple-icon|favicon\\.ico|robots\\.txt|sitemap\\.xml|images/).*)",
  ],
};
