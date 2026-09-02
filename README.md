# Goldstay

Premium property management in Nairobi & Accra: marketing site for diaspora landlords.

Brand: Goldstay · A TADCO Company.

## Stack

- **Next.js 14** (App Router) · TypeScript · React 18
- **Tailwind CSS** with a bespoke brand palette (champagne gold, cream, charcoal, forest)
- **Framer Motion** for subtle reveal animations
- **React Hook Form** for the landlord intake form
- **Resend** for transactional email (contact form delivery)
- **lucide-react** icon set
- Google Fonts: **Playfair Display** (headings), **Inter** (body), **DM Mono** (accents/eyebrows)

## Pages

| Route | Purpose |
| --- | --- |
| `/` | One-page scroll homepage (Hero, Problem, Services, Why, Locations, How It Works, FAQ, CTA) |
| `/nairobi` | Localised Nairobi landing page. Also the redirect target for `goldstay.co.ke`. |
| `/accra` | Localised Accra landing page. Also the redirect target for `goldstay.com.gh`. |
| `/airbnb-management` | Detailed Airbnb / short-stay service page with illustrative economics. |
| `/list-your-property` | Landlord intake form (posts to `/api/lead`). |
| `/privacy`, `/terms` | Legal placeholders. |
| `/api/lead` | Server route: delivers form submissions via Resend; logs to console if no API key. |
| `/yield-calculator` | Diaspora landlord yield calculator. Posts to `/api/yield-report` for branded PDF + Airtable capture. |
| `/from` | Hub for the diaspora-origin landing pages. |
| `/from/[origin]/[city]` | Programmatic SEO pages: 10 origins × 2 cities = 20 unique landing pages targeting "Nairobi/Accra property management for landlords in [origin]". |
| `/embed/landlord-intake` | Stripped embeddable form (no nav/footer). Loaded into partner sites via `/embed/landlord-intake.js`. |
| `/api/yield-report` | Server route: renders branded yield PDF and mirrors the lead to Airtable. |
| `/api/cron/acquisition-scan` | Cron-only: runs the Airbnb + BuyRentKenya scrapers, classifies, upserts targets. Auth via `CRON_SECRET`. |
| `/api/cron/vacancy-pitch` | Cron-only: pitches landlords whose tenants have given notice (rows in Airtable Vacancy Leads). Auth via `CRON_SECRET`. |
| `/sitemap.xml`, `/robots.txt` | Auto-generated. |

## Environment variables

Copy `.env.example` to `.env.local` and fill in as needed:

```
NEXT_PUBLIC_WHATSAPP_NUMBER=            # fallback/primary WhatsApp number in international format, no +
NEXT_PUBLIC_WHATSAPP_NUMBER_NAIROBI=    # Nairobi-specific number (optional)
NEXT_PUBLIC_WHATSAPP_NUMBER_ACCRA=      # Accra-specific number (optional)
NEXT_PUBLIC_CONTACT_EMAIL=hello@goldstay.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=          # e.g. G-XXXXXXX: omit to disable
NEXT_PUBLIC_META_PIXEL_ID=              # Meta Pixel ID: omit to disable
RESEND_API_KEY=                         # from resend.com: omit to log to console instead
CONTACT_INBOX=hello@goldstay.com        # where form submissions get sent
TENANT_OPS_INBOX=ops@goldstay.com       # where tenant applications get sent
AIRTABLE_API_KEY=                       # Airtable PAT, omit to disable CRM mirror
AIRTABLE_BASE_ID=                       # base id from airtable.com/api
AIRTABLE_LEADS_TABLE=Landlord leads     # table name, override if renamed
AIRTABLE_TENANTS_TABLE=Tenant Applications
AIRTABLE_VACANCY_TABLE=Vacancy Leads
AIRTABLE_ACQUISITION_TABLE=Acquisition Targets   # outbound scrape pipeline
AIRTABLE_YIELD_REPORTS_TABLE=Yield Reports        # /yield-calculator captures
ACQUISITION_AGENT_PHONE_BLOCKLIST=               # comma-separated international phones, hard agents
ACQUISITION_PROXY_URL=                           # optional outbound proxy for the scrapers (Bright Data etc)
CRON_SECRET=                                     # bearer token for /api/cron/* (must match GitHub Actions secret)
```

All analytics and the Meta Pixel only load when their IDs are set, so the site is clean by default.

## Running locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Build

```bash
npm run build
npm run start
```

`build` is just `next build` — it does not touch the database. You can
build and deploy with the database paused, unreachable, or not yet
migrated.

## Deployment

The site is designed for **Vercel**: zero config deploy. Set the
environment variables above in the Vercel project dashboard.

### Functions run in Frankfurt, on purpose

`vercel.json` pins `"regions": ["fra1"]`. **If the database moves,
move this with it.**

Supabase is in `eu-central-1`. Without the pin, Vercel defaults to
`iad1` (Washington DC), so every query became a transatlantic round
trip of roughly 90ms. That is not one slow page — it is a tax on every
authenticated request, because the session check, the layout and the
page each pay it in sequence.

Adding a property was the worst case at roughly 25–30 sequential round
trips: 5 for the create transaction, 10 for the property page it
redirects to (Prisma expands its six `include`s into 7 `SELECT`s), and
the rest on auth, the client lookup, the audit write and the layout.
Two to three seconds of pure waiting before any work happened.
Co-located, each hop is 1–5ms.

Note `vercel.json` is schema-validated and rejects unknown keys, so it
cannot carry comments — a `"//regions"` note next to the setting fails
the deploy outright. Explanations go here instead.

To check which region actually served a request, read the middle
segment of the `x-vercel-id` response header:

```bash
curl -sSD- -o /dev/null https://goldstay.co.ke/login | grep x-vercel-id
# x-vercel-id: cpt1::fra1::…
#              edge  function
```

### Migrations are a separate step

Schema changes are **not** applied by the build. `build` used to be
`prisma migrate deploy && next build`, which meant an unreachable
database took the whole site down with it: no migration, no build, no
deploy, even for a change that was pure marketing copy. Coupling the two
turned a database problem into a deployment problem.

So the contract is now explicit — when a deploy includes a new folder
under `prisma/migrations`, apply it yourself:

```bash
pnpm db:status        # what's applied vs pending
pnpm db:deploy:local  # apply pending migrations using .env.local
```

`db:deploy` is the same command without the `.env.local` wrapper, for
anywhere the environment is already injected (CI, `vercel env`, a
one-off shell).

**Order matters.** Every migration in this repo is written to be
additive — new columns are nullable or carry defaults — so the safe
sequence is migrate first, then deploy. Old code ignores new columns
quite happily; new code querying a column that doesn't exist yet throws.
Deploying code ahead of its migration is the one combination that
breaks, and it's the combination you get by forgetting this step.

If you'd rather not remember: add `DATABASE_URL` as a GitHub Actions
secret and run `pnpm db:deploy` in a workflow on push to `main`. That
keeps migrations automatic while still leaving a failed migration as a
red check rather than a dead site.

### Domain routing

- `goldstay.com`: primary.
- `goldstay.co.ke` → 301 redirect → `goldstay.com/nairobi` (set up in your Kenyan registrar).
- `goldstay.com.gh` → 301 redirect → `goldstay.com/accra` (set up in your Ghanaian registrar).

One codebase, multiple local-feeling domains. SEO authority stays on `goldstay.com`.

## Airtable CRM (optional)

Every landlord lead and tenant application is mirrored to an Airtable base so the ops team can manage pipelines without living in the inbox. Email remains the primary channel; if Airtable is unconfigured or unreachable, the form still succeeds and the email still sends.

### One-time base setup

You have two options. The script is the fast path and is idempotent, so you can also re-run it later if you ever need to extend the schema.

#### Option A: provision the schema via script (recommended)

1. Create an empty base in Airtable called **Goldstay CRM** (or any name, the script only needs the base id).
2. Grab the base id from the URL (`https://airtable.com/appXXXXXXXXXXXXXX/...`).
3. Create a **setup-only** PAT at [airtable.com/create/tokens](https://airtable.com/create/tokens) scoped to the Goldstay CRM base with `schema.bases:read` and `schema.bases:write`. This is separate from the runtime token and should be revoked once the schema is provisioned.
4. Run the provisioner:

   ```bash
   AIRTABLE_API_KEY=pat... AIRTABLE_BASE_ID=app... npm run airtable:setup
   ```

   It creates `Leads`, `Tenant Applications` and `Vacancy Leads` with the exact fields and single-select options the API routes expect. Idempotent: re-running it adds any new fields without touching existing data.

5. Revoke the setup PAT. For runtime, create a new PAT with only `data.records:write` and drop it into `AIRTABLE_API_KEY` in Vercel.

#### Option B: create the three tables manually

Create the three tables described below. Field names are case-sensitive and must match exactly, otherwise Airtable drops the values silently at write time.

**Table: `Landlord leads`** (landlord enquiries from `/list-your-property`)

| Field | Type |
| --- | --- |
| Name | Single line text (primary) |
| Email | Email |
| Phone | Phone number |
| Country | Single line text |
| City | Single select (Nairobi, Accra, Other) |
| Neighbourhood | Single line text |
| Property type | Single line text |
| Bedrooms | Single line text |
| Furnished | Single select (Furnished, Unfurnished, Part-furnished) |
| Service | Single select (Long-term, Short-stay / Airbnb, Help me buy a property, Tenant finding only, Not sure) |
| Availability | Single line text |
| Notes | Long text |
| Submitted | Date with time |
| Source | Single line text |
| Status | Single select (New, Contacted, Onboarded, Lost): default New |

**Table: `Tenant Applications`** (from `/apply`)

| Field | Type |
| --- | --- |
| Full name | Single line text (primary) |
| Email | Email |
| Phone | Phone number |
| WhatsApp | Phone number |
| City | Single line text |
| Applying for | Single line text |
| Referred by | Single line text |
| Grade | Single select (A, B, C, D) |
| Score | Number (integer) |
| Income/rent ratio | Number (2 decimals) |
| Monthly income USD | Currency (USD) |
| Target rent USD | Currency (USD) |
| Employment type | Single select (salaried, self-employed, contract, business-client, unemployed, student, other) |
| Employer | Single line text |
| Months in role | Number (integer) |
| Has previous landlord | Checkbox |
| Previous landlord name | Single line text |
| Previous landlord phone | Phone number |
| Evicted before | Checkbox |
| Scoring rationale | Long text |
| Token | Single line text |
| Submitted | Date with time |
| Status | Single select (New, Verified, Placed, Rejected): default New |

**Table: `Vacancy Leads`** (landlords to pitch, auto-created from tenant applications)

| Field | Type |
| --- | --- |
| Landlord name | Single line text (primary) |
| Phone | Phone number |
| Property | Long text |
| Tenant leaving | Single line text |
| Leaving around | Single line text |
| Referred via | Single line text |
| Submitted | Date with time |
| Status | Single select (New, Contacted, Pitched, Signed, Not interested): default New |

### Credentials

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens), create a Personal Access Token scoped to the Goldstay CRM base with the `data.records:write` scope (and `data.records:read` if you want ops tools to read back later).
2. Grab the base id from [airtable.com/api](https://airtable.com/api) (opens the base's REST docs). The id starts with `app...`.
3. Set `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` in Vercel → Project → Settings → Environment Variables, for Production and Preview.
4. Redeploy (or push any commit) so the new env vars are picked up.

### How writes happen

- Writes run in parallel with the Resend email via `Promise.allSettled`, so total latency is max(email, airtable) not sum.
- Failures are logged and swallowed: a broken CRM never breaks the public form.
- `typecast: true` is enabled, so adding new single-select options (for example a new status) can be done from Airtable without a code change.

## Outbound acquisition pipeline

A nightly GitHub Actions cron (`.github/workflows/acquisition-scan.yml`) hits `/api/cron/acquisition-scan` on the production deployment, which runs the Airbnb + BuyRentKenya scrapers, scores each result with the client-vs-agent classifier in `src/lib/acquisition/classify.ts`, and upserts surviving rows into the Airtable **Acquisition Targets** table.

- **Client vs agent**: Most BuyRentKenya / Property24 listings are agency-posted. The classifier is what turns the firehose into a useful pipe — it weights phone-frequency, lister-name shape, client-direct phrasing in the description, and a manually-curated phone blocklist (`ACQUISITION_AGENT_PHONE_BLOCKLIST`). Likely-agent rows are filtered out before they reach Airtable; ops only sees what's worth calling.
- **Pain score**: Stale listings (45+ days), repeat re-listings and mid-market asking prices score higher. Sort the table by Pain score descending for the warmest outbound.
- **Blocking**: Some sources will eventually 403 a Vercel-IP request. When that happens, set `ACQUISITION_PROXY_URL` to a residential proxy (Bright Data, ScraperAPI, etc.) and the existing `fetchHtml` helper will start routing through it.
- **Manual run**: trigger the GitHub Actions workflow with the *Run workflow* button, or POST `Authorization: Bearer $CRON_SECRET` to `/api/cron/acquisition-scan` from your terminal.

Vacancy auto-pitch (`/api/cron/vacancy-pitch`) runs daily on the same Bearer-token pattern. It reads "New" rows out of the Airtable Vacancy Leads table — auto-created when a tenant application names a previous landlord — sends a short pitch via Resend (or to the ops inbox with a WhatsApp deeplink when only a phone is on file), and patches the row to "Contacted" so the next run skips it.

## Yield calculator lead magnet

`/yield-calculator` is the highest-intent inbound surface. It renders a live comparison of self-managed vs. Goldstay-managed economics, then captures the landlord's email in exchange for a branded PDF report (rendered server-side via `@react-pdf/renderer`, reuses the `StatementDocument` styling so the visual identity is continuous from lead to live client). Every download mirrors to the Airtable Yield Reports table tagged `Source = yield-calculator`.

Edit assumptions (occupancy, leakage, OTA fees, tax) in one place: `src/lib/yield/calc.ts`. Tests in `calc.test.ts` lock in the directional behaviour (Goldstay > self-managed, scales with rent, Accra tax > Nairobi tax).

## Embeddable landlord intake

Partner sites (diaspora associations, employer benefit pages, founder-network newsletters) drop one snippet:

```html
<div id="goldstay-landlord-intake"></div>
<script
  src="https://goldstay.co.ke/embed/landlord-intake.js"
  data-goldstay-partner="kenyans-in-uk"
  defer
></script>
```

The script injects an iframe pointing at `/embed/landlord-intake?partner=…`, auto-resizes via `postMessage`, and posts submissions to `/api/lead` with `Source = embed:<partner>` so every signed landlord traces back to the referring site. No tracking pixels, no external dependencies.

## Referral programme

Third parties — agents, brokers, existing landlords — earn a share of every monthly management fee for landlords they introduce. Postgres is the system of record for codes, referrals, and payout schedules; Airtable mirrors `Referrers` and `Referrals` so ops can triage without VPN-ing into the admin surface.

- **Public landing**: `/refer` (programme pitch, two tiers).
- **Signup**: `/refer/signup` → `POST /api/refer/signup` → creates a `Referrer` row, sends a welcome email via Resend with both the public referral link (`/list-your-property?ref=<code>`) and a private dashboard URL (`/refer/dashboard/<token>`).
- **Attribution**: `src/middleware.ts` watches `?ref=…` on every public marketing URL and stamps a 90-day `gs_ref` cookie. `/api/lead` reads the cookie and creates a `Referral` row tied to the originating landlord lead. First click wins.
- **Manual submission**: from the dashboard, an agent can post a landlord directly via `/api/refer/lead`. Auth is the dashboard token (same trust boundary as viewing the page). Mirrors to the Landlord leads table with `Source = referral:<code>`.
- **Defaults** (override per row in the `Referrer` table):
  - **Agent / partner**: 25% of long-term fee or 15% of short-stay fee, paid monthly for 12 months.
  - **Existing landlord**: 50% of one month's fee, paid once 30 days after first rent collection.
- **Payout schedule** generation lives in `src/lib/referrals/payouts.ts`. When ops marks a referral SIGNED, `markReferralSigned()` snapshots the management terms onto the row and atomically inserts the schedule into `ReferralPayout`. Idempotent on `(referralId, monthIndex)`.

Pure-logic tests in `src/lib/referrals/payouts.test.ts` lock the agent example ($1,500/mo unit at 10% fee → $37.50 × 12 months → $450 first-year payout) so the public landing copy and the database can never disagree.

## Brand guardrails (baked into the design system)

- Muted **champagne gold** `#C9A84C`: not bright yellow. Used sparingly for accents and CTAs.
- **Warm off-white** `#FAF8F3` page background: generous white space.
- **Deep charcoal** `#1C1C1C` body text: strong and readable.
- **Dark forest green** `#1B3A2D` used only on the big CTA banner and dark panels for contrast.
- No stock photos of random white people in offices: hero backgrounds use African / Nairobi / Accra contexts via Unsplash URLs you can swap for your own photography.
- Tone: direct, calm, confident. Never pushy.

## What to replace before launch

1. **Hero images**: currently Unsplash URLs. Swap for your own photography of real Nairobi/Accra apartments.
2. **WhatsApp numbers**: set in env vars.
3. **Domain redirects**: configure `.co.ke` and `.com.gh` at the registrars.
4. **Email**: add a Resend API key and verify the `leads@goldstay.com` sender domain.
5. **Analytics IDs**: add GA4 and Meta Pixel IDs.
6. **Logo mark**: the current logo is a typographic wordmark with a gold dot. Swap `src/components/Logo.tsx` for your designed mark when ready.

## Accessibility & performance notes

- All interactive elements have visible focus rings (`focus-visible:ring-gold-500`).
- `prefers-reduced-motion` respected by `Reveal` (Framer Motion `useReducedMotion`).
- Fonts loaded via `next/font` with `display: swap`.
- Mobile-first layout; fixed WhatsApp floating CTA on mobile.
- All pages render statically for fast first paint.
