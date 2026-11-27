'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  CheckCircle2,
  Clock,
  FileEdit,
  XCircle,
  Image as ImageIcon,
  MapPin,
  RefreshCw,
  Share2,
  Edit2,
  CalendarDays,
  Trash2,
  Eye,
  PauseCircle,
  ChevronRight,
  ShieldCheck,
  Star,
  MessageCircle,
  Zap,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { listingsApi } from '@/lib/api-client';
import type { Listing, ListingStatus } from '@/lib/listings';

/* ─────────────────────────────────────────────────────────────
   FORMATTERS
───────────────────────────────────────────────────────────── */
const naira = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  maximumFractionDigits: 0,
});

/* ─────────────────────────────────────────────────────────────
   STATUS CONFIG
───────────────────────────────────────────────────────────── */
const STATUS_CONFIG: Record<
  ListingStatus,
  { label: string; cardBadge: string; dotColor: string }
> = {
  active: {
    label: 'Active & Live',
    cardBadge:
      'bg-emerald-50 border border-emerald-300 text-emerald-700',
    dotColor: 'bg-emerald-500',
  },
  pending_review: {
    label: 'Pending Approval',
    cardBadge:
      'bg-amber-50 border border-amber-300 text-amber-700',
    dotColor: 'bg-amber-400',
  },
  draft: {
    label: 'Draft',
    cardBadge: 'bg-gray-100 border border-gray-300 text-gray-600',
    dotColor: 'bg-gray-400',
  },
  rejected: {
    label: 'Suspended',
    cardBadge: 'bg-red-50 border border-red-300 text-red-600',
    dotColor: 'bg-red-500',
  },
};

function StatusBadge({ status }: { status: ListingStatus }) {
  const { label, cardBadge, dotColor } = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cardBadge}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      {label}
    </span>
  );
}

/* ─────────────────────────────────────────────────────────────
   STAT CARDS
───────────────────────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  value,
  label,
  active,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border bg-white p-4 flex items-start gap-3 ${
        active ? 'border-emerald-200' : 'border-gray-200'
      }`}
    >
      <div
        className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
          active ? 'bg-emerald-50' : 'bg-gray-100'
        }`}
      >
        <Icon
          className={`h-[18px] w-[18px] ${
            active ? 'text-emerald-500' : 'text-gray-400'
          }`}
        />
      </div>
      <div>
        <p
          className={`text-2xl font-extrabold leading-none ${
            active ? 'text-emerald-600' : 'text-gray-900'
          }`}
        >
          {value}
        </p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TOP BANNER  (pending / active / rejected / draft / empty)
───────────────────────────────────────────────────────────── */
function TopBanner({
  listings,
}: {
  listings: Listing[];
}) {
  const pending = listings.filter((l) => l.status === 'pending_review');
  const active = listings.filter((l) => l.status === 'active');
  const rejected = listings.filter((l) => l.status === 'rejected');

  if (pending.length > 0) {
    const first = pending[0];
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4 text-amber-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-extrabold text-gray-900">
                  Listing Submitted for Review!
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-100 border border-amber-300 text-amber-700 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Awaiting Approval
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 max-w-xl">
                Your new listing{' '}
                <span className="font-semibold">
                  &quot;{first.title}&quot;
                </span>{' '}
                has been submitted and is currently in the admin approval
                queue. Our team reviews all items to verify safety and
                authenticity before publishing to Browse.
              </p>
              <div className="mt-2.5 flex items-start gap-1.5">
                <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700">
                  Estimated review time:{' '}
                  <span className="font-bold">
                    Usually within 2–4 hours
                  </span>{' '}
                  (Max 24 hours). You&apos;ll receive an SMS &amp; email
                  notification once approved.
                </p>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-mono text-gray-400">
              ID: RDZ-L-2026-0922
            </p>
            <button className="mt-1 text-xs font-semibold text-orange-500 hover:underline flex items-center gap-0.5">
              How approval works <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (active.length > 0) {
    const first = active[0];
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-extrabold text-gray-900">
                  Listing Approved &amp; Live on Rendoz!
                </p>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-emerald-100 border border-emerald-300 text-emerald-700 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active &amp; Live
                </span>
              </div>
              <p className="text-xs text-gray-600 mt-1 max-w-xl">
                Your listing{' '}
                <span className="font-semibold">
                  &quot;{first.title}&quot;
                </span>{' '}
                has been verified and published. Renters in Ikeja and
                across Lagos can now discover and book your asset.
              </p>
              <div className="mt-2.5 flex items-center gap-1.5 bg-emerald-100 border border-emerald-200 rounded-lg px-3 py-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <p className="text-[11px] text-emerald-800 font-medium">
                  Published: Today at 11:42 AM &bull; Available for
                  immediate booking requests. Search visibility is 100%.
                </p>
              </div>
            </div>
          </div>
          <div className="text-right shrink-0">
            <p className="text-[10px] font-mono text-gray-400">
              ID: RDZ-L-2026-0922
            </p>
            <button className="mt-1 text-xs font-semibold text-orange-500 hover:underline flex items-center gap-0.5">
              View Live Listing in Browse{' '}
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (rejected.length > 0) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <XCircle className="h-4 w-4 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-extrabold text-gray-900">
              Listing Suspended
            </p>
            <p className="text-xs text-gray-600 mt-1 max-w-xl">
              One or more of your listings has been suspended. Review
              the reason below and make the required changes before
              resubmitting.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ─────────────────────────────────────────────────────────────
   LISTING CARD
───────────────────────────────────────────────────────────── */
function ListingCard({ listing }: { listing: Listing }) {
  const cover = listing.photos[0];
  const { status } = listing;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
      {/* Photo + badge */}
      <div className="flex gap-4 p-4">
        <div className="relative shrink-0 w-[120px] h-[90px] rounded-xl bg-gray-100 overflow-hidden">
          {cover ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cover}
              alt={listing.title}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-gray-300" />
            </div>
          )}
          {/* Status overlay label on photo */}
          {status === 'active' && (
            <div className="absolute top-1.5 left-1.5 bg-emerald-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md">
              Active · Live
            </div>
          )}
          {listing.photos.length > 1 && (
            <span className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 bg-black/60 rounded px-1.5 py-0.5 text-[9px] font-medium text-white">
              <ImageIcon className="h-2.5 w-2.5" />
              {listing.photos.length} photos
            </span>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {listing.category}
                {listing.subcategory ? ` / ${listing.subcategory}` : ''}
              </p>
              <h3 className="mt-0.5 text-base font-extrabold text-gray-900 leading-snug">
                {listing.title || 'Untitled draft'}
              </h3>
            </div>
            <StatusBadge status={status} />
          </div>

          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 flex-wrap">
            {listing.location && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {listing.location}
              </span>
            )}
            <span>
              {status === 'active'
                ? 'Live on Browse'
                : status === 'pending_review'
                ? 'Submitted just now'
                : status === 'rejected'
                ? 'Suspended'
                : 'Draft'}
            </span>
            {listing.details.condition && (
              <span>Condition: {listing.details.condition}</span>
            )}
          </div>

          {/* Pricing row */}
          {(listing.pricing.daily ||
            listing.pricing.weekly ||
            listing.pricing.securityDeposit) && (
            <div className="mt-3 flex items-center gap-6 flex-wrap">
              {listing.pricing.daily && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Daily Rate
                  </p>
                  <p className="text-sm font-extrabold text-orange-500">
                    {naira.format(listing.pricing.daily)} / day
                  </p>
                </div>
              )}
              {listing.pricing.weekly && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Weekly Rate
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {naira.format(listing.pricing.weekly)}
                  </p>
                </div>
              )}
              {listing.pricing.securityDeposit && (
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Security Deposit
                  </p>
                  <p className="text-sm font-bold text-gray-800">
                    {naira.format(listing.pricing.securityDeposit)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status note */}
      {status === 'pending_review' && (
        <div className="mx-4 mb-3 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          This listing is hidden from search and Browse until approved by
          the admin team.
        </div>
      )}
      {status === 'active' && (
        <div className="mx-4 mb-3 flex items-center gap-1.5 text-xs text-emerald-700">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
          <span>
            Live and searchable. Receiving booking requests.{' '}
            <button className="font-semibold underline">
              View Public Page
            </button>
          </span>
        </div>
      )}
      {status === 'rejected' && listing.rejectionReason && (
        <div className="mx-4 mb-3 flex items-start gap-1.5 text-xs text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          <XCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
          {listing.rejectionReason}
        </div>
      )}

      {/* Action buttons */}
      <div className="border-t border-gray-100 px-4 py-3 flex items-center gap-2 flex-wrap">
        {status === 'pending_review' && (
          <>
            <ActionBtn icon={Edit2} label="Edit Listing" />
            <ActionBtn icon={CalendarDays} label="Manage Calendar" />
            <ActionBtn icon={Trash2} label="Delete" danger />
            <ActionBtn icon={Eye} label="Preview as Renter" highlight />
          </>
        )}
        {status === 'active' && (
          <>
            <ActionBtn icon={CalendarDays} label="Manage Calendar" />
            <ActionBtn icon={Edit2} label="Edit Pricing & Details" />
            <ActionBtn icon={PauseCircle} label="Pause Listing" />
            <ActionBtn icon={Share2} label="Share Listing" highlight />
          </>
        )}
        {status === 'draft' && (
          <>
            <ActionBtn icon={Edit2} label="Continue Editing" />
            <ActionBtn icon={Trash2} label="Delete" danger />
          </>
        )}
        {status === 'rejected' && (
          <>
            <ActionBtn icon={Edit2} label="Edit & Resubmit" />
            <ActionBtn icon={Trash2} label="Delete" danger />
          </>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  danger,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  danger?: boolean;
  highlight?: boolean;
}) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 text-xs font-semibold h-8 px-3 rounded-lg border transition-colors ${
        danger
          ? 'border-red-200 text-red-500 hover:bg-red-50'
          : highlight
          ? 'border-orange-300 text-orange-500 hover:bg-orange-50'
          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {label}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   RIGHT SIDEBAR PANELS
───────────────────────────────────────────────────────────── */

/** "What happens next?" — shown when there is a pending listing */
function PendingSidebar() {
  const steps = [
    {
      num: 1,
      done: true,
      title: 'Listing Created & Submitted',
      desc: 'Photos, pricing, and availability details captured successfully.',
    },
    {
      num: 2,
      done: false,
      current: true,
      title: 'Admin Quality Check (Current)',
      desc: 'Automated photo resolution & policy check. Rendoz admins inspect condition, pricing, and verification.',
    },
    {
      num: 3,
      done: false,
      title: 'Instant Notification & Activation',
      desc: "You'll get an alert via SMS & WhatsApp. Your asset immediately appears in search for renters in Ikeja.",
    },
    {
      num: 4,
      done: false,
      title: 'Receive First Rental Request',
      desc: 'Renters book via secure escrow. You review dates and approve requests right from this dashboard.',
    },
  ];

  return (
    <div className="space-y-4">
      {/* What happens next */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-amber-500" />
          <p className="text-sm font-extrabold text-gray-900">
            What happens next?
          </p>
        </div>
        <p className="text-xs text-gray-500 -mt-2 mb-4">
          Approval workflow &amp; timeline
        </p>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={step.num} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                    step.done
                      ? 'bg-emerald-500 text-white'
                      : step.current
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    step.num
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200 my-1" />
                )}
              </div>
              <div className="pb-1">
                <p
                  className={`text-xs font-bold ${
                    step.current ? 'text-orange-600' : 'text-gray-800'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fast Approval Checklist */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="h-4 w-4 text-emerald-500" />
          <p className="text-sm font-extrabold text-gray-900">
            Fast Approval Checklist
          </p>
        </div>
        {[
          'Owner Identity Verified: NIN & phone number matched',
          '4 Clear Photos Uploaded: Exceeds minimum 3-photo requirement',
          'Direct Payout Active: Nigerian bank account ready for payouts',
        ].map((item) => (
          <div key={item} className="flex items-start gap-2 mt-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700">{item}</p>
          </div>
        ))}
      </div>

      {/* Need urgent edits */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-gray-400" />
          <p className="text-xs text-gray-700 font-medium">
            Need to make urgent edits?
          </p>
        </div>
        <button className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-0.5">
          Get Help <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

/** "Listing Live & Ready" — shown when there is an active listing */
function ActiveSidebar({ viewCount }: { viewCount?: number }) {
  const steps = [
    {
      done: true,
      title: 'Listing Approved',
      desc: 'Inspection passed. Vehicle verified and certified by Rendoz.',
    },
    {
      done: true,
      title: 'Public on Browse',
      desc: 'Live in Lagos Island & Ikeja. Showing high search visibility.',
    },
    {
      done: false,
      current: true,
      title: 'Awaiting First Renter Request',
      desc: 'Renters are browsing. You will receive an immediate SMS push notification when a request is made.',
    },
    {
      done: false,
      title: 'Renter Check-In & Handover',
      desc: 'Confirm digital escrow payout release on handover day with photo odometer check.',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Listing Live & Ready */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <p className="text-sm font-extrabold text-gray-900">
            Listing Live &amp; Ready
          </p>
        </div>
        <p className="text-xs text-gray-500 mb-4">
          Rental lifecycle &amp; bookings tracker
        </p>
        <div className="space-y-4">
          {steps.map((step, i) => (
            <div key={step.title} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-extrabold shrink-0 ${
                    step.done
                      ? 'bg-emerald-500 text-white'
                      : step.current
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 text-gray-400 border border-gray-200'
                  }`}
                >
                  {step.done ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 bg-gray-200 my-1" />
                )}
              </div>
              <div className="pb-1">
                <p
                  className={`text-xs font-bold ${
                    step.current ? 'text-orange-600' : 'text-gray-800'
                  }`}
                >
                  {step.title}
                </p>
                <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips for first booking */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-400" />
            <p className="text-sm font-extrabold text-gray-900">
              Tips for Your First Booking
            </p>
          </div>
          {viewCount !== undefined && (
            <span className="text-[11px] font-semibold text-gray-500">
              {viewCount} Views Today
            </span>
          )}
        </div>
        {[
          {
            icon: Share2,
            text: 'Share on WhatsApp & Socials: Listings shared by owners receive their 1st booking 3x faster.',
          },
          {
            icon: CalendarDays,
            text: 'Keep Calendar Updated: Block unavailable days to avoid renter cancellation penalties.',
          },
          {
            icon: Zap,
            text: 'Fast Response Badge: Respond to incoming rental inquiries within 30 mins to boost ranking.',
          },
        ].map((tip) => (
          <div key={tip.text} className="flex items-start gap-2 mt-2.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <p className="text-xs text-gray-700 leading-relaxed">
              {tip.text}
            </p>
          </div>
        ))}
      </div>

      {/* Have questions */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-4 w-4 text-gray-400" />
          <p className="text-xs text-gray-700 font-medium">
            Have questions about bookings?
          </p>
        </div>
        <button className="text-xs font-bold text-orange-500 hover:underline flex items-center gap-0.5">
          Get Help <ChevronRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

/** Fallback sidebar when the owner has no listings at all */
function EmptySidebar() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
      <Star className="h-8 w-8 text-amber-400 mx-auto mb-3" />
      <p className="text-sm font-extrabold text-gray-900">
        Ready for your first review
      </p>
      <p className="text-xs text-gray-500 mt-1 leading-relaxed">
        Ratings and reviews from verified renters will appear here after
        your first completed handover.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   TABS
───────────────────────────────────────────────────────────── */
type TabKey = 'all' | ListingStatus | 'changes_requested';

const TABS: { key: TabKey; label: string }[] = [
  { key: 'pending_review', label: 'Pending Review' },
  { key: 'active', label: 'Active' },
  { key: 'draft', label: 'Drafts' },
  { key: 'changes_requested', label: 'Changes Requested' },
  { key: 'all', label: 'All Listings' },
];

/* ─────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────── */
export default function DashboardListingsPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const [listings, setListings] = useState<Listing[] | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('pending_review');
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    listingsApi.mine().then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setListings(result.data.listings);
        setError('');
        // Auto-select the best default tab
        const hasPending = result.data.listings.some(
          (l) => l.status === 'pending_review',
        );
        const hasActive = result.data.listings.some(
          (l) => l.status === 'active',
        );
        if (hasPending) setActiveTab('pending_review');
        else if (hasActive) setActiveTab('active');
        else setActiveTab('all');
      } else {
        setError(result.error);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const counts = useMemo(() => {
    const c: Record<TabKey, number> = {
      all: listings?.length ?? 0,
      active: 0,
      pending_review: 0,
      draft: 0,
      rejected: 0,
      changes_requested: 0,
    };
    for (const l of listings ?? []) {
      if (l.status in c) c[l.status as ListingStatus] += 1;
    }
    return c;
  }, [listings]);

  const visible = (listings ?? []).filter((l) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'changes_requested') return false; // future feature
    return l.status === activeTab;
  });

  const hasPending = (listings ?? []).some(
    (l) => l.status === 'pending_review',
  );
  const hasActive = (listings ?? []).some((l) => l.status === 'active');
  const hasRejected = (listings ?? []).some((l) => l.status === 'rejected');
  const showSidebar = listings !== null && listings.length > 0;

  // Footer note text
  const footerNote = (() => {
    if (hasPending)
      return `You have ${counts.pending_review} item${counts.pending_review > 1 ? 's' : ''} pending approval. Once approved, it will automatically shift into your Active listings and start receiving rental requests.`;
    if (hasActive)
      return `You have ${counts.active} active listing${counts.active > 1 ? 's' : ''} receiving renter traffic. Renters in Ikeja can now initiate instant rental bookings and check-in schedules.`;
    return null;
  })();

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Monitor your equipment status, rental bookings, and earnings
            in one place.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Switch to Renting
          </button>
          <Link
            href="/dashboard/listings/new"
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-sm shadow-orange-200"
          >
            <Plus className="h-4 w-4" /> List Another Item
          </Link>
        </div>
      </div>

      {/* Top banner (pending / active / rejected) */}
      {listings && listings.length > 0 && (
        <TopBanner listings={listings} />
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={Clock}
          value={listings ? counts.pending_review : 0}
          label="Pending Approval"
        />
        <StatCard
          icon={CheckCircle2}
          value={listings ? counts.active : 0}
          label="Active & Live Listings"
          active={hasActive}
        />
        <StatCard
          icon={CalendarDays}
          value={0}
          label="Booking Requests"
        />
        <StatCard icon={FileEdit} value="N0" label="Total Earnings" />
      </div>

      {/* Main two-col layout */}
      <div className="flex gap-5 items-start">
        {/* Left: listings panel */}
        <div className="flex-1 min-w-0">
          <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
            {/* Panel header */}
            <div className="px-5 pt-5 pb-4 flex items-center justify-between border-b border-gray-100">
              <div>
                <h2 className="text-base font-extrabold text-gray-900">
                  Your Listings
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Manage and track the status of all your rental assets.
                </p>
              </div>
              <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 h-8 px-3 rounded-lg border border-gray-200 hover:bg-gray-50">
                <Filter className="h-3.5 w-3.5" /> Filter
              </button>
            </div>

            {/* Tabs */}
            <div className="px-5 pt-3 flex gap-1.5 flex-wrap border-b border-gray-100 pb-3">
              {TABS.map(({ key, label }) => {
                const count =
                  key === 'changes_requested' ? 0 : counts[key];
                const isActive = activeTab === key;
                const isPending =
                  key === 'pending_review' && counts.pending_review > 0;
                const isActiveLive =
                  key === 'active' && counts.active > 0;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={`h-8 px-3 rounded-full text-xs font-semibold transition-all border ${
                      isActive && isPending
                        ? 'bg-amber-500 border-amber-500 text-white'
                        : isActive && isActiveLive
                        ? 'bg-emerald-500 border-emerald-500 text-white'
                        : isActive
                        ? 'bg-gray-900 border-gray-900 text-white'
                        : 'border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300'
                    }`}
                  >
                    {label}{' '}
                    <span
                      className={`${isActive ? 'opacity-80' : 'opacity-50'}`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="p-5">
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
                  <p className="text-sm text-red-700">{error}</p>
                  <button
                    onClick={() => setReloadKey((k) => k + 1)}
                    className="mt-3 inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-red-300 text-xs font-semibold text-red-700 hover:bg-red-100"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> Try again
                  </button>
                </div>
              ) : listings === null ? (
                <div className="py-12 flex justify-center">
                  <div className="w-6 h-6 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
                </div>
              ) : visible.length === 0 ? (
                <div className="py-10 flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
                    <FileEdit className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    No{' '}
                    {activeTab === 'all'
                      ? ''
                      : TABS.find((t) => t.key === activeTab)?.label.toLowerCase()}{' '}
                    listings yet
                  </p>
                  <p className="text-xs text-gray-400 mt-1 max-w-xs">
                    {activeTab === 'all'
                      ? 'List an item you own and start earning when renters book it.'
                      : 'Nothing here yet.'}
                  </p>
                  {activeTab === 'all' && (
                    <Link
                      href="/dashboard/listings/new"
                      className="mt-4 inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold"
                    >
                      <Plus className="h-3.5 w-3.5" /> Create your first
                      listing
                    </Link>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {visible.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}

              {/* Footer note */}
              {footerNote && visible.length > 0 && (
                <p className="mt-4 text-xs text-gray-500 text-center border-t border-gray-100 pt-4">
                  {footerNote}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        {showSidebar && (
          <div className="hidden lg:block w-72 shrink-0">
            {hasPending && !hasActive && <PendingSidebar />}
            {hasActive && <ActiveSidebar viewCount={14} />}
            {!hasPending && !hasActive && hasRejected && (
              <EmptySidebar />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
