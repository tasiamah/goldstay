-- Re-stamp the clause-set version on agreements not yet accepted.
--
-- Both Kenyan contracts gained a priced photography charge, bumping
-- short-let-ke-v2 → v3 and long-let-ke-v1 → v2.
--
-- Rendering is not version-keyed: the portal view and any PDF built
-- from here on render from today's clause text rather than from the
-- version recorded on the row. So every unaccepted agreement already
-- shows the new wording the moment the code deploys, which is the
-- intent — but its stored version would still name the words it was
-- issued with, and nothing re-stamps it at acceptance. The row would
-- then claim the client accepted v2 when what they read and clicked
-- was v3. That is precisely the field's one job.
--
-- Scoped to DRAFT and SENT deliberately. A SIGNED row is the record
-- of what was actually accepted and must not be rewritten; its
-- executed PDF was materialised from the older text and stays the
-- authoritative copy of that agreement.
--
-- GENERIC_MANAGEMENT_V1 is untouched: the Ghanaian contract has no
-- startup-cost concept and its text did not change.

UPDATE "ManagementAgreement"
SET "templateVersion" = 'short-let-ke-v3'
WHERE "template" = 'SHORT_LET_KE_V1'
  AND "status" IN ('DRAFT', 'SENT');

UPDATE "ManagementAgreement"
SET "templateVersion" = 'long-let-ke-v2'
WHERE "template" = 'LONG_LET_KE_V1'
  AND "status" IN ('DRAFT', 'SENT');
