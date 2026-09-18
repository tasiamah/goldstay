import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
const rows = await p.property.findMany({
  select: { propertyType: true, status: true, launchedAt: true, city: true, hostawayListingId: true,
    _count: { select: { bookings: true, icalFeeds: true } } },
  orderBy: [{ propertyType: 'asc' }, { status: 'asc' }],
});
console.log(JSON.stringify(rows, null, 2));
await p.$disconnect();
