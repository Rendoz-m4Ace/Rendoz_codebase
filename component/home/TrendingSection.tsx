import Image from 'next/image';
import { Heart } from 'lucide-react';

const trending = [
  {
    id: 1,
    title: 'Canon EOS R50',
    category: 'Camera & Photography',
    image: '/images/Camera and Photography.jpg',
    price: '₦3,500',
    unit: '/day',
    rating: 4.8,
    reviews: 24,
  },
  {
    id: 2,
    title: 'Honda Generator',
    category: 'Generator',
    image: '/images/Generator.jpg',
    price: '₦8,000',
    unit: '/day',
    rating: 4.9,
    reviews: 41,
  },
  {
    id: 3,
    title: 'Power Tools Set',
    category: 'Tools & Equipment',
    image: '/images/Tools and Equipment.jpg',
    price: '₦2,500',
    unit: '/day',
    rating: 4.7,
    reviews: 18,
  },
  {
    id: 4,
    title: 'Party Canopy Tent',
    category: 'Events & Party',
    image: '/images/Events.jpg',
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
        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-1">This is near you</p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Trending in <span className="text-orange-500">Lagos</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {trending.map((item) => (
            <article
              key={item.id}
              className="group rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  type="button"
                  aria-label={`Save ${item.title}`}
                  className="absolute top-2 right-2 min-h-11 min-w-11 p-0 flex items-center justify-center bg-white/85 rounded-full shadow hover:bg-white"
                >
                  <Heart size={14} className="text-gray-500" />
                </button>
              </div>
              <div className="p-3">
                <p className="text-[10px] text-orange-500 font-semibold uppercase tracking-wide">{item.category}</p>
                <p className="text-xs font-bold text-gray-800 mt-0.5 truncate">{item.title}</p>
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
