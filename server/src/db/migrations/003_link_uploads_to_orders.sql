-- Tie each uploaded file to the order that used it. Until now an order's
-- `attachments` held whatever ids the client sent: ids that were never
-- uploaded, or another visitor's upload, were stored as-is, and no upload
-- ever knew whether an order had claimed it.
--
-- NULL means "uploaded, not (yet) attached to an order". POST /orders links
-- the ids it accepts, and an upload that already has an order_id cannot be
-- attached to a second one.

ALTER TABLE uploads ADD COLUMN order_id INTEGER REFERENCES orders (id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_uploads_order_id ON uploads (order_id);
