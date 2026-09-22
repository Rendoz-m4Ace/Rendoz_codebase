import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import {
  generateOtpCode,
  hashOtpCode,
  otpExpiresAt,
  sendOtpEmail,
} from "@/lib/otp";

// ── Validation schema ────────────────────────────────────────────────────────

const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
});

// ── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  // Always return 200 to prevent email enumeration attacks
  const SAFE_RESPONSE = NextResponse.json(
    { message: "If that email is registered, you'll receive a reset code shortly." },
    { status: 200 }
  );

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = ForgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const { email } = parsed.data;
    const supabase = getSupabase();

    const { data: rawUser } = await supabase
      .from("users")
      .select("id, full_name, email, is_active")
      .eq("email", email)
      .eq("is_active", true)
      .maybeSingle();

    if (!rawUser) return SAFE_RESPONSE;

    const user = rawUser as { id: string; full_name: string; email: string; is_active: boolean };

    // Invalidate previous unused reset OTPs
    await supabase
      .from("otp_codes")
      .update({ used: true })
      .eq("user_id", user.id)
      .eq("purpose", "password_reset")
      .eq("used", false);

    // Generate + store new OTP
    const plainOtp = generateOtpCode();
    const otpHash = await hashOtpCode(plainOtp);
    const expiresAt = otpExpiresAt();

    const { error: otpError } = await supabase.from("otp_codes").insert({
      user_id: user.id,
      code: otpHash,
      purpose: "password_reset",
      expires_at: expiresAt.toISOString(),
    });

    if (otpError) {
      console.error("[forgot-password] OTP insert error:", otpError);
      return SAFE_RESPONSE;
    }

    sendOtpEmail({
      to: user.email,
      fullName: user.full_name,
      code: plainOtp,
      purpose: "password_reset",
    }).catch((err) => console.error("[forgot-password] Email error:", err));

    return SAFE_RESPONSE;
  } catch (err) {
    console.error("[forgot-password] Unexpected error:", err);
    return SAFE_RESPONSE;
  }
}
