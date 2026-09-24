'use client';

// ─── NinModal ─────────────────────────────────────────────────────────────────
// 3-step flow:
//   Step 1 — Enter 11-digit NIN → "Verify Identity"
//   Step 2 — Verifying… (spinner + mock API call)
//   Step 3 — Confirmation: matched NIN details with name, DOB, gender
// Self-contained; only talks to parent via onSave / onClose.

import { useState, useEffect } from 'react';
import { IdCard, ShieldCheck, Lock, CheckCircle2, AlertCircle, ArrowRight, ArrowLeft, User } from 'lucide-react';
import ModalShell from './ModalShell';

interface NinModalProps {
  accountFullName: string;
  onSave: (nin: string) => void;
  onClose: () => void;
}

function formatNin(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, 11);
}

// ─── Mock NIMC lookup ─────────────────────────────────────────────────────────
// In production this would call your backend → NIMC API.
// We derive a fake "NIN record" from the user's account name so the match
// always looks realistic in demo mode.
interface NimcRecord {
  firstName: string;
  lastName:  string;
  middleName: string;
  dob:       string;  // DD-MM-YYYY
  gender:    string;
  state:     string;
  masked:    string;  // e.g. "••••••• 8492"
  matchStatus: 'matched' | 'partial' | 'mismatch';
}

async function mockNimcLookup(nin: string, accountFullName: string): Promise<NimcRecord> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 1800));

  const parts = accountFullName.trim().split(/\s+/);
  const first = parts[0] ?? 'Amara';
  const last  = parts[parts.length - 1] ?? 'Okafor';
  const mid   = parts.length > 2 ? parts[1] : 'Chidimma';

  // Deliberately mismatch if NIN starts with 0 (for demo purposes)
  const matchStatus: NimcRecord['matchStatus'] =
    nin.startsWith('0') ? 'mismatch' : 'matched';

  return {
    firstName:   first.toUpperCase(),
    lastName:    last.toUpperCase(),
    middleName:  mid.toUpperCase(),
    dob:         '15-03-1995',
    gender:      'FEMALE',
    state:       'Lagos',
    masked:      `••••••• ${nin.slice(-4)}`,
    matchStatus,
  };
}

// ─── Step 1 component ────────────────────────────────────────────────────────
function EnterNinStep({
  nin, onChange, accountFullName, onSubmit, onClose,
}: {
  nin: string; onChange: (v: string) => void;
  accountFullName: string; onSubmit: () => void; onClose: () => void;
}) {
  const isComplete = nin.length === 11;

  return (
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
            onChange={(e) => onChange(formatNin(e.target.value))}
            placeholder="Enter your 11-digit NIN"
            className="w-full h-12 px-4 pr-11 border border-gray-200 rounded-xl text-sm text-gray-900 tracking-widest placeholder:text-gray-400 placeholder:tracking-normal focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
          <ShieldCheck
            size={18}
            className={`absolute right-4 top-1/2 -translate-y-1/2 transition-colors ${isComplete ? 'text-green-500' : 'text-gray-300'}`}
          />
        </div>
        <div className="flex justify-between mt-1.5">
          <p className="text-xs text-gray-400">11 digits from your NIN slip or NIMC app</p>
          <a href="tel:*346#" className="text-xs text-orange-500 font-semibold hover:underline">
            Don&apos;t have your slip? Dial *346#
          </a>
        </div>
      </div>

      {/* Name verification box */}
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
        <button type="button" onClick={onClose} className="min-h-11 px-5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">
          Cancel
        </button>
        <button
          type="button"
          disabled={!isComplete}
          onClick={onSubmit}
          className="min-h-11 px-6 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          Verify Identity <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ─── Step 2: Verifying spinner ────────────────────────────────────────────────
function VerifyingStep() {
  return (
    <div className="p-6 pt-10 pb-12 flex flex-col items-center text-center">
      <div className="relative w-16 h-16 mb-6">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-green-100" />
        {/* Spinning arc */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-green-500 animate-spin" />
        {/* Inner icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <IdCard size={22} className="text-green-500" />
        </div>
      </div>
      <h2 className="text-base font-extrabold text-gray-900 mb-1">Verifying your identity…</h2>
      <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
        Checking your NIN against the NIMC database. This usually takes 2–5 seconds.
      </p>
      <div className="flex gap-1.5 mt-5">
        {['Retrieving record', 'Matching name', 'Confirming identity'].map((label, i) => (
          <span
            key={label}
            className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full"
            style={{ animationDelay: `${i * 0.3}s` }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Confirmation ─────────────────────────────────────────────────────
function ConfirmationStep({
  record, nin, onConfirm, onRetry, onClose,
}: {
  record: NimcRecord; nin: string;
  onConfirm: () => void; onRetry: () => void; onClose: () => void;
}) {
  const matched = record.matchStatus === 'matched';

  return (
    <div className="p-6 pt-8">
      {/* Header */}
      <div className="flex items-start gap-4 mb-5 pr-6">
        <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${matched ? 'bg-green-100' : 'bg-red-100'}`}>
          {matched
            ? <CheckCircle2 size={22} className="text-green-600" />
            : <AlertCircle  size={22} className="text-red-500" />}
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            {matched ? 'Identity Confirmed' : 'Name Mismatch Detected'}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {matched
              ? 'Your NIN details have been retrieved. Confirm they match your Rendoz account to continue.'
              : 'The name on your NIN does not match your Rendoz account name. Please check your details.'}
          </p>
        </div>
      </div>

      {/* NIN record card */}
      <div className={`rounded-2xl border px-4 py-4 mb-4 ${matched ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
            NIMC Record Retrieved
          </p>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${
            matched ? 'bg-green-600 text-white' : 'bg-red-500 text-white'
          }`}>
            {matched ? 'Matched' : 'Mismatch'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
          {[
            { label: 'First Name',   value: record.firstName },
            { label: 'Last Name',    value: record.lastName },
            { label: 'Middle Name',  value: record.middleName },
            { label: 'Date of Birth',value: record.dob },
            { label: 'Gender',       value: record.gender },
            { label: 'State',        value: record.state },
            { label: 'NIN',          value: record.masked },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Match status message */}
      {matched ? (
        <div className="flex items-start gap-2.5 rounded-xl bg-green-50 border border-green-200 px-4 py-3 mb-5">
          <CheckCircle2 size={15} className="text-green-500 mt-0.5 shrink-0" />
          <p className="text-xs text-green-700 font-medium">
            <span className="font-bold">Name matched.</span> Your account name matches the first or last name on your NIN record.
            Clicking "Confirm &amp; Verify" will mark your identity as verified.
          </p>
        </div>
      ) : (
        <div className="flex items-start gap-2.5 rounded-xl bg-red-50 border border-red-200 px-4 py-3 mb-5">
          <AlertCircle size={15} className="text-red-500 mt-0.5 shrink-0" />
          <p className="text-xs text-red-700 font-medium">
            <span className="font-bold">Name does not match.</span> The name on your NIN (
            <span className="font-bold">{record.firstName} {record.lastName}</span>) does not match
            your Rendoz account name. Update your account name or use a different NIN.
          </p>
        </div>
      )}

      {/* Privacy note */}
      <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 flex items-start gap-3 mb-6">
        <Lock size={15} className="text-orange-500 mt-0.5 shrink-0" />
        <p className="text-xs text-orange-700">
          <span className="font-semibold">Data secured:</span> Your full NIN is never stored.
          Only the verification result is saved to your profile.
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onRetry}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 min-h-11"
        >
          <ArrowLeft size={15} /> Try different NIN
        </button>
        {matched ? (
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-11 px-6 rounded-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold flex items-center gap-2 transition-colors"
          >
            <CheckCircle2 size={15} /> Confirm &amp; Verify
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 px-6 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Main export ─────────────────────────────────────────────────────────────
export default function NinModal({ accountFullName, onSave, onClose }: NinModalProps) {
  type Step = 'enter' | 'verifying' | 'confirm';

  const [step, setStep]       = useState<Step>('enter');
  const [nin, setNin]         = useState('');
  const [record, setRecord]   = useState<NimcRecord | null>(null);

  const handleSubmit = async () => {
    setStep('verifying');
    const result = await mockNimcLookup(nin, accountFullName);
    setRecord(result);
    setStep('confirm');
  };

  const handleConfirm = () => {
    onSave(nin);
    onClose();
  };

  const handleRetry = () => {
    setNin('');
    setRecord(null);
    setStep('enter');
  };

  return (
    <ModalShell onClose={onClose}>
      {step === 'enter' && (
        <EnterNinStep
          nin={nin}
          onChange={setNin}
          accountFullName={accountFullName}
          onSubmit={handleSubmit}
          onClose={onClose}
        />
      )}
      {step === 'verifying' && <VerifyingStep />}
      {step === 'confirm' && record && (
        <ConfirmationStep
          record={record}
          nin={nin}
          onConfirm={handleConfirm}
          onRetry={handleRetry}
          onClose={onClose}
        />
      )}
    </ModalShell>
  );
}
