const testimonials = [
  {
    id: 1,
    text: 'I rented a camera for my sister’s graduation and it was seamless. Got it delivered same day and the quality was exactly as described.',
    name: 'Tunde Adeyemi',
    role: 'Renter · Lagos',
    rating: 5,
    avatar: 'TA',
  },
  {
    id: 2,
    text: 'My generator was just sitting idle most of the year. Now it earns me over ₦60k monthly from rentals. Rendoz is genuinely life-changing.',
    name: 'Chioma Okafor',
    role: 'Lister · Abuja',
    rating: 5,
    avatar: 'CO',
  },
  {
    id: 3,
    text: 'Really love how easy it is to browse by location. Found exactly what I needed for an event within minutes. Will definitely use again.',
    name: 'Emeka Nwosu',
    role: 'Renter · Port Harcourt',
    rating: 5,
    avatar: 'EN',
  },
];

export default function Testimonials() {
  return (
    <section className="bg-[#F8F9FB] py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10">
          What customers are saying.
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <article
              key={t.id}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4"
            >
              <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">
                    ★
                  </span>
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold bg-orange-100 text-orange-600 shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-800">{t.name}</p>
                  <p className="text-[10px] text-gray-400">{t.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
