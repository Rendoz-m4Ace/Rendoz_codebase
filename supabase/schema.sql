-- ============================================================
-- RENDOZ AUTH SCHEMA
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- Enable pgcrypto for gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- ENUM TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('renter', 'owner', 'admin');
CREATE TYPE verification_status AS ENUM ('unverified', 'pending', 'verified', 'rejected');
CREATE TYPE otp_purpose AS ENUM ('email_verification', 'password_reset');

-- ============================================================
-- USERS TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       TEXT NOT NULL,
  email           TEXT NOT NULL UNIQUE,
  phone           TEXT NOT NULL UNIQUE,       -- stored in local format e.g. 08012345678
  password_hash   TEXT NOT NULL,
  role            user_role[] NOT NULL DEFAULT ARRAY['renter']::user_role[],
  is_email_verified   BOOLEAN NOT NULL DEFAULT FALSE,
  verification_status verification_status NOT NULL DEFAULT 'unverified',
  nin             TEXT,                        -- National ID Number (optional, triggers pending review)
  nin_submitted_at TIMESTAMPTZ,
  profile_photo   TEXT,                        -- URL to storage
  location        TEXT,                        -- e.g. "Ikeja, Lagos"
  profile         JSONB NOT NULL DEFAULT '{}'::jsonb, -- owner profile details (see component/dashboard/profile/types.ts)
  profile_completed BOOLEAN NOT NULL DEFAULT FALSE,  -- owner setup finished; unlocks listing
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_email   ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_phone   ON users (phone);

-- ============================================================
-- OTP CODES TABLE
-- ============================================================

CREATE TABLE IF NOT EXISTS otp_codes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code        TEXT NOT NULL,                   -- 6-digit code (hashed)
  purpose     otp_purpose NOT NULL,
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_user_purpose ON otp_codes (user_id, purpose);

-- ============================================================
-- REFRESH TOKENS TABLE
-- (Access tokens are short-lived JWTs; refresh tokens are
--  long-lived, stored here so we can revoke them)
-- ============================================================

CREATE TABLE IF NOT EXISTS refresh_tokens (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL UNIQUE,            -- SHA-256 of the raw token
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user   ON refresh_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_hash   ON refresh_tokens (token_hash);

-- ============================================================
-- updated_at TRIGGER (auto-updates timestamp on any row change)
-- ============================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE otp_codes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;

-- We use the service role key on the server, so we bypass RLS.
-- These policies are a safety net for direct client access (not used).
CREATE POLICY "No direct client access on users"
  ON users FOR ALL USING (FALSE);

CREATE POLICY "No direct client access on otp_codes"
  ON otp_codes FOR ALL USING (FALSE);

CREATE POLICY "No direct client access on refresh_tokens"
  ON refresh_tokens FOR ALL USING (FALSE);
