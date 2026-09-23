import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, type DbUser, type DbOtpCode } from "@/lib/supabase";
import { verifyOtpCode } from "@/lib/otp";
import {
  sanitizeUser,
  issueTokenPair,
  setAuthCookies,
  getAccessTokenFromCookies,
} from "@/lib/auth-helpers";
import { verifyAccessToken } from "@/lib/jwt";

// ── Validation schema ────────────────────────────────────────────────────────

const VerifyEmailSchema = z.object({
  code: z
    .string()
    .length(6, "Verification code must be 6 digits")
    .regex(/^\d{6}$/, "Verification code must contain only digits"),
});

// ── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // Authenticate via access token cookie
    const accessToken = await getAccessTokenFromCookies();
    if (!accessToken) {
      return NextResponse.json(
        { error: "Authentication required. Please log in." },
        { status: 401 }
      );
    }

    const tokenPayload = await verifyAccessToken(accessToken);
    if (!tokenPayload) {
      return NextResponse.json(
        { error: "Session expired. Please log in again." },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = VerifyEmailSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const { code } = parsed.data;
    const supabase = getSupabase();
    const userId = tokenPayload.sub;

    // Check current user
    const { data: rawUser, error: userError } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .eq("is_active", true)
      .single();

    if (userError || !rawUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const user = rawUser as unknown as DbUser;

    if (user.is_email_verified) {
      return NextResponse.json(
        { message: "Email is already verified.", user: sanitizeUser(user) },
        { status: 200 }
      );
    }

    // Find latest valid OTP
    const { data: otpRows, error: otpFetchError } = await supabase
      .from("otp_codes")
      .select()
      .eq("user_id", userId)
      .eq("purpose", "email_verification")
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    if (otpFetchError || !otpRows || otpRows.length === 0) {
      return NextResponse.json(
        { error: "No valid verification code found. Please request a new one." },
        { status: 400 }
      );
    }

    const otpRow = otpRows[0] as unknown as DbOtpCode;

    // Verify code
    const isValid = await verifyOtpCode(code, otpRow.code);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // Mark OTP as used
    await supabase
      .from("otp_codes")
      .update({ used: true })
      .eq("id", otpRow.id);

    // Mark user as verified
    const { data: rawUpdated, error: updateError } = await supabase
      .from("users")
      .update({
        is_email_verified: true,
        verification_status: "pending",
      })
      .eq("id", userId)
      .select()
      .single();

    if (updateError || !rawUpdated) {
      console.error("[verify-email] Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to verify email. Please try again." },
        { status: 500 }
      );
    }

    const updatedUser = rawUpdated as unknown as DbUser;

    // Re-issue tokens so is_email_verified=true is in the JWT
    const { accessToken: newAccess, refreshToken: newRefresh } =
      await issueTokenPair(updatedUser);

    const response = NextResponse.json(
      {
        message: "Email verified successfully.",
        user: sanitizeUser(updatedUser),
      },
      { status: 200 }
    );

    return setAuthCookies(response, newAccess, newRefresh);
  } catch (err) {
    console.error("[verify-email] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
