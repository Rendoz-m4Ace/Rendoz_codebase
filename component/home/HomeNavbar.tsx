'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Menu, User, LogOut, Settings, Heart, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import RendozLogo from '@/component/brand/RendozLogo';

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

function UserMenu({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  if (!user) return null;

  const initials = getInitials(user.name);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open account menu"
        aria-expanded={open}
        className="flex items-center gap-2 min-h-11 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-transparent"
      >
        <span className="w-9 h-9 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center ring-2 ring-white/30 select-none">
          {initials}
        </span>
        <span className="hidden md:block text-sm font-medium text-white/90 max-w-[120px] truncate">
          {user.name.split(' ')[0]}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden text-left">
          <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0">
              {initials}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <nav className="py-1.5" aria-label="Account menu">
            <Link href="#" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
              <User size={15} className="text-gray-400" /> My Profile
            </Link>
            <Link href="#" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
              <Package size={15} className="text-gray-400" /> My Listings
            </Link>
            <Link href="#" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
              <Heart size={15} className="text-gray-400" /> Saved Items
            </Link>
            <Link href="#" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">
              <Settings size={15} className="text-gray-400" /> Account Settings
            </Link>
          </nav>
          <div className="border-t border-gray-100 py-1.5">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onLogout();
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
            >
              <LogOut size={15} /> Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
        <RendozLogo variant="on-dark" />

        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
          <li>
            <a href="#explore" className="hover:text-white transition-colors min-h-11 inline-flex items-center">
              How it works
            </a>
          </li>
          <li>
            <a href="#how-it-works" className="hover:text-white transition-colors min-h-11 inline-flex items-center">
              List item
            </a>
          </li>
          <li>
            <a href="#explore" className="hover:text-white transition-colors min-h-11 inline-flex items-center">
              FAQ
            </a>
          </li>
        </ul>

        <div className="hidden md:flex items-center gap-3">
          {isReady &&
            (isAuthenticated ? (
              <>
                <Link
                  href="#earn"
                  className="min-h-11 inline-flex items-center px-5 rounded-full border border-orange-400 text-orange-400 text-sm font-semibold hover:bg-orange-500 hover:text-white transition-colors"
                >
                  List an Item
                </Link>
                <UserMenu onLogout={handleLogout} />
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="min-h-11 inline-flex items-center px-5 rounded-full border border-orange-400 text-orange-400 text-sm font-semibold hover:bg-orange-500 hover:text-white transition-colors"
                >
                  Log in
                </Link>
                <Link
                  href="/signin"
                  className="min-h-11 inline-flex items-center px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors"
                >
                  Get Started
                </Link>
              </>
            ))}
        </div>

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

      {isOpen && (
        <div className="md:hidden absolute left-0 right-0 top-16 bg-[#0B1220] border-t border-white/10 shadow-xl z-50 px-6 py-5 flex flex-col gap-3">
          <a href="#explore" className="text-white/90 text-sm font-medium min-h-11 flex items-center" onClick={() => setIsOpen(false)}>
            Explore
          </a>
          <a href="#how-it-works" className="text-white/90 text-sm font-medium min-h-11 flex items-center" onClick={() => setIsOpen(false)}>
            How it works
          </a>
          <div className="flex flex-col gap-3 pt-3 border-t border-white/10">
            {isAuthenticated ? (
              <>
                <Link
                  href="#earn"
                  onClick={() => setIsOpen(false)}
                  className="min-h-11 flex items-center justify-center rounded-full border border-orange-400 text-orange-400 text-sm font-semibold"
                >
                  List an Item
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="min-h-11 rounded-full border border-red-300 text-red-300 text-sm font-medium"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="min-h-11 flex items-center justify-center rounded-full border border-orange-400 text-orange-400 text-sm font-semibold"
                >
                  List an Item
                </Link>
                <Link
                  href="/signin"
                  onClick={() => setIsOpen(false)}
                  className="min-h-11 flex items-center justify-center rounded-full bg-orange-500 text-white text-sm font-semibold"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
