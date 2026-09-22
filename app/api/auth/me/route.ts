import { NextResponse } from "next/server";
import { getSupabase, type DbUser } from "@/lib/supabase";
import { sanitizeUser, getAccessTokenFromCookies } from "@/lib/auth-helpers";
import { verifyAccessToken } from "@/lib/jwt";

// ── Handler ──────────────────────────────────────────────────────────────────

export async function GET() {
  try {
    const accessToken = await getAccessTokenFromCookies();
    if (!accessToken) {
      return NextResponse.json({ error: "Authentication required." }, { status: 401 });
    }

    const payload = await verifyAccessToken(accessToken);
    if (!payload) {
      return NextResponse.json(
        { error: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    const supabase = getSupabase();
    const { data: rawUser, error } = await supabase
      .from("users")
      .select()
      .eq("id", payload.sub)
      .eq("is_active", true)
      .single();

    if (error || !rawUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(
      { user: sanitizeUser(rawUser as unknown as DbUser) },
      { status: 200 }
    );
  } catch (err) {
    console.error("[me] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
