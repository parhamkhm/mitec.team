-- Admin account security.
--
-- session_version: copied into each session token and checked on every
-- admin request. Changing the password (or re-running seed:admin) bumps it,
-- which ends every other session at once. Tokens issued before this
-- migration carry no version, so everyone signs in once more.
--
-- failed_logins / locked_until: after too many wrong passwords in a row the
-- account is locked for a while, on top of the per-IP rate limit, so a
-- slow attack spread over many addresses still can't keep guessing.

ALTER TABLE admin_users
  ADD COLUMN session_version INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN failed_logins INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN locked_until TIMESTAMPTZ;
