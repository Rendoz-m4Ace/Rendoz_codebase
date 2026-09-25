'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ImageIcon, MapPin, X } from 'lucide-react';
import type { PublicListing } from '@/lib/public-listings';

const naira = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });

function ListingModal({ listing, onClose }: { listing: PublicListing; onClose: () => void }) {
  const [photo, setPhoto] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-6" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={listing.title}
        className="w-full sm:max-w-xl max-h-[92dvh] overflow-y-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="relative aspect-[4/3] bg-gray-100">
          {listing.photos[photo] && (
            // Listing photos are served from Supabase Storage
            // eslint-disable-next-line @next/next/no-img-element
            <img src={listing.photos[photo]} alt={`${listing.title}, photo ${photo + 1}`} className="h-full w-full object-cover" />
          )}
          <button type="button" onClick={onClose} aria-label="Close"
            className="absolute top-3 right-3 h-10 w-10 rounded-full bg-white/90 hover:bg-white shadow flex items-center justify-center">
            <X className="h-4 w-4 text-gray-700" />
          </button>
        </div>
        {listing.photos.length > 1 && (
          <div className="flex gap-2 overflow-x-auto px-5 pt-3">
            {listing.photos.map((url, i) => (
              <button key={url} type="button" onClick={() => setPhoto(i)} aria-label={`Show photo ${i + 1}`}
                className={`h-14 w-14 shrink-0 rounded-lg overflow-hidden border-2 ${i === photo ? 'border-orange-500' : 'border-transparent'}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
        <div className="p-5">
          <p className="text-[11px] text-orange-500 font-semibold uppercase tracking-wide">
            {listing.category}{listing.subcategory ? ` · ${listing.subcategory}` : ''}
          </p>
          <h3 className="mt-0.5 text-lg font-bold text-gray-900">{listing.title}</h3>
          {listing.location && (
            <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3.5 w-3.5" aria-hidden /> {listing.location}
            </p>
          )}
          {listing.pricePerDay && (
            <p className="mt-3 text-base font-bold text-gray-900">
              {naira.format(listing.pricePerDay)}<span className="text-sm font-normal text-gray-400"> / day</span>
            </p>
          )}
          <p className="mt-3 text-sm text-gray-600 leading-relaxed whitespace-pre-line">{listing.description}</p>
          <div className="mt-5 rounded-xl bg-orange-50 border border-orange-200 px-4 py-3">
            <p className="text-sm text-orange-800">
              Online booking is launching soon.{' '}
              <Link href="/signup" className="font-semibold underline underline-offset-2">Create an account</Link> to be first to book.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Live, admin-approved listings from owners. Hidden until at least one exists. */
export default function AvailableNow() {
  const [listings, setListings] = useState<PublicListing[] | null>(null);
  const [open, setOpen] = useState<PublicListing | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/listings/public?limit=8')
      .then((res) => (res.ok ? res.json() : { listings: [] }))
      .then((data: { listings: PublicListing[] }) => {
        if (!cancelled) setListings(data.listings);
      })
      .catch(() => {
        if (!cancelled) setListings([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (listings !== null && listings.length === 0) return null;

  return (
    <section className="bg-white pt-12 px-4 md:px-8" aria-labelledby="available-now-heading">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-1">Listed by verified owners</p>
          <h2 id="available-now-heading" className="text-xl sm:text-2xl font-bold text-gray-900">
            Available <span className="text-orange-500">now</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {listings === null
            ? Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="rounded-2xl border border-gray-100 overflow-hidden" aria-hidden>
                  <div className="aspect-square bg-gray-100 animate-pulse" />
                  <div className="p-3 space-y-2">
                    <div className="h-2.5 w-16 rounded bg-gray-100 animate-pulse" />
                    <div className="h-3 w-3/4 rounded bg-gray-100 animate-pulse" />
                  </div>
                </div>
              ))
            : listings.map((item) => (
                <button key={item.id} type="button" onClick={() => setOpen(item)}
                  className="group text-left rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
                  <div className="relative aspect-square bg-gray-100">
                    {item.photos[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.photos[0]} alt={item.title} loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-300" aria-hidden />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-wide truncate">{item.category}</p>
                    <p className="text-xs font-bold text-gray-800 mt-0.5 truncate">{item.title}</p>
                    {item.location && <p className="text-[11px] text-gray-400 mt-0.5 truncate">{item.location}</p>}
                    {item.pricePerDay && (
                      <p className="text-xs font-bold text-gray-800 mt-1.5">
                        {naira.format(item.pricePerDay)}<span className="text-gray-400 font-normal">/day</span>
                      </p>
                    )}
                  </div>
                </button>
              ))}
        </div>
      </div>

      {open && <ListingModal listing={open} onClose={() => setOpen(null)} />}
    </section>
  );
}
