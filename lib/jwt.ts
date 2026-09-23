import { SignJWT, jwtVerify, type JWTPayload } from "jose";

// ── Config ───────────────────────────────────────────────────────────────────

function getAccessSecret(): Uint8Array {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) throw new Error("Missing env: JWT_ACCESS_SECRET");
  return new TextEncoder().encode(secret);
}

function getRefreshSecret(): Uint8Array {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) throw new Error("Missing env: JWT_REFRESH_SECRET");
  return new TextEncoder().encode(secret);
}

// Access token: short-lived (15 minutes)
const ACCESS_TOKEN_TTL  = "15m";
// Refresh token: long-lived (30 days)
const REFRESH_TOKEN_TTL = "30d";

// ── Payload shape ────────────────────────────────────────────────────────────

export interface AccessTokenPayload extends JWTPayload {
  sub: string;           // user id
  email: string;
  role: string[];        // e.g. ["renter"] or ["renter","owner"]
  is_email_verified: boolean;
}

export interface RefreshTokenPayload extends JWTPayload {
  sub: string;           // user id
  jti: string;           // refresh token id (matches refresh_tokens.id in DB)
}

// ── Sign ─────────────────────────────────────────────────────────────────────

export async function signAccessToken(
  payload: Omit<AccessTokenPayload, "iat" | "exp">
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .setIssuer("rendoz")
    .setAudience("rendoz-client")
    .sign(getAccessSecret());
}

export async function signRefreshToken(
  payload: Omit<RefreshTokenPayload, "iat" | "exp">
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(REFRESH_TOKEN_TTL)
    .setIssuer("rendoz")
    .setAudience("rendoz-client")
    .sign(getRefreshSecret());
}

// ── Verify ───────────────────────────────────────────────────────────────────

export async function verifyAccessToken(
  token: string
): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getAccessSecret(), {
      issuer: "rendoz",
      audience: "rendoz-client",
    });
    return payload as AccessTokenPayload;
  } catch {
    return null;
  }
}

export async function verifyRefreshToken(
  token: string
): Promise<RefreshTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getRefreshSecret(), {
      issuer: "rendoz",
      audience: "rendoz-client",
    });
    return payload as RefreshTokenPayload;
  } catch {
    return null;
  }
}

// ── Expiry helpers ───────────────────────────────────────────────────────────

/** Returns the Date at which a refresh token expires (30 days from now). */
export function refreshTokenExpiresAt(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d;
}

/** Returns the Date at which an access token expires (15 minutes from now). */
export function accessTokenExpiresAt(): Date {
  return new Date(Date.now() + 15 * 60 * 1000);
}
