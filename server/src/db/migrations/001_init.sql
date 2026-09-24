-- mitec — initial schema

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Every saved pricing document, so an order's pricing_version can always be
-- looked up later even after the admin panel changes prices again.
-- The "current" document is simply the row with the highest version.
-- `version` is assigned by the application (not SERIAL) so it always equals
-- the `version` field inside `document` itself.
CREATE TABLE IF NOT EXISTS pricing_versions (
  version INTEGER PRIMARY KEY,
  document JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS uploads (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  tracking_code TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'received',
  status_label TEXT NOT NULL DEFAULT 'دریافت شد',
  estimate_weeks INTEGER,
  notes TEXT NOT NULL DEFAULT '',

  site_type TEXT NOT NULL,
  pages INTEGER,
  addons JSONB NOT NULL DEFAULT '[]',
  pricing_version INTEGER,
  template TEXT,
  mixed_description TEXT NOT NULL DEFAULT '',
  sections JSONB NOT NULL DEFAULT '[]',
  features JSONB NOT NULL DEFAULT '[]',
  style JSONB NOT NULL DEFAULT '{}',
  assets JSONB NOT NULL DEFAULT '{}',

  business_name TEXT NOT NULL,
  business_field TEXT NOT NULL DEFAULT '',
  business_handle TEXT NOT NULL DEFAULT '',
  business_refs TEXT NOT NULL DEFAULT '',
  business_desc TEXT NOT NULL DEFAULT '',
  business_phone TEXT NOT NULL,

  attachments JSONB NOT NULL DEFAULT '[]',
  meta JSONB NOT NULL DEFAULT '{}',

  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orders_business_phone ON orders (business_phone);
