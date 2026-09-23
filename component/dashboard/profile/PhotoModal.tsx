'use client';

// ─── PhotoModal ───────────────────────────────────────────────────────────────
// Upload profile photo modal — drag & drop + browse, photo guidelines.
// Isolated, no external state deps except onSave.

import { useState, useRef, useCallback } from 'react';
import { Upload, User, Plus, Check, X } from 'lucide-react';
import ModalShell from './ModalShell';

interface PhotoModalProps {
  currentPhotoUrl?: string | null;
  onSave: (dataUrl: string) => void;
  onClose: () => void;
}

const GUIDELINES = [
  'Clear, well-lit face',
  'No sunglasses or hats',
  'Solo photo (no groups)',
  'Natural headshot pose',
];

export default function PhotoModal({ currentPhotoUrl, onSave, onClose }: PhotoModalProps) {
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl ?? null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) loadFile(file);
  }, []);

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
  };

  return (
    <ModalShell onClose={onClose}>
      <div className="p-6 pt-8">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6 pr-6">
          <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
            <User size={20} className="text-orange-500" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Upload your profile photo</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Renters prefer booking items from owners with clear, friendly profile pictures. It
              boosts booking acceptance by 40%.
            </p>
          </div>
        </div>

        {/* Avatar preview */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full border-2 border-orange-400 overflow-hidden flex items-center justify-center bg-gray-100">
              {preview ? (
                <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-gray-400" />
              )}
            </div>
            {preview && (
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"
                aria-label="Remove photo"
              >
                <X size={12} />
              </button>
            )}
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-md"
              aria-label="Add photo"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          className={`rounded-2xl border-2 border-dashed transition-colors px-6 py-8 flex flex-col items-center gap-3 mb-5 ${
            dragging ? 'border-orange-400 bg-orange-50' : 'border-gray-200 bg-gray-50'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-orange-100 flex items-center justify-center">
            <Upload size={20} className="text-orange-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-700">Drag &amp; drop your portrait photo here</p>
            <p className="text-xs text-gray-400 mt-0.5">Supports JPG, PNG or WEBP (up to 8MB)</p>
          </div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="min-h-9 px-4 rounded-xl border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white flex items-center gap-2 transition-colors"
          >
            <Upload size={13} /> Browse Files
          </button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={onFileChange}
        />

        {/* Guidelines */}
        <div className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3 mb-6">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-2">
            Photo guidelines for fast approval
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {GUIDELINES.map((g) => (
              <div key={g} className="flex items-center gap-2 text-xs text-gray-600">
                <Check size={13} className="text-green-500 shrink-0" />
                {g}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-gray-400">Visible to renters upon browsing</p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 px-5 rounded-full text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!preview}
              onClick={() => { if (preview) { onSave(preview); onClose(); } }}
              className="min-h-11 px-6 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors"
            >
              Upload &amp; Save
            </button>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}
