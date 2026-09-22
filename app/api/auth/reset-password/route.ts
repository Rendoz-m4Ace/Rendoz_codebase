import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { getSupabase, type DbOtpCode } from "@/lib/supabase";
import { verifyOtpCode } from "@/lib/otp";
import { hashPassword, clearAuthCookies } from "@/lib/auth-helpers";

// ── Validation schema ────────────────────────────────────────────────────────

const ResetPasswordSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  code: z
    .string()
    .length(6, "Reset code must be 6 digits")
    .regex(/^\d{6}$/, "Reset code must contain only digits"),
  new_password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
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

    const parsed = ResetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const { email, code, new_password } = parsed.data;
    const supabase = getSupabase();

    // Look up user
    const { data: rawUser, error: userError } = await supabase
      .from("users")
      .select("id, email, password_hash, is_active")
      .eq("email", email)
      .eq("is_active", true)
      .maybeSingle();

    if (userError || !rawUser) {
      return NextResponse.json(
        { error: "Invalid or expired reset code." },
        { status: 400 }
      );
    }

    const user = rawUser as { id: string; email: string; password_hash: string; is_active: boolean };

    // Find latest valid password-reset OTP
    const { data: otpRows, error: otpError } = await supabase
      .from("otp_codes")
      .select()
      .eq("user_id", user.id)
      .eq("purpose", "password_reset")
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1);

    if (otpError || !otpRows || otpRows.length === 0) {
      return NextResponse.json(
        { error: "Invalid or expired reset code." },
        { status: 400 }
      );
    }

    const otpRow = otpRows[0] as unknown as DbOtpCode;

    // Verify code
    const isValid = await verifyOtpCode(code, otpRow.code);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid or expired reset code." },
        { status: 400 }
      );
    }

    // Ensure new password differs from current
    const isSamePassword = await bcrypt.compare(new_password, user.password_hash);
    if (isSamePassword) {
      return NextResponse.json(
        { error: "New password must be different from your current password." },
        { status: 422 }
      );
    }

    // Hash and save new password
    const newHash = await hashPassword(new_password);

    const { error: updateError } = await supabase
      .from("users")
      .update({ password_hash: newHash })
      .eq("id", user.id);

    if (updateError) {
      console.error("[reset-password] Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to reset password. Please try again." },
        { status: 500 }
      );
    }

    // Mark OTP as used
    await supabase
      .from("otp_codes")
      .update({ used: true })
      .eq("id", otpRow.id);

    // Revoke all refresh tokens — force re-login everywhere
    await supabase
      .from("refresh_tokens")
      .update({ revoked: true })
      .eq("user_id", user.id)
      .eq("revoked", false);

    const response = NextResponse.json(
      { message: "Password reset successfully. Please log in with your new password." },
      { status: 200 }
    );

    return clearAuthCookies(response);
  } catch (err) {
    console.error("[reset-password] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
