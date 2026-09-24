'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Plus, CheckCircle2, Clock, Calendar, Wallet, Package,
  MapPin, Image as ImageIcon, Edit3, ChevronRight,
  MessageSquare, TrendingUp, Star, Zap, AlertTriangle,
  FileText, ArrowRight, Hand,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

/* ───────────────────────────────────────────
   SHARED ATOMS
─────────────────────────────────────────── */
function StatCard({
  icon: Icon, value, label, highlight, iconBg, accent,
}: {
  icon: React.ElementType; value: string | number; label: string;
  highlight?: boolean; iconBg?: string; accent?: 'green' | 'orange';
}) {
  return (
    <div className={`rounded-2xl border bg-white p-4 flex items-start gap-3 transition-all ${
      accent === 'green'  ? 'border-emerald-200 shadow-sm shadow-emerald-100' :
      accent === 'orange' ? 'border-orange-200 shadow-sm shadow-orange-100' :
      'border-gray-200'
    }`}>
      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg ?? 'bg-gray-100'}`}>
        <Icon style={{ height: 18, width: 18 }}
          color={accent === 'green' ? '#16a34a' : accent === 'orange' ? '#ea580c' : '#9ca3af'} />
      </div>
      <div>
        <p className={`text-xl font-extrabold leading-none ${
          accent === 'green' ? 'text-emerald-600' : accent === 'orange' ? 'text-orange-500' : 'text-gray-900'
        }`}>{value}</p>
        <p className="text-xs text-gray-500 mt-1 leading-snug">{label}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, action, href }: { title: string; action?: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-extrabold text-gray-900">{title}</h2>
      {action && href && (
        <Link href={href} className="flex items-center gap-1 text-xs font-semibold text-orange-500 hover:underline">
          {action} <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────
   TOP BANNER — live & performing
─────────────────────────────────────────── */
function LiveBanner() {
  return (
    <div className="rounded-2xl bg-[#0B1220] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Listing Live &amp; Performing</span>
        </div>
        <p className="text-base font-extrabold text-white leading-tight">
          2020 Lexus RX 350 has 14 views today &amp; 1 upcoming booking!
        </p>
        <p className="text-sm text-white/60 mt-1 leading-relaxed">
          Your rental starts Oct 14 with Ayo Okafor. Prepare handover verification photos and check-up level before pickup.
        </p>
      </div>
      <Link href="/dashboard/bookings"
        className="shrink-0 h-10 px-5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold transition-colors whitespace-nowrap">
        View Booking Details
      </Link>
    </div>
  );
}

/* ───────────────────────────────────────────
   UPCOMING RENTAL CARD
─────────────────────────────────────────── */
function UpcomingRentalCard() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Thumbnail */}
        <div className="relative w-full sm:w-40 h-28 sm:h-auto rounded-xl bg-gray-800 shrink-0 overflow-hidden flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-500" />
          <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 rounded-lg px-2 py-0.5">
            <ImageIcon className="h-3 w-3 text-white" />
            <span className="text-[10px] text-white font-medium">4 photos</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <h3 className="text-sm font-extrabold text-gray-900">2020 Lexus RX 350</h3>
            <span className="text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-600 px-2.5 py-1 rounded-full">
              ✓ Confirmed
            </span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Renter</p>
              <p className="font-semibold text-gray-800">Ayo Okafor</p>
              <p className="text-emerald-500 font-semibold text-[10px]">Verified</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Rental Dates</p>
              <p className="font-semibold text-gray-800">Oct 14 – 16, 2026</p>
              <p className="text-gray-400">3 days total</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Pickup</p>
              <p className="font-semibold text-gray-800">9:00 AM</p>
              <p className="text-gray-400 flex items-center gap-0.5"><MapPin className="h-3 w-3" />Ikeja, Lagos</p>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold text-orange-500">₦210,000</span>
              <span className="text-[10px] text-gray-400 ml-1">total payout</span>
            </div>
            <div className="flex gap-2">
              <button className="h-8 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Handover Checklist
              </button>
              <button className="h-8 px-3 rounded-xl bg-orange-50 border border-orange-200 text-xs font-bold text-orange-500 hover:bg-orange-100 transition-colors">
                Message Renter
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   ACTIVITY FEED
─────────────────────────────────────────── */
const ACTIVITY = [
  { icon: CheckCircle2, color: 'text-emerald-500', text: 'Booking confirmed for 2020 Lexus RX 350 by Ayo Okafor (Oct 14–16)', time: '2 mins ago' },
  { icon: CheckCircle2, color: 'text-emerald-500', text: 'Listing approved & published by Rendoz Verification Team', time: '3 minutes ago' },
  { icon: Wallet,       color: 'text-blue-400',    text: 'Payout bank account (GTBank ··· 7319) verified successfully', time: '1 hour ago' },
  { icon: Star,         color: 'text-amber-400',   text: 'NIN identity verification completed – Verified badge granted', time: '1 hour ago' },
];

function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-extrabold text-gray-900">Recent Activity</h3>
        <span className="text-[10px] text-gray-400 font-medium">Updated now</span>
      </div>
      <div className="space-y-3">
        {ACTIVITY.map(({ icon: Icon, color, text, time }) => (
          <div key={text} className="flex items-start gap-3">
            <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${color}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-700 leading-snug">{text}</p>
              <p className="text-[10px] text-gray-400 mt-0.5">{time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────
   LISTINGS SECTION
─────────────────────────────────────────── */
const LISTING_TABS = ['Active', 'Pending', 'Rejected', 'Draft', 'Archived'] as const;

function ListingsSection() {
  const [tab, setTab] = useState<string>('Active');

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-extrabold text-gray-900">Listings</h2>
        <Link href="/dashboard/listings/new"
          className="flex items-center gap-1.5 h-9 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors">
          <Plus className="h-3.5 w-3.5" /> Add New Listing
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {LISTING_TABS.map((t) => {
          const count = t === 'Active' ? 1 : 0;
          const isActive = tab === t;
          return (
            <button key={t} onClick={() => setTab(t)}
              className={`h-8 px-3 rounded-full text-xs font-semibold transition-all ${
                isActive && t === 'Active' ? 'bg-orange-500 text-white' :
                isActive ? 'bg-gray-900 text-white' :
                'text-gray-500 hover:text-gray-800'
              }`}>
              {t} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Listing card */}
      {tab === 'Active' ? (
        <div className="rounded-2xl border border-emerald-200 bg-white overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {/* Thumbnail */}
            <div className="relative w-full sm:w-44 h-32 sm:h-auto bg-gray-800 shrink-0 flex items-center justify-center">
              <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-lg z-10">
                LIVE &amp; SEARCHABLE
              </span>
              <ImageIcon className="h-7 w-7 text-gray-500" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/60 rounded-lg px-2 py-0.5">
                <ImageIcon className="h-3 w-3 text-white" />
                <span className="text-[10px] text-white font-medium">4 photos</span>
              </div>
            </div>
            <div className="flex-1 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                <div>
                  <h3 className="text-sm font-extrabold text-gray-900">2020 Lexus RX 350</h3>
                  <p className="text-xs text-gray-400">Vehicles / SUVs · Ikeja, Lagos State · Condition: Like New</p>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Verified Listing
                </span>
              </div>
              <div className="grid grid-cols-3 gap-3 my-3">
                {[
                  { label: 'DAILY RATE',       val: '₦70,000 /day', accent: true },
                  { label: 'WEEKLY RATE',      val: '₦420,000 /wk' },
                  { label: 'SECURITY DEPOSIT', val: '₦50,000' },
                ].map(({ label, val, accent }) => (
                  <div key={label}>
                    <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">{label}</p>
                    <p className={`text-xs font-bold ${accent ? 'text-orange-500' : 'text-gray-800'}`}>{val}</p>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <button className="h-8 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" /> Manage Calendar
                </button>
                <button className="h-8 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
                  <Edit3 className="h-3.5 w-3.5" /> Edit Pricing &amp; Details
                </button>
                <button className="h-8 px-3 rounded-xl border border-orange-200 bg-orange-50 text-xs font-bold text-orange-500 hover:bg-orange-100 transition-colors">
                  Preview as Renter
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white py-12 flex flex-col items-center text-center px-4">
          <div className="h-11 w-11 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-600">No {tab.toLowerCase()} listings</p>
        </div>
      )}
    </section>
  );
}

/* ───────────────────────────────────────────
   BOOKINGS SECTION
─────────────────────────────────────────── */
const BOOKING_TABS = ['Requests', 'Upcoming', 'Active', 'Completed', 'Cancelled'] as const;

function BookingsSection() {
  const [tab, setTab] = useState<string>('Upcoming');

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-extrabold text-gray-900">Bookings</h2>
        <Link href="/dashboard/bookings" className="text-xs font-semibold text-orange-500 hover:underline flex items-center gap-1">
          All bookings <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <p className="text-xs text-gray-400 mb-4">Rental requests and reservations across all your listings.</p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {BOOKING_TABS.map((t) => {
          const count = t === 'Upcoming' ? 1 : t === 'Cancelled' ? 3 : 0;
          const isActive = tab === t;
          return (
            <button key={t} onClick={() => setTab(t)}
              className={`h-8 px-3 rounded-full text-xs font-semibold transition-all ${
                isActive && t === 'Upcoming' ? 'bg-orange-500 text-white' :
                isActive ? 'bg-gray-900 text-white' :
                'text-gray-500 hover:text-gray-800'
              }`}>
              {t} <span className="opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      {tab === 'Upcoming' ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
          {/* Booking header */}
          <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">BOOKING #RDZ-B-4417</span>
                <span className="text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-600 px-2 py-0.5 rounded-full">✓ Confirmed</span>
                <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Held in Escrow</span>
              </div>
              <h3 className="text-sm font-extrabold text-gray-900">2020 Lexus RX 350</h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Total Payout (Net)</p>
              <p className="text-lg font-extrabold text-orange-500">₦210,000</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'RENTER',            val: 'Ayo Okafor', sub: 'Verified & Phone' },
              { label: 'RENTAL DATES',      val: 'Oct 14–16, 2026', sub: '3 days total' },
              { label: 'PICKUP / HANDOVER', val: '9:00 AM, Ikeja', sub: 'Set by Rendoz Escrow' },
              { label: 'SECURITY DEPOSIT',  val: '₦50,000 (Hold)', sub: 'Held by Rendoz Escrow' },
            ].map(({ label, val, sub }) => (
              <div key={label}>
                <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">{label}</p>
                <p className="text-xs font-bold text-gray-800">{val}</p>
                <p className="text-[10px] text-gray-400">{sub}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <button className="h-8 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors">
              View Booking Invoice
            </button>
            <button className="h-8 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-colors">
              Handover Guide &amp; Verification
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white py-10 flex flex-col items-center text-center px-4">
          <Clock className="h-8 w-8 text-gray-300 mb-2" />
          <p className="text-sm font-semibold text-gray-500">No {tab.toLowerCase()} bookings</p>
        </div>
      )}
    </section>
  );
}

/* ───────────────────────────────────────────
   EARNINGS SECTION
─────────────────────────────────────────── */
function EarningsSection() {
  return (
    <section>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-base font-extrabold text-gray-900">Earnings</h2>
        <Link href="/dashboard/earnings" className="text-xs font-semibold text-orange-500 hover:underline flex items-center gap-1">
          Full report <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <p className="text-xs text-gray-400 mb-4">What you've earned, what's on its way, and what's ready to withdraw.</p>

      {/* Payout linked */}
      <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 mb-4">
        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
        <p className="text-xs text-emerald-700 leading-relaxed">
          <span className="font-bold">Payout account linked &amp; active</span> — Guaranty Trust Bank (GTBank) ···7319 (Amara Okafor). Earnings are transferred automatically 24 hours after a completed rental with verification.{' '}
          <button className="font-bold underline">Manage bank account</button>
        </p>
      </div>

      {/* Earnings cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="rounded-2xl bg-orange-500 p-4 sm:p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mb-2">TOTAL EARNINGS</p>
          <p className="text-2xl sm:text-3xl font-extrabold">₦210,000</p>
          <p className="text-[11px] text-white/60 mt-1">All-time earnings from all rentals</p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">PENDING PAYOUT</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">₦210,000</p>
          <p className="text-[11px] text-gray-400 mt-1">From Oct 14–16 rental, releasing in 24 hours</p>
        </div>
        <div className="rounded-2xl bg-white border border-gray-200 p-4 sm:p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">AVAILABLE PAYOUT</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-gray-900">₦0</p>
          <p className="text-[11px] text-gray-400 mt-1">Ready to withdraw to your bank account</p>
        </div>
      </div>

      {/* Transactions table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <div className="hidden sm:grid grid-cols-4 px-5 py-3 border-b border-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <span>Transaction</span><span>Listing</span><span>Date</span><span className="text-right">Amount</span>
        </div>
        <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <p className="text-xs font-bold text-gray-800">RDZ-TX-8921</p>
            <p className="text-[11px] text-gray-400">Rental booking payment · 40-day cancellation hold</p>
          </div>
          <div className="sm:text-center">
            <p className="text-xs font-semibold text-gray-700">2020 Lexus RX 350</p>
          </div>
          <div className="sm:text-center">
            <p className="text-xs text-gray-500">Oct 4, 2026</p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm font-extrabold text-orange-500">+₦210,000</p>
            <p className="text-[10px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-full inline-block mt-0.5">In Escrow</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────────────────────
   MAIN PAGE
─────────────────────────────────────────── */
export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className="max-w-5xl mx-auto space-y-7">

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            Welcome back, {firstName} <span>👋</span>
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

      {/* Live banner */}
      <LiveBanner />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <StatCard icon={Package}      value={1}          label="Total Listings"    iconBg="bg-gray-100" />
        <StatCard icon={CheckCircle2} value={1}          label="Active Listing"    accent="green" iconBg="bg-emerald-50" />
        <StatCard icon={Clock}        value={1}          label="Pending Booking"   accent="orange" iconBg="bg-orange-50" />
        <StatCard icon={Calendar}     value={1}          label="Upcoming Rental"   iconBg="bg-blue-50" />
        <StatCard icon={TrendingUp}   value={0}          label="Current Rentals"   iconBg="bg-gray-100" />
        <StatCard icon={Wallet}       value="₦210,000"   label="Pending Earnings"  accent="orange" iconBg="bg-orange-50" />
      </div>

      {/* Upcoming rentals + Activity — 2 col on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        <div>
          <SectionHeader title="Upcoming Rentals" action="View all" href="/dashboard/bookings" />
          <p className="text-xs text-gray-400 mb-3 -mt-2">Confirmed bookings for the next 30 days</p>
          <UpcomingRentalCard />
        </div>
        <ActivityFeed />
      </div>

      {/* Listings section */}
      <ListingsSection />

      {/* Bookings section */}
      <BookingsSection />

      {/* Earnings section */}
      <EarningsSection />
    </div>
  );
}
