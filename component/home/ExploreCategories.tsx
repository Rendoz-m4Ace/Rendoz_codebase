'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const categories = [
  { label: 'All Use', icon: '🔲', active: true },
  { label: 'On Feet', icon: '👟' },
  { label: 'Super Fall', icon: '🍁' },
  { label: 'Camera', icon: '📷' },
];

const listings = [
  {
    id: 1,
    title: 'Camera and Photography',
    image: '/assets/images/camera-and-photography.jpg',
    price: '₦3,500',
    unit: '/day',
    location: 'Lagos Island',
    badge: null,
  },
  {
    id: 2,
    title: 'Vehicles',
    image: '/assets/images/vehicles.jpg',
    price: '₦25,000',
    unit: '/day',
    location: 'Lekki',
    badge: null,
  },
  {
    id: 3,
    title: 'Electronics',
    image: '/assets/images/electronics.jpg',
    price: '₦8,000',
    unit: '/day',
    location: 'Ikeja',
    badge: null,
  },
  {
    id: 4,
    title: 'Tools & Equipment',
    image: '/assets/images/tools-and-equipment.jpg',
    price: '₦1,500',
    unit: '/day',
    location: 'Surulere',
    badge: null,
  },
  {
    id: 5,
    title: 'Fashion',
    image: '/assets/images/fashion.jpg',
    price: '₦5,000',
    unit: '/day',
    location: 'Victoria Island',
    badge: null,
  },
  {
    id: 6,
    title: 'Generator',
    image: '/assets/images/generator.jpg',
    price: '₦12,000',
    unit: '/day',
    location: 'Ajah',
    badge: null,
  },
  {
    id: 7,
    title: 'Events & Party',
    image: '/assets/images/events.jpg',
    price: '₦20,000',
    unit: '/day',
    location: 'Ikeja',
    badge: null,
  },
  {
    id: 8,
    title: 'Furniture',
    image: '/assets/images/furniture.jpg',
    price: '₦7,500',
    unit: '/day',
    location: 'Yaba',
    badge: null,
  },
];

export default function ExploreCategories() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-white py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header row */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">Explore Categories</h2>
          <button type="button" className="flex items-center gap-1 text-xs text-orange-500 font-medium hover:underline">
            See all <ChevronRight size={14} />
          </button>
        </div>

        {/* Category filter tabs */}
        <div className="flex gap-2 flex-wrap mb-6">
          {categories.map((cat, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                active === i
                  ? 'bg-[#1B2B6B] text-white border-[#1B2B6B]'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-orange-400 hover:text-orange-500'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Listings grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {listings.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="relative" style={{ aspectRatio: '4/3' }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-semibold text-gray-800 truncate">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.location}</p>
                <p className="text-xs font-bold text-orange-500 mt-1">
                  {item.price}<span className="font-normal text-gray-400">{item.unit}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
