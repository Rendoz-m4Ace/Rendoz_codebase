/**
 * Owner bookings.
 *
 * There is no bookings table or API yet, so every owner has no bookings.
 * When the bookings API exists, fetch from it in getOwnerBookings; the
 * dashboard renders whatever this returns (and empty states when it's empty).
 */

export type BookingStatus = 'requested' | 'upcoming' | 'active' | 'completed' | 'cancelled';

export interface Booking {
  id: string;
  reference: string;
  listingTitle: string;
  category: string;
  renterName: string;
  renterVerified: boolean;
  status: BookingStatus;
  /** ISO dates */
  startDate: string;
  endDate: string;
  totalAmount: number;
  ownerPayout: number;
  cancelledAt?: string;
  cancellationNote?: string;
}

/** The signed-in owner's bookings. The future API identifies the owner from the session cookie. */
export async function getOwnerBookings(): Promise<Booking[]> {
  return [];
}
