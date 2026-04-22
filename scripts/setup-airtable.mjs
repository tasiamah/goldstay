#!/usr/bin/env node
// One-shot Airtable schema provisioner for the Goldstay CRM base.
//
// Run with:
//   AIRTABLE_API_KEY=pat... AIRTABLE_BASE_ID=app... node scripts/setup-airtable.mjs
//
// Idempotent: creates tables that don't exist, adds missing fields on
// tables that do. Safe to re-run after editing the spec below.
//
// Requires a Personal Access Token with these scopes on the target base:
//   - schema.bases:read
//   - schema.bases:write
//
// The runtime token in Vercel only needs data.records:write; this setup
// token is ideally a separate short-lived PAT you revoke once the schema
// is provisioned.

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  console.error(
    "Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID. Run like:\n" +
      "  AIRTABLE_API_KEY=pat... AIRTABLE_BASE_ID=app... node scripts/setup-airtable.mjs",
  );
  process.exit(1);
}

const API = "https://api.airtable.com/v0";

// Field type helpers. Airtable requires the options object for anything
// more structured than a plain text field, and the API rejects a missing
// options block with a 422 even when the type itself would default.

const text = () => ({ type: "singleLineText" });
const longText = () => ({ type: "multilineText" });
const email = () => ({ type: "email" });
const phone = () => ({ type: "phoneNumber" });
const checkbox = () => ({
  type: "checkbox",
  options: { icon: "check", color: "greenBright" },
});
const dateTime = () => ({
  type: "dateTime",
  options: {
    dateFormat: { name: "iso" },
    timeFormat: { name: "24hour" },
    timeZone: "client",
  },
});
const numberInt = () => ({
  type: "number",
  options: { precision: 0 },
});
const numberDecimal = () => ({
  type: "number",
  options: { precision: 2 },
});
const currency = () => ({
  type: "currency",
  options: { precision: 2, symbol: "$" },
});
const singleSelect = (choices) => ({
  type: "singleSelect",
  options: { choices: choices.map((name) => ({ name })) },
});

// Schema spec. First field in each table's fields array is the primary
// field. Keep primary as singleLineText so we don't fight Airtable's
// primary-field rules (email/phone/select can't be primary on a new
// table without contortions).

const tablesSpec = [
  {
    name: "Leads",
    description: "Landlord enquiries from /list-your-property.",
    fields: [
      { name: "Name", ...text() },
      { name: "Email", ...email() },
      { name: "Phone", ...phone() },
      { name: "Country", ...text() },
      { name: "City", ...singleSelect(["Nairobi", "Accra", "Other"]) },
      { name: "Neighbourhood", ...text() },
      { name: "Property type", ...text() },
      { name: "Bedrooms", ...text() },
      {
        name: "Furnished",
        ...singleSelect(["Furnished", "Unfurnished", "Part-furnished"]),
      },
      {
        name: "Service",
        ...singleSelect([
          "Long-term",
          "Short-stay / Airbnb",
          "Help me buy a property",
          "Tenant finding only",
          "Not sure",
        ]),
      },
      { name: "Availability", ...text() },
      { name: "Notes", ...longText() },
      { name: "Submitted", ...dateTime() },
      { name: "Source", ...text() },
      {
        name: "Status",
        ...singleSelect(["New", "Contacted", "Onboarded", "Lost"]),
      },
    ],
  },
  {
    name: "Tenant Applications",
    description: "Tenant applications submitted from /apply.",
    fields: [
      { name: "Full name", ...text() },
      { name: "Email", ...email() },
      { name: "Phone", ...phone() },
      { name: "WhatsApp", ...phone() },
      { name: "City", ...text() },
      { name: "Applying for", ...text() },
      { name: "Referred by", ...text() },
      { name: "Grade", ...singleSelect(["A", "B", "C", "D"]) },
      { name: "Score", ...numberInt() },
      { name: "Income/rent ratio", ...numberDecimal() },
      { name: "Monthly income USD", ...currency() },
      { name: "Target rent USD", ...currency() },
      {
        name: "Employment type",
        ...singleSelect([
          "salaried",
          "self-employed",
          "contract",
          "business-owner",
          "unemployed",
          "student",
          "other",
        ]),
      },
      { name: "Employer", ...text() },
      { name: "Months in role", ...numberInt() },
      { name: "Has previous landlord", ...checkbox() },
      { name: "Previous landlord name", ...text() },
      { name: "Previous landlord phone", ...phone() },
      { name: "Evicted before", ...checkbox() },
      { name: "Scoring rationale", ...longText() },
      { name: "Token", ...text() },
      { name: "Submitted", ...dateTime() },
      {
        name: "Status",
        ...singleSelect(["New", "Verified", "Placed", "Rejected"]),
      },
    ],
  },
  {
    name: "Vacancy Leads",
    description:
      "Landlords to pitch, auto-created from tenant applications that name a previous landlord.",
    fields: [
      { name: "Landlord name", ...text() },
      { name: "Phone", ...phone() },
      { name: "Property", ...longText() },
      { name: "Tenant leaving", ...text() },
      { name: "Leaving around", ...text() },
      { name: "Referred via", ...text() },
      { name: "Submitted", ...dateTime() },
      {
        name: "Status",
        ...singleSelect([
          "New",
          "Contacted",
          "Pitched",
          "Signed",
          "Not interested",
        ]),
      },
    ],
  },
];

async function api(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(
      `${init.method || "GET"} ${path} failed with ${res.status}: ${
        typeof body === "string" ? body : JSON.stringify(body)
      }`,
    );
  }
  return body;
}

async function listTables() {
  const body = await api(`/meta/bases/${baseId}/tables`);
  return body.tables ?? [];
}

async function createTable(spec) {
  return api(`/meta/bases/${baseId}/tables`, {
    method: "POST",
    body: JSON.stringify({
      name: spec.name,
      description: spec.description,
      fields: spec.fields,
    }),
  });
}

async function addField(tableId, field) {
  return api(`/meta/bases/${baseId}/tables/${tableId}/fields`, {
    method: "POST",
    body: JSON.stringify(field),
  });
}

async function main() {
  console.log(`Provisioning Goldstay CRM schema in ${baseId}\n`);

  const existing = await listTables();
  const byName = Object.fromEntries(existing.map((t) => [t.name, t]));

  for (const spec of tablesSpec) {
    const found = byName[spec.name];
    if (!found) {
      console.log(`+ creating table "${spec.name}"`);
      await createTable(spec);
      console.log(`  done (${spec.fields.length} fields)`);
      continue;
    }

    console.log(`= table "${spec.name}" exists, checking fields`);
    const existingFieldNames = new Set(found.fields.map((f) => f.name));
    // Skip the primary field: Airtable rejects adding a second primary
    // and the first field in each spec is the primary, which we only
    // create on new tables. For existing tables, respect whatever
    // primary the user already has.
    const missing = spec.fields
      .slice(1)
      .filter((f) => !existingFieldNames.has(f.name));

    if (missing.length === 0) {
      console.log(`  all fields present`);
      continue;
    }

    for (const field of missing) {
      console.log(`  + adding field "${field.name}" (${field.type})`);
      await addField(found.id, field);
    }
  }

  console.log("\nDone. Schema matches the spec in this file.");
  console.log(
    "Runtime only needs AIRTABLE_API_KEY with data.records:write scope;" +
      "\nyou can revoke the schema-write token now.",
  );
}

main().catch((err) => {
  console.error("\nSetup failed:", err.message);
  process.exit(1);
});
