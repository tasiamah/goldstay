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

## [1.10.0] - 2026-09-07

### Added
- `scripts/harvest-queries.mjs`, which pulls real search queries from Google's
  autocomplete endpoint geo-targeted to Kenya. Every keyword list on this
  project until now has been somebody's judgement about what landlords
  probably type. Autocomplete is not volume data, but Google only suggests
  strings enough people actually searched, so it is the closest thing to
  ground truth available without a paid tool. It also separates out the two
  kinds of query that look like our market and are not our buyer: job and
  course searches, which turn out to be roughly a third of the space around
  "property manager", and software or system searches from landlords who want
  to self-manage.
- Three fee questions on `/pricing` phrased the way Kenyan autocomplete
  actually completes them rather than the way we would naturally write them,
  including "do you have to pay property management fees if nothing happens",
  which is somebody suspecting they are being charged for nothing.

### Changed
- `/airbnb-management` is now titled "Airbnb Management Company Nairobi,
  Kenya". Typing "airbnb management" in Kenya completes first to "airbnb
  management companies in kenya", so on this service the country term
  outranks the city term and "company" is a real modifier — none of which we
  were carrying.
- "Short-let" came out of that title. It went in on the assumption it was a
  synonym worth claiming, and autocomplete returns it for nothing at all in
  Kenya: the everyday Kenyan term is "furnished", the trade term is
  "serviced", and "short let" is British. It was spending title weight, which
  only fits about seven words, on a phrase nobody types.

### Fixed
- Article structured data no longer claims our editorial desks are people.
  Every one of the 350 posts emitted `author: {"@type": "Person"}` regardless
  of byline, so 324 of them asserted that "Goldstay Editors", "Goldstay
  Research" and "Goldstay Legal Desk" were human beings with job titles who
  worked for the company. Desk bylines now resolve to the organisation entity
  already declared in the global graph, and only a real named author emits a
  Person. Publishing under a desk is normal; a masthead of Person entities
  that resolve to nobody is what a content farm looks like, which is the
  opposite of the signal a firm trying to be read as an operator needs.
  Bylines render exactly as before — the error was only ever in the JSON-LD,
  which is why nothing caught it.

## [1.9.0] - 2026-09-07

### Added
- An answer-first summary block at the top of `/airbnb-management` and
  `/long-term-management`, stating in one self-contained paragraph what the
  service is, what it costs and what it includes, followed by the eight facts
  a landlord compares on: fee, onboarding cost, commissions, payout, tax
  handling, exit terms. Both pages previously made a reader assemble those
  from three separate sections, and offered a search engine or an AI summary
  no single quotable passage defining the service at all. A competitor
  ranking above us on the query these pages are named after has exactly this
  block, which is what prompted looking for ours.
- The block is deliberately written to survive being pasted somewhere else
  with no surrounding context, because that is what an AI answer engine does
  with it. No pronouns pointing at earlier copy and no "as described above".

### Changed
- The `/pricing` page no longer claims that most Nairobi managers will not
  publish a fee. Checking it against the market found that untrue: at least
  one competitor publishes its short-stay percentage on the page and argues
  for doing so in nearly the words we had used. An inaccurate claim about
  transparency, on our own pricing page, was the one place we could least
  afford one. The section now compares on what is actually different and
  actually checkable — onboarding fee, contractor commissions, exit fee, and
  whether there are written consequences behind the percentage — and the
  competition FAQ names the real Nairobi fee bands rather than implying we
  are alone in disclosing ours.

### Added
- A page at `/change-property-manager` for the highest-intent cluster on the
  site and the one nobody was serving. "agent not paying rent", "change
  property manager", "agent not remitting rent", "bad property manager" and
  five more had no page and no article anywhere. A landlord searching those
  already owns a property, already pays a manager, and has already decided the
  arrangement is failing: they are not researching, they are replacing someone
  today. The competition leaves it alone because no management company wants to
  publish instructions for firing a management company.
- The page is written as the guide a landlord actually needs, including the
  part that is inconvenient for us: the closing section states our own exit
  terms, which are thirty days, no exit fee, no claw-back and a full handover
  pack. A page about firing your manager is worth nothing coming from a manager
  who is quiet about their own exit. It is deliberately not a legal guide,
  because notice, deposits and agency obligations turn on the agreement that
  was signed, so it points the reader at their own contract and says plainly
  that missing money is a question for a lawyer and not for us.
- A first site-wide FAQ entry, "How do I choose a property management company
  in Nairobi?", answering it with the four questions that actually narrow the
  field. The agency-seeking phrasing had no home: "property management company
  nairobi", "property management companies in nairobi" and "property management
  services nairobi" were claimed by no page, while the singular abstract noun
  was claimed twice. The plural, and the word "company", are what somebody
  shopping for a firm types.

### Changed
- FAQ questions now render as `h3` rather than `span`. The question is the most
  query-shaped text on most of these pages and it was the one part carrying no
  heading weight: the `FAQPage` schema declared it while the document structure
  did not. One component change, so it applies to every FAQ on all 67
  commercial pages at once, and it moved 15 phrases from "mentioned" to
  "targeted" on its own. Nothing moves visually.
- The Airbnb page is now titled "Airbnb & Short-Let Management Nairobi", which
  claims a second head term for the same page rather than splitting the two
  across competing thin pages. It also answers two questions the site had no
  words for at all: whether we work as an Airbnb co-host, and whether we manage
  serviced apartments, holiday homes and furnished lets. "co-host", "cohost"
  and "co-hosting" were absent from every page and every article, and co-host
  is Airbnb's own term, so it is what a host calls the thing they are looking
  for.
- The `/from` hub is titled "Manage Your Kenya Property From Abroad" with a
  matching H1, replacing "Tell us where you live. We'll tailor the
  conversation." That was a fine instruction and a wasted H1, on the hub of a
  21 page cluster, describing the audience in our words rather than theirs.
  Nobody searches "African diaspora property management". The instruction moved
  to the standfirst, where it still reads as one.
- `scripts/keyword-coverage.mjs` now groups phrases by search intent, counts
  `h2`/`h3` as targeting, and matches on token subsequence rather than
  substring. Substring matching lied in both directions: it scored "change
  property manager" as a miss against the title "Change Your Property Manager
  in Nairobi" because of the intervening "Your", and "agent not paying rent" as
  a miss against the FAQ question "My agent is not paying me rent". Token
  matching stays scoped to titles and headings, because applied to a
  3,000-word body it reported "property agent fraud" as covered by 13
  articles.
- Measured honestly against that tool, unclaimed commercial phrases went from
  64 of 84 to 43 of 84, and the switching cluster from 100% unclaimed to 22%.

## [1.7.0] - 2026-09-07

### Added
- A pricing page at `/pricing`, targeting the fee queries the site had no page
  for. The fees were already public but spread across four service pages and a
  handful of FAQ answers, so nothing answered "what does property management
  cost in Kenya" as its subject. Fee queries are the highest-intent search in
  this market, because somebody asking the price has already decided they want
  the service and is choosing a supplier, and they are also the easiest for us
  to win: most Nairobi managers do not publish a number, so a page that answers
  directly beats one that asks you to enquire, both in ranking and in the
  comparison the reader is making.
- Every figure on it reads from the `services` array in `site.ts` or restates a
  commitment already made in `GuaranteesSection`, so a number cannot drift from
  the same number on a service page. Nothing was invented for it. It also
  states what the fee is *not*: no setup or onboarding fee, no contractor or
  platform commission, no maintenance markup, no exit fee or claw-back.
- The FAQ is written close to verbatim query phrasing, so the `FAQPage` schema
  can be what an AI summary or featured snippet quotes rather than something it
  has to infer from prose.
- `/pricing` is linked from the header nav on all 415 pages and from the footer
  services column, anchored on "Property management fees" rather than
  "Pricing".
- `scripts/keyword-coverage.mjs`, which sorts candidate commercial phrases into
  targeted-in-title, targeted-in-H1, mentioned-only and absent by reading the
  built HTML. This is where the gap list came from rather than from intuition:
  it found that only 7 of 47 candidate phrases were claimed in any title, and
  that 33 had no commercial page at all. Now 8 and 30.

## [1.6.0] - 2026-09-07

### Added
- WhatsApp enquiries are now attributed to the page and the button that
  produced them. Every CTA on the site is a `wa.me` deep link, so the
  conversation happened off-platform and nothing about its origin survived the
  jump: a landlord messaged "Hi Goldstay, I'd like to discuss managing my
  property" and there was no way to tell whether that came from the homepage, an
  article, or the Kilimani page. Which is why we could not say what any of the
  SEO work had produced.
- The prefilled message now ends with a line naming the page, for example
  `(Sent from goldstay.co.ke/airbnb-management)`. This is the half that matters:
  a click on `wa.me` only opens WhatsApp's compose screen, so click counts
  overstate real enquiries and no analytics can tell you who pressed send. The
  message text is the only signal that crosses into the thread ops actually
  read. Written as a readable sentence rather than a tracking code on purpose —
  a landlord shown "Ref: KIL-HERO-2A" at the top of their own message is being
  shown plumbing and may delete it.
- A `generate_lead` GA event per click, carrying which surface was used, the
  page path, and the destination. `generate_lead` is one of GA4's recommended
  event names, so it can be marked a key event and reported as a conversion
  rather than sitting among the generic `click` events that enhanced measurement
  already collects for outbound links.
- One delegated capture-phase listener covers all 27 files that call `waLink`,
  so a CTA added later is tracked because it is a `wa.me` link, not because
  somebody remembered to annotate it. The six global CTAs that sit outside any
  `<section>` — hero, navbar, footer, floating button, mobile sticky bar and the
  CTA banner — carry an explicit `data-wa-source`; everything else falls back to
  the enclosing section id.

### Notes
- **This reports nothing until `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set in
  Vercel.** `Analytics.tsx` has been wired and mounted in both layouts for some
  time, but the variable is unset, so the live site has never loaded gtag and no
  page view or click has ever been recorded. The page ref in the WhatsApp
  message works regardless of whether any analytics is loaded.
- The ref is applied at click time rather than in `waLink`, because deriving the
  current path server-side would need `headers()`, and reading `headers()` in
  the marketing tree opts all 417 static routes out of CDN caching — the exact
  regression `soleLiveDomain` exists to avoid. Verified: the money pages are
  still prerendered and the ref is absent from the built HTML.

## [1.5.0] - 2026-09-07

### Added
- A testimonials section on the homepage, the Nairobi and Accra city pages, and
  the Airbnb management, long-term management and tenant finding pages. Nothing
  on the site currently has a landlord vouching for it, which is the one thing
  every competitor leads with, so this is the gap that costs the most enquiries.
- `src/lib/testimonials.ts` holds the quotes. **It ships empty on purpose and
  should not be seeded with examples** — every component reading it renders
  nothing while it is empty, so the pages simply do not have the section until
  there is something true to put in it. Add real quotes with the landlord's
  permission; set `nameIsPartial` when they would rather not be fully named, so
  the section says so rather than looking evasive.
- `Review` structured data, generated from that same file so the markup cannot
  come to claim a review the page does not display. Note that this will **not**
  produce star ratings in search: Google stopped showing review rich results for
  `LocalBusiness` and `Organization` and their subtypes, including
  `RealEstateAgent`, when the reviewed business controls the reviews — which
  covers both `review` and `aggregateRating`. Stars for a local business come
  from its Google Business Profile. The markup is here so an AI answer
  summarising whether Goldstay is any good has something structured to read.
  Deliberately no `aggregateRating`: it earns nothing and adds a number to
  defend.
- Tests rejecting an incomplete testimonial, a future or malformed date, a
  pre-wrapped quote, a duplicate, and placeholder copy such as "John Doe" or
  "lorem". A fabricated quote attributed to a named person is a different
  category of mistake from a typo, and the usual way one ships is that somebody
  adds a realistic-looking example to see the section render.

## [1.4.1] - 2026-09-07

### Fixed
- The sitemap left out 28 URLs the site was asking Google to index. Every
  Accra route — the 11 Ghana articles, `/accra`, `/accra/buy`, the five Accra
  neighbourhoods and the ten `/from/{origin}/accra` pages — returns 200 on
  goldstay.co.ke, is self-canonical there and carries `index, follow`, but
  appeared in no sitemap at all. The sitemap scoped itself by hostname, which
  was right for the three-domain plan and wrong for the present: goldstay.com.gh
  does not resolve, so there is no Ghana sitemap for those URLs to be in. A host
  now advertises a market when it is that market's domain *or* when that
  market's domain is dark and this host is standing in for it, which is the rule
  the canonicals have used all along. Nothing needs changing when the Ghana
  domain goes live; adding it to `liveDomains` moves those routes to their own
  sitemap.

### Changed
- The sitemap's route-selection moved to `src/lib/sitemap-routes.ts` so it can
  be tested. The bug survived because the sitemap route imports the whole
  350-article catalogue and therefore cannot be loaded by a JSX-free test
  runner, so nothing had ever asserted anything about it.

## [1.4.0] - 2026-09-06

### Added

- A phone number you can actually dial. The Nairobi line is now a `tel:`
  link in the footer, on the closing call-to-action of every page, and on
  `/list-your-property`, alongside the office hours. Until now the entire
  public contact surface was WhatsApp, which asks a landlord to open a chat
  with a company they have just found; every property manager we compete with
  in Nairobi leads with a number. It is the same line already published in the
  structured data, derived from one constant so the page and the schema cannot
  drift apart.
- `geo`, `openingHours` and `priceRange` on the business listing. These are
  three of the fields Google asks a local business for and we were answering
  none of them, which matters because the map pack sits above the organic
  results for searches like "property management nairobi" and is fed by this
  data rather than by page content.

### Changed

- Landing page titles now lead with the phrase people actually type.
  "Airbnb Management in Nairobi, Kenya" became "Airbnb Management Nairobi":
  the preposition and the country were spending the most heavily weighted
  words in the title on nothing, since Nairobi already implies Kenya.
- `/long-term-management` now targets "rental management" rather than
  "property management". The city page already owns the latter, so the two
  were competing for the same search and Google had to pick between them;
  this also covers a phrase that previously had no page at all.
- 187 articles gained a link to the service they are about, roughly tripling
  the number of internal links reaching a page that can take an enquiry — from
  126 to 314, against 982 links pointing from articles to other articles. A
  cluster that links mostly to itself keeps its own authority circulating and
  passes very little to the pages that need to rank, and a reader finishing an
  article about vacancy had nowhere to go except another article about vacancy.
  Routing is by topic, and the 38 articles that fit no service cleanly were
  left alone.

## [1.3.0] - 2026-09-06

### Added

- Articles can now carry a `metaTitle` and `metaDescription` separately from
  the headline and standfirst that appear on the page. A headline written to
  be read on the page is usually too long to survive in a search result, and
  the two audiences want different sentences; before this, one field had to
  serve both and the search result lost.
- `scripts/check-snippets.mjs` measures both fields at the pixel widths Google
  actually cuts at — 600px for a title, 960px for a description — rather than
  counting characters, because "Ruiru" and "Westlands" are both nine
  characters and one is half again as wide.

### Changed

- Rewrote the search-result copy for every article that was being truncated:
  245 of 350 titles and 349 of 350 descriptions were wide enough that Google
  cut them mid-phrase, and where a description looked unhelpful it substituted
  its own text pulled from the body. The on-page headlines and standfirsts are
  untouched.
- Article titles no longer get " | Goldstay" appended in search results. The
  suffix cost around 90px of a 600px budget on every one of the 350 articles,
  and the brand is already in the URL and the sitelink beneath it.

### Fixed

- The insights catalogue test now also runs the snippet check, so an article
  added with a headline too long for a search result fails the suite instead of
  shipping and being silently rewritten by Google.

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

[Unreleased]: https://github.com/tasiamah/goldstay/compare/v1.10.0...HEAD
[1.10.0]: https://github.com/tasiamah/goldstay/compare/v1.9.1...v1.10.0
[1.9.1]: https://github.com/tasiamah/goldstay/compare/v1.9.0...v1.9.1
[1.9.0]: https://github.com/tasiamah/goldstay/compare/v1.8.0...v1.9.0
[1.8.0]: https://github.com/tasiamah/goldstay/compare/v1.7.0...v1.8.0
[1.7.0]: https://github.com/tasiamah/goldstay/compare/v1.6.0...v1.7.0
[1.6.0]: https://github.com/tasiamah/goldstay/compare/v1.5.0...v1.6.0
[1.5.0]: https://github.com/tasiamah/goldstay/compare/v1.4.1...v1.5.0
[1.4.1]: https://github.com/tasiamah/goldstay/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/tasiamah/goldstay/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/tasiamah/goldstay/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/tasiamah/goldstay/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/tasiamah/goldstay/compare/v1.0.3...v1.1.0
[1.0.3]: https://github.com/tasiamah/goldstay/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/tasiamah/goldstay/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/tasiamah/goldstay/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/tasiamah/goldstay/releases/tag/v1.0.0
