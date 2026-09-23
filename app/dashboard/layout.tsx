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
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import RendozLogo from '@/component/brand/RendozLogo';

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('');
}

const navItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Listings', href: '/dashboard/listings', icon: Package, badge: 0 },
  { label: 'Bookings', href: '/dashboard/bookings', icon: BookOpen, badge: 0 },
  { label: 'Calendar', href: '/dashboard/calendar', icon: CalendarDays },
  { label: 'Messages', href: '/dashboard/messages', icon: MessageSquare, badge: 0 },
  { label: 'Earnings', href: '/dashboard/earnings', icon: DollarSign },
  { label: 'Profile', href: '/dashboard/profile', icon: User },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, status, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/signin');
  }, [status, router]);

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="min-h-screen bg-[#EEEEF8] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const initials = getInitials(user.name);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <RendozLogo variant="on-dark" />
        <p className="text-[11px] text-white/40 mt-0.5 font-medium tracking-wide uppercase">
          Owner Dashboard
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto" aria-label="Dashboard navigation">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                  : 'text-white/60 hover:text-white hover:bg-white/8'
              }`}
            >
              <Icon size={17} className="shrink-0" />
              <span className="flex-1">{label}</span>
              {typeof badge === 'number' && badge > 0 && (
                <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-4 border-t border-white/10 pt-3">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center shrink-0 select-none">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate leading-tight">{user.name}</p>
            <p className="text-[11px] text-white/40 truncate">Owner · Renter</p>
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
          <div className="w-9 h-9 rounded-full bg-orange-500 text-white text-xs font-bold flex items-center justify-center select-none">
            {initials}
          </div>
        </header>


        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
