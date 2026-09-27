-- History of admin changes to an order: one row per PATCH that changed
-- something, with who made it and each changed field's old and new value,
-- e.g. {"status": {"from": "received", "to": "in_design"}}.
--
-- admin_username is copied in so the history still reads correctly if the
-- account is later removed (admin_user_id then becomes NULL).

CREATE TABLE IF NOT EXISTS order_events (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  admin_user_id INTEGER REFERENCES admin_users (id) ON DELETE SET NULL,
  admin_username TEXT NOT NULL,
  changes JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_events_order_id ON order_events (order_id, created_at);
