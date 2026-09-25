/**
 * Owner analytics for the dashboard.
 *
 * There is no bookings/earnings table yet, so this returns SAMPLE data, seeded
 * from the user id so the numbers stay stable between visits. Replace
 * getOwnerAnalytics with a fetch to a real analytics endpoint once bookings exist;
 * the shape below is what the charts consume.
 */

export interface WeeklyEarning {
  /** ISO date of the week's last day */
  weekEnding: string;
  amount: number;
}

export interface CategoryBookings {
  category: string;
  bookings: number;
}

export interface Kpi {
  current: number;
  previous: number;
}

export interface OwnerAnalytics {
  isSample: boolean;
  earnings30d: Kpi;
  bookings30d: Kpi;
  views30d: Kpi;
  /** Share of available days that were booked, 0–1 */
  occupancy30d: Kpi;
  weeklyEarnings: WeeklyEarning[];
  bookingsByCategory: CategoryBookings[];
}

const CATEGORIES = [
  'Camera & Photography',
  'Vehicles',
  'Generators',
  'Tools & Equipment',
  'Events & Party',
  'Electronics',
];

/** Small deterministic PRNG (mulberry32) so sample data is stable per user. */
function seededRandom(seedText: string): () => number {
  let seed = 0;
  for (const char of seedText) seed = (Math.imul(31, seed) + char.charCodeAt(0)) | 0;
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getOwnerAnalytics(userId: string, today = new Date()): OwnerAnalytics {
  const random = seededRandom(userId);
  const between = (min: number, max: number) => Math.round(min + random() * (max - min));

  // 12 weeks of earnings with a gentle upward trend and some noise
  const weeklyEarnings: WeeklyEarning[] = Array.from({ length: 12 }, (_, i) => {
    const weekEnding = new Date(today);
    weekEnding.setDate(today.getDate() - (11 - i) * 7);
    const trend = 18000 + i * 2600;
    const amount = Math.round((trend + between(-6000, 9000)) / 500) * 500;
    return { weekEnding: weekEnding.toISOString().slice(0, 10), amount: Math.max(amount, 0) };
  });

  const bookingsByCategory = CATEGORIES.map((category) => ({
    category,
    bookings: between(2, 24),
  })).sort((a, b) => b.bookings - a.bookings);

  const sumWeeks = (from: number, to: number) =>
    weeklyEarnings.slice(from, to).reduce((total, week) => total + week.amount, 0);

  return {
    isSample: true,
    earnings30d: { current: sumWeeks(8, 12), previous: sumWeeks(4, 8) },
    bookings30d: { current: between(14, 30), previous: between(10, 26) },
    views30d: { current: between(600, 1600), previous: between(500, 1400) },
    occupancy30d: { current: between(45, 80) / 100, previous: between(40, 75) / 100 },
    weeklyEarnings,
    bookingsByCategory,
  };
}
