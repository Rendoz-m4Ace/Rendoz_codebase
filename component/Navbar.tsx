'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import WaitlistForm from './WaitlistForm';
import Link from 'next/link';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Smooth scroller
  const scrollToSection = (e:React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element =document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  }

  const openWaitlist = () => {
    setIsOpen(false);
    setShowModal(true);
  };

  const closeWaitlist = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Navbar */}
      <nav className="relative z-40 border-b border-gray-200 bg-[#D9E0EB] font-['Inter']">
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
          <ul className="hidden items-center gap-8 text-base font-normal text-gray-700 md:flex">
            <li>
              <Link href="#about" onClick={(e) => scrollToSection(e, 'about')}
               className="transition-colors hover:text-black">
                About
              </Link>
            </li>

            <li>
              <Link
                href="#renters-owners" onClick={(e) => scrollToSection(e, 'renters-owners')}
                className="transition-colors hover:text-black"
              >
                For Renters &amp; Owners
              </Link>
            </li>

            <li>
              <Link
                href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')}
                className="transition-colors hover:text-black"
              >
                How it works
              </Link>
            </li>

            <li>
              <Link href="#faq" onClick={(e) => scrollToSection(e, 'faq')}
              className="transition-colors hover:text-black">
                FAQ
              </Link>
            </li>
          </ul>

          {/* Desktop CTA */}
          <button
            type="button"
            onClick={openWaitlist}
            className="hidden rounded-full bg-orange-500 px-5 py-2 font-medium text-white transition-colors hover:bg-orange-600 md:block"
          >
            Join the waitlist
          </button>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="p-2 text-gray-700 focus:outline-none md:hidden"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <X size={24} />
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <rect y="4" width="24" height="2.5" rx="1.25" />
                <rect y="11" width="24" height="2.5" rx="1.25" />
                <rect y="18" width="24" height="2.5" rx="1.25" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="absolute left-0 top-16 z-50 flex w-full flex-col gap-4 border-b border-gray-200 bg-white px-6 py-5 text-center shadow-md md:hidden">
            <a
              href="#about"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 transition-colors hover:text-black"
            >
              About
            </a>

            <a
              href="#renters-owners"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 transition-colors hover:text-black"
            >
              For Renters &amp; Owners
            </a>

            <a
              href="#how-it-works"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 transition-colors hover:text-black"
            >
              How it works
            </a>

            <a
              href="#faq"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 transition-colors hover:text-black"
            >
              FAQ
            </a>

            <button
              type="button"
              onClick={openWaitlist}
              className="w-full rounded-full bg-orange-500 py-2.5 font-medium text-white transition-colors hover:bg-orange-600"
            >
              Join the waitlist
            </button>
          </div>
        )}
      </nav>

      {/* Waitlist Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="waitlist-title"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">
              <h3
                id="waitlist-title"
                className="text-xl font-bold text-slate-900"
              >
                Join the Waitlist
              </h3>

              <button
                type="button"
                onClick={closeWaitlist}
                className="text-slate-400 transition-colors hover:text-slate-600"
                aria-label="Close waitlist modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Description */}
            <p className="mb-6 text-sm text-slate-500">
              Be among the first to know when Rendoz launches. No spam, just
              updates.
            </p>

            {/* Waitlist Form */}
            <WaitlistForm
              variant="marketplace"
              onSuccess={() => {
                setTimeout(() => {
                  setShowModal(false);
                }, 2000);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
