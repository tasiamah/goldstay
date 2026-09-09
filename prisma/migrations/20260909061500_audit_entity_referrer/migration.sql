-- Audit entity for the referral programme.
--
-- Referral status changes and commission payments are recorded
-- against the referrer, not against separate referral and payout
-- entities, because the question anybody asks is "what has happened
-- with this agent" and the answer wants to be one timeline. The
-- referral or payout id is carried in the audit row's metadata.
--
-- Paying a referrer moves money out of Goldstay, so it needs the same
-- trail every other money movement here has.

ALTER TYPE "AuditEntity" ADD VALUE 'REFERRER';
