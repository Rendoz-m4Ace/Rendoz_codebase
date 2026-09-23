import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, type DbUser } from "@/lib/supabase";
import {
  comparePassword,
  sanitizeUser,
  issueTokenPair,
  setAuthCookies,
} from "@/lib/auth-helpers";

// ── Validation schema ────────────────────────────────────────────────────────

const LoginSchema = z.object({
  // Accept either email or phone
  identifier: z.string().min(1, "Email or phone number is required").trim(),
  password: z.string().min(1, "Password is required"),
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

    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const { identifier, password } = parsed.data;
    const supabase = getSupabase();

    // Look up user by email OR phone
    const isEmail = identifier.includes("@");
    const lookupKey = isEmail ? "email" : "phone";
    const lookupVal = isEmail ? identifier.toLowerCase() : identifier;

    const { data: rawUser, error: lookupError } = await supabase
      .from("users")
      .select()
      .eq(lookupKey, lookupVal)
      .maybeSingle();

    if (lookupError) {
      console.error("[login] Lookup error:", lookupError);
      return NextResponse.json(
        { error: "An error occurred. Please try again." },
        { status: 500 }
      );
    }

    // Generic message — don't reveal whether the account exists
    if (!rawUser) {
      return NextResponse.json(
        { error: "Invalid credentials. Please check and try again." },
        { status: 401 }
      );
    }

    const user = rawUser as unknown as DbUser;

    if (!user.is_active) {
      return NextResponse.json(
        { error: "Your account has been suspended. Please contact support." },
        { status: 403 }
      );
    }

    // Verify password
    const passwordMatch = await comparePassword(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials. Please check and try again." },
        { status: 401 }
      );
    }

    // Issue token pair
    const { accessToken, refreshToken } = await issueTokenPair(user);

    const response = NextResponse.json(
      {
        message: "Logged in successfully.",
        user: sanitizeUser(user),
      },
      { status: 200 }
    );

    return setAuthCookies(response, accessToken, refreshToken);
  } catch (err) {
    console.error("[login] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
