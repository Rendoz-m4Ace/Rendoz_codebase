import { MapPin, Home, Building2, Landmark } from 'lucide-react';

const locations = [
  { label: 'Lekki', icon: <MapPin size={18} className="text-white" />, bg: 'bg-orange-500' },
  { label: 'Abuja', icon: <Home size={18} className="text-white" />, bg: 'bg-[#1B2B6B]' },
  { label: 'Port Harcourt', icon: <Building2 size={18} className="text-white" />, bg: 'bg-orange-500' },
];

export default function CloseToYou() {
  return (
    <section className="bg-[#E8EEF5] py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Text */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-orange-500 uppercase tracking-widest mb-2">Available near you</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
            We are <span className="text-orange-500">close to you</span>
          </h2>
          <p className="mt-3 text-sm text-gray-500 max-w-md">
            Rendoz is available across major cities in Nigeria. Find items near you, wherever you are.
          </p>
        </div>

        {/* Location chips */}
        <div className="flex flex-wrap gap-3">
          {locations.map((loc, i) => (
            <button
              key={i}
              type="button"
              className="flex items-center gap-2.5 px-5 py-3 rounded-full bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <span className={`w-8 h-8 flex items-center justify-center rounded-full ${loc.bg}`}>
                {loc.icon}
              </span>
              <span className="text-sm font-semibold text-gray-800">{loc.label}</span>
            </button>
          ))}
        </div>

        {/* Map placeholder / visual */}
        <div className="mt-8 rounded-2xl overflow-hidden bg-white shadow-sm border border-gray-200 h-48 sm:h-64 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <Landmark size={36} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm font-medium">Interactive map coming soon</p>
            <p className="text-xs mt-1">Lagos · Abuja · Port Harcourt · Ibadan · Kano</p>
          </div>
        </div>
      </div>
    </section>
  );
}
