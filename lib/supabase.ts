import { createClient } from "@supabase/supabase-js";

// ── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "renter" | "owner" | "admin";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";
export type OtpPurpose = "email_verification" | "password_reset";

export interface DbUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: UserRole[];
  is_email_verified: boolean;
  verification_status: VerificationStatus;
  nin: string | null;
  nin_submitted_at: string | null;
  profile_photo: string | null;
  location: string | null;
  /** Owner profile details; shape matches ProfileData in component/dashboard/profile/types.ts */
  profile: Record<string, unknown> | null;
  profile_completed: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbOtpCode {
  id: string;
  user_id: string;
  code: string;          // stored as bcrypt hash
  purpose: OtpPurpose;
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface DbRefreshToken {
  id: string;
  user_id: string;
  token_hash: string;    // SHA-256 of the raw token
  expires_at: string;
  revoked: boolean;
  created_at: string;
}

// ── Client singleton ─────────────────────────────────────────────────────────

function getSupabaseUrl(): string {
  const url = process.env.SUPABASE_URL;
  if (!url) throw new Error("Missing env: SUPABASE_URL");
  return url;
}

function getSupabaseServiceKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
  return key;
}

// Server-only client that bypasses Row Level Security.
// Never expose this to the browser.
let _supabase: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(getSupabaseUrl(), getSupabaseServiceKey(), {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _supabase;
}
