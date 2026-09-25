'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Image as ImageIcon, CheckCircle2,
  Clock, X, MessageSquare, Calendar,
  Wallet, ShieldCheck, Zap, Info, Inbox,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getOwnerBookings, type Booking, type BookingStatus } from '@/lib/bookings';

const naira = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });
const shortDate = new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });
const formatDate = (iso: string) => shortDate.format(new Date(iso));

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
   BOOKING CARD
═══════════════════════════════════════════════════════ */
const STATUS_STYLE: Record<BookingStatus, { label: string; badge: string; dot: string }> = {
  requested: { label: 'Request',   badge: 'bg-orange-50 border-orange-200 text-orange-600', dot: 'bg-orange-500' },
  upcoming:  { label: 'Upcoming',  badge: 'bg-blue-50 border-blue-200 text-blue-600',       dot: 'bg-blue-500' },
  active:    { label: 'Active',    badge: 'bg-emerald-50 border-emerald-200 text-emerald-600', dot: 'bg-emerald-500' },
  completed: { label: 'Completed', badge: 'bg-gray-50 border-gray-200 text-gray-600',       dot: 'bg-gray-500' },
  cancelled: { label: 'Canceled',  badge: 'bg-red-50 border-red-200 text-red-500',          dot: 'bg-red-500' },
};

function BookingCard({ booking }: { booking: Booking }) {
  const style = STATUS_STYLE[booking.status];
  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-[200px] h-36 sm:h-auto bg-gray-800 shrink-0 flex items-center justify-center">
          <ImageIcon className="h-8 w-8 text-gray-500" />
        </div>

        <div className="flex-1 p-4 sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{booking.category}</span>
                <span className="text-[10px] text-gray-400">•</span>
                <span className="text-[10px] font-bold text-gray-500">Booking #{booking.reference}</span>
              </div>
              <h3 className="text-base font-extrabold text-gray-900">{booking.listingTitle}</h3>
            </div>
            <span className={`flex items-center gap-1.5 text-[11px] font-bold border px-2.5 py-1 rounded-full ${style.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />{style.label}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
            <span className="flex items-center gap-1">
              <span className="font-medium text-gray-700">Renter:</span> {booking.renterName}
              {booking.renterVerified && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200 ml-1">
                  <ShieldCheck className="h-2.5 w-2.5" />Verified
                </span>
              )}
            </span>
            {booking.cancelledAt && (
              <>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span>Canceled on {formatDate(booking.cancelledAt)}</span>
              </>
            )}
          </div>

          <div className="grid grid-cols-3 gap-3 mb-3">
            {[
              { label: 'TOTAL RESERVATION VALUE', val: naira.format(booking.totalAmount) },
              { label: 'DATES', val: `${formatDate(booking.startDate)} – ${formatDate(booking.endDate)}` },
              { label: 'OWNER PAYOUT', val: naira.format(booking.ownerPayout), green: true },
            ].map(({ label, val, green }) => (
              <div key={label}>
                <p className="text-[9px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">{label}</p>
                <p className={`text-xs font-bold ${green ? 'text-emerald-600' : 'text-gray-800'}`}>{val}</p>
              </div>
            ))}
          </div>

          {booking.cancellationNote && (
            <div className="flex items-start gap-2 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2.5 mb-3">
              <Info className="h-4 w-4 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-gray-600 leading-snug">{booking.cancellationNote}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Link href="/dashboard/calendar"
              className="h-9 px-3 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition-colors flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> View Calendar
            </Link>
            <Link href="/dashboard/messages"
              className="h-9 px-3 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-1.5">
              <MessageSquare className="h-3.5 w-3.5" /> Message Renter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   EMPTY STATE
═══════════════════════════════════════════════════════ */
function EmptyBookings({ tab }: { tab: TabKey }) {
  const text: Record<TabKey, { title: string; body: string }> = {
    all:       { title: 'No bookings yet', body: 'When renters book your items, their reservations will appear here.' },
    requested: { title: 'No booking requests', body: 'New requests from renters will show up here for you to accept or decline.' },
    upcoming:  { title: 'No upcoming rentals', body: 'Confirmed bookings that haven’t started yet will appear here.' },
    active:    { title: 'No active rentals', body: 'Rentals in progress will appear here.' },
    completed: { title: 'No completed rentals', body: 'Finished rentals and their payouts will appear here.' },
    cancelled: { title: 'No canceled bookings', body: 'Good news — none of your bookings have been canceled.' },
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white py-12 flex flex-col items-center text-center px-4">
      <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
        <Inbox className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-sm font-semibold text-gray-700">{text[tab].title}</p>
      <p className="text-xs text-gray-400 mt-1.5 max-w-xs leading-relaxed">{text[tab].body}</p>
      {tab === 'all' && (
        <Link href="/dashboard/listings/new"
          className="mt-4 inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold transition-colors">
          <Plus className="h-3.5 w-3.5" /> Create a listing
        </Link>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
type TabKey = 'all' | BookingStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',       label: 'All' },
  { key: 'requested', label: 'Requests' },
  { key: 'upcoming',  label: 'Upcoming' },
  { key: 'active',    label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Canceled' },
];

export default function DashboardBookingsPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [bookings, setBookings] = useState<Booking[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    getOwnerBookings().then((result) => {
      if (!cancelled) setBookings(result);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const byStatus = { all: bookings?.length ?? 0 } as Record<TabKey, number>;
    for (const tab of TABS) {
      if (tab.key !== 'all') byStatus[tab.key] = bookings?.filter((b) => b.status === tab.key).length ?? 0;
    }
    return byStatus;
  }, [bookings]);

  const visible = (bookings ?? []).filter((b) => activeTab === 'all' || b.status === activeTab);
  const earned = (bookings ?? []).filter((b) => b.status === 'completed').reduce((sum, b) => sum + b.ownerPayout, 0);
  const upcomingPayout = (bookings ?? [])
    .filter((b) => b.status === 'upcoming' || b.status === 'active')
    .reduce((sum, b) => sum + b.ownerPayout, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Welcome back, {firstName}</h1>
          <p className="text-sm text-gray-400 mt-0.5">Track your rental bookings and payouts in one place.</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button className="flex items-center gap-2 h-10 px-4 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <Zap className="h-4 w-4" /> Switch to Renting
          </button>
          <Link href="/dashboard/listings/new"
            className="flex items-center gap-2 h-10 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-sm shadow-orange-200">
            <Plus className="h-4 w-4" /> List an Item
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Clock}        value={counts.requested} label="Booking Requests" accent={counts.requested ? 'orange' : undefined} iconBg="bg-gray-100" />
        <StatCard icon={CheckCircle2} value={counts.upcoming + counts.active} label="Upcoming & Active" iconBg="bg-gray-100" />
        <StatCard icon={Wallet}       value={naira.format(upcomingPayout)} label="Upcoming Payout" iconBg="bg-gray-100" />
        <StatCard icon={X}            value={counts.cancelled} label="Canceled Bookings" accent={counts.cancelled ? 'red' : undefined} iconBg="bg-gray-100" />
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-base font-extrabold text-gray-900">Your Bookings</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Reservations renters make on your listings. Total earned so far: {naira.format(earned)}.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Booking status">
          {TABS.map(({ key, label }) => (
            <button key={key} role="tab" aria-selected={activeTab === key} onClick={() => setActiveTab(key)}
              className={`h-8 px-3 rounded-full text-xs font-semibold transition-all ${
                activeTab === key ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'
              }`}>
              {label} <span className="opacity-60">{counts[key]}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        {bookings === null ? (
          <div className="rounded-2xl border border-gray-200 bg-white py-12 flex justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" aria-label="Loading bookings" />
          </div>
        ) : visible.length === 0 ? (
          <EmptyBookings tab={activeTab} />
        ) : (
          visible.map((booking) => <BookingCard key={booking.id} booking={booking} />)
        )}
      </div>
    </div>
  );
}
