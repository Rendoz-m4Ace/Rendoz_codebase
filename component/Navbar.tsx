"use client";

import { useState } from "react";
'use client';

import { useState } from 'react';
import Image from "next/image";
import { Menu, X } from "lucide-react";

import WaitlistForm from './WaitlistForm';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="relative bg-[#D9E0EB] font-['Inter'] border-b border-gray-200">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/images/logo.png"
            alt="RendOz logo"
            width={120}
            height={32}
            priority
          />
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8 font-normal text-base text-gray-700">
          <li><a href="#about" className="hover:text-black">About</a></li>
          <li><a href="#renters-owners" className="hover:text-black">For Renters &amp; Owners</a></li>
          <li><a href="#how-it-works" className="hover:text-black">How it works</a></li>
          <li><a href="#faq" className="hover:text-black">FAQ</a></li>
        </ul>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <button className="rounded-full bg-orange-500 px-5 py-2 text-white font-medium hover:bg-orange-600">
            Join the waitlist
          </button>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        {/* Mobile Hamburger Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="block md:hidden text-gray-700 focus:outline-none p-2"
        aria-label="Toggle navigation menu"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <rect y="4" width="24" height="2.5" rx="1.25" />
            <rect y="11" width="24" height="2.5" rx="1.25" />
            <rect y="18" width="24" height="2.5" rx="1.25" />
          </svg>
        )}
      </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-16 left-0 w-full bg-white shadow-md border-b border-gray-200 z-50 py-4 px-6 flex flex-col gap-4 text-center">
          <a href="#about" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black">About</a>
          <a href="#renters-owners" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black">For Renters &amp; Owners</a>
          <a href="#how-it-works" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black">How it works</a>
          <a href="#faq" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-black">FAQ</a>
          <button className="w-full rounded-full bg-orange-500 py-2.5 text-white font-medium hover:bg-orange-600">
            Join the waitlist
          </button>
        </div>
      )}
    </nav>
  );
}
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
