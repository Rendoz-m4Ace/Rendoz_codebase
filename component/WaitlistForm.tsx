'use client';

import { useState } from 'react';

interface WaitlistFormProps {
  variant?: 'hero' | 'footer' | 'navbar' | 'marketplace';
  onSuccess?: () => void;
}

export default function WaitlistForm({ variant = 'hero', onSuccess }: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setMessage(data.message);
        setEmail('');
        onSuccess?.();
      } else {
        setStatus('error');
        setMessage(data.message);
      }
    } catch (err) {
      setStatus('error');
      setMessage('An error occurred. Please try again.');
    }
  };

  if (status === 'success') {
    return (
      <div className="w-full py-3">
        <div className="flex items-center justify-center gap-2 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-green-700 font-medium text-sm">
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {message}
        </div>
      </div>
    );
  }

  if (variant === 'hero') {
    return (
      <form onSubmit={handleSubmit} className="mt-1 w-full max-w-md">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:bg-white rounded-2xl sm:rounded-full sm:p-1.5 sm:shadow-sm sm:border sm:border-slate-200">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 min-w-0 rounded-xl sm:rounded-full bg-white sm:bg-transparent border border-slate-200 sm:border-0 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 sm:focus:ring-0"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="shrink-0 rounded-xl sm:rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
          </button>
        </div>
        {message && status === 'error' && (
          <p className="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{message}</p>
        )}
      </form>
    );
  }

  if (variant === 'footer') {
    return (
      <form
        onSubmit={handleSubmit}
        className="relative max-w-md mx-auto flex items-center bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-1.5 shadow-lg"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 bg-transparent px-5 py-2.5 text-sm text-white placeholder-white/70 outline-none"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-[#EA3829] hover:bg-[#d42d1f] transition-colors text-white font-semibold text-xs md:text-sm px-6 py-2.5 rounded-full whitespace-nowrap shadow-md disabled:opacity-50"
        >
          {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
        </button>
        {message && status === 'error' && (
          <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-full text-center text-xs text-red-200 bg-red-500/20 border border-red-300/30 rounded-lg px-3 py-1.5 backdrop-blur-sm">{message}</p>
        )}
      </form>
    );
  }

  if (variant === 'navbar') {
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="px-3 py-1.5 text-sm border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-full bg-orange-500 px-4 py-1.5 text-sm font-semibold text-white disabled:opacity-50 hover:bg-orange-600 transition"
          >
            {status === 'loading' ? '...' : 'Join'}
          </button>
        </div>
        {message && status === 'error' && (
          <p className="text-xs text-red-600">{message}</p>
        )}
      </form>
    );
  }

  // marketplace + default
  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row md:items-center gap-3 md:gap-0 rounded-2xl bg-transparent md:bg-white shadow-sm md:rounded-full md:p-1.5 md:border md:border-slate-200">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full md:w-auto flex-1 rounded-xl md:rounded-full bg-[#F3F4F6] md:bg-transparent px-5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full md:w-auto shrink-0 whitespace-nowrap rounded-xl md:rounded-full bg-orange-500 hover:bg-orange-600 px-7 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
        >
          {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
        </button>
      </form>
      {message && status === 'error' && (
        <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{message}</p>
      )}
    </div>
  );
}
