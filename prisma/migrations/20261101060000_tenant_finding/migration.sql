-- Tenant finding: a third engagement alongside short stay and long let.
--
-- We place a tenant, take one month's rent once, and stop. Adding the
-- value to PropertyType rather than introducing a separate service
-- column keeps the upgrade path (tenant finding -> full management) a
-- single column change.
--
-- Postgres cannot add a value to an enum inside a transaction that
-- then uses it, but Prisma runs each migration file in its own
-- transaction and nothing here references the new values, so this is
-- safe as written. All three are additive: no existing row changes.

ALTER TYPE "PropertyType" ADD VALUE IF NOT EXISTS 'TENANT_FINDING';

ALTER TYPE "AgreementTemplate" ADD VALUE IF NOT EXISTS 'TENANT_FINDING_KE_V1';

ALTER TYPE "TransactionType" ADD VALUE IF NOT EXISTS 'TENANT_FINDING_FEE';
