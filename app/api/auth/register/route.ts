import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, type DbUser } from "@/lib/supabase";
import {
  hashPassword,
  isValidNigerianPhone,
  sanitizeUser,
  issueTokenPair,
  setAuthCookies,
} from "@/lib/auth-helpers";
import {
  generateOtpCode,
  hashOtpCode,
  otpExpiresAt,
  sendOtpEmail,
  isEmailDeliveryEnabled,
} from "@/lib/otp";

// ── Validation schema ────────────────────────────────────────────────────────

const RegisterSchema = z.object({
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long")
    .trim(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  phone: z
    .string()
    .trim()
    .refine(isValidNigerianPhone, {
      message: "Enter a valid Nigerian phone number (e.g. 08012345678)",
    }),
  password: z
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

    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const { full_name, email, phone, password } = parsed.data;
    const supabase = getSupabase();

    // Check for existing email
    const { data: existingEmail } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Check for existing phone
    const { data: existingPhone } = await supabase
      .from("users")
      .select("id")
      .eq("phone", phone)
      .maybeSingle();

    if (existingPhone) {
      return NextResponse.json(
        { error: "An account with this phone number already exists." },
        { status: 409 }
      );
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const { data: newUser, error: createError } = await supabase
      .from("users")
      .insert({
        full_name,
        email,
        phone,
        password_hash,
        role: ["renter"],
        is_email_verified: false,
        verification_status: "unverified",
        is_active: true,
      })
      .select()
      .single();

    if (createError || !newUser) {
      console.error("[register] Create user error:", createError);
      return NextResponse.json(
        { error: "Failed to create account. Please try again." },
        { status: 500 }
      );
    }

    const user = newUser as unknown as DbUser;

    // Generate + store OTP for email verification
    const plainOtp = generateOtpCode();
    const otpHash = await hashOtpCode(plainOtp);
    const expiresAt = otpExpiresAt();

    // Invalidate any previous unused OTPs
    await supabase
      .from("otp_codes")
      .update({ used: true })
      .eq("user_id", user.id)
      .eq("purpose", "email_verification")
      .eq("used", false);

    const { error: otpError } = await supabase.from("otp_codes").insert({
      user_id: user.id,
      code: otpHash,
      purpose: "email_verification",
      expires_at: expiresAt.toISOString(),
    });

    // Awaited so a serverless function isn't frozen before the email goes out.
    // A failed send doesn't fail sign-up: the user can request a new code.
    let codeSent = false;
    if (otpError) {
      console.error("[register] OTP insert error:", otpError);
    } else {
      try {
        await sendOtpEmail({
          to: user.email,
          fullName: user.full_name,
          code: plainOtp,
          purpose: "email_verification",
        });
        codeSent = isEmailDeliveryEnabled();
      } catch (err) {
        console.error("[register] OTP email error:", err);
      }
    }

    // Issue token pair and set cookies
    const { accessToken, refreshToken } = await issueTokenPair(user);

    const response = NextResponse.json(
      {
        message: "Account created successfully. Please verify your email.",
        user: sanitizeUser(user),
        // Lets the sign-up page explain where the code is when email isn't set up
        verification_email: codeSent ? "sent" : "not_sent",
      },
      { status: 201 }
    );

    return setAuthCookies(response, accessToken, refreshToken);
  } catch (err) {
    console.error("[register] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
