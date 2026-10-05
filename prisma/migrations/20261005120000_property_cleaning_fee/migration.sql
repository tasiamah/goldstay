-- Per-property turnover cost. Null means the property is on the
-- standard rate in src/lib/bookings/cleaning.ts, which is the case
-- for every existing row, so no backfill is needed.
ALTER TABLE "Property" ADD COLUMN "cleaningFeePerStay" DECIMAL(12,2);
