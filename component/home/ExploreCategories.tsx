'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Car, Shirt, Building2, Camera, Wrench, Zap, Sofa, Smartphone } from 'lucide-react';

const categories = [
  { label: 'Vehicle',     icon: Car,        listings: '20+' },
  { label: 'Clothes',     icon: Shirt,       listings: '19' },
  { label: 'Event Hall',  icon: Building2,   listings: '20+' },
  { label: 'Cameras',     icon: Camera,      listings: '20+' },
  { label: 'Tools',       icon: Wrench,      listings: '15+' },
  { label: 'Generator',   icon: Zap,         listings: '12+' },
  { label: 'Furniture',   icon: Sofa,        listings: '10+' },
  { label: 'Electronics', icon: Smartphone,  listings: '20+' },
];

const featured = [
  {
    id: 1,
    title: 'Canon EOS R50 Camera',
    category: 'Camera & Photography',
    image: '/images/Camera and Photography.jpg',
    price: '₦3,500',
    unit: '/day',
    location: 'Lagos Island',
    badge: 'POPULAR',
    badgeColor: 'bg-orange-500',
  },
  {
    id: 2,
    title: 'BMW 3 Series',
    category: 'Vehicles',
    image: '/images/Vechicles.jpg',
    price: '₦45,000',
    unit: '/day',
    location: 'Victoria Island',
    badge: 'POPULAR',
    badgeColor: 'bg-[#1B2B6B]',
  },
];

export default function ExploreCategories() {
  const [active, setActive] = useState(0);

  return (
    <section id="explore" className="bg-white py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Explore Categories</h2>
          <button className="flex items-center gap-1 text-sm font-semibold text-orange-500 hover:underline">
            View All <span className="text-base leading-none">›</span>
          </button>
        </div>

        {/* Category cards — scrollable on mobile */}
        <div className="flex gap-3 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            const isActive = active === i;
            return (
              <button
                key={cat.label}
                type="button"
                onClick={() => setActive(i)}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl border-2 transition-all shrink-0 min-w-[160px] text-left ${
                  isActive
                    ? 'border-[#1B2B6B] bg-[#1B2B6B]/5'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  isActive ? 'bg-[#1B2B6B]' : 'bg-[#1B2B6B]/10'
                }`}>
                  <Icon size={18} className={isActive ? 'text-white' : 'text-[#1B2B6B]'} />
                </div>
                <div className="min-w-0">
                  <p className={`text-sm font-bold leading-tight truncate ${isActive ? 'text-[#1B2B6B]' : 'text-gray-800'}`}>
                    {cat.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{cat.listings} Listings</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Featured items grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {featured.map((item) => (
            <article
              key={item.id}
              className="relative rounded-2xl overflow-hidden shadow-md cursor-pointer group min-h-[220px] sm:min-h-[260px]"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, 50vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute top-4 left-4 z-10">
                <span className={`${item.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide`}>
                  {item.badge}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 z-10 p-5">
                <p className="text-xs text-orange-300 font-medium mb-1">{item.category}</p>
                <h3 className="text-white font-bold text-lg leading-snug">{item.title}</h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-white text-sm font-semibold">
                    {item.price}
                    <span className="text-gray-300 text-xs font-normal">{item.unit}</span>
                  </p>
                  <p className="text-gray-300 text-xs">{item.location}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
