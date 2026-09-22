'use client';

import Image from 'next/image';
import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import HomeNavbar from './HomeNavbar';

const popular = ['Camera', 'Generator', 'Car', 'Projector', 'Event Tent'];

export default function HomeHero() {
  const [query, setQuery] = useState('');

  return (
    <section className="relative overflow-hidden bg-[#070B18] text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/background camera.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-[#070B18]/75 to-[#070B18]" />
      </div>

      <div className="relative">
        <HomeNavbar />

        <div className="max-w-4xl mx-auto px-4 pb-16 pt-8 md:pt-12 md:pb-24 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs sm:text-sm text-white/80 mb-6">
            <span>Now live in Lagos, Abuja & Port Harcourt </span>
            {/* <Link
              href="/waitlist"
              className="min-h-8 inline-flex items-center rounded-full bg-orange-500 hover:bg-orange-600 px-3 py-1 text-white text-xs font-semibold"
            >
              Join waitlist
            </Link> */}
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-extrabold leading-[1.1] tracking-tight">
            Rent anything.
            <br />
            List everything.
          </h1>
          <p className="mt-4 text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
            Nigeria&apos;s most trusted peer-to-peer rental marketplace. Cameras, cars, event gear,
            tools, and more — from verified owners near you.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 bg-white rounded-full shadow-lg px-2 py-2 max-w-2xl mx-auto"
          >
            <div className="flex items-center gap-1.5 px-4 py-2 sm:border-r border-gray-200 text-sm text-gray-600 shrink-0 min-h-11">
              <MapPin size={16} className="text-orange-500" />
              <span className="font-medium">Lagos</span>
            </div>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for items to rent…"
              className="flex-1 px-4 py-2 text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none min-w-0 min-h-11"
            />
            <button
              type="submit"
              className="flex items-center justify-center gap-1.5 self-end sm:self-auto bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold min-h-11 min-w-11 px-5 rounded-full transition-colors shrink-0"
              aria-label="Search"
            >
              <Search size={16} />
              <span className="sm:hidden">Search</span>
            </button>
          </form>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-white/60">
            <span className="font-medium text-white/80">Popular:</span>
            {popular.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setQuery(tag)}
                className="hover:text-orange-400 transition-colors min-h-11 px-1"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
