import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase } from "@/lib/supabase";
import { getSessionUser } from "@/lib/session";
import {
  LISTING_COLUMNS,
  LISTING_PHOTO_BUCKET,
  MAX_LISTING_PHOTOS,
  MIN_LISTING_PHOTOS,
  isAutoApproved,
  toListing,
  type DbListing,
  type ListingStatus,
} from "@/lib/listings";

// ── Validation ───────────────────────────────────────────────────────────────

const money = z.number().int().nonnegative().max(100_000_000).nullable();

const ListingInput = z.object({
  /** "draft" saves progress; "submit" sends it for review (or publishes, for auto-approved accounts) */
  action: z.enum(["draft", "submit"]),
  title: z.string().trim().min(3, "Give your listing a name of at least 3 characters.").max(120),
  category: z.string().trim().min(2, "Choose a category.").max(60),
  subcategory: z.string().trim().max(60).default(""),
  description: z.string().trim().max(4000).default(""),
  details: z
    .object({
      brand: z.string().trim().max(60).default(""),
      model: z.string().trim().max(60).default(""),
      condition: z.string().trim().max(20).default(""),
      size: z.string().trim().max(20).default(""),
      quantity: z.number().int().positive().max(10_000).nullable().default(null),
    })
    .default({ brand: "", model: "", condition: "", size: "", quantity: null }),
  photos: z.array(z.string().url()).max(MAX_LISTING_PHOTOS).default([]),
  pricing: z
    .object({ hourly: money, daily: money, weekly: money, securityDeposit: money })
    .default({ hourly: null, daily: null, weekly: null, securityDeposit: null }),
  unavailableDates: z.array(z.string().regex(/^\d{4}-\d{2}-\d{2}$/)).max(366).default([]),
});

/** Extra rules a listing must meet before it can be submitted (drafts can be incomplete). */
function submitProblem(input: z.infer<typeof ListingInput>): string | null {
  if (input.description.length < 40) return "The description needs at least 40 characters.";
  if (!input.details.condition) return "Choose the item's condition.";
  if (input.photos.length < MIN_LISTING_PHOTOS) return `Add at least ${MIN_LISTING_PHOTOS} photos.`;
  if (!input.pricing.daily || input.pricing.daily <= 0) return "Set a daily price.";
  return null;
}

// ── Handlers ─────────────────────────────────────────────────────────────────

/** The signed-in owner's listings, newest first. */
export async function GET() {
  try {
    const session = await getSessionUser();
    if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });

    const { data, error } = await getSupabase()
      .from("listings")
      .select(LISTING_COLUMNS)
      .eq("host_id", session.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[listings] List error:", error);
      return NextResponse.json({ error: "Couldn't load your listings. Please try again." }, { status: 500 });
    }
    return NextResponse.json({ listings: (data as unknown as DbListing[]).map(toListing) });
  } catch (err) {
    console.error("[listings] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session.ok) return NextResponse.json({ error: session.error }, { status: session.status });
    const user = session.user;

    if (!user.role.includes("owner")) {
      return NextResponse.json({ error: "Switch to an owner account to list items." }, { status: 403 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
    }
    const parsed = ListingInput.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });
    }
    const input = parsed.data;

    // Photos must be ones this owner uploaded through /api/listings/photos
    const ownPhotoPrefix = getSupabase()
      .storage.from(LISTING_PHOTO_BUCKET)
      .getPublicUrl(`${user.id}/`).data.publicUrl;
    if (input.photos.some((url) => !url.startsWith(ownPhotoPrefix))) {
      return NextResponse.json({ error: "One of the photos wasn't uploaded from your account." }, { status: 422 });
    }

    let status: ListingStatus = "draft";
    if (input.action === "submit") {
      const problem = submitProblem(input);
      if (problem) return NextResponse.json({ error: problem }, { status: 422 });
      const autoApproved = isAutoApproved(user.email);
      if (!user.profile_completed && !autoApproved) {
        return NextResponse.json(
          { error: "Complete your owner profile before submitting a listing." },
          { status: 403 },
        );
      }
      // Normally an admin vets new listings; test accounts are published straight away
      status = autoApproved ? "active" : "pending_review";
    }

    const { data, error } = await getSupabase()
      .from("listings")
      .insert({
        host_id: user.id,
        vertical: input.category,
        sub_vertical: input.subcategory ? [input.subcategory] : [],
        booking_type: input.pricing.hourly ? "hourly" : "daily",
        status,
        title: input.title,
        description: input.description,
        location: { label: user.location ?? "" },
        pricing: input.pricing,
        features: { ...input.details, unavailable_dates: input.unavailableDates },
        media: input.photos,
      })
      .select(LISTING_COLUMNS)
      .single();

    if (error || !data) {
      console.error("[listings] Create error:", error);
      // 23514 = check_violation: the table still has the old app's constraints
      const message =
        error?.code === "23514"
          ? "Listings can't be saved until the database update in supabase/listings-for-rendoz.sql is applied."
          : "Couldn't save your listing. Please try again.";
      return NextResponse.json({ error: message }, { status: 500 });
    }

    return NextResponse.json({ listing: toListing(data as unknown as DbListing) }, { status: 201 });
  } catch (err) {
    console.error("[listings] Unexpected error:", err);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again." }, { status: 500 });
  }
}
