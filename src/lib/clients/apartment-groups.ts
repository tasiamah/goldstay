// Collapsing the Property rows that are really one apartment.
//
// A unit offered both long-let and short-let has two management
// agreements, and `Property` has no way to express that except as two
// rows. Four of our landlords are in that position today. Left as
// they are, the portal shows the same flat twice and a KPI that reads
// "2 properties" to someone who owns one.
//
// This is presentation only. It does not merge or delete anything:
// both rows stay, both agreements stay, and the group keeps a handle
// on every row so a caller can still reach them.
//
// Grouping is keyed on the owner of record as well as the address,
// because two unrelated clients can hold rows with the same name and
// unit number — Purple haze B804 is recorded against two different
// landlords right now — and merging those would show one person
// another person's flat.

export type GroupableProperty = {
  id: string;
  name: string;
  unitNumber: string | null;
  status: string;
  units: { leases: { id: string }[] }[];
  coOwners: { clientId: string; relationship: string | null }[];
  client: { id: string; fullName: string };
};

export type ApartmentGroup<T extends GroupableProperty> = {
  key: string;
  // The row we link to and show a status for. An ACTIVE row wins,
  // because when a flat is live under one agreement and still
  // onboarding under another, "live" is the honest headline.
  primary: T;
  rows: T[];
  occupied: boolean;
  isActive: boolean;
  // True when the viewer sees this because they co-own it, rather
  // than because it is addressed to them.
  isCoOwned: boolean;
  // Only set when isCoOwned, since otherwise it is the viewer.
  ownerOfRecord: string | null;
  relationship: string | null;
};

function keyFor(p: GroupableProperty): string {
  const unit = (p.unitNumber ?? "").trim().toLowerCase();
  return `${p.client.id}::${p.name.trim().toLowerCase()}::${unit}`;
}

export function groupByApartment<T extends GroupableProperty>(
  properties: T[],
  viewerClientId: string,
): ApartmentGroup<T>[] {
  const order: string[] = [];
  const buckets = new Map<string, T[]>();

  for (const p of properties) {
    const key = keyFor(p);
    if (!buckets.has(key)) {
      buckets.set(key, []);
      // Preserve the order the caller sorted them in rather than
      // Map insertion luck.
      order.push(key);
    }
    buckets.get(key)!.push(p);
  }

  return order.map((key) => {
    const rows = buckets.get(key)!;
    const primary = rows.find((r) => r.status === "ACTIVE") ?? rows[0]!;
    const isCoOwned = primary.client.id !== viewerClientId;
    const mine = primary.coOwners.find((c) => c.clientId === viewerClientId);

    return {
      key,
      primary,
      rows,
      occupied: rows.some((r) => r.units.some((u) => u.leases.length > 0)),
      isActive: rows.some((r) => r.status === "ACTIVE"),
      isCoOwned,
      ownerOfRecord: isCoOwned ? primary.client.fullName : null,
      relationship: mine?.relationship ?? null,
    };
  });
}
