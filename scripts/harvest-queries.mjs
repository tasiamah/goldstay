#!/usr/bin/env node
// Harvests real search queries from Google's autocomplete endpoint,
// geo-targeted to Kenya.
//
// Why this exists. Every keyword list on this project so far has been
// somebody's judgement about what landlords "probably" type, including
// mine. Autocomplete is not volume data, but it is not a guess either:
// Google only suggests strings that enough people actually searched,
// and with gl=ke it suggests what people in Kenya searched. That makes
// it the closest thing to ground truth available without a paid tool,
// and it has already overturned one assumption we were working from
// (see the JOB_NOISE note below).
//
// It is deliberately a script rather than a one-off, because the answer
// changes: "co-host" was not a Kenyan term five years ago and the
// compliance vocabulary shifted when enforcement did. Re-run it.
//
//   node scripts/harvest-queries.mjs            # grouped report
//   node scripts/harvest-queries.mjs --json     # machine-readable
//
// Nothing here touches the build or the test suite. It hits a public
// Google endpoint, so it is rate-limited on purpose and should not be
// run in CI.

const SEEDS = [
  // Long-term management
  "property management nairobi",
  "property management kenya",
  "manage my rental property nairobi",
  "rent collection kenya",
  "letting agent nairobi",
  // Short-stay
  "airbnb management nairobi",
  "airbnb management kenya",
  "airbnb co host nairobi",
  "manage my airbnb kenya",
  "short term rental management nairobi",
  "furnished apartment management nairobi",
  // Tenant finding
  "tenant finding nairobi",
  "find tenant for my house kenya",
  "tenant vetting kenya",
  // Property sourcing (buyers)
  "buy property in kenya from abroad",
  "property sourcing kenya",
  // Diaspora
  "manage property in kenya from abroad",
  "diaspora landlord kenya",
  // Fees and switching
  "property management fees kenya",
  "change property manager kenya",
];

// Alphabet soup plus the modifiers that actually change intent. Google
// returns different suggestions for a trailing space than for a
// trailing letter, so both are worth asking for.
const SUFFIXES = [
  "",
  " ",
  ...("abcdefghijklmnopqrstuvwxyz".split("").map((c) => ` ${c}`)),
];
const PREFIXES = ["", "how to ", "what is ", "best ", "who ", "cheap "];

// Queries that look like our market but are not our buyer.
//
// The single most useful thing this harvest surfaced: in Kenya,
// "property manager" autocompletes overwhelmingly to "property manager
// jobs", "property manager salary", "property manager job description".
// The dominant intent behind that phrase is someone looking for
// employment, not a landlord looking for a service. Targeting it means
// competing for a SERP full of job boards and winning traffic that can
// never convert. Worth knowing before writing a page for it.
const JOB_NOISE =
  /\b(jobs?|salary|salaries|vacanc|cv|resume|interview|job description|duties|responsibilities|qualifications|course|training|certificate|diploma|internship|hiring|recruit)\b/i;

// Tenant-side and guest-side intent. Real searches, wrong person: we
// are not letting units to tenants or rooms to guests through this
// site, so a page built for these converts nothing.
const WRONG_SIDE =
  /\b(to let|for rent|houses? for rent|apartments? for rent|bedsitter|to rent|book|booking|cheap airbnb|airbnbs? in)\b/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function suggest(query) {
  const url =
    "https://suggestqueries.google.com/complete/search" +
    `?client=firefox&gl=ke&hl=en&q=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });
    if (!res.ok) return [];
    const body = await res.json();
    return Array.isArray(body?.[1]) ? body[1] : [];
  } catch {
    return [];
  }
}

async function main() {
  const asJson = process.argv.includes("--json");
  const found = new Map(); // query -> Set of seeds that surfaced it

  const probes = [];
  for (const seed of SEEDS) {
    for (const prefix of PREFIXES) {
      for (const suffix of SUFFIXES) {
        // Only expand the bare seed alphabetically; expanding every
        // prefix by every letter is 3,000 requests for little gain.
        if (prefix !== "" && suffix.trim() !== "") continue;
        probes.push({ seed, q: `${prefix}${seed}${suffix}` });
      }
    }
  }

  if (!asJson) {
    process.stderr.write(
      `Probing ${probes.length} autocomplete variants (gl=ke)...\n`,
    );
  }

  let done = 0;
  for (const { seed, q } of probes) {
    const results = await suggest(q);
    for (const r of results) {
      const key = r.toLowerCase().trim();
      if (!found.has(key)) found.set(key, new Set());
      found.get(key).add(seed);
    }
    done++;
    if (!asJson && done % 50 === 0) {
      process.stderr.write(`  ${done}/${probes.length}\n`);
    }
    await sleep(120);
  }

  const all = [...found.keys()].sort();
  const jobs = all.filter((q) => JOB_NOISE.test(q));
  const wrongSide = all.filter((q) => !JOB_NOISE.test(q) && WRONG_SIDE.test(q));
  const landlord = all.filter(
    (q) => !JOB_NOISE.test(q) && !WRONG_SIDE.test(q),
  );

  if (asJson) {
    process.stdout.write(
      JSON.stringify({ landlord, jobs, wrongSide }, null, 2) + "\n",
    );
    return;
  }

  console.log(`\n=== LANDLORD / OWNER INTENT (${landlord.length}) ===\n`);
  for (const q of landlord) console.log(q);
  console.log(`\n=== JOB-SEEKER NOISE (${jobs.length}) ===\n`);
  for (const q of jobs) console.log(q);
  console.log(`\n=== TENANT / GUEST SIDE (${wrongSide.length}) ===\n`);
  for (const q of wrongSide) console.log(q);
  console.log(
    `\nTotal distinct: ${all.length} (${landlord.length} worth targeting)\n`,
  );
}

main();
