import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, type OtpPurpose } from "@/lib/supabase";
import {
  generateOtpCode,
  hashOtpCode,
  otpExpiresAt,
  sendOtpEmail,
} from "@/lib/otp";
import { getAccessTokenFromCookies } from "@/lib/auth-helpers";
import { verifyAccessToken } from "@/lib/jwt";

// ── Constants ────────────────────────────────────────────────────────────────

const RESEND_COOLDOWN_SECONDS = 60;

// ── Validation schema ────────────────────────────────────────────────────────

const ResendOtpSchema = z.object({
  purpose: z.enum(["email_verification", "password_reset"]),
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim()
    .optional(),
});

// ── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = ResendOtpSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const { purpose, email } = parsed.data;
    const supabase = getSupabase();
    let userId: string;
    let userEmail: string;
    let userName: string;

    if (purpose === "email_verification") {
      // Must be authenticated
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

      const { data: rawUser, error } = await supabase
        .from("users")
        .select("id, full_name, email, is_email_verified, is_active")
        .eq("id", payload.sub)
        .single();

      if (error || !rawUser) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      const u = rawUser as { id: string; full_name: string; email: string; is_email_verified: boolean; is_active: boolean };

      if (!u.is_active) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      if (u.is_email_verified) {
        return NextResponse.json({ error: "Email is already verified." }, { status: 400 });
      }

      userId = u.id;
      userEmail = u.email;
      userName = u.full_name;
    } else {
      // password_reset — email required in body
      if (!email) {
        return NextResponse.json(
          { error: "Email address is required for password reset." },
          { status: 422 }
        );
      }

      const { data: rawUser } = await supabase
        .from("users")
        .select("id, full_name, email, is_active")
        .eq("email", email)
        .eq("is_active", true)
        .maybeSingle();

      // Anti-enumeration: same response regardless
      if (!rawUser) {
        return NextResponse.json(
          { message: "If that email is registered, a new code has been sent." },
          { status: 200 }
        );
      }

      const u = rawUser as { id: string; full_name: string; email: string; is_active: boolean };
      userId = u.id;
      userEmail = u.email;
      userName = u.full_name;
    }

    // Rate-limit check
    const cooldownThreshold = new Date(
      Date.now() - RESEND_COOLDOWN_SECONDS * 1000
    ).toISOString();

    const { data: recentOtp } = await supabase
      .from("otp_codes")
      .select("created_at")
      .eq("user_id", userId)
      .eq("purpose", purpose as OtpPurpose)
      .gt("created_at", cooldownThreshold)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (recentOtp) {
      const r = recentOtp as { created_at: string };
      const secondsAgo = Math.floor((Date.now() - new Date(r.created_at).getTime()) / 1000);
      const waitSeconds = RESEND_COOLDOWN_SECONDS - secondsAgo;
      return NextResponse.json(
        {
          error: `Please wait ${waitSeconds} second${waitSeconds !== 1 ? "s" : ""} before requesting a new code.`,
        },
        { status: 429 }
      );
    }

    // Invalidate previous unused OTPs
    await supabase
      .from("otp_codes")
      .update({ used: true })
      .eq("user_id", userId)
      .eq("purpose", purpose as OtpPurpose)
      .eq("used", false);

    // Generate + store new OTP
    const plainOtp = generateOtpCode();
    const otpHash = await hashOtpCode(plainOtp);
    const expiresAt = otpExpiresAt();

    const { error: insertError } = await supabase.from("otp_codes").insert({
      user_id: userId,
      code: otpHash,
      purpose: purpose as OtpPurpose,
      expires_at: expiresAt.toISOString(),
    });

    if (insertError) {
      console.error("[resend-otp] Insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to generate new code. Please try again." },
        { status: 500 }
      );
    }

    sendOtpEmail({
      to: userEmail,
      fullName: userName,
      code: plainOtp,
      purpose: purpose as OtpPurpose,
    }).catch((err) => console.error("[resend-otp] Email error:", err));

    return NextResponse.json(
      { message: "A new verification code has been sent to your email." },
      { status: 200 }
    );
  } catch (err) {
    console.error("[resend-otp] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
