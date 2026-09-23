'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Menu } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import RendozLogo from '@/component/brand/RendozLogo';

export default function HomeNavbar() {
  const { user, status, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = status === 'authenticated' && !!user;
  const isReady = status !== 'idle';

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    router.push('/');
  };

  return (
    <nav className="relative z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex h-16 md:h-[72px] items-center justify-between gap-4">
        {/* Logo */}
        <RendozLogo variant="on-dark" />

        {/* Centre nav links */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <li>
            <a href="#how-it-works" className="hover:text-white transition-colors min-h-11 inline-flex items-center">
              How it works
            </a>
          </li>
          <li>
            <a href="#earn" className="hover:text-white transition-colors min-h-11 inline-flex items-center">
              List Item
            </a>
          </li>
          <li>
            <a href="#faq" className="hover:text-white transition-colors min-h-11 inline-flex items-center">
              FAQ
            </a>
          </li>
        </ul>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-3">
          {isReady && (
            isAuthenticated ? (
              <Link
                href="/dashboard"
                className="min-h-11 inline-flex items-center px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-md"
              >
                My Account
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="min-h-11 inline-flex items-center px-5 rounded-full border border-white/30 text-white/80 text-sm font-medium hover:border-white hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  className="min-h-11 inline-flex items-center px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors shadow-md"
                >
                  Get Started
                </Link>
              </>
            )
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setIsOpen((p) => !p)}
          className="md:hidden p-2 min-h-11 min-w-11 flex items-center justify-center text-white"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden absolute left-0 right-0 top-16 bg-[#0B1220] border-t border-white/10 shadow-xl z-50 px-6 py-5 flex flex-col gap-3">
          <a href="#how-it-works" className="text-white/90 text-sm font-medium min-h-11 flex items-center" onClick={() => setIsOpen(false)}>
            How it works
          </a>
          <a href="#earn" className="text-white/90 text-sm font-medium min-h-11 flex items-center" onClick={() => setIsOpen(false)}>
            List Item
          </a>
          <a href="#faq" className="text-white/90 text-sm font-medium min-h-11 flex items-center" onClick={() => setIsOpen(false)}>
            FAQ
          </a>
          <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="min-h-11 flex items-center justify-center rounded-full bg-orange-500 text-white text-sm font-semibold"
                >
                  My Account
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-11 rounded-full border border-white/20 text-white/60 text-sm font-medium"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={() => setIsOpen(false)}
                  className="min-h-11 flex items-center justify-center rounded-full border border-white/30 text-white/80 text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="min-h-11 flex items-center justify-center rounded-full bg-orange-500 text-white text-sm font-semibold"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
