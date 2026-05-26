import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { ChevronDown, X, Plus, ArrowLeft, Mic } from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppShell,
  head: () => ({
    meta: [
      { title: "Kharcha — App" },
      { name: "description", content: "Speak it. Log it. Done." },
    ],
  }),
});

type Expense = { id: number; label: string; amount: number; emoji: string; gradient: string; sub: string };

const initialExpenses: Expense[] = [
  { id: 1, label: "Food",     amount: 460, emoji: "🍱", gradient: "linear-gradient(160deg,#C8F08A 0%,#7BD3D1 60%,#FFD27A 100%)", sub: "Today" },
  { id: 2, label: "Travel",   amount: 185, emoji: "🛺", gradient: "linear-gradient(160deg,#E8C5FF 0%,#F4A6C5 100%)",            sub: "Quality" },
  { id: 3, label: "Bills",    amount: 299, emoji: "📱", gradient: "linear-gradient(160deg,#F5C7B0 0%,#C8839A 100%)",            sub: "Norma" },
  { id: 4, label: "Shopping", amount: 320, emoji: "🛍️", gradient: "linear-gradient(160deg,#FFB36B 0%,#FF7A3D 100%)",           sub: "Nice" },
];

function AppShell() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [voiceOpen, setVoiceOpen] = useState(false);

  const addExpense = (label: string, amount: number) => {
    const palettes = [
      "linear-gradient(160deg,#C8F08A 0%,#7BD3D1 60%,#FFD27A 100%)",
      "linear-gradient(160deg,#E8C5FF 0%,#F4A6C5 100%)",
      "linear-gradient(160deg,#F5C7B0 0%,#C8839A 100%)",
      "linear-gradient(160deg,#FFB36B 0%,#FF7A3D 100%)",
      "linear-gradient(160deg,#B8E0FF 0%,#9B8BFF 100%)",
    ];
    setExpenses((prev) => [
      { id: Date.now(), label, amount, emoji: "💸", gradient: palettes[prev.length % palettes.length], sub: "Just now" },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#ECECEC" }}>
      <div className="w-full max-w-[440px] min-h-screen relative flex flex-col" style={{ background: "#ECECEC" }}>
        {/* Phone status bar mimic */}
        <div className="flex items-center justify-between px-7 pt-4 pb-2 text-[13px] font-semibold text-black/90">
          <span>9:41</span>
          <Link to="/" className="text-black/40 hover:text-black/70 transition">
            <ArrowLeft size={16} />
          </Link>
          <span className="tracking-tight">●●● ⌃ ▮</span>
        </div>

        {/* Header */}
        <div className="px-6 pt-2 pb-4 flex items-center justify-between">
          <h1 className="text-[34px] leading-none font-bold tracking-tight text-black">Kharcha</h1>
          <button className="w-9 h-9 rounded-full bg-white/60 backdrop-blur flex items-center justify-center text-black/60 shadow-sm">
            <ChevronDown size={18} />
          </button>
        </div>

        {/* Card grid */}
        <div className="px-5 grid grid-cols-2 gap-3 pb-6">
          {expenses.slice(0, 6).map((e) => (
            <ExpenseCard key={e.id} e={e} />
          ))}
        </div>

        {/* Page dots */}
        <div className="flex items-center justify-center gap-1.5 pb-6">
          <span className="w-6 h-1.5 rounded-full bg-black/80" />
          <span className="w-1.5 h-1.5 rounded-full bg-black/25" />
        </div>

        <div className="flex-1" />

        {/* Bottom dock */}
        <BottomDock onVoice={() => setVoiceOpen(true)} />
      </div>

      {voiceOpen && (
        <VoiceModal
          onClose={() => setVoiceOpen(false)}
          onResult={(label, amount) => {
            addExpense(label, amount);
            setVoiceOpen(false);
          }}
        />
      )}
    </div>
  );
}

function ExpenseCard({ e }: { e: Expense }) {
  return (
    <div
      className="relative rounded-[28px] p-4 aspect-[0.95] overflow-hidden shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]"
      style={{ background: e.gradient }}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="text-[15px] font-bold text-black/90 leading-tight">{e.label}</div>
          <div className="text-[12px] text-black/50 -mt-0.5">{e.sub}</div>
        </div>

        {/* Dot-matrix style amount */}
        <div className="flex-1 flex items-center justify-center">
          <div
            className="font-bold text-black/85 leading-none"
            style={{
              fontSize: 44,
              fontFamily: "'Courier New', monospace",
              letterSpacing: "-0.02em",
              textShadow: "0 0 0 currentColor",
            }}
          >
            ₹{e.amount}
          </div>
        </div>

        <div className="text-[11px] font-semibold text-black/55 uppercase tracking-wider">
          {e.label === "Food" ? "Sun" : e.label === "Travel" ? "Vitamin D" : e.label === "Bills" ? "Pay" : "₹/day"}
        </div>
      </div>
    </div>
  );
}

function BottomDock({ onVoice }: { onVoice: () => void }) {
  return (
    <div className="sticky bottom-0 px-5 pb-6 pt-4">
      <div className="flex items-center justify-between gap-3 px-5 py-3 rounded-full bg-white/85 backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)] border border-black/5">
        <button className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-black/70 shadow-sm hover:bg-black/5 transition">
          <X size={20} />
        </button>

        <button
          onClick={onVoice}
          aria-label="Voice add"
          className="flex-1 flex items-center justify-center gap-1.5 h-11"
        >
          <WaveformIcon />
        </button>

        <button className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-black/70 shadow-sm hover:bg-black/5 transition">
          <Plus size={20} />
        </button>
      </div>
      <div className="text-center mt-3 text-[11px] font-semibold text-black/40 uppercase tracking-wider">
        Voice & Text Input
      </div>
    </div>
  );
}

/** Apple-intelligence-style 4 black pill bars that breathe independently. */
function WaveformIcon({ active = false }: { active?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 h-7">
      {[0, 1, 2, 3].map((i) => (
        <span
          key={i}
          className="block bg-black rounded-full"
          style={{
            width: 8,
            height: 18,
            transformOrigin: "center",
            animation: `wave-bar 1.${4 + i}s ease-in-out ${i * 0.12}s infinite`,
            animationPlayState: active ? "running" : "running",
          }}
        />
      ))}
    </div>
  );
}

/** Voice modal: full-screen aurora gradient + live transcript + animated bars. */
function VoiceModal({
  onClose,
  onResult,
}: {
  onClose: () => void;
  onResult: (label: string, amount: number) => void;
}) {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const recogRef = useRef<any>(null);

  useEffect(() => {
    const SR =
      (typeof window !== "undefined" && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    if (!SR) {
      setErr("Voice not supported in this browser. Try Chrome.");
      return;
    }
    const r = new SR();
    r.lang = "en-IN";
    r.interimResults = true;
    r.continuous = false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = (ev: any) => setErr(ev.error || "Error");
    r.onresult = (ev: any) => {
      let txt = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) txt += ev.results[i][0].transcript;
      setTranscript(txt);
      if (ev.results[ev.results.length - 1].isFinal) {
        const parsed = parseExpense(txt);
        if (parsed) setTimeout(() => onResult(parsed.label, parsed.amount), 450);
      }
    };
    recogRef.current = r;
    try { r.start(); } catch {}
    return () => { try { r.stop(); } catch {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitManual = () => {
    const parsed = parseExpense(transcript);
    if (parsed) onResult(parsed.label, parsed.amount);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center" onClick={onClose}>
      <div
        className="w-full max-w-[440px] min-h-screen relative overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 80% at 30% 20%, #F2D27A 0%, transparent 60%), radial-gradient(100% 80% at 80% 30%, #E8C5FF 0%, transparent 55%), radial-gradient(120% 100% at 50% 90%, #B89BFF 0%, transparent 60%), radial-gradient(80% 60% at 20% 80%, #9BE6C9 0%, transparent 55%), #1a1a1a",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Frosted overlay */}
        <div className="absolute inset-0 backdrop-blur-3xl" style={{ background: "rgba(255,255,255,0.04)" }} />

        {/* Status bar */}
        <div className="relative flex items-center justify-between px-7 pt-4 pb-2 text-[13px] font-semibold text-white">
          <span>9:41</span>
          <button onClick={onClose} className="text-white/70 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Headline */}
        <div className="relative px-8 pt-12">
          <div className="text-white text-[28px] font-bold leading-tight tracking-tight drop-shadow-lg min-h-[120px]">
            {transcript || "Say something like\n“chai 20” or\n“auto 85 rupees”"}
          </div>
        </div>

        {/* Bottom blob + bars */}
        <div className="absolute bottom-0 left-0 right-0 pb-12 flex flex-col items-center gap-8">
          <div
            className="w-56 h-20 rounded-full"
            style={{
              background: "radial-gradient(60% 80% at 50% 50%, #C490FF 0%, #7A4FE0 60%, transparent 100%)",
              filter: "blur(14px)",
              opacity: 0.9,
              animation: "blob-breathe 2.4s ease-in-out infinite",
            }}
          />
          <div className="flex items-center gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="block bg-black rounded-full"
                style={{
                  width: 14,
                  height: 38,
                  animation: `wave-bar 1.${3 + i}s ease-in-out ${i * 0.13}s infinite`,
                }}
              />
            ))}
          </div>

          {err && <div className="text-red-200 text-xs px-8 text-center">{err}</div>}

          <div className="flex items-center gap-3 px-6">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full bg-white/15 text-white text-sm font-semibold border border-white/15 backdrop-blur"
            >
              Cancel
            </button>
            <button
              onClick={submitManual}
              disabled={!transcript}
              className="px-5 py-2.5 rounded-full bg-white text-black text-sm font-semibold disabled:opacity-40"
            >
              {listening ? "Listening…" : "Add expense"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Parse "chai 20", "20 chai", "auto 85 rupees", "spent 140 on lunch" */
function parseExpense(text: string): { label: string; amount: number } | null {
  if (!text) return null;
  const numMatch = text.match(/(\d+(?:\.\d+)?)/);
  if (!numMatch) return null;
  const amount = Number(numMatch[1]);
  const cleaned = text
    .toLowerCase()
    .replace(/(\d+(?:\.\d+)?)/, " ")
    .replace(/\b(rupees|rupee|rs|inr|on|for|spent|paid|add|log|expense|kharcha)\b/g, " ")
    .replace(/[^\p{L}\s]/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
  const label = cleaned ? cleaned.replace(/\b\w/g, (c) => c.toUpperCase()) : "Expense";
  return { label, amount };
}
