'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi, type ApiUser } from '@/lib/api-client';
import type { ProfileData } from '@/component/dashboard/profile/types';

export type AccountRole = 'renter' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  /** Where the user starts: owners have the owner role on top of renter. */
  role: AccountRole;
  isEmailVerified: boolean;
  avatar?: string;
  /** Saved owner profile details (empty for users who haven't set any up) */
  profile: Partial<ProfileData>;
  /** Owner setup finished on the server, which unlocks listing */
  profileCompleted: boolean;
}

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  /** True once all 7 required profile fields are saved (phone, location, photo, NIN, payout, name, email) */
  profileComplete: boolean;
  /** Store the user returned by login / register / verify-email. */
  setSessionUser: (user: ApiUser) => void;
  /** Re-read the session from the server (e.g. after a role change). */
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  /** Call this from the profile page once the owner finishes all required steps */
  markProfileComplete: () => void;
}

// Fallback for profiles completed in the browser before a save-profile API exists.
// Keyed per user so accounts sharing a browser don't inherit each other's status.
const profileCompleteKey = (userId: string) => `rendoz_profile_complete:${userId}`;

export function toUser(api: ApiUser): User {
  return {
    id: api.id,
    name: api.full_name,
    email: api.email,
    phone: api.phone,
    role: api.role.includes('owner') ? 'owner' : 'renter',
    isEmailVerified: api.is_email_verified,
    avatar: api.profile_photo ?? undefined,
    profile: (api.profile ?? {}) as Partial<ProfileData>,
    profileCompleted: api.profile_completed === true,
  };
}

function isProfileComplete(user: User): boolean {
  if (user.profileCompleted) return true;
  try {
    return localStorage.getItem(profileCompleteKey(user.id)) === 'true';
  } catch {
    return false;
  }
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,            setUser]            = useState<User | null>(null);
  const [status,          setStatus]          = useState<AuthStatus>('idle');
  const [profileComplete, setProfileComplete] = useState(false);

  const applyMe = useCallback((result: Awaited<ReturnType<typeof authApi.me>>) => {
    // Unverified users (403) finish sign-up on /signup before they count as signed in
    if (result.ok && result.data.user.is_email_verified) {
      const next = toUser(result.data.user);
      setUser(next);
      setProfileComplete(isProfileComplete(next));
      setStatus('authenticated');
    } else {
      setUser(null);
      setStatus('unauthenticated');
    }
  }, []);

  const refreshUser = useCallback(async () => {
    applyMe(await authApi.me());
  }, [applyMe]);

  useEffect(() => {
    let cancelled = false;
    authApi.me().then((result) => {
      if (!cancelled) applyMe(result);
    });
    return () => {
      cancelled = true;
    };
  }, [applyMe]);

  const setSessionUser = useCallback((apiUser: ApiUser) => {
    const next = toUser(apiUser);
    setUser(next);
    setProfileComplete(isProfileComplete(next));
    setStatus(apiUser.is_email_verified ? 'authenticated' : 'unauthenticated');
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
    setStatus('unauthenticated');
    setProfileComplete(false);
    // Keep profile flag so a returning user doesn't have to redo setup
  }, []);

  const markProfileComplete = useCallback(() => {
    setProfileComplete(true);
    if (!user) return;
    try {
      localStorage.setItem(profileCompleteKey(user.id), 'true');
    } catch {
      /* storage unavailable */
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, status, profileComplete, setSessionUser, refreshUser, logout, markProfileComplete }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
