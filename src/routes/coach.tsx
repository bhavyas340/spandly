import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send } from "lucide-react";

export const Route = createFileRoute("/coach")({
  component: CoachPage,
  head: () => ({
    meta: [
      { title: "Spandly Bhai — Your AI Money Coach | Spendly" },
      { name: "description", content: "Chat with Spandly Bhai, your AI money coach in Hinglish. Get honest, practical advice on chai, Swiggy, rent and savings." },
      { property: "og:title", content: "Spandly Bhai — Your AI Money Coach" },
      { property: "og:description", content: "Chat with an AI money coach in Hinglish for honest, practical advice." },
      { property: "og:url", content: "https://spandly.lovable.app/coach" },
    ],
    links: [{ rel: "canonical", href: "https://spandly.lovable.app/coach" }],
  }),
});

type Msg = { from: "bot" | "me"; text: string };

const SYSTEM_PROMPT =
  "You are Spandly Bhai, a friendly and witty Indian AI money coach for the Spendly expense app. You help users understand their spending, give practical saving tips in Hinglish-friendly language, and cheer them on. Keep responses under 3 sentences. Be warm, direct, and occasionally funny like a helpful older sibling.";

async function askGemini(history: Msg[], userText: string): Promise<string> {
  const key = (import.meta as { env: Record<string, string | undefined> }).env.VITE_GEMINI_API_KEY;
  if (!key) {
    return "Spandly Bhai is waking up... add your Gemini API key in settings.";
  }
  const contents = [
    ...history.map((m) => ({
      role: m.from === "me" ? "user" : "model",
      parts: [{ text: m.text }],
    })),
    { role: "user", parts: [{ text: userText }] },
  ];
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
        generationConfig: { temperature: 0.9, maxOutputTokens: 200 },
      }),
    }
  );
  if (!res.ok) {
    throw new Error(`Gemini ${res.status}`);
  }
  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  return text?.trim() || "Hmm, kuch samjha nahi. Phir se bol bhai? 🤔";
}

function CoachPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Bol bhai, kya scene hai? Paise bachane hain ya sirf roona hai? 😄" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing]);

  const send = async () => {
    const text = input.trim();
    if (!text || typing) return;
    setInput("");
    const history = msgs;
    setMsgs((m) => [...m, { from: "me", text }]);
    setTyping(true);
    try {
      const reply = await askGemini(history, text);
      setMsgs((m) => [...m, { from: "bot", text: reply }]);
    } catch {
      setMsgs((m) => [
        ...m,
        { from: "bot", text: "Network glitch ho gaya bhai, ek baar aur try kar 🙏" },
      ]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#ECECEC" }}>
      <div className="w-full max-w-[440px] flex flex-col h-screen">
        <div className="flex items-center gap-3 px-5 pt-6 pb-3">
          <Link to="/app" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-black/70">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-[20px] font-bold text-black leading-tight">Spandly Bhai — Your AI Money Coach</h1>
            <div className="text-[12px] text-black/50">Tera desi finance coach. Kuch bhi puchh.</div>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-2">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] px-4 py-2.5 rounded-[20px] text-[14px] leading-snug shadow-sm ${
                  m.from === "me"
                    ? "bg-black text-white rounded-br-md"
                    : "bg-white text-black border border-black/5 rounded-bl-md"
                }`}
                style={
                  m.from === "bot"
                    ? { background: "linear-gradient(160deg,#FFFFFF 0%,#FFE9D6 100%)" }
                    : undefined
                }
              >
                {m.text}
              </div>
            </div>
          ))}
          {typing && (
            <div className="flex justify-start">
              <div
                className="px-4 py-3 rounded-[20px] rounded-bl-md shadow-sm border border-black/5 inline-flex items-center gap-1"
                style={{ background: "linear-gradient(160deg,#FFFFFF 0%,#FFE9D6 100%)" }}
                aria-label="Spandly Bhai is typing"
              >
                <Dot delay="0s" />
                <Dot delay="0.15s" />
                <Dot delay="0.3s" />
              </div>
            </div>
          )}
        </div>

        <div className="px-4 pb-6 pt-3">
          <div className="flex items-center gap-2 bg-white rounded-full border border-black/10 shadow-sm px-4 py-2">
            <label htmlFor="coach-msg" className="sr-only">Message Spandly Bhai</label>
            <input
              id="coach-msg"
              aria-label="Message Spandly Bhai"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type karo bhai..."
              className="flex-1 bg-transparent outline-none text-[14px] text-black placeholder:text-black/30"
            />
            <button
              onClick={send}
              disabled={!input.trim() || typing}
              aria-label="Send message"
              className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center disabled:opacity-30"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="w-1.5 h-1.5 rounded-full bg-black/40 inline-block"
      style={{ animation: "spandlyBhaiDot 1.2s infinite ease-in-out", animationDelay: delay }}
    >
      <style>{`@keyframes spandlyBhaiDot { 0%,80%,100%{transform:translateY(0);opacity:.3} 40%{transform:translateY(-3px);opacity:1} }`}</style>
    </span>
  );
}
