import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import {
  hashToken,
  clearAuthCookies,
  getRefreshTokenFromCookies,
} from "@/lib/auth-helpers";
import { verifyRefreshToken } from "@/lib/jwt";

// ── Handler ──────────────────────────────────────────────────────────────────

export async function POST() {
  try {
    const supabase = getSupabase();
    const rawRefreshToken = await getRefreshTokenFromCookies();

    if (rawRefreshToken) {
      const payload = await verifyRefreshToken(rawRefreshToken);

      if (payload?.jti) {
        const tokenHash = hashToken(rawRefreshToken);
        await supabase
          .from("refresh_tokens")
          .update({ revoked: true })
          .eq("token_hash", tokenHash)
          .eq("id", payload.jti);
      }
    }

    const response = NextResponse.json(
      { message: "Logged out successfully." },
      { status: 200 }
    );

    return clearAuthCookies(response);
  } catch (err) {
    console.error("[logout] Unexpected error:", err);
    const response = NextResponse.json({ message: "Logged out." }, { status: 200 });
    return clearAuthCookies(response);
  }
}
