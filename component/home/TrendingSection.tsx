import Image from 'next/image';
import { ChevronRight, Heart } from 'lucide-react';

const trending = [
  {
    id: 1,
    title: 'Canon EOS R50',
    category: 'Camera & Photography',
    image: '/assets/images/camera-and-photography.jpg',
    price: '₦3,500',
    unit: '/day',
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    title: 'Honda Generator',
    category: 'Generator',
    image: '/assets/images/generator.jpg',
    price: '₦8,000',
    unit: '/day',
    rating: 4.9,
    reviews: 41,
  },
  {
    id: 3,
    title: 'Power Tools Set',
    category: 'Tools & Equipment',
    image: '/assets/images/tools-and-equipment.jpg',
    price: '₦2,500',
    unit: '/day',
    rating: 4.7,
    reviews: 18,
  },
  {
    id: 4,
    title: 'Party Canopy Tent',
    category: 'Events & Party',
    image: '/assets/images/events.jpg',
    price: '₦15,000',
    unit: '/day',
    rating: 4.9,
    reviews: 56,
  },
];

export default function TrendingSection() {
  return (
    <section className="bg-white py-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs text-gray-400 mb-1">Top picks near you</p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Trending in <span className="text-orange-500">Lagos</span>
            </h2>
          </div>
          <button type="button" className="flex items-center gap-1 text-xs text-orange-500 font-medium hover:underline">
            See all <ChevronRight size={14} />
          </button>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {trending.map((item) => (
            <div
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Image */}
              <div className="relative" style={{ aspectRatio: '1/1' }}>
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Wishlist button */}
                <button
                  type="button"
                  aria-label="Add to wishlist"
                  className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-full shadow hover:bg-white transition-colors"
                >
                  <Heart size={13} className="text-gray-500" />
                </button>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-wide">{item.category}</p>
                <p className="text-xs font-bold text-gray-800 mt-0.5 truncate">{item.title}</p>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-yellow-400 text-xs">★</span>
                  <span className="text-xs text-gray-600 font-medium">{item.rating}</span>
                  <span className="text-[10px] text-gray-400">({item.reviews})</span>
                </div>

                <p className="text-xs font-bold text-gray-800 mt-1.5">
                  {item.price}
                  <span className="text-gray-400 font-normal">{item.unit}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
