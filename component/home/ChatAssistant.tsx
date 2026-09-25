'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Loader2, MessageCircle, Send, Sparkles, X } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTIONS = [
  'Find a camera to rent in Lagos',
  'How do I list my generator?',
  'How does payment work?',
  'What should I do next on my account?',
];

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm the Rendoz assistant. I can help you find something to rent, explain how renting and listing work, or check what to do next on your account.",
};

/* Minimal markdown: [links](/path), **bold**, and "- " bullet lines. */
function renderInline(text: string) {
  const parts = text.split(/(\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(part);
    if (link) {
      const [, label, href] = link;
      // Only follow site-relative links; anything else is shown as text
      return href.startsWith('/') ? (
        <Link key={i} href={href} className="font-semibold text-orange-600 underline underline-offset-2">
          {label}
        </Link>
      ) : (
        <Fragment key={i}>{label}</Fragment>
      );
    }
    const bold = /^\*\*([^*]+)\*\*$/.exec(part);
    if (bold) return <strong key={i}>{bold[1]}</strong>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}

function MessageText({ text }: { text: string }) {
  const lines = text.split('\n').filter((line) => line.trim() !== '');
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = () => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="list-disc pl-5 space-y-0.5">
        {bullets.map((b, i) => (
          <li key={i}>{renderInline(b)}</li>
        ))}
      </ul>,
    );
    bullets = [];
  };
  for (const line of lines) {
    const bullet = /^\s*[-*•]\s+(.*)$/.exec(line);
    if (bullet) {
      bullets.push(bullet[1]);
    } else {
      flush();
      blocks.push(<p key={`p-${blocks.length}`}>{renderInline(line)}</p>);
    }
  }
  flush();
  return <div className="space-y-2">{blocks}</div>;
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || sending) return;
    setError('');
    const next: ChatMessage[] = [...messages, { role: 'user', content }];
    setMessages(next);
    setInput('');
    setSending(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        // The greeting is UI-only; the API expects the conversation to start with the user
        body: JSON.stringify({ messages: next.filter((m) => m !== GREETING).slice(-30) }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply! }]);
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 min-h-12 pl-4 pr-5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold shadow-lg shadow-orange-500/30 transition-colors"
          aria-haspopup="dialog"
        >
          <MessageCircle size={20} aria-hidden /> Ask Rendoz
        </button>
      )}

      {open && (
        <div
          role="dialog"
          aria-label="Rendoz assistant"
          className="fixed z-50 inset-x-3 bottom-3 sm:inset-x-auto sm:right-5 sm:bottom-5 sm:w-[380px] flex flex-col h-[min(600px,calc(100dvh-1.5rem))] rounded-2xl border border-gray-200 bg-white shadow-2xl overflow-hidden"
          onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 bg-[#0B1220] text-white">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                <Sparkles size={16} aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">Rendoz Assistant</p>
                <p className="text-[11px] text-white/60">AI help · can make mistakes</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="min-h-10 min-w-10 flex items-center justify-center rounded-full hover:bg-white/10"
              aria-label="Close assistant"
            >
              <X size={18} />
            </button>
          </div>

          <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50" aria-live="polite">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-orange-500 text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                  }`}
                >
                  {m.role === 'assistant' ? <MessageText text={m.content} /> : m.content}
                </div>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-orange-200 bg-white px-3 py-1.5 text-xs font-medium text-orange-700 hover:bg-orange-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {sending && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Loader2 size={14} className="animate-spin" aria-hidden /> Thinking…
              </div>
            )}
            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{error}</p>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void send(input);
            }}
            className="flex items-end gap-2 border-t border-gray-200 p-3 bg-white"
          >
            <label htmlFor="chat-input" className="sr-only">
              Message the Rendoz assistant
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              rows={1}
              value={input}
              maxLength={2000}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              placeholder="Ask about renting or listing…"
              className="flex-1 resize-none max-h-28 min-h-11 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="min-h-11 min-w-11 flex items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-40"
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
