-- ============================================================
-- Let the existing listings table hold Rendoz rental listings
-- ============================================================
-- Run once in the Supabase SQL editor.
--
-- The listings table came from an earlier event-venue app. Its check
-- constraints only allow that app's values (vertical = 'venue', ...), so
-- Rendoz categories such as 'Cameras & Photo' are rejected. This replaces
-- the vertical and booking_type checks with ones that fit Rendoz.
--
-- The status check is left alone: its values (draft, pending_review,
-- active, rejected) are exactly the listing lifecycle Rendoz uses.
-- ============================================================

BEGIN;

ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_vertical_check;
ALTER TABLE public.listings DROP CONSTRAINT IF EXISTS listings_booking_type_check;

-- Rendoz: vertical is the category name chosen in the listing wizard
ALTER TABLE public.listings
  ADD CONSTRAINT listings_vertical_check CHECK (char_length(vertical) BETWEEN 2 AND 60);

-- Rendoz: rentals are priced per hour or per day; keep the old value valid for existing rows
ALTER TABLE public.listings
  ADD CONSTRAINT listings_booking_type_check CHECK (booking_type IN ('daily', 'hourly', 'exclusive'));

CREATE INDEX IF NOT EXISTS idx_listings_host_status ON public.listings (host_id, status);

COMMIT;
