import { NextResponse } from "next/server";
import { getSupabase, type DbUser, type DbRefreshToken } from "@/lib/supabase";
import {
  hashToken,
  sanitizeUser,
  issueTokenPair,
  setAuthCookies,
  clearAuthCookies,
  getRefreshTokenFromCookies,
} from "@/lib/auth-helpers";
import { verifyRefreshToken } from "@/lib/jwt";

// ── Handler ──────────────────────────────────────────────────────────────────

export async function POST() {
  const UNAUTHORISED = () => {
    const res = NextResponse.json(
      { error: "Session expired. Please log in again." },
      { status: 401 }
    );
    return clearAuthCookies(res);
  };

  try {
    const rawRefreshToken = await getRefreshTokenFromCookies();
    if (!rawRefreshToken) return UNAUTHORISED();

    const payload = await verifyRefreshToken(rawRefreshToken);
    if (!payload?.jti || !payload?.sub) return UNAUTHORISED();

    const supabase = getSupabase();
    const tokenHash = hashToken(rawRefreshToken);

    // Look up token in DB — must not be revoked
    const { data: rawStored, error: tokenError } = await supabase
      .from("refresh_tokens")
      .select()
      .eq("id", payload.jti)
      .eq("token_hash", tokenHash)
      .eq("revoked", false)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (tokenError || !rawStored) return UNAUTHORISED();

    const storedToken = rawStored as unknown as DbRefreshToken;

    // Revoke old token (rotation)
    await supabase
      .from("refresh_tokens")
      .update({ revoked: true })
      .eq("id", storedToken.id);

    // Fetch fresh user
    const { data: rawUser, error: userError } = await supabase
      .from("users")
      .select()
      .eq("id", payload.sub)
      .eq("is_active", true)
      .single();

    if (userError || !rawUser) return UNAUTHORISED();

    const user = rawUser as unknown as DbUser;

    // Issue new token pair
    const { accessToken, refreshToken } = await issueTokenPair(user);

    const response = NextResponse.json(
      { message: "Token refreshed.", user: sanitizeUser(user) },
      { status: 200 }
    );

    return setAuthCookies(response, accessToken, refreshToken);
  } catch (err) {
    console.error("[refresh] Unexpected error:", err);
    return UNAUTHORISED();
  }
}
