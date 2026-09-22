import bcrypt from "bcryptjs";
import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { DbUser } from "./supabase";
import { signAccessToken, signRefreshToken, refreshTokenExpiresAt } from "./jwt";
import { getSupabase } from "./supabase";

// ── Constants ────────────────────────────────────────────────────────────────

const BCRYPT_ROUNDS = 12;
const ACCESS_COOKIE_NAME = "rendoz_access_token";
const REFRESH_COOKIE_NAME = "rendoz_refresh_token";

// Access token cookie: 15 min
const ACCESS_COOKIE_MAX_AGE = 15 * 60;
// Refresh token cookie: 30 days
const REFRESH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

const IS_PRODUCTION = process.env.NODE_ENV === "production";

// ── Password ─────────────────────────────────────────────────────────────────

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export async function comparePassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// ── Token hashing ────────────────────────────────────────────────────────────

/** SHA-256 hash a token for safe storage in the DB. */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// ── Safe public user ─────────────────────────────────────────────────────────

/** Strips sensitive fields before returning user data to the client. */
export function sanitizeUser(user: DbUser) {
  const {
    password_hash: _pw,
    ...safe
  } = user;
  return safe;
}

// ── Cookie helpers ───────────────────────────────────────────────────────────

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: IS_PRODUCTION,
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

/**
 * Attach access + refresh token cookies to a NextResponse.
 * Call this after login or token refresh.
 */
export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string
): NextResponse {
  response.cookies.set(
    ACCESS_COOKIE_NAME,
    accessToken,
    cookieOptions(ACCESS_COOKIE_MAX_AGE)
  );
  response.cookies.set(
    REFRESH_COOKIE_NAME,
    refreshToken,
    cookieOptions(REFRESH_COOKIE_MAX_AGE)
  );
  return response;
}

/** Clear both auth cookies (used on logout). */
export function clearAuthCookies(response: NextResponse): NextResponse {
  response.cookies.set(ACCESS_COOKIE_NAME, "", { ...cookieOptions(0), maxAge: 0 });
  response.cookies.set(REFRESH_COOKIE_NAME, "", { ...cookieOptions(0), maxAge: 0 });
  return response;
}

/** Read the access token from the incoming request cookies. */
export async function getAccessTokenFromCookies(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE_NAME)?.value;
}

/** Read the refresh token from the incoming request cookies. */
export async function getRefreshTokenFromCookies(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(REFRESH_COOKIE_NAME)?.value;
}

// ── Issue token pair ─────────────────────────────────────────────────────────

/**
 * Signs a fresh access + refresh token pair for a user,
 * persists the refresh token in the DB, and returns both raw tokens.
 */
export async function issueTokenPair(user: DbUser): Promise<{
  accessToken: string;
  refreshToken: string;
}> {
  const supabase = getSupabase();

  // 1. Sign access token
  const accessToken = await signAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    is_email_verified: user.is_email_verified,
  });

  // 2. Sign refresh token — we need the DB id first so we can put it in jti
  //    Insert a placeholder row, then update jti once we have both the id and token.
  const expiresAt = refreshTokenExpiresAt();

  // Generate raw refresh token value
  const rawRefreshToken = crypto.randomBytes(64).toString("hex");
  const tokenHash = hashToken(rawRefreshToken);

  // 3. Store hashed refresh token in DB
  const { data: rtRow, error } = await supabase
    .from("refresh_tokens")
    .insert({
      user_id: user.id,
      token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
    })
    .select("id")
    .single();

  if (error || !rtRow) {
    throw new Error("Failed to persist refresh token.");
  }

  // 4. Sign the actual refresh JWT with the DB row id as jti
  const refreshToken = await signRefreshToken({
    sub: user.id,
    jti: rtRow.id,
  });

  return { accessToken, refreshToken };
}

// ── Validation helpers ───────────────────────────────────────────────────────

/** Nigerian local phone format: 11 digits, starts with 0. */
export function isValidNigerianPhone(phone: string): boolean {
  return /^0[789][01]\d{8}$/.test(phone);
}

/** Basic email format check (Zod handles the heavy lifting). */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
