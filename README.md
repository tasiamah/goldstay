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
