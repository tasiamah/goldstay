# Goldstay

Premium property management in Nairobi & Accra — marketing site for diaspora landlords.

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
| `/api/lead` | Server route — delivers form submissions via Resend; logs to console if no API key. |
| `/sitemap.xml`, `/robots.txt` | Auto-generated. |

## Environment variables

Copy `.env.example` to `.env.local` and fill in as needed:

```
NEXT_PUBLIC_WHATSAPP_NUMBER=            # fallback/primary WhatsApp number in international format, no +
NEXT_PUBLIC_WHATSAPP_NUMBER_NAIROBI=    # Nairobi-specific number (optional)
NEXT_PUBLIC_WHATSAPP_NUMBER_ACCRA=      # Accra-specific number (optional)
NEXT_PUBLIC_CONTACT_EMAIL=hello@goldstay.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=          # e.g. G-XXXXXXX — omit to disable
NEXT_PUBLIC_META_PIXEL_ID=              # Meta Pixel ID — omit to disable
RESEND_API_KEY=                         # from resend.com — omit to log to console instead
CONTACT_INBOX=hello@goldstay.com        # where form submissions get sent
TENANT_OPS_INBOX=ops@goldstay.com       # where tenant applications get sent
AIRTABLE_API_KEY=                       # Airtable PAT, omit to disable CRM mirror
AIRTABLE_BASE_ID=                       # base id from airtable.com/api
AIRTABLE_LEADS_TABLE=Leads              # table name, override if renamed
AIRTABLE_TENANTS_TABLE=Tenant Applications
AIRTABLE_VACANCY_TABLE=Vacancy Leads
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

## Deployment

The site is designed for **Vercel** — zero config deploy. Set the environment variables above in the Vercel project dashboard.

### Domain routing

- `goldstay.com` — primary.
- `goldstay.co.ke` → 301 redirect → `goldstay.com/nairobi` (set up in your Kenyan registrar).
- `goldstay.com.gh` → 301 redirect → `goldstay.com/accra` (set up in your Ghanaian registrar).

One codebase, multiple local-feeling domains. SEO authority stays on `goldstay.com`.

## Airtable CRM (optional)

Every landlord lead and tenant application is mirrored to an Airtable base so the ops team can manage pipelines without living in the inbox. Email remains the primary channel; if Airtable is unconfigured or unreachable, the form still succeeds and the email still sends.

### One-time base setup

You have two options. The script is the fast path and is idempotent, so you can also re-run it later if you ever need to extend the schema.

#### Option A — provision the schema via script (recommended)

1. Create an empty base in Airtable called **Goldstay CRM** (or any name, the script only needs the base id).
2. Grab the base id from the URL (`https://airtable.com/appXXXXXXXXXXXXXX/...`).
3. Create a **setup-only** PAT at [airtable.com/create/tokens](https://airtable.com/create/tokens) scoped to the Goldstay CRM base with `schema.bases:read` and `schema.bases:write`. This is separate from the runtime token and should be revoked once the schema is provisioned.
4. Run the provisioner:

   ```bash
   AIRTABLE_API_KEY=pat... AIRTABLE_BASE_ID=app... npm run airtable:setup
   ```

   It creates `Leads`, `Tenant Applications` and `Vacancy Leads` with the exact fields and single-select options the API routes expect. Idempotent — re-running it adds any new fields without touching existing data.

5. Revoke the setup PAT. For runtime, create a new PAT with only `data.records:write` and drop it into `AIRTABLE_API_KEY` in Vercel.

#### Option B — create the three tables manually

Create the three tables described below. Field names are case-sensitive and must match exactly, otherwise Airtable drops the values silently at write time.

**Table: `Leads`** (landlord enquiries from `/list-your-property`)

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
| Status | Single select (New, Contacted, Onboarded, Lost) — default New |

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
| Employment type | Single select (salaried, self-employed, contract, business-owner, unemployed, student, other) |
| Employer | Single line text |
| Months in role | Number (integer) |
| Has previous landlord | Checkbox |
| Previous landlord name | Single line text |
| Previous landlord phone | Phone number |
| Evicted before | Checkbox |
| Scoring rationale | Long text |
| Token | Single line text |
| Submitted | Date with time |
| Status | Single select (New, Verified, Placed, Rejected) — default New |

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
| Status | Single select (New, Contacted, Pitched, Signed, Not interested) — default New |

### Credentials

1. Go to [airtable.com/create/tokens](https://airtable.com/create/tokens), create a Personal Access Token scoped to the Goldstay CRM base with the `data.records:write` scope (and `data.records:read` if you want ops tools to read back later).
2. Grab the base id from [airtable.com/api](https://airtable.com/api) (opens the base's REST docs). The id starts with `app...`.
3. Set `AIRTABLE_API_KEY` and `AIRTABLE_BASE_ID` in Vercel → Project → Settings → Environment Variables, for Production and Preview.
4. Redeploy (or push any commit) so the new env vars are picked up.

### How writes happen

- Writes run in parallel with the Resend email via `Promise.allSettled`, so total latency is max(email, airtable) not sum.
- Failures are logged and swallowed: a broken CRM never breaks the public form.
- `typecast: true` is enabled, so adding new single-select options (for example a new status) can be done from Airtable without a code change.

## Brand guardrails (baked into the design system)

- Muted **champagne gold** `#C9A84C` — not bright yellow. Used sparingly for accents and CTAs.
- **Warm off-white** `#FAF8F3` page background — generous white space.
- **Deep charcoal** `#1C1C1C` body text — strong and readable.
- **Dark forest green** `#1B3A2D` used only on the big CTA banner and dark panels for contrast.
- No stock photos of random white people in offices — hero backgrounds use African / Nairobi / Accra contexts via Unsplash URLs you can swap for your own photography.
- Tone: direct, calm, confident. Never pushy.

## What to replace before launch

1. **Hero images** — currently Unsplash URLs. Swap for your own photography of real Nairobi/Accra apartments.
2. **WhatsApp numbers** — set in env vars.
3. **Domain redirects** — configure `.co.ke` and `.com.gh` at the registrars.
4. **Email** — add a Resend API key and verify the `leads@goldstay.com` sender domain.
5. **Analytics IDs** — add GA4 and Meta Pixel IDs.
6. **Logo mark** — the current logo is a typographic wordmark with a gold dot. Swap `src/components/Logo.tsx` for your designed mark when ready.

## Accessibility & performance notes

- All interactive elements have visible focus rings (`focus-visible:ring-gold-500`).
- `prefers-reduced-motion` respected by `Reveal` (Framer Motion `useReducedMotion`).
- Fonts loaded via `next/font` with `display: swap`.
- Mobile-first layout; fixed WhatsApp floating CTA on mobile.
- All pages render statically for fast first paint.
