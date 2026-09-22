import RendozLogo from '@/component/brand/RendozLogo';
import { ShieldCheck, Banknote, History } from 'lucide-react';

const TRUST_FEATURES = [
  { icon: ShieldCheck, label: 'Verified owners & renters' },
  { icon: Banknote, label: 'Secure payments' },
  { icon: History, label: 'Rent only for the time you need' },
];

export default function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row overflow-x-hidden">
      <aside className="relative bg-[#0B1220] md:w-[46%] flex flex-col px-8 sm:px-10 py-10 overflow-hidden min-h-[320px] md:min-h-screen">
        <div className="absolute -top-16 -left-16 w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-[#2A3348]/80 pointer-events-none" />
        <div className="absolute -bottom-24 -right-10 w-72 h-72 rounded-full bg-[#4B5568]/50 pointer-events-none" />

        <div className="relative z-10">
          <RendozLogo variant="on-dark" />
        </div>

        <div className="relative z-10 flex flex-col gap-4 flex-1 justify-center py-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
            Rent what you need.
            <br />
            Use it. Return it.
          </h1>
          <p className="text-white/80 text-sm leading-relaxed max-w-xs">
            Create your free account to rent what you need from verified owners — or list what you
            own and earn from it.
          </p>
        </div>

        <ul className="relative z-10 flex flex-col gap-4 mt-auto pb-4">
          {TRUST_FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.label} className="flex items-center gap-3 text-white font-medium text-sm">
                <span className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-white" />
                </span>
                {feature.label}
              </li>
            );
          })}
        </ul>
      </aside>

      <div className="flex-1 bg-white flex items-center justify-center px-5 sm:px-8 py-10 md:py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
