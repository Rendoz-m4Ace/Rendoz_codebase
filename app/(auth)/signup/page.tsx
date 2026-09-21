'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// ---------------------------------------------------------------------------
// Password requirement rules
// ---------------------------------------------------------------------------

interface Rule {
  label: string;
  test: (pw: string) => boolean;
}

const PASSWORD_RULES: Rule[] = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'One uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'One lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'One number', test: (pw) => /\d/.test(pw) },
  { label: 'One special character (!@#$…)', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

function PasswordStrengthIndicator({ password }: { password: string }) {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;

  const segments = 4;
  const strength = Math.min(Math.floor((passed / PASSWORD_RULES.length) * segments), segments);

  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  if (!password) return null;

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      {/* Bar */}
      <div className="flex gap-1">
        {Array.from({ length: segments }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i < strength ? colors[strength - 1] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {/* Label */}
      {strength > 0 && (
        <p className={`text-xs font-medium ${strength === 4 ? 'text-green-600' : strength >= 2 ? 'text-orange-500' : 'text-red-500'}`}>
          {labels[strength]}
        </p>
      )}
    </div>
  );
}

function PasswordRequirements({ password }: { password: string }) {
  if (!password) return null;
  return (
    <ul className="mt-2 flex flex-col gap-1">
      {PASSWORD_RULES.map((rule) => {
        const met = rule.test(password);
        return (
          <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${met ? 'text-green-600' : 'text-gray-400'}`}>
            {met ? <Check size={12} className="shrink-0" /> : <X size={12} className="shrink-0" />}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SignUpPage() {
  const { signup, status } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isLoading = status === 'loading';
  const allRulesMet = PASSWORD_RULES.every((r) => r.test(password));

  // Redirect home once authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const validate = (): string => {
    if (!name.trim()) return 'Please enter your full name.';
    if (!email.trim()) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    if (!password) return 'Please enter a password.';
    if (!allRulesMet) return 'Your password does not meet the requirements below.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    // TODO: Replace mock signup with real endpoint.
    const result = await signup(name, email, password);

    if (result.success) {
      setSuccess(true);
      // useEffect above handles redirect
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#E8EEF5] flex flex-col items-center justify-center px-4 py-12">

      {/* Logo */}
      <Link href="/" className="mb-8 flex-shrink-0">
        <Image src="/images/logo.png" alt="Rendoz" width={120} height={32} priority />
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-sm text-gray-500 mt-1">Start renting and listing on Rendoz</p>
        </div>

        {/* Success state */}
        {success && (
          <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700 font-medium text-sm mb-5">
            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Account created! Taking you home…
          </div>
        )}

        {/* Error state */}
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* Full name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Camelia Afolabi"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email address
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setShowRequirements(true)}
                placeholder="Create a strong password"
                disabled={isLoading}
                className="w-full px-4 py-3 pr-11 border border-slate-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <PasswordStrengthIndicator password={password} />
            {showRequirements && <PasswordRequirements password={password} />}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="confirm" className="text-sm font-medium text-gray-700">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                disabled={isLoading}
                className={`w-full px-4 py-3 pr-11 border rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed ${
                  confirmPassword && confirmPassword !== password
                    ? 'border-red-300 bg-red-50/30'
                    : confirmPassword && confirmPassword === password
                    ? 'border-green-300 bg-green-50/30'
                    : 'border-slate-200'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Match indicator */}
            {confirmPassword && (
              <p className={`text-xs flex items-center gap-1 ${confirmPassword === password ? 'text-green-600' : 'text-red-500'}`}>
                {confirmPassword === password ? (
                  <><Check size={12} /> Passwords match</>
                ) : (
                  <><X size={12} /> Passwords do not match</>
                )}
              </p>
            )}
          </div>

          {/* Terms note */}
          <p className="text-xs text-gray-400 leading-relaxed">
            By creating an account you agree to Rendoz&apos;s{' '}
            <Link href="#" className="text-orange-500 hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="#" className="text-orange-500 hover:underline">Privacy Policy</Link>.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating account…
              </>
            ) : (
              'Create account'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Sign in link */}
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/signin" className="text-orange-500 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Back to home */}
      <Link href="/" className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors">
        ← Back to homepage
      </Link>
    </div>
  );
}
