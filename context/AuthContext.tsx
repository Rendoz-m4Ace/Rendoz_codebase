'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  /** True once all 7 required profile fields are saved (phone, location, photo, NIN, payout, name, email) */
  profileComplete: boolean;
  login: (email: string, name?: string) => Promise<void>;
  logout: () => void;
  /** Call this from the profile page once the owner finishes all required steps */
  markProfileComplete: () => void;
}

const SESSION_KEY         = 'rendoz_mock_session';
const PROFILE_COMPLETE_KEY = 'rendoz_profile_complete';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,            setUser]            = useState<User | null>(null);
  const [status,          setStatus]          = useState<AuthStatus>('idle');
  const [profileComplete, setProfileComplete] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        setUser(JSON.parse(stored) as User);
        setStatus('authenticated');
        setProfileComplete(localStorage.getItem(PROFILE_COMPLETE_KEY) === 'true');
      } else {
        setStatus('unauthenticated');
      }
    } catch {
      setStatus('unauthenticated');
    }
  }, []);

  const login = useCallback(async (email: string, name?: string) => {
    const nextUser: User = {
      id: 'placeholder-user-id',
      name: name?.trim() || email.split('@')[0],
      email: email.trim().toLowerCase(),
    };
    setUser(nextUser);
    setStatus('authenticated');
    localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser));
    // Preserve existing completion flag across re-logins
    const alreadyComplete = localStorage.getItem(PROFILE_COMPLETE_KEY) === 'true';
    setProfileComplete(alreadyComplete);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setStatus('unauthenticated');
    setProfileComplete(false);
    localStorage.removeItem(SESSION_KEY);
    // Keep profile flag so returning user doesn't have to redo setup
    // (comment out next line to force re-verification on every logout)
    // localStorage.removeItem(PROFILE_COMPLETE_KEY);
  }, []);

  const markProfileComplete = useCallback(() => {
    setProfileComplete(true);
    localStorage.setItem(PROFILE_COMPLETE_KEY, 'true');
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, profileComplete, login, logout, markProfileComplete }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
