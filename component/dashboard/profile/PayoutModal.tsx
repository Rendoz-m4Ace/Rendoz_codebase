'use client';

// ─── PayoutModal ──────────────────────────────────────────────────────────────
// Add Payout Bank Account modal — isolated, no external state deps except onSave.

import { useState } from 'react';
import { CreditCard, CheckCircle2, Lock, Clock, ShieldCheck } from 'lucide-react';
import ModalShell from './ModalShell';

interface PayoutModalProps {
  accountHolderName: string;
  initialBank?: string;
  initialAccountNumber?: string;
  onSave: (bank: string, accountNumber: string) => void;
  onClose: () => void;
}

const NIGERIAN_BANKS = [
  'Access Bank',
  'Citibank Nigeria',
  'Ecobank Nigeria',
  'Fidelity Bank',
  'First Bank of Nigeria',
  'First City Monument Bank (FCMB)',
  'Guaranty Trust Bank (GTBank)',
  'Heritage Bank',
  'Keystone Bank',
  'Polaris Bank',
  'Providus Bank',
  'Stanbic IBTC Bank',
  'Standard Chartered Bank',
  'Sterling Bank',
  'SunTrust Bank',
  'Union Bank of Nigeria',
  'United Bank for Africa (UBA)',
  'Unity Bank',
  'Wema Bank',
  'Zenith Bank',
  'Kuda Bank',
  'Opay',
  'PalmPay',
  'Moniepoint',
];

/** Simulate account name lookup — in production this calls Paystack/Flutterwave */
function resolveAccountName(accountNumber: string, holderName: string): string | null {
  if (accountNumber.length === 10) return holderName.toUpperCase();
  return null;
}

export default function PayoutModal({
  accountHolderName,
  initialBank = '',
  initialAccountNumber = '',
  onSave,
  onClose,
}: PayoutModalProps) {
  const [bank, setBank] = useState(initialBank);
  const [accountNumber, setAccountNumber] = useState(initialAccountNumber);

  const resolvedName = resolveAccountName(accountNumber, accountHolderName);
  const canSave = bank && accountNumber.length === 10 && resolvedName;

  return (
    <ModalShell onClose={onClose}>
      <div className="p-6 pt-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6 pr-6">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
            <CreditCard size={20} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add Payout Bank Account</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Link your Nigerian bank account to receive direct payouts once your rentals begin.
              Payments are transferred automatically in Naira (₦).
            </p>
          </div>
        </div>

        {/* Bank name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">Bank Name</label>
          <div className="relative">
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full h-12 pl-4 pr-8 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              <option value="">Select your bank</option>
              {NIGERIAN_BANKS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Account number */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Account Number (NUBAN)
          </label>
          <input
            type="text"
            inputMode="numeric"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit account number"
            className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm text-gray-900 tracking-widest placeholder:tracking-normal placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Resolved account name */}
        {resolvedName && (
          <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={18} className="text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-bold text-green-800">{resolvedName}</p>
                <p className="text-xs text-green-600">Name matches your Rendoz registered profile</p>
              </div>
            </div>
            <span className="text-[10px] font-bold text-green-700 border border-green-300 rounded-full px-2.5 py-1 uppercase tracking-wide">
              Verified
            </span>
          </div>
        )}

        {/* Info bullets */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 mb-4 space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-gray-600">
            <Clock size={14} className="text-orange-400 shrink-0" />
            <span>
              <span className="font-semibold">Payout Timing:</span> Funds are credited within 24
              hours of successful handover
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-xs text-gray-600">
            <ShieldCheck size={14} className="text-orange-400 shrink-0" />
            <span>
              <span className="font-semibold">Rendoz Guarantee:</span> Renters pay upfront into
              secure escrow before you release gear
            </span>
          </div>
        </div>

        {/* Privacy */}
        <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 flex items-start gap-3 mb-6">
          <Lock size={15} className="text-orange-500 mt-0.5 shrink-0" />
          <p className="text-xs text-orange-700 font-medium">
            Strictly Confidential: Renters only ever see your public name, area, and gear listing —
            your bank account number and financial details are never visible to renters.
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
            disabled={!canSave}
            onClick={() => {
              if (canSave) {
                onSave(bank, accountNumber);
                onClose();
              }
            }}
            className="min-h-11 px-6 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            Link Account
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
