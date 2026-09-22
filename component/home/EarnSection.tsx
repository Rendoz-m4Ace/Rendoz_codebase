import Link from 'next/link';

const stats = [
  { value: '₦85k', label: 'Average monthly earnings', sub: 'per active lister' },
  { value: '48hrs', label: 'Average time to first booking', sub: 'after listing' },
  { value: '4,200+', label: 'Active renters', sub: 'on the platform' },
  { value: '0%', label: 'Commission for early listers', sub: 'limited period' },
];

export default function EarnSection() {
  return (
    <section id="earn" className="relative overflow-hidden bg-white py-14 px-4 md:px-8">
      <div className="absolute -right-20 top-8 w-72 h-72 rounded-full bg-orange-50 pointer-events-none" />
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center relative">
        <div>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">
            For owners
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
            Turn your idle assets into a
            <br />
            steady <span className="text-orange-500">source of income.</span>
          </h2>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-md">
            List your camera, car, generator, tools, or anything else you own. Set your price,
            availability, and start earning — no upfront costs.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <Link
              href="/signup"
              className="min-h-11 inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 rounded-full"
            >
              START LISTING
            </Link>
            <a
              href="#how-it-works"
              className="min-h-11 inline-flex items-center justify-center border border-gray-300 hover:border-orange-400 text-gray-700 hover:text-orange-500 text-sm font-semibold px-6 rounded-full"
            >
              LEARN MORE
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.value} className="bg-[#0B1220] rounded-2xl p-5 flex flex-col gap-1">
              <p className="text-2xl sm:text-3xl font-extrabold text-white">{stat.value}</p>
              <p className="text-xs font-semibold text-white/80 leading-snug">{stat.label}</p>
              <p className="text-[10px] text-white/40">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
