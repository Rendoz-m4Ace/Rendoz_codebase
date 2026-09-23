'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import {
  X, ChevronDown, Upload, Plus, Trash2, CheckCircle2, Info,
  ArrowLeft, Camera, Video, FileText, Image as ImageIcon,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   STATIC DATA
═══════════════════════════════════════════════════════ */
const CATEGORIES: Record<string, string[]> = {
  Vehicles:            ['Cars', 'Motorcycles', 'Bicycles', 'Trucks & Vans', 'Boats', 'Other'],
  Electronics:         ['Laptops & Computers', 'Cameras & Lenses', 'Audio Equipment', 'Projectors', 'Drones', 'Gaming', 'Other'],
  'Tools & Equipment': ['Power Tools', 'Hand Tools', 'Generators', 'Ladders', 'Welding', 'Other'],
  'Event Equipment':   ['Canopies & Tents', 'Tables & Chairs', 'Sound Systems', 'Lighting', 'Decor', 'Other'],
  Fashion:             ['Men', 'Women', 'Unisex', 'Accessories', 'Shoes', 'Other'],
  Furniture:           ['Indoor', 'Outdoor', 'Office', 'Beds & Mattresses', 'Other'],
  'Sports & Fitness':  ['Gym Equipment', 'Outdoor Gear', 'Water Sports', 'Field Sports', 'Other'],
  'Cameras & Photo':   ['DSLR / Mirrorless', 'Film Cameras', 'Lenses', 'Lighting', 'Accessories', 'Other'],
  Other:               ['Other'],
};
const CATEGORY_LIST = Object.keys(CATEGORIES);
const BRAND_MODEL_CATS = new Set(['Vehicles', 'Electronics', 'Tools & Equipment', 'Cameras & Photo']);
const SIZE_CATS      = new Set(['Fashion']);
const QUANTITY_CATS  = new Set(['Event Equipment', 'Furniture', 'Sports & Fitness']);
const CONDITIONS     = ['New', 'Like New', 'Good', 'Fair'] as const;
const SIZES          = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'] as const;
const DAYS_OF_WEEK   = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const MONTHS         = ['January','February','March','April','May','June',
                         'July','August','September','October','November','December'];

type Condition = typeof CONDITIONS[number];

/* ═══════════════════════════════════════════════════════
   TYPES
═══════════════════════════════════════════════════════ */
interface ListingDraft {
  // Step 1
  name: string; category: string; subcategory: string;
  description: string; brand: string; model: string;
  condition: Condition | ''; size: string; quantity: string;
  // Step 2
  photos: string[];   // object-URLs
  videoFile: string | null;
  docFiles: string[];
  // Step 3
  hourlyEnabled: boolean; hourlyPrice: string;
  dailyPrice: string; weeklyPrice: string;
  customPricingRules: string;
  unavailableDates: Set<string>;  // "YYYY-MM-DD"
  securityDeposit: string;
}

const EMPTY: ListingDraft = {
  name: '', category: '', subcategory: '', description: '',
  brand: '', model: '', condition: '', size: '', quantity: '',
  photos: [], videoFile: null, docFiles: [],
  hourlyEnabled: false, hourlyPrice: '',
  dailyPrice: '', weeklyPrice: '', customPricingRules: '',
  unavailableDates: new Set(),
  securityDeposit: '',
};

/* ═══════════════════════════════════════════════════════
   SHARED UI ATOMS
═══════════════════════════════════════════════════════ */
function Badge({ children, variant = 'required' }: {
  children: React.ReactNode;
  variant?: 'required' | 'optional' | 'depends';
}) {
  const cls = {
    required: 'bg-red-50 text-red-500 border border-red-200',
    optional: 'bg-gray-100 text-gray-500 border border-gray-200',
    depends:  'bg-gray-100 text-gray-500 border border-gray-200',
  }[variant];
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap ${cls}`}>{children}</span>;
}

function FieldRow({ label, badge, children }: { label: string; badge?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-sm font-semibold text-gray-800">{label}</label>
        {badge}
      </div>
      {children}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement> & { prefix?: string }) {
  const { prefix, className = '', ...rest } = props;
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none select-none">
          {prefix}
        </span>
      )}
      <input
        {...rest}
        className={`w-full h-12 ${prefix ? 'pl-7' : 'px-4'} pr-4 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all ${className}`}
      />
    </div>
  );
}

function SelectInput({ value, onChange, disabled, children }: {
  value: string; onChange: (v: string) => void; disabled?: boolean; children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled}
        className={`w-full h-12 pl-4 pr-10 border border-gray-200 rounded-xl text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all ${
          disabled ? 'text-gray-400 bg-gray-50 cursor-not-allowed' : 'text-gray-900 cursor-pointer'
        }`}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={onChange}
      className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${checked ? 'bg-orange-500' : 'bg-gray-200'}`}>
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP INDICATOR
═══════════════════════════════════════════════════════ */
const STEPS = [
  { num: 1, label: 'Asset Info' },
  { num: 2, label: 'Photos' },
  { num: 3, label: 'Pricing' },
];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-start px-2 sm:px-6 py-4 gap-0">
      {STEPS.map((step, i) => {
        const done   = current > step.num;
        const active = current === step.num;
        return (
          <div key={step.num} className="flex items-start flex-1">
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className={`h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                done   ? 'bg-emerald-500 border-emerald-500 text-white' :
                active ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200' :
                         'bg-white border-gray-300 text-gray-400'
              }`}>
                {done ? <CheckCircle2 className="h-4.5 w-4.5" style={{height:18,width:18}} /> : step.num}
              </div>
              <span className={`text-[11px] font-bold whitespace-nowrap ${active ? 'text-gray-900' : done ? 'text-gray-500' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mt-4 mx-2 rounded-full transition-all duration-500 ${done ? 'bg-emerald-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 1 — Asset Info
═══════════════════════════════════════════════════════ */
function Step1({ draft, update }: { draft: ListingDraft; update: (p: Partial<ListingDraft>) => void }) {
  const showBrandModel = BRAND_MODEL_CATS.has(draft.category);
  const showSize       = SIZE_CATS.has(draft.category);
  const showQuantity   = QUANTITY_CATS.has(draft.category);
  const subcats        = draft.category ? CATEGORIES[draft.category] : [];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-1">Step 1 of 3</p>
        <h2 className="text-2xl font-extrabold text-gray-900">Tell us about your asset</h2>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-lg">
          Start with the basics. What you enter here decides which fields show up next —
          categories like Vehicles ask for more detail than Fashion, for example.
        </p>
      </div>

      <FieldRow label="Asset Name" badge={<Badge variant="required">Required</Badge>}>
        <TextInput value={draft.name} onChange={(e) => update({ name: (e.target as HTMLInputElement).value })} placeholder="e.g. 2020 Lexus RX 350" />
      </FieldRow>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FieldRow label="Category" badge={<Badge variant="required">Required</Badge>}>
          <SelectInput value={draft.category} onChange={(v) => update({ category: v, subcategory: '' })}>
            <option value="">Select a category</option>
            {CATEGORY_LIST.map((c) => <option key={c} value={c}>{c}</option>)}
          </SelectInput>
        </FieldRow>
        <FieldRow label="Subcategory" badge={<Badge variant="depends">Depends on category</Badge>}>
          <SelectInput value={draft.subcategory} onChange={(v) => update({ subcategory: v })} disabled={!draft.category}>
            <option value="">{draft.category ? 'Select a subcategory' : 'Select a category first'}</option>
            {subcats.map((s) => <option key={s} value={s}>{s}</option>)}
          </SelectInput>
        </FieldRow>
      </div>

      <FieldRow label="Description" badge={<Badge variant="required">Required</Badge>}>
        <textarea value={draft.description} onChange={(e) => update({ description: e.target.value })}
          placeholder="Describe the asset — condition details, what's included, and anything a renter should know before booking."
          rows={4}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent resize-none transition-all" />
        <p className={`text-xs mt-1 ${draft.description.length > 0 && draft.description.length < 40 ? 'text-red-400' : 'text-gray-400'}`}>
          {draft.description.length < 40 ? 'Minimum 40 characters. Clear descriptions get booked faster.' : `✓ ${draft.description.length} characters`}
        </p>
      </FieldRow>

      {(showBrandModel || !draft.category) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FieldRow label="Brand" badge={<Badge variant="optional">Optional</Badge>}>
            <TextInput value={draft.brand} onChange={(e) => update({ brand: (e.target as HTMLInputElement).value })} placeholder="e.g. Lexus, Canon, DeWalt" />
          </FieldRow>
          <FieldRow label="Model" badge={<Badge variant="optional">Optional</Badge>}>
            <TextInput value={draft.model} onChange={(e) => update({ model: (e.target as HTMLInputElement).value })} placeholder="e.g. RX 350, EOS R5" />
          </FieldRow>
        </div>
      )}

      {showSize && (
        <FieldRow label="Size" badge={<Badge variant="required">Required</Badge>}>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button key={s} type="button" onClick={() => update({ size: draft.size === s ? '' : s })}
                className={`px-4 py-2 rounded-full border text-sm font-medium transition-all ${draft.size === s ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                {s}
              </button>
            ))}
          </div>
        </FieldRow>
      )}

      {showQuantity && (
        <div className="sm:w-1/2">
          <FieldRow label="Quantity Available" badge={<Badge variant="required">Required</Badge>}>
            <TextInput type="number" value={draft.quantity} onChange={(e) => update({ quantity: (e.target as HTMLInputElement).value })} placeholder="e.g. 10" min="1" />
          </FieldRow>
        </div>
      )}

      <FieldRow label="Condition" badge={<Badge variant="required">Required</Badge>}>
        <div className="flex flex-wrap gap-2">
          {CONDITIONS.map((c) => (
            <button key={c} type="button" onClick={() => update({ condition: draft.condition === c ? '' : c })}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${draft.condition === c ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
              {c}
            </button>
          ))}
        </div>
      </FieldRow>

      {draft.category && (
        <div className="flex items-start gap-2.5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3">
          <Info className="h-4 w-4 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-xs text-orange-700 leading-relaxed">
            {showBrandModel ? 'Brand and Model are shown because this looks like a Vehicles or Electronics listing. Some categories (like Fashion or Event Equipment) will ask for Size or Quantity instead.' :
             showSize       ? 'Size is shown because you selected Fashion. Other categories like Vehicles or Electronics will ask for Brand and Model instead.' :
             showQuantity   ? 'Quantity is shown because you selected an Event or Furniture category. Categories like Vehicles or Electronics show Brand and Model instead.' :
             `You selected "${draft.category}". Fill in the fields above and continue.`}
          </p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 2 — Photos (matches mockup exactly)
═══════════════════════════════════════════════════════ */
const SLOT_COUNT = 5;
const MIN_PHOTOS = 3;

function Step2({ draft, update }: { draft: ListingDraft; update: (p: Partial<ListingDraft>) => void }) {
  const dropRef   = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const videoRef  = useRef<HTMLInputElement>(null);
  const docRef    = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const loadFiles = (files: FileList | null) => {
    if (!files) return;
    const remaining = SLOT_COUNT - draft.photos.length;
    const urls: string[] = [];
    Array.from(files).slice(0, remaining).forEach((f) => {
      if (f.type.startsWith('image/')) urls.push(URL.createObjectURL(f));
    });
    if (urls.length) update({ photos: [...draft.photos, ...urls] });
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false); loadFiles(e.dataTransfer.files);
  };

  const removePhoto = (i: number) => {
    const next = [...draft.photos]; next.splice(i, 1); update({ photos: next });
  };

  const handleVideoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) update({ videoFile: f.name });
  };

  const handleDocAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const names = Array.from(files).map((f) => f.name);
    update({ docFiles: [...draft.docFiles, ...names] });
  };

  // Build 5-slot array
  const slots = Array.from({ length: SLOT_COUNT }, (_, i) => draft.photos[i] ?? null);
  const required = slots.slice(0, MIN_PHOTOS);
  const optional = slots.slice(MIN_PHOTOS);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-1">Step 2 of 3</p>
        <h2 className="text-2xl font-extrabold text-gray-900">Add photos of your asset</h2>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-lg">
          Listings with at least 3 clear photos get significantly more rental requests. Show
          the item from multiple angles.
        </p>
      </div>

      {/* Drop zone */}
      <div ref={dropRef}
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onClick={() => inputRef.current?.click()}
        className={`rounded-2xl border-2 border-dashed transition-all py-10 px-6 flex flex-col items-center gap-4 cursor-pointer select-none ${
          dragging ? 'border-orange-400 bg-orange-50' :
          draft.photos.length >= SLOT_COUNT ? 'border-gray-200 bg-gray-50 opacity-50 pointer-events-none' :
          'border-gray-300 bg-[#FAFAFA] hover:border-orange-300 hover:bg-orange-50/20'
        }`}>
        <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center">
          <Upload className="h-6 w-6 text-orange-500" />
        </div>
        <div className="text-center">
          <p className="text-sm font-bold text-gray-800">
            {draft.photos.length >= SLOT_COUNT ? 'All photo slots filled' : 'Drag photos here or click to upload'}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">JPG or PNG, up to 10MB each</p>
        </div>
        <button type="button" onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          className="h-10 px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
          Choose Photos
        </button>
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple className="sr-only"
        onChange={(e) => loadFiles(e.target.files)} />

      {/* Photo Slots */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-bold text-gray-900">Photo Slots</span>
          <span className="text-[11px] font-bold text-orange-500 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
            Minimum {MIN_PHOTOS} required
          </span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
          {/* Required slots */}
          {required.map((url, i) => (
            <PhotoSlot key={`req-${i}`} url={url} label={`Photo ${i + 1}`} required
              onAdd={() => inputRef.current?.click()}
              onRemove={() => removePhoto(i)} />
          ))}
          {/* Optional slots */}
          {optional.map((url, i) => (
            <PhotoSlot key={`opt-${i}`} url={url} label="Optional" required={false}
              onAdd={() => inputRef.current?.click()}
              onRemove={() => removePhoto(MIN_PHOTOS + i)} />
          ))}
        </div>
      </div>

      {/* Video row */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            <Video className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Video</p>
            <p className="text-xs text-gray-400">
              {draft.videoFile ? draft.videoFile : 'Optional — a short walkaround builds trust'}
            </p>
          </div>
        </div>
        <button type="button" onClick={() => videoRef.current?.click()}
          className="shrink-0 h-9 px-4 rounded-full border border-orange-400 text-orange-500 text-xs font-semibold hover:bg-orange-50 transition-colors">
          {draft.videoFile ? 'Change' : 'Add Video'}
        </button>
        <input ref={videoRef} type="file" accept="video/*" className="sr-only" onChange={handleVideoAdd} />
      </div>

      {/* Additional Documents row */}
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Additional Documents</p>
            <p className="text-xs text-gray-400">
              {draft.docFiles.length > 0 ? draft.docFiles.join(', ') : 'Optional — manuals, receipts, insurance'}
            </p>
          </div>
        </div>
        <button type="button" onClick={() => docRef.current?.click()}
          className="shrink-0 h-9 px-4 rounded-full border border-orange-400 text-orange-500 text-xs font-semibold hover:bg-orange-50 transition-colors">
          Add Files
        </button>
        <input ref={docRef} type="file" accept=".pdf,.doc,.docx,image/*" multiple className="sr-only" onChange={handleDocAdd} />
      </div>
    </div>
  );
}

/* Photo slot tile */
function PhotoSlot({ url, label, required, onAdd, onRemove }: {
  url: string | null; label: string; required: boolean;
  onAdd: () => void; onRemove: () => void;
}) {
  return (
    <div className={`relative aspect-square rounded-xl border-2 overflow-hidden flex flex-col items-center justify-center transition-all ${
      url
        ? 'border-transparent'
        : required
          ? 'border-dashed border-orange-300 bg-orange-50/40 hover:border-orange-400 cursor-pointer'
          : 'border-dashed border-gray-200 bg-gray-50 hover:border-gray-300 cursor-pointer'
    }`}
      onClick={url ? undefined : onAdd}>
      {/* Required dot indicator (top-right) */}
      {required && !url && (
        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-orange-400" />
      )}

      {url ? (
        <>
          <img src={url} alt={label} className="w-full h-full object-cover" />
          {/* Remove on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
            <button type="button" onClick={(e) => { e.stopPropagation(); onRemove(); }}
              className="h-8 w-8 rounded-full bg-red-500 text-white flex items-center justify-center">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </>
      ) : (
        <>
          <Plus className={`h-5 w-5 mb-1 ${required ? 'text-orange-400' : 'text-gray-300'}`} />
          <span className="text-[11px] font-medium text-gray-400">{label}</span>
        </>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   AVAILABILITY CALENDAR
═══════════════════════════════════════════════════════ */
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function toKey(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}
function isPast(y: number, m: number, d: number) {
  const today = new Date(); today.setHours(0,0,0,0);
  return new Date(y, m, d) < today;
}

function AvailabilityCalendar({
  unavailable, onChange,
}: {
  unavailable: Set<string>;
  onChange: (next: Set<string>) => void;
}) {
  const today = new Date();
  const [year,  setYear]  = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [dragEnd,   setDragEnd]   = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay    = getFirstDayOfWeek(year, month);

  // Cells = nulls for padding + day numbers
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Range between dragStart and dragEnd
  const rangeKeys = (() => {
    if (!dragStart || !dragEnd) return new Set<string>();
    const a = new Date(dragStart), b = new Date(dragEnd);
    const [lo, hi] = a <= b ? [a, b] : [b, a];
    const keys = new Set<string>();
    const cur = new Date(lo);
    while (cur <= hi) {
      keys.add(cur.toISOString().slice(0, 10));
      cur.setDate(cur.getDate() + 1);
    }
    return keys;
  })();

  const handleMouseDown = (key: string) => {
    setDragStart(key); setDragEnd(key); setSelecting(true);
  };
  const handleMouseEnter = (key: string) => {
    if (selecting) setDragEnd(key);
  };
  const handleMouseUp = () => {
    if (!selecting) return;
    setSelecting(false);
    const next = new Set(unavailable);
    rangeKeys.forEach((k) => next.add(k));
    onChange(next);
    setDragStart(null); setDragEnd(null);
  };

  const clearSelection = () => onChange(new Set());

  const markUnavailable = () => {
    if (!dragStart) return;
    const next = new Set(unavailable);
    rangeKeys.forEach((k) => next.add(k));
    onChange(next);
    setDragStart(null); setDragEnd(null);
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <div
      className="select-none"
      onMouseUp={handleMouseUp}
      onMouseLeave={() => { if (selecting) handleMouseUp(); }}
    >
      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button type="button" onClick={prevMonth}
          className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors text-sm font-bold">
          ‹
        </button>
        <span className="text-sm font-bold text-gray-900">{MONTHS[month]} {year}</span>
        <button type="button" onClick={nextMonth}
          className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors text-sm font-bold">
          ›
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mb-2">
        <button type="button" onClick={clearSelection}
          className="text-xs font-semibold text-gray-500 hover:text-gray-700 transition-colors">
          Clear Selection
        </button>
        {dragStart && (
          <button type="button" onClick={markUnavailable}
            className="text-xs font-bold text-orange-600 hover:underline">
            Mark Unavailable
          </button>
        )}
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="text-center text-[11px] font-bold text-gray-400 py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5">
        {cells.map((day, i) => {
          if (!day) return <div key={`pad-${i}`} />;
          const key    = toKey(year, month, day);
          const past   = isPast(year, month, day);
          const unav   = unavailable.has(key);
          const inRange = rangeKeys.has(key);
          return (
            <div key={key}
              onMouseDown={() => !past && handleMouseDown(key)}
              onMouseEnter={() => handleMouseEnter(key)}
              className={`relative flex items-center justify-center h-9 w-full rounded-lg text-sm font-medium transition-all cursor-pointer ${
                past      ? 'text-gray-300 cursor-not-allowed' :
                inRange && selecting ? 'bg-orange-500 text-white' :
                unav      ? 'bg-orange-500 text-white' :
                            'text-gray-700 hover:bg-gray-100'
              }`}>
              {past && (
                <div className="absolute inset-1 rounded border border-gray-200 opacity-30"
                  style={{ background: 'repeating-linear-gradient(-45deg, transparent, transparent 3px, #d1d5db 3px, #d1d5db 4px)' }} />
              )}
              <span className="relative z-10">{day}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4">
        {[
          { color: 'bg-white border border-gray-200', label: 'Available' },
          { color: 'bg-white border border-gray-200 opacity-40', label: 'Unavailable', striped: true },
          { color: 'bg-orange-500', label: `Selected (${Array.from(unavailable).length > 0 ? `${Array.from(unavailable).length} days` : 'none'})` },
        ].map(({ color, label, striped }) => (
          <div key={label} className="flex items-center gap-1.5">
            <div className={`h-4 w-4 rounded ${color} ${striped ? 'relative overflow-hidden' : ''}`}
              style={striped ? { background: 'repeating-linear-gradient(-45deg, #f3f4f6, #f3f4f6 2px, #d1d5db 2px, #d1d5db 4px)' } : {}}>
            </div>
            <span className="text-[11px] text-gray-500">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-gray-400 mt-2 leading-relaxed">
        Tap a date to select it, drag across days for a range, then choose "Mark Unavailable" to block that range from bookings.
        Sep 9–11 shown as blocked as an example.
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   STEP 3 — Pricing & Availability
═══════════════════════════════════════════════════════ */
function Step3({ draft, update }: { draft: ListingDraft; update: (p: Partial<ListingDraft>) => void }) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-1">Step 3 of 3</p>
        <h2 className="text-2xl font-extrabold text-gray-900">Set your pricing &amp; availability</h2>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed max-w-lg">
          Daily price and an availability calendar are required — everything else here is
          optional, so you can start simple and add more later.
        </p>
      </div>

      {/* Hourly Price toggle */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-800">Hourly Price</p>
            <p className="text-xs text-gray-400">Turn on if this item can be rented by the hour</p>
          </div>
          <Toggle checked={draft.hourlyEnabled} onChange={() => update({ hourlyEnabled: !draft.hourlyEnabled })} />
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">₦</span>
          <input
            type="number" min="0"
            value={draft.hourlyPrice}
            onChange={(e) => update({ hourlyPrice: e.target.value })}
            placeholder={draft.hourlyEnabled ? 'e.g. 5,000' : 'Available if hourly is turned on'}
            disabled={!draft.hourlyEnabled}
            className={`w-full h-12 pl-8 pr-16 border border-gray-200 rounded-xl text-sm placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all ${
              !draft.hourlyEnabled ? 'bg-gray-50 text-gray-400 cursor-not-allowed' : 'text-gray-900'
            }`}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">/ hour</span>
        </div>
      </div>

      {/* Daily Price */}
      <FieldRow label="Daily Price" badge={<Badge variant="required">Required</Badge>}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">₦</span>
          <input type="number" min="0"
            value={draft.dailyPrice}
            onChange={(e) => update({ dailyPrice: e.target.value })}
            placeholder="e.g. 70,000"
            className="w-full h-12 pl-8 pr-16 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">/ day</span>
        </div>
      </FieldRow>

      {/* Weekly Price */}
      <FieldRow label="Weekly Price" badge={<Badge variant="optional">Optional</Badge>}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">₦</span>
          <input type="number" min="0"
            value={draft.weeklyPrice}
            onChange={(e) => update({ weeklyPrice: e.target.value })}
            placeholder="e.g. 420,000"
            className="w-full h-12 pl-8 pr-16 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium pointer-events-none">/ week</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">Leave blank to auto-calculate from your daily rate</p>
      </FieldRow>

      {/* Custom Pricing */}
      <FieldRow label="Custom Pricing" badge={<Badge variant="optional">Optional</Badge>}>
        <button type="button"
          onClick={() => update({ customPricingRules: draft.customPricingRules ? '' : 'custom' })}
          className="w-full flex items-center gap-3 h-12 px-4 border border-gray-200 rounded-xl bg-white hover:border-orange-300 hover:bg-orange-50/20 transition-all">
          <div className="h-7 w-7 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
            <Plus className="h-4 w-4 text-orange-500" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-700">Add a custom price rule</p>
            <p className="text-xs text-gray-400">e.g. weekend rate, holiday pricing, long-term discount</p>
          </div>
        </button>
        {draft.customPricingRules && draft.customPricingRules !== 'custom' && (
          <input type="text" value={draft.customPricingRules}
            onChange={(e) => update({ customPricingRules: e.target.value })}
            placeholder="Describe your custom pricing rule"
            className="mt-2 w-full h-12 px-4 border border-orange-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all" />
        )}
      </FieldRow>

      {/* Availability Calendar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-sm font-semibold text-gray-800">Availability Calendar</label>
          <Badge variant="required">Required</Badge>
        </div>
        <p className="text-xs text-gray-500 mb-3 leading-relaxed">
          Mark which dates this asset can be rented. Everything is Available by default — block off dates you already know it's unavailable.
        </p>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <AvailabilityCalendar
            unavailable={draft.unavailableDates}
            onChange={(next) => update({ unavailableDates: next })}
          />
        </div>
      </div>

      {/* Security Deposit */}
      <FieldRow label="Security Deposit" badge={<Badge variant="optional">Optional</Badge>}>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400 pointer-events-none">₦</span>
          <input type="number" min="0"
            value={draft.securityDeposit}
            onChange={(e) => update({ securityDeposit: e.target.value })}
            placeholder="e.g. 50,000"
            className="w-full h-12 pl-8 pr-4 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all" />
        </div>
        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
          <Info className="h-3.5 w-3.5 shrink-0" />
          Held at booking and refunded to the renter after the item is returned in the condition it was rented.
        </p>
      </FieldRow>

      {/* Renter preview card */}
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Renters Will See</p>
        <div className="rounded-2xl border border-gray-200 bg-[#F8F8FA] p-4 flex items-center gap-4">
          <div className="h-14 w-14 rounded-xl bg-gray-200 flex items-center justify-center shrink-0">
            <ImageIcon className="h-6 w-6 text-gray-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-700">
              {draft.name || 'Your asset name will appear here'}
            </p>
            <p className="text-sm font-bold text-gray-900 mt-0.5">
              {draft.dailyPrice ? `₦${Number(draft.dailyPrice).toLocaleString()} / day` : '₦— / day'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   VALIDATION
═══════════════════════════════════════════════════════ */
function canProceed(step: number, draft: ListingDraft): boolean {
  if (step === 1) {
    const base = !!draft.name.trim() && !!draft.category && draft.description.length >= 40 && !!draft.condition;
    if (SIZE_CATS.has(draft.category))     return base && !!draft.size;
    if (QUANTITY_CATS.has(draft.category)) return base && !!draft.quantity;
    return base;
  }
  if (step === 2) return draft.photos.length >= MIN_PHOTOS;
  if (step === 3) return !!draft.dailyPrice && Number(draft.dailyPrice) > 0;
  return false;
}

/* ═══════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════ */
export default function NewListingPage() {
  const [step, setStep]           = useState(1);
  const [draft, setDraft]         = useState<ListingDraft>(EMPTY);
  const [saving, setSaving]       = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = useCallback((patch: Partial<ListingDraft>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  const scrollTop = () => {
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const proceed = () => {
    if (!canProceed(step, draft)) return;
    if (step < 3) { setStep(step + 1); scrollTop(); }
    else handlePublish();
  };

  const handleSaveDraft = () => {
    setSaving(true);
    setTimeout(() => setSaving(false), 800);
  };

  const handlePublish = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setSubmitted(true); }, 1500);
  };

  const ctaLabel = saving ? 'Saving…' :
    step === 1 ? 'Continue to Photos' :
    step === 2 ? 'Continue to Pricing' :
    'Publish Listing';

  /* ── Success ── */
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto flex flex-col items-center text-center py-16 px-4">
        <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
          <CheckCircle2 className="h-10 w-10 text-emerald-500" />
        </div>
        <h2 className="text-2xl font-extrabold text-gray-900">Listing submitted!</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-sm leading-relaxed">
          Your listing for <strong>{draft.name}</strong> has been submitted for review.
          Most listings are approved within 24 hours. We'll notify you by email and SMS.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <Link href="/dashboard/listings"
            className="flex-1 sm:flex-none inline-flex items-center justify-center h-11 px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold transition-colors">
            View My Listings
          </Link>
          <button onClick={() => { setDraft(EMPTY); setStep(1); setSubmitted(false); }}
            className="flex-1 sm:flex-none h-11 px-6 rounded-full border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            Create Another
          </button>
        </div>
      </div>
    );
  }

  /* ── Wizard ── */
  return (
    <div className="max-w-2xl mx-auto">
      {/* Header row */}
      <div className="flex items-center justify-between mb-1 px-1">
        <span className="text-lg font-extrabold text-orange-500 tracking-tight">Rendoz</span>
        <Link href="/dashboard/listings"
          className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          aria-label="Close wizard">
          <X className="h-4 w-4 text-gray-600" />
        </Link>
      </div>

      {/* Step indicator */}
      <StepIndicator current={step} />

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 sm:p-7">
          {step === 1 && <Step1 draft={draft} update={update} />}
          {step === 2 && <Step2 draft={draft} update={update} />}
          {step === 3 && <Step3 draft={draft} update={update} />}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 px-5 sm:px-7 py-4 flex items-center justify-between gap-3 bg-gray-50/60">
          {step > 1 ? (
            <button type="button" onClick={() => { setStep(step - 1); scrollTop(); }}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <Link href="/dashboard/listings"
              className="text-sm font-semibold text-gray-400 hover:text-gray-600 transition-colors">
              Back
            </Link>
          )}

          <div className="flex items-center gap-4">
            <button type="button" onClick={handleSaveDraft}
              className="text-sm font-semibold text-gray-600 hover:text-gray-900 underline underline-offset-2 transition-colors">
              {saving ? 'Saving…' : 'Save as Draft'}
            </button>
            <button type="button" onClick={proceed}
              disabled={!canProceed(step, draft) || saving}
              className="h-11 px-6 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm shadow-orange-200 whitespace-nowrap">
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>

      {/* Caption */}
      <p className="text-center text-xs text-gray-400 mt-3">
        Step {step} of 3 · {STEPS[step - 1].label}
        {step === 2 && draft.photos.length < MIN_PHOTOS && (
          <span className="text-orange-500 font-semibold"> · {MIN_PHOTOS - draft.photos.length} more photo{MIN_PHOTOS - draft.photos.length > 1 ? 's' : ''} needed</span>
        )}
      </p>
    </div>
  );
}
