# Changelog

All notable changes to the Goldstay platform are recorded here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and the versions follow [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Each release is tagged on GitHub as `v<version>`.

Every change bumps the version and adds an entry here. `src/lib/version.ts`
holds the canonical version, and `src/lib/version.test.ts` asserts that it,
`package.json` and the newest heading below all agree — so a bump without an
entry, or an entry without a bump, fails the test suite.

Which part to bump:

- **MAJOR** — a breaking change to something outside this repo depends on: a
  migration that is not backwards compatible, a removed route, a changed
  agreement template.
- **MINOR** — a new capability, backwards compatible.
- **PATCH** — a fix or internal change that adds no capability.

## [Unreleased]

## [1.2.0] - 2026-09-06

### Added

- The 21 "for landlords in <country>" pages are now reachable from the site.
  The `/from` hub and the 20 origin pages behind it had no inbound link from
  anywhere — the crawler only ever found them in the sitemap, which gets a URL
  indexed but sends it none of the site's standing. The footer now links the
  hub, and each origin page links back up to it.
- Breadcrumb markup on the `/from` hub and all 20 origin pages, so Google can
  place them in the site's hierarchy rather than treating each as a loose page.
- The two long-let service pages now have inbound links from the articles
  about them: 21 pointing at long-term management and 8 at tenant finding,
  each one a sentence at the end of the article's "How Goldstay handles it"
  section with anchor text that varies between articles. Between them they
  previously had three inbound links, all from the nav and footer, and none at
  all from the 350 articles — so a hundred-odd pieces on arrears, vetting,
  vacancy and deposits passed their standing among themselves and none of it
  to the pages a landlord actually enquires from. The Airbnb service page has
  had this since it was built and has 49.
- Each origin page now links to long-term management and tenant finding.
  They described a landlord's problem in detail and then offered only the
  yield calculator.

### Fixed

- Neighbourhood breadcrumbs pointed at `/nairobi`, which has redirected to the
  domain root since 1.0.3, so the city step of every neighbourhood page's
  breadcrumb went through a hop before it resolved.

## [1.1.0] - 2026-09-06

### Added

- Articles now unfurl with their own picture. All 350 posts set a hero image
  and rendered it on the page, but none of them passed it to `openGraph`, so
  every link shared on WhatsApp, LinkedIn or X showed the same generic site
  card. Each post now shares its own hero, with the hero's alt text as the
  image description.
- The company is now one entity in structured data instead of an anonymous
  new one on every page. Previously each page re-declared
  `Organization { name: "Goldstay" }` inline, which reads to Google as an
  unrelated publisher per URL; the organization and the site now have stable
  identifiers that the service pages, the articles and the city listings all
  reference.
- Knowledge-panel basics that were missing from the organization and the
  Nairobi listing: the brand logo, a branded image, and the phone number we
  actually answer.
- Article schema now carries a publisher logo. Google documents this as
  required for article rich results, so without it none of the 350 posts was
  eligible for one. Posts also declare their category.
- The insights search is declared as a site search action, which is what makes
  a search box in the Google result possible at all.
- The 17 neighbourhood pages emit FAQ markup. They rendered the FAQ accordion
  already, so the answers were on the page but invisible to anything reading
  the markup. The accordion and the markup now read from one list, so they
  cannot drift apart.

### Fixed

- Category pages put the brand in the title twice —
  "Buying insights for diaspora landlords | Goldstay | Goldstay" — because the
  page spelled out a suffix the site-wide template already appends. That also
  pushed the title past the length Google will display.
- The largest image on the homepage and both city pages had empty alt text,
  which tells a screen reader and a crawler that the main image carries no
  meaning. All three now describe what is actually in the photo.

## [1.0.3] - 2026-09-06

### Fixed

- The homepage told Google not to index the homepage. On `goldstay.co.ke` the
  root serves the Nairobi city page through an edge rewrite, but it carried
  that page's metadata, so `https://goldstay.co.ke/` published a canonical
  pointing at `/nairobi` — while the sitemap submitted both URLs, the root at
  priority 1. The root is now self-canonical, `/nairobi` 301s to it on the
  Kenya domain, and only one of the two is in the sitemap. Same treatment for
  `/accra` on the Ghana domain when it goes live.
- 53 links in the insights catalogue pointed at 34 article slugs that were
  never written, so a reader following them from a published article got a
  404 and a crawler got a dead end. Each is repointed at the closest article
  that exists, or at the relevant category hub where nothing close existed.
- No marketing page could be cached. Reading the request host to pick a
  market opted the entire marketing tree out of static generation, so all 394
  URLs returned `no-store` and every crawl and every visitor paid a full
  origin render. With one domain live the host cannot change the answer, so it
  is now resolved at build time: 417 routes prerender, including the homepage,
  every service and neighbourhood page and all 350 articles. The per-request
  path returns automatically if a second domain goes live.
- `scripts/check-insights.mjs` had been failing for months with nothing
  running it. It now runs as part of `npx vitest run`, so a broken article
  link fails the suite and names the file.

## [1.0.2] - 2026-09-06

### Fixed

- Agreement references were derived from the number of agreements issued this
  year rather than the highest reference already used. Deleting a single
  agreement pointed the sequence back at a number the unique index was still
  holding, which would have made every subsequent issue fail — and keep
  failing, since nothing retries past a duplicate reference. The next
  reference is now one past the highest in use, so a gap is just a gap.

### Removed

- Two test client records — three properties, one sent-but-unsigned
  agreement, both portal logins and one uploaded document — hard-deleted from
  production, with a JSON snapshot taken first and the deletion recorded in
  the audit log. One of them was a duplicate of a real property, which had put
  two live agreements on the same unit.

## [1.0.1] - 2026-09-06

### Fixed

- The version number in the admin header was hidden below the `sm`
  breakpoint, so it did not show on phones — which is where ops triage from,
  and where someone is least able to go hunting for a build number. It now
  shows at every width, with tighter padding on small screens.

## [1.0.0] - 2026-09-06

First versioned release. The platform was already in production serving real
clients in Kenya before this point; changes up to here were tracked in git
history but not versioned, so this entry describes the baseline as it stands
today rather than reconstructing that history.

### Admin portal

- Client, property, lease, booking, transaction, lead and task management,
  each with list filtering, sorting and pagination driven by URL parameters.
- Role-based access (`SUPER_ADMIN`, `OPS`, `COUNTRY_MANAGER`, `SUPPORT`) with a
  permission matrix gating both routes and navigation.
- Attention queue on the overview surfacing what needs action, KPI strip with
  deep links into the filtered lists behind each number.
- Per-entity activity timelines merging audit events, notes and communications.
- Client agreement state on the clients list, with an at-a-glance signed,
  awaiting or not-issued indicator and a filter for chasing signatures.
- System health page covering background jobs, integrations and feeds.
- CSV import and export for clients, archive and restore, admin impersonation
  of a client portal session, and a command palette.

### Client portal

- Dashboard with derived notifications, property and transaction views,
  statements, payout methods and profile management.
- Management agreements reviewed and accepted in one click, capturing a
  signature record (typed name, IP, user agent, timestamp) and materialising an
  executed PDF against the property.
- Magic-link sign-in, so an emailed link lands on the intended page already
  authenticated.

### Automation

- Unsigned management agreements chased on a finite ladder at 24h, 3 days,
  7 days and 14 days, then escalated to a phone-call task and an ops email at
  21 days. Respects the client's local quiet hours and is at-most-once per rung.
- Monthly statement generation and delivery, idempotent per client and period.
- iCal calendar sync for short-let bookings, vacancy auto-pitch, and an
  acquisition scan.
- Referral programme with its own pipeline and payouts.

### Marketing site

- Service pages for Airbnb management, long-term management, tenant finding and
  property sourcing, plus city and neighbourhood landing pages for Nairobi and
  Accra and programmatic service-by-neighbourhood pages.
- Insights library of long-form articles, a yield calculator, and lead capture
  for landlords and tenants.
- Canonical URLs and hreflang consolidated onto `goldstay.co.ke`, with a
  sitemap of 394 URLs.

### Platform

- Next.js App Router on Vercel, Postgres via Prisma on Supabase, Resend for
  transactional email, Sentry for error reporting.
- Audit log recording every mutating action, and a communication log recording
  every message sent to a client.

[Unreleased]: https://github.com/tasiamah/goldstay/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/tasiamah/goldstay/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/tasiamah/goldstay/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/tasiamah/goldstay/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/tasiamah/goldstay/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/tasiamah/goldstay/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/tasiamah/goldstay/releases/tag/v1.0.0
