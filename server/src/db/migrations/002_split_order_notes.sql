-- Split the order's single `notes` field in two. Until now the admin's notes
-- were returned verbatim by POST /orders/track, so anything the team wrote
-- there was shown to the customer.
--
-- The existing column already behaved as the customer-facing note, so it is
-- renamed rather than copied: whatever customers could see stays visible.
-- `internal_notes` is new and is never returned by a customer-facing route.

ALTER TABLE orders RENAME COLUMN notes TO customer_note;
ALTER TABLE orders ADD COLUMN internal_notes TEXT NOT NULL DEFAULT '';
