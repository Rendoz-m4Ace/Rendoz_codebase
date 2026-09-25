import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken } from "@/lib/jwt";

// ── Route config ─────────────────────────────────────────────────────────────

/**
 * Routes that require a valid, verified (is_email_verified = true) JWT.
 * Middleware runs on every path matched by `config.matcher` below.
 */
const PROTECTED_ROUTES: string[] = [
  "/api/auth/me",
  "/api/auth/become-owner",
  // Future protected API routes go here, e.g.:
  // "/api/listings",
  // "/api/bookings",
];

/**
 * Routes that require auth but do NOT require email verification.
 * (e.g., verify-email itself, resend-otp for email_verification purpose)
 */
const AUTH_ONLY_ROUTES: string[] = [
  "/api/auth/verify-email",
  "/api/auth/resend-otp",
];

// Admin routes — protected by the existing Redis session system (unchanged)
// Nothing here changes the /api/admin/* behavior.

// ── Helper ───────────────────────────────────────────────────────────────────

function getAccessToken(req: NextRequest): string | undefined {
  return req.cookies.get("rendoz_access_token")?.value;
}

// ── Middleware ────────────────────────────────────────────────────────────────

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_ROUTES.some((p) => pathname.startsWith(p));
  const isAuthOnly  = AUTH_ONLY_ROUTES.some((p) => pathname.startsWith(p));

  // Not a guarded route — pass through
  if (!isProtected && !isAuthOnly) {
    return NextResponse.next();
  }

  const token = getAccessToken(req);

  // No token at all
  if (!token) {
    return NextResponse.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  const payload = await verifyAccessToken(token);

  // Invalid or expired token
  if (!payload) {
    return NextResponse.json(
      { error: "Session expired. Please log in again." },
      { status: 401 }
    );
  }

  // Fully protected routes also require email verification
  if (isProtected && !payload.is_email_verified) {
    return NextResponse.json(
      {
        error: "Please verify your email address to continue.",
        code: "EMAIL_NOT_VERIFIED",
      },
      { status: 403 }
    );
  }

  // Attach user context to request headers so route handlers can read it
  // without re-verifying the token
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id",             payload.sub);
  requestHeaders.set("x-user-email",          payload.email);
  requestHeaders.set("x-user-role",           JSON.stringify(payload.role));
  requestHeaders.set("x-email-verified",      String(payload.is_email_verified));

  return NextResponse.next({ request: { headers: requestHeaders } });
}

// ── Matcher ───────────────────────────────────────────────────────────────────
// Only run middleware on API routes that need protection.
// This avoids touching frontend pages or public API routes.

export const config = {
  matcher: [
    "/api/auth/me",
    "/api/auth/verify-email",
    "/api/auth/resend-otp",
    "/api/auth/become-owner",
    // Add more protected routes here as the app grows
  ],
};
