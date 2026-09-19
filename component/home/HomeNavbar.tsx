'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Menu, Search } from 'lucide-react';

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src="/images/logo.png"
            alt="Rendoz"
            width={110}
            height={30}
            priority
          />
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
          <li><Link href="#" className="hover:text-orange-500 transition-colors">Explore</Link></li>
          <li><Link href="#" className="hover:text-orange-500 transition-colors">Categories</Link></li>
          <li><Link href="#" className="hover:text-orange-500 transition-colors">List item</Link></li>
          <li><Link href="#" className="hover:text-orange-500 transition-colors">How it works</Link></li>
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            className="text-sm font-medium text-gray-700 px-4 py-2 rounded-full border border-gray-300 hover:border-orange-400 hover:text-orange-500 transition-colors"
          >
            Login
          </button>
          <button
            type="button"
            className="text-sm font-medium text-white px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors"
          >
            Get Started
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen((p) => !p)}
          className="md:hidden p-2 text-gray-700"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden absolute left-0 top-16 w-full bg-white border-b border-gray-100 shadow-md z-50 px-6 py-5 flex flex-col gap-4">
          <Link href="#" className="text-gray-700 hover:text-orange-500 text-sm font-medium" onClick={() => setIsOpen(false)}>Explore</Link>
          <Link href="#" className="text-gray-700 hover:text-orange-500 text-sm font-medium" onClick={() => setIsOpen(false)}>Categories</Link>
          <Link href="#" className="text-gray-700 hover:text-orange-500 text-sm font-medium" onClick={() => setIsOpen(false)}>List item</Link>
          <Link href="#" className="text-gray-700 hover:text-orange-500 text-sm font-medium" onClick={() => setIsOpen(false)}>How it works</Link>
          <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
            <button type="button" className="w-full py-2.5 rounded-full border border-gray-300 text-sm font-medium text-gray-700">Login</button>
            <button type="button" className="w-full py-2.5 rounded-full bg-orange-500 text-sm font-medium text-white">Get Started</button>
          </div>
        </div>
      )}
    </nav>
  );
}
