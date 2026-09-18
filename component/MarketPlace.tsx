"use client";

import { useState } from "react";
import WaitlistForm from "./WaitlistForm";

export default function MarketPlace() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="bg-orange-50 py-12 sm:py-16 mt-6 sm:mt-8" id="renters-owners">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">

            {/* Renters Card */}
            <div className="bg-orange-200 rounded-2xl p-6 sm:p-8 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
              <p className="text-orange-600 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                For Renters
              </p>
              <h3 className="font-bold text-xl sm:text-2xl text-slate-800 mt-2">
                Need something? Rent it.
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li className="flex items-start gap-2 text-gray-700 text-sm">
                  <img
                    src="/assets/images/icons-check-mark-orange.svg"
                    alt=""
                    className="w-4 h-4 mt-0.5 shrink-0"
                  />
                  Access things without buying them
                </li>
                <li className="flex items-start gap-2 text-gray-700 text-sm">
                  <img
                    src="/assets/images/icons-check-mark-orange.svg"
                    alt=""
                    className="w-4 h-4 mt-0.5 shrink-0"
                  />
                  Rent only for the time you need
                </li>
                <li className="flex items-start gap-2 text-gray-700 text-sm">
                  <img
                    src="/assets/images/icons-check-mark-orange.svg"
                    alt=""
                    className="w-4 h-4 mt-0.5 shrink-0"
                  />
                  Discover useful items near you
                </li>
              </ul>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 w-full sm:w-auto bg-orange-600 hover:bg-orange-800 text-white font-semibold px-6 py-3 rounded-full transition text-sm"
              >
                Join the waitlist
              </button>
            </div>

            {/* Owners Card */}
            <div className="bg-blue-50 rounded-2xl p-6 sm:p-8 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg">
              <p className="text-blue-900 font-semibold text-xs sm:text-sm uppercase tracking-wide">
                For Owners
              </p>
              <h3 className="font-bold text-xl sm:text-2xl text-slate-800 mt-2">
                Have something? Earn from it.
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li className="flex items-start gap-2 text-gray-700 text-sm">
                  <img
                    src="/assets/images/icons-check-mark-blue.svg"
                    alt=""
                    className="w-4 h-4 mt-0.5 shrink-0"
                  />
                  List items you aren&apos;t always using
                </li>
                <li className="flex items-start gap-2 text-gray-700 text-sm">
                  <img
                    src="/assets/images/icons-check-mark-blue.svg"
                    alt=""
                    className="w-4 h-4 mt-0.5 shrink-0"
                  />
                  Reach people who need them
                </li>
                <li className="flex items-start gap-2 text-gray-700 text-sm">
                  <img
                    src="/assets/images/icons-check-mark-blue.svg"
                    alt=""
                    className="w-4 h-4 mt-0.5 shrink-0"
                  />
                  Generate additional income
                </li>
              </ul>
              <button
                onClick={() => setShowModal(true)}
                className="mt-6 w-full sm:w-auto bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-full transition text-sm"
              >
                Join the waitlist
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Waitlist Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="marketplace-modal-title"
        >
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3
                id="marketplace-modal-title"
                className="text-lg sm:text-xl font-bold text-slate-900"
              >
                Join the Waitlist
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-slate-500 text-sm mb-5 sm:mb-6">
              Be among the first to know when Rendoz launches. No spam, just updates.
            </p>
            <WaitlistForm
              variant="marketplace"
              onSuccess={() => {
                setTimeout(() => setShowModal(false), 2000);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
