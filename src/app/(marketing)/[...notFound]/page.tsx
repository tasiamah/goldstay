import { notFound } from "next/navigation";

// Exists only so that an unmatched URL gets the branded 404 in
// ../not-found.tsx, with the navbar and footer around it.
//
// Why it is needed. There is no src/app/layout.tsx: (marketing) and
// (platform) each carry their own root layout, which Next allows. The
// consequence is that a URL matching no route at all has no root
// layout to render in, so a top-level app/not-found.tsx cannot work
// and Next falls through to its own unstyled "404: This page could
// not be found." Both existing not-found.tsx files only fire for
// notFound() raised inside their own group, which an unmatched URL
// never reaches.
//
// This catch-all pulls those URLs into the marketing group so the
// group's not-found boundary handles them. Next resolves static and
// more specific dynamic segments ahead of a catch-all, so /pricing,
// /insights/[slug], /nairobi/[neighbourhood] and the routes outside
// this group (/agreements, /statements, /auth, /embed, /api) are all
// matched before this is reached. Asserted in not-found.test.ts.
//
// notFound() throws, so this component never renders anything and the
// response keeps its 404 status. That status is what keeps these URLs
// out of the index; there is no soft-404 risk from serving real
// markup with it.
export default function NotFoundCatchAll(): never {
  notFound();
}
