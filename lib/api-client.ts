/**
 * Browser-side client for the /api/auth/* routes.
 * Auth tokens live in httpOnly cookies, so every call just sends cookies along.
 */

import type { Listing } from '@/lib/listings';

export type ApiRole = 'renter' | 'owner' | 'admin';

/** User as returned by the API (the DB row without password_hash). */
export interface ApiUser {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  role: ApiRole[];
  is_email_verified: boolean;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  profile_photo: string | null;
  location: string | null;
  profile: Record<string, unknown> | null;
  profile_completed: boolean;
}

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string; code?: string };

async function request<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  let res: Response;
  try {
    res = await fetch(path, {
      ...init,
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', ...init.headers },
    });
  } catch {
    return { ok: false, status: 0, error: 'Network error. Check your connection and try again.' };
  }

  const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    return {
      ok: false,
      status: res.status,
      error: typeof body.error === 'string' ? body.error : 'Something went wrong. Please try again.',
      code: typeof body.code === 'string' ? body.code : undefined,
    };
  }
  return { ok: true, data: body as T };
}

const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) });

// ── Listings ────────────────────────────────────────────────────────────────

export interface NewListingInput {
  action: 'draft' | 'submit';
  title: string;
  category: string;
  subcategory: string;
  description: string;
  details: { brand: string; model: string; condition: string; size: string; quantity: number | null };
  photos: string[];
  pricing: { hourly: number | null; daily: number | null; weekly: number | null; securityDeposit: number | null };
  unavailableDates: string[];
}

export const listingsApi = {
  mine: () => request<{ listings: Listing[] }>('/api/listings'),

  create: (input: NewListingInput) => post<{ listing: Listing }>('/api/listings', input),

  /** Uploads one photo; resolves to its public URL. Sent as multipart, so it skips the JSON helper. */
  async uploadPhoto(file: File): Promise<ApiResult<{ url: string }>> {
    const form = new FormData();
    form.append('photo', file);
    let res: Response;
    try {
      res = await fetch('/api/listings/photos', { method: 'POST', body: form, credentials: 'same-origin' });
    } catch {
      return { ok: false, status: 0, error: 'Network error. Check your connection and try again.' };
    }
    const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
    if (!res.ok || !body.url) {
      return { ok: false, status: res.status, error: body.error ?? 'Upload failed. Please try again.' };
    }
    return { ok: true, data: { url: body.url } };
  },
};

type UserResponse = { message?: string; user: ApiUser };
type MessageResponse = { message: string };

export const authApi = {
  register: (input: { full_name: string; email: string; phone: string; password: string }) =>
    post<UserResponse & { verification_email: 'sent' | 'not_sent' }>('/api/auth/register', input),

  login: (identifier: string, password: string) =>
    post<UserResponse>('/api/auth/login', { identifier, password }),

  logout: () => post<MessageResponse>('/api/auth/logout'),

  refresh: () => post<UserResponse>('/api/auth/refresh'),

  verifyEmail: (code: string) => post<UserResponse>('/api/auth/verify-email', { code }),

  resendEmailOtp: () =>
    post<MessageResponse>('/api/auth/resend-otp', { purpose: 'email_verification' }),

  becomeOwner: (input: { nin?: string; location?: string } = {}) =>
    post<UserResponse>('/api/auth/become-owner', input),

  forgotPassword: (email: string) => post<MessageResponse>('/api/auth/forgot-password', { email }),

  resendResetOtp: (email: string) =>
    post<MessageResponse>('/api/auth/resend-otp', { purpose: 'password_reset', email }),

  resetPassword: (input: { email: string; code: string; new_password: string }) =>
    post<MessageResponse>('/api/auth/reset-password', input),

  /** Current user; if the 15-min access token expired, refreshes once and retries. */
  async me(): Promise<ApiResult<UserResponse>> {
    const first = await request<UserResponse>('/api/auth/me');
    if (first.ok || first.status !== 401) return first;
    const refreshed = await authApi.refresh();
    return refreshed.ok ? request<UserResponse>('/api/auth/me') : first;
  },
};
