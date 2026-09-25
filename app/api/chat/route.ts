import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { CHAT_TOOLS, runChatTool } from "@/lib/chat-tools";
import { localReply } from "@/lib/chat-local";
import { checkRateLimit } from "@/lib/db";

// ── Config ───────────────────────────────────────────────────────────────────

const MODEL = "claude-opus-5";
const MAX_TOOL_ROUNDS = 5;
const MESSAGES_PER_HOUR = 40;

const SYSTEM_PROMPT = `You are Rendoz Assistant, the help chat on the Rendoz homepage. Rendoz is a peer-to-peer rental marketplace in Nigeria: renters book items (cameras, vehicles, generators, tools, event gear, furniture, electronics, fashion) for a set period, and owners list items they own to earn money. Launch market is Lagos, with Abuja and Port Harcourt listed as service areas.

How to help:
- Use your tools for facts. Search listings before naming items or prices, read the help articles before answering policy or payment questions, and check the user's account before advising on their own sign-up, verification or listing status.
- When the user should go somewhere (sign up, sign in, finish their profile, create a listing), get the link with get_page_link and include it.
- Prices are in naira (₦) per day. Listings come from a small sample catalogue while the marketplace launches, so say so if the user expects a wider selection.
- If something isn't covered by your tools, say you don't know and point them to the FAQ rather than guessing. Never invent listings, prices, fees or policies.
- You can't make bookings, payments or account changes yourself; explain the steps and link to the page instead.

Style: friendly and brief — two to five short sentences or a short list. Plain language, no jargon. Use markdown links for pages.`;

const ChatRequest = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .min(1)
    .max(100)
    .refine((m) => m[m.length - 1].role === "user", {
      message: "The last message must be from the user.",
    }),
});

/** Keeps the recent part of a long chat, starting on a user turn as the API requires. */
function recentHistory<T extends { role: "user" | "assistant" }>(messages: T[], limit = 30): T[] {
  const recent = messages.slice(-limit);
  const firstUser = recent.findIndex((m) => m.role === "user");
  return recent.slice(firstUser);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "local";
}

async function withinRateLimit(req: NextRequest): Promise<boolean> {
  try {
    return await checkRateLimit(`chat:${clientIp(req)}`, MESSAGES_PER_HOUR, 60);
  } catch (err) {
    // Redis not configured: allow locally, refuse in production so the model can't be run up unmetered
    console.error("[chat] Rate limit unavailable:", err);
    return process.env.NODE_ENV !== "production";
  }
}

let client: Anthropic | null = null;
function getClient(): Anthropic {
  client ??= new Anthropic();
  return client;
}

// ── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const parsed = ChatRequest.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 422 });
  }

  const history = recentHistory(parsed.data.messages);
  const latest = history[history.length - 1].content;
  const builtIn = async () => NextResponse.json({ reply: await localReply(latest) });

  // No Claude key configured: answer with the built-in replies
  if (!process.env.ANTHROPIC_API_KEY) return builtIn();

  // The limit caps Claude spend; past it (or with no Redis), fall back to the free built-in replies
  if (!(await withinRateLimit(req))) return builtIn();

  const messages: Anthropic.Beta.BetaMessageParam[] = history.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  try {
    for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
      const response = await getClient().beta.messages.create({
        model: MODEL,
        max_tokens: 16000,
        betas: ["server-side-fallback-2026-07-01"],
        // On a safety-classifier decline, the API re-runs the request on Anthropic's recommended fallback model
        fallbacks: "default",
        output_config: { effort: "low" },
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        tools: CHAT_TOOLS,
        messages,
      });

      if (response.stop_reason === "refusal") {
        return NextResponse.json({
          reply: "Sorry, I can't help with that. I can help you find items to rent or answer questions about Rendoz.",
        });
      }

      const toolUses = response.content.filter(
        (b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use",
      );

      if (response.stop_reason !== "tool_use" || toolUses.length === 0 || round === MAX_TOOL_ROUNDS) {
        const reply = response.content
          .filter((b): b is Anthropic.Beta.BetaTextBlock => b.type === "text")
          .map((b) => b.text)
          .join("\n")
          .trim();
        return NextResponse.json({
          reply: reply || "Sorry, I couldn't put an answer together. Could you rephrase that?",
        });
      }

      // Run every requested tool and return all results in one user message
      messages.push({ role: "assistant", content: response.content });
      const results = await Promise.all(
        toolUses.map(async (tool): Promise<Anthropic.Beta.BetaToolResultBlockParam> => {
          try {
            return { type: "tool_result", tool_use_id: tool.id, content: await runChatTool(tool.name, tool.input) };
          } catch (err) {
            const message = err instanceof z.ZodError ? "Invalid tool input." : "The tool failed to run.";
            console.error(`[chat] Tool ${tool.name} failed:`, err);
            return { type: "tool_result", tool_use_id: tool.id, content: message, is_error: true };
          }
        }),
      );
      messages.push({ role: "user", content: results });
    }
  } catch (err) {
    // Log why Claude failed, then still answer with the built-in replies
    if (err instanceof Anthropic.RateLimitError) {
      console.error("[chat] Anthropic rate limit hit; using built-in replies.");
    } else if (err instanceof Anthropic.AuthenticationError) {
      console.error("[chat] Anthropic authentication failed; check ANTHROPIC_API_KEY.");
    } else if (err instanceof Anthropic.APIError) {
      console.error(`[chat] Anthropic API error ${err.status}:`, err.message);
    } else {
      console.error("[chat] Unexpected error:", err);
    }
    return builtIn();
  }

  return builtIn();
}
