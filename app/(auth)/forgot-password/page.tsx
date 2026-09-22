'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, Mail } from 'lucide-react';
import AuthShell from '@/component/auth/AuthShell';
import OtpInput from '@/component/auth/OtpInput';
import PrimaryButton from '@/component/auth/PrimaryButton';
import { useCountdown } from '@/component/auth/useCountdown';
import { isValidEmail, passwordStrength } from '@/lib/validation';
import {
  mockRequestPasswordReset,
  mockResendOtp,
  mockResetPassword,
  mockVerifyResetCode,
} from '@/lib/mock-auth';

type ResetStep = 'email' | 'code' | 'password';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const countdown = useCountdown(59);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isValidEmail(email)) return setError('Please enter a valid email address.');
    setLoading(true);
    const result = await mockRequestPasswordReset(email);
    setLoading(false);
    if (!result.success) return setError(result.message);
    countdown.reset();
    setStep('code');
  };

  const handleCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const code = otp.join('');
    if (code.length < 6) return setError('Please enter the full 6-digit code.');
    setLoading(true);
    const result = await mockVerifyResetCode(email, code);
    setLoading(false);
    if (!result.success) return setError(result.message);
    setStep('password');
  };

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (passwordStrength(password) < 3) return setError('Please choose a stronger password.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    setLoading(true);
    const result = await mockResetPassword(email, password);
    setLoading(false);
    if (!result.success) return setError(result.message);
    router.push('/signin');
  };

  return (
    <AuthShell>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          {error}
        </p>
      )}

      {step === 'email' && (
        <>
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
            <KeyRound size={28} className="text-blue-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Reset your password</h1>
          <p className="text-sm text-gray-500 mt-2 mb-6">
            Enter the email address associated with your account and we&apos;ll send a reset link.
          </p>
          <form onSubmit={handleEmail} className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
              Email address
              <span className="relative font-normal">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  className="w-full min-h-12 pl-10 pr-4 border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </span>
            </label>
            <PrimaryButton loading={loading}>Send Reset Link</PrimaryButton>
          </form>
          <Link
            href="/signin"
            className="flex items-center justify-center gap-1.5 text-sm text-gray-600 mt-6 min-h-11"
          >
            <ArrowLeft size={15} /> Back to sign in
          </Link>
        </>
      )}

      {step === 'code' && (
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Enter reset code</h1>
          <p className="text-sm text-gray-500 mt-2">Enter the 6-digit code from your email</p>
          <form onSubmit={handleCode} className="mt-8 flex flex-col gap-5">
            <OtpInput value={otp} onChange={setOtp} disabled={loading} />
            <PrimaryButton loading={loading}>Continue</PrimaryButton>
          </form>
          {countdown.remaining > 0 ? (
            <p className="text-sm text-gray-500 mt-4 min-h-11 flex items-center justify-center">
              Resend available in {countdown.fmt}
            </p>
          ) : (
            <button
              type="button"
              className="mt-4 text-sm text-gray-800 font-medium min-h-11 inline-flex items-center gap-1"
              onClick={async () => {
                await mockResendOtp('reset', email);
                countdown.reset();
                setOtp(Array(6).fill(''));
              }}
            >
              <ArrowLeft size={14} /> Resend reset mail
            </button>
          )}
        </div>
      )}

      {step === 'password' && (
        <>
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-5">
            <Lock size={28} className="text-blue-500" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Enter new password</h1>
          <form onSubmit={handlePassword} className="mt-8 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
              New password
              <span className="relative font-normal">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-gray-700">
              Password
              <span className="relative font-normal">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
            </label>
            <PrimaryButton loading={loading}>Reset Password</PrimaryButton>
          </form>
        </>
      )}
    </AuthShell>
  );
}
