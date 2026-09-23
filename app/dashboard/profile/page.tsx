'use client';

import React, { useState } from 'react';
import {
  User,
  CheckCircle2,
  Circle,
  Camera,
  Phone,
  MapPin,
  ShieldCheck,
  CreditCard,
  Package,
  Star,
  Building2,
  Edit2,
  ExternalLink,
  Mail,
  Lock,
  AlertCircle,
  FileText,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { ProfileData, defaultProfileData, AccountType } from '@/component/dashboard/profile/types';
import PhoneModal from '@/component/dashboard/profile/PhoneModal';
import NinModal from '@/component/dashboard/profile/NinModal';
import PhotoModal from '@/component/dashboard/profile/PhotoModal';
import LocationModal from '@/component/dashboard/profile/LocationModal';
import PayoutModal from '@/component/dashboard/profile/PayoutModal';

// ─── Types ────────────────────────────────────────────────────────────────────
type ModalKey = 'phone' | 'nin' | 'photo' | 'location' | 'payout' | null;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]?.toUpperCase() ?? '').join('');
}

function calcCompletion(
  p: ProfileData,
  hasName: boolean,
  hasEmail: boolean,
): { done: number; total: number; pct: number } {
  const checks = [
    hasName,
    hasEmail,
    !!p.phone,
    !!p.locationCity,
    !!p.photoUrl,
    p.ninVerified,
    !!p.payoutBankName,
    false, // first listing — never auto-true
  ];
  const done = checks.filter(Boolean).length;
  return { done, total: checks.length, pct: Math.round((done / checks.length) * 100) };
}

// ─── Progress ring ────────────────────────────────────────────────────────────
function ProgressRing({
  pct,
  done,
  total,
  complete,
}: {
  pct: number;
  done: number;
  total: number;
  complete: boolean;
}) {
  const r = 30;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const strokeColor = complete ? '#4ade80' : 'white';
  const trackColor = complete ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.30)';

  return (
    <div className="flex flex-col items-center gap-1.5 shrink-0">
      <div className="relative w-[88px] h-[88px] rounded-full bg-white/25 flex items-center justify-center">
        <svg width="88" height="88" className="absolute inset-0 -rotate-90">
          <circle cx="44" cy="44" r={r} fill="none" stroke={trackColor} strokeWidth="5" />
          <circle
            cx="44" cy="44" r={r} fill="none"
            stroke={strokeColor} strokeWidth="5"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        <span className="text-lg font-extrabold text-white leading-none z-10">{pct}%</span>
      </div>
      <p className="text-xs text-white/80 font-semibold text-center whitespace-nowrap">
        {done} of {total} completed
      </p>
    </div>
  );
}

// ─── Completion banner ────────────────────────────────────────────────────────
function CompletionBanner({
  pct, done, total, onCreateListing,
}: {
  pct: number; done: number; total: number; onCreateListing: () => void;
}) {
  const complete = pct === 100;

  if (complete) {
    return (
      <div
        className="relative rounded-2xl overflow-hidden p-6 flex items-center justify-between gap-4"
        style={{ background: 'linear-gradient(135deg, #16a34a 0%, #15803d 50%, #166534 100%)' }}
      >
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 w-56 h-56 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-16 top-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-white/8 pointer-events-none" />

        <div className="relative flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={14} className="text-green-300" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-green-200">
              Account fully verified
            </span>
          </div>
          <p className="text-xl font-extrabold text-white leading-snug">
            You&apos;re ready to start earning!
          </p>
          <p className="text-sm text-white/80 mt-1.5 max-w-xs leading-relaxed">
            All verification steps and payout accounts are confirmed. You can now
            publish listings and accept bookings from verified renters in Nigeria.
          </p>
        </div>

        <div className="relative flex items-center gap-5 shrink-0">
          <ProgressRing pct={pct} done={done} total={total} complete={complete} />
          <button
            type="button"
            onClick={onCreateListing}
            className="hidden sm:flex items-center gap-2 min-h-11 px-5 rounded-full bg-white text-green-700 text-sm font-bold hover:bg-green-50 transition-colors shadow-md shrink-0"
          >
            <Plus size={15} /> Create Listing
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative rounded-2xl overflow-hidden p-6 flex items-center justify-between gap-4"
      style={{ background: 'linear-gradient(to right, #F97316, #FB923C, #FED7AA)' }}
    >
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-48 h-48 rounded-full bg-white/20 pointer-events-none" />
      <div className="absolute right-8 top-1/2 -translate-y-1/2 w-36 h-36 rounded-full bg-white/15 pointer-events-none" />

      <div className="relative flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-white/80">
            ✦ Finish setting up
          </span>
        </div>
        <p className="text-xl font-extrabold text-white leading-snug">
          You&apos;re almost ready to start earning
        </p>
        <p className="text-sm text-white/85 mt-1.5 max-w-xs leading-relaxed">
          Complete your owner profile to publish your first listing. Most owners
          finish this in under 10 minutes.
        </p>
      </div>

      <div className="relative shrink-0 mr-2">
        <ProgressRing pct={pct} done={done} total={total} complete={false} />
      </div>
    </div>
  );
}

// ─── Checklist row ────────────────────────────────────────────────────────────
function ChecklistRow({
  done, label, sub, subVerified, badge, onAction, actionLabel, locked, actionVariant = 'default',
}: {
  done: boolean; label: string; sub: string; subVerified?: string;
  badge?: 'required' | 'recommended'; onAction?: () => void; actionLabel?: string;
  locked?: boolean; actionVariant?: 'default' | 'start';
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="mt-0.5 shrink-0">
        {done ? (
          <CheckCircle2 size={18} className="text-green-500" />
        ) : locked ? (
          <Lock size={15} className="text-gray-300" />
        ) : (
          <Circle size={18} className="text-gray-300" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`text-sm font-semibold ${done ? 'text-gray-700' : locked ? 'text-gray-400' : 'text-gray-900'}`}>
            {label}
          </span>
          {badge && !done && !locked && (
            <span className="text-[9px] font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-600">
              {badge}
            </span>
          )}
        </div>
        <p className={`text-xs mt-0.5 leading-snug ${locked ? 'text-gray-300' : 'text-gray-500'}`}>{sub}</p>
        {done && subVerified && (
          <p className="text-[11px] mt-0.5 text-green-500 font-medium flex items-center gap-1">
            <CheckCircle2 size={10} /> {subVerified}
          </p>
        )}
      </div>
      {done && !actionVariant.startsWith('start') && (
        <span className="shrink-0 text-xs font-semibold text-gray-400 mt-0.5">Done</span>
      )}
      {!done && !locked && onAction && actionLabel && actionVariant === 'default' && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-xs font-bold text-orange-500 hover:text-orange-600 min-h-8 px-1 mt-0.5"
        >
          {actionLabel}
        </button>
      )}
      {!done && !locked && onAction && actionVariant === 'start' && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 min-h-8 px-3 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center gap-1 transition-colors"
        >
          {actionLabel} <ArrowRight size={11} />
        </button>
      )}
      {locked && (
        <span className="shrink-0 text-xs text-gray-300 font-medium mt-0.5">Locked</span>
      )}
    </div>
  );
}

// ─── Account type card ────────────────────────────────────────────────────────
function AccountTypeCard({
  value, current, title, sub, icon: Icon, onSelect, active: isActive,
}: {
  value: AccountType; current: AccountType; title: string; sub: string;
  icon: React.ElementType; onSelect: (v: AccountType) => void; active?: boolean;
}) {
  const active = current === value;
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={`flex-1 relative flex flex-col gap-2 rounded-2xl border-2 p-3 text-left transition-all ${
        active ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
    >
      {active && (
        <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
          <CheckCircle2 size={11} className="text-white" />
        </span>
      )}
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? 'bg-orange-100' : 'bg-gray-100'}`}>
        <Icon size={15} className={active ? 'text-orange-500' : 'text-gray-500'} />
      </div>
      <div>
        <p className={`text-sm font-bold ${active ? 'text-gray-900' : 'text-gray-700'}`}>{title}</p>
        <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">{sub}</p>
      </div>
    </button>
  );
}

// ─── Contact row ──────────────────────────────────────────────────────────────
function ContactRow({
  icon: Icon, label, verifiedLabel, value, masked, onAction, actionLabel = 'Add', isSet,
}: {
  icon: React.ElementType; label: string; verifiedLabel?: string; value?: string;
  masked?: string; onAction?: () => void; actionLabel?: string; isSet?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 py-3.5 border-b border-gray-100 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
        <Icon size={15} className={isSet ? 'text-orange-500' : 'text-gray-400'} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
          {verifiedLabel && isSet && (
            <span className="flex items-center gap-0.5 text-[9px] font-bold text-green-600">
              <CheckCircle2 size={9} /> {verifiedLabel}
            </span>
          )}
        </div>
        <p className={`text-sm mt-0.5 font-medium ${isSet ? 'text-gray-800' : 'text-gray-400'}`}>
          {isSet ? (masked || value || 'Set') : 'Not added'}
        </p>
      </div>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="shrink-0 text-xs font-bold text-orange-500 hover:text-orange-600 min-h-8 px-1 transition-colors"
        >
          {isSet ? actionLabel : 'Add'}
        </button>
      )}
    </div>
  );
}

// ─── Business row ─────────────────────────────────────────────────────────────
function BusinessRow({
  icon: Icon, label, value, onAdd,
}: {
  icon: React.ElementType; label: string; value?: string; onAdd?: () => void;
}) {
  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
        <Icon size={14} className="text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</p>
        <p className={`text-sm mt-0.5 ${value ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
          {value || 'Not added'}
        </p>
      </div>
      {!value && onAdd && (
        <button type="button" onClick={onAdd} className="shrink-0 text-xs font-bold text-orange-500 hover:text-orange-600 min-h-8 px-1">
          Add
        </button>
      )}
      {value && (
        <button type="button" aria-label="Edit" className="shrink-0 text-gray-400 hover:text-gray-600 min-h-8 px-1">
          <Edit2 size={13} />
        </button>
      )}
    </div>
  );
}

// ─── Stat cell ────────────────────────────────────────────────────────────────
function StatCell({
  label, value, verified,
}: {
  label: string; value: string | number; verified?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {verified ? (
        <p className="text-xl font-extrabold text-green-600 leading-none flex items-center gap-1">
          <CheckCircle2 size={16} className="text-green-500" /> {value}
        </p>
      ) : (
        <p className="text-xl font-extrabold text-gray-900 leading-none">{value}</p>
      )}
      <p className="text-xs text-gray-400">{label}</p>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function DashboardProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<ProfileData>(defaultProfileData);
  const [activeModal, setActiveModal] = useState<ModalKey>(null);

  if (!user) return null;

  function patch(partial: Partial<ProfileData>) {
    setProfile((p) => ({ ...p, ...partial }));
  }

  const locationLabel = profile.locationCity && profile.locationState
    ? `${profile.locationCity}, ${profile.locationState} State, Nigeria`
    : '';

  const { done, total, pct } = calcCompletion(profile, !!user.name, !!user.email);
  const isComplete = pct === 100;
  const isVerified = profile.ninVerified && !!profile.payoutBankName;

  const ownerId = 'RDZ-O-' + user.email.split('@')[0].slice(0, 5).toUpperCase().padEnd(5, '0').slice(0, 5) + Math.floor(Math.random() * 90 + 10).toString();
  const initials = getInitials(user.name);

  // Mask account number: show last 3
  const maskedAccount = profile.payoutAccountNumber
    ? profile.payoutBankName + ' · ' + profile.payoutAccountName + ' (••' + profile.payoutAccountNumber.slice(-3) + ')'
    : undefined;

  // Mask NIN
  const maskedNin = profile.ninVerified
    ? 'NIN Verified · National ID Database'
    : undefined;

  return (
    <>
      <div className="max-w-4xl mx-auto pb-16 space-y-4">

        {/* ── Description strip ── */}
        <p className="text-xs text-gray-400 leading-relaxed">
          Owner profile — display / verify / payment details. Everything renters see about your
          profile, where to pick up items, and settings about money, security verification and
          payment are found here — this page is always private and hidden.
        </p>

        {/* ── Banner (changes when complete) ── */}
        <CompletionBanner
          pct={pct}
          done={done}
          total={total}
          onCreateListing={() => {}}
        />

        {/* ── User card ── */}
        <div className="bg-white rounded-2xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full border-2 border-orange-200 overflow-hidden flex items-center justify-center bg-orange-50">
                {profile.photoUrl ? (
                  <img src={profile.photoUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl font-extrabold text-orange-400">{initials}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveModal('photo')}
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center shadow transition-colors"
                aria-label="Change photo"
              >
                <Camera size={11} />
              </button>
              {isVerified && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center shadow">
                  <CheckCircle2 size={11} className="text-white" />
                </span>
              )}
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-lg font-extrabold text-gray-900">{user.name}</h1>
                <span className="text-[10px] font-extrabold bg-orange-500 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                  Owner
                </span>
                {profile.ninVerified ? (
                  <span className="text-[10px] font-bold text-green-600 border border-green-300 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <CheckCircle2 size={9} /> Verified Owner
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-gray-400 border border-gray-200 bg-white px-2 py-0.5 rounded-full">
                    Unverified
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <MapPin size={11} />
                  {locationLabel || 'Location not set'}
                </span>
                <span>
                  Joined {new Date().toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
                </span>
                <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono text-[10px]">
                  Owner ID · {ownerId}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-1.5">
                <Star size={12} className="text-yellow-400 fill-yellow-400" />
                <span className="text-xs text-gray-500 font-medium">New Owner</span>
                <span className="text-xs text-gray-400">· Ready for first booking review</span>
              </div>
            </div>

            {/* Edit */}
            <button
              type="button"
              className="shrink-0 min-h-9 px-4 rounded-full border border-orange-400 text-sm font-semibold text-orange-500 hover:bg-orange-50 transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* ── Two-column layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[264px_1fr] gap-4">

          {/* LEFT column */}
          <div className="space-y-4">

            {/* Account Type */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-0.5">
                <h2 className="text-sm font-bold text-gray-900">Account Type</h2>
                {isComplete && <span className="text-xs font-semibold text-green-600">Active</span>}
              </div>
              <p className="text-xs text-gray-400 mb-3">This decides what details we ask you for.</p>
              <div className="flex gap-2">
                <AccountTypeCard
                  value="individual" current={profile.accountType}
                  title="Individual" sub="Renting out personal items"
                  icon={User} onSelect={(v) => patch({ accountType: v })}
                />
                <AccountTypeCard
                  value="business" current={profile.accountType}
                  title="Business" sub="Registered company or brand"
                  icon={Building2} onSelect={(v) => patch({ accountType: v })}
                />
              </div>
            </div>

            {/* Setup Checklist */}
            <div className="bg-white rounded-2xl p-4">
              <div className="flex items-center justify-between mb-0.5">
                <h2 className="text-sm font-bold text-gray-900">Setup Checklist</h2>
                <span className={`text-xs font-bold ${isComplete ? 'text-green-600' : 'text-orange-500'}`}>
                  {done} of {total} completed
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-2">
                {isComplete
                  ? 'All verification requirements passed successfully.'
                  : `${total - done} steps remaining`}
              </p>

              <ChecklistRow
                done={!!user.name} label="Full name" sub={user.name}
              />
              <ChecklistRow
                done={!!user.email} label="Email address" sub={user.email}
              />
              <ChecklistRow
                done={!!profile.phone}
                label="Phone number"
                sub={profile.phone || 'Renters use this to coordinate pickup'}
                subVerified={profile.phone ? 'SMS Verified' : undefined}
                badge="required"
                onAction={() => setActiveModal('phone')}
                actionLabel="Add"
              />
              <ChecklistRow
                done={!!locationLabel}
                label="Location"
                sub={locationLabel || 'Where your items are available from'}
                subVerified={locationLabel ? 'Set & Searchable' : undefined}
                badge="required"
                onAction={() => setActiveModal('location')}
                actionLabel="Add"
              />
              <ChecklistRow
                done={!!profile.photoUrl}
                label="Profile photo"
                sub={profile.photoUrl ? 'High-resolution portrait uploaded' : 'Owners with photos get more rental requests'}
                subVerified={profile.photoUrl ? 'Approved' : undefined}
                badge="recommended"
                onAction={() => setActiveModal('photo')}
                actionLabel="Upload"
              />
              <ChecklistRow
                done={profile.ninVerified}
                label="Identity verification (NIN)"
                sub={profile.ninVerified ? 'National Identity No. ••••••••8492' : 'NIN or government-issued ID'}
                subVerified={profile.ninVerified ? 'NIN Match Verified' : undefined}
                badge="required"
                onAction={() => setActiveModal('nin')}
                actionLabel="Verify"
              />
              <ChecklistRow
                done={!!profile.payoutBankName}
                label="Payout details"
                sub={profile.payoutBankName
                  ? `${profile.payoutBankName} · 024••••319`
                  : 'Bank account where you\'ll receive earnings'}
                subVerified={profile.payoutBankName ? 'Direct Deposit Active' : undefined}
                badge="required"
                onAction={() => setActiveModal('payout')}
                actionLabel="Add"
              />
              <ChecklistRow
                done={false}
                label={isVerified ? 'First listing unlocked!' : 'First listing'}
                sub={isVerified
                  ? "You're ready to list your gear or vehicle"
                  : 'Unlocks once verification and payout are done'}
                locked={!isVerified}
                onAction={isVerified ? () => {} : undefined}
                actionLabel="Start Listing →"
                actionVariant={isVerified ? 'start' : 'default'}
              />
            </div>

            {/* Business Details */}
            <div className="bg-white rounded-2xl p-4">
              <h2 className="text-sm font-bold text-gray-900">Business Details</h2>
              <p className="text-xs text-gray-400 mt-0.5 mb-3">
                Shown only when Account Type is set to Business.
              </p>
              <BusinessRow icon={Building2} label="Business Name" value={profile.businessName || undefined} onAdd={() => {}} />
              <BusinessRow icon={FileText} label="CAC Registration No." value={profile.businessRegNumber || undefined} onAdd={() => {}} />
              <BusinessRow icon={MapPin} label="Business Description" value={profile.businessAddress || undefined} onAdd={() => {}} />
            </div>
          </div>

          {/* RIGHT column */}
          <div className="space-y-4">

            {/* Stats */}
            <div className="bg-white rounded-2xl p-5">
              <div className="flex flex-wrap gap-8 sm:gap-12">
                <StatCell value={0} label="Active Listings" />
                <StatCell value={0} label="Total Rentals" />
                <StatCell value="₦0" label="Total Earnings" />
                <StatCell
                  value={`${pct}%`}
                  label="Profile Score"
                  verified={isComplete}
                />
              </div>
            </div>

            {/* Contact & Payout */}
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-center justify-between mb-0.5">
                <h2 className="text-sm font-bold text-gray-900">Contact &amp; Payout</h2>
                {isVerified && (
                  <span className="text-xs font-bold text-green-600 flex items-center gap-1">
                    <CheckCircle2 size={12} /> All Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-400 mb-2">
                Renters only ever see your name, location and photo — never your private bank details.
              </p>

              <ContactRow
                icon={Mail}
                label="Email"
                verifiedLabel="Verified"
                value={user.email}
                isSet={true}
                onAction={() => {}}
                actionLabel="Manage"
              />
              <ContactRow
                icon={Phone}
                label="Phone"
                verifiedLabel="Confirmed"
                value={profile.phone}
                isSet={!!profile.phone}
                onAction={() => setActiveModal('phone')}
                actionLabel="Change"
              />
              <ContactRow
                icon={MapPin}
                label="Pickup Location"
                verifiedLabel="Verified Hub"
                value={locationLabel}
                isSet={!!locationLabel}
                onAction={() => setActiveModal('location')}
                actionLabel="Edit"
              />
              <ContactRow
                icon={CreditCard}
                label="Payout Account"
                verifiedLabel="Instant Release"
                value={maskedAccount}
                isSet={!!profile.payoutBankName}
                onAction={() => setActiveModal('payout')}
                actionLabel="Manage"
              />
              <ContactRow
                icon={ShieldCheck}
                label="NIN Identity"
                verifiedLabel="NIMC Checked"
                value={maskedNin}
                isSet={profile.ninVerified}
                onAction={() => setActiveModal('nin')}
                actionLabel="View Details"
              />
            </div>

            {/* Listing CTA */}
            {isVerified ? (
              /* Verified — show "Publish" CTA */
              <div className="bg-white rounded-2xl p-6 border-2 border-orange-100">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 mb-4">
                    <Lock size={12} className="text-orange-500" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-500">
                      Verification Gate Unlocked
                    </span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                    <Package size={22} className="text-orange-400" />
                  </div>
                  <p className="text-base font-extrabold text-gray-900">Publish your first rental listing</p>
                  <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed">
                    Your profile and payouts are 100% ready. List your camera gear, sound
                    systems, vehicles, or event tools in 3 simple steps to start receiving
                    booking requests.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 mt-5">
                    <button
                      type="button"
                      className="min-h-10 px-5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold flex items-center gap-2 transition-colors"
                    >
                      <Plus size={14} /> Create Your First Listing
                    </button>
                    <button
                      type="button"
                      className="min-h-10 px-4 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 transition-colors"
                    >
                      See listing guidelines &amp; pricing tips
                    </button>
                  </div>
                  <p className="text-xs text-green-600 mt-4 flex items-center gap-1.5 font-medium">
                    <CheckCircle2 size={12} />
                    All prerequisites complete · Instant submission to approval queue
                  </p>
                </div>
              </div>
            ) : (
              /* Not verified — show incomplete CTA */
              <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                  <Package size={22} className="text-orange-400" />
                </div>
                <p className="text-sm font-bold text-gray-900">No listings yet</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Once your profile is verified, you can list your first item and start receiving
                  rental requests from people nearby.
                </p>
                <div className="flex flex-wrap justify-center gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setActiveModal('nin')}
                    className="min-h-10 px-5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
                  >
                    Complete Verification
                  </button>
                  <button
                    type="button"
                    className="min-h-10 px-4 rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 flex items-center gap-1.5 transition-colors"
                  >
                    See what you can list <ExternalLink size={12} />
                  </button>
                </div>
                <p className="text-xs text-orange-500 mt-3 flex items-center gap-1.5">
                  <AlertCircle size={12} />
                  Listing unlocks after identity verification and payout setup
                </p>
              </div>
            )}

            {/* Reviews */}
            <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                <Star size={20} className="text-gray-300" />
              </div>
              <p className="text-sm font-bold text-gray-700">Ready for your first review</p>
              <p className="text-xs text-gray-400 mt-1 max-w-xs">
                Ratings and reviews from verified renters will appear here after your first completed handover.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {activeModal === 'phone' && (
        <PhoneModal
          initialPhone={profile.phone}
          initialWhatsapp={profile.whatsappNotifications}
          onSave={(phone, whatsapp) => patch({ phone, whatsappNotifications: whatsapp })}
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'nin' && (
        <NinModal
          accountFullName={user.name}
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
      {activeModal === 'location' && (
        <LocationModal
          initialState={profile.locationState || 'Lagos'}
          initialCity={profile.locationCity}
          initialStreet={profile.locationStreet}
          initialInstructions={profile.locationInstructions}
          onSave={({ state, city, street, instructions }) =>
            patch({
              locationState: state,
              locationCity: city,
              locationStreet: street,
              locationInstructions: instructions,
              locationLabel: `${city}, ${state} State`,
            })
          }
          onClose={() => setActiveModal(null)}
        />
      )}
      {activeModal === 'payout' && (
        <PayoutModal
          accountHolderName={user.name}
          initialBank={profile.payoutBankName}
          initialAccountNumber={profile.payoutAccountNumber}
          onSave={(bank, accountNumber) =>
            patch({
              payoutBankName: bank,
              payoutAccountNumber: accountNumber,
              payoutAccountName: user.name.toUpperCase(),
            })
          }
          onClose={() => setActiveModal(null)}
        />
      )}
    </>
  );
}
