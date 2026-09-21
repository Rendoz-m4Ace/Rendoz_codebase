'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Loader2, Mail, ArrowLeft, MailCheck } from 'lucide-react';

// ---------------------------------------------------------------------------
// UI states
// ---------------------------------------------------------------------------
type PageState = 'idle' | 'loading' | 'sent' | 'error';

// ---------------------------------------------------------------------------
// Mock reset request
// TODO: Replace with authentication API integration.
// ---------------------------------------------------------------------------
async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1200));

  // TODO: Replace mock logout with real session/token invalidation.
  // For now every well-formed email succeeds so the UI flow can be tested.
  if (!email.trim()) {
    return { success: false, message: 'Please enter your email address.' };
  }

  // TODO: Replace mock login with real endpoint.
  return { success: true, message: 'Reset instructions sent.' };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [pageState, setPageState] = useState<PageState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const isLoading = pageState === 'loading';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setPageState('loading');

    // TODO: Replace mock reset request with real password-reset endpoint.
    const result = await requestPasswordReset(email);

    if (result.success) {
      setPageState('sent');
    } else {
      setErrorMessage(result.message);
      setPageState('error');
    }
  };

  // -------------------------------------------------------------------------
  // Sent confirmation state
  // -------------------------------------------------------------------------
  if (pageState === 'sent') {
    return (
      <div className="min-h-screen bg-[#E8EEF5] flex flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex-shrink-0">
          <Image src="/images/logo.png" alt="Rendoz" width={120} height={32} priority />
        </Link>

        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-5">
            <MailCheck size={30} className="text-orange-500" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">Check your inbox</h1>
          <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
            We&apos;ve sent password reset instructions to{' '}
            <span className="font-semibold text-gray-700">{email}</span>.
            Check your spam folder if you don&apos;t see it.
          </p>

          {/* Resend */}
          <p className="mt-6 text-sm text-gray-500">
            Didn&apos;t receive it?{' '}
            <button
              type="button"
              onClick={() => setPageState('idle')}
              className="text-orange-500 font-semibold hover:underline"
            >
              Try again
            </button>
          </p>

          {/* Divider */}
          <div className="w-full h-px bg-gray-100 my-6" />

          <Link
            href="/signin"
            className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft size={15} />
            Back to Sign in
          </Link>
        </div>

        <Link href="/" className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors">
          ← Back to homepage
        </Link>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Default / error state — the email form
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#E8EEF5] flex flex-col items-center justify-center px-4 py-12">

      {/* Logo */}
      <Link href="/" className="mb-8 flex-shrink-0">
        <Image src="/images/logo.png" alt="Rendoz" width={120} height={32} priority />
      </Link>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Icon + Heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-orange-50 flex items-center justify-center mb-4">
            <Mail size={26} className="text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Forgot your password?</h1>
          <p className="text-sm text-gray-500 mt-1.5 max-w-xs leading-relaxed">
            No worries. Enter the email linked to your account and we&apos;ll send reset instructions.
          </p>
        </div>

        {/* Error state */}
        {pageState === 'error' && errorMessage && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-5">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

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
              onChange={(e) => {
                setEmail(e.target.value);
                if (pageState === 'error') {
                  setPageState('idle');
                  setErrorMessage('');
                }
              }}
              placeholder="you@example.com"
              disabled={isLoading}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-1"
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending…
              </>
            ) : (
              'Send reset instructions'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-100" />
        </div>

        {/* Back to sign in */}
        <Link
          href="/signin"
          className="flex items-center justify-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to Sign in
        </Link>
      </div>

      {/* Back to home */}
      <Link href="/" className="mt-6 text-xs text-gray-400 hover:text-gray-600 transition-colors">
        ← Back to homepage
      </Link>
    </div>
  );
}
