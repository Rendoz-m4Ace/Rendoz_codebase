'use client';

// ─── ModalShell ───────────────────────────────────────────────────────────────
// Reusable backdrop + white card used by every profile modal.
// Self-contained so it can be updated independently.

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalShellProps {
  onClose: () => void;
  children: React.ReactNode;
  /** extra classes on the white card, e.g. max-w override */
  className?: string;
}

export default function ModalShell({ onClose, children, className = '' }: ModalShellProps) {
  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      {/* Card */}
      <div
        className={`relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-auto overflow-y-auto max-h-[90vh] ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors z-10"
        >
          <X size={15} />
        </button>
        {children}
      </div>
    </div>
  );
}
