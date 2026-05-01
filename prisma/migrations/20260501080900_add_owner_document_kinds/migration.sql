-- ALTER TYPE ... ADD VALUE cannot run in the same transaction as
-- a table referencing the value, so the two new DocumentKind enum
-- members are added in their own migration ahead of the bigger
-- acquisition_payouts_kyc_statementsends migration. Splitting also
-- keeps `prisma migrate deploy` happy on Postgres < 12.

ALTER TYPE "DocumentKind" ADD VALUE IF NOT EXISTS 'ID_DOCUMENT';
ALTER TYPE "DocumentKind" ADD VALUE IF NOT EXISTS 'PROOF_OF_PAYOUT_ACCOUNT';
