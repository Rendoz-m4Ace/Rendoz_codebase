'use client';

import { useState } from 'react';
import Image from "next/image";
import WaitlistForm from './WaitlistForm';

export default function Navbar() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <nav className="flex font-['Inter'] h-12 items-center justify-between border-b border-white/30 bg-[#D9E0EB] px-6">
        <div className="">
          <Image src="/images/logo.png" alt="RendOz logo" width={120} height={32} />
        </div>
        <ul className="font-normal text-base leading-[140%] hidden items-center gap-10 text-black md:flex">
          <li>About</li>
          <li>For Renters &amp; Owners</li>
          <li>How it works</li>
          <li>FAQ</li>
        </ul>
        <button
          onClick={() => setShowModal(true)}
          className="rounded-full w-123px h-22px bg-orange-500 px-4 py-1.5 text-base leading-[140%] font-semibold font-normal text-white hover:bg-orange-600 transition-colors"
        >
          Join the waitlist
        </button>
      </nav>

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
