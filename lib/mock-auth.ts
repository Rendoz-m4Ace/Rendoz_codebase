/**
 * Placeholder for auth flows that have no backend yet.
 * Email/password sign-up, sign-in and password reset use the real API in lib/api-client.ts.
 * TODO: Replace with Google OAuth once it is set up.
 */

export interface AuthResult {
  success: boolean;
  message: string;
}

export async function mockGoogleAuth(): Promise<AuthResult> {
  await new Promise((resolve) => setTimeout(resolve, 400));
  return { success: false, message: 'Google sign-in is not connected yet.' };
}
