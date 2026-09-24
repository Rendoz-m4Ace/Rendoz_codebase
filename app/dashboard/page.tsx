'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Plus, CheckCircle2, Clock, Calendar, Wallet, Package,
  Image as ImageIcon, Edit3, ChevronRight, MessageSquare,
  AlertCircle, TrendingUp, Settings,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/* ═══════════════════════════════════════════════════════════
   STAT CARD
═══════════════════════════════════════════════════════════ */
function StatCard({
  icon: Icon, value, label, iconBg,
}: {
  icon: React.ElementType; value: string | number; label: string; iconBg?: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-start gap-3">
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg ?? 'bg-gray-100'}`}>
        <Icon style={{ height: 18, width: 18 }} color="#9ca3af" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1 leading-snug">{label}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   GET STARTED BANNER
═══════════════════════════════════════════════════════════ */
function GetStartedBanner() {
  return (
    <div className="relative rounded-2xl overflow-hidden p-5 flex items-center justify-between gap-4"
      style={{ background: 'linear-gradient(to right, #F97316, #FB923C, #FED7AA)' }}
    >
      {/* Decorative circles */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 w-44 h-44 rounded-full bg-white/20 pointer-events-none" />
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-white/15 pointer-events-none" />

      <div className="relative flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-1.5">
          <Settings size={12} className="text-white/80" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/80">
            Get Started
          </span>
        </div>
        <p className="text-base sm:text-lg font-extrabold text-white leading-snug">
          Your dashboard will fill in as you go
        </p>
        <p className="text-sm text-white/80 mt-1 max-w-sm leading-relaxed">
          Fill out your setup to publish a first listing — once you have bookings, updates will
          appear automatically once you set up availability.
        </p>
      </div>

      <Link
        href="/dashboard/profile"
        className="relative shrink-0 min-h-10 px-5 rounded-full bg-white text-orange-600 text-sm font-bold hover:bg-orange-50 transition-colors shadow-md whitespace-nowrap"
      >
        Finish Setup
      </Link>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EMPTY PLACEHOLDER CARDS (upcoming + activity)
═══════════════════════════════════════════════════════════ */
function NoUpcomingRentals() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center text-center h-full">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
        <Calendar size={20} className="text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-700">No upcoming rentals</p>
      <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed">
        Create and activate listings for the next 30 days with up-to-date listings to start
        receiving bookings from verified buyers.
      </p>
    </div>
  );
}

function NoRecentActivity() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col items-center text-center h-full">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
        <MessageSquare size={20} className="text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-700">No recent activity</p>
      <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed">
        New listings, messages or transactions will appear here as they happen.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LISTINGS SECTION
═══════════════════════════════════════════════════════════ */
const LISTING_TABS = ['Active', 'Pending', 'Rejected', 'Draft', 'Archived'] as const;

function ListingsSection() {
  const [tab, setTab] = useState<string>('Active');

  return (
    <section>
      <h2 className="text-base font-extrabold text-gray-900">Listings</h2>
      <p className="text-xs text-gray-400 mt-0.5 mb-4">Everything you&apos;ve listed, organized by status.</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {LISTING_TABS.map((t) => {
          const isActive = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`h-8 px-3 rounded-full text-xs font-semibold transition-all ${
                isActive && t === 'Active'
                  ? 'bg-orange-500 text-white'
                  : isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t} <span className="opacity-50">0</span>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      <div className="rounded-2xl border border-gray-200 bg-white py-14 flex flex-col items-center text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
          <Package size={22} className="text-orange-400" />
        </div>
        <p className="text-sm font-bold text-gray-800">No active listings yet</p>
        <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed">
          Once you publish an item, it&apos;ll appear here and become visible to renters on Rendoz.
        </p>
        <Link
          href="/dashboard/listings/new"
          className="mt-5 flex items-center gap-2 h-10 px-5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
        >
          <Plus size={15} /> Create Your First Listing
        </Link>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOOKINGS SECTION
═══════════════════════════════════════════════════════════ */
const BOOKING_TABS = ['Requests', 'Upcoming', 'Active', 'Completed', 'Cancelled'] as const;

function BookingsSection() {
  const [tab, setTab] = useState<string>('Requests');

  return (
    <section>
      <h2 className="text-base font-extrabold text-gray-900">Bookings</h2>
      <p className="text-xs text-gray-400 mt-0.5 mb-4">Rental requests and reservations across all your listings.</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {BOOKING_TABS.map((t) => {
          const isActive = tab === t;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`h-8 px-3 rounded-full text-xs font-semibold transition-all ${
                isActive && t === 'Requests'
                  ? 'bg-orange-500 text-white'
                  : isActive
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {t} <span className="opacity-50">0</span>
            </button>
          );
        })}
      </div>

      {/* Empty state */}
      <div className="rounded-2xl border border-gray-200 bg-white py-14 flex flex-col items-center text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
          <Clock size={22} className="text-orange-400" />
        </div>
        <p className="text-sm font-bold text-gray-800">No booking requests yet</p>
        <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed">
          When someone requests one of your items, it&apos;ll appear here so you can approve or
          decline it.
        </p>
        <p className="text-xs text-gray-400 mt-2">
          You&apos;ll receive an email notification when bookings come in.
        </p>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   EARNINGS SECTION
═══════════════════════════════════════════════════════════ */
function EarningsSection() {
  return (
    <section>
      <h2 className="text-base font-extrabold text-gray-900">Earnings</h2>
      <p className="text-xs text-gray-400 mt-0.5 mb-4">
        What you&apos;ve made, what&apos;s on the way, and what&apos;s ready to withdraw.
      </p>

      {/* Payout not set up warning */}
      <div className="flex items-start gap-3 rounded-2xl bg-orange-50 border border-orange-200 px-4 py-3 mb-4">
        <AlertCircle size={15} className="text-orange-500 shrink-0 mt-0.5" />
        <p className="text-xs text-orange-700 leading-relaxed">
          <span className="font-bold">Payout account not set up.</span> You won&apos;t be able to
          withdraw earnings until you add a payout account to your account (Paystack/Flutterwave).
        </p>
      </div>

      {/* Earnings cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-2xl bg-orange-500 p-4 sm:p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-2">
            TOTAL EARNINGS
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold">₦0</p>
          <p className="text-[11px] text-white/60 mt-1">All-time earnings from all rentals</p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            PENDING PAYOUT
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">₦0</p>
          <p className="text-[11px] text-gray-400 mt-1">
            From recently completed rentals, not yet available
          </p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">
            AVAILABLE PAYOUT
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">₦0</p>
          <p className="text-[11px] text-gray-400 mt-1">
            Ready to withdraw to your bank account or Opay
          </p>
        </div>
      </div>

      {/* Transactions table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="hidden sm:grid grid-cols-4 px-5 py-3 border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <span>Transaction</span>
          <span>Listing</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
        </div>
        {/* Empty state inside table */}
        <div className="py-12 flex flex-col items-center text-center px-4">
          <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <TrendingUp size={18} className="text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-600">No transactions yet</p>
          <p className="text-xs text-gray-400 mt-1 max-w-xs leading-relaxed">
            Earnings from completed rentals will appear here along with your payment history. You
            can export anytime.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════ */
export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="max-w-5xl mx-auto space-y-7">

      {/* ── TOP BAR ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Welcome, {firstName}
          </h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="min-h-10 px-4 rounded-full border border-orange-400 text-orange-500 text-sm font-semibold hover:bg-orange-50 transition-colors">
            Switch to Renting
          </button>
          <Link
            href="/dashboard/listings/new"
            className="flex items-center gap-1.5 min-h-10 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
          >
            <Plus size={14} /> Create Listing
          </Link>
        </div>
      </div>

      {/* ── GET STARTED BANNER ── */}
      <GetStartedBanner />

      {/* ── 6 STAT CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatCard icon={Package}      value={0} label="Total Listings"   iconBg="bg-gray-100" />
        <StatCard icon={CheckCircle2} value={0} label="Active Listings"  iconBg="bg-gray-100" />
        <StatCard icon={Clock}        value={0} label="Pending Bookings" iconBg="bg-gray-100" />
        <StatCard icon={Calendar}     value={0} label="Upcoming Rentals" iconBg="bg-gray-100" />
        <StatCard icon={TrendingUp}   value={0} label="Current Rentals"  iconBg="bg-gray-100" />
        <StatCard icon={Wallet}       value="₦0" label="Earnings"        iconBg="bg-gray-100" />
      </div>

      {/* ── NO UPCOMING + NO ACTIVITY — side by side ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NoUpcomingRentals />
        <NoRecentActivity />
      </div>

      {/* ── LISTINGS ── */}
      <ListingsSection />

      {/* ── BOOKINGS ── */}
      <BookingsSection />

      {/* ── EARNINGS ── */}
      <EarningsSection />
    </div>
  );
}
