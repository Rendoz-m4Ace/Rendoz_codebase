import { MapPin, Home, Building2 } from 'lucide-react';
import Image from 'next/image';

const locations = [
  { label: 'Lekki', icon: MapPin, bg: 'bg-orange-500' },
  { label: 'Abuja', icon: Home, bg: 'bg-[#1B2B6B]' },
  { label: 'Port Harcourt', icon: Building2, bg: 'bg-orange-500' },
];

export default function CloseToYou() {
  return (
    <section className="bg-[#E8EEF5] py-14 px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug text-center lg:text-left">
            We are close to you
          </h2>
          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
            {locations.map((loc) => {
              const Icon = loc.icon;
              return (
                <button
                  key={loc.label}
                  type="button"
                  className="flex items-center gap-2.5 px-5 min-h-11 rounded-full bg-white shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <span className={`w-8 h-8 flex items-center justify-center rounded-full ${loc.bg}`}>
                    <Icon size={16} className="text-white" />
                  </span>
                  <span className="text-sm font-semibold text-gray-800">{loc.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
