'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus, Filter, MapPin, Image as ImageIcon, CheckCircle2,
  Clock, X, ChevronRight, MessageSquare, Calendar,
  Wallet, ShieldCheck, TrendingUp, Zap, Info,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */
type BookingStatus = 'upcoming' | 'active' | 'completed' | 'cancelled' | 'requests';

/* ═══════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════ */
function StatCard({ icon: Icon, value, label, accent, iconBg }: {
  icon: React.ElementType; value: string | number; label: string;
  accent?: 'green' | 'red' | 'orange'; iconBg?: string;
}) {
  return (
    <div className={`rounded-2xl border bg-white p-4 flex items-start gap-3 ${
      accent === 'green' ? 'border-emerald-200' :
      accent === 'red'   ? 'border-red-200' :
      accent === 'orange'? 'border-orange-200' :
      'border-gray-200'
    }`}>
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg ?? 'bg-gray-100'}`}>
        <Icon style={{ height: 18, width: 18 }}
          color={accent === 'green' ? '#16a34a' : accent === 'red' ? '#ef4444' : accent === 'orange' ? '#ea580c' : '#9ca3af'} />
      </div>
      <div>
        <p className={`text-xl font-extrabold leading-none ${
          accent === 'green'  ? 'text-emerald-600' :
          accent === 'red'    ? 'text-red-500' :
          accent === 'orange' ? 'text-orange-500' :
          'text-gray-900'
        }`}>{value}</p>
        <p className="text-xs text-gray-500 mt-1 leading-snug">{label}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CANCELED BOOKING CARD
═══════════════════════════════════════════════════════ */
function CanceledBookingCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-[200px] h-36 sm:h-auto bg-gray-800 shrink-0 flex items-center justify-center">
          <span className="absolute top-2 left-2 bg-gray-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg z-10">
            Canceled
          </span>
          <ImageIcon className="h-8 w-8 text-gray-500" />
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 rounded-lg px-2 py-0.5">
            <ImageIcon className="h-3 w-3 text-white" />
            <span className="text-[10px] text-white font-medium">4 photos</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vehicles / Luxury SUVs</span>
                <span className="text-[10px] text-gray-400">•</span>
                <span className="text-[10px] font-bold text-gray-500">Booking #RDZ-B-89024</span>
              </div>
              <h3 className="text-base font-extrabold text-gray-900">2020 Lexus RX 350</h3>
            </div>
            <span className="flex items-center gap-1.5 text-[11px] font-bold bg-red-50 border border-red-200 text-red-500 px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-red-500" />Canceled
            </span>
          </div>

          {/* Renter + dates */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <span className="font-medium text-gray-700">Renter:</span> Ayo Okafor
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 ml-1">
                <ShieldCheck className="h-2.5 w-2.5" />Verified
              </span>
            </span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>Canceled on Oct 12, 2026 (2 days before trip)</span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mb-3">
            <span className="font-semibold text-emerald-600">Dates Unlocked: Oct 14 – Oct 16</span>
          </div>

          {/* Pricing row */}
          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { label: 'TOTAL RESERVATION VALUE', val: '₦329,000' },
              { label: 'RESERVED DATES (3 DAYS)', val: 'Wed, Oct 14 – Fri, Oct 16' },
              { label: 'OWNER PAYOUT',              val: '₦0 (No Penalty)', green: true },
            ].map(({ label, val, green }) => (
              <div key={label}>
                <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">{label}</p>
                <p className={`text-xs font-bold ${green ? 'text-emerald-600' : 'text-gray-800'}`}>{val}</p>
              </div>
            ))}
          </div>

          {/* Policy note */}
          <div className="flex items-start gap-2 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 mb-3">
            <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-600 leading-snug">
              <span className="font-semibold">Moderate Policy Applied:</span> Canceled &gt;48h in advance (Full refund to renter per moderate cancellation policy, security deposit ₦50,000 released).
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button className="h-9 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Re-open Dates on Calendar
            </button>
            <button className="h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" /> Message Renter
            </button>
            <button className="h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              View Details
            </button>
            <button className="h-9 px-3 rounded-xl border border-emerald-200 bg-emerald-50 text-xs font-bold text-emerald-600 hover:bg-emerald-100 transition-colors">
              Listing Status: Live
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CANCELLATION SUMMARY PANEL
═══════════════════════════════════════════════════════ */
function CancellationSummaryPanel() {
  const steps = [
    { done: true,   label: 'Policy in Effect: Moderate Policy',  sub: 'Renter canceled > 48 hours prior to start time. Eligible for 100% refund of rental fee.' },
    { done: true,   label: 'Security Deposit Released',           sub: '₦50,000 security hold automatically unlocked from escrow.' },
    { active: true, label: 'Dates Restored to Browse',            sub: 'Oct 14 – Oct 16 are live and open for new bookings from other renters.' },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4">
      <div className="flex items-center gap-2 mb-1">
        <Clock className="h-4 w-4 text-gray-500" />
        <h3 className="text-sm font-bold text-gray-900">Cancellation Summary &amp; Policy</h3>
      </div>
      <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Resolution details &amp; calendar status</p>

      <div className="space-y-4">
        {steps.map((s, i) => (
          <div key={s.label} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                s.done
                  ? 'bg-emerald-500 border-emerald-500 text-white'
                  : (s as any).active
                    ? 'bg-orange-50 border-orange-400'
                    : 'bg-white border-gray-300'
              }`}>
                {s.done ? <CheckCircle2 className="h-4 w-4" /> :
                 (s as any).active ? <Calendar className="h-3.5 w-3.5 text-orange-500" /> : null}
              </div>
              {i < steps.length - 1 && <div className={`w-0.5 flex-1 mt-1 min-h-[16px] ${s.done ? 'bg-emerald-300' : 'bg-gray-200'}`} />}
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

      {/* Quick tips */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-orange-400" />
          <p className="text-sm font-bold text-gray-900">Quick Tips to Rebook Dates</p>
        </div>
        {[
          'Boost Visibility for Oct 14–16: Consider offering a 5% discount for short notice bookings.',
          'Share Listing Link: Re-share your listing link directly to recent interested renters.',
          'Instant Booking: Keep Instant Booking toggled on to quickly secure replacement trips.',
        ].map((tip) => (
          <div key={tip} className="flex items-start gap-2 mb-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-gray-600 leading-snug">{tip}</p>
          </div>
        ))}
      </div>

      {/* Support */}
      <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
        <div className="flex items-start gap-2">
          <MessageSquare className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-800">Questions about cancellation payouts?</p>
            <p className="text-[11px] text-gray-400">Read Rendoz Cancellation &amp; Escrow Policy</p>
          </div>
        </div>
        <button className="shrink-0 flex items-center gap-1 text-sm font-bold text-orange-500 hover:underline whitespace-nowrap">
          Chat with Owner Support <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
const TABS: { key: BookingStatus; label: string }[] = [
  { key: 'cancelled', label: 'Canceled' },
  { key: 'requests',  label: 'All' },
  { key: 'upcoming',  label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'requests',  label: 'Requests' },
];

export default function DashboardBookingsPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const [activeTab, setActiveTab] = useState<string>('Canceled');

  const tabDefs = [
    { label: 'Canceled', count: 1 },
    { label: 'All',      count: 1 },
    { label: 'Upcoming', count: 0 },
    { label: 'Completed',count: 0 },
    { label: 'Requests', count: 0 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Welcome back, {firstName}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Monitor your equipment status, rental bookings, and earnings in one place.</p>
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

      {/* Cancellation banner */}
      <div className="rounded-2xl border-l-4 border-l-gray-500 border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <X className="h-5 w-5 text-gray-500 shrink-0" />
              <h2 className="text-base font-extrabold text-gray-900">Rental Reservation Canceled by Renter</h2>
              <span className="flex items-center gap-1.5 text-[11px] font-bold bg-red-50 border border-red-200 text-red-500 px-2.5 py-1 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />Canceled
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xl">
              Booking #RDZ-B-89024 for "2020 Lexus RX 350" (Oct 14 – Oct 16) has been canceled by the renter (Ayo Okafor). Your dates have been automatically unlocked and restored to your calendar.
            </p>
            <div className="mt-3 flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
              <Calendar className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-xs text-gray-500 leading-relaxed">
                <span className="font-semibold">Calendar Notice:</span> Oct 14 – Oct 16 are instantly open for new booking requests. Moderate Cancellation Policy applied.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <button className="flex items-center gap-2 h-10 px-4 rounded-full bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold transition-colors">
                <Calendar className="h-4 w-4" /> View Calendar
              </button>
              <button className="flex items-center gap-2 h-10 px-4 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                Booking Policy
              </button>
            </div>
          </div>
          <div className="sm:text-right shrink-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">ID: RDZ-B-89024</p>
            <button className="flex items-center gap-1 text-sm font-bold text-orange-500 hover:underline">
              Policy details <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={CheckCircle2} value={1} label="Active Listing"      accent="green"  iconBg="bg-emerald-50" />
        <StatCard icon={X}            value={1} label="Canceled Booking"    accent="red"    iconBg="bg-red-50" />
        <StatCard icon={Clock}        value="₦0" label="Upcoming Payout"   iconBg="bg-gray-100" />
        <StatCard icon={Wallet}       value="₦0" label="Total Earnings"    iconBg="bg-gray-100" />
      </div>

      {/* 2-col layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">

        {/* Left — bookings table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">Your Bookings &amp; Listings</h2>
              <p className="text-xs text-gray-400 mt-0.5">Manage and track reservations, canceled trips, and rental calendar availability.</p>
            </div>
            <button className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              <Filter className="h-3.5 w-3.5" /> Filter
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5">
            {tabDefs.map(({ label, count }) => (
              <button key={label} onClick={() => setActiveTab(label)}
                className={`h-8 px-3 rounded-full text-xs font-semibold transition-all ${
                  activeTab === label
                    ? label === 'Canceled' ? 'bg-red-500 text-white' : 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-800'
                }`}>
                {label} <span className="opacity-60">{count}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          {(activeTab === 'Canceled' || activeTab === 'All') ? (
            <CanceledBookingCard />
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white py-12 flex flex-col items-center text-center px-4">
              <Clock className="h-8 w-8 text-gray-300 mb-2" />
              <p className="text-sm font-semibold text-gray-500">No {activeTab.toLowerCase()} bookings</p>
            </div>
          )}

          {/* Footer note */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              Reservation #RDZ-B-89024 has been concluded under cancellation terms. Dates for Oct 14–16 are live on Rendoz Browse for other renters.
            </p>
          </div>
        </div>

        {/* Right — summary panel */}
        <CancellationSummaryPanel />
      </div>
    </div>
  );
}
