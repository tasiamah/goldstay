// Lead enrichment + tier scoring for inbound landlord enquiries.
//
// Every form submission gets a Tier (A / B / C / D) and a short
// rationale string written into Airtable so ops can prioritise their
// callbacks without re-reading every Notes field. The scoring is
// pure: same input → same tier, no clock, no I/O. Easy to reason
// about and easy to test.
//
// Signal weights are tuned for the Goldstay ICP (premium/diaspora
// landlords with a property in Nairobi or Accra, ready to onboard).
// They will drift over time; tweak in this one place rather than
// scattering thresholds across the route handler.

const PREMIUM_NEIGHBOURHOODS = new Set(
  [
    // Nairobi premium / mid-premium that we sign best in.
    "westlands",
    "kilimani",
    "kileleshwa",
    "lavington",
    "karen",
    "runda",
    "rosslyn",
    "muthaiga",
    "old muthaiga",
    "spring valley",
    "loresho",
    "brookside",
    "gigiri",
    "nyari",
    "riverside",
    "two rivers",
    "thigiri",
    "tatu city",
    // Accra premium.
    "east legon",
    "adjiringanor",
    "airport residential",
    "cantonments",
    "labone",
    "ridge",
  ],
);

// Strong-diaspora origin countries: hard-currency salaries, USD-denominated
// remittances, easy onboarding. Anything else is still a lead, just not as
// straightforward.
const STRONG_DIASPORA_COUNTRIES = new Set([
  "united kingdom",
  "uk",
  "england",
  "scotland",
  "united states",
  "usa",
  "us",
  "america",
  "united arab emirates",
  "uae",
  "dubai",
  "abu dhabi",
  "qatar",
  "saudi arabia",
  "australia",
  "canada",
  "germany",
  "netherlands",
  "switzerland",
  "ireland",
  "sweden",
]);

const HOT_SERVICE_KEYWORDS = [
  "long-term",
  "long term",
  "short-stay",
  "short stay",
  "airbnb",
];

export type Tier = "A" | "B" | "C" | "D";

export type EnrichmentInput = {
  country?: string | null;
  city?: string | null;
  neighbourhood?: string | null;
  service?: string | null;
  bedrooms?: string | null;
  availability?: string | null;
  notes?: string | null;
  email?: string | null;
  phone?: string | null;
};

export type EnrichmentResult = {
  tier: Tier;
  score: number; // 0..100
  isDiaspora: boolean;
  isPremiumNeighbourhood: boolean;
  rationale: string[];
  // What the ops queue should call next. Higher tier → faster SLA.
  callbackSlaMinutes: number;
};

const lower = (s: string | null | undefined): string =>
  (s ?? "").trim().toLowerCase();

function isAvailableSoon(availability: string | null | undefined): boolean {
  const a = lower(availability);
  if (!a) return false;
  return (
    a.includes("immediately") ||
    a.includes("now") ||
    a.includes("within 1 month") ||
    a.includes("1 to 3 months")
  );
}

function isStrongDiaspora(country: string | null | undefined): boolean {
  const c = lower(country);
  if (!c) return false;
  return STRONG_DIASPORA_COUNTRIES.has(c);
}

function isOnshore(country: string | null | undefined): boolean {
  const c = lower(country);
  return c === "kenya" || c === "ghana";
}

function looksLikePremiumNeighbourhood(
  neighbourhood: string | null | undefined,
): boolean {
  const n = lower(neighbourhood);
  if (!n) return false;
  return PREMIUM_NEIGHBOURHOODS.has(n);
}

function hasHotService(service: string | null | undefined): boolean {
  const s = lower(service);
  return HOT_SERVICE_KEYWORDS.some((k) => s.includes(k));
}

function tierFromScore(score: number): Tier {
  if (score >= 75) return "A";
  if (score >= 55) return "B";
  if (score >= 35) return "C";
  return "D";
}

function slaForTier(tier: Tier): number {
  switch (tier) {
    case "A":
      return 30;
    case "B":
      return 120;
    case "C":
      return 24 * 60;
    case "D":
      return 72 * 60;
  }
}

export function enrichLead(input: EnrichmentInput): EnrichmentResult {
  const rationale: string[] = [];
  let score = 30;

  const diaspora = isStrongDiaspora(input.country);
  const onshore = isOnshore(input.country);
  if (diaspora) {
    score += 25;
    rationale.push(`Strong-diaspora origin (${input.country}).`);
  } else if (onshore) {
    score += 5;
    rationale.push(`Onshore landlord in ${input.country}.`);
  } else if (input.country) {
    score += 12;
    rationale.push(`International origin (${input.country}).`);
  }

  const premium = looksLikePremiumNeighbourhood(input.neighbourhood);
  if (premium) {
    score += 20;
    rationale.push(`Premium neighbourhood (${input.neighbourhood}).`);
  }

  if (hasHotService(input.service)) {
    score += 15;
    rationale.push(`Service requested: ${input.service}.`);
  } else if (lower(input.service).includes("buy")) {
    score += 5;
    rationale.push("Property sourcing intent (longer cycle).");
  }

  if (isAvailableSoon(input.availability)) {
    score += 15;
    rationale.push(`Available soon (${input.availability}).`);
  }

  // Bedrooms ≥ 2 is a meaningful signal because studios/1BRs at
  // mid-premium price points are typically owner-occupied side hustles
  // we sign less often than 2-3BR family / corporate stock.
  const beds = parseInt(lower(input.bedrooms), 10);
  if (!Number.isNaN(beds) && beds >= 2) {
    score += 5;
    rationale.push(`${beds}-bed unit.`);
  }

  const phone = (input.phone ?? "").replace(/\D/g, "");
  const hasContact = (input.email ?? "").includes("@") && phone.length >= 7;
  if (hasContact) {
    score += 5;
    rationale.push("Email + phone provided.");
  } else if (!phone) {
    score -= 10;
    rationale.push("No phone — cold outreach harder.");
  }

  // Notes can drag a lead up or down; keep it light so noise in the
  // free-text field doesn't dominate the score.
  const notes = lower(input.notes);
  if (notes) {
    if (/(urgent|asap|right away|this month)/.test(notes)) {
      score += 8;
      rationale.push("Notes signal urgency.");
    }
    if (/(just looking|window shopping|exploring options)/.test(notes)) {
      score -= 5;
      rationale.push("Notes signal early-stage exploration.");
    }
  }

  score = Math.max(0, Math.min(100, score));
  const tier = tierFromScore(score);
  return {
    tier,
    score,
    isDiaspora: diaspora,
    isPremiumNeighbourhood: premium,
    rationale,
    callbackSlaMinutes: slaForTier(tier),
  };
}
