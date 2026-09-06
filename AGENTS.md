# Working in this repo

Guidance for anyone — human or agent — making changes to the Goldstay platform.

Kept at the repo root rather than in `.cursor/rules/` so it is version
controlled and applies on every machine.

## Release process

**Every change bumps the version and adds a changelog entry.** Do both as part
of the change, not as a follow-up.

### The three places that must agree

| Place | What |
| --- | --- |
| `src/lib/version.ts` | `APP_VERSION` — the canonical value |
| `package.json` | `version` |
| `CHANGELOG.md` | newest `## [x.y.z] - YYYY-MM-DD` heading |

`src/lib/version.test.ts` asserts all three match, that the newest entry has
content, and that releases are ordered newest-first with valid dates. Bumping
one without the others fails the test suite.

### Which part to bump

- **MAJOR** — breaks a contract something outside this repo depends on: a
  migration that is not backwards compatible, a removed route, a changed
  agreement template.
- **MINOR** — a new capability, backwards compatible.
- **PATCH** — a fix or internal change that adds no capability.

### Steps

```bash
# 1. Set APP_VERSION in src/lib/version.ts
# 2. Match it in package.json
# 3. Add a dated section at the top of CHANGELOG.md, below [Unreleased]
# 4. Update the compare links at the bottom of CHANGELOG.md
npx vitest run src/lib/version.test.ts

git commit -m "..."
git tag -a v1.1.0 -m "v1.1.0 — short summary"
git push && git push origin v1.1.0
gh release create v1.1.0 --title "v1.1.0 — short summary" --notes-from-tag
```

The version shows in the admin header on every screen and in full — with the
deployed commit and environment — on `/admin/health`.

### Writing the entry

Group under `### Added`, `### Changed`, `### Fixed` or `### Removed`. Describe
what changed for the person using the platform, and why when it is not obvious.

```markdown
## [1.1.0] - 2026-09-07

### Fixed
- The clients CSV export dropped the `?period=` filter, so exporting from a
  month-filtered view returned every client rather than that month's.
```

Never write "updated files", "refactored code" or "various fixes". An entry
nobody can act on is worse than no entry, because it implies the change was
recorded when it was not.

## Before you push

```bash
npx tsc --noEmit          # types
npx next lint             # lint — the production build runs this too
npx vitest run            # full suite
npx next build            # catches what the others miss
```

A lint error in a page fails the production build, which means the page 404s in
production while the deploy that broke it reports as merely "failed". Run the
build before pushing anything that touches a route or a component.

## Database migrations

Migrations are applied by hand, not by the build:

```bash
npm run db:status         # what is pending
npm run db:deploy:local   # apply, using .env.local
```

`DATABASE_URL` in `.env.local` points at the live database. Apply the migration
**before** pushing code that reads the new schema, or the deployed build runs
against a table that does not exist yet.

## Scheduled jobs

Vercel cron on this project's plan only accepts daily-or-longer schedules.
Anything more frequent goes in `.github/workflows/` and calls the route with
`Authorization: Bearer $CRON_SECRET`; an hourly entry in `vercel.json` fails
the deployment outright. Scheduled workflows also need `CRON_SECRET` set as a
GitHub Actions repo secret, and GitHub disables them after 60 days of repo
inactivity — check `gh workflow list --all` if a job goes quiet.
