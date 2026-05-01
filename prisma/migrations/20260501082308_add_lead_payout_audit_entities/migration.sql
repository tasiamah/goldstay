-- Add the LEAD + PAYOUT_METHOD enum values that the new audit
-- pipeline writes against. ALTER TYPE ADD VALUE cannot run in the
-- same transaction as queries that immediately use the value, so
-- the rest of the application code that depends on these values
-- ships in a follow-up migration / deploy.

ALTER TYPE "AuditEntity" ADD VALUE IF NOT EXISTS 'LEAD';
ALTER TYPE "AuditEntity" ADD VALUE IF NOT EXISTS 'PAYOUT_METHOD';
