import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, type DbUser } from "@/lib/supabase";
import {
  sanitizeUser,
  issueTokenPair,
  setAuthCookies,
  getAccessTokenFromCookies,
} from "@/lib/auth-helpers";
import { verifyAccessToken } from "@/lib/jwt";

// ── Validation schema ────────────────────────────────────────────────────────

const BecomeOwnerSchema = z.object({
  nin: z
    .string()
    .length(11, "NIN must be exactly 11 digits")
    .regex(/^\d{11}$/, "NIN must contain only digits")
    .optional(),
  location: z
    .string()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location is too long")
    .trim()
    .optional(),
});

// ── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // Require authentication
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

    // Require email verification
    if (!payload.is_email_verified) {
      return NextResponse.json(
        { error: "Please verify your email address before listing assets." },
        { status: 403 }
      );
    }

    // Parse optional body
    let body: unknown = {};
    try {
      body = await req.json();
    } catch {
      // Empty body is fine — nin and location are optional
    }

    const parsed = BecomeOwnerSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 422 }
      );
    }

    const { nin, location } = parsed.data;
    const supabase = getSupabase();

    // Fetch current user
    const { data: rawUser, error: fetchError } = await supabase
      .from("users")
      .select()
      .eq("id", payload.sub)
      .eq("is_active", true)
      .single();

    if (fetchError || !rawUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const user = rawUser as unknown as DbUser;

    // Already an owner — idempotent
    if (user.role.includes("owner")) {
      return NextResponse.json(
        { message: "You are already registered as an owner.", user: sanitizeUser(user) },
        { status: 200 }
      );
    }

    // Build update payload
    const updateData: Record<string, unknown> = {
      role: [...user.role, "owner"],
    };

    if (nin) {
      updateData.nin = nin;
      updateData.nin_submitted_at = new Date().toISOString();
      updateData.verification_status = "pending";
    }

    if (location) {
      updateData.location = location;
    }

    // Update user
    const { data: rawUpdated, error: updateError } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", user.id)
      .select()
      .single();

    if (updateError || !rawUpdated) {
      console.error("[become-owner] Update error:", updateError);
      return NextResponse.json(
        { error: "Failed to update account. Please try again." },
        { status: 500 }
      );
    }

    const updatedUser = rawUpdated as unknown as DbUser;

    // Re-issue tokens so "owner" role is in the JWT
    const { accessToken: newAccess, refreshToken: newRefresh } =
      await issueTokenPair(updatedUser);

    const response = NextResponse.json(
      {
        message: nin
          ? "Owner account activated. Your NIN is under review."
          : "Owner account activated.",
        user: sanitizeUser(updatedUser),
      },
      { status: 200 }
    );

    return setAuthCookies(response, newAccess, newRefresh);
  } catch (err) {
    console.error("[become-owner] Unexpected error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
