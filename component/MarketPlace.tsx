'use client';

import { useState } from 'react';
import WaitlistForm from './WaitlistForm';

export default function MarketPlace() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="bg-orange-50 py-16 mt-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Renters Card */}
            <div className="bg-orange-200 rounded-[20px] p-8">
              <p className="text-orange-600 font-heading font-semibold text-sm uppercase tracking-wide">
                For Renters
              </p>
              <h3 className="font-heading font-bold text-2xl text-slate-800 mt-2">
                Need something? Rent it.
              </h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-2 text-gray-700 text-sm">
                  <img src="/assets/images/icons-check-mark-orange.svg" alt="checkmark" className="w-4 h-4 mt-0.5" />
                  Access things without buying them
                </li>
                <li className="flex items-start gap-2 text-gray-700 text-sm">
                  <img src="/assets/images/icons-check-mark-orange.svg" alt="checkmark" className="w-4 h-4 mt-0.5" />
                  Rent only for the time you need
                </li>
                <li className="flex items-start gap-2 text-gray-700 text-sm">
                  <img src="/assets/images/icons-check-mark-orange.svg" alt="checkmark" className="w-4 h-4 mt-0.5" />
                  Discover useful items near you
                </li>
              </ul>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 w-full md:w-auto bg-orange-600 text-white font-heading font-semibold px-6 py-3 rounded-full hover:opacity-90 transition"
              >
                Join the waitlist
              </button>
            </div>

            {/* Owners Card */}
            <div className="bg-blue-50 rounded-[20px] p-8">
              <p className="text-blue-900 font-heading font-semibold text-sm uppercase tracking-wide">
                For Owners
              </p>
              <h3 className="font-heading font-bold text-2xl text-slate-800 mt-2">
                Have something? Earn from it.
              </h3>
              <ul className="mt-4 space-y-2">
                <li className="flex items-start gap-2 text-gray-700 text-sm">
                  <img src="/assets/images/icons-check-mark-blue.svg" alt="checkmark" className="w-4 h-4 mt-0.5" />
                  List items you aren&apos;t always using
                </li>
                <li className="flex items-start gap-2 text-gray-700 text-sm">
                  <img src="/assets/images/icons-check-mark-blue.svg" alt="checkmark" className="w-4 h-4 mt-0.5" />
                  Reach people who need them
                </li>
                <li className="flex items-start gap-2 text-gray-700 text-sm">
                  <img src="/assets/images/icons-check-mark-blue.svg" alt="checkmark" className="w-4 h-4 mt-0.5" />
                  Generate additional income
                </li>
              </ul>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 w-full md:w-auto bg-blue-900 text-white font-heading font-semibold px-6 py-3 rounded-full hover:opacity-90 transition"
              >
                Join the waitlist
              </button>
            </div>

          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-900">Join the Waitlist</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              Be among the first to know when Rendoz launches. No spam, just updates.
            </p>
            <WaitlistForm variant="marketplace" onSuccess={() => {
              setTimeout(() => setShowModal(false), 2000);
            }} />
          </div>
        </div>
      )}
    </>
  );
}
