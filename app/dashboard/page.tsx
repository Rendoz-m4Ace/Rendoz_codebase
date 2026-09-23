'use client';

import React from 'react';
import Link from 'next/link';
import {
  Package,
  CheckCircle2,
  Clock,
  CalendarClock,
  RefreshCw,
  Wallet,
  Plus,
  AlertCircle,
  Bell,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/* ─── Stat card ─── */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-5 flex flex-col gap-3 ${accent ? 'bg-orange-500 text-white' : 'bg-white text-gray-900'}`}>
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent ? 'bg-white/20' : 'bg-gray-100'}`}>
        <Icon size={18} className={accent ? 'text-white' : 'text-gray-500'} />
      </div>
      <div>
        <p className={`text-[11px] font-semibold uppercase tracking-wider mb-1 ${accent ? 'text-white/70' : 'text-gray-400'}`}>
          {label}
        </p>
        <p className={`text-2xl font-extrabold ${accent ? 'text-white' : 'text-gray-900'}`}>
          {value}
        </p>
        {sub && (
          <p className={`text-[11px] mt-1 ${accent ? 'text-white/60' : 'text-gray-400'}`}>{sub}</p>
        )}
      </div>
    </div>
  );
}

/* ─── Section header ─── */
function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

/* ─── Empty state ─── */
function EmptyState({
  icon: Icon,
  title,
  body,
  cta,
  ctaHref,
}: {
  icon: React.ElementType;
  title: string;
  body: string;
  cta?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center py-12 px-6">
      <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
        <Icon size={24} className="text-orange-400" />
      </div>
      <p className="text-sm font-semibold text-gray-700">{title}</p>
      <p className="text-sm text-gray-400 mt-1 max-w-xs">{body}</p>
      {cta && ctaHref && (
        <Link
          href={ctaHref}
          className="mt-5 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          <Plus size={15} /> {cta}
        </Link>
      )}
    </div>
  );
}

/* ─── Listing tab bar ─── */
const listingTabs = ['Active', 'Pending', 'Rejected', 'Draft', 'Archived'];
const bookingTabs = ['Requests', 'Upcoming', 'Active', 'Completed', 'Cancelled'];

function TabBar({
  tabs,
  active,
  onSelect,
  accentFirst,
}: {
  tabs: string[];
  active: string;
  onSelect: (t: string) => void;
  accentFirst?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {tabs.map((tab, i) => {
        const isActive = tab === active;
        const isFirst = i === 0;
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onSelect(tab)}
            className={`min-h-8 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
              isActive
                ? accentFirst && isFirst
                  ? 'bg-orange-500 text-white'
                  : 'bg-[#0B1220] text-white'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab} <span className="opacity-60">0</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Main page ─── */
export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const [listingTab, setListingTab] = React.useState('Active');
  const [bookingTab, setBookingTab] = React.useState('Requests');

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* ── Top bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Welcome, {firstName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="min-h-10 px-4 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:border-gray-400 transition-colors flex items-center gap-2"
          >
            Switch to Renting
          </button>
          <Link
            href="/dashboard/listings/new"
            className="min-h-10 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors flex items-center gap-2"
          >
            <Plus size={15} /> Create Listing
          </Link>
        </div>
      </div>

      {/* ── Onboarding banner ── */}
      <div className="rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-1">
            Get Started
          </p>
          <p className="text-base font-bold text-white">Your dashboard will fill in as you go</p>
          <p className="text-sm text-white/80 mt-0.5 max-w-sm">
            Fill out your setup to publish a first listing — once you have bookings, updates will
            appear automatically once you set up availability.
          </p>
        </div>
        <button
          type="button"
          className="shrink-0 min-h-10 px-5 rounded-full bg-white text-orange-600 text-sm font-bold hover:bg-orange-50 transition-colors"
        >
          Finish Setup
        </button>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <StatCard icon={Package} label="Total Listings" value={0} />
        <StatCard icon={CheckCircle2} label="Active Listings" value={0} />
        <StatCard icon={Clock} label="Pending Bookings" value={0} />
        <StatCard icon={CalendarClock} label="Upcoming Rentals" value={0} />
        <StatCard icon={RefreshCw} label="Current Rentals" value={0} />
        <StatCard icon={Wallet} label="Earnings" value="₦0" accent />
      </div>

      {/* ── Activity row ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <CalendarClock size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No upcoming rentals</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            Create and activate listings for the next 30 days with up-to-date listings to start
            receiving bookings from verified buyers.
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <Bell size={20} className="text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">No recent activity</p>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            New listings, messages or transactions will appear here as they happen.
          </p>
        </div>
      </div>

      {/* ── Listings ── */}
      <section>
        <SectionHeader
          title="Listings"
          sub="Everything you've listed, organised by status."
        />
        <div className="mb-4">
          <TabBar tabs={listingTabs} active={listingTab} onSelect={setListingTab} accentFirst />
        </div>
        <div className="bg-white rounded-2xl">
          <EmptyState
            icon={Package}
            title="No active listings yet"
            body="Once you publish an item, it'll appear here and become visible to renters on Rendoz."
            cta="Create Your First Listing"
            ctaHref="/dashboard/listings/new"
          />
        </div>
      </section>

      {/* ── Bookings ── */}
      <section>
        <SectionHeader
          title="Bookings"
          sub="Rental requests and reservations across all your listings."
        />
        <div className="mb-4">
          <TabBar tabs={bookingTabs} active={bookingTab} onSelect={setBookingTab} />
        </div>
        <div className="bg-white rounded-2xl">
          <EmptyState
            icon={Clock}
            title="No booking requests yet"
            body="When someone requests one of your items, it'll appear here so you can approve or decline it. You'll receive an email notification when bookings come in."
          />
        </div>
      </section>

      {/* ── Earnings ── */}
      <section>
        <SectionHeader
          title="Earnings"
          sub="What you've made, what's on the way, and what's ready to withdraw."
        />

        {/* Payout alert */}
        <div className="flex items-start gap-3 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 mb-4">
          <AlertCircle size={16} className="text-orange-500 mt-0.5 shrink-0" />
          <p className="text-sm text-orange-700">
            <span className="font-semibold">Payout account not set up.</span> You won&apos;t be able to
            withdraw earnings until you add a payout account (Paystack/Flutterwave).
          </p>
        </div>

        {/* Earnings cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-orange-500 rounded-2xl p-5 text-white">
            <p className="text-[10px] font-bold uppercase tracking-wider text-white/70 mb-2">
              Total Earnings
            </p>
            <p className="text-3xl font-extrabold">₦0</p>
            <p className="text-xs text-white/60 mt-1">Lifetime earnings from all rentals</p>
          </div>
          <div className="bg-white rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Pending Payout
            </p>
            <p className="text-3xl font-extrabold text-gray-900">₦0</p>
            <p className="text-xs text-gray-400 mt-1">
              From recently completed rentals, not yet available
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Available Payout
            </p>
            <p className="text-3xl font-extrabold text-gray-900">₦0</p>
            <p className="text-xs text-gray-400 mt-1">
              Ready to withdraw to your bank account or Opay
            </p>
          </div>
        </div>

        {/* Transactions table */}
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="hidden sm:grid grid-cols-4 px-6 py-3 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            <span>Transaction</span>
            <span>Listing</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
          </div>
          <EmptyState
            icon={Wallet}
            title="No transactions yet"
            body="Earnings from completed rentals will appear here along with your payment history. You can export anytime."
          />
        </div>
      </section>
    </div>
  );
}
