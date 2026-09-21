'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Menu, User, LogOut, Settings, Heart, Package } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

// ---------------------------------------------------------------------------
// Helper — derive initials from a display name  e.g. "Camelia Afolabi" → "CA"
// ---------------------------------------------------------------------------
function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

// ---------------------------------------------------------------------------
// Avatar + dropdown  (desktop)
// ---------------------------------------------------------------------------
function UserMenu({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  if (!user) return null;

  const initials = getInitials(user.name);

  return (
    <div className="relative" ref={menuRef}>

      {/* Avatar button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open account menu"
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
      >
        {user.avatar ? (
          <Image
            src={user.avatar}
            alt={user.name}
            width={36}
            height={36}
            className="rounded-full object-cover ring-2 ring-orange-500 ring-offset-1"
          />
        ) : (
          <span className="w-9 h-9 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center ring-2 ring-orange-200 ring-offset-1 select-none">
            {initials}
          </span>
        )}
        {/* First name — desktop only */}
        <span className="hidden md:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
          {user.name.split(' ')[0]}
        </span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">

          {/* User info header */}
          <div className="px-4 py-4 border-b border-gray-100 flex items-center gap-3">
            {user.avatar ? (
              <Image src={user.avatar} alt={user.name} width={40} height={40} className="rounded-full object-cover" />
            ) : (
              <span className="w-10 h-10 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0 select-none">
                {initials}
              </span>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-400 truncate">{user.email}</p>
            </div>
          </div>

          {/* Nav items */}
          <nav className="py-1.5" aria-label="Account menu">
            <DropdownLink icon={<User size={15} />} label="My Profile" href="#" close={() => setOpen(false)} />
            <DropdownLink icon={<Package size={15} />} label="My Listings" href="#" close={() => setOpen(false)} />
            <DropdownLink icon={<Heart size={15} />} label="Saved Items" href="#" close={() => setOpen(false)} />
            <DropdownLink icon={<Settings size={15} />} label="Account Settings" href="#" close={() => setOpen(false)} />
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-100 py-1.5">
            <button
              type="button"
              onClick={() => { setOpen(false); onLogout(); }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={15} className="shrink-0" />
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dropdown link item
// ---------------------------------------------------------------------------
function DropdownLink({
  icon,
  label,
  href,
  close,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  close: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={close}
      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
    >
      <span className="text-gray-400 shrink-0">{icon}</span>
      {label}
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Main Navbar
// ---------------------------------------------------------------------------
export default function HomeNavbar() {
  const { user, status, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const isAuthenticated = status === 'authenticated' && !!user;
  // Wait for localStorage rehydration before rendering CTAs to prevent flash
  const isReady = status !== 'idle';

  const handleLogout = () => {
    setIsOpen(false);
    // TODO: Replace mock logout with real session/token invalidation.
    logout();
    router.push('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex h-16 items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image src="/images/logo.png" alt="Rendoz" width={110} height={30} priority />
        </Link>

        {/* Desktop nav links */}
        <ul className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
          <li><Link href="#" className="hover:text-orange-500 transition-colors">Explore</Link></li>
          <li><Link href="#" className="hover:text-orange-500 transition-colors">Categories</Link></li>
          <li><Link href="#" className="hover:text-orange-500 transition-colors">List item</Link></li>
          <li><Link href="#" className="hover:text-orange-500 transition-colors">How it works</Link></li>
        </ul>

        {/* Desktop CTAs — auth-aware */}
        <div className="hidden md:flex items-center gap-3 min-w-[180px] justify-end">
          {isReady && (
            isAuthenticated
              ? <UserMenu onLogout={handleLogout} />
              : (
                <>
                  <Link
                    href="/signin"
                    className="text-sm font-medium text-gray-700 px-4 py-2 rounded-full border border-gray-300 hover:border-orange-400 hover:text-orange-500 transition-colors"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/signup"
                    className="text-sm font-medium text-white px-5 py-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors"
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
          className="md:hidden p-2 text-gray-700"
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile dropdown ─────────────────────────────────────────────── */}
      {isOpen && (
        <div className="md:hidden absolute left-0 top-16 w-full bg-white border-b border-gray-100 shadow-md z-50 px-6 py-5 flex flex-col gap-4">

          {/* User info chip — logged-in only */}
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
              <span className="w-9 h-9 rounded-full bg-orange-500 text-white text-sm font-bold flex items-center justify-center shrink-0 select-none">
                {getInitials(user.name)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          {/* Nav links */}
          <Link href="#" className="text-gray-700 hover:text-orange-500 text-sm font-medium" onClick={() => setIsOpen(false)}>Explore</Link>
          <Link href="#" className="text-gray-700 hover:text-orange-500 text-sm font-medium" onClick={() => setIsOpen(false)}>Categories</Link>
          <Link href="#" className="text-gray-700 hover:text-orange-500 text-sm font-medium" onClick={() => setIsOpen(false)}>List item</Link>
          <Link href="#" className="text-gray-700 hover:text-orange-500 text-sm font-medium" onClick={() => setIsOpen(false)}>How it works</Link>

          {/* Auth actions */}
          <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
            {isAuthenticated ? (
              <>
                <Link
                  href="#"
                  onClick={() => setIsOpen(false)}
                  className="text-center text-sm font-medium text-gray-700 py-2.5 rounded-full border border-gray-200 hover:border-orange-400 hover:text-orange-500 transition-colors"
                >
                  My Profile
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-full border border-red-200 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/signin"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 rounded-full border border-gray-300 text-sm font-medium text-gray-700 text-center"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full py-2.5 rounded-full bg-orange-500 text-sm font-medium text-white text-center"
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
