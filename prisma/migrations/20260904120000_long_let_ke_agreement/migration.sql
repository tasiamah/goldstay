-- Adds the Kenyan long-term management agreement as a third contract
-- template.
--
-- Additive and safe to run before or after the code deploy: nothing
-- reads the new value until templateFor() starts returning it, and
-- existing rows keep the template they were issued under. Postgres 12+
-- permits ADD VALUE inside a transaction provided the value isn't used
-- in the same transaction, which is why this migration only declares
-- it and backfills nothing.
--
-- Deliberately no backfill. Long-term properties issued before this
-- carry GENERIC_MANAGEMENT_V1 and must keep it: an accepted agreement
-- has to reprint as the words that were accepted, and rewriting the
-- template on an old row would silently restate its terms.

-- AlterEnum
ALTER TYPE "AgreementTemplate" ADD VALUE 'LONG_LET_KE_V1';
