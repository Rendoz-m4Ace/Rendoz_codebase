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
      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 text-green-600 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {message}
        </div>
      </div>
    );
  }

  // if (variant === 'hero') {
  //   return (
  //     <form onSubmit={handleSubmit} className="mt-1 flex max-w-[270px] flex-col gap-2 sm:flex-row">
  //       <input
  //         type="email"
  //         value={email}
  //         onChange={(e) => setEmail(e.target.value)}
  //         placeholder="Enter your email"
  //         className="min-w-0 flex-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1.5 text-[9px] focus:outline-none focus:ring-2 focus:ring-orange-400"
  //         required
  //       />
  //       <button
  //         type="submit"
  //         disabled={status === 'loading'}
  //         className="rounded-full bg-orange-500 px-4 py-1.5 text-[9px] font-medium text-white transition hover:bg-orange-600 disabled:opacity-50"
  //       >
  //         {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
  //       </button>
  //       {message && status === 'error' && (
  //         <p className="text-[9px] text-red-500 mt-1">{message}</p>
  //       )}
  //     </form>
  //   );
  // }

  if (variant === 'footer') {
    return (
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto flex items-center bg-white/20 backdrop-blur-md border border-white/30 rounded-full p-1.5 shadow-lg"
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
          <p className="text-xs text-red-300 absolute -bottom-6 left-1/2 -translate-x-1/2">{message}</p>
        )}
      </form>
    );
  }

  if (variant === 'navbar') {
    return (
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="px-3 py-1.5 text-[10px] border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-full bg-orange-500 px-4 py-1.5 text-[10px] font-semibold text-white disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Join'}
        </button>
        {message && status === 'error' && (
          <p className="text-[9px] text-red-500">{message}</p>
        )}
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
        required
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full bg-orange-600 text-white font-heading font-semibold px-6 py-3 rounded-full hover:opacity-90 transition disabled:opacity-50"
      >
        {status === 'loading' ? 'Joining...' : 'Join the waitlist'}
      </button>
      {message && (
        <p className={`text-sm text-center ${status === 'error' ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}
    </form>
  );
}
