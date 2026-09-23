'use client';

// ─── PhoneModal ───────────────────────────────────────────────────────────────
// Add phone number modal — self-contained, no external state deps except onSave.

import { useState } from 'react';
import { Phone, MessageCircle, Lock, ArrowRight } from 'lucide-react';
import ModalShell from './ModalShell';

interface PhoneModalProps {
  initialPhone?: string;
  initialWhatsapp?: boolean;
  onSave: (phone: string, whatsapp: boolean) => void;
  onClose: () => void;
}

export default function PhoneModal({
  initialPhone = '',
  initialWhatsapp = true,
  onSave,
  onClose,
}: PhoneModalProps) {
  const [phone, setPhone] = useState(initialPhone);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);
  const [agreed, setAgreed] = useState(false);

  const canSubmit = phone.trim().length >= 7;

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
            {/* Country code */}
            <div className="flex items-center gap-1.5 px-3 h-12 border border-gray-200 rounded-xl bg-gray-50 text-sm font-medium text-gray-700 shrink-0">
              <span>🇳🇬</span>
              <span>+234</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-400">
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            {/* Number */}
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
          {/* Toggle */}
          <button
            type="button"
            role="switch"
            aria-checked={whatsapp}
            onClick={() => setWhatsapp((v) => !v)}
            className={`relative shrink-0 w-10 h-6 rounded-full transition-colors ${
              whatsapp ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                whatsapp ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
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
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 px-5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() => { onSave(phone.trim(), whatsapp); onClose(); }}
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
