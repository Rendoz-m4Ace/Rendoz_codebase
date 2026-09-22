'use client';

import { Loader2 } from 'lucide-react';

interface PrimaryButtonProps {
  children: React.ReactNode;
  type?: 'button' | 'submit';
  loading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

export default function PrimaryButton({
  children,
  type = 'submit',
  loading,
  disabled,
  onClick,
}: PrimaryButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="w-full min-h-12 flex items-center justify-center gap-2 bg-[#0B1220] hover:bg-[#151d33] text-white font-semibold py-3.5 rounded-xl transition-colors disabled:opacity-50 text-sm"
    >
      {loading ? <Loader2 size={16} className="animate-spin" /> : null}
      {children}
    </button>
  );
}
