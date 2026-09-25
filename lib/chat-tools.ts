import type Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import {
  CATEGORIES,
  FAQS,
  SERVICE_AREAS,
  SITE_PAGES,
  searchListings,
  type SitePageKey,
} from "@/lib/catalog";
import { getAccessTokenFromCookies } from "@/lib/auth-helpers";
import { verifyAccessToken } from "@/lib/jwt";
import { getSupabase, type DbUser } from "@/lib/supabase";

// ── Tool definitions (what Claude sees) ──────────────────────────────────────

const PAGE_KEYS = Object.keys(SITE_PAGES) as [SitePageKey, ...SitePageKey[]];

export const CHAT_TOOLS: Anthropic.Beta.BetaTool[] = [
  {
    name: "search_listings",
    description:
      "Search items available to rent on Rendoz. Use when the user wants to find, compare or price something to rent. All filters are optional; combine them to narrow results. Prices are in naira per day.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Free-text keywords, e.g. 'camera' or 'generator'" },
        category: { type: "string", description: "Category name from list_categories, e.g. 'Cameras'" },
        location: { type: "string", description: "Area or city, e.g. 'Lekki'" },
        max_price_per_day: { type: "number", description: "Maximum daily price in naira" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "list_categories",
    description: "List the rental categories on Rendoz with approximate listing counts, plus the cities Rendoz serves.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_help_articles",
    description:
      "Get Rendoz's official help answers: what Rendoz is, what can be rented, who can list, payments, security deposits and owner verification. Use this before answering any policy or how-it-works question.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_my_account",
    description:
      "Get the signed-in user's account status: name, roles (renter/owner), email verification, owner profile completion, and what they should do next. Returns signed_in=false for visitors.",
    input_schema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_page_link",
    description:
      "Get the link to a Rendoz page so the user can act on it (sign up, sign in, list an item, finish their profile, etc.). Include the returned markdown link in your reply.",
    input_schema: {
      type: "object",
      properties: { page: { type: "string", enum: PAGE_KEYS } },
      required: ["page"],
      additionalProperties: false,
    },
  },
];

// ── Input validation ─────────────────────────────────────────────────────────

const SearchInput = z.object({
  query: z.string().max(100).optional(),
  category: z.string().max(60).optional(),
  location: z.string().max(60).optional(),
  max_price_per_day: z.number().nonnegative().optional(),
});
const EmptyInput = z.object({}).strict();
const PageInput = z.object({ page: z.enum(PAGE_KEYS) });

// ── Executors ────────────────────────────────────────────────────────────────

const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

async function getMyAccount() {
  const token = await getAccessTokenFromCookies();
  const payload = token ? await verifyAccessToken(token) : null;
  if (!payload) return { signed_in: false };

  const { data } = await getSupabase()
    .from("users")
    .select("full_name, role, is_email_verified, verification_status, profile_completed")
    .eq("id", payload.sub)
    .eq("is_active", true)
    .maybeSingle();
  if (!data) return { signed_in: false };

  const user = data as Pick<DbUser, "full_name" | "role" | "is_email_verified" | "verification_status" | "profile_completed">;
  const isOwner = user.role.includes("owner");
  const nextStep = !user.is_email_verified
    ? "Verify email address"
    : !isOwner
      ? "Browse and rent items, or sign up to list items to earn"
      : !user.profile_completed
        ? "Complete owner profile (phone, location, photo, NIN, payout) to unlock listing"
        : "Create or manage listings from the owner dashboard";

  return {
    signed_in: true,
    first_name: user.full_name.split(" ")[0],
    roles: user.role,
    email_verified: user.is_email_verified,
    identity_verification: user.verification_status,
    owner_profile_complete: isOwner ? user.profile_completed : null,
    next_step: nextStep,
  };
}

/** Runs one tool call. Returns the JSON string for the tool_result, or throws on bad input. */
export async function runChatTool(name: string, input: unknown): Promise<string> {
  switch (name) {
    case "search_listings": {
      const args = SearchInput.parse(input);
      const results = searchListings({
        query: args.query,
        category: args.category,
        location: args.location,
        maxPricePerDay: args.max_price_per_day,
      });
      return JSON.stringify({
        note: "Sample listings shown on the homepage; the full catalogue is coming soon.",
        count: results.length,
        results: results.map((l) => ({ ...l, price: `${naira.format(l.pricePerDay)}/day` })),
      });
    }
    case "list_categories":
      EmptyInput.parse(input ?? {});
      return JSON.stringify({ categories: CATEGORIES, service_areas: SERVICE_AREAS });
    case "get_help_articles":
      EmptyInput.parse(input ?? {});
      return JSON.stringify({ articles: FAQS });
    case "get_my_account":
      EmptyInput.parse(input ?? {});
      return JSON.stringify(await getMyAccount());
    case "get_page_link": {
      const { page } = PageInput.parse(input);
      const target = SITE_PAGES[page];
      return JSON.stringify({ markdown: `[${target.label}](${target.path})` });
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}
