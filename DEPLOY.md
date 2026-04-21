# Deploying Goldstay

The site is a standard Next.js 14 App Router project. It deploys cleanly to
**Vercel** (recommended), Netlify, or any Node host that supports Next.js.

Pick the path that fits you. Both give you a shareable preview URL like
`goldstay-xxx.vercel.app` in under 3 minutes.

---

## Option A — Vercel via Web UI (recommended, zero terminal)

1. Go to **https://vercel.com/new**
2. Sign in with the GitHub account that owns the `goldstay` repo
3. Click **Import** next to `goldstay`
4. On the configuration screen:
   - Framework preset: **Next.js** (auto-detected)
   - Build command: **`next build`** (default)
   - Output directory: *(leave default)*
   - Install command: **`npm install`** (default)
5. Skip environment variables for the first deploy — everything has safe
   fallbacks. You can add real values later (see below).
6. Click **Deploy**.

You'll get a URL like `https://goldstay-<hash>.vercel.app` ready to share.

---

## Option B — Vercel CLI

From the project root:

```bash
npx vercel login      # one-time, opens a browser to authenticate
npx vercel            # preview deploy → goldstay-<hash>.vercel.app
npx vercel --prod     # production deploy → goldstay.vercel.app
```

The first `vercel` run will ask a handful of questions. Sensible defaults:

- Set up and deploy "goldstay"? **yes**
- Which scope? *your personal account*
- Link to existing project? **no**
- What's your project's name? **goldstay**
- In which directory is your code located? **./**
- Want to modify these settings? **no**

Subsequent deploys are just `npx vercel --prod`.

---

## Environment variables (optional, for full functionality)

These are **not required to deploy**. The site renders and the form accepts
submissions even without them. Add them in the Vercel dashboard under
**Project Settings → Environment Variables** when you're ready to go live.

| Key | Purpose | Example |
| --- | --- | --- |
| `NEXT_PUBLIC_WHATSAPP_NUMBER_NAIROBI` | WhatsApp number for Nairobi CTAs | `254712345678` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER_ACCRA` | WhatsApp number for Accra CTAs | `233501234567` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Fallback WhatsApp number | `254712345678` |
| `CONTACT_INBOX` | Email that receives landlord enquiries | `hello@goldstay.com` |
| `RESEND_API_KEY` | Enables real email via Resend (else logs to server) | `re_xxx` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics 4 | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta / Facebook pixel | `1234567890` |

After adding env vars, trigger a redeploy (Vercel dashboard → **Deployments**
→ **⋯** → **Redeploy**).

---

## Custom domains

Once you're ready to point `goldstay.com`, `goldstay.co.ke`, or
`goldstay.com.gh` at the deployment:

1. Vercel dashboard → **Project → Settings → Domains → Add**
2. Add each domain. Vercel will give you the DNS records to set.
3. For country sites, either:
   - Point them at the same deployment (they'll serve the same content), or
   - Configure a redirect rule in `vercel.json` to push `goldstay.co.ke` → `goldstay.com/nairobi` and `goldstay.com.gh` → `goldstay.com/accra`.

---

## Sharing the preview link with friends

Any `*.vercel.app` URL is public by default — just paste the link into
WhatsApp / email. If you want a password gate for early feedback, enable
**Project Settings → Deployment Protection → Password Protection** in the
Vercel dashboard (Pro plan feature).
