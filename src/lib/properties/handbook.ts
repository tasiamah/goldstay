// The property handbook: the operating notes only the owner knows on
// day one, and that an operator, a cleaner or a guest needs later.
//
// One field list, used by both forms. The client edits its handbook on
// /client/properties/[id] and ops edits the same row on
// /admin/properties/[id], and the fields, the labels, the help text
// and the validation are defined here precisely once so the two can
// never drift into disagreeing about what a field means. A label
// changed in one place and not the other is the failure mode this
// module exists to prevent.
//
// Deliberately zod-free. The field list is rendered by a client
// component and the validation schema is a server concern, so the
// schema lives in ./handbook-input.ts and this file stays out of the
// browser bundle's dependency on zod.

export type HandbookFieldName =
  | "checkInNotes"
  | "wifiNetwork"
  | "wifiPassword"
  | "electricityNotes"
  | "waterNotes"
  | "securityContact"
  | "parkingNotes"
  | "buildingRules"
  | "applianceNotes"
  | "otherNotes";

export type HandbookField = {
  name: HandbookFieldName;
  label: string;
  // Shown under the label. Written as a prompt rather than a
  // description, because a blank textarea labelled "Water" gets left
  // blank and one that asks where the pump switch is gets answered.
  hint: string;
  // Single-line inputs for the two short values, textareas for the
  // rest. The WiFi network and the security contact are one line each
  // in every real case; forcing them into a textarea invites a
  // paragraph where a name and a number are wanted.
  kind: "line" | "block";
  maxLength: number;
  // Counted by handbookCompleteness. The four essentials are what an
  // operator cannot run a changeover without; the rest are genuinely
  // nice to have, and a progress meter that treats them as equals
  // tells the owner their handbook is half done when the part that
  // matters is finished.
  essential: boolean;
};

export const HANDBOOK_FIELDS: readonly HandbookField[] = [
  {
    name: "checkInNotes",
    label: "Getting in",
    hint: "Gate procedure, which block and floor, the concierge desk, where the keys live, anything a guest arriving at 11pm needs to know.",
    kind: "block",
    maxLength: 2000,
    essential: true,
  },
  {
    name: "wifiNetwork",
    label: "WiFi network name",
    hint: "Exactly as it appears in the list of networks, including capitals.",
    kind: "line",
    maxLength: 120,
    essential: true,
  },
  {
    name: "wifiPassword",
    label: "WiFi password",
    hint: "Case sensitive. Tell us if it changes and we will update it here.",
    kind: "line",
    maxLength: 120,
    essential: true,
  },
  {
    name: "electricityNotes",
    label: "Electricity and tokens",
    hint: "Meter number and how it is topped up, or tell us if power is billed through the service charge and there is nothing to buy.",
    kind: "block",
    maxLength: 2000,
    essential: true,
  },
  {
    name: "waterNotes",
    label: "Water and the pump",
    hint: "Tank or borehole, and above all where the pump switch is. A guest with no water at 6am is a one-star review that a sentence here prevents.",
    kind: "block",
    maxLength: 2000,
    essential: false,
  },
  {
    name: "securityContact",
    label: "Security or caretaker contact",
    hint: "Name and number for the guard, caretaker or concierge.",
    kind: "line",
    maxLength: 200,
    essential: false,
  },
  {
    name: "parkingNotes",
    label: "Parking",
    hint: "Which bay is yours, whether visitors can park, and how the barrier works.",
    kind: "block",
    maxLength: 1000,
    essential: false,
  },
  {
    name: "buildingRules",
    label: "Building rules",
    hint: "Quiet hours, refuse days, lift restrictions, and any limit the committee places on short stays that we need to work within.",
    kind: "block",
    maxLength: 2000,
    essential: false,
  },
  {
    name: "applianceNotes",
    label: "Appliances and quirks",
    hint: "Which switch is the geyser, who refills the gas cylinder, the oven that runs hot, the window that sticks.",
    kind: "block",
    maxLength: 2000,
    essential: false,
  },
  {
    name: "otherNotes",
    label: "Anything else",
    hint: "Whatever the fields above did not ask for and the next person through the door would want to know.",
    kind: "block",
    maxLength: 4000,
    essential: false,
  },
] as const;

export type HandbookValues = Record<HandbookFieldName, string | null>;

// Narrows a PropertyHandbook row (or its absence) to just the ten
// editable fields, so a form never receives ids, timestamps or the
// author alongside the values it is meant to render. A property with
// no handbook row yet and one whose fields are all blank are the same
// thing to a form, and both arrive here as every field null.
export function handbookValuesFrom(
  row: Partial<HandbookValues> | null | undefined,
): HandbookValues {
  return Object.fromEntries(
    HANDBOOK_FIELDS.map((f) => [f.name, row?.[f.name] ?? null]),
  ) as HandbookValues;
}

// Both write paths return this, so one form component can be wired to
// either action.
export type HandbookActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

export type HandbookCompleteness = {
  essentialTotal: number;
  essentialFilled: number;
  total: number;
  filled: number;
  // True once all four essentials are answered. Drives the "ready for
  // a changeover" line rather than a percentage, because an operator
  // wants a yes or a no.
  essentialsDone: boolean;
  missingEssentialLabels: string[];
};

export function handbookCompleteness(
  values: Partial<HandbookValues> | null | undefined,
): HandbookCompleteness {
  const filledFields = HANDBOOK_FIELDS.filter((f) => {
    const v = values?.[f.name];
    return typeof v === "string" && v.trim().length > 0;
  });
  const essentials = HANDBOOK_FIELDS.filter((f) => f.essential);
  const essentialFilled = filledFields.filter((f) => f.essential);

  return {
    essentialTotal: essentials.length,
    essentialFilled: essentialFilled.length,
    total: HANDBOOK_FIELDS.length,
    filled: filledFields.length,
    essentialsDone: essentialFilled.length === essentials.length,
    missingEssentialLabels: essentials
      .filter((f) => !essentialFilled.includes(f))
      .map((f) => f.label),
  };
}

// Which fields a save actually changed, for the audit metadata.
//
// Names only, never values. The audit log is read by every operator
// and exported; writing a WiFi password or a caretaker's phone number
// into it would copy both into a second, wider-read place for no
// benefit, and would leave them there after the handbook itself was
// corrected.
export function changedHandbookFields(
  before: Partial<HandbookValues> | null | undefined,
  after: HandbookValues,
): HandbookFieldName[] {
  return HANDBOOK_FIELDS.filter(
    (f) => (before?.[f.name] ?? null) !== after[f.name],
  ).map((f) => f.name);
}
