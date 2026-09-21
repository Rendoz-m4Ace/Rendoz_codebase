'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string; // URL string or undefined — initials used as fallback
}

type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated';

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// ---------------------------------------------------------------------------
// Mock user — replace with real API response when backend is ready
// TODO: Replace mock user data with API response.
// ---------------------------------------------------------------------------

const MOCK_USER: User = {
  id: 'placeholder-user-id',
  name: 'Camelia Afolabi',
  email: 'user@example.com',
  avatar: undefined, // no photo yet — navbar will render initials
};

// ---------------------------------------------------------------------------
// Local-storage key used to persist mock session across page refreshes
// ---------------------------------------------------------------------------

const SESSION_KEY = 'rendoz_mock_session';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>('idle');

  // Rehydrate session from localStorage on first mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) {
        const parsed: User = JSON.parse(stored);
        setUser(parsed);
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
      }
    } catch {
      setStatus('unauthenticated');
    }
  }, []);

  // ---------------------------------------------------------------------------
  // login
  // TODO: Replace mock login with real endpoint.
  // ---------------------------------------------------------------------------
  const login = useCallback(
    async (email: string, _password: string): Promise<{ success: boolean; message: string }> => {
      setStatus('loading');

      // Simulate network latency
      await new Promise((r) => setTimeout(r, 1000));

      // TODO: Replace mock authentication state with the real authentication API
      // once the backend authentication endpoints are available.
      if (email.trim().toLowerCase() === MOCK_USER.email) {
        setUser(MOCK_USER);
        setStatus('authenticated');
        localStorage.setItem(SESSION_KEY, JSON.stringify(MOCK_USER));
        return { success: true, message: 'Welcome back!' };
      }

      setStatus('unauthenticated');
      return { success: false, message: 'Invalid email or password. Please try again.' };
    },
    []
  );

  // ---------------------------------------------------------------------------
  // signup
  // TODO: Replace mock signup with real endpoint.
  // ---------------------------------------------------------------------------
  const signup = useCallback(
    async (name: string, email: string, _password: string): Promise<{ success: boolean; message: string }> => {
      setStatus('loading');

      // Simulate network latency
      await new Promise((r) => setTimeout(r, 1200));

      // TODO: Replace mock signup with real endpoint.
      // For now every new registration succeeds and creates a session using the
      // submitted name + email so the UI feels real.
      const newUser: User = {
        id: 'placeholder-user-id',
        name: name.trim(),
        email: email.trim().toLowerCase(),
        avatar: undefined,
      };

      setUser(newUser);
      setStatus('authenticated');
      localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
      return { success: true, message: 'Account created! Welcome to Rendoz.' };
    },
    []
  );

  // ---------------------------------------------------------------------------
  // logout
  // TODO: Replace mock logout with real session/token invalidation.
  // ---------------------------------------------------------------------------
  const logout = useCallback(() => {
    setUser(null);
    setStatus('unauthenticated');
    localStorage.removeItem(SESSION_KEY);
  }, []);

  return (
    <AuthContext.Provider value={{ user, status, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
