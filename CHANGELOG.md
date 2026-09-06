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

[Unreleased]: https://github.com/tasiamah/goldstay/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/tasiamah/goldstay/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/tasiamah/goldstay/releases/tag/v1.0.0
