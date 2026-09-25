import { NextRequest, NextResponse } from "next/server";
import { getPublicListings } from "@/lib/public-listings";

/** Live listings for anyone browsing Rendoz. Optional ?q=, ?category=, ?location=, ?max_price=, ?limit= */
export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const maxPrice = Number(params.get("max_price"));
  const limit = Number(params.get("limit"));

  const listings = await getPublicListings({
    query: params.get("q")?.slice(0, 100) || undefined,
    category: params.get("category")?.slice(0, 60) || undefined,
    location: params.get("location")?.slice(0, 60) || undefined,
    maxPricePerDay: Number.isFinite(maxPrice) && maxPrice > 0 ? maxPrice : undefined,
    limit: Number.isInteger(limit) && limit > 0 ? Math.min(limit, 48) : 24,
  });

  return NextResponse.json({ listings });
}
