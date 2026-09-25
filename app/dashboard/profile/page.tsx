'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  User, MapPin, Calendar, Mail, Phone, CheckCircle2, CreditCard,
  Edit3, Star, Building, FileText, Lock, ShieldCheck, ShieldAlert,
  Plus, ChevronRight, Package, Camera, Fingerprint, Info, Sparkles,
} from 'lucide-react';

import PhoneModal    from '@/component/dashboard/profile/PhoneModal';
import LocationModal from '@/component/dashboard/profile/LocationModal';
import PayoutModal   from '@/component/dashboard/profile/PayoutModal';
import NinModal      from '@/component/dashboard/profile/NinModal';
import PhotoModal    from '@/component/dashboard/profile/PhotoModal';
import {
  defaultProfileData,
  type ProfileData,
} from '@/component/dashboard/profile/types';
import { useAuth } from '@/context/AuthContext';

/* ═══════════════════════════════════════════════════════
   Active modal union type
═══════════════════════════════════════════════════════ */
type ActiveModal =
  | 'phone' | 'location' | 'payout' | 'nin' | 'photo'
  | 'fullName' | 'businessName' | 'businessReg' | 'businessAddress'
  | null;

/* ═══════════════════════════════════════════════════════
   SVG Progress Ring
═══════════════════════════════════════════════════════ */
function ProgressRing({ percent, complete }: { percent: number; complete: boolean }) {
  const size = 80;
  const stroke = 6;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 absolute inset-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="rgba(255,255,255,0.25)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke="white" strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-base font-bold text-white leading-none">{percent}%</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Simple text-edit modal (name, business fields)
═══════════════════════════════════════════════════════ */
function TextEditModal({ title, label, placeholder, initial, multiline, onSave, onClose }: {
  title: string; label: string; placeholder?: string;
  initial: string; multiline?: boolean;
  onSave: (v: string) => void; onClose: () => void;
}) {
  const [val, setVal] = useState(initial);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 pt-8">
        <button onClick={onClose} aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors text-sm font-bold">
          ✕
        </button>
        <h2 className="text-lg font-bold text-gray-900 mb-4 pr-8">{title}</h2>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
          {label}
        </label>
        {multiline ? (
          <textarea value={val} onChange={(e) => setVal(e.target.value)} placeholder={placeholder}
            rows={3} autoFocus
            className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
        ) : (
          <input type="text" value={val} onChange={(e) => setVal(e.target.value)}
            placeholder={placeholder} autoFocus
            className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
        )}
        <div className="flex gap-3 mt-5">
          <button onClick={onClose}
            className="flex-1 h-11 rounded-full border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => { if (val.trim()) { onSave(val.trim()); onClose(); } }}
            disabled={!val.trim()}
            className="flex-1 h-11 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Checklist row
═══════════════════════════════════════════════════════ */
function ChecklistRow({ label, subtext, badge, completed, required, locked, actionLabel, onAction }: {
  label: string; subtext: string; badge?: string;
  completed: boolean; required?: boolean; locked?: boolean;
  actionLabel?: string; onAction?: () => void;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="mt-0.5 shrink-0">
        {completed ? (
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
        ) : locked ? (
          <div className="h-5 w-5 rounded-full border-2 border-gray-200 flex items-center justify-center">
            <Lock className="h-3 w-3 text-gray-300" />
          </div>
        ) : (
          <div className="h-5 w-5 rounded-full border-2 border-gray-300" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`text-sm font-semibold ${
            completed ? 'text-gray-700' : locked ? 'text-gray-400' : 'text-gray-800'
          }`}>{label}</span>
          {required && !completed && !locked && (
            <span className="text-[9px] font-bold uppercase tracking-wide text-orange-600 bg-orange-50 border border-orange-200 px-1.5 py-0.5 rounded">
              Required
            </span>
          )}
        </div>
        <p className={`text-[11px] mt-0.5 leading-snug ${completed ? 'text-gray-500' : 'text-gray-400'}`}>
          {subtext}
        </p>
        {completed && badge && (
          <p className="text-[11px] text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 shrink-0" />{badge}
          </p>
        )}
      </div>

      <div className="shrink-0 mt-0.5">
        {completed ? (
          <span className="text-xs font-semibold text-gray-400">Done</span>
        ) : locked ? (
          <span className="text-xs text-gray-300 font-medium">Locked</span>
        ) : actionLabel && onAction ? (
          <button onClick={onAction}
            className="text-sm font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-colors">
            {actionLabel}
          </button>
        ) : null}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Contact & Payout row
═══════════════════════════════════════════════════════ */
function ContactRow({ icon: Icon, label, badge, value, actionLabel, onAction }: {
  icon: React.ElementType; label: string; badge?: string;
  value: string | null; actionLabel?: string; onAction?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0">
      <div className="h-9 w-9 shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
        <Icon className="h-4 w-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">{label}</p>
          {badge && (
            <span className="text-[9px] font-bold uppercase tracking-wide text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <p className={`text-sm mt-0.5 font-medium truncate ${value ? 'text-gray-800' : 'text-gray-400'}`}>
          {value ?? 'Not added'}
        </p>
      </div>
      {actionLabel && onAction && (
        <button onClick={onAction}
          className="shrink-0 text-sm font-semibold text-orange-500 hover:underline transition-colors">
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════ */
export default function DashboardProfilePage() {
  const { user, markProfileComplete } = useAuth();

  /* Use auth name/email, fall back to display values */
  const [fullName, setFullName] = useState(user?.name ?? 'Amara Okafor');
  const email = user?.email ?? 'amara.okafor@email.com';

  // Start from what's saved on the account (the layout only renders once the user is loaded)
  const [profile, setProfile] = useState<ProfileData>(() => ({
    ...defaultProfileData,
    phone: user?.phone ?? '',
    photoUrl: user?.avatar ?? null,
    ...user?.profile,
  }));
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const patch = (p: Partial<ProfileData>) =>
    setProfile((prev) => ({ ...prev, ...p }));

  /* ── Progress ── */
  const steps = [
    true,                                             // full name
    true,                                             // email
    !!profile.phone,                                  // phone
    !!profile.locationLabel,                          // location
    !!profile.photoUrl,                               // photo
    profile.ninVerified,                              // NIN
    !!profile.payoutBankName,                         // payout
    profile.ninVerified && !!profile.payoutBankName,  // first listing
  ];
  const completedCount = steps.filter(Boolean).length;
  const totalCount = steps.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);
  const allComplete = completedCount === totalCount;
  const listingUnlocked = profile.ninVerified && !!profile.payoutBankName;

  // Sync profile completion into AuthContext so the layout can gate listing creation
  useEffect(() => {
    if (allComplete) markProfileComplete();
  }, [allComplete, markProfileComplete]);

  /* ── Masked account for display ── */
  const maskedAccount = profile.payoutAccountNumber
    ? `024••••${profile.payoutAccountNumber.slice(-3)}`
    : '';

  return (
    <div className="space-y-5">

      {/* ── BANNER ── */}
      <div className={`overflow-hidden rounded-2xl p-5 sm:p-6 shadow-sm text-white ${
        allComplete
          ? 'bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500'
          : 'bg-gradient-to-r from-[#EA580C] via-orange-500 to-orange-400'
      }`}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1 min-w-0 space-y-1 pr-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider opacity-90">
              {allComplete
                ? <><ShieldCheck className="h-4 w-4" /> Account Fully Verified</>
                : <><Sparkles className="h-4 w-4" /> Finish Setting Up</>}
            </div>
            <h2 className="text-xl font-bold sm:text-2xl leading-tight">
              {allComplete
                ? "You're ready to start earning!"
                : "You're almost ready to start earning"}
            </h2>
            <p className="text-sm opacity-80 max-w-md leading-relaxed">
              {allComplete
                ? 'All verification steps and payout accounts are confirmed. You can now publish listings and accept bookings from verified renters in Nigeria.'
                : 'Complete your owner profile to publish your first listing. Most owners finish this in under 10 minutes.'}
            </p>
          </div>

          <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
            <div className="flex items-center gap-3">
              <ProgressRing percent={progressPercent} complete={allComplete} />
              <div className="sm:hidden">
                <p className="text-sm font-bold text-white">{completedCount} of {totalCount} completed</p>
              </div>
            </div>
            <p className="hidden sm:block text-xs text-white/80 text-right">
              {completedCount} of {totalCount} completed
            </p>
            {allComplete && (
              <button className="flex items-center gap-2 rounded-full bg-white text-emerald-700 font-semibold text-sm px-4 py-2 hover:bg-emerald-50 transition-colors whitespace-nowrap">
                <Plus className="h-4 w-4" /> Create Listing
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── PROFILE HEADER ── */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <button onClick={() => setActiveModal('photo')} aria-label="Upload profile photo"
              className="group relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-orange-100 ring-2 ring-orange-200 hover:ring-orange-400 transition-all">
              {profile.photoUrl ? (
                <img src={profile.photoUrl} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="absolute inset-0 m-auto h-8 w-8 text-orange-400" />
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <Camera className="h-5 w-5 text-white" />
              </div>
              <span className={`absolute bottom-0.5 right-0.5 h-4 w-4 rounded-full border-2 border-white ${
                profile.ninVerified ? 'bg-emerald-500' : 'bg-red-400'
              }`} />
            </button>

            {/* Info */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>
                <span className="rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700">
                  Owner
                </span>
                {profile.ninVerified ? (
                  <span className="flex items-center gap-1 rounded bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
                    <ShieldCheck className="h-3 w-3" /> Verified Owner
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded bg-gray-100 border border-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                    <ShieldAlert className="h-3 w-3 text-orange-400" /> Unverified
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {profile.locationLabel || 'Location not set'}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />Joined September 2026
                </span>
                <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-[10px] text-gray-600">
                  Owner ID · RD2-0-01947
                </code>
              </div>
              <p className="mt-1 text-xs text-gray-400 flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-400" />
                {allComplete
                  ? 'New Owner · Ready for first booking review'
                  : 'No ratings yet — complete your first rental to earn one.'}
              </p>
            </div>
          </div>

          <button onClick={() => setActiveModal('fullName')}
            className="self-start sm:self-center flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all">
            <Edit3 className="h-3.5 w-3.5" /> Edit Profile
          </button>
        </div>
      </div>

      {/* ── 2-COLUMN LAYOUT ── */}
      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-3">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-5 lg:col-span-1">

          {/* Account Type */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-gray-900">Account Type</h3>
              {allComplete && <span className="text-xs font-semibold text-emerald-500">Active</span>}
            </div>
            <p className="mb-4 text-xs text-gray-500">This decides what details we ask you for</p>
            <div className="grid grid-cols-2 gap-3">
              {(['individual', 'business'] as const).map((type) => (
                <button key={type} onClick={() => patch({ accountType: type })}
                  className={`relative rounded-xl border-2 p-3 text-left transition-all ${
                    profile.accountType === type
                      ? 'border-orange-500 bg-orange-50/40'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}>
                  {profile.accountType === type && (
                    <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-orange-500" />
                  )}
                  <div className={`mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg ${
                    type === 'individual' ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    {type === 'individual'
                      ? <User className="h-4 w-4 text-orange-500" />
                      : <Building className="h-4 w-4 text-gray-500" />}
                  </div>
                  <p className="text-xs font-bold text-gray-900 capitalize">{type}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {type === 'individual' ? 'Renting out personal items' : 'Registered company or brand'}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Setup Checklist */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-gray-900">Setup Checklist</h3>
              <span className={`text-xs font-semibold ${allComplete ? 'text-emerald-500' : 'text-gray-400'}`}>
                {completedCount} of {totalCount} completed
              </span>
            </div>
            {allComplete && (
              <p className="text-[11px] text-emerald-600 mb-2">
                All verification requirements passed successfully.
              </p>
            )}
            {/* Progress bar */}
            <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className={`h-full rounded-full transition-all duration-500 ${
                allComplete ? 'bg-emerald-500' : 'bg-orange-500'
              }`} style={{ width: `${progressPercent}%` }} />
            </div>

            <ChecklistRow label="Full name" subtext={fullName}
              completed actionLabel="Edit" onAction={() => setActiveModal('fullName')} />
            <ChecklistRow label="Email address" subtext={email} completed />
            <ChecklistRow label="Phone number"
              subtext={profile.phone || 'Renters use this to coordinate pickup'}
              badge={profile.phone ? 'SMS Verified' : undefined}
              completed={!!profile.phone} required
              actionLabel="Add" onAction={() => setActiveModal('phone')} />
            <ChecklistRow label="Location"
              subtext={profile.locationLabel || 'Where your items are available from'}
              badge={profile.locationLabel ? 'Set & Searchable' : undefined}
              completed={!!profile.locationLabel} required
              actionLabel="Add" onAction={() => setActiveModal('location')} />
            <ChecklistRow label="Profile photo"
              subtext={profile.photoUrl ? 'High-resolution portrait uploaded' : 'Owners with photos get more rental requests'}
              badge={profile.photoUrl ? 'Approved' : undefined}
              completed={!!profile.photoUrl}
              actionLabel="Upload" onAction={() => setActiveModal('photo')} />
            <ChecklistRow label="Identity verification (NIN)"
              subtext={profile.ninVerified ? 'National Identity No. ••••••••' : 'NIN or government-issued ID'}
              badge={profile.ninVerified ? 'NIN Match Verified' : undefined}
              completed={profile.ninVerified} required
              actionLabel="Verify" onAction={() => setActiveModal('nin')} />
            <ChecklistRow label="Payout details"
              subtext={profile.payoutBankName
                ? `${profile.payoutBankName} · ${maskedAccount}`
                : "Bank account where you'll receive earnings"}
              badge={profile.payoutBankName ? 'Direct Deposit Active' : undefined}
              completed={!!profile.payoutBankName} required
              actionLabel="Add" onAction={() => setActiveModal('payout')} />
            {/* First listing — unlocks dynamically */}
            <div className="flex items-start gap-3 py-3">
              <div className="mt-0.5 shrink-0">
                {listingUnlocked ? (
                  <div className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center">
                    <Plus className="h-3 w-3 text-white" />
                  </div>
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-200 flex items-center justify-center">
                    <Lock className="h-3 w-3 text-gray-300" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <span className={`text-sm font-semibold ${listingUnlocked ? 'text-orange-600' : 'text-gray-400'}`}>
                  {listingUnlocked ? 'First listing unlocked!' : 'First listing'}
                </span>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  {listingUnlocked ? "You're ready to list your gear or vehicle" : 'Unlocks once verification and payout are done'}
                </p>
              </div>
              {listingUnlocked && (
                <Link href="/dashboard/listings/new"
                  className="shrink-0 flex items-center gap-1 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 transition-colors whitespace-nowrap">
                  Start Listing <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
              {!listingUnlocked && (
                <span className="shrink-0 text-xs text-gray-300 font-medium">Locked</span>
              )}
            </div>
          </div>

          {/* Business Details */}
          <div className={`rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-opacity duration-300 ${
            profile.accountType === 'individual' ? 'opacity-40 pointer-events-none' : ''
          }`}>
            <h3 className="text-sm font-bold text-gray-900">Business Details</h3>
            <p className="mb-4 text-xs text-gray-500">
              Shown only when Account Type is set to Business
            </p>
            <div className="divide-y divide-gray-100">
              {[
                { icon: Building,  label: 'BUSINESS NAME',         val: profile.businessName,       modal: 'businessName'    as ActiveModal },
                { icon: FileText,  label: 'CAC REGISTRATION NO.',  val: profile.businessRegNumber,  modal: 'businessReg'     as ActiveModal },
                { icon: FileText,  label: 'BUSINESS ADDRESS',      val: profile.businessAddress,    modal: 'businessAddress' as ActiveModal },
              ].map(({ icon: Icon, label, val, modal }) => (
                <div key={label} className="flex items-center gap-3 py-3">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
                    <Icon className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold">{label}</p>
                    <p className={`text-sm mt-0.5 truncate ${val ? 'font-medium text-gray-800' : 'text-gray-400'}`}>
                      {val || 'Not added'}
                    </p>
                  </div>
                  <button onClick={() => setActiveModal(modal)}
                    className="text-xs font-semibold text-orange-500 hover:underline shrink-0">
                    {val ? 'Edit' : 'Add'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-5 lg:col-span-2">

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'Active Listings', value: '0' },
              { label: 'Total Rentals',   value: '0' },
              { label: 'Total Earnings',  value: '₦0' },
              {
                label: 'Profile Score',
                value: allComplete ? '✓ 100%' : `${progressPercent}%`,
                green: allComplete,
              },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <span className={`block text-xl sm:text-2xl font-light ${
                  s.green ? 'text-emerald-600 font-semibold' : 'text-gray-900'
                }`}>{s.value}</span>
                <span className="text-xs font-medium text-gray-500">{s.label}</span>
              </div>
            ))}
          </div>

          {/* Contact & Payout */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm font-bold text-gray-900">Contact &amp; Payout</h3>
              {allComplete && (
                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                  <CheckCircle2 className="h-3.5 w-3.5" /> All Verified
                </span>
              )}
            </div>
            <p className="mb-4 text-xs text-gray-500">
              Renters only ever see your name, location and photo — never your private bank details.
            </p>

            <ContactRow icon={Mail} label="Email"
              badge="Verified"
              value={email}
              actionLabel="Manage" onAction={() => {}} />
            <ContactRow icon={Phone} label="Phone"
              badge={profile.phone ? 'Confirmed' : undefined}
              value={profile.phone ? `+234 ${profile.phone}` : null}
              actionLabel={profile.phone ? 'Change' : 'Add'}
              onAction={() => setActiveModal('phone')} />
            <ContactRow icon={MapPin} label="Pickup Location"
              badge={profile.locationLabel ? 'Verified Hub' : undefined}
              value={profile.locationLabel ? `${profile.locationLabel}, Nigeria` : null}
              actionLabel={profile.locationLabel ? 'Edit' : 'Add'}
              onAction={() => setActiveModal('location')} />
            <ContactRow icon={CreditCard} label="Payout Account"
              badge={profile.payoutBankName ? 'Instant Release' : undefined}
              value={profile.payoutBankName
                ? `${profile.payoutBankName} · ${profile.payoutAccountName} (••${profile.payoutAccountNumber.slice(-3)})`
                : null}
              actionLabel={profile.payoutBankName ? 'Manage' : 'Add'}
              onAction={() => setActiveModal('payout')} />
            <ContactRow icon={Fingerprint} label="NIN Identity"
              badge={profile.ninVerified ? 'NIMC Checked' : undefined}
              value={profile.ninVerified ? 'NIN Verified · National ID Database' : null}
              actionLabel={profile.ninVerified ? 'View Details' : 'Verify'}
              onAction={() => setActiveModal('nin')} />
          </div>

          {/* Listings CTA — changes based on completion */}
          {allComplete ? (
            <div className="rounded-2xl border-2 border-orange-200 bg-orange-50 p-6 sm:p-8 text-center shadow-sm">
              <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 mb-4">
                <ShieldCheck className="h-4 w-4" /> Verification Gate Unlocked
              </div>
              <div className="mb-3 mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-orange-500 text-white shadow">
                <Package className="h-7 w-7" />
              </div>
              <h4 className="text-base font-bold text-gray-900">Publish your first rental listing</h4>
              <p className="mt-1.5 max-w-sm mx-auto text-sm text-gray-500 leading-relaxed">
                Your profile and payouts are 100% ready. List your camera gear, sound systems,
                vehicles, or event tools in 3 simple steps to start receiving booking requests.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link href="/dashboard/listings/new"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow">
                  <Plus className="h-4 w-4" /> Create Your First Listing
                </Link>
                <button className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-orange-500 transition-colors">
                  See listing guidelines &amp; pricing tips <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5 w-fit mx-auto">
                <CheckCircle2 className="h-3.5 w-3.5" />
                All prerequisites complete · Instant submission to approval queue
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-500">
                <Package className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-gray-900">No listings yet</h4>
              <p className="mt-1 max-w-xs text-xs text-gray-500 leading-relaxed">
                Once your profile is verified, you can list your first item and start receiving
                rental requests from people nearby.
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button onClick={() => setActiveModal('nin')}
                  className="rounded-full bg-[#EA580C] px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-orange-700 transition-all">
                  Complete Verification
                </button>
                <button className="flex items-center gap-1 rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-all">
                  See what you can list <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <p className="mt-3 flex items-center gap-1.5 text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">
                <Info className="h-3 w-3 shrink-0" />
                Listing unlocks after identity verification and payout setup
              </p>
            </div>
          )}

          {/* Reviews */}
          <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <Star className="h-8 w-8 text-amber-300 mb-2" />
            <h4 className="text-sm font-bold text-gray-900">
              {allComplete ? 'Ready for your first review' : 'No reviews yet'}
            </h4>
            <p className="mt-1 text-xs text-gray-500 max-w-xs leading-relaxed">
              {allComplete
                ? 'Ratings and reviews from verified renters will appear here after your first completed handover.'
                : 'Reviews from renters will appear here after your first completed rental.'}
            </p>
          </div>

        </div>
      </div>

      {/* ════════════ MODALS ════════════ */}

      {activeModal === 'phone' && (
        <PhoneModal
          initialPhone={profile.phone}
          initialWhatsapp={profile.whatsappNotifications}
          onSave={(phone, whatsapp) => patch({ phone, whatsappNotifications: whatsapp })}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'location' && (
        <LocationModal
          initialState={profile.locationState || 'Lagos'}
          initialCity={profile.locationCity}
          initialStreet={profile.locationStreet}
          initialInstructions={profile.locationInstructions}
          onSave={({ state, city, street, instructions }) => patch({
            locationState: state,
            locationCity: city,
            locationStreet: street,
            locationInstructions: instructions,
            locationLabel: `${city}, ${state}`,
          })}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'payout' && (
        <PayoutModal
          accountHolderName={fullName}
          initialBank={profile.payoutBankName}
          initialAccountNumber={profile.payoutAccountNumber}
          onSave={(bank, accountNumber) => patch({
            payoutBankName: bank,
            payoutAccountNumber: accountNumber,
            payoutAccountName: fullName.toUpperCase(),
          })}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'nin' && (
        <NinModal
          accountFullName={fullName}
          onSave={() => patch({ ninVerified: true })}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'photo' && (
        <PhotoModal
          currentPhotoUrl={profile.photoUrl}
          onSave={(dataUrl) => patch({ photoUrl: dataUrl })}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'fullName' && (
        <TextEditModal title="Edit Full Name" label="Full Name" placeholder="Your full name"
          initial={fullName}
          onSave={setFullName}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'businessName' && (
        <TextEditModal title="Add Business Name" label="Business Name"
          placeholder="Your registered business name"
          initial={profile.businessName}
          onSave={(v) => patch({ businessName: v })}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'businessReg' && (
        <TextEditModal title="Add CAC Registration No." label="CAC Number"
          placeholder="RC-0000000"
          initial={profile.businessRegNumber}
          onSave={(v) => patch({ businessRegNumber: v })}
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'businessAddress' && (
        <TextEditModal title="Add Business Address" label="Address"
          placeholder="123 Business Road, Lagos"
          initial={profile.businessAddress} multiline
          onSave={(v) => patch({ businessAddress: v })}
          onClose={() => setActiveModal(null)}
        />
      )}

    </div>
  );
}
