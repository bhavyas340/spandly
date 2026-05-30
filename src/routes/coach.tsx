import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Send } from "lucide-react";

export const Route = createFileRoute("/coach")({
  component: CoachPage,
  head: () => ({ meta: [{ title: "Spendly — Spandly Bhai" }] }),
});

type Msg = { from: "bot" | "me"; text: string };

function reply(input: string): string {
  const t = input.toLowerCase();
  if (/(swiggy|zomato|food)/.test(t)) return "Bhai, ghar ka khana try kar. ₹200 roz bachega. Month mein ₹6000! 🍱";
  if (/(chai|coffee)/.test(t)) return "Chai pe itna? Ek thermos kharid le ek baar mein. ₹15 mein 3 cups ☕";
  if (/(auto|cab|ola|uber)/.test(t)) return "Cycling try kar yaar. Free hai, fit bhi rahega. 🚴";
  if (/(saving|bachana|save)/.test(t)) return "Simple rule: pehle 20% bachao, baad mein kharch karo. Seedha laga do SIP mein 📈";
  if (/(salary|paisa|money)/.test(t)) return "Paisa toh aata rahega bhai. Agar kharch control ho gaya toh stress zero ✌️";
  return "Samajh gaya bhai. Aur kuch batao, main yahan hoon 😄";
}

function CoachPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", text: "Bol bhai, kya scene hai? Paise bachane hain ya sirf roona hai? 😄" },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs]);

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMsgs((m) => [...m, { from: "me", text }]);
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "bot", text: reply(text) }]);
    }, 450);
  };

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#ECECEC" }}>
      <div className="w-full max-w-[440px] flex flex-col h-screen">
        <div className="flex items-center gap-3 px-5 pt-6 pb-3">
          <Link to="/app" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-black/70">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-[20px] font-bold text-black leading-tight">🤖 Spandly Bhai</h1>
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
        </div>

        <div className="px-4 pb-6 pt-3">
          <div className="flex items-center gap-2 bg-white rounded-full border border-black/10 shadow-sm px-4 py-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type karo bhai..."
              className="flex-1 bg-transparent outline-none text-[14px] text-black placeholder:text-black/30"
            />
            <button
              onClick={send}
              disabled={!input.trim()}
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
