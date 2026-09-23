'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
} from 'lucide-react';
import AuthShell from '@/component/auth/AuthShell';
import OtpInput from '@/component/auth/OtpInput';
import PrimaryButton from '@/component/auth/PrimaryButton';
import GoogleButton from '@/component/auth/GoogleButton';
import { useCountdown } from '@/component/auth/useCountdown';
import { useAuth } from '@/context/AuthContext';
import {
  isValidEmail,
  passwordStrength,
} from '@/lib/validation';
import {
  mockCreateAccount,
  mockGoogleAuth,
  mockResendOtp,
  mockVerifyEmailOtp,
} from '@/lib/mock-auth';

type SignupStep = 'details' | 'email-otp';

const STORAGE_KEY = 'rendoz_signup_flow';

interface SignupDraft {
  step: SignupStep;
  firstName: string;
  lastName: string;
  email: string;
}

function PasswordStrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const passed = passwordStrength(password);
  const colors = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-500'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong password'];
  const textColors = ['', 'text-red-500', 'text-orange-400', 'text-yellow-500', 'text-green-500'];
  return (
    <div className="mt-2 flex flex-col gap-1.5">
      <div className="flex gap-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i < passed ? colors[passed - 1] : 'bg-gray-200'}`}
          />
        ))}
      </div>
      {passed > 0 && <p className={`text-xs font-semibold ${textColors[passed]}`}>{labels[passed]}</p>}
    </div>
  );
}

function stepLabel(step: SignupStep): string {
  if (step === 'details') return 'Step 1 of 2';
  return 'Step 2 of 2';
}

export default function SignUpPage() {
  const router = useRouter();
  const { login, status } = useAuth();

  const [step, setStep] = useState<SignupStep>('details');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [emailOtp, setEmailOtp] = useState<string[]>(Array(6).fill(''));
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const emailCountdown = useCountdown(59);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const draft = JSON.parse(raw) as SignupDraft;
        setStep(draft.step);
        setFirstName(draft.firstName);
        setLastName(draft.lastName);
        setEmail(draft.email);
      }
    } catch {
      /* ignore */
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const draft: SignupDraft = { step, firstName, lastName, email };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  }, [hydrated, step, firstName, lastName, email]);

  useEffect(() => {
    if (status === 'authenticated') router.push('/');
  }, [status, router]);

  const goTo = (next: SignupStep) => {
    setError('');
    setStep(next);
  };

  const handleGoogle = async () => {
    setError('');
    const result = await mockGoogleAuth();
    setError(result.message);
  };

  const handleDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName.trim()) return setError('Please enter your first name.');
    if (!lastName.trim()) return setError('Please enter your last name.');
    if (!isValidEmail(email)) return setError('Please enter a valid email address.');
    if (passwordStrength(password) < 3) return setError('Please choose a stronger password.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    if (!agreed) return setError('Please agree to the Terms of Service and Privacy Policy.');
    setLoading(true);
    const result = await mockCreateAccount({ firstName, lastName, email, password });
    setLoading(false);
    if (!result.success) return setError(result.message);
    emailCountdown.reset();
    goTo('email-otp');
  };

  const handleEmailOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = emailOtp.join('');
    if (code.length < 6) return setError('Please enter the full 6-digit code.');
    setLoading(true);
    const result = await mockVerifyEmailOtp(email, code);
    setLoading(false);
    if (!result.success) return setError(result.message);
    sessionStorage.removeItem(STORAGE_KEY);
    await login(email, `${firstName} ${lastName}`);
  };

  return (
    <AuthShell>
      <p className="text-sm font-semibold text-blue-600 mb-3">{stepLabel(step)}</p>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          {error}
        </p>
      )}

      {step === 'details' && (
        <>
          <h2 className="text-3xl font-extrabold text-gray-900">Create your account</h2>
          <p className="text-sm text-gray-500 mt-1 mb-6">
            Already have an account?{' '}
            <Link href="/signin" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
          <form onSubmit={handleDetails} noValidate className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
                First name
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Victor"
                  className="w-full min-h-12 px-4 border border-gray-200 rounded-xl text-sm font-normal text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
                Last name
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Okafor"
                  className="w-full min-h-12 px-4 border border-gray-200 rounded-xl text-sm font-normal text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </label>
            </div>
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
                  className="w-full min-h-12 pl-10 pr-11 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
              Confirm password
              <span className="relative font-normal">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full min-h-12 pl-10 pr-11 border border-orange-400 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 min-h-11 min-w-11 flex items-center justify-center text-gray-400"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </span>
              <PasswordStrengthBar password={password} />
            </label>
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <span
                className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  agreed ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'
                }`}
              >
                {agreed && <Check size={12} className="text-white" />}
              </span>
              <span className="text-xs text-gray-500 leading-relaxed">
                I agree to Rendoz&apos;s{' '}
                <Link href="#" className="text-gray-900 font-semibold underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="#" className="text-gray-900 font-semibold underline">
                  Privacy Policy.
                </Link>
              </span>
            </label>
            <PrimaryButton loading={loading}>Create Account</PrimaryButton>
            <GoogleButton onClick={handleGoogle} disabled={loading} />
          </form>
        </>
      )}

      {step === 'email-otp' && (
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
            <Mail size={28} className="text-blue-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900">Check your email</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xs">
            We sent a 6-digit verification code to your email
          </p>
          <form onSubmit={handleEmailOtp} className="w-full mt-8 flex flex-col gap-5">
            <OtpInput value={emailOtp} onChange={setEmailOtp} disabled={loading} />
            <PrimaryButton loading={loading}>Verify Email</PrimaryButton>
            <p className="text-sm text-center">
              {emailCountdown.remaining > 0 ? (
                <span className="text-blue-600 font-semibold">
                  Resend code <span className="text-gray-900">{emailCountdown.fmt}</span>
                </span>
              ) : (
                <button
                  type="button"
                  className="text-blue-600 font-semibold min-h-11"
                  onClick={async () => {
                    await mockResendOtp('email', email);
                    emailCountdown.reset();
                    setEmailOtp(Array(6).fill(''));
                  }}
                >
                  Resend code
                </button>
              )}
            </p>
            <div className="border border-red-300 rounded-xl px-4 py-3 text-left">
              <p className="text-sm font-semibold text-red-500">Can&apos;t Find The Email?</p>
              <p className="text-sm text-red-500 mt-0.5">
                Check Your Spam Or Junk Folder. The Code Expires In 10 Minutes.
              </p>
            </div>
          </form>
          <button
            type="button"
            onClick={() => goTo('details')}
            className="flex items-center gap-1.5 text-sm text-gray-500 mt-6 min-h-11"
          >
            <ArrowLeft size={15} /> Back to sign up
          </button>
        </div>
      )}
    </AuthShell>
  );
}
