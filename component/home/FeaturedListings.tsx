import Image from 'next/image';

const featured = [
  {
    id: 1,
    title: 'Canon EOS R50 Camera',
    category: 'Camera & Photography',
    image: '/assets/images/camera-and-photography.jpg',
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
    image: '/assets/images/vehicles.jpg',
    price: '₦45,000',
    unit: '/day',
    location: 'Victoria Island',
    badge: 'POPULAR',
    badgeColor: 'bg-[#1B2B6B]',
  },
];

export default function FeaturedListings() {
  return (
    <section className="bg-[#E8EEF5] py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {featured.map((item) => (
            <div
              key={item.id}
              className="relative rounded-2xl overflow-hidden shadow-md cursor-pointer group"
              style={{ minHeight: '220px' }}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Dark overlay for text legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </div>

              {/* Badge */}
              <div className="absolute top-4 left-4 z-10">
                <span className={`${item.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wide`}>
                  {item.badge}
                </span>
              </div>

              {/* Content */}
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
