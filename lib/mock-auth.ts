/**
 * Mock consumer-auth API.
 * TODO: Replace each function with the real authentication endpoints
 * once the backend auth service is available.
 */

export interface AuthResult {
  success: boolean;
  message: string;
}

const LATENCY_MS = 900;

function wait(ms: number = LATENCY_MS): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockCreateAccount(_payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<AuthResult> {
  // TODO: POST /api/auth/signup
  await wait();
  return { success: true, message: 'Verification code sent to your email.' };
}

export async function mockVerifyEmailOtp(_email: string, code: string): Promise<AuthResult> {
  // TODO: POST /api/auth/verify-email
  await wait();
  if (code.length !== 6) {
    return { success: false, message: 'Please enter the full 6-digit code.' };
  }
  return { success: true, message: 'Email verified.' };
}

export async function mockSendPhoneOtp(_phone: string): Promise<AuthResult> {
  // TODO: POST /api/auth/phone/send
  await wait();
  return { success: true, message: 'Verification code sent to your phone.' };
}

export async function mockVerifyPhoneOtp(_phone: string, code: string): Promise<AuthResult> {
  // TODO: POST /api/auth/verify-phone
  await wait();
  if (code.length !== 6) {
    return { success: false, message: 'Please enter the full 6-digit code.' };
  }
  return { success: true, message: 'Phone verified.' };
}

export async function mockVerifyNin(_payload: {
  nin: string;
  dateOfBirth: string;
}): Promise<AuthResult> {
  // TODO: POST /api/auth/verify-nin
  await wait(1200);
  return { success: true, message: 'Identity verified.' };
}

export async function mockResendOtp(_channel: 'email' | 'phone' | 'reset', _target: string): Promise<AuthResult> {
  // TODO: POST /api/auth/otp/resend
  await wait(600);
  return { success: true, message: 'A new code has been sent.' };
}

export async function mockLogin(_email: string, _password: string): Promise<AuthResult> {
  // TODO: POST /api/auth/login
  await wait();
  return { success: true, message: 'Welcome back!' };
}

export async function mockGoogleAuth(): Promise<AuthResult> {
  // TODO: Start Google OAuth
  await wait(400);
  return { success: false, message: 'Google sign-in is not connected yet.' };
}

export async function mockRequestPasswordReset(_email: string): Promise<AuthResult> {
  // TODO: POST /api/auth/password/forgot
  await wait();
  return { success: true, message: 'Reset code sent to your email.' };
}

export async function mockVerifyResetCode(_email: string, code: string): Promise<AuthResult> {
  // TODO: POST /api/auth/password/verify-code
  await wait();
  if (code.length !== 6) {
    return { success: false, message: 'Please enter the full 6-digit code.' };
  }
  return { success: true, message: 'Reset code accepted.' };
}

export async function mockResetPassword(_email: string, _password: string): Promise<AuthResult> {
  // TODO: POST /api/auth/password/reset
  await wait();
  return { success: true, message: 'Password updated. You can sign in now.' };
}
