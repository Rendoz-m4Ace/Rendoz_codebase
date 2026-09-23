'use client';

// ─── LocationModal ────────────────────────────────────────────────────────────
// Primary pickup location modal — isolated, no external state deps except onSave.

import { useState } from 'react';
import { MapPin, Map, Lock } from 'lucide-react';
import ModalShell from './ModalShell';

interface LocationModalProps {
  initialState?: string;
  initialCity?: string;
  initialStreet?: string;
  initialInstructions?: string;
  onSave: (data: { state: string; city: string; street: string; instructions: string }) => void;
  onClose: () => void;
}

const NIGERIA_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue',
  'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'FCT – Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina',
  'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo',
  'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

const CITIES_BY_STATE: Record<string, string[]> = {
  Lagos: ['Agege', 'Alimosho', 'Apapa', 'Badagry', 'Epe', 'Eti-Osa (VI/Lekki)', 'Ibeju-Lekki',
    'Ifako-Ijaiye', 'Ikeja', 'Ikorodu', 'Kosofe', 'Lagos Island', 'Lagos Mainland',
    'Mushin', 'Ojo', 'Oshodi-Isolo', 'Shomolu', 'Surulere'],
  'FCT – Abuja': ['Abuja Municipal', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Obi'],
  Rivers: ['Port Harcourt', 'Obio-Akpor', 'Okrika', 'Eleme', 'Bonny'],
};

function getCities(state: string): string[] {
  return CITIES_BY_STATE[state] ?? ['Select state first'];
}

export default function LocationModal({
  initialState = 'Lagos',
  initialCity = '',
  initialStreet = '',
  initialInstructions = '',
  onSave,
  onClose,
}: LocationModalProps) {
  const [state, setState] = useState(initialState);
  const [city, setCity] = useState(initialCity);
  const [street, setStreet] = useState(initialStreet);
  const [instructions, setInstructions] = useState(initialInstructions);

  const canSave = state && city && street.trim();
  const publicLabel = city && state ? `${city}, ${state} State` : '';

  return (
    <ModalShell onClose={onClose}>
      <div className="p-6 pt-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6 pr-6">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
            <MapPin size={20} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Add your primary pickup location</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Set where your rental items will be picked up from by renters. This helps local renters
              discover your listings.
            </p>
          </div>
        </div>

        {/* State + City */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">State</label>
            <div className="relative">
              <select
                value={state}
                onChange={(e) => { setState(e.target.value); setCity(''); }}
                className="w-full h-12 pl-4 pr-8 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                {NIGERIA_STATES.map((s) => (
                  <option key={s} value={s}>{s} {s !== 'FCT – Abuja' ? 'State' : ''}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">City / Area</label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-12 pl-4 pr-8 border border-gray-200 rounded-xl text-sm text-gray-900 bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select area</option>
                {getCities(state).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5L7 9L11 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        {/* Street */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Street Address or Landmark{' '}
            <span className="text-gray-400 font-normal">(Kept private)</span>
          </label>
          <input
            type="text"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="14 Allen Avenue, Ikeja"
            className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Pickup instructions */}
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-1.5">
            Pickup Instructions{' '}
            <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="text"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="e.g. Ring the bell at Suite 4B or call when outside"
            className="w-full h-12 px-4 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Public label preview */}
        {publicLabel && (
          <div className="rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 flex items-start gap-3 mb-4">
            <Map size={18} className="text-blue-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Publicly shown as: {publicLabel}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Renters search by neighbourhood radius. Your full exact address is never shown
                publicly in search results.
              </p>
            </div>
          </div>
        )}

        {/* Privacy */}
        <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 flex items-start gap-3 mb-6">
          <Lock size={15} className="text-orange-500 mt-0.5 shrink-0" />
          <p className="text-xs text-orange-700 font-medium">
            Privacy guarantee: Your exact street address is only unlocked and shared with a renter
            after you confirm and accept their rental booking.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 px-5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => {
              if (canSave) {
                onSave({ state, city, street: street.trim(), instructions: instructions.trim() });
                onClose();
              }
            }}
            className="min-h-11 px-6 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
          >
            Save Location
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
