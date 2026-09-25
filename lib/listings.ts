/**
 * Listings: shared types plus the server-side mapping to the `listings` table.
 *
 * Lifecycle (matches the table's status check):
 *   draft → pending_review (admin vets it) → active | rejected
 * Accounts in LISTING_AUTO_APPROVE_EMAILS skip review and go straight to active.
 */

export type ListingStatus = "draft" | "pending_review" | "active" | "rejected";

export interface ListingPricing {
  hourly: number | null;
  daily: number | null;
  weekly: number | null;
  securityDeposit: number | null;
}

export interface ListingDetails {
  brand: string;
  model: string;
  condition: string;
  size: string;
  quantity: number | null;
}

/** What the API returns to the app. */
export interface Listing {
  id: string;
  title: string;
  category: string;
  subcategory: string;
  description: string;
  status: ListingStatus;
  rejectionReason: string | null;
  photos: string[];
  pricing: ListingPricing;
  details: ListingDetails;
  unavailableDates: string[];
  location: string;
  createdAt: string;
  updatedAt: string;
}

export const LISTING_PHOTO_BUCKET = "listing-photos";
export const MIN_LISTING_PHOTOS = 3;
export const MAX_LISTING_PHOTOS = 5;

/** Seeded test accounts; override with a comma-separated LISTING_AUTO_APPROVE_EMAILS. */
const DEFAULT_AUTO_APPROVE = ["owner.test@rendoz.dev", "renter.test@rendoz.dev"];

export function isAutoApproved(email: string): boolean {
  const configured = process.env.LISTING_AUTO_APPROVE_EMAILS;
  const list = configured !== undefined ? configured.split(",") : DEFAULT_AUTO_APPROVE;
  return list.map((e) => e.trim().toLowerCase()).filter(Boolean).includes(email.toLowerCase());
}

/** Raw row shape of the columns Rendoz uses in `listings`. */
export interface DbListing {
  id: string;
  host_id: string;
  vertical: string;
  sub_vertical: string[] | null;
  booking_type: string;
  status: ListingStatus;
  title: string;
  description: string;
  location: { label?: string } | null;
  pricing: Partial<ListingPricing> | null;
  features: (Partial<ListingDetails> & { unavailable_dates?: string[] }) | null;
  rejection_reason: string | null;
  media: string[] | null;
  created_at: string;
  updated_at: string;
}

export const LISTING_COLUMNS =
  "id, host_id, vertical, sub_vertical, booking_type, status, title, description, location, pricing, features, rejection_reason, media, created_at, updated_at";

export function toListing(row: DbListing): Listing {
  const features = row.features ?? {};
  return {
    id: row.id,
    title: row.title,
    category: row.vertical,
    subcategory: row.sub_vertical?.[0] ?? "",
    description: row.description,
    status: row.status,
    rejectionReason: row.rejection_reason,
    photos: row.media ?? [],
    pricing: {
      hourly: row.pricing?.hourly ?? null,
      daily: row.pricing?.daily ?? null,
      weekly: row.pricing?.weekly ?? null,
      securityDeposit: row.pricing?.securityDeposit ?? null,
    },
    details: {
      brand: features.brand ?? "",
      model: features.model ?? "",
      condition: features.condition ?? "",
      size: features.size ?? "",
      quantity: features.quantity ?? null,
    },
    unavailableDates: features.unavailable_dates ?? [],
    location: row.location?.label ?? "",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
