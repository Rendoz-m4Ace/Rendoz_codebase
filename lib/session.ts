import { getAccessTokenFromCookies } from "@/lib/auth-helpers";
import { verifyAccessToken } from "@/lib/jwt";
import { getSupabase, type DbUser } from "@/lib/supabase";

export type SessionResult =
  | { ok: true; user: DbUser }
  | { ok: false; status: 401 | 403 | 404; error: string };

/** Loads the signed-in, active, email-verified user from the access-token cookie. */
export async function getSessionUser(): Promise<SessionResult> {
  const token = await getAccessTokenFromCookies();
  if (!token) return { ok: false, status: 401, error: "Authentication required." };

  const payload = await verifyAccessToken(token);
  if (!payload) return { ok: false, status: 401, error: "Session expired. Please log in again." };

  const { data } = await getSupabase()
    .from("users")
    .select()
    .eq("id", payload.sub)
    .eq("is_active", true)
    .maybeSingle();
  if (!data) return { ok: false, status: 404, error: "User not found." };

  const user = data as unknown as DbUser;
  if (!user.is_email_verified) {
    return { ok: false, status: 403, error: "Please verify your email address to continue." };
  }
  return { ok: true, user };
}
