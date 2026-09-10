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

## [1.40.0] - 2026-09-10

### Changed
- The Airbnb management page now says what it sells in its own headline.
  It opened with "Turn your Nairobi apartment into a five-star short-stay",
  which named the city but never the service, so the largest text on the
  page supported the location half of what people search and none of the
  rest. The two service pages that do name themselves plainly, long-term
  management and pricing, were both ranking first on the day this was
  checked, while this one sat thirteenth. The promise is kept: it now
  reads "Airbnb management in Nairobi, without lifting a finger".
- The page comparing property management companies had one link pointing
  at it from 379 articles, despite being the page for people deciding who
  to hire. Five more now link to it from the articles where a reader is
  making that exact decision, including the fee guide, which is one of
  the better-ranking articles on the site.

### Fixed
- The footer and the search-engine data said the Nairobi office opens
  at 08:00 and closes for the weekend. It opens at 09:00 and is open
  on Saturday, which is what the Google Business Profile has been
  telling customers all along. Anyone who read the site and rang on a
  Saturday assumed we were shut.
- The footer turned those hours into words by substituting one exact
  string, so changing the days would have printed the raw notation —
  "Mo-Sa 09:00-18:00" — on the page. It is now derived from the hours
  themselves.

## [1.39.0] - 2026-09-10

### Added
- The site now tells search engines that the Goldstay on Google Maps
  is this Goldstay. The profile turned out to be claimed and holding
  reviews, which is the confirmation the schema had been waiting for
  since it was written; until then the map link said only "here is a
  map of this address", which cannot lend the reviews or the local
  listing to the site.

## [1.38.1] - 2026-09-10

### Fixed
- Booking notifications could not reach clients on their own. The
  emails added in 1.37.0 are sent when a booking is imported, but
  the job that imports them from a channel calendar was switched
  off, so a guest could book and the owner would hear nothing until
  someone opened the property page and pressed "Sync now". The
  fifteen-minute poll is now running.

## [1.38.0] - 2026-09-09

### Added
- Enquiries are now reported to Google Ads as conversions, so paid
  spend can be judged on leads rather than on clicks.

  Google's own setup offers a snippet to paste into a conversion
  page, fired on page load. Nothing on this site fits that: the
  WhatsApp CTA leaves for wa.me and never comes back, so there is no
  page to load, and the forms post with fetch and re-render in place
  rather than navigating. The conversion is instead reported from the
  same two places that already emit GA4's `generate_lead`, on the
  same success condition, so the Ads figure and the GA4 figure count
  one thing and a gap between them means a tagging fault rather than
  a disagreement about what a lead is.

  Both halves are set by environment variable. An account id or
  conversion label with one character wrong produces a conversion
  that silently never fires, so the value is parsed and validated:
  a GA4 measurement id in the wrong variable is rejected rather than
  sent, and the common paste of the whole `AW-…/label` string into
  either field is accepted. Missing configuration is a no-op, which
  is what preview, local development and the partner embed need.

## [1.37.0] - 2026-09-09

### Added
- Clients are now emailed when a booking lands on one of their units,
  and when one is cancelled. Until now a booking was visible only if
  the client thought to open the portal, so an owner could have a
  guest arriving on Friday and no reason to know.

  The email states the property, the dates, the number of nights, the
  channel, and the guest and net payout where we have them. It also
  appears as a row in the portal bell, deep-linked to the property.

  It fires from all three places a booking can arrive — the Hostaway
  webhook, the iCal sync and the admin booking form — through one
  choke point rather than three copies. That matters most for the
  webhook, which upserts on every upstream modification: a guest
  changing their arrival time three times would otherwise send three
  identical emails. Sending is claimed against the notification
  table's unique key first, so the second and later attempts for a
  reservation stop before Resend is called.

  An iCal booking gets a deliberately different email. That feed
  carries dates and nothing else, so every amount on the row is a
  zero placeholder; quoting them would tell an owner they had earned
  nothing. That version gives the dates and the channel, and says the
  figures follow on the statement once the channel reports them.

  A cancellation is only sent to someone who was told the booking
  existed. Otherwise the single message an owner receives about a
  reservation is that it has gone, which reads as lost income rather
  than as nothing having happened.

### Fixed
- Scheduled jobs have never run. `CRON_SECRET` was set in neither
  GitHub Actions nor Vercel, and the routes fail closed, so all five
  — agreement reminders, monthly statements, iCal sync, vacancy
  pitch and acquisition scan — returned 401 on every invocation from
  both the GitHub schedules and the Vercel cron. No client email that
  depends on a schedule has ever been sent. Nothing was lost in
  practice because the portfolio has no active properties or bookings
  yet, but the agreement reminder ladder had five agreements waiting.
  A secret is now set in both places and both paths verified against
  production.

- Booking notifications would have been erased on sight without a
  change to the notification sync. That sync reconciles the bell
  against current state and resolves any unresolved row it cannot
  re-derive, which is right for "your setup is incomplete" and wrong
  for anything recorded as an event. A booking notification would
  have been written and then resolved by the client's very next page
  load, with no error anywhere to explain the silence. Event kinds
  are now exempt from the sweep, and a test fails if a new one is
  added without exempting it.

## [1.36.0] - 2026-09-09

### Fixed
- The "Keep reading" row was leaving most of the catalogue unlinked.
  It scored every other article by shared tags and took the top two,
  which reads sensibly and distributes links badly: 116 of 379 articles
  ended up with no inbound link anywhere on the site, while one Karen
  neighbourhood guide collected 32. Because that row is the only thing
  linking to most articles, those 116 had nothing telling Google to
  crawl or rank them, however good they were. Raising the limit does
  not fix it and makes the concentration worse: at six per article, 41
  still had none and Karen's climbed to 60.

  Related articles are now assigned from a graph computed for the whole
  catalogue, where coverage is a constraint rather than an outcome. Every
  indexable article is guaranteed a floor of inbound links, no article
  may exceed a ceiling, and relevance decides which article fills a slot
  and the order the row renders in. Across the catalogue that moves the
  worst case from zero inbound links to three, the median from one to
  five, the maximum from 32 down to 12, and total internal links from
  758 to 2,274. Noindexed articles are deliberately excluded as targets,
  since pointing internal links at a page we have asked Google not to
  index spends crawl budget on a page that cannot rank; they still show
  a row of their own.

## [1.35.0] - 2026-09-09

### Added
- "Enrogue Kileleshwa: what to do before your handover." Enrogue is eighteen
  floors of one and two beds on Kileleshwa's main road from HassConsult,
  completing in the last quarter of 2026, so a few hundred owners take keys
  within weeks of each other and all try to let at once. Written for them
  rather than for buyers: book the snagging inspection for handover day,
  get the defects liability period and the service charge per square metre
  in writing, and do not sign a tenant before the keys are physically in
  hand. An independent construction record logged the original programme as
  ending Q1 2026 against the developer's current Q4 2026, so the date is a
  range rather than a promise, and owners lose real money agreeing lease
  starts against a forecast.

  The section that does not exist anywhere else covers the decision these
  owners actually face: HassConsult is both the developer and one of the
  largest estate agencies in Kenya, so the letting offer arrives at the
  handover desk while you are holding keys and no tenant. Sets out what to
  establish before agreeing, including whether the mandate is exclusive and
  how many units in the same building the agent already holds, since those
  listings compete with yours for one tenant.

## [1.34.0] - 2026-09-09

### Added
- "Airbnb management in Nairobi: which platforms your unit should be on."
  Owners search for Airbnb management, co-hosting, short-let management and
  serviced apartment management as if they were different services, so the
  article opens by collapsing the vocabulary and then answers the question
  that actually moves their income: which channels the unit is listed on.
  Sets out what each platform takes in 2026 — Airbnb's 15.5% host-only fee,
  Booking.com's 10-25%, and Expedia and Vrbo's 5% plus 3% — and shows why
  comparing those headline rates is misleading, because Vrbo still charges
  the guest 6-15% on top while Airbnb no longer does, so the channel with
  the lower host fee can lose you the booking. Also records that the widely
  quoted 8% Expedia rate is a US and Canada figure and that Kenya appears in
  no published band, which is the number a Nairobi owner is most likely to
  be quoted wrongly.
- Booking.com is now a selectable booking source in the admin, and can have
  an iCal feed attached.

### Changed
- `src/lib/booking-sources.ts` said Booking.com was unsupported "until we
  have the ops bandwidth", which had been untrue since those listings
  started being managed by hand outside the platform. Staff could not record
  a Booking.com stay at all, and nothing guarded against double-booking a
  unit that was live on both channels. Vrbo stays hidden, because we
  genuinely do not list there.

## [1.33.0] - 2026-09-09

### Added
- "Airbnb or Booking.com for a Nairobi short stay: which one actually
  pays more?" The comparison owners ask for, answered on the parts that
  matter rather than the fee. Covers the different guest each platform
  delivers, the fact that Booking.com invoices its commission monthly
  rather than deducting it (the most common way a remote owner's listing
  gets suspended), the gap between booked and stayed on a
  free-cancellation-heavy channel, and why an iCal link is not the same
  as a synced calendar.

  Demand-checked first: 239 host-side query variants exist for this
  comparison, but only one was Kenya-scoped, so the piece targets the
  localised long tail rather than pretending it can beat Lodgify and
  Hostaway to the head term.

### Fixed
- Two articles carried fee arithmetic that Airbnb's pricing change has
  overtaken. `how-much-can-you-earn-airbnb-nairobi-2026` said
  Booking.com "generally takes more", which stopped being true when
  Airbnb moved hosts to a flat 15.5 percent of the whole booking from
  the old 3 percent host share, and the complete host guide implied the
  same. Both now state the current numbers and note that owners who
  signed up before the switch have a materially larger commission line
  than they expect.

## [1.32.1] - 2026-09-09

### Added
- The Airbnb trademark disclosure their brand guidelines ask for:
  "Goldstay is an independent third party and is not endorsed by or
  associated with Airbnb, Inc. or its affiliates." It sits in the footer
  on every page, and again directly under the yield calculator and the
  two landlord lead form CTAs, which are the surfaces the guidelines
  name explicitly.

  The site markets "Airbnb management" hard, because that is the phrase
  owners here search for and dropping it would cost real traffic. The
  same guidelines treat the mark used as a service name as prohibited
  branded use, so the phrase and the notice are a pair: the disclosure
  is what makes the usage descriptive rather than a claim of
  endorsement. The exposure worth caring about is not a lawsuit, it is
  a trademark complaint to Google taking down the paid search campaign
  — which is the channel the phrase is most valuable in, and which
  starts running this month.

## [1.32.0] - 2026-09-09

### Added

- `/go/whatsapp`, a tracked hop that records a WhatsApp CTA click
  server-side and then redirects to `wa.me`. It exists because the
  funnel leaves our property at that point: once the browser is on
  `wa.me` nothing we control can see anything, so this is the last
  request where a click can be attributed. A GA event already fired on
  these links, but ad blockers, iOS Safari and in-app browsers drop
  client-side analytics at a rate nobody can measure, and an
  underreported campaign is indistinguishable from one that is not
  working. The two counts read together now bound that gap.
- `/manage-my-property`, a landing page for the WhatsApp campaign, with
  one call to action and the fee and service commitments published on
  it. Noindexed, because it overlaps the homepage's organic target of
  "property management nairobi" and two of our own pages competing for
  one query helps neither. It stays crawlable in `robots.txt`, since a
  landing page Googlebot cannot fetch gets the ad disapproved.
- Google Ads click ids are now captured. Middleware writes `gclid`,
  `wbraid` or `gbraid` plus any `utm_*` into a 90 day cookie on
  arrival, and both the WhatsApp hop and `/api/lead` read it
  server-side, so attribution survives a visitor reading three articles
  before making contact and does not depend on the page's JavaScript.
  90 days because that is the longest window Google Ads will accept an
  offline conversion upload for.

### Fixed

- **Every Google Ads click would have been recorded as organic search.**
  Auto-tagging appends `gclid` and does not set `utm_medium`, which is
  what `classifyReferrer` used to decide "paid" from, so a campaign
  running with default settings was indistinguishable from organic
  traffic. A click id is now the first thing checked.
- Leads store the `gclid`. Without it there was no way to tell Google
  Ads which clicks became real clients, so a campaign could only ever
  optimise for cheap button presses rather than for business.
- `?i=toString` on the WhatsApp hop would have resolved against
  `Object.prototype` and put `function toString() { [native code] }`
  into the visitor's prefilled message. Found by its own test.

### Changed

- A landlord answering "Google search" on the lead form no longer maps
  to the organic channel. That mapping carried a note saying it would
  begin overstating organic the day ads started running, and ads start
  now. Nobody can tell an ad from an organic result, so the stated
  answer is kept verbatim in `foundVia` and the `channel` column is
  left to measured evidence.

### Migration

Additive: one table, one nullable column on `Lead`, two indexes.
Apply `20260909180000_whatsapp_click_tracking` with
`npm run db:deploy:local` **before** deploying this version.

## [1.31.0] - 2026-09-09

### Added

- Three articles covering the short-let vocabulary the catalogue had no
  claim on. Across 373 articles, not one meta title contained "short term
  rental", "short stay", "vacation rental", "holiday let" or "serviced
  apartment"; eleven said "Airbnb". The entire short-let side of the
  business was described by one platform's brand name, so an owner
  searching any of the generic terms found nothing.
  - **Short-term rental management in Nairobi.** The platform-agnostic
    pillar, arguing that Airbnb is one channel of five and that
    Airbnb-only distribution leaves the corporate and Booking.com demand
    unserved.
  - **Vacation rental, holiday let, short stay or Airbnb.** The words map
    to countries rather than to services, which matters because a large
    part of the audience owns in Nairobi and searches from Houston or
    Manchester. Also marks the three places the terms genuinely diverge.
  - **Serviced apartment management in Nairobi.** The furnished monthly
    corporate segment, why the net often beats nightly once turnover cost
    is counted, and why the invoicing requirement keeps it with operators.

### Changed

- The Airbnb management fee article now carries the short-term rental,
  vacation rental and holiday letting fee vocabulary as well, rather than
  a second near-duplicate article competing with it for the same
  question. A demand harvest found the fee cluster is the strongest in
  this vocabulary ("how much do short term rental management companies
  charge", "average short term rental management fee").
- Inbound links from three of the better-linked existing articles into
  the new cluster, so it does not start from zero.

## [1.30.0] - 2026-09-09

### Added

- Three articles for owners who have decided to hire and are looking for
  somewhere to look, which is a different search from comparing firms. A
  Kenya-targeted harvest of 1,085 "find / where / near me" queries picked
  the targets: the largest Kenyan cluster is the "top 10 / list of property
  management companies in Kenya" family, and the co-host finding cluster
  runs to roughly 90 variants.
  - **Where to find an Airbnb co-host in Nairobi.** Leads on the fact
    below: Airbnb's own directory does not cover Kenya, so the five routes
    that do work here, and a three-question filter to apply to whoever they
    turn up.
  - **How to find a property manager in Nairobi.** The six sources that
    carry evidence, the four that waste time, and a one-page brief to send
    to three firms so their replies are actually comparable.
  - **Top property management companies in Kenya.** Serves the ranking
    query without publishing a self-serving ranking: four checks to apply
    to any list you find, the criteria on which Kenyan agents genuinely
    differ, and an honest note that we are the wrong firm for blocks and
    commercial space.

### Fixed

- The Airbnb co-host article said Airbnb's Co-Host Network was merely
  "thin" in Nairobi. It is not available in Kenya at all: the network
  covers thirteen countries and none is African, so an owner entering a
  Nairobi address gets nothing back. A reader acting on the old wording
  would have gone looking for a feature that is not there.

## [1.29.0] - 2026-09-09

### Added

- Four articles for landlords at the point of hiring a manager, rather
  than researching the market. A Kenya-targeted autocomplete harvest of
  627 bottom-of-funnel queries drove the selection, and one finding
  shaped all four: raw suggestion volume is contaminated by American and
  British results, so `do i need a property manager` returns 93 variants
  that include California licensing and Queensland Form 5. Candidates
  were therefore ranked on Kenyan specificity and intent rather than
  yield.

  - **The property management agreement in Kenya, clause by clause.**
    Targets `property management agreement between landlord and agent in
    kenya`, one of only 27 explicitly Kenyan queries in the harvest and
    the highest-intent moment there is, because the reader is holding a
    contract they are about to sign. The catalogue had articles on the
    tenancy agreement and the operator sublease but nothing on the
    landlord-to-agent contract. Also covers the template queries
    (`airbnb management agreement template` and variants).
  - **How to terminate a property management agreement in Kenya.** A
    landlord terminating is by definition shopping for a successor. The
    cluster is template-hungry (`notice to terminate`, `letter to
    terminate`, `how do i switch property managers`), so the piece
    carries an adaptable notice letter and the handover list: deposit,
    unremitted rent, MRI receipts, tenant contact details, keys against
    inventory. `should-i-fire-my-nairobi-property-manager-2026` covered
    the decision and now links forward to the execution.
  - **The questions to ask a property manager before you sign.** Forty
    four variants, and distinct from the ten questions in the
    fire-my-manager piece, which are about the manager you already have.
    Publishes our own answers on fee basis, payout date, response time,
    tax and default, so a landlord can compare us against a shortlist on
    written answers rather than a sales call.
  - **Do you actually need a property manager in Nairobi?** Sets out the
    cases where a resident landlord with one long-let unit should not
    hire us, and recommends tenant-finding-only for most of them, which
    earns a fraction of what management does.
    `why-property-management-matters-diaspora-landlords` argues the
    other side and now links here.

### Changed

- Wired inbound links from six existing articles so none of the four
  ships as an orphan. Each now has between three and five inbound links,
  which is what decides whether Google crawls them in weeks rather than
  months.

## [1.28.0] - 2026-09-09

### Added

- The four enquiry forms now report a conversion when they submit
  successfully. Previously the only event anywhere in the app was the
  WhatsApp CTA click, so switching Google Analytics on would have made
  a wa.me click the sole measurable conversion — and that number is an
  upper bound on enquiries, because clicking only opens WhatsApp's
  compose screen and the send happens where no browser can see it. A
  submitted form is a completed action on our own origin and the
  higher-intent lead of the two, so the weaker signal was about to
  become the only signal.

  Both paths emit GA4's `generate_lead`, separated by a `method` of
  `form` or `whatsapp`. One event name means one key event to configure
  in GA and one conversion count that can be broken down by source,
  rather than two numbers that have to be added up by hand. Each event
  also carries whether the lead was landlord or tenant side, so letting
  supply is not mixed into the commercial number.

  The event fires only after the POST returns ok, so failed and retried
  submissions cannot push the conversion count above the row count in
  the database.

- `/admin/health` now shows whether a Google Analytics measurement ID is
  configured. Worth having because `<Analytics>` renders nothing when
  the variable is unset, which from the front end is indistinguishable
  from a working install: no script, no error, no events.

### Notes

- The landlord intake form under `/embed` is deliberately not tracked.
  It renders in a partner's iframe under a layout that does not mount
  `<Analytics>`, so gtag is never defined there and a call would be dead
  code that reads as working coverage. Measuring partner embeds needs
  its own property and its own consent story.

## [1.27.1] - 2026-09-09

### Fixed

- Any URL that matched no route served Next's own unstyled "404: This
  page could not be found." rather than a Goldstay page, so a visitor
  arriving on a stale link or a typo saw something that reads as the
  whole site being down. They now get a branded page that names the
  four places they were most likely heading, and the response keeps its
  404 status.

  The cause is worth recording, because the obvious fix does not work.
  There is no `src/app/layout.tsx`: `(marketing)` and `(platform)` each
  carry their own root layout, which is what keeps the public navbar off
  the logged-in surfaces. Next renders a root-level not-found outside
  the layout tree, so a top-level `app/not-found.tsx` has no layout to
  render in, and the two existing `not-found.tsx` files only fire for
  `notFound()` raised inside their own group — which an unmatched URL
  never reaches. A catch-all at `(marketing)/[...notFound]` pulls those
  URLs into the group so its not-found boundary handles them. Static and
  more specific dynamic segments still resolve first, asserted by
  `not-found.test.ts` and verified against a production build.

  Two limits come with that boundary and are documented in the file:
  `Navbar` and `Footer` render empty there and cannot be made to work,
  so the destination cards are the only navigation; and the font
  variables have to be set on a wrapper because the error shell's
  `<html>` carries no className.

- The 404 raised by a page that does exist — an unknown `/insights`
  slug or `/nairobi` neighbourhood — was hitting the same unstyled
  shell, and now renders the branded page too.

## [1.27.0] - 2026-09-09

### Changed

- Retargeted the arbitrage and subletting cluster onto the phrasings
  people actually type. An autocomplete harvest for Kenya returned zero
  suggestions for `airbnb arbitrage kenya`, `rental arbitrage kenya`,
  `can i sublet my apartment kenya`, `is subletting illegal in kenya`
  and `landlord permission airbnb kenya`, and four for `rent to rent
  kenya`. Google only suggests strings enough people have searched, so
  the cluster was ranking for terms with negligible demand. Meanwhile
  `rental arbitrage` returned 293 suggestions, `rent to rent agreement`
  285 and `airbnb without owning property` 257 — and "without owning
  property" appeared in none of the 364 articles while "airbnb
  arbitrage" appeared in seven. Slugs are unchanged, so nothing that
  ranks today loses its URL, and every editorial H1 keeps its existing
  wording; only the search-result overrides and an added answer-first
  section move. Each article was given one primary query so they do not
  compete:
  - `airbnb-arbitrage-nairobi-2026` now leads on "rental arbitrage",
    with a section explaining that rental arbitrage, rent to rent and
    Airbnb arbitrage are one model under three names, and that the UK
    and US templates assume a market this is not.
  - `is-airbnb-arbitrage-legal-kenya` now leads on "can I Airbnb a
    rented apartment", which is the same question it already answered.
  - `landlord-permission-to-sublet-kenya` now leads on "can I Airbnb a
    house I rent", with a section on why the building always notices.
  - `ask-landlord-permission-short-let-nairobi` now leads on "how to
    convince a landlord to allow Airbnb".
  - `sublease-agreement-kenya-operators` now leads on "rent to rent
    agreement", which is the document it was already about.

### Added

- `airbnb-without-owning-property-kenya` — the four routes into
  short-let income without buying a unit, ranked by capital required,
  and honest that co-hosting rather than arbitrage is the realistic
  start. Targets the 81-variant cluster the site had no page for,
  including the one Kenya-qualified query in the whole harvest.
- `how-to-find-rental-arbitrage-properties-nairobi` — sourcing, which
  the cluster covered nowhere. Why an owner-listed unit beats ten
  agent-listed ones, vacancy as a negotiating position, and the
  building-level filters that rule a unit out before a viewing.
- Both converge on `/airbnb-arbitrage-management` and `/refer` rather
  than `/list-your-property`, because this is operator intent rather
  than landlord intent and the funnel is different.

## [1.26.1] - 2026-09-09

### Fixed

- The three articles added in 1.26.0 shipped with no inbound internal
  links, so they were reachable only from the paginated Insights index
  and the sitemap. That is the same orphan condition that leaves 30
  other indexable articles at the back of the crawl queue, and it would
  have applied to the three pages most likely to convert. Added
  contextual links from `cost-of-property-management-kenya-2026`,
  `choosing-airbnb-management-company-nairobi`,
  `airbnb-nairobi-complete-host-guide-2026` and
  `diaspora-airbnb-nairobi-remote-owner-playbook`, which takes each of
  the three to four or five inbound links, above the catalogue median of
  three.

## [1.26.0] - 2026-09-09

### Added

- Three articles covering how owners actually search for a manager. A
  harvest of Google's autocomplete for Kenya returned 73 owner-intent
  queries, and the two largest clusters had no page on the site at all:
  fifteen variants of "someone to manage my airbnb" and eleven of "find
  a co-host". A grep of every marketing page returned zero files
  containing "someone to manage", "manage my airbnb" or "airbnb
  manager", and three containing "co-host". The catalogue had 40
  articles teaching an owner to host well and none addressed to the
  owner who has decided to stop.
  - `airbnb-co-host-nairobi-what-they-do` — what the role covers, how a
    co-host payout split works, and why the listing staying on your own
    account is the difference between keeping a review history and
    starting again.
  - `someone-to-manage-my-airbnb-nairobi` — the handover: what to hand
    over, what to keep, what to agree in writing, and the four weeks
    that decide whether it worked.
  - `how-much-do-airbnb-managers-charge-kenya` — the fee basis rather
    than the headline rate, worked through with the arithmetic shown,
    since 20% of gross booking value and 20% after commission and
    cleaning differ by more than a 15% and a 20% quote do.
- A call to action in each of the three, as a `Callout` with links to
  `/list-your-property` and `/airbnb-management`. Article pages carry no
  standing CTA, so a reader who finished one had nowhere to go.

## [1.25.0] - 2026-09-09

Two findings from a technical and content audit of the site, one of
them a regression introduced earlier today.

### Fixed
- **The sitemap's real dates went too far back.** 1.24.1 replaced a
  fake "everything changed today" `lastmod` with each article's own
  publication date. But 150 of the 361 articles are backdated to 2024
  and 2025, and the first commit in this repository is 2026-04-21 —
  the catalogue was given a publication history it did not have.

  Published as `lastmod`, that was worse than the value it replaced.
  Telling Google a URL last changed in July 2024, earlier than it
  could possibly have first seen that URL, says there is no reason to
  recrawl — on the very articles that are not yet indexed and that we
  most want fetched. 227 of the 319 dates shipped were in this state.
  Dates are now floored at the date the site began to exist; the ~90
  articles genuinely written since April keep their own.

- **Every page that was not a city page linked to a redirect and a
  noindexed page.** The navbar renders a Nairobi/Accra city picker
  whenever no city context is resolved. On the client that is
  momentary, but on the server it is every path not starting with
  `/nairobi` or `/accra` — so the first HTML Googlebot sees for all
  361 articles, `/pricing`, `/long-term-management` and the rest.

  That was two links to `/accra`, which has carried a noindex since
  1.23.0, and two to `/nairobi`, which 301s to the root on `.co.ke`.
  Four wasted links on roughly 370 pages. The picker now appears only
  when more than one market is launched, since otherwise there is no
  city to pick.

### Notes
- The backdated `publishedAt` values themselves are untouched. They
  are visible in bylines and in `datePublished`, and whether to keep a
  publication history the domain cannot support is an editorial call,
  not a technical one.

## [1.24.2] - 2026-09-09

### Changed
- The short-stay service was named "Airbnb & short-stay management"
  everywhere, which does not contain the phrase "Airbnb management" —
  the words are split by "& short-stay". Reordered to "Airbnb
  management & short-stay" so the phrase people actually search for
  survives intact.

  Fifteen places, and the ones that matter are not the headings: eight
  were the anchor text on article links to `/airbnb-management`, one
  was an `<H2>`, and one was the sitewide footer link. Anchor text is
  how internal links tell Google what the target page is about, so
  those eight were describing the page with a phrase nobody searches.

## [1.24.1] - 2026-09-09

### Fixed
- The sitemap gave every one of its 377 URLs a `lastmod` of the moment
  it was requested, so all of them claimed to have changed today — and
  would claim it again after the next deploy. Google uses `lastmod`
  only where the value is consistently accurate and ignores it
  otherwise, which meant we were throwing away the signal that decides
  what gets recrawled first, on a site whose 327 articles are the
  thing we most want crawled.

  Articles now carry their real `updatedAt ?? publishedAt` date,
  spanning August 2024 to September 2026. The 58 non-article routes
  omit `lastmod` entirely, which the spec allows and which is better
  than inventing one.

## [1.24.0] - 2026-09-09

The second half of scoping the site to Nairobi. 1.23.0 took Accra out
of the sitemap and the index; this takes it out of the copy.

184 of 425 pages said "Nairobi and Accra" somewhere. Individually each
was a footnote. Together they were the site telling Google, 184 times,
that this is a two-city firm — while trying to rank in one city.

The worst of them was the homepage `<h1>`, which read "Premium
property management in Nairobi & Accra." An H1 is the most weighted
phrase on a page and this was the page we most want ranking for
"property management nairobi", spending half of it on a market that
has not opened.

### Added
- `launchedCityPhrase()` and `launchedCities()`, deriving the phrase
  from `site.launchedMarkets` rather than repeating a literal. Used by
  the article author bio, hero eyebrow, footer, OG description and
  image, yield calculator and the service-page fallbacks, so the copy
  follows the flag instead of needing to be found again.

### Changed
- The default H1 and hero eyebrow name Nairobi only.
- The Insights author bio no longer claims two offices, on 88 pages.
- The "Based On The Ground" claim said we are physically present in
  Accra, which was not true. It now names the cities we operate in and
  says what that presence consists of.
- The FAQ answer on tenant arrears — which appears in FAQ schema on
  every page — no longer cites legal partners in Accra.
- Two articles and two diaspora-origin pages had Accra in their prose;
  scoped to Nairobi.
- Transactional email footers (welcome, agreement notify, reminder and
  share) name Nairobi only.

### Fixed
- The homepage H1 was line-broken across two lines in JSX, so it
  survived a single-line search of the other thirty occurrences. The
  test is whitespace-tolerant for exactly this reason.
- `share-email.ts` briefly had `${launchedCityPhrase()}` inside a
  plain quoted string, which would have printed the literal
  interpolation in the plain-text half of a client email. Caught
  before shipping; the build is now checked for leaked interpolations.

## [1.23.0] - 2026-09-09

Accra is built and has not launched, and the site was advertising it
anyway. Nineteen Accra URLs sat in the Kenyan sitemap and the
Organization schema described the firm as operating in "Nairobi and
Accra" — splitting the geographic focus of the entity in exchange for
a city where an enquiry could not be served.

The cause was a reasonable rule applied to the wrong situation.
`marketsServedBy` treated a dark domain as a reason for the other
domain to cover that market, which is right for a launched market
waiting on DNS and wrong for a market that has not opened. Whether a
hostname resolves and whether we trade somewhere are different
questions.

### Added
- `site.launchedMarkets`, the single source of truth for where the
  business actually trades, deliberately separate from
  `site.liveDomains`. With `isLaunchedMarket`, `isUnlaunchedCity` and
  `robotsForCity` reading from it, launching Accra is adding one
  string to one array.
- `src/lib/launched-markets.test.ts`, which fails if an unlaunched
  market reaches any sitemap or becomes indexable, and equally if the
  filter over-reaches and starts suppressing Nairobi.

### Changed
- The Kenyan sitemap drops all nineteen Accra URLs: `/accra`,
  `/accra/buy`, `/accra/areas`, ten `/from/<origin>/accra` pages and
  six Accra articles.
- Those routes and all twelve Ghana-attributed articles now serve
  `noindex, follow`. Nothing is deleted and nothing stops rendering —
  `follow` is kept so their links still reach the service pages.
- The Organization schema description names Nairobi only, and now
  states the operational work rather than a second city: finding and
  vetting tenants, collecting rent, maintenance and cleaning, monthly
  USD remittance.

### Notes
- Existing sitemap tests asserted the old behaviour and were inverted
  rather than deleted, each with a note on why, so the reasoning
  survives and re-launching Ghana restores the original expectations.
- `goldstay.com` now serves no market from the sitemap's point of
  view. Kenya is served only from its own live domain, and Ghana is
  unlaunched. Harmless, since that domain is a parked lander we do not
  own.

## [1.22.1] - 2026-09-09

### Added
- The Nairobi office schema now carries `hasMap`, pointing at the
  Google Maps place for the same address. Google previously had to
  join our address string to that place by inference; now it is
  stated.

### Notes
- The place ID is recorded in `site.ts` but deliberately kept out of
  `sameAs`. A place existing on Maps is not the same as a Business
  Profile claimed and verified by us: Google generates unclaimed
  listings on its own, and an unclaimed listing cannot be
  categorised, cannot properly gather reviews and does not compete in
  the local pack. `hasMap` says "here is a map of this address", which
  is true either way. `sameAs` asserts identity and has to wait for
  confirmation that the profile is verified and ours — at which point
  it is a one-line change.

## [1.22.0] - 2026-09-09

Re-ran the query harvest against Google's Kenyan autocomplete across
thirty management-intent seeds. The two heaviest queries in this
market — "property management companies in kenya" and "property
management companies in nairobi", together 41% of all the volume that
surfaced — could not be ranked for at all, because the plural appeared
nowhere on the site. "Property management company" occurred 26 times;
"property management companies" zero.

The singular seeds in `scripts/harvest-queries.mjs` had never
surfaced them. Google does not bridge the singular to the plural, and
the intent genuinely differs: the singular is somebody who wants the
service, the plural is somebody drawing up a shortlist and comparing.
The site sold the service well and said nothing to a person still
choosing.

### Added
- `/property-management-companies-nairobi`, written for the comparison
  stage rather than the buying stage: the fee models and why a quote
  of 8% can cost more than one of 10%, the full remit of a letting or
  managing agent, eight questions to ask every firm, and a section
  saying plainly when self-management is the better choice and where
  Goldstay is the wrong answer. Linked from the footer and from the
  pricing page's comparison section, so it is not an orphan.
- Seeds for the plural and for the self-management decision in
  `scripts/harvest-queries.mjs`, with a note on why the singular
  missed them, so the gap cannot silently return.

### Changed
- The long-term management summary now names the service the way
  landlords do — what a letting agent, managing agent or property
  management company does — rather than only in our own words.
- The pricing FAQ asks what a reasonable management fee is *in Kenya*,
  which is how the question is actually typed.

### Notes
- Deliberately not covered: the "house agents" and "rental agents"
  clusters, which read as tenant-side ("house agents in nairobi for
  rent", "house hunting agents"). Chasing them would repeat the
  mistake 1.21.0 corrected.
- Blocked: Estate Agents Registration Board licensing content, and
  the "estate agents scale of fees" query. Cap 533 covers management,
  so these are fair questions for a landlord to ask — but publishing
  them before our own registration status is confirmed would invite
  the question back with no answer ready.

## [1.21.1] - 2026-09-09

### Changed
- The Airbnb management hero no longer quotes the fee, and names the
  service the way people search for it instead. "Short-term rental
  management" appeared nowhere on the site — not on one service page —
  despite being the commonest unbranded name for what we sell, so
  anyone searching for it rather than for Airbnb by name could not
  find us. It now appears in the hero, in the answer-first summary
  that defines the service alongside its other names, and in the
  neighbourhood short-let heroes.
- Dropping the fee from that hero costs no transparency: the page
  still states 20% of revenue ten times, including the pricing panel,
  the FAQ and the meta description, where leading with the number is
  a deliberate choice against competitors who hide theirs.

## [1.21.0] - 2026-09-09

Asked to describe this business, a search engine read the site and
answered: "a Nairobi-based property research and insights firm... they
do not appear to function as a property management company that
handles day-to-day operations like tenant placement or rent
collection."

That was a fair reading of what we had published. Every service page
said "premium property management" and none of them said we are the
ones who chase the rent, meet the plumber and inspect the flat. The
operational work a landlord is actually buying appeared only inside
prose, never declared.

### Added
- A "what we do with your property, every month" section on the city
  pages, which is what the `.co.ke` root serves. Six plain statements
  in the verbs a landlord uses: we find and vet the tenant, collect
  the rent, pursue arrears, inspect the property, handle maintenance
  and cleaning, and account for every shilling.
- `knowsAbout` on the business schema, naming twenty-one things this
  firm does — rent collection, tenant placement, arrears recovery,
  inspections, cleaning, deposit handling, service charge
  administration and the rest. Nothing previously declared any of it.
- `hasOfferCatalog` under both management services, itemising the
  fourteen operations included in long-term management and the ten in
  short-stay. They are a catalogue rather than separate offers because
  they are included in the fee, not sold individually.
- `noindex` on `PostMeta`, with the post route emitting
  `noindex, follow` and the sitemap filtering on it.

### Changed
- Thirty articles are out of the index: ten bank mortgage reviews,
  five on lending mechanics, five written for tenants rather than
  landlords, three on REITs and crypto, and seven off-topic or
  traffic-bait pieces. A reader comparing Absa against KCB is shopping
  for a mortgage, not for a managing agent, and ten such articles in
  the catalogue were a large part of why the site read as a
  publication. They are noindexed rather than deleted — the pages
  still serve whoever lands on one, and `follow` is kept so their
  links still carry to the service pages.

## [1.20.1] - 2026-09-09

### Fixed
- The footer linked every area in the cities map, which was correct
  until 1.16.0 gave the areas without a profile a 301 to the areas
  comparison page. Since the footer renders on all 424 pages, that
  left roughly 850 sitewide links pointing at redirects — a crawler
  being sent to `/nairobi/parklands` from every page on the site and
  told each time that the page is really somewhere else. The footer,
  the city pages and `/long-term-management` now link only the areas
  that serve a 200, and offer an "All areas" link for the rest.
- `/accra/areas` had no inbound internal link anywhere on the site, so
  it was reachable only from the sitemap. The city page now links it.

## [1.20.0] - 2026-09-09

Completes the area coverage started in 1.19.0. Gigiri is where the UN
and the missions house their staff and carries the highest rents in
Nairobi; Lavington has the broadest tenant base of any premium area.
Both were redirecting to `/nairobi/areas`.

### Added
- Area pages for Gigiri and Lavington. Gigiri's covers the residential
  security standards that UN and embassy tenants have to house within,
  which are assessed property by property and quietly decide whether a
  house can reach that demand at all — the thing landlords there tend
  to learn after buying. Lavington's covers how wide a span the name
  actually describes, and the governance risk in the gated townhouse
  courts that make up most of its good stock, where a couple of owners
  in arrears stops the borehole being serviced.
- Nine Nairobi areas now have pages, carrying 6,254 words of profile
  prose written to be specific to each. Worst-pair overlap is 0.22%,
  and only Parklands and Rosslyn still consolidate.

### Changed
- Gigiri quotes its rent band as apartments and compound cottages
  rather than plain 2-bed apartments, since its stock leans to larger
  family housing. Lavington keeps the apartment framing, which is
  accurate there.

1.16.0 consolidated eight Nairobi area pages into `/nairobi/areas`
because they were 88% boilerplate, which was the right call for the
areas that had nothing specific to say and the wrong outcome for the
ones that did. Karen and Runda are where diaspora landlords buy, and
they had no page at all. Kileleshwa and Brookside had short-let pages
but no parent.

### Added
- Area pages for Kileleshwa, Brookside, Karen and Runda, each written
  to the same rule as Westlands, Kilimani and Riverside: it gets a URL
  only if there is something true about letting there that no other
  area page could claim. Kileleshwa covers the densification of a
  bungalow suburb and the water and drainage that came with it;
  Brookside the relocation-agent channel that actually places its
  tenants, and the boundary that lets Westlands stock be marketed
  under its name; Karen the school-admissions calendar that its
  letting season really is, and the standing cost of running a
  compound; Runda the Association levy and approvals, and the
  concentration risk of an estate that lets almost entirely to one
  employer base. Seven areas now have pages, with worst-pair text
  overlap of 0.07% against the 73% the consolidated pages carried.

### Changed
- Karen and Runda quote their rent band as cottages and guest wings,
  and as apartments on the estate fringes, rather than as "2-bed
  apartments" — those two suburbs have almost no apartment stock, so
  the old wording contradicted the profile further down the page.
- `/nairobi/kileleshwa`, `/brookside`, `/karen` and `/runda` serve a
  page again instead of redirecting to `/nairobi/areas`. Gigiri,
  Lavington, Parklands and Rosslyn still redirect; they keep their
  `/airbnb-management` pages, which were never the problem.

## [1.18.0] - 2026-09-09

1.17.0 added the "how did you find us" question to
`/list-your-property`, which turns out to be the form Goldstay's leads
mostly do not use. The one-to-two enquiries a week arrive on WhatsApp,
and the two surfaces that serve them had no such question.

### Added
- `/start` — the intake link ops paste into a WhatsApp thread — now
  asks how the landlord found us, and what they searched for when the
  answer is Google. This is the one that matters: for a WhatsApp lead
  the browser fields are worthless, because the landlord arrived by
  tapping a link in a chat, so the referrer reads as WhatsApp and the
  landing page as `/start`. What they type is all there is.
- `/admin/leads/new` now has the same two fields, so an enquiry taken
  on a phone call can carry the answer. The channel is derived from
  what the landlord said rather than measured, which is the honest
  label for somebody's recollection. Answers that happened offline —
  "saw a Goldstay property" — record no channel rather than being
  forced into a bucket.

### Note
- Both mechanisms for logging an off-platform enquiry already existed
  before this release: `/admin/leads/new` and the intake-link button
  on `/admin/leads`, which have been on that page and unused. One lead
  has been logged since May against a real volume of roughly one to
  two a week, so the gap is habit rather than tooling. Of the two, the
  intake link is the one that needs no discipline: paste it into the
  chat and the landlord fills it in themselves.

## [1.17.0] - 2026-09-09

Prompted by a question that could not be answered: two clients had said
they found Goldstay at the top of Google when looking for property
management, and there was no way to learn what either of them had
searched for. Search Console had been created that week and does not
backfill queries from before verification, Analytics had never been
switched on, the form recorded nothing about origin, and the `Lead`
table held one row. The customers themselves were the last surviving
copy of the answer and had to be asked by hand.

### Added
- The enquiry form now asks "How did you find us?", and adds a second
  question — "What did you search for?" — when the answer is Google.
  This is the only way an organic search term can ever be recorded:
  Google has stripped the query from its referrer since 2011, so no
  amount of tracking recovers it and asking is the whole mechanism.
  Both are optional and neither blocks submitting.
- Every enquiry now records the page the visit started on, the
  referring site and any `utm_*` tags, captured on first touch. First
  touch rather than last matters here: a landlord who arrives on an
  article, reads three more pages and then opens the form is credited
  to the article, where last-touch attribution would credit
  `/list-your-property` and our own site, which is the useless answer
  we already had.
- The new-lead email to ops leads with a plain-language line — what
  they said, what they searched for, where they landed — so the person
  ringing back within the two-hour window sees it without opening the
  admin portal. `/admin/leads/[id]` shows the full breakdown, with the
  typed search phrase highlighted because it is the most valuable
  field on the record.

### Note
- Leads from before this release have none of these fields, and the
  block is hidden rather than shown as empty. Manual logs and outbound
  scrapes have no browser behind them, so absent stays a normal state.
- WhatsApp and phone enquiries still bypass the platform entirely and
  remain unattributed. The prefilled WhatsApp message has carried its
  origin page since 1.15.x, but nothing writes those conversations to
  a `Lead` row, so the one-to-two enquiries a week arriving that way
  are still invisible here.

## [1.16.1] - 2026-09-09

### Changed
- The `/airbnb-management` search snippet no longer closes on "20% of revenue".
  On the results page for "nairobi airbnb management" that number sat directly
  beneath a competitor's snippet quoting 18%, so a landlord comparing the two
  saw us as the dearer option before reading a word about why. The rest of the
  description was the same five services every competitor on that page claims.
  It now leads with USD remittance, which none of them offer, and states the
  fee alongside what it excludes — no setup fee, no exit fee, and no charge in
  a month without bookings — which is the comparison worth making. Simpl's 18%
  is levied on booking revenue net of the platform's own cut and carries a
  USD 195 onboarding fee, so the headline gap is smaller than it appears.

## [1.16.0] - 2026-09-09

Bumped MINOR rather than MAJOR despite retiring thirteen routes. The rule in
AGENTS.md lists "a removed route" under MAJOR, but the clause governing it is
"breaks a contract something outside this repo depends on", and every retired
URL now returns a permanent redirect to the page holding its content. No link
breaks. Recording the reasoning so a future reader can disagree with it rather
than assume it was an oversight.

### Fixed
- The Nairobi and Accra neighbourhood pages were near-duplicates of each
  other and had almost certainly been collapsed by Google, which is why they
  never ranked for the area terms they were built for. Measured across eight
  of them, 88% of every page was text shared with its siblings — about 120
  unique words in 1,000 — because the only things that varied inside a fixed
  template were the area name, a rent band and a tenant label. The word
  counts told the story on their own: 1001, 1001, 999, 1005, 1005, 1001,
  1003, 986.

  The largest single contributor was the FAQ. It was city-level, so the same
  373 words and the same `FAQPage` schema appeared on all eleven Nairobi
  pages. Areas now answer their own questions, which turns the block that was
  pure duplication into the part of the page least like its siblings.

  Westlands, Kilimani and Riverside — the three areas we actually manage in —
  now carry real substance: what the place is, who rents there and why, what
  the building stock is like, and what goes wrong for a landlord there,
  including the parts that argue against buying. Measured on the built pages,
  unique content went from 11.8% to 76.8%, and the worst pair of siblings
  from 84.9% similar to 13.2%.

### Added
- `/nairobi/areas` and `/accra/areas`, comparing every area we manage in:
  two-bed rent bands, who rents in each, and where nightly letting earns more
  than a lease. The per-area rent and tenant data was always the good part of
  the old pages; collected in one table it becomes something none of them was
  individually, and it targets the question the old pages could not win
  because they were competing with each other — someone deciding which part
  of the city to buy in wants the areas side by side.
- A test that holds the publication rule together: an area gets a URL only if
  it has enough area-specific substance to say something its siblings cannot.
  It checks the redirect list in `next.config.mjs` against the data, refuses
  a stub profile, and fails if two profiles are more than 20% similar to each
  other — because writing one by editing another would recreate exactly the
  problem this release fixes.

### Changed
- Eight Nairobi areas and all five Accra ones no longer have a page of their
  own and redirect to their city's comparison page. Redirected there rather
  than to the city homepage on purpose: a thin page pointed at a homepage
  reads as a soft 404, whereas pointed at the table containing its actual
  content it is the same information in a better place. Accra had no
  properties behind any of its five, so a deep page would have been
  invention; they can return individually when there is something true to say.
- The nine `/nairobi/<area>/airbnb-management` pages are untouched. They
  measured 40% unique and only 1% overlap with their own parents, so they
  were never the problem, and they survive their parents being retired.
- The sitemap and the sibling links between area pages now list only URLs
  that serve a 200. Both previously enumerated every area in the city, so
  without this the thirteen consolidated URLs would have stayed in the
  sitemap indefinitely — telling Google a page exists in one breath and that
  it does not in the next.

## [1.15.0] - 2026-09-09

### Added
- An operator side to the referral programme, at `/admin/referrals`. The
  programme has had a public page, a working signup form, an attribution
  cookie and a per-referrer dashboard for months, but nothing at Goldstay
  could see any of it — an agent could sign up, introduce a landlord and
  watch their dashboard while nobody here knew they existed. Zero people had
  signed up. The list shows every referrer with what they have introduced and
  what they are owed, and each referrer's page drives their referrals through
  the pipeline.
- A payouts-due queue at `/admin/referrals/due`, listing every commission
  past its date across all referrers, oldest first. Paying people is a
  monthly sit-down, and hunting through individual profiles for which of a
  year's scheduled rows have come due is how an agent ends up unpaid and
  telling other agents about it.
- Marking a referral signed now generates its commission schedule from a form
  that shows what the schedule will be before writing it, and records an
  M-PESA or transfer reference against each payment. "Paid" without a
  reference is an unevidenced assertion, which is no use when an agent says
  the money never arrived.
- A link to the referral programme in the site footer. It was reachable only
  by someone who already knew the URL, which is the same problem the `/from`
  cluster had.

### Changed
- The referral programme's page title now leads with what an agent would
  actually search for rather than with our brand. "Earn with Goldstay:
  Referral Programme" describes the page accurately and matches nothing
  anybody types.
- Referral permissions are split three ways: reading, managing referrers, and
  declaring a commission paid. Operations can move a referral along but not
  record it as settled, and accounting can settle a schedule it did not
  create. A single careless login can no longer both invent a commission and
  pay it.
- A referral can now be linked to the client it became. Whether the client
  signing today is the landlord an agent introduced three months ago was
  previously a judgement someone made from memory each time it came up, and
  that judgement decides who receives a year of commission.

### Fixed
- Terminating a referrer now actually cancels their unpaid commissions, in
  the same transaction as the status change, which is what the schema has
  always said termination means. A referrer could previously be terminated
  while payouts stayed scheduled against them.
- The sign-off form will no longer let a shilling rent be entered as a dollar
  one. Commission is denominated in USD while leases are recorded in KES and
  nothing in the codebase converts between them, so a KES figure copied
  across would have paid an agent around a hundred and thirty times what they
  earned, every month for a year, with their dashboard showing the inflated
  total as fact. A non-USD lease is now shown as context to convert from,
  never prefilled, and rents above $100,000 a month are refused outright.

## [1.14.0] - 2026-09-07

### Added
- A client can now copy other people on their monthly statement. Co-ownership
  turns out to be common — two sisters running one unit, a couple where only
  one of them signed, an owner whose accountant does the reconciling — and
  until now only whoever held the account ever saw the numbers, so the
  statement was being forwarded by hand every month or not at all.

  Up to five addresses per client, added either by the client under Account in
  their portal or by an operator on the client's admin page. Each one gets the
  monthly statement and its PDF, as a CC rather than a BCC so everybody can
  see who is on it. Both screens show whether the copies are actually
  arriving, which is the only question anyone asks once it is set up.

  The people added get an email explaining who added them, what they will
  receive, that they have no Goldstay account, and how to stop it without
  asking the client first. That last link is a one-click opt-out the client
  cannot overrule, since consent to receive somebody's financial documents
  belongs to the person receiving them.

  Deliberately not built as "a second email address on the account", which is
  the obvious shape and is unsafe. Three of the four emails a client receives
  carry a sign-in link that signs the clicker in *as the client*, with the
  accept button on a management agreement, and a second address on the
  account row would have been indistinguishable from the first at every send
  site — so the first email to copy it would have handed a co-owner the whole
  portal and the ability to execute a contract in their sibling's name.
  Observers are a separate table receiving exactly one thing: the statement,
  which is the only client email with no credential in it.

  A test enforces that structurally rather than by convention. No module that
  mints a sign-in link may import the code that resolves observer addresses,
  so wiring an observer into a credential-bearing email fails the suite
  instead of shipping.

### Changed
- The statement email now names anyone copied on it, in a line after the
  sign-off, so a landlord can see who is reading their income without going
  to look and a co-owner knows why it arrived. Statements for clients who
  copy nobody are unchanged.

## [1.13.1] - 2026-09-07

### Fixed
- Stopped telling Google that the Goldstay organisation is also a LinkedIn
  person. The `sameAs` array on the `RealEstateAgent` node, which is how
  search engines resolve scattered mentions of a business into one entity,
  included a LinkedIn `/in/` URL. That is a personal profile rather than a
  Company Page, so every page on the site was asserting an identity between
  the company and an individual, which undermines the entity the rest of the
  schema exists to sharpen. Same class of error as the article bylines before
  v1.9.1, where 324 posts declared the editorial desks were human beings.

  The footer link is unchanged, because a link a human clicks and a
  machine-readable claim about who we are do not have to meet the same bar.
  The two lists are now separate in `src/lib/site.ts` for that reason, with a
  test covering the distinction so the natural mistake, adding a handle and
  wiring it straight into `sameAs`, fails rather than ships.

## [1.13.0] - 2026-09-07

### Added
- A service page and five articles for short-let operators, meaning people who
  lease a unit and re-let it on nightly stays rather than owning it. Four of
  the five short-let properties on the platform are held by authorised
  leaseholders, so operators are the largest single segment of the short-stay
  book and the site addressed them nowhere: `/airbnb-management` says "your
  property" and "your title" throughout, which is the wrong second person for
  somebody whose entire question is what they are allowed to do with a unit
  they rent.

  `/airbnb-arbitrage-management` is the commercial page, and the articles cover
  the questions a Kenya-targeted autocomplete harvest found people actually
  asking: whether you need the landlord's permission to sublet, whether Airbnb
  arbitrage is legal in Kenya, how to ask a landlord for permission (with a
  letter to adapt), whether a landlord can refuse, and what an operator's
  head lease and consent have to contain.

  The harvest also corrected the vocabulary we would otherwise have written
  to. "Rent-to-rent" is a British term that barely registers in Kenya; the
  local framing is "airbnb business in kenya" and "without owning property",
  and the largest cluster by volume is the consent problem rather than
  anything about nightly rates or returns.

  Every piece takes the line the management agreement already takes: the model
  is legitimate, and the owner's written consent is not optional. That is
  stated as a condition of us managing a unit rather than as a disclaimer,
  which is what makes the cluster publishable while half the long-term book is
  landlords.

### Changed
- Retargeted the search titles on the two existing articles that were already
  aimed at this reader. Neither had a `metaTitle`, so both inherited an
  editorial headline that spent its width on "the realistic 2026 guide" and
  "the honest 2026 picture" instead of on the words people type.

## [1.12.0] - 2026-09-07

### Added
- Agreements can be shared read-only with someone who is not the client,
  which is what a landlord is asking for when they want their advocate to
  read the contract before they accept it. Issue a share from the agreement
  card on the property page in admin: it emails a link that renders the same
  contract, from the same stored template, with no accept button and no route
  into the rest of the account. Links last 30 days, record when they were
  opened, and can be withdrawn at any time — by us from the same card, or by
  the client themselves from a "Shared with" panel on their own agreement
  page. The client is copied on the share email, so a share they did not ask
  for cannot happen quietly.

  This is deliberately not a second email address on the account, which is
  how the request usually arrives. It cannot be, because the "your agreement
  is ready" email carries a Supabase magic link minted for the client's
  address, so anyone who receives that email and clicks it gets a full signed-
  in session as the client: every statement, payout method and document, plus
  the accept button. Acceptance is session-based on purpose — the record is
  built from the session rather than a typed name precisely so it evidences
  who accepted — so a third party accepting through the client's session
  would produce a contract record asserting the client had accepted it
  personally. A share is a separate and much weaker credential: one document,
  read-only, expiring, revocable.

  Available on unsigned agreements, since reviewing a contract before signing
  it is the only case anyone actually asks for.

## [1.11.2] - 2026-09-07

### Changed
- Lint and typecheck moved out of the deploy and into CI. `next build` ran
  both on every deploy, which cost 38 seconds of a 158 second build to
  re-check what the person pushing had already run locally, and it held the
  deploy up while doing it. They now run in `.github/workflows/ci.yml` in
  parallel with the deploy instead of in front of it. A cold local build went
  from 69 seconds to 38.

  The trade is that verification no longer blocks the deploy, so a push with
  a type error will deploy and then go red in CI about a minute later. That is
  acceptable here specifically because Next compiles with SWC, which strips
  types without checking them, so a type error never changed the output. It
  only meant nobody had checked. The failures that do produce broken output
  are a failure to compile or to prerender, and the build still does both and
  still fails the deploy when either breaks.

  To undo it: delete the `eslint` and `typescript` blocks in
  `next.config.mjs`.

- The CI workflow is no longer dormant. It was gated behind a `CI_ENABLED`
  repo variable that was never set, on the reasoning that Vercel ran the same
  checks anyway. That reasoning stops holding the moment the build skips them,
  so the gate is gone and the workflow runs on every push and pull request. It
  runs lint, typecheck and the full suite, which includes the insights link
  checker and the snippet width checker via `catalogue.test.ts`. It no longer
  runs a build, because Vercel does that.

## [1.11.1] - 2026-09-07

### Fixed
- Deploys were spending time on Sentry source maps that were thrown away.
  The webpack plugin generates a map for every client chunk and rewrites the
  bundle with release metadata on every build, and it does that whether or not
  the upload can happen. Here it could not: Vercel has no `SENTRY_DSN` and no
  `NEXT_PUBLIC_SENTRY_DSN`, so `Sentry.init()` in all three runtime configs is
  gated off and never runs, and with no `SENTRY_AUTH_TOKEN` the maps were
  built and discarded. On a cold local build that measured 16 seconds of 69.

  The wrapper is now conditional on a DSN being present, so setting one turns
  the SDK back on and adding a token turns source map upload back on, neither
  of which needs this file touched. `widenClientFileUpload`, the expensive
  half, is now tied to there actually being a token to upload with.

  Nothing was removed from the Sentry setup and the runtime configs are
  unchanged, so `global-error.tsx` still calls `captureException` and still
  no-ops exactly as it did before. Two side effects worth knowing: the edge
  middleware bundle drops from 146 kB to 80 kB because Sentry is no longer
  instrumenting it, and the `/monitoring` tunnel route is not emitted while
  Sentry is off. Nothing in the app referenced that route.

### Changed
- Nothing user-facing. This is a build-time change only.

### Added
- Six articles on tenancy and lease agreements, written for the landlord
  rather than the occupant: what a tenancy agreement must contain, lease
  versus licence, the residential lease clause by clause, when a lease has to
  be registered, ending a tenancy lawfully, and the commercial tenancy trap
  that catches a landlord who lets a ground floor unit to a shop.

  These come out of the first Search Console data the site has produced. Of
  the 28 queries it surfaced for, not one was about property management:
  the impressions were on mortgages, land buying, auctions, and neighbourhood
  questions like "is buruburu in embakasi". Both of the two clicks were on
  landlord and tenant statute queries, which is the only vein in the export
  that touches the person who actually pays us.

  Cross-referencing that against Google autocomplete for Kenya found tenancy
  and lease agreements to be the deepest query cluster on the landlord side
  with no page on this site aimed at it, completing into sample, template,
  pdf, form and "kenya law" against every phrasing. It is also unusually well
  qualified, because nobody drafting a lease is a tenant.

  Each of the six carries a contextual link into `/long-term-management`
  rather than only to other articles, which is the part the existing 350 get
  wrong: they hold the internal link equity and the service pages do not.

### Changed
- Nothing. The six articles are additions and no existing page changed.

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

[Unreleased]: https://github.com/tasiamah/goldstay/compare/v1.40.0...HEAD
[1.40.0]: https://github.com/tasiamah/goldstay/compare/v1.39.1...v1.40.0
[1.39.1]: https://github.com/tasiamah/goldstay/compare/v1.39.0...v1.39.1
[1.39.0]: https://github.com/tasiamah/goldstay/compare/v1.38.1...v1.39.0
[1.38.1]: https://github.com/tasiamah/goldstay/compare/v1.38.0...v1.38.1
[1.38.0]: https://github.com/tasiamah/goldstay/compare/v1.37.0...v1.38.0
[1.37.0]: https://github.com/tasiamah/goldstay/compare/v1.36.0...v1.37.0
[1.36.0]: https://github.com/tasiamah/goldstay/compare/v1.35.0...v1.36.0
[1.35.0]: https://github.com/tasiamah/goldstay/compare/v1.34.0...v1.35.0
[1.34.0]: https://github.com/tasiamah/goldstay/compare/v1.33.0...v1.34.0
[1.33.0]: https://github.com/tasiamah/goldstay/compare/v1.32.1...v1.33.0
[1.32.1]: https://github.com/tasiamah/goldstay/compare/v1.32.0...v1.32.1
[1.32.0]: https://github.com/tasiamah/goldstay/compare/v1.31.0...v1.32.0
[1.31.0]: https://github.com/tasiamah/goldstay/compare/v1.30.0...v1.31.0
[1.30.0]: https://github.com/tasiamah/goldstay/compare/v1.29.0...v1.30.0
[1.29.0]: https://github.com/tasiamah/goldstay/compare/v1.28.0...v1.29.0
[1.28.0]: https://github.com/tasiamah/goldstay/compare/v1.27.1...v1.28.0
[1.27.1]: https://github.com/tasiamah/goldstay/compare/v1.27.0...v1.27.1
[1.27.0]: https://github.com/tasiamah/goldstay/compare/v1.26.1...v1.27.0
[1.26.1]: https://github.com/tasiamah/goldstay/compare/v1.26.0...v1.26.1
[1.26.0]: https://github.com/tasiamah/goldstay/compare/v1.25.0...v1.26.0
[1.25.0]: https://github.com/tasiamah/goldstay/compare/v1.24.2...v1.25.0
[1.24.2]: https://github.com/tasiamah/goldstay/compare/v1.24.1...v1.24.2
[1.24.1]: https://github.com/tasiamah/goldstay/compare/v1.24.0...v1.24.1
[1.24.0]: https://github.com/tasiamah/goldstay/compare/v1.23.0...v1.24.0
[1.23.0]: https://github.com/tasiamah/goldstay/compare/v1.22.1...v1.23.0
[1.22.1]: https://github.com/tasiamah/goldstay/compare/v1.22.0...v1.22.1
[1.22.0]: https://github.com/tasiamah/goldstay/compare/v1.21.1...v1.22.0
[1.21.1]: https://github.com/tasiamah/goldstay/compare/v1.21.0...v1.21.1
[1.21.0]: https://github.com/tasiamah/goldstay/compare/v1.20.1...v1.21.0
[1.20.1]: https://github.com/tasiamah/goldstay/compare/v1.20.0...v1.20.1
[1.20.0]: https://github.com/tasiamah/goldstay/compare/v1.19.0...v1.20.0
[1.19.0]: https://github.com/tasiamah/goldstay/compare/v1.18.0...v1.19.0
[1.18.0]: https://github.com/tasiamah/goldstay/compare/v1.17.0...v1.18.0
[1.17.0]: https://github.com/tasiamah/goldstay/compare/v1.16.1...v1.17.0
[1.16.1]: https://github.com/tasiamah/goldstay/compare/v1.16.0...v1.16.1
[1.16.0]: https://github.com/tasiamah/goldstay/compare/v1.15.0...v1.16.0
[1.15.0]: https://github.com/tasiamah/goldstay/compare/v1.14.0...v1.15.0
[1.14.0]: https://github.com/tasiamah/goldstay/compare/v1.13.1...v1.14.0
[1.13.1]: https://github.com/tasiamah/goldstay/compare/v1.13.0...v1.13.1
[1.13.0]: https://github.com/tasiamah/goldstay/compare/v1.12.0...v1.13.0
[1.12.0]: https://github.com/tasiamah/goldstay/compare/v1.11.2...v1.12.0
[1.11.2]: https://github.com/tasiamah/goldstay/compare/v1.11.1...v1.11.2
[1.11.1]: https://github.com/tasiamah/goldstay/compare/v1.11.0...v1.11.1
[1.11.0]: https://github.com/tasiamah/goldstay/compare/v1.10.0...v1.11.0
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
