'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus, Package, CheckCircle2, Clock, FileEdit, XCircle,
  Image as ImageIcon, X, MapPin, CalendarX, ShieldAlert, RefreshCw,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { listingsApi } from '@/lib/api-client';
import type { Listing, ListingStatus } from '@/lib/listings';

const naira = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });
const shortDate = new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

const STATUS: Record<ListingStatus, { label: string; pill: string; icon: React.ElementType }> = {
  active:         { label: 'Live',           pill: 'bg-emerald-50 border-emerald-200 text-emerald-700', icon: CheckCircle2 },
  pending_review: { label: 'Pending review', pill: 'bg-amber-50 border-amber-200 text-amber-800',       icon: Clock },
  draft:          { label: 'Draft',          pill: 'bg-gray-50 border-gray-200 text-gray-600',          icon: FileEdit },
  rejected:       { label: 'Rejected',       pill: 'bg-red-50 border-red-200 text-red-600',             icon: XCircle },
};

function StatusPill({ status }: { status: ListingStatus }) {
  const { label, pill, icon: Icon } = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold border px-2 py-0.5 rounded-full ${pill}`}>
      <Icon className="h-3 w-3" aria-hidden /> {label}
    </span>
  );
}

function StatCard({ icon: Icon, value, label }: { icon: React.ElementType; value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4 flex items-start gap-3">
      <div className="h-9 w-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
        <Icon style={{ height: 18, width: 18 }} color="#9ca3af" />
      </div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   LISTING CARD
═══════════════════════════════════════════════════════ */
function ListingCard({ listing, onOpen }: { listing: Listing; onOpen: () => void }) {
  const cover = listing.photos[0];
  return (
    <button type="button" onClick={onOpen}
      className="group text-left rounded-2xl border border-gray-200 bg-white overflow-hidden hover:shadow-md hover:border-gray-300 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
      <div className="relative aspect-[4/3] bg-gray-100">
        {cover ? (
          // Photos are served from Supabase Storage
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt={listing.title} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-gray-300" aria-hidden />
          </div>
        )}
        <div className="absolute top-2 left-2"><StatusPill status={listing.status} /></div>
        {listing.photos.length > 1 && (
          <span className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/60 rounded-lg px-2 py-0.5 text-[10px] font-medium text-white">
            <ImageIcon className="h-3 w-3" aria-hidden /> {listing.photos.length} photos
          </span>
        )}
      </div>
      <div className="p-4">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
          {listing.category}{listing.subcategory ? ` · ${listing.subcategory}` : ''}
        </p>
        <h3 className="mt-0.5 text-sm font-extrabold text-gray-900 line-clamp-1">{listing.title || 'Untitled draft'}</h3>
        <p className="mt-2 text-sm">
          {listing.pricing.daily
            ? <><span className="font-bold text-gray-900">{naira.format(listing.pricing.daily)}</span><span className="text-gray-400"> / day</span></>
            : <span className="text-gray-400">No price set</span>}
        </p>
        {listing.status === 'pending_review' && (
          <p className="mt-2 text-[11px] text-amber-700">An admin is reviewing this listing.</p>
        )}
        {listing.status === 'rejected' && listing.rejectionReason && (
          <p className="mt-2 text-[11px] text-red-600 line-clamp-2">{listing.rejectionReason}</p>
        )}
      </div>
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   DETAILS VIEW
═══════════════════════════════════════════════════════ */
function ListingDetails({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const [photo, setPhoto] = useState(0);
  const { details, pricing } = listing;
  const facts: [string, string][] = [
    ['Condition', details.condition],
    ['Brand', details.brand],
    ['Model', details.model],
    ['Size', details.size],
    ['Quantity', details.quantity ? String(details.quantity) : ''],
    ['Hourly price', pricing.hourly ? naira.format(pricing.hourly) : ''],
    ['Daily price', pricing.daily ? naira.format(pricing.daily) : ''],
    ['Weekly price', pricing.weekly ? naira.format(pricing.weekly) : ''],
    ['Security deposit', pricing.securityDeposit ? naira.format(pricing.securityDeposit) : ''],
  ].filter((f): f is [string, string] => Boolean(f[1]));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={listing.title}
        className="w-full sm:max-w-2xl max-h-[92dvh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 bg-white border-b border-gray-100 px-5 py-3">
          <div className="min-w-0">
            <StatusPill status={listing.status} />
            <h2 className="mt-1 text-base font-extrabold text-gray-900 truncate">{listing.title || 'Untitled draft'}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close"
            className="h-9 w-9 shrink-0 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {listing.photos.length > 0 ? (
            <div>
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={listing.photos[photo]} alt={`${listing.title}, photo ${photo + 1}`} className="h-full w-full object-cover" />
              </div>
              {listing.photos.length > 1 && (
                <div className="mt-2 flex gap-2 overflow-x-auto">
                  {listing.photos.map((url, i) => (
                    <button key={url} type="button" onClick={() => setPhoto(i)} aria-label={`Show photo ${i + 1}`}
                      className={`h-16 w-16 shrink-0 rounded-lg overflow-hidden border-2 ${i === photo ? 'border-orange-500' : 'border-transparent'}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-400">No photos added yet.</p>
          )}

          {listing.status === 'rejected' && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              <ShieldAlert className="h-4 w-4 text-red-500 shrink-0 mt-0.5" aria-hidden />
              <p className="text-sm text-red-700">{listing.rejectionReason || 'This listing was not approved.'}</p>
            </div>
          )}

          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
              {listing.category}{listing.subcategory ? ` · ${listing.subcategory}` : ''}
            </p>
            {listing.location && (
              <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3.5 w-3.5" aria-hidden /> {listing.location}
              </p>
            )}
            <p className="mt-3 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {listing.description || 'No description yet.'}
            </p>
          </div>

          {facts.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl border border-gray-200 p-4">
              {facts.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{label}</dt>
                  <dd className="text-sm font-semibold text-gray-900">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          {listing.unavailableDates.length > 0 && (
            <p className="flex items-center gap-1.5 text-xs text-gray-500">
              <CalendarX className="h-3.5 w-3.5" aria-hidden />
              {listing.unavailableDates.length} day{listing.unavailableDates.length > 1 ? 's' : ''} blocked on your calendar
            </p>
          )}

          <p className="text-[11px] text-gray-400">Created {shortDate.format(new Date(listing.createdAt))}</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
type TabKey = 'all' | ListingStatus;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all',            label: 'All' },
  { key: 'active',         label: 'Live' },
  { key: 'pending_review', label: 'Pending review' },
  { key: 'draft',          label: 'Drafts' },
  { key: 'rejected',       label: 'Rejected' },
];

export default function DashboardListingsPage() {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] ?? 'there';
  const [listings, setListings] = useState<Listing[] | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    listingsApi.mine().then((result) => {
      if (cancelled) return;
      if (result.ok) {
        setListings(result.data.listings);
        setError('');
      } else {
        setError(result.error);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const counts = useMemo(() => {
    const c = { all: listings?.length ?? 0, active: 0, pending_review: 0, draft: 0, rejected: 0 } as Record<TabKey, number>;
    for (const l of listings ?? []) c[l.status] += 1;
    return c;
  }, [listings]);

  const visible = (listings ?? []).filter((l) => activeTab === 'all' || l.status === activeTab);
  const open = listings?.find((l) => l.id === openId) ?? null;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900">Your listings, {firstName}</h1>
          <p className="text-sm text-gray-400 mt-0.5">New listings are reviewed by the Rendoz team before they go live.</p>
        </div>
        <Link href="/dashboard/listings/new"
          className="inline-flex items-center justify-center gap-2 h-10 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-sm shadow-orange-200">
          <Plus className="h-4 w-4" /> Create Listing
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={CheckCircle2} value={counts.active} label="Live" />
        <StatCard icon={Clock} value={counts.pending_review} label="Pending review" />
        <StatCard icon={FileEdit} value={counts.draft} label="Drafts" />
        <StatCard icon={Package} value={counts.all} label="Total listings" />
      </div>

      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Listing status">
        {TABS.map(({ key, label }) => (
          <button key={key} role="tab" aria-selected={activeTab === key} onClick={() => setActiveTab(key)}
            className={`h-8 px-3 rounded-full text-xs font-semibold transition-all ${
              activeTab === key ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-800'
            }`}>
            {label} <span className="opacity-60">{counts[key]}</span>
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-sm text-red-700">{error}</p>
          <button type="button" onClick={() => setReloadKey((k) => k + 1)}
            className="mt-3 inline-flex items-center gap-1.5 h-9 px-4 rounded-full border border-red-300 text-xs font-semibold text-red-700 hover:bg-red-100">
            <RefreshCw className="h-3.5 w-3.5" /> Try again
          </button>
        </div>
      ) : listings === null ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 flex justify-center">
          <div className="w-6 h-6 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" aria-label="Loading listings" />
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-14 px-4 flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
            <Package className="h-6 w-6 text-gray-400" />
          </div>
          <p className="text-sm font-semibold text-gray-700">
            {activeTab === 'all' ? 'You have no listings yet' : `No ${TABS.find((t) => t.key === activeTab)?.label.toLowerCase()} listings`}
          </p>
          <p className="text-xs text-gray-400 mt-1.5 max-w-xs">
            List an item you own and start earning when renters book it.
          </p>
          {activeTab === 'all' && (
            <Link href="/dashboard/listings/new"
              className="mt-4 inline-flex items-center gap-1.5 h-9 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold">
              <Plus className="h-3.5 w-3.5" /> Create your first listing
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((listing) => (
            <ListingCard key={listing.id} listing={listing} onOpen={() => setOpenId(listing.id)} />
          ))}
        </div>
      )}

      {open && <ListingDetails listing={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}
