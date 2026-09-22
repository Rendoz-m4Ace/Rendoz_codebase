import { ArrowRight } from 'lucide-react';

const stats = [
  { value: '₦85k', label: 'Average monthly earnings', sub: 'per active lister' },
  { value: '48hrs', label: 'Average time to first booking', sub: 'after listing' },
  { value: '4,200+', label: 'Active renters', sub: 'on the platform' },
  { value: '0%', label: 'Commission for early listers', sub: 'limited period' },
];

export default function EarnSection() {
  return (
    <section className="bg-white py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        {/* Left — Copy */}
        <div>
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-3">
            For item owners
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
            Turn your idle assets into a
            <br />
            steady <span className="text-orange-500">source of income.</span>
          </h2>
          <p className="mt-4 text-sm text-gray-500 leading-relaxed max-w-md">
            List your camera, car, generator, tools, or anything else you own. 
            Set your price, availability, and start earning — no upfront costs.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Start listing <ArrowRight size={15} />
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 border border-gray-300 hover:border-orange-400 text-gray-700 hover:text-orange-500 text-sm font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Learn more
            </button>
          </div>
        </div>

        {/* Right — Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-[#1B2B6B] rounded-2xl p-5 flex flex-col gap-1"
            >
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
