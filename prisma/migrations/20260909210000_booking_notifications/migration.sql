-- Booking notifications.
--
-- Two new kinds on the notification enum. Unlike every existing value
-- these are events rather than derived state: they are written once
-- when a booking arrives or is cancelled, not re-derived by
-- syncClientNotifications from current state.
--
-- The existing unique index on (ownerId, kind, sourceRef) is what
-- makes the email idempotent, so nothing new is needed for that. The
-- Hostaway webhook upserts bookings on every upstream modification,
-- and without that constraint an owner would be emailed again each
-- time a guest changed a detail of their reservation.
--
-- Postgres cannot add enum values inside a transaction block that
-- later uses them, but adding them alone is safe and idempotent here.
ALTER TYPE "OwnerNotificationKind" ADD VALUE IF NOT EXISTS 'BOOKING_RECEIVED';
ALTER TYPE "OwnerNotificationKind" ADD VALUE IF NOT EXISTS 'BOOKING_CANCELLED';
