'use client';

// ─── PhoneModal ───────────────────────────────────────────────────────────────
// 2-step flow:
//   Step 1 — Enter phone number + WhatsApp toggle → "Send Verification Code"
//   Step 2 — OTP entry popup → "Verify & Save"
// Self-contained; only talks to parent via onSave / onClose.

import { useState, useRef, useEffect } from 'react';
import { Phone, MessageCircle, Lock, ArrowRight, CheckCircle2, RotateCcw, ArrowLeft } from 'lucide-react';
import ModalShell from './ModalShell';

interface PhoneModalProps {
  initialPhone?: string;
  initialWhatsapp?: boolean;
  onSave: (phone: string, whatsapp: boolean) => void;
  onClose: () => void;
}

// ─── OTP digit input (self-contained, 6 boxes) ───────────────────────────────
function OtpBoxes({
  value,
  onChange,
  disabled,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  disabled?: boolean;
}) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (i: number, char: string) => {
    const digit = char.replace(/\D/g, '').slice(-1);
    const next = [...value];
    next[i] = digit;
    onChange(next);
    if (digit && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const next = Array(6).fill('');
    digits.forEach((d, i) => { next[i] = d; });
    onChange(next);
    refs.current[Math.min(digits.length, 5)]?.focus();
  };

  return (
    <div className="flex gap-2 justify-center" onPaste={handlePaste}>
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { refs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          disabled={disabled}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKey(i, e)}
          className="w-11 h-12 text-center text-lg font-bold rounded-xl bg-gray-100 text-gray-900 border border-transparent focus:outline-none focus:ring-2 focus:ring-orange-400 focus:bg-white focus:border-orange-300 disabled:opacity-50 transition-all"
          aria-label={`OTP digit ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ─── Countdown hook ───────────────────────────────────────────────────────────
function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const id = setInterval(() => setRemaining((v) => v - 1), 1000);
    return () => clearInterval(id);
  }, [remaining]);

  const reset = () => setRemaining(seconds);
  const fmt = `0:${String(remaining).padStart(2, '0')}`;
  return { remaining, fmt, reset };
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function PhoneModal({
  initialPhone = '',
  initialWhatsapp = true,
  onSave,
  onClose,
}: PhoneModalProps) {
  type Step = 'enter-phone' | 'enter-otp' | 'verified';

  const [step, setStep]       = useState<Step>('enter-phone');
  const [phone, setPhone]     = useState(initialPhone);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);
  const [agreed, setAgreed]   = useState(false);
  const [otp, setOtp]         = useState<string[]>(Array(6).fill(''));
  const [verifying, setVerifying] = useState(false);
  const [error, setError]     = useState('');
  const countdown = useCountdown(59);

  const canSendCode = phone.trim().replace(/\D/g, '').length >= 7;
  const otpFilled   = otp.join('').length === 6;

  // Simulate sending OTP
  const handleSendCode = () => {
    setError('');
    setOtp(Array(6).fill(''));
    setStep('enter-otp');
    countdown.reset();
  };

  // Simulate verifying OTP — mock: any 6-digit code passes
  const handleVerifyOtp = async () => {
    setError('');
    setVerifying(true);
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 1200));
    setVerifying(false);
    const code = otp.join('');
    if (code === '000000') {
      // Treat 000000 as a deliberate "wrong code" demo
      setError('Incorrect code. Please try again.');
      return;
    }
    setStep('verified');
  };

  const handleResend = () => {
    setOtp(Array(6).fill(''));
    setError('');
    countdown.reset();
  };

  const handleConfirm = () => {
    onSave(phone.trim(), whatsapp);
    onClose();
  };

  // ── Step 1: Enter phone ──────────────────────────────────────────────────
  if (step === 'enter-phone') {
    return (
      <ModalShell onClose={onClose}>
        <div className="p-6 pt-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6 pr-6">
            <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
              <Phone size={20} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Add phone number</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Renters and Rendoz use your phone number to coordinate pickups and send security
                verification codes.
              </p>
            </div>
          </div>

          {/* Phone input */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
              Phone Number
            </label>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 h-12 border border-gray-200 rounded-xl bg-gray-50 text-sm font-medium text-gray-700 shrink-0 select-none">
                <span>🇳🇬</span>
                <span>+234</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400">
                  <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. 0803 123 4567"
                className="flex-1 h-12 px-4 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </div>

          {/* SMS consent */}
          <label className="flex items-center gap-3 mb-4 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-4 h-4 accent-orange-500"
            />
            <span className="text-xs text-gray-500">
              We will send a 6-digit SMS verification code to verify this number.
            </span>
          </label>

          {/* WhatsApp toggle */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <MessageCircle size={18} className="text-green-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                  Allow WhatsApp notifications
                  <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase tracking-wide">
                    Fastest
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Receive instant alerts for new rental requests, pickup coordination, and urgent updates.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={whatsapp}
              onClick={() => setWhatsapp((v) => !v)}
              className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${whatsapp ? 'bg-orange-500' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${whatsapp ? 'translate-x-5' : 'translate-x-1'}`} />
            </button>
          </div>

          {/* Privacy note */}
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 flex items-start gap-3 mb-6">
            <Lock size={15} className="text-orange-500 mt-0.5 shrink-0" />
            <p className="text-xs text-orange-700">
              <span className="font-semibold">Privacy protected:</span> Renters only receive your phone
              number after you approve and accept their rental booking.
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="min-h-11 px-5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSendCode}
              onClick={handleSendCode}
              className="min-h-11 px-6 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              Send Verification Code
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </ModalShell>
    );
  }

  // ── Step 2: Enter OTP ────────────────────────────────────────────────────
  if (step === 'enter-otp') {
    const formattedPhone = `+234 ${phone.replace(/^0/, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}`;
    return (
      <ModalShell onClose={onClose}>
        <div className="p-6 pt-8">
          {/* Header */}
          <div className="flex items-start gap-4 mb-6 pr-6">
            <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
              <Phone size={20} className="text-orange-500" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Enter verification code</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                We sent a 6-digit code to{' '}
                <span className="font-semibold text-gray-700">{formattedPhone}</span>. It expires in 10 minutes.
              </p>
            </div>
          </div>

          {/* OTP boxes */}
          <div className="mb-5">
            <OtpBoxes value={otp} onChange={setOtp} disabled={verifying} />
          </div>

          {/* Error */}
          {error && (
            <div className="text-center mb-4">
              <p className="text-sm text-red-500 font-medium">{error}</p>
            </div>
          )}

          {/* Resend */}
          <div className="flex items-center justify-center gap-1.5 mb-6 text-sm">
            {countdown.remaining > 0 ? (
              <p className="text-gray-500">
                Resend code in{' '}
                <span className="font-bold text-orange-500">{countdown.fmt}</span>
              </p>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="flex items-center gap-1.5 text-orange-500 font-semibold hover:underline min-h-11"
              >
                <RotateCcw size={14} /> Resend code
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep('enter-phone')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 min-h-11"
            >
              <ArrowLeft size={15} /> Change number
            </button>
            <button
              type="button"
              disabled={!otpFilled || verifying}
              onClick={handleVerifyOtp}
              className="min-h-11 px-6 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center gap-2 transition-colors"
            >
              {verifying ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Verifying…
                </>
              ) : (
                <>Verify &amp; Save <ArrowRight size={15} /></>
              )}
            </button>
          </div>

          <p className="text-[11px] text-gray-400 text-center mt-4">
            Tip: Any code except <code className="bg-gray-100 px-1 rounded">000000</code> will pass in demo mode.
          </p>
        </div>
      </ModalShell>
    );
  }

  // ── Step 3: Verified ─────────────────────────────────────────────────────
  return (
    <ModalShell onClose={onClose}>
      <div className="p-6 pt-8 flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
          <CheckCircle2 size={32} className="text-green-500" />
        </div>
        <h2 className="text-lg font-extrabold text-gray-900 mb-1">Phone verified!</h2>
        <p className="text-sm text-gray-500 mb-1">
          <span className="font-semibold text-gray-700">+234 {phone.replace(/^0/, '')}</span> has been verified
          and added to your profile.
        </p>
        {whatsapp && (
          <div className="flex items-center gap-2 mt-2 mb-6 text-xs text-green-600 font-semibold bg-green-50 border border-green-200 rounded-full px-3 py-1.5">
            <MessageCircle size={13} /> WhatsApp notifications enabled
          </div>
        )}
        {!whatsapp && <div className="mb-6" />}
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full min-h-11 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
        >
          Done
        </button>
      </div>
    </ModalShell>
  );
}
