-- ============================================================
-- Drop leftover columns from the pre-Supabase-auth users table
-- ============================================================
-- Run once in the Supabase SQL editor, after repair-existing-schema.sql.
--
-- These columns came from an older (Clerk-based) setup. Nothing in the app
-- reads or writes them: auth now uses full_name, role, is_active and the
-- otp_codes table. When this was written, every row held only null/default
-- values in them (roles = {guest}, active_role = guest, status = active).
--
-- No CASCADE on purpose: if a policy, view or trigger still depends on one of
-- these columns, the whole transaction fails and nothing is dropped.
-- ============================================================

BEGIN;

ALTER TABLE public.users
  DROP COLUMN IF EXISTS clerk_id,
  DROP COLUMN IF EXISTS name,
  DROP COLUMN IF EXISTS roles,
  DROP COLUMN IF EXISTS active_role,
  DROP COLUMN IF EXISTS email_verified_at,
  DROP COLUMN IF EXISTS status,
  DROP COLUMN IF EXISTS otp_code,
  DROP COLUMN IF EXISTS otp_expires_at;

-- Kept on purpose: profile (JSONB) and profile_completed hold the owner
-- profile and are used by the dashboard.

COMMIT;
