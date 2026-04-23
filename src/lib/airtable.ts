// Thin Airtable REST client. No SDK to keep the bundle small and the failure
// surface obvious. Airtable is our out-of-band CRM mirror, not the system of
// record, so every call is best-effort: if env is not set, the API is
// unreachable, or the schema drifts, we log and move on. The email still
// sends and the user still sees a success state.

const AIRTABLE_API = "https://api.airtable.com/v0";

export type AirtableFields = Record<string, unknown>;

// Default table names match the schema documented in the README. If a user
// renames a table in their base, they override the name with an env var
// rather than touching the code.
export const airtableTables = {
  leads: process.env.AIRTABLE_LEADS_TABLE || "Landlord leads",
  tenants: process.env.AIRTABLE_TENANTS_TABLE || "Tenant Applications",
  vacancy: process.env.AIRTABLE_VACANCY_TABLE || "Vacancy Leads",
  units: process.env.AIRTABLE_UNITS_TABLE || "Units",
  waitlist: process.env.AIRTABLE_WAITLIST_TABLE || "Tenant waitlist",
} as const;

function getConfig() {
  const apiKey = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  if (!apiKey || !baseId) return null;
  return { apiKey, baseId };
}

export function isAirtableConfigured(): boolean {
  return getConfig() !== null;
}

// Drops undefined, null and empty-string values so Airtable does not reject
// the write because of a stray blank field the user has not added to the
// base yet. Keeps boolean false and numeric 0 intentionally.
function cleanFields(fields: AirtableFields): AirtableFields {
  const out: AirtableFields = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined || v === null) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k] = v;
  }
  return out;
}

export async function createAirtableRecord(
  table: string,
  fields: AirtableFields,
): Promise<void> {
  const cfg = getConfig();
  if (!cfg) return;

  const cleaned = cleanFields(fields);
  if (Object.keys(cleaned).length === 0) return;

  try {
    const res = await fetch(
      `${AIRTABLE_API}/${cfg.baseId}/${encodeURIComponent(table)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cfg.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // typecast lets Airtable coerce plain strings into single-select
          // options, dates, numbers and create missing select options on
          // the fly. This means the operator can add new select values
          // (e.g. a new status) from the Airtable UI without a deploy.
          records: [{ fields: cleaned }],
          typecast: true,
        }),
      },
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(
        `[airtable] create failed on "${table}": ${res.status} ${body}`,
      );
    }
  } catch (e) {
    console.error(`[airtable] create error on "${table}":`, e);
  }
}

// Generic reader. Returns an empty array when Airtable isn't configured or
// the read fails, so a broken CRM never crashes the public search page.
// `fields` lets us request only the columns the caller needs, which keeps
// payloads small and avoids accidentally exposing internal notes.
export async function listAirtableRecords<T extends AirtableFields>(
  table: string,
  params: {
    filterByFormula?: string;
    fields?: string[];
    maxRecords?: number;
    sort?: { field: string; direction?: "asc" | "desc" }[];
  } = {},
): Promise<Array<{ id: string; fields: T }>> {
  const cfg = getConfig();
  if (!cfg) return [];

  const qs = new URLSearchParams();
  if (params.filterByFormula) {
    qs.set("filterByFormula", params.filterByFormula);
  }
  if (params.maxRecords) {
    qs.set("maxRecords", String(params.maxRecords));
  }
  for (const f of params.fields ?? []) {
    qs.append("fields[]", f);
  }
  (params.sort ?? []).forEach((s, i) => {
    qs.append(`sort[${i}][field]`, s.field);
    qs.append(`sort[${i}][direction]`, s.direction ?? "asc");
  });

  try {
    const res = await fetch(
      `${AIRTABLE_API}/${cfg.baseId}/${encodeURIComponent(table)}?${qs.toString()}`,
      {
        headers: { Authorization: `Bearer ${cfg.apiKey}` },
        // Don't cache: the Units table is dynamic inventory and stale
        // availability would mislead tenants.
        cache: "no-store",
      },
    );
    if (!res.ok) {
      const body = await res.text();
      console.error(`[airtable] list failed on "${table}": ${res.status} ${body}`);
      return [];
    }
    const json = (await res.json()) as {
      records?: Array<{ id: string; fields: T }>;
    };
    return json.records ?? [];
  } catch (e) {
    console.error(`[airtable] list error on "${table}":`, e);
    return [];
  }
}

// Public-facing unit shape. Deliberately a subset of the Airtable schema —
// we don't leak Internal notes to the browser.
export type PublicUnit = {
  id: string;
  unitId: string;
  title: string;
  city: "Nairobi" | "Accra";
  neighbourhood: string;
  bedrooms: number;
  stayType: "Long-term" | "Short-stay" | "Both";
  monthlyRentUsd: number | null;
  nightlyRateUsd: number | null;
  minStayNights: number | null;
  maxGuests: number | null;
  earliestAvailable: string | null;
  description: string;
  photoUrl: string | null;
};

type UnitRecordFields = {
  "Unit ID"?: string;
  Title?: string;
  City?: string;
  Neighbourhood?: string;
  Bedrooms?: number;
  "Stay type"?: string;
  Status?: string;
  "Monthly rent USD"?: number;
  "Nightly rate USD"?: number;
  "Min stay nights"?: number;
  "Max guests"?: number;
  "Earliest available"?: string;
  Description?: string;
  "Photo URL"?: string;
};

export type UnitSearchParams = {
  city?: "Nairobi" | "Accra";
  stayType: "Long-term" | "Short-stay";
  bedrooms?: number;
  maxBudgetUsd?: number;
  checkIn?: string;
  guests?: number;
};

// Builds an Airtable filterByFormula that narrows Units to what the tenant
// asked for. We only include a constraint in the formula if the caller
// actually supplied it, so an empty search returns all available units in
// the requested stay type.
function buildUnitsFormula(p: UnitSearchParams): string {
  const parts: string[] = [`{Status}='Available'`];

  if (p.stayType === "Long-term") {
    parts.push(`OR({Stay type}='Long-term',{Stay type}='Both')`);
  } else {
    parts.push(`OR({Stay type}='Short-stay',{Stay type}='Both')`);
  }

  if (p.city) {
    parts.push(`{City}='${p.city.replace(/'/g, "\\'")}'`);
  }
  if (p.bedrooms !== undefined) {
    parts.push(`{Bedrooms}>=${p.bedrooms}`);
  }
  if (p.maxBudgetUsd !== undefined) {
    if (p.stayType === "Long-term") {
      parts.push(`{Monthly rent USD}<=${p.maxBudgetUsd}`);
    } else {
      parts.push(`{Nightly rate USD}<=${p.maxBudgetUsd}`);
    }
  }
  if (p.guests !== undefined) {
    parts.push(`OR({Max guests}>=${p.guests},{Max guests}=BLANK())`);
  }
  if (p.checkIn) {
    // Only show units whose earliest-available date isn't after the
    // requested check-in. Units without a date set are treated as
    // available now, which matches how we instruct ops to leave the
    // field blank when there's no scheduled free-up.
    parts.push(
      `OR(IS_BEFORE({Earliest available}, DATEADD('${p.checkIn}', 1, 'days')),{Earliest available}=BLANK())`,
    );
  }

  return parts.length === 1 ? parts[0] : `AND(${parts.join(",")})`;
}

function toPublicUnit(r: {
  id: string;
  fields: UnitRecordFields;
}): PublicUnit | null {
  const f = r.fields;
  const city = f.City;
  const stay = f["Stay type"];
  if (city !== "Nairobi" && city !== "Accra") return null;
  if (stay !== "Long-term" && stay !== "Short-stay" && stay !== "Both") {
    return null;
  }
  return {
    id: r.id,
    unitId: f["Unit ID"] ?? r.id,
    title: f.Title ?? "Unit",
    city,
    neighbourhood: f.Neighbourhood ?? "",
    bedrooms: typeof f.Bedrooms === "number" ? f.Bedrooms : 0,
    stayType: stay,
    monthlyRentUsd:
      typeof f["Monthly rent USD"] === "number" ? f["Monthly rent USD"] : null,
    nightlyRateUsd:
      typeof f["Nightly rate USD"] === "number" ? f["Nightly rate USD"] : null,
    minStayNights:
      typeof f["Min stay nights"] === "number" ? f["Min stay nights"] : null,
    maxGuests: typeof f["Max guests"] === "number" ? f["Max guests"] : null,
    earliestAvailable: f["Earliest available"] ?? null,
    description: f.Description ?? "",
    photoUrl: f["Photo URL"] ?? null,
  };
}

export async function searchUnits(
  params: UnitSearchParams,
): Promise<PublicUnit[]> {
  const formula = buildUnitsFormula(params);
  const records = await listAirtableRecords<UnitRecordFields>(
    airtableTables.units,
    {
      filterByFormula: formula,
      fields: [
        "Unit ID",
        "Title",
        "City",
        "Neighbourhood",
        "Bedrooms",
        "Stay type",
        "Status",
        "Monthly rent USD",
        "Nightly rate USD",
        "Min stay nights",
        "Max guests",
        "Earliest available",
        "Description",
        "Photo URL",
      ],
      maxRecords: 40,
      sort: [
        { field: "Bedrooms", direction: "asc" },
        {
          field:
            params.stayType === "Short-stay"
              ? "Nightly rate USD"
              : "Monthly rent USD",
          direction: "asc",
        },
      ],
    },
  );

  return records
    .map(toPublicUnit)
    .filter((u): u is PublicUnit => u !== null);
}
