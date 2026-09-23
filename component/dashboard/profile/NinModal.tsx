'use client';

// ─── NinModal ─────────────────────────────────────────────────────────────────
// Identity Verification (NIN) modal — isolated, no external state deps except onSave.

import { useState } from 'react';
import { IdCard, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import ModalShell from './ModalShell';

interface NinModalProps {
  accountFullName: string;
  onSave: (nin: string) => void;
  onClose: () => void;
}

function formatNin(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 11);
}

export default function NinModal({ accountFullName, onSave, onClose }: NinModalProps) {
  const [nin, setNin] = useState('');
  const isComplete = nin.length === 11;

  return (
    <ModalShell onClose={onClose}>
      <div className="p-6 pt-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6 pr-6">
          <div className="w-11 h-11 rounded-2xl bg-green-100 flex items-center justify-center shrink-0">
            <IdCard size={20} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Identity Verification (NIN)</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Enter your 11-digit National Identity Number to verify your identity. Verified owners
              enjoy instant listing approvals.
            </p>
          </div>
        </div>

        {/* NIMC badge */}
        <div className="flex items-center justify-between bg-green-50 rounded-2xl px-4 py-3 mb-5">
          <div className="flex items-center gap-2">
            {/* NIMC logo placeholder – two coloured circles */}
            <span className="flex gap-0.5">
              <span className="w-4 h-4 rounded-full bg-green-600 block" />
              <span className="w-4 h-4 rounded-full bg-orange-500 block -ml-1.5" />
            </span>
            <span className="text-sm font-semibold text-gray-800">Direct NIMC Database Verification</span>
          </div>
          <span className="text-[10px] font-bold bg-green-600 text-white px-2.5 py-1 rounded-full uppercase tracking-wide">
            Secure API
          </span>
        </div>

        {/* NIN input */}
        <div className="mb-2">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            National Identity Number (NIN)
          </label>
          <div className="relative">
            <input
              type="text"
              inputMode="numeric"
              value={nin}
              onChange={(e) => setNin(formatNin(e.target.value))}
              placeholder="Enter your 11-digit NIN"
              className="w-full h-12 px-4 pr-11 border border-gray-200 rounded-xl text-sm text-gray-900 tracking-widest placeholder:text-gray-400 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <ShieldCheck
              size={18}
              className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${
                isComplete ? 'text-green-500' : 'text-gray-300'
              }`}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <p className="text-xs text-gray-400">11 digits from your NIN slip or NIMC app</p>
            <a
              href="tel:*346#"
              className="text-xs text-orange-500 font-semibold hover:underline"
            >
              Don&apos;t have your slip? Dial *346#
            </a>
          </div>
        </div>

        {/* Name verification */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 mb-4 mt-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={15} className="text-blue-500" />
            <p className="text-sm font-semibold text-gray-800">Name Verification Requirement</p>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Account Full Name:</span>
            <span className="font-semibold text-gray-900">{accountFullName}</span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-500">Expected Match:</span>
            <span className="font-semibold text-orange-500">First or Last Name on NIN must match</span>
          </div>
        </div>

        {/* Privacy notice */}
        <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 flex items-start gap-3 mb-6">
          <Lock size={15} className="text-orange-500 mt-0.5 shrink-0" />
          <p className="text-xs text-orange-700">
            <span className="font-semibold">Privacy &amp; Data Protection:</span> Your NIN is
            encrypted with 256-bit SSL and checked strictly for identity validation. Rendoz never
            shares your identification number with renters or third parties.
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
            disabled={!isComplete}
            onClick={() => { onSave(nin); onClose(); }}
            className="min-h-11 px-6 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            Verify Identity
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
