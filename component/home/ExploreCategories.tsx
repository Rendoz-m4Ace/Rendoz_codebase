'use client';

import Image from 'next/image';
import { useState } from 'react';

const categories = [
  { label: 'All Use', icon: '▦' },
  { label: 'On Feet', icon: '👟' },
  { label: 'Super Fall', icon: '🍂' },
  { label: 'Camera', icon: '📷' },
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
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">Explore Categories</h2>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((cat, i) => (
            <button
              key={cat.label}
              type="button"
              onClick={() => setActive(i)}
              className={`flex items-center gap-1.5 px-4 min-h-11 rounded-full text-xs font-medium border transition-colors ${
                active === i
                  ? 'bg-[#1B2B6B] text-white border-[#1B2B6B]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400 hover:text-orange-500'
              }`}
            >
              <span aria-hidden="true">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

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
                <span
                  className={`${item.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide`}
                >
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
