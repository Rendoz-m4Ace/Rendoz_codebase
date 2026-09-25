/**
 * Marketplace reference data used by the assistant's tools.
 *
 * Listings mirror the sample items shown on the homepage (there is no listings
 * table yet). When a listings API exists, point searchListings at it instead.
 */

export interface CatalogListing {
  id: string;
  title: string;
  category: string;
  pricePerDay: number;
  location: string;
  rating: number;
  reviews: number;
}

export const SAMPLE_LISTINGS: CatalogListing[] = [
  { id: 'canon-eos-r50', title: 'Canon EOS R50 Camera', category: 'Cameras', pricePerDay: 3500, location: 'Lagos Island', rating: 4.8, reviews: 24 },
  { id: 'bmw-3-series', title: 'BMW 3 Series', category: 'Vehicle', pricePerDay: 45000, location: 'Victoria Island', rating: 4.7, reviews: 12 },
  { id: 'honda-generator', title: 'Honda Generator', category: 'Generator', pricePerDay: 8000, location: 'Lekki', rating: 4.9, reviews: 41 },
  { id: 'power-tools-set', title: 'Power Tools Set', category: 'Tools', pricePerDay: 2500, location: 'Ikeja', rating: 4.7, reviews: 18 },
  { id: 'party-canopy-tent', title: 'Party Canopy Tent', category: 'Event Hall', pricePerDay: 15000, location: 'Lekki', rating: 4.9, reviews: 56 },
];

/** Categories as shown on the homepage "Explore categories" section. */
export const CATEGORIES = [
  { name: 'Vehicle', listings: '20+' },
  { name: 'Clothes', listings: '19' },
  { name: 'Event Hall', listings: '20+' },
  { name: 'Cameras', listings: '20+' },
  { name: 'Tools', listings: '15+' },
  { name: 'Generator', listings: '12+' },
  { name: 'Furniture', listings: '10+' },
  { name: 'Electronics', listings: '20+' },
];

export const SERVICE_AREAS = ['Lagos (Lekki, Ikeja, Lagos Island, Victoria Island)', 'Abuja', 'Port Harcourt'];

export const FAQS = [
  {
    question: 'What is Rendoz?',
    answer:
      'Rendoz is a peer-to-peer rental marketplace that makes it easier to discover, compare, book, and rent items for a specific period — and to list assets you own to earn income.',
  },
  {
    question: 'What can I rent on Rendoz?',
    answer:
      'Cameras, vehicles, generators, tools, fashion, event gear, furniture, electronics, and more from verified owners near you.',
  },
  {
    question: 'Who can list an asset?',
    answer:
      'Anyone with an item they own can list after completing identity verification. Businesses can manage multiple listings from one account.',
  },
  {
    question: 'How does payment work?',
    answer:
      'The renter pays on Rendoz. Funds are held until the rental is completed, then the owner payout is released according to platform terms.',
  },
  {
    question: 'Is a security deposit required?',
    answer:
      "A deposit may be required depending on the asset and the owner's terms. If the item is returned as agreed, the deposit is released.",
  },
  {
    question: 'How do owners get verified?',
    answer:
      'Owners verify their email and phone, submit their NIN, and add payout details. Listing unlocks once the owner profile is complete.',
  },
];

/** Pages the assistant can link to. Keys are what the model passes to the tool. */
export const SITE_PAGES = {
  sign_up: { path: '/signup', label: 'Create an account' },
  sign_up_as_owner: { path: '/signup?role=owner', label: 'Sign up to list items' },
  sign_in: { path: '/signin', label: 'Sign in' },
  reset_password: { path: '/forgot-password', label: 'Reset your password' },
  owner_dashboard: { path: '/dashboard', label: 'Owner dashboard' },
  owner_profile: { path: '/dashboard/profile', label: 'Complete your owner profile' },
  create_listing: { path: '/dashboard/listings/new', label: 'Create a listing' },
  faq: { path: '/#faq', label: 'FAQ' },
  how_it_works: { path: '/#how-it-works', label: 'How Rendoz works' },
} as const;

export type SitePageKey = keyof typeof SITE_PAGES;

export function searchListings(filters: {
  query?: string;
  category?: string;
  location?: string;
  maxPricePerDay?: number;
}): CatalogListing[] {
  const words = (filters.query ?? '').toLowerCase().split(/\s+/).filter(Boolean);
  return SAMPLE_LISTINGS.filter((listing) => {
    const haystack = `${listing.title} ${listing.category} ${listing.location}`.toLowerCase();
    if (words.length && !words.some((w) => haystack.includes(w))) return false;
    if (filters.category && !listing.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
    if (filters.location && !listing.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.maxPricePerDay !== undefined && listing.pricePerDay > filters.maxPricePerDay) return false;
    return true;
  });
}
