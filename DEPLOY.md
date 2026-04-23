# Deploying Goldstay

The site is a standard Next.js 14 App Router project hosted on **Vercel**.
A GitHub Actions pipeline (`.github/workflows/deploy.yml`) is the single
source of truth for deployments, every push to `main` builds, lints,
type-checks and then deploys to production automatically. Pull requests
build a preview deployment and comment the URL on the PR.

## Pipeline at a glance

```
push to main ──▶ verify (lint · build) ──▶ deploy-production ──▶ goldstay.vercel.app
PR opened ─────▶ verify ──────────────────▶ deploy-preview ─────▶ goldstay-<hash>.vercel.app
                                                                   (URL auto-commented on the PR)
```

`vercel.json` sets `"git": { "deploymentEnabled": false }` so Vercel's own
Git auto-deploys are disabled, GitHub Actions is the only thing that
deploys. One source of truth, no double-deploys.

---

## Required GitHub secrets

Add these once. They're the only thing the pipeline needs to work.

| Secret | Value | Where to get it |
| --- | --- | --- |
| `VERCEL_TOKEN` | Personal access token (starts with `vrcl_…`) | https://vercel.com/account/tokens → **Create Token** |
| `VERCEL_ORG_ID` | `team_KxESQpWhwSr7S2dAku5LY3qI` | `cat .vercel/project.json` |
| `VERCEL_PROJECT_ID` | `prj_H4hli8weL3CfXZbbaqn0lZIOc6am` | `cat .vercel/project.json` |

Set them all in one go with the GitHub CLI:

```bash
gh secret set VERCEL_TOKEN      --body "vrcl_your_token_here"
gh secret set VERCEL_ORG_ID     --body "$(jq -r .orgId     .vercel/project.json)"
gh secret set VERCEL_PROJECT_ID --body "$(jq -r .projectId .vercel/project.json)"
```

Or add them in the browser:
`https://github.com/tasiamah/goldstay/settings/secrets/actions`

---

## Environment variables (runtime, optional)

These are **not required to deploy**, the site renders and the form accepts
submissions even without them. Add them in the Vercel dashboard under
**Project → Settings → Environment Variables** when you're ready to go live.

| Key | Purpose | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER_NAIROBI` | WhatsApp number for Nairobi CTAs | `254712345678` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER_ACCRA` | WhatsApp number for Accra CTAs | `233501234567` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Fallback WhatsApp number | `254712345678` |
| `CONTACT_INBOX` | Email that receives landlord enquiries | `hello@goldstay.com` |
| `RESEND_API_KEY` | Enables real email via Resend (else logs to server) | `re_xxx` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta / Facebook pixel | `1234567890` |

After adding env vars, push any commit (e.g. a whitespace change) and the
pipeline will redeploy with them baked in.

---

## Manual deploy (bypass CI)

If you ever need to ship outside of the pipeline (e.g. recovering from a
bad merge or testing a local branch):

```bash
npx vercel           # preview deploy → goldstay-<hash>.vercel.app
npx vercel --prod    # production deploy → goldstay.vercel.app
```

---

## Custom domains

Once you're ready to point `goldstay.com`, `goldstay.co.ke`, or
`goldstay.com.gh` at the deployment:

1. Vercel dashboard → **Project → Settings → Domains → Add**
2. Add each domain. Vercel will give you the DNS records to set at your registrar.
3. For country sites, either:
   - Point them at the same deployment (they'll serve the same content), or
   - Add a redirect rule in `vercel.json` so `goldstay.co.ke` → `goldstay.com/nairobi` and `goldstay.com.gh` → `goldstay.com/accra`.

---

## Sharing the preview link

Any `*.vercel.app` URL is public by default, just paste it into WhatsApp /
email. If you want a password gate for the early feedback phase, enable
**Project → Settings → Deployment Protection → Password Protection** in
the Vercel dashboard (Pro plan feature).
