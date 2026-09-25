'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  CalendarDays,
  MessageSquare,
  DollarSign,
  User,
  Menu,
  X,
  LogOut,
  BookOpen,
  Plus,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import RendozLogo from '@/component/brand/RendozLogo';

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2).map((n) => n[0]?.toUpperCase() ?? '').join('');
}

// Pages where the incomplete-profile banner should NOT show
// (profile page itself, so user can work there without nagging)
const PROFILE_EXEMPT = ['/dashboard/profile'];

// Pages that require a complete profile before access
const LISTING_PAGES = ['/dashboard/listings', '/dashboard/listings/new'];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, status, profileComplete, logout } = useAuth();
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if unauthenticated; this is the owner dashboard, so renters go back to browsing
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/signin');
    else if (status === 'authenticated' && user?.role !== 'owner') router.replace('/');
  }, [status, user, router]);

  // If user tries to access listing pages without a complete profile, redirect to profile
  useEffect(() => {
    if (
      status === 'authenticated' &&
      !profileComplete &&
      LISTING_PAGES.some((p) => pathname.startsWith(p))
    ) {
      router.replace('/dashboard/profile?gate=listing');
    }
  }, [status, profileComplete, pathname, router]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="min-h-screen bg-[#EEEEF8] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'owner') return null;

  const initials = getInitials(user.name);
  const showProfileBanner = !profileComplete && !PROFILE_EXEMPT.some((p) => pathname.startsWith(p));

  // Nav items — badge on Listings when profile incomplete
  const navItems = [
    { label: 'Overview',  href: '/dashboard',           icon: LayoutDashboard },
    { label: 'Listings',  href: '/dashboard/listings',  icon: Package,        badge: !profileComplete ? '!' : undefined },
    { label: 'Bookings',  href: '/dashboard/bookings',  icon: BookOpen },
    { label: 'Calendar',  href: '/dashboard/calendar',  icon: CalendarDays },
    { label: 'Messages',  href: '/dashboard/messages',  icon: MessageSquare },
    { label: 'Earnings',  href: '/dashboard/earnings',  icon: DollarSign },
    { label: 'Profile',   href: '/dashboard/profile',   icon: User,           badge: !profileComplete ? '!' : undefined },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo + role */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-2 mb-0.5">
          <RendozLogo variant="on-dark" />
          <span className="text-[10px] font-extrabold text-orange-400 uppercase tracking-wider">Owner</span>
        </div>
        <p className="text-[10px] text-white/30 font-medium tracking-wide uppercase">Owner Portal</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Dashboard navigation">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              <Icon size={17} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {badge === '!' && (
                <span className="h-4 w-4 rounded-full bg-amber-400 text-[#0B1220] text-[9px] font-extrabold flex items-center justify-center">
                  !
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="relative w-8 h-8 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 select-none">
            {initials}
            {profileComplete && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0B1220] flex items-center justify-center">
                <CheckCircle2 size={8} className="text-white" />
              </span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate leading-tight">{user.name}</p>
            <p className="text-[11px] text-white/40 truncate">
              {profileComplete ? '✓ Verified Owner' : 'Setup incomplete'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { logout(); router.push('/'); }}
          className="mt-1 w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-white/5 transition-colors"
        >
          <LogOut size={15} />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#EEEEF8] flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-56 bg-[#0B1220] fixed top-0 left-0 bottom-0 z-40">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside
        className={`lg:hidden fixed top-0 left-0 bottom-0 z-50 w-56 bg-[#0B1220] transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-white/50 hover:text-white p-1"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-[#0B1220] px-4 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="text-white p-1 min-h-11 min-w-11 flex items-center justify-center"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <RendozLogo variant="on-dark" />
          <div className="relative w-9 h-9 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center select-none">
            {initials}
            {profileComplete && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-[#0B1220]" />
            )}
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden lg:flex sticky top-0 z-30 bg-white border-b border-gray-100 px-8 h-14 items-center justify-between gap-4">
          <nav className="flex items-center gap-6 text-sm font-medium text-gray-600">
            <Link href="/" className="hover:text-gray-900 transition-colors">Browse</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="min-h-9 px-4 rounded-full border border-orange-500 text-orange-500 text-sm font-semibold hover:bg-orange-50 transition-colors"
            >
              Switch to Renting
            </Link>
            {profileComplete ? (
              <Link
                href="/dashboard/listings/new"
                className="min-h-9 px-4 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <Plus size={14} /> List an Item
              </Link>
            ) : (
              <Link
                href="/dashboard/profile"
                className="min-h-9 px-4 rounded-full bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold transition-colors flex items-center gap-1.5"
              >
                <AlertCircle size={14} /> Complete Profile First
              </Link>
            )}
          </div>
        </header>

        {/* Profile incomplete global banner */}
        {showProfileBanner && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle size={16} className="text-amber-600 shrink-0" />
              <p className="text-sm text-amber-800 font-medium truncate">
                <span className="font-bold">Complete your profile</span> to unlock listings and start earning —{' '}
                <span className="hidden sm:inline">you won&apos;t be able to list items until your identity and payout are verified.</span>
              </p>
            </div>
            <Link
              href="/dashboard/profile"
              className="shrink-0 flex items-center gap-1 text-sm font-bold text-amber-700 hover:underline whitespace-nowrap"
            >
              Set up now <ChevronRight size={14} />
            </Link>
          </div>
        )}

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
