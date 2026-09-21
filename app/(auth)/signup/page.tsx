'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2, Phone, Mail, Lock, ShieldCheck, CreditCard, Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// ---------------------------------------------------------------------------
// Password rules + strength
// ---------------------------------------------------------------------------

const PASSWORD_RULES = [
  { test: (pw: string) => pw.length >= 8 },
  { test: (pw: string) => /[A-Z]/.test(pw) },
  { test: (pw: string) => /[a-z]/.test(pw) },
  { test: (pw: string) => /\d/.test(pw) },
];

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;

  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length;

  const segmentColors = [
    'bg-red-400',
    'bg-orange-400',
    'bg-yellow-400',
    'bg-green-500',
  ];

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong password'];
  const labelColors = ['', 'text-red-500', 'text-orange-400', 'text-yellow-500', 'text-green-500'];

  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < passed ? segmentColors[passed - 1] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      {passed > 0 && (
        <p className={`text-xs font-semibold ${labelColors[passed]}`}>
          {labels[passed]}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Left panel trust features
// ---------------------------------------------------------------------------
const TRUST_FEATURES = [
  { icon: <ShieldCheck size={20} />, label: 'Verified owners & renters' },
  { icon: <CreditCard size={20} />, label: 'Secure payments' },
  { icon: <Clock size={20} />, label: 'Rent only for the time you need' },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function SignUpPage() {
  const { signup, status } = useAuth();
  const router = useRouter();

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isLoading = status === 'loading';

  // Redirect home once authenticated
  useEffect(() => {
    if (status === 'authenticated') router.push('/');
  }, [status, router]);

  const validate = (): string => {
    if (!phone.trim()) return 'Please enter your phone number.';
    if (!email.trim()) return 'Please enter your email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Please enter a valid email address.';
    if (!password) return 'Please enter a password.';
    if (PASSWORD_RULES.filter((r) => r.test(password)).length < 3)
      return 'Please choose a stronger password.';
    if (!agreed) return 'Please agree to the Terms of Service and Privacy Policy.';
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
    // Pass phone as the name field temporarily until backend is ready.
    const result = await signup(phone, email, password);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      {/* ── Left panel ──────────────────────────────────────────────────── */}
      <div className="relative bg-orange-500 md:w-[45%] flex flex-col justify-between px-10 py-10 overflow-hidden">

        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-white/10 pointer-events-none" />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/">
            <Image
              src="/images/logo.png"
              alt="Rendoz"
              width={120}
              height={32}
              priority
              className="brightness-0 invert"
            />
          </Link>
        </div>

        {/* Tagline + description */}
        <div className="relative z-10 flex flex-col gap-4 my-10 md:my-0">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Rent what you need.<br />
            Use it. Return it.
          </h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-xs">
            Create your free account to rent what you need from verified owners — or list what you own and earn from it.
          </p>
        </div>

        {/* Trust features */}
        <ul className="relative z-10 flex flex-col gap-4">
          {TRUST_FEATURES.map((f) => (
            <li key={f.label} className="flex items-center gap-3 text-white text-sm font-medium">
              <span className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                {f.icon}
              </span>
              {f.label}
            </li>
          ))}
        </ul>
      </div>

      {/* ── Right panel ─────────────────────────────────────────────────── */}
      <div className="flex-1 bg-white flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-400 mt-1">Join for free</p>
          </div>

          {/* Success state */}
          {success && (
            <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700 font-medium text-sm mb-6">
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Account created! Taking you home…
            </div>
          )}

          {/* Error state */}
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">

            {/* Phone number */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                Phone Number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Phone size={16} />
                </span>
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+234 802 345 6789"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail size={16} />
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  disabled={isLoading}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Passeord
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={16} />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  disabled={isLoading}
                  className="w-full pl-10 pr-11 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              <PasswordStrengthBar password={password} />
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    agreed ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'
                  }`}
                >
                  {agreed && (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500 leading-relaxed pt-0.5">
                I agree to Rendoz&apos;s{' '}
                <Link href="#" className="text-gray-900 font-semibold underline hover:text-orange-500 transition-colors">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="#" className="text-gray-900 font-semibold underline hover:text-orange-500 transition-colors">
                  Privacy Policy.
                </Link>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Creating account…
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Sign in link */}
          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/signin" className="text-orange-500 font-bold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
