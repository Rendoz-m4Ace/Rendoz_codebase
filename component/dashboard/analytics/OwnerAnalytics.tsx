'use client';

import { useCallback, useMemo, useState } from 'react';
import { ArrowDownRight, ArrowUpRight, Table2, BarChart3 } from 'lucide-react';
import {
  getOwnerAnalytics,
  type CategoryBookings,
  type Kpi,
  type WeeklyEarning,
} from '@/lib/owner-analytics';

/* Chart tokens. Series colour is palette slot 1, validated (≥3:1) on the white card. */
const SERIES = '#2a78d6';
const GRID = '#eef0f3';
const AXIS_TEXT = '#6b7280';
const SURFACE = '#ffffff';

const naira = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 });
const nairaCompact = new Intl.NumberFormat('en-NG', {
  style: 'currency',
  currency: 'NGN',
  notation: 'compact',
  maximumFractionDigits: 1,
});
const compact = new Intl.NumberFormat('en-NG', { notation: 'compact', maximumFractionDigits: 1 });
const shortDate = new Intl.DateTimeFormat('en-NG', { day: 'numeric', month: 'short' });

const formatWeek = (iso: string) => shortDate.format(new Date(`${iso}T00:00:00`));

/* ═══════════════════════════════════════════════════════════
   STAT TILE  — label · value · delta vs previous 30 days
═══════════════════════════════════════════════════════════ */
function StatTile({
  label,
  kpi,
  format,
}: {
  label: string;
  kpi: Kpi;
  format: (value: number) => string;
}) {
  const change = kpi.previous === 0 ? 0 : (kpi.current - kpi.previous) / kpi.previous;
  const up = change >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <p className="text-xs font-medium text-gray-500">{label}</p>
      <p className="mt-1.5 text-2xl font-semibold text-gray-900 leading-none">{format(kpi.current)}</p>
      <p className={`mt-2 inline-flex items-center gap-0.5 text-xs font-semibold ${up ? 'text-emerald-700' : 'text-red-600'}`}>
        <Icon size={14} aria-hidden />
        {up ? '+' : '−'}
        {Math.abs(change * 100).toFixed(0)}%
        <span className="ml-1 font-normal text-gray-500">vs previous 30 days</span>
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   CARD SHELL with chart / table toggle
═══════════════════════════════════════════════════════════ */
function ChartCard({
  title,
  subtitle,
  table,
  children,
}: {
  title: string;
  subtitle: string;
  table: React.ReactNode;
  children: React.ReactNode;
}) {
  const [showTable, setShowTable] = useState(false);
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setShowTable((v) => !v)}
          className="shrink-0 inline-flex items-center gap-1.5 min-h-9 px-3 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
          aria-pressed={showTable}
        >
          {showTable ? <BarChart3 size={14} aria-hidden /> : <Table2 size={14} aria-hidden />}
          {showTable ? 'Chart' : 'Table'}
        </button>
      </div>
      {showTable ? table : children}
    </section>
  );
}

function DataTable({ head, rows }: { head: [string, string]; rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-gray-500">
            <th className="py-2 font-medium">{head[0]}</th>
            <th className="py-2 font-medium text-right">{head[1]}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([a, b]) => (
            <tr key={a} className="border-t border-gray-100">
              <td className="py-2 text-gray-700">{a}</td>
              <td className="py-2 text-right text-gray-900 tabular-nums">{b}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EARNINGS TREND — area line, crosshair + tooltip on hover/keys
═══════════════════════════════════════════════════════════ */
function niceMax(value: number): { max: number; step: number } {
  const rough = value / 4;
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= rough) ?? rough;
  return { max: Math.ceil(value / step) * step, step };
}

function EarningsTrendChart({ data }: { data: WeeklyEarning[] }) {
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  // Measure the container so text stays at real pixel size on every screen
  const measure = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const height = 220;
  const pad = { top: 16, right: 64, bottom: 28, left: 52 };
  const innerW = Math.max(width - pad.left - pad.right, 0);
  const innerH = height - pad.top - pad.bottom;

  const { max, step } = niceMax(Math.max(...data.map((d) => d.amount), 1));
  const x = (i: number) => pad.left + (data.length === 1 ? 0 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;

  const linePath = data.map((d, i) => `${i ? 'L' : 'M'}${x(i)},${y(d.amount)}`).join(' ');
  const areaPath = `${linePath} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const ticks = Array.from({ length: Math.round(max / step) + 1 }, (_, i) => i * step);
  const last = data.length - 1;

  const onPointer = (clientX: number, rect: DOMRect) => {
    const relative = (clientX - rect.left - pad.left) / Math.max(innerW, 1);
    setActive(Math.min(last, Math.max(0, Math.round(relative * last))));
  };

  const shown = active ?? null;

  return (
    <div ref={measure} className="relative">
      {width > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`Weekly earnings for the last ${data.length} weeks, from ${naira.format(data[0].amount)} to ${naira.format(data[last].amount)}. Use the table view for every value.`}
          tabIndex={0}
          className="block outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded-lg touch-pan-y"
          onPointerMove={(e) => onPointer(e.clientX, e.currentTarget.getBoundingClientRect())}
          onPointerDown={(e) => onPointer(e.clientX, e.currentTarget.getBoundingClientRect())}
          onPointerLeave={() => setActive(null)}
          onBlur={() => setActive(null)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight') setActive((a) => Math.min(last, (a ?? -1) + 1));
            if (e.key === 'ArrowLeft') setActive((a) => Math.max(0, (a ?? last + 1) - 1));
            if (e.key === 'Escape') setActive(null);
          }}
        >
          {/* Gridlines + y ticks */}
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.left} x2={pad.left + innerW} y1={y(t)} y2={y(t)} stroke={GRID} strokeWidth={1} />
              <text x={pad.left - 8} y={y(t)} dy="0.32em" textAnchor="end" fontSize={11} fill={AXIS_TEXT}>
                {nairaCompact.format(t)}
              </text>
            </g>
          ))}

          {/* X labels: every third week keeps them from colliding */}
          {data.map((d, i) =>
            i % 3 === last % 3 ? (
              <text key={d.weekEnding} x={x(i)} y={height - 8} textAnchor="middle" fontSize={11} fill={AXIS_TEXT}>
                {formatWeek(d.weekEnding)}
              </text>
            ) : null,
          )}

          <path d={areaPath} fill={SERIES} fillOpacity={0.1} />
          <path d={linePath} fill="none" stroke={SERIES} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

          {/* End marker + direct label on the latest value */}
          <circle cx={x(last)} cy={y(data[last].amount)} r={4} fill={SERIES} stroke={SURFACE} strokeWidth={2} />
          <text x={x(last) + 10} y={y(data[last].amount)} dy="0.32em" fontSize={12} fontWeight={600} fill="#111827">
            {nairaCompact.format(data[last].amount)}
          </text>

          {/* Crosshair */}
          {shown !== null && (
            <g pointerEvents="none">
              <line x1={x(shown)} x2={x(shown)} y1={pad.top} y2={pad.top + innerH} stroke="#9ca3af" strokeWidth={1} />
              <circle cx={x(shown)} cy={y(data[shown].amount)} r={5} fill={SERIES} stroke={SURFACE} strokeWidth={2} />
            </g>
          )}
        </svg>
      )}

      {shown !== null && width > 0 && (
        <div
          className="pointer-events-none absolute top-1 rounded-lg bg-gray-900 px-3 py-2 text-xs text-white shadow-lg"
          style={{
            left: Math.min(Math.max(x(shown) - 70, 0), width - 140),
            width: 140,
          }}
          role="status"
        >
          <p className="text-gray-300">Week ending {formatWeek(data[shown].weekEnding)}</p>
          <p className="mt-0.5 font-semibold tabular-nums">{naira.format(data[shown].amount)}</p>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   BOOKINGS BY CATEGORY — horizontal bars, value at the tip
═══════════════════════════════════════════════════════════ */
function CategoryBarChart({ data }: { data: CategoryBookings[] }) {
  const [active, setActive] = useState<string | null>(null);
  const max = Math.max(...data.map((d) => d.bookings), 1);
  const total = data.reduce((sum, d) => sum + d.bookings, 0);

  return (
    <ul className="space-y-2.5" aria-label="Bookings by category">
      {data.map((d) => {
        const share = Math.round((d.bookings / total) * 100);
        return (
          <li
            key={d.category}
            className="relative grid grid-cols-[minmax(0,9rem)_1fr] sm:grid-cols-[11rem_1fr] items-center gap-3 rounded-lg -mx-2 px-2 py-1 hover:bg-gray-50 focus-within:bg-gray-50"
            onPointerEnter={() => setActive(d.category)}
            onPointerLeave={() => setActive(null)}
          >
            <span className="truncate text-xs text-gray-600" title={d.category}>
              {d.category}
            </span>
            <button
              type="button"
              className="flex items-center gap-2 min-h-7 text-left outline-none focus-visible:ring-2 focus-visible:ring-orange-400 rounded"
              onFocus={() => setActive(d.category)}
              onBlur={() => setActive(null)}
              aria-label={`${d.category}: ${d.bookings} bookings, ${share}% of total`}
            >
              <span
                className="block h-5 rounded-r"
                style={{ width: `${(d.bookings / max) * 80}%`, background: SERIES, minWidth: 4 }}
              />
              <span className="text-xs font-semibold text-gray-900 tabular-nums">{d.bookings}</span>
            </button>
            {active === d.category && (
              <span className="pointer-events-none absolute right-2 -top-8 z-10 rounded-lg bg-gray-900 px-2.5 py-1.5 text-xs text-white shadow-lg whitespace-nowrap">
                {d.bookings} bookings · {share}% of total
              </span>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ═══════════════════════════════════════════════════════════
   SECTION
═══════════════════════════════════════════════════════════ */
export default function OwnerAnalytics({ userId }: { userId: string }) {
  const analytics = useMemo(() => getOwnerAnalytics(userId), [userId]);

  return (
    <section aria-labelledby="analytics-heading" className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 id="analytics-heading" className="text-base font-extrabold text-gray-900">
            Analytics
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">Last 30 days compared with the 30 days before.</p>
        </div>
        {analytics.isSample && (
          <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-800">
            Sample data · real figures appear once bookings go live
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatTile label="Earnings" kpi={analytics.earnings30d} format={(v) => nairaCompact.format(v)} />
        <StatTile label="Bookings" kpi={analytics.bookings30d} format={(v) => compact.format(v)} />
        <StatTile label="Listing views" kpi={analytics.views30d} format={(v) => compact.format(v)} />
        <StatTile label="Occupancy rate" kpi={analytics.occupancy30d} format={(v) => `${Math.round(v * 100)}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 min-w-0">
          <ChartCard
            title="Weekly earnings"
            subtitle="Last 12 weeks, in naira"
            table={
              <DataTable
                head={['Week ending', 'Earnings']}
                rows={analytics.weeklyEarnings.map((w) => [formatWeek(w.weekEnding), naira.format(w.amount)])}
              />
            }
          >
            <EarningsTrendChart data={analytics.weeklyEarnings} />
          </ChartCard>
        </div>
        <div className="lg:col-span-2 min-w-0">
          <ChartCard
            title="Bookings by category"
            subtitle="Last 30 days"
            table={
              <DataTable
                head={['Category', 'Bookings']}
                rows={analytics.bookingsByCategory.map((c) => [c.category, String(c.bookings)])}
              />
            }
          >
            <CategoryBarChart data={analytics.bookingsByCategory} />
          </ChartCard>
        </div>
      </div>
    </section>
  );
}
