'use client';

import Image from 'next/image';
import { Search, MapPin } from 'lucide-react';
import { useState } from 'react';

const heroImages = [
  { src: '/images/1-camera.png', alt: 'Camera', className: 'col-span-1 row-span-1' },
  { src: '/images/2-workspace.png', alt: 'Workspace', className: 'col-span-1 row-span-1' },
  { src: '/images/3-car.png', alt: 'Car', className: 'col-span-1 row-span-1' },
  { src: '/images/4-tools and equipment.png', alt: 'Tools', className: 'col-span-1 row-span-1' },
  { src: '/images/5-camera.png', alt: 'Camera 2', className: 'col-span-1 row-span-1' },
  { src: '/images/6-Rectangle 147.png', alt: 'Fashion', className: 'col-span-1 row-span-1' },
  { src: '/images/7-clothing.png', alt: 'Clothing', className: 'col-span-1 row-span-1' },
  { src: '/images/8-events.png', alt: 'Events', className: 'col-span-1 row-span-1' },
];

export default function HomeHero() {
  const [query, setQuery] = useState('');

  return (
    <section className="bg-[#E8EEF5] pt-10 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Rent anything.
          <br />
          List everything.
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
          Nigeria's most trusted peer-to-peer rental marketplace. Cameras, cars, event gear, tools, and more — from verified owners near you.
        </p>

        {/* Search Bar */}
        <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-0 bg-white rounded-full shadow-md border border-gray-200 px-2 py-1.5 max-w-2xl mx-auto">
          {/* Location pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-gray-200 text-sm text-gray-500 shrink-0">
            <MapPin size={15} className="text-orange-500" />
            <span>Lagos</span>
          </div>

          {/* Search input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for items to rent…"
            className="flex-1 px-4 py-1.5 text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none min-w-0"
          />

          {/* Search button */}
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 bg-blue-900 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-full transition-colors shrink-0"
          >
            <Search size={15} />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>

        {/* Popular tags */}
        <div className="mt-3 flex flex-wrap justify-center gap-2 text-xs text-gray-500">
          <span className="font-medium text-gray-600">Popular:</span>
          {['Camera', 'Generator', 'Car', 'Projector', 'Event Tent'].map((tag) => (
            <button key={tag} type="button" className="hover:text-orange-500 transition-colors">
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div className="max-w-5xl mx-auto mt-8 grid grid-cols-4 grid-rows-2 gap-2 sm:gap-3">
        {heroImages.map((img, i) => (
          <div
            key={i}
            className="relative overflow-hidden rounded-xl bg-gray-200"
            style={{ aspectRatio: '1 / 1' }}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              sizes="(max-width: 640px) 25vw, (max-width: 1024px) 20vw, 200px"
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
