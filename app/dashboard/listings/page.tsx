'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Filter, MapPin, Image as ImageIcon, Clock, CheckCircle2,
  ChevronRight, Edit3, Calendar, Trash2, Eye, Share2, MessageSquare,
  Star, AlertCircle, ShieldCheck, Zap, TrendingUp, AlertTriangle,
  Upload, FileText, X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */
type ListingStatus = 'pending' | 'active' | 'draft' | 'changes_requested' | 'suspended';

interface MockListing {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  location: string;
  condition: string;
  photos: number;
  dailyRate: number;
  weeklyRate: number;
  securityDeposit: number;
  status: ListingStatus;
  submittedAt: string;
  approvedAt?: string;
  views?: number;
  suspendedAt?: string;
  suspendReason?: string;
  adminNote?: string;
}

/* ═══════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════ */
const MOCK_LISTING: MockListing = {
  id: 'RDZ-L-2026-0322',
  name: '2020 Lexus RX 350',
  category: 'Vehicles',
  subcategory: 'SUVs',
  location: 'Ikeja, Lagos State',
  condition: 'Like New',
  photos: 4,
  dailyRate: 70000,
  weeklyRate: 420000,
  securityDeposit: 50000,
  status: 'pending',
  submittedAt: 'just now',
  approvedAt: 'Today at 11:42 AM',
  views: 14,
  suspendedAt: 'Oct 24, 2026',
  suspendReason: 'Expired vehicle insurance documentation or discrepancy in vehicle license plate details. Please upload valid proof to restore listing.',
  adminNote: 'Please provide updated roadworthiness or insurance certificate. Once submitted, review takes under 4 hours.',
};

/* ═══════════════════════════════════════════════════════
   SHARED ATOMS
═══════════════════════════════════════════════════════ */
function StatusPill({ status }: { status: ListingStatus }) {
  const map: Record<ListingStatus, { label: string; cls: string; dot: string }> = {
    pending:           { label: 'Pending Approval',   cls: 'bg-amber-50 text-amber-600 border border-amber-200',   dot: 'bg-amber-400' },
    active:            { label: 'Active & Live',       cls: 'bg-emerald-50 text-emerald-600 border border-emerald-200', dot: 'bg-emerald-500' },
    draft:             { label: 'Draft',               cls: 'bg-gray-100 text-gray-500 border border-gray-200',     dot: 'bg-gray-400' },
    changes_requested: { label: 'Changes Requested',  cls: 'bg-red-50 text-red-500 border border-red-200',         dot: 'bg-red-400' },
    suspended:         { label: 'Suspended',           cls: 'bg-red-50 text-red-600 border border-red-300',         dot: 'bg-red-600' },
  };
  const { label, cls, dot } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${cls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {label}
    </span>
  );
}

function StatCard({ icon: Icon, value, label, highlight, iconBg }: {
  icon: React.ElementType; value: string | number; label: string;
  highlight?: boolean; iconBg?: string;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-4 sm:p-5 flex items-start gap-3 sm:gap-4 transition-all ${
      highlight ? 'border-emerald-300 shadow-sm shadow-emerald-100' : 'border-gray-200'
    }`}>
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg ?? 'bg-gray-100'}`}>
        <Icon className="h-4.5 w-4.5" style={{ height: 18, width: 18 }}
          color={highlight ? '#16a34a' : '#9ca3af'} />
      </div>
      <div>
        <p className={`text-2xl font-extrabold leading-none ${highlight ? 'text-emerald-600' : 'text-gray-900'}`}>
          {value}
        </p>
        <p className="text-xs text-gray-500 mt-1 leading-snug">{label}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LISTING CARD — PENDING STATE
═══════════════════════════════════════════════════════ */
function PendingListingCard({ listing, onApprove }: { listing: MockListing; onApprove: () => void }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-[200px] h-40 sm:h-auto bg-gray-800 shrink-0 flex items-end">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-8 w-8 text-gray-500 mx-auto mb-1" />
              <span className="text-xs text-gray-500 font-medium">{listing.category} / {listing.subcategory}</span>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-1.5 px-3 pb-3">
            <div className="flex items-center gap-1 bg-black/60 rounded-lg px-2 py-1">
              <ImageIcon className="h-3 w-3 text-white" />
              <span className="text-[11px] text-white font-medium">{listing.photos} photos</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-bold text-gray-900">{listing.name}</h3>
            <StatusPill status="pending" />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.location}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>Submitted {listing.submittedAt}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>Condition: {listing.condition}</span>
          </div>

          {/* Pricing row */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { label: 'DAILY RATE',        value: `₦${listing.dailyRate.toLocaleString()} /\nday`, accent: true },
              { label: 'WEEKLY RATE',       value: `₦${listing.weeklyRate.toLocaleString()}` },
              { label: 'SECURITY DEPOSIT',  value: `₦${listing.securityDeposit.toLocaleString()}` },
            ].map(({ label, value, accent }) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
                <p className={`text-sm font-bold leading-snug ${accent ? 'text-orange-500' : 'text-gray-900'}`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Hidden notice */}
          <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2 mb-3">
            <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-700 font-medium">
              This listing is hidden from search and Browse until approved by the admin team.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Edit3 className="h-3.5 w-3.5" /> Edit Listing
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Calendar className="h-3.5 w-3.5" /> Manage Calendar
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-100 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
            {/* Dev shortcut to simulate approval */}
            <button onClick={onApprove}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-orange-300 bg-orange-50 text-xs font-bold text-orange-600 hover:bg-orange-100 transition-colors ml-auto">
              <Eye className="h-3.5 w-3.5" /> Preview as Renter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LISTING CARD — ACTIVE STATE
═══════════════════════════════════════════════════════ */
function ActiveListingCard({ listing }: { listing: MockListing }) {
  const [paused, setPaused] = useState(false);

  return (
    <div className="rounded-2xl border border-emerald-200 bg-white overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-[200px] h-40 sm:h-auto bg-gray-800 shrink-0 flex items-end">
          <div className="absolute top-3 left-3 z-10">
            <span className="flex items-center gap-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
              <span className="h-1.5 w-1.5 rounded-full bg-white inline-block" />
              Active • Live
            </span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <ImageIcon className="h-8 w-8 text-gray-500 mx-auto mb-1" />
              <span className="text-xs text-gray-500 font-medium">{listing.category} / {listing.subcategory}</span>
            </div>
          </div>
          <div className="relative z-10 flex items-center gap-1.5 px-3 pb-3">
            <div className="flex items-center gap-1 bg-black/60 rounded-lg px-2 py-1">
              <ImageIcon className="h-3 w-3 text-white" />
              <span className="text-[11px] text-white font-medium">{listing.photos} photos</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-bold text-gray-900">{listing.name}</h3>
            <StatusPill status="active" />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.location}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span className="text-emerald-600 font-semibold">Live on Browse</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>Condition: {listing.condition}</span>
          </div>

          {/* Pricing row */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { label: 'DAILY RATE',        value: `₦${listing.dailyRate.toLocaleString()} /\nday`, accent: true },
              { label: 'WEEKLY RATE',       value: `₦${listing.weeklyRate.toLocaleString()}` },
              { label: 'SECURITY DEPOSIT',  value: `₦${listing.securityDeposit.toLocaleString()}` },
            ].map(({ label, value, accent }) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
                <p className={`text-sm font-bold leading-snug ${accent ? 'text-orange-500' : 'text-gray-900'}`}>{value}</p>
              </div>
            ))}
          </div>

          {/* Live notice */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-3 py-2 flex-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
              <p className="text-[11px] text-emerald-700 font-medium">
                Live and searchable. Receiving booking requests.
              </p>
              <button className="text-[11px] font-bold text-emerald-600 hover:underline whitespace-nowrap ml-auto">
                View Public Page
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Calendar className="h-3.5 w-3.5" /> Manage Calendar
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Edit3 className="h-3.5 w-3.5" /> Edit Pricing &amp; Details
            </button>
            <button onClick={() => setPaused(!paused)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                paused
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                  : 'border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}>
              {paused ? <><CheckCircle2 className="h-3.5 w-3.5" /> Resume Listing</> : <><Clock className="h-3.5 w-3.5" /> Pause Listing</>}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-orange-200 bg-orange-50 text-xs font-bold text-orange-600 hover:bg-orange-100 transition-colors">
              <Share2 className="h-3.5 w-3.5" /> Share Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   APPROVAL TIMELINE — PENDING
═══════════════════════════════════════════════════════ */
function ApprovalTimeline() {
  const steps = [
    { num: 1, done: true,  label: 'Listing Created & Submitted',      sub: 'Photos, pricing, and availability details captured successfully.' },
    { num: 2, active: true, label: 'Admin Quality Check (Current)',   sub: 'Automated photo resolution & policy check. Rendoz admins inspect condition, pricing, and verification.', accent: true },
    { num: 3, done: false, label: 'Instant Notification & Activation', sub: "You'll get an alert via SMS & WhatsApp. Your asset immediately appears in search for renters in Ikeja." },
    { num: 4, done: false, label: 'Receive First Rental Request',      sub: 'Renters book via secure escrow. You review dates and approve requests right from this dashboard.' },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-1">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-4 w-4 text-amber-500" />
        <h3 className="text-sm font-bold text-gray-900">What happens next?</h3>
      </div>
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-4">Approval workflow &amp; timeline</p>

      <div className="space-y-4">
        {steps.map((s, i) => (
          <div key={s.num} className="flex gap-3">
            {/* Dot + line */}
            <div className="flex flex-col items-center">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 ${
                s.done
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : (s as any).active
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {s.done ? <CheckCircle2 className="h-4 w-4" /> : s.num}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 flex-1 mt-1 min-h-[20px] ${s.done || (s as any).active ? 'bg-orange-200' : 'bg-gray-200'}`} />
              )}
            </div>
            {/* Text */}
            <div className="pb-3 min-w-0">
              <p className={`text-sm font-bold leading-tight ${(s as any).active ? 'text-orange-600' : s.done ? 'text-gray-700' : 'text-gray-500'}`}>
                {s.label}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Fast Approval Checklist */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <p className="text-sm font-bold text-gray-900">Fast Approval Checklist</p>
        </div>
        {[
          'Owner Identity Verified: NIN & phone number matched',
          '4 Clear Photos Uploaded: Exceeds minimum 3-photo requirement',
          'Direct Payout Active: Nigerian bank account ready for payouts',
        ].map((item) => (
          <div key={item} className="flex items-start gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-600 leading-snug">{item}</p>
          </div>
        ))}
      </div>

      {/* Support */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-start gap-2">
          <MessageSquare className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Need to make urgent edits?</p>
            <p className="text-xs text-gray-400">Chat with Rendoz owner support</p>
          </div>
        </div>
        <button className="shrink-0 flex items-center gap-1 text-sm font-bold text-orange-500 hover:underline whitespace-nowrap">
          Get Help <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LIVE TIMELINE — ACTIVE
═══════════════════════════════════════════════════════ */
function LiveTimeline({ views }: { views: number }) {
  const steps = [
    { done: true,   label: 'Listing Approved',             sub: 'Inspection passed. Vehicle verified and certified by Rendoz.' },
    { done: true,   label: 'Public on Browse',             sub: 'Live in Lagos Island & Ikeja. Showing high search visibility.' },
    { active: true, label: 'Awaiting First Renter Request', sub: 'Renters are browsing. You will receive an immediate SMS push notification when a request is made.' },
    { done: false,  label: 'Renter Check-in & Handover',   sub: 'Confirm digital escrow payout release on handover day with photo odometer check.' },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-1">
      <div className="flex items-center gap-2 mb-1">
        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        <h3 className="text-sm font-bold text-gray-900">Listing Live &amp; Ready</h3>
      </div>
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider mb-4">Rental lifecycle &amp; bookings tracker</p>

      <div className="space-y-4">
        {steps.map((s, i) => (
          <div key={s.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                s.done
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : (s as any).active
                    ? 'bg-orange-500 border-orange-500 text-white text-xs font-bold'
                    : 'bg-white border-gray-200 text-gray-400 text-xs font-bold'
              }`}>
                {s.done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 flex-1 mt-1 min-h-[20px] ${s.done ? 'bg-emerald-300' : 'bg-gray-200'}`} />
              )}
            </div>
            <div className="pb-3 min-w-0">
              <p className={`text-sm font-bold leading-tight ${(s as any).active ? 'text-orange-600' : s.done ? 'text-gray-700' : 'text-gray-400'}`}>
                {s.label}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tips */}
      <div className="mt-5 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-bold text-gray-900">Tips for Your First Booking</p>
          </div>
          <span className="text-xs font-semibold text-orange-500 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
            {views} Views Today
          </span>
        </div>
        {[
          'Share on WhatsApp & Socials: Listings shared by owners receive their 1st booking 3× faster.',
          'Keep Calendar Updated: Block unavailable days to avoid renter cancellation penalties.',
          'Fast Response Badge: Respond to incoming rental inquiries within 30 mins to boost ranking.',
        ].map((tip) => (
          <div key={tip} className="flex items-start gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-600 leading-snug">{tip}</p>
          </div>
        ))}
      </div>

      {/* Support */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-start gap-2">
          <MessageSquare className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Have questions about bookings?</p>
            <p className="text-xs text-gray-400">Rendoz owner concierges are on standby</p>
          </div>
        </div>
        <button className="shrink-0 flex items-center gap-1 text-sm font-bold text-orange-500 hover:underline whitespace-nowrap">
          Get Help <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BANNER — PENDING
═══════════════════════════════════════════════════════ */
function PendingBanner({ listing }: { listing: MockListing }) {
  return (
    <div className="rounded-2xl border-l-4 border-l-amber-400 border border-amber-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Clock className="h-5 w-5 text-amber-500 shrink-0" />
            <h2 className="text-base font-extrabold text-gray-900">Listing Submitted for Review!</h2>
            <StatusPill status="pending" />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
            Your new listing "{listing.name}" has been submitted and is currently in the admin approval queue.
            Our team reviews all items to verify safety and authenticity before publishing to Browse.
          </p>
          <div className="mt-3 flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
            <Clock className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500">
              Estimated review time: Usually within 2–4 hours (Max 24 hours). You'll receive an SMS & email notification once approved.
            </p>
          </div>
        </div>
        <div className="sm:text-right shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            ID: {listing.id}
          </p>
          <button className="flex items-center gap-1 text-sm font-bold text-orange-500 hover:underline">
            How approval works <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   BANNER — ACTIVE
═══════════════════════════════════════════════════════ */
function ActiveBanner({ listing }: { listing: MockListing }) {
  return (
    <div className="rounded-2xl border-l-4 border-l-emerald-500 border border-emerald-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            <h2 className="text-base font-extrabold text-gray-900">Listing Approved &amp; Live on Rendoz!</h2>
            <StatusPill status="active" />
          </div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
            Your listing "{listing.name}" has been verified and published. Renters in Ikeja and across Lagos can
            now discover and book your asset.
          </p>
          <div className="mt-3 flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-700 font-medium">
              Published: {listing.approvedAt} • Available for immediate booking requests. Search visibility is 100%.
            </p>
          </div>
        </div>
        <div className="sm:text-right shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
            ID: {listing.id}
          </p>
          <button className="flex items-center gap-1 text-sm font-bold text-emerald-600 hover:underline">
            View Live Listing in Browse <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LISTING CARD — SUSPENDED STATE
═══════════════════════════════════════════════════════ */
function SuspendedListingCard({ listing }: { listing: MockListing }) {
  const [resolveOpen, setResolveOpen] = useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  return (
    <div className="rounded-2xl border border-red-200 bg-white overflow-hidden">
      <div className="flex flex-col sm:flex-row gap-0">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-[200px] h-40 sm:h-auto bg-gray-800 shrink-0 flex items-end">
          <div className="absolute top-2 left-2 z-10">
            <span className="bg-red-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg">Suspended</span>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-500" />
          </div>
          <div className="relative z-10 flex items-center gap-1.5 px-3 pb-3">
            <div className="flex items-center gap-1 bg-black/60 rounded-lg px-2 py-1">
              <ImageIcon className="h-3 w-3 text-white" />
              <span className="text-[11px] text-white font-medium">{listing.photos} photos</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <h3 className="text-base font-bold text-gray-900">{listing.name}</h3>
            <StatusPill status="suspended" />
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{listing.location}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>Suspended on {listing.suspendedAt}</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>Condition: {listing.condition}</span>
          </div>

          {/* Pricing row */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { label: 'DAILY RATE',       val: `₦${listing.dailyRate.toLocaleString()} /\nday`, accent: true },
              { label: 'WEEKLY RATE',      val: `₦${listing.weeklyRate.toLocaleString()}` },
              { label: 'SECURITY DEPOSIT', val: `₦${listing.securityDeposit.toLocaleString()}` },
            ].map(({ label, val, accent }) => (
              <div key={label}>
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
                <p className={`text-sm font-bold leading-snug ${accent ? 'text-orange-500' : 'text-gray-900'}`}>{val}</p>
              </div>
            ))}
          </div>

          {/* Admin note */}
          {listing.adminNote && (
            <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 mb-3">
              <FileText className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-600 leading-snug">
                <span className="font-semibold">Admin Note:</span> {listing.adminNote}
              </p>
            </div>
          )}

          {/* Upload area (conditional) */}
          {resolveOpen && (
            <div className="mb-3">
              <div
                onClick={() => fileRef.current?.click()}
                className="rounded-xl border-2 border-dashed border-red-300 bg-red-50/30 px-4 py-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-red-50/50 transition-colors">
                <Upload className="h-5 w-5 text-red-400" />
                <p className="text-xs font-semibold text-red-600">
                  {fileName ? fileName : 'Click to upload insurance / roadworthiness certificate'}
                </p>
                <p className="text-[10px] text-gray-400">PDF, JPG, or PNG · Max 10MB</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*,.pdf" className="sr-only"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setFileName(f.name); }} />
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setResolveOpen(!resolveOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors">
              <Upload className="h-3.5 w-3.5" />
              {resolveOpen ? 'Hide Upload' : 'Resolve & Upload Docs'}
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Edit3 className="h-3.5 w-3.5" /> Edit Details
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-red-100 text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 className="h-3.5 w-3.5" /> Delete Listing
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-orange-200 bg-orange-50 text-xs font-bold text-orange-500 hover:bg-orange-100 transition-colors ml-auto">
              <Eye className="h-3.5 w-3.5" /> Preview as Renter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   REACTIVATION PANEL (right column, suspended)
═══════════════════════════════════════════════════════ */
function ReactivationPanel() {
  const steps = [
    { done: true,   label: 'Step 1: Review Suspension Reason',    sub: 'Completed. Flagged for insurance or registration renewal.' },
    { active: true, label: 'Step 2: Upload Documentation (Action Required)', sub: "Upload clear, valid PDF or image of your vehicle's current insurance certificate." },
    { done: false,  label: 'Step 3: Priority Safety Review',       sub: 'Trust & Safety team verifies documents within < 4 hours of submission.' },
    { done: false,  label: 'Step 4: Listing Restored to Browse',   sub: 'Asset is immediately restored to search and renter bookings re-open.' },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <AlertTriangle className="h-4 w-4 text-red-500" />
        <h3 className="text-sm font-bold text-gray-900">How to Re-activate Your Listing</h3>
      </div>
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Resolution workflow &amp; timeline</p>

      <div className="space-y-4">
        {steps.map((s, i) => (
          <div key={s.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border-2 ${
                s.done   ? 'bg-emerald-500 border-emerald-500 text-white' :
                (s as any).active ? 'bg-red-600 border-red-600 text-white' :
                'bg-white border-gray-300 text-gray-400'
              }`}>
                {s.done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 flex-1 mt-1 min-h-[20px] ${s.done || (s as any).active ? 'bg-red-200' : 'bg-gray-200'}`} />
              )}
            </div>
            <div className="pb-3 min-w-0">
              <p className={`text-sm font-bold leading-tight ${
                (s as any).active ? 'text-red-600' : s.done ? 'text-gray-700' : 'text-gray-400'
              }`}>{s.label}</p>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-relaxed">{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Document requirements */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-4 w-4 text-gray-500" />
          <p className="text-sm font-bold text-gray-900">Document Requirements</p>
        </div>
        {[
          'Valid Expiry Date: Certificate must be active for at least 30 days',
          'Matching VIN/Plate: Details must match registered vehicle profile',
          'Clear Legibility: Unblurred document scan or high-res photo',
        ].map((req) => (
          <div key={req} className="flex items-start gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-600 leading-snug">{req}</p>
          </div>
        ))}
      </div>

      {/* Support */}
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-start gap-2">
          <MessageSquare className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Trust &amp; Safety Support</p>
            <p className="text-xs text-gray-400">Dedicated dispute &amp; compliance line</p>
          </div>
        </div>
        <button className="shrink-0 flex items-center gap-1 text-sm font-bold text-orange-500 hover:underline whitespace-nowrap">
          Chat with Trust &amp; Safety <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   SUSPENDED BANNER
═══════════════════════════════════════════════════════ */
function SuspendedBanner({ listing }: { listing: MockListing }) {
  return (
    <div className="rounded-2xl border-l-4 border-l-red-600 border border-red-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <h2 className="text-base font-extrabold text-gray-900">Listing Suspended — Action Required</h2>
            <span className="flex items-center gap-1.5 text-[11px] font-bold bg-red-50 border border-red-300 text-red-600 px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />Suspended
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
            Your listing "{listing.name}" ({listing.id}) has been suspended by Rendoz Trust &amp; Safety and temporarily removed from Browse.
          </p>
          {listing.suspendReason && (
            <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 leading-relaxed">
                <span className="font-semibold">Reason:</span> {listing.suspendReason}
              </p>
            </div>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <button className="flex items-center gap-2 h-10 px-4 rounded-full bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors">
              <Upload className="h-4 w-4" /> Submit Appeal / Update Docs
            </button>
            <button className="flex items-center gap-2 h-10 px-4 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
        <div className="sm:text-right shrink-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">ID: {listing.id}</p>
          <button className="flex items-center gap-1 text-sm font-bold text-orange-500 hover:underline">
            Policy guidelines <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}


type TabKey = 'pending' | 'active' | 'drafts' | 'changes' | 'all' | 'suspended';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'suspended', label: 'Suspended' },
  { key: 'active',    label: 'Active' },
  { key: 'pending',   label: 'Pending Review' },
  { key: 'drafts',    label: 'Drafts' },
  { key: 'all',       label: 'All Listings' },
];

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
export default function DashboardListingsPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const [listing, setListing] = useState<MockListing>({ ...MOCK_LISTING, status: 'suspended' });
  const [activeTab, setActiveTab] = useState<TabKey>('suspended');

  const isActive    = listing.status === 'active';
  const isPending   = listing.status === 'pending';
  const isSuspended = listing.status === 'suspended';

  const approveListing = () => {
    setListing((prev) => ({ ...prev, status: 'active' }));
    setActiveTab('active');
  };
  const suspendListing = () => {
    setListing((prev) => ({ ...prev, status: 'suspended' }));
    setActiveTab('suspended');
  };

  // Tab counts
  const tabCounts: Record<TabKey, number> = {
    pending:   isPending   ? 1 : 0,
    active:    isActive    ? 1 : 0,
    suspended: isSuspended ? 1 : 0,
    drafts:    0,
    changes:   0,
    all:       1,
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* ── TOP BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Monitor your equipment status, rental bookings, and earnings in one place.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex items-center gap-2 h-10 px-4 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Zap className="h-4 w-4" /> Switch to Renting
          </button>
          <Link href="/dashboard/listings/new"
            className="flex items-center gap-2 h-10 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-sm shadow-orange-200">
            <Plus className="h-4 w-4" /> List Another Item
          </Link>
        </div>
      </div>

      {/* ── BANNER ── */}
      {isPending   && <PendingBanner    listing={listing} />}
      {isActive    && <ActiveBanner     listing={listing} />}
      {isSuspended && <SuspendedBanner  listing={listing} />}

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={Clock}         value={isPending   ? 1 : 0} label="Pending Approval"      iconBg="bg-amber-50" />
        <StatCard icon={CheckCircle2}  value={isActive    ? 1 : 0} label="Active & Live Listings" highlight={isActive} iconBg={isActive ? 'bg-emerald-50' : 'bg-gray-100'} />
        <StatCard icon={AlertCircle}   value={isSuspended ? 1 : 0} label="Suspended Listings"     iconBg={isSuspended ? 'bg-red-50' : 'bg-gray-100'} />
        <StatCard icon={TrendingUp}    value="₦0"                   label="Total Earnings"          iconBg="bg-gray-100" />
      </div>

      {/* ── 2-COL LAYOUT ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* LEFT — Listings table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Your Listings</h2>
              <p className="text-xs text-gray-400 mt-0.5">Manage and track the status of all your rental assets.</p>
            </div>
            <button className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter className="h-3.5 w-3.5" /> Filter
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {TABS.map(({ key, label }) => {
              const count = tabCounts[key];
              const isTabActive = activeTab === key;
              const isHighlighted = key === 'active' && listing.status === 'active';
              const isSuspendedTab = key === 'suspended' && listing.status === 'suspended';
              return (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`h-8 px-3 rounded-full text-xs font-semibold transition-all ${
                    isTabActive
                      ? isSuspendedTab ? 'bg-red-600 text-white' :
                        isHighlighted  ? 'bg-emerald-500 text-white' :
                        'bg-gray-900 text-white'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}>
                  {label} <span className="opacity-60">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Listing card */}
          <div>
            {(activeTab === 'suspended' && isSuspended) && (
              <SuspendedListingCard listing={listing} />
            )}
            {(activeTab === 'pending' && isPending) && (
              <PendingListingCard listing={listing} onApprove={approveListing} />
            )}
            {(activeTab === 'active' && isActive) && (
              <ActiveListingCard listing={listing} />
            )}
            {activeTab === 'all' && (
              isSuspended
                ? <SuspendedListingCard listing={listing} />
                : isPending

                ? <PendingListingCard listing={listing} onApprove={approveListing} />
                : <ActiveListingCard listing={listing} />
            )}
            {((activeTab === 'pending' && !isPending) ||
              (activeTab === 'active'  && !isActive)  ||
              activeTab === 'drafts' || activeTab === 'changes') && (
              <div className="rounded-2xl border border-gray-200 bg-white py-14 flex flex-col items-center text-center px-4">
                <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                  <ImageIcon className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-sm font-semibold text-gray-600">No listings here</p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  {activeTab === 'drafts'
                    ? 'Saved drafts will appear here.'
                    : activeTab === 'changes'
                      ? 'Listings requiring changes will appear here.'
                      : `No ${activeTab} listings yet.`}
                </p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              {isPending
                ? 'You have 1 item pending approval. Once approved, it will automatically shift into your Active listings and start receiving rental requests.'
                : isSuspended
                  ? 'You have 1 suspended listing requiring attention. Submit requested documents to re-activate this asset and begin accepting bookings again.'
                  : 'You have 1 active listing receiving renter traffic. Renters in Ikeja can now initiate instant rental bookings and check-in schedules.'}
            </p>
          </div>
        </div>

        {/* RIGHT — Timeline / Panel */}
        <div>
          {isPending   && <ApprovalTimeline />}
          {isActive    && <LiveTimeline views={listing.views ?? 14} />}
          {isSuspended && <ReactivationPanel />}
        </div>
      </div>

      {/* Dev helper notes */}
      {isSuspended && (
        <p className="text-center text-[11px] text-gray-400">
          💡 Click <strong>"Resolve &amp; Upload Docs"</strong> to simulate document upload. State cycles: Suspended → Pending → Active.
        </p>
      )}
      {isPending && (
        <p className="text-center text-[11px] text-gray-400">
          💡 Click <strong>"Preview as Renter"</strong> on the listing card to simulate admin approval and see the Active state.
        </p>
      )}
    </div>
  );
}

