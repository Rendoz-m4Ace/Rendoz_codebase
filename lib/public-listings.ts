/**
 * Live (admin-approved) listings that anyone can browse: the homepage and the chat assistant.
 * Server-only: reads with the service-role client and returns only public fields.
 */
import { getSupabase } from "@/lib/supabase";
import { LISTING_COLUMNS, toListing, type DbListing } from "@/lib/listings";
import { searchListings as searchSampleListings } from "@/lib/catalog";

export interface PublicListing {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  photos: string[];
  pricePerDay: number | null;
  location: string;
}

export interface PublicListingFilters {
  query?: string;
  category?: string;
  location?: string;
  maxPricePerDay?: number;
  limit?: number;
}

export async function getPublicListings(filters: PublicListingFilters = {}): Promise<PublicListing[]> {
  const { data, error } = await getSupabase()
    .from("listings")
    .select(LISTING_COLUMNS)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("[public-listings] Query error:", error);
    return [];
  }

  // Filtering happens here: the catalogue is small, and it keeps matching consistent with the chat
  const words = (filters.query ?? "").toLowerCase().split(/\s+/).filter(Boolean);
  return (data as unknown as DbListing[])
    .map(toListing)
    .map((l) => ({
      id: l.id,
      title: l.title,
      category: l.category,
      subcategory: l.subcategory,
      description: l.description,
      photos: l.photos,
      pricePerDay: l.pricing.daily,
      location: l.location,
    }))
    .filter((l) => {
      const haystack = `${l.title} ${l.category} ${l.subcategory} ${l.description} ${l.location}`.toLowerCase();
      if (words.length && !words.some((w) => haystack.includes(w))) return false;
      if (filters.category && !`${l.category} ${l.subcategory}`.toLowerCase().includes(filters.category.toLowerCase())) return false;
      if (filters.location && !l.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
      if (filters.maxPricePerDay !== undefined && (l.pricePerDay ?? Infinity) > filters.maxPricePerDay) return false;
      return true;
    })
    .slice(0, filters.limit ?? 24);
}

/** One search result for the chat assistant: real live listings first, then the homepage samples. */
export interface ListingSearchResult {
  title: string;
  category: string;
  pricePerDay: number | null;
  location: string;
  rating: number | null;
  /** true for a real listing from an owner, false for a homepage sample */
  live: boolean;
}

export async function searchAllListings(filters: PublicListingFilters): Promise<ListingSearchResult[]> {
  const live = await getPublicListings(filters);
  const samples = searchSampleListings(filters);
  return [
    ...live.map((l) => ({ title: l.title, category: l.category, pricePerDay: l.pricePerDay, location: l.location, rating: null, live: true })),
    ...samples.map((l) => ({ title: l.title, category: l.category, pricePerDay: l.pricePerDay, location: l.location, rating: l.rating, live: false })),
  ];
}
