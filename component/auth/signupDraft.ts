import type { AccountRole } from '@/context/AuthContext';

export type SignupStep = 'role' | 'details' | 'email-otp';

/** sessionStorage key for an in-progress sign-up (survives a refresh mid-flow). */
export const SIGNUP_STORAGE_KEY = 'rendoz_signup_flow';

export interface SignupDraft {
  step: SignupStep;
  role: AccountRole | null;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}
