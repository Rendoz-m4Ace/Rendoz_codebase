'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import AuthShell from '@/component/auth/AuthShell';
import PrimaryButton from '@/component/auth/PrimaryButton';
import GoogleButton from '@/component/auth/GoogleButton';
import { useAuth } from '@/context/AuthContext';
import { isValidEmail } from '@/lib/validation';
import { mockGoogleAuth, mockLogin } from '@/lib/mock-auth';

export default function SignInPage() {
  const { login, status } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') router.push('/');
  }, [status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) return setError('Please enter a valid email address.');
    if (!password) return setError('Please enter your password.');
    setLoading(true);
    const result = await mockLogin(email, password);
    setLoading(false);
    if (!result.success) return setError(result.message);
    await login(email);
  };

  const handleGoogle = async () => {
    setError('');
    const result = await mockGoogleAuth();
    setError(result.message);
  };

  return (
    <AuthShell>
      <p className="text-sm font-semibold tracking-wide text-blue-600 mb-3">WELCOME BACK</p>
      <h1 className="text-3xl font-extrabold text-gray-900">Sign in</h1>
      <p className="text-sm text-gray-500 mt-1 mb-6">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-blue-600 font-semibold hover:underline">
          Create one free
        </Link>
      </p>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
          Email address
          <span className="relative font-normal">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full min-h-12 pl-10 pr-4 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </span>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
          Password
          <span className="relative font-normal">
            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full min-h-12 pl-10 pr-11 border border-orange-400 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 min-h-11 min-w-11 flex items-center justify-center text-gray-400"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </span>
        </label>
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-blue-600 font-semibold min-h-11 inline-flex items-center">
            Forgot password?
          </Link>
        </div>
        <PrimaryButton loading={loading}>
          Sign In <ArrowRight size={16} />
        </PrimaryButton>
        <GoogleButton onClick={handleGoogle} disabled={loading} />
      </form>
    </AuthShell>
  );
}
