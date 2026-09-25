/**
 * Built-in replies for the homepage assistant.
 *
 * Used when no ANTHROPIC_API_KEY is configured, or when the Claude API is
 * unavailable, so the chat always answers greetings, common Rendoz questions
 * and "where do I…" requests with a link.
 */
import { CATEGORIES, FAQS, SERVICE_AREAS, SITE_PAGES, type SitePageKey } from "@/lib/catalog";
import { searchAllListings, type ListingSearchResult } from "@/lib/public-listings";
import { runChatTool } from "@/lib/chat-tools";

const naira = new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 });

const link = (page: SitePageKey) => `[${SITE_PAGES[page].label}](${SITE_PAGES[page].path})`;
const faq = (question: string) => FAQS.find((f) => f.question === question)?.answer ?? "";

/** True if any of the patterns matches the message. */
const has = (text: string, ...patterns: RegExp[]) => patterns.some((p) => p.test(text));

// Words that point at an item someone wants to rent, mapped to search words (any one may match)
const ITEM_WORDS: [RegExp, string][] = [
  [/\bcamera|photograph|canon|dslr\b/, "camera photo canon"],
  [/\bcar|vehicle|bmw|drive\b/, "car vehicle bmw"],
  [/\bgenerator|power|electricity|light\b/, "generator power"],
  [/\btool|drill|equipment\b/, "tool drill equipment"],
  [/\btent|canopy|party|event|wedding\b/, "tent canopy event"],
];

const listingLine = (l: ListingSearchResult) =>
  `- **${l.title}** — ${l.pricePerDay ? `${naira.format(l.pricePerDay)}/day` : "price on request"}` +
  `${l.location ? ` in ${l.location}` : ""}${l.rating ? ` (★ ${l.rating})` : ""}${l.live ? " · available now" : ""}`;

async function accountReply(): Promise<string> {
  const account = JSON.parse(await runChatTool("get_my_account", {})) as {
    signed_in: boolean;
    first_name?: string;
    next_step?: string;
    roles?: string[];
  };
  if (!account.signed_in) {
    return `You're not signed in right now. ${link("sign_in")} to check your account, or ${link("sign_up")} if you're new.`;
  }
  const isOwner = account.roles?.includes("owner");
  return [
    `You're signed in, ${account.first_name}. Your next step: **${account.next_step}**.`,
    isOwner ? `Head to your ${link("owner_dashboard")} to manage everything.` : `Want to earn from your items? ${link("sign_up_as_owner")}.`,
  ].join("\n");
}

async function listingsReply(text: string): Promise<string | null> {
  const keyword = ITEM_WORDS.find(([pattern]) => pattern.test(text))?.[1];
  const maxPrice = /(?:under|below|less than|max(?:imum)?|budget(?: of)?)\s*₦?\s*([\d,]+)\s*(k)?/.exec(text);
  const location = ["lekki", "ikeja", "victoria island", "lagos island", "yaba"].find((l) => text.includes(l));
  const wantsToRent = has(text, /\b(rent|find|looking for|need|hire|borrow|search|available|show me|any)\b/);
  const asksForItem = has(text, /\b(do you have|have you got|got any|is there an?y?|can i (get|rent))\b/);
  if (!keyword && !asksForItem && !(wantsToRent && (maxPrice || location))) return null;

  const priceLimit = maxPrice ? Number(maxPrice[1].replace(/,/g, "")) * (maxPrice[2] ? 1000 : 1) : undefined;
  // "Do you have boats?" names an item we don't carry: nothing to filter on, so no matches
  const results =
    keyword || priceLimit !== undefined || location
      ? await searchAllListings({ query: keyword, location, maxPricePerDay: priceLimit })
      : [];

  if (results.length === 0) {
    return `I couldn't find a match in our current listings. Here's what people rent most: ${CATEGORIES.slice(0, 5)
      .map((c) => c.name)
      .join(", ")}. New items are added as owners join. Want to ${link("sign_up")} to be first to know?`;
  }
  return [`Here's what I found:`, ...results.map(listingLine), `${link("sign_up")} or ${link("sign_in")} to book.`].join("\n");
}

/** Returns a reply for the latest user message. */
export async function localReply(message: string): Promise<string> {
  const normalized = message.toLowerCase().replace(/[’']/g, "'").trim();
  const GREETING = /^(hi|hello|hey|hiya|howdy|good (morning|afternoon|evening)|greetings|yo|sup)\b[\s,!.]*(there|rendoz)?[\s,!.]*/;
  // "hi, can I rent a camera?" answers the question; a bare "hello" gets a greeting
  const text = normalized.replace(GREETING, "").trim() || normalized;

  // ── Small talk ──
  if (text === normalized && GREETING.test(normalized)) {
    const hour = new Date().getHours();
    const time = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
    return `${time}! 👋 Welcome to Rendoz. I can help you find something to rent, explain how listing works, or point you to the right page. What are you looking for today?`;
  }
  if (has(text, /\bhow are you|how's it going|how you dey\b/)) {
    return "I'm doing great, thanks for asking! How can I help you with renting or listing today?";
  }
  if (has(text, /\b(thank|thanks|thx|appreciate)\b/)) {
    return "You're welcome! Anything else I can help with?";
  }
  if (has(text, /\b(bye|goodbye|see you|later|good night)\b/)) {
    return "Bye for now! Come back any time you need something to rent. 👋";
  }
  if (has(text, /\b(who are you|what are you|are you (a )?(bot|human|real))\b/)) {
    return "I'm the Rendoz assistant — a virtual helper. I can answer questions about Rendoz, find items to rent, and link you to the right page.";
  }

  // ── Account ──
  if (has(text, /\b(my account|my profile|my status|am i (verified|signed in|logged in)|what should i do next|next step)\b/)) {
    return accountReply();
  }

  // ── Directions / links ──
  if (has(text, /\b(forgot|reset|change)\b.*\bpassword\b|\bpassword\b.*\b(forgot|reset)\b/)) {
    return `No problem — you can ${link("reset_password")}. We'll email you a 6-digit code.`;
  }
  if (has(text, /\b(sign ?in|log ?in|login)\b/)) {
    return `Here you go: ${link("sign_in")}. Forgot your password? ${link("reset_password")}.`;
  }
  if (has(text, /\bwho can list\b/)) return faq("Who can list an asset?");
  if (has(text, /\b(list|lend|rent out|earn|make money|become (an )?owner|sell)\b/)) {
    return [
      "Listing on Rendoz is simple:",
      "- Create an owner account",
      "- Complete your profile: phone, location, photo, NIN and payout details",
      "- Add photos, set your daily price and availability, then publish",
      `Start here: ${link("sign_up_as_owner")}. Already an owner? ${link("create_listing")}.`,
    ].join("\n");
  }
  if (has(text, /\b(sign ?up|register|create (an )?account|join|get started|open (an )?account)\b/)) {
    return `You can ${link("sign_up")} in a couple of minutes — just your name, email, phone and a password. Want to list items too? ${link("sign_up_as_owner")}.`;
  }
  if (has(text, /\bdashboard\b/)) return `Here's your ${link("owner_dashboard")}.`;

  // ── Rendoz questions ──
  if (has(text, /\b(verif|nin|identity|trust|safe|scam)\w*/)) {
    return `${faq("How do owners get verified?")} Every owner is verified before they can list. ${link("owner_profile")}.`;
  }
  if (has(text, /\b(pay|payment|paid|payout|money|card|transfer)\w*/)) {
    return `${faq("How does payment work?")} Read more in the ${link("faq")}.`;
  }
  if (has(text, /\b(deposit|damage|broken|refund)\w*/)) return faq("Is a security deposit required?");
  if (has(text, /\b(fee|commission|charge|cost)\b/) && !has(text, /\b(camera|car|generator|tool|tent)\b/)) {
    return `Renters pay the rental fee plus any applicable Rendoz fee, security deposit and delivery fee. Owners set their own prices. See the ${link("faq")} for details.`;
  }
  if (has(text, /\b(where|location|city|cities|available in|lagos|abuja|port harcourt|near me)\b/) && !has(text, /\b(rent|find|camera|car|generator|tool|tent)\b/)) {
    return `Rendoz is launching in ${SERVICE_AREAS.join(", ")}.`;
  }
  if (has(text, /\bhow (does|do) (it|rendoz|renting|this) work|how to rent|how do i rent|how can i rent\b/)) {
    return [
      "Renting on Rendoz works like this:",
      "- Find an item and pick your dates",
      "- Pay securely on Rendoz (the owner is paid after the rental)",
      "- Pick it up, use it, and return it",
      `More in ${link("how_it_works")}.`,
    ].join("\n");
  }
  if (has(text, /\b(categor|what can i rent|what (do|can) you (have|rent)|items|things to rent)\w*/)) {
    return `You can rent: ${CATEGORIES.map((c) => c.name).join(", ")}. Tell me what you need and I'll look for it!`;
  }
  if (has(text, /\b(what is|what's|tell me about|about) rendoz\b|^rendoz\??$/)) {
    return `${faq("What is Rendoz?")} Own it? Rent it out. Need it? Rent it.`;
  }

  // ── Newcomer walkthrough ──
  if (
    has(
      text,
      /\b(walk me through|walkthrough|walk through|guide me|show me around|tour|new here|first time|new to (this|rendoz)|i (don'?t|do not) (know|understand)|confus\w*|lost|how (do i|to|does one) use|explain (this|the|how)|what (is|'s) this (site|website|app|platform|place))\b/,
    )
  ) {
    return WALKTHROUGH;
  }

  // ── Items to rent ──
  if (has(text, /^(more|show( me)? more|see more|what else|anything else|show (me )?(all|everything)|all listings)\b/)) {
    const lines = (await searchAllListings({})).map(listingLine);
    return [
      "Here's everything listed right now:",
      ...lines,
      `More items are added as owners join. Tell me what you need, or ${link("sign_up")} to book.`,
    ].join("\n");
  }
  const listings = await listingsReply(text);
  if (listings) return listings;

  if (has(text, /\b(help|support|contact|human|agent)\b/)) {
    return `I can help with finding items, signing up, listing, payments and verification. For anything else, check the ${link("faq")}.`;
  }

  // ── Fallback ──
  return [
    "Sorry, I didn't quite catch that. New to Rendoz? Just say **\"walk me through\"** for a quick tour. You can also ask things like:",
    "- \"Find a generator in Lekki\"",
    "- \"How does payment work?\"",
    "- \"How do I list my camera?\"",
    `Or browse the ${link("faq")}.`,
  ].join("\n");
}

const WALKTHROUGH = [
  "Happy to walk you through! 👋 **Rendoz** is a rental marketplace in Nigeria: rent things you need for a few days, or earn money renting out things you own.",
  "**If you want to rent something:**",
  "- Tell me what you need (e.g. \"find a camera in Lekki\") or browse the categories on the homepage",
  "- Pick your dates and pay securely on Rendoz; the owner is paid after the rental",
  "- Pick it up, use it, and return it. Any security deposit is released when it's returned as agreed",
  "**If you want to earn:**",
  "- Sign up as an owner and verify your identity (phone, NIN, payout details)",
  "- Add photos, set a daily price and your available dates, then publish",
  `Where would you like to start? ${link("sign_up")} · ${link("sign_up_as_owner")} · ${link("how_it_works")}`,
].join("\n");
