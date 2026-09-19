const testimonials = [
  {
    id: 1,
    text: 'I rented a camera for my sister\'s graduation and it was seamless. Got it delivered same day and the quality was exactly as described.',
    name: 'Tunde Adeyemi',
    role: 'Renter · Lagos',
    rating: 5,
    avatar: 'TA',
    avatarBg: 'bg-orange-100',
    avatarText: 'text-orange-600',
  },
  {
    id: 2,
    text: 'My generator was just sitting idle most of the year. Now it earns me over ₦60k monthly from rentals. Rendoz is genuinely life-changing.',
    name: 'Chioma Okafor',
    role: 'Lister · Abuja',
    rating: 5,
    avatar: 'CO',
    avatarBg: 'bg-blue-100',
    avatarText: 'text-blue-600',
  },
  {
    id: 3,
    text: 'Really love how easy it is to browse by location. Found exactly what I needed for an event within minutes. Will definitely use again.',
    name: 'Emeka Nwosu',
    role: 'Renter · Port Harcourt',
    rating: 5,
    avatar: 'EN',
    avatarBg: 'bg-green-100',
    avatarText: 'text-green-600',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-yellow-400 text-sm">★</span>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-[#F8F9FB] py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            What <span className="text-gray-900">Nigerians</span>
            <br />
            <span className="text-orange-500">are saying</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4"
            >
              {/* Stars */}
              <StarRating count={t.rating} />

              {/* Quote */}
              <p className="text-sm text-gray-600 leading-relaxed flex-1">"{t.text}"</p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${t.avatarBg} ${t.avatarText} shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">{t.name}</p>
                  <p className="text-[10px] text-gray-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
