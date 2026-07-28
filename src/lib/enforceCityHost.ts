import { headers } from "next/headers";
import { permanentRedirect } from "next/navigation";
import { site } from "@/lib/site";

// Cross-domain city gating. Mirrors the pattern already used by
// /insights/[slug]: a Nairobi page hit on goldstay.com.gh 308-redirects
// to goldstay.co.ke, and an Accra page hit on goldstay.co.ke
// 308-redirects to goldstay.com.gh. This keeps each city's SEO
// footprint on its own TLD, prevents Google from indexing the same
// city page under two country domains, and stops the "we operate in
// Ghana too" story from appearing on a Kenya domain where we can't
// back it up in-country.
//
// Passes through on:
//   - localhost and Vercel preview hosts (so dev + PR previews work)
//   - the neutral goldstay.com global marketing surface, which is
//     supposed to show both cities
//   - the city's own canonical host
//
// Redirects on:
//   - any other host (in practice, the other country's domain)
//
// Path is passed in explicitly because the caller already knows the
// route (e.g. "/accra/buy" or "/accra/east-legon") and Next's server
// components can't easily reconstruct the full request URL from
// headers alone in every runtime.
export function enforceCityHost(
  city: "nairobi" | "accra",
  path: string,
): void {
  const host = (headers().get("host") ?? "").toLowerCase();

  // Dev + preview escape hatch. We deliberately do not gate localhost
  // or *.vercel.app so PR previews can still exercise both city
  // surfaces from a single hostname.
  if (
    host === "" ||
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.endsWith(".vercel.app")
  ) {
    return;
  }

  // Neutral global surface serves both cities. This is what makes the
  // goldstay.com homepage able to pitch "Nairobi and Accra" without
  // triggering a redirect loop when either city link is clicked.
  if (host === site.domains.main || host === `www.${site.domains.main}`) {
    return;
  }

  const correctHost =
    city === "nairobi" ? site.domains.nairobi : site.domains.accra;

  if (host === correctHost || host === `www.${correctHost}`) {
    return;
  }

  // Any other host is the wrong country. Redirect permanently so
  // Google sees a single canonical URL per city page.
  permanentRedirect(`https://${correctHost}${path}`);
}
