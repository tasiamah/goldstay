// Goldstay's current business model rents a property out as a
// whole — never a single bedroom or sub-unit. The schema still has
// Unit because Lease FKs into it, so every property carries exactly
// one implicit "Whole property" unit. This helper is the single
// place that resolves it, and lazily creates it on the fly for
// legacy properties that pre-date the auto-creation rule.

import { prisma } from "@/lib/db";

export const IMPLICIT_UNIT_LABEL = "Whole property";

export async function getOrCreateImplicitUnitId(
  propertyId: string,
): Promise<string> {
  const existing = await prisma.unit.findFirst({
    where: { propertyId },
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  if (existing) return existing.id;

  const property = await prisma.property.findUnique({
    where: { id: propertyId },
    select: { bedrooms: true, bathrooms: true, sizeSqm: true },
  });
  if (!property) {
    throw new Error(`Property ${propertyId} not found`);
  }

  const created = await prisma.unit.create({
    data: {
      propertyId,
      label: IMPLICIT_UNIT_LABEL,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      sizeSqm: property.sizeSqm,
    },
    select: { id: true },
  });
  return created.id;
}
