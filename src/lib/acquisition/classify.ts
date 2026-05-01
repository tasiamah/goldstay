// Owner-vs-agent classifier and pain scorer.
//
// Almost every property posted on BuyRentKenya / Property24 / Jiji is
// posted by an *agent*, not the owner. Agents are noise: they don't
// own the asset and they're our competition. We need to keep listings
// where the lister is plausibly the owner of one or two units, not
// the agent of fifty.
//
// We score every listing on two independent 0..100 axes:
//
//   ownerScore — how likely is this lister the owner?
//     listings-by-this-lister == 1 → big positive signal
//     first-person possessives ("my apartment") → positive
//     human display name → positive
//     agency keywords in name / blurb ("Properties Ltd") → big negative
//     blocklisted phone number from the agency directory → forced 0
//
//   painScore — how warm is the outbound for vacancy management?
//     stale listing (45+ days on market) → positive
//     repeat re-listings of the same unit → positive
//     mid-tier asking price (we sign 2–4 BR mid-market best) → small
//
// Pure functions only: no I/O, no env reads, no clock. Tested in
// classify.test.ts; keep the heuristics self-contained so a future
// model swap (or a trained classifier) only touches this file.

import type { ClassifiedListing, ListerType, RawListing } from "./types";

// Phrases that almost always indicate an agency listing. Lowercased;
// match is substring on the lowercased lister name + description.
const AGENCY_KEYWORDS = [
  "ltd",
  "limited",
  "properties",
  "realtors",
  "realty",
  "real estate",
  "agency",
  "agencies",
  "agents",
  "homes ke",
  "homes kenya",
  "consult",
  "letting",
  "lettings",
  "& co",
  "and co",
  "knight frank",
  "hassconsult",
  "hass consult",
  "pam golding",
  "regent",
  "rapid kl",
  "kenyan homes",
  "the agency",
];

// First-person phrasing strongly correlated with the owner posting
// directly rather than an agency staffer.
const OWNER_PHRASES = [
  "my apartment",
  "my house",
  "my villa",
  "my unit",
  "my property",
  "i am renting out",
  "i'm renting out",
  "i am letting",
  "im letting",
  "my own",
  "owner direct",
  "no agents",
  "no agent",
  "direct from owner",
];

// Third-person phrasing typical of agencies even when the lister name
// looks human.
const AGENT_PHRASES = [
  "we have",
  "our agency",
  "our portfolio",
  "our team",
  "our company",
  "viewing arranged through our",
  "contact our office",
];

const lower = (s: string | undefined) => (s ?? "").toLowerCase();

// Phone-frequency signal. Agencies post dozens-to-hundreds of listings
// from a single number; owners almost never have more than a handful.
// Scoring is intentionally non-linear so the obvious owner case (1
// listing) and the obvious agent case (>10 listings) dominate.
function listingCountSignal(count: number | undefined): {
  owner: number;
  isAgentByCount: boolean;
} {
  if (count === undefined) return { owner: 0, isAgentByCount: false };
  if (count <= 1) return { owner: 35, isAgentByCount: false };
  if (count === 2) return { owner: 20, isAgentByCount: false };
  if (count === 3) return { owner: 5, isAgentByCount: false };
  if (count <= 5) return { owner: -10, isAgentByCount: false };
  if (count <= 10) return { owner: -25, isAgentByCount: false };
  return { owner: -50, isAgentByCount: true };
}

// Display name signal. "John Mwangi" → human → owner-leaning.
// "Acme Properties Ltd" → company → agent-locked.
function listerNameSignal(name: string | undefined): {
  owner: number;
  hardAgent: boolean;
} {
  const n = lower(name).trim();
  if (!n) return { owner: 0, hardAgent: false };

  for (const kw of AGENCY_KEYWORDS) {
    if (n.includes(kw)) return { owner: -40, hardAgent: true };
  }

  // Looks like a human name: 2–4 words, mostly letters, capitalised
  // when displayed. We work off the lowercased copy so we're really
  // checking shape, not case.
  const words = n.split(/\s+/).filter(Boolean);
  const looksHuman =
    words.length >= 2 &&
    words.length <= 4 &&
    words.every((w) => /^[a-z'\-]{2,}$/.test(w));
  if (looksHuman) return { owner: 25, hardAgent: false };

  return { owner: 0, hardAgent: false };
}

function descriptionSignal(description: string | undefined): number {
  const d = lower(description);
  if (!d) return 0;
  let score = 0;
  for (const p of OWNER_PHRASES) if (d.includes(p)) score += 12;
  for (const p of AGENT_PHRASES) if (d.includes(p)) score -= 12;
  // Cap so a paragraph repeating "my apartment" five times can't run
  // away with the score on its own.
  return Math.max(-30, Math.min(30, score));
}

// A phone number that has appeared on the operator-curated agency
// blocklist (env var, comma-separated international format) is treated
// as a hard agent regardless of every other signal. We accept "+254
// 700 000 000" or "+254700000000" — strip everything that isn't a
// digit before comparing.
function isBlocklistedPhone(phone: string | undefined): boolean {
  if (!phone) return false;
  const blocklist = (process.env.ACQUISITION_AGENT_PHONE_BLOCKLIST || "")
    .split(",")
    .map(normalisePhone)
    .filter(Boolean);
  if (blocklist.length === 0) return false;
  const norm = normalisePhone(phone);
  if (!norm) return false;
  return blocklist.includes(norm);
}

export function normalisePhone(input: string | undefined | null): string {
  if (!input) return "";
  const digits = input.replace(/\D/g, "");
  if (!digits) return "";
  return digits;
}

function painSignal(listing: RawListing): number {
  let score = 0;
  // Time on market is the cleanest pain signal we have.
  if (listing.daysOnMarket !== undefined) {
    if (listing.daysOnMarket >= 90) score += 50;
    else if (listing.daysOnMarket >= 60) score += 35;
    else if (listing.daysOnMarket >= 45) score += 20;
    else if (listing.daysOnMarket >= 30) score += 10;
  }
  // Mid-market asking price is where we sign best (premium owners
  // typically already have a manager; sub-$500/mo can't afford us).
  if (listing.askingPriceUsd !== undefined) {
    const p = listing.askingPriceUsd;
    if (p >= 800 && p <= 3500) score += 15;
    else if (p >= 500 && p < 800) score += 5;
    else if (p > 5000) score -= 5;
  }
  // Repeat-relisting hint: scrapers may pass it via notes for now.
  const notes = lower(listing.notes);
  if (notes.includes("relisted")) score += 15;
  return Math.max(0, Math.min(100, score));
}

export function classify(listing: RawListing): ClassifiedListing {
  const count = listingCountSignal(listing.listerListingCount);
  const name = listerNameSignal(listing.listerName);
  const desc = descriptionSignal(listing.description);
  const blocklisted = isBlocklistedPhone(listing.listerPhone);

  // Centre at 50 (we have no info → unknown). Add the signed signals.
  let owner = 50 + count.owner + name.owner + desc;
  if (blocklisted || name.hardAgent || count.isAgentByCount) {
    // Hard agent overrides: clamp to a very low score so even a
    // strong owner-y description can't rescue an obvious agency
    // listing.
    owner = Math.min(owner, 15);
  }
  owner = Math.max(0, Math.min(100, owner));

  const listerType: ListerType =
    owner >= 65 ? "Likely owner" : owner <= 35 ? "Likely agent" : "Unknown";

  return {
    ...listing,
    ownerScore: Math.round(owner),
    painScore: Math.round(painSignal(listing)),
    listerType,
  };
}

// Convenience filter for the orchestrator: skip anything we're confident
// is an agent so we don't pollute the Acquisition Targets table with
// rows ops will just ignore.
export function isWorthSurfacing(c: ClassifiedListing): boolean {
  if (c.listerType === "Likely agent") return false;
  // Sub-$200/mo asking is almost always a different market segment we
  // don't manage; skip even if the lister looks like an owner.
  if (c.askingPriceUsd !== undefined && c.askingPriceUsd < 200) return false;
  return true;
}
