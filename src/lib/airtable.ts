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
