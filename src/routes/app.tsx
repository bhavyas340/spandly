import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect, useMemo } from "react";
import {
  ChevronDown,
  X,
  Plus,
  ArrowLeft,
  Camera,
  Target,
  Calendar as CalendarIcon,
  ScanLine,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useLocalState, fileToDataUrl } from "@/lib/storage";
import { getStreak, getExpenses, getMonthExpenses } from "@/lib/spandlyStorage";

function StreakXpBadge() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  const streak = getStreak();
  const exp = getExpenses();
  const now = new Date();
  const monthExp = getMonthExpenses(now.getMonth(), now.getFullYear());
  const monthTotal = monthExp.reduce((s, e) => s + Number(e.amount || 0), 0);
  const xp = exp.length * 10 + streak * 50 + Math.floor(monthTotal / 100);
  const lvl = xp < 500 ? 1 : xp < 2000 ? 2 : xp < 5000 ? 3 : 4;
  return (
    <Link
      to="/xp"
      className="inline-flex items-center gap-2 h-7 px-3 rounded-full bg-white/70 backdrop-blur shadow-sm border border-black/5 text-[11px] font-bold text-black/80"
      aria-label={`Streak ${streak} days, XP ${xp}`}
    >
      <span>🔥 {streak}</span>
      <span className="text-black/20">·</span>
      <span>⚡ Lvl {lvl} · {xp} XP</span>
    </Link>
  );
}

export const Route = createFileRoute("/app")({
  component: AppShell,
  head: () => ({
    meta: [
      { title: "Spendly — Daily Expenses Dashboard" },
      { name: "description", content: "Your Spendly dashboard: log today's expenses by voice or receipt scan, open the calendar to review any date, and track your daily spending streak." },
      { property: "og:title", content: "Spendly — Daily Expenses Dashboard" },
      { property: "og:description", content: "Log today's expenses by voice or receipt scan, review any date in the calendar, and track your daily streak." },
      { property: "og:url", content: "https://spandly.lovable.app/app" },
    ],
    links: [{ rel: "canonical", href: "https://spandly.lovable.app/app" }],
  }),
});

type Expense = {
  id: number;
  label: string;
  amount: number;
  emoji: string;
  gradient: string;
  sub: string;
  image?: string;
  createdAt: number;
};

const PALETTES = [
  "linear-gradient(160deg,#C8F08A 0%,#7BD3D1 60%,#FFD27A 100%)",
  "linear-gradient(160deg,#E8C5FF 0%,#F4A6C5 100%)",
  "linear-gradient(160deg,#F5C7B0 0%,#C8839A 100%)",
  "linear-gradient(160deg,#FFB36B 0%,#FF7A3D 100%)",
  "linear-gradient(160deg,#B8E0FF 0%,#9B8BFF 100%)",
  "linear-gradient(160deg,#FFE08A 0%,#FF9B6B 100%)",
];

const seed: Expense[] = [
  { id: 1, label: "Food",     amount: 460, emoji: "🍱", gradient: PALETTES[0], sub: "Today", createdAt: Date.now() },
  { id: 2, label: "Travel",   amount: 185, emoji: "🛺", gradient: PALETTES[1], sub: "Today", createdAt: Date.now() },
  { id: 3, label: "Bills",    amount: 299, emoji: "📱", gradient: PALETTES[2], sub: "Today", createdAt: Date.now() },
  { id: 4, label: "Shopping", amount: 320, emoji: "🛍️", gradient: PALETTES[3], sub: "Today", createdAt: Date.now() },
];

function isSameDay(a: number, b: number) {
  const da = new Date(a), db = new Date(b);
  return da.getFullYear() === db.getFullYear() && da.getMonth() === db.getMonth() && da.getDate() === db.getDate();
}

function AppShell() {
  const [expenses, setExpenses] = useLocalState<Expense[]>("kharcha.expenses", seed);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(Date.now());
  const [prefillImage, setPrefillImage] = useState<string | undefined>(undefined);
  const scanRef = useRef<HTMLInputElement>(null);

  const addExpense = (label: string, amount: number, image?: string) => {
    setExpenses((prev) => [
      {
        id: Date.now(),
        label,
        amount,
        emoji: "💸",
        gradient: PALETTES[prev.length % PALETTES.length],
        sub: "Just now",
        image,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
  };

  const clearAll = () => {
    if (confirm("Clear all expenses?")) setExpenses([]);
  };

  const setImageOn = (id: number, image: string) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, image } : e)));
  };

  const selDate = new Date(selectedDate);
  const dayName = selDate.toLocaleDateString("en-IN", { weekday: "long" });
  const dateStr = selDate.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
  const isToday = isSameDay(selectedDate, Date.now());

  const visible = useMemo(
    () => expenses.filter((e) => isSameDay(e.createdAt, selectedDate)),
    [expenses, selectedDate]
  );
  const dayTotal = visible.reduce((s, e) => s + e.amount, 0);

  const handleScan = async (file?: File) => {
    if (!file) return;
    const url = await fileToDataUrl(file);
    setPrefillImage(url);
    setManualOpen(true);
  };

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#ECECEC" }}>
      <div className="w-full max-w-[440px] relative flex flex-col" style={{ background: "#ECECEC" }}>
        {/* Phone status bar */}
        <div className="flex items-center justify-between px-7 pt-4 pb-2 text-[13px] font-semibold text-black/90">
          <LiveClock />
          <Link to="/" aria-label="Back to home" className="text-black/40 hover:text-black/70 transition">
            <ArrowLeft size={16} />
          </Link>
          <span className="tracking-tight">●●● ⌃ ▮</span>
        </div>

        {/* Header */}
        <div className="px-6 pt-2 pb-2 flex items-center justify-between">
          <h1 className="text-[34px] leading-none font-bold tracking-tight text-black">Spendly — Daily Expenses</h1>
          <div className="flex items-center gap-2 relative">
            <Link
              to="/goals"
              className="h-9 px-3 rounded-full bg-white/70 backdrop-blur flex items-center gap-1.5 text-black/70 shadow-sm text-[12px] font-semibold"
            >
              <Target size={14} /> Goals
            </Link>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-9 h-9 rounded-full bg-white/60 backdrop-blur flex items-center justify-center text-black/60 shadow-sm"
              aria-label="Menu"
            >
              <ChevronDown size={18} />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-11 z-40 w-48 rounded-2xl bg-white shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)] border border-black/5 overflow-hidden">
                <div
                  className="overflow-y-auto overscroll-contain rounded-2xl"
                  style={{ maxHeight: "min(60vh, 420px)", WebkitOverflowScrolling: "touch" }}
                >

                  <Link
                    to="/analysis"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black hover:bg-black/5"
                  >
                    <TrendingUp size={15} /> Analysis
                  </Link>
                  <div className="h-px bg-black/5" />
                  <Link to="/spend-dna" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black hover:bg-black/5"><span>✦</span> Spend DNA</Link>
                  <Link to="/streak-legacy" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black hover:bg-black/5"><span>🏆</span> Streak Legacy</Link>
                  <Link to="/city-pulse" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black hover:bg-black/5"><span>🏙️</span> City Pulse</Link>
                  <Link to="/month-forecast" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black hover:bg-black/5"><span>📅</span> Month Forecast</Link>
                  <Link to="/kharcha-report" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black hover:bg-black/5"><span>📄</span> Kharcha Report</Link>
                  <div className="h-px bg-black/5" />
                  <Link to="/snap-to-log" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black hover:bg-black/5"><span>📸</span> Snap to Log</Link>
                  <Link to="/chai-index" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black hover:bg-black/5"><span>🍛</span> Chai Index</Link>
                  <Link to="/subscriptions" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black hover:bg-black/5"><span>💳</span> Subscriptions</Link>
                  <div className="h-px bg-black/5" />
                  <Link to="/roast" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black hover:bg-black/5">
                    <span>🔥</span> Roast Me
                  </Link>
                  <Link to="/wrapped" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black hover:bg-black/5">
                    <span>📊</span> My Wrapped
                  </Link>
                  <Link to="/challenges" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black hover:bg-black/5">
                    <span>🎯</span> Challenges
                  </Link>
                  <Link to="/coach" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black hover:bg-black/5">
                    <span>🤖</span> Spandly Bhai
                  </Link>
                  <div className="h-px bg-black/5" />
                  <button
                    onClick={() => { setMenuOpen(false); clearAll(); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-3 text-[13px] font-semibold text-black/70 hover:bg-black/5"
                  >
                    <X size={15} /> Clear all
                  </button>
                  <div className="pointer-events-none sticky bottom-0 h-6 -mt-6 bg-gradient-to-t from-white to-transparent" />
                </div>
                </div>

              </>

            )}
          </div>
        </div>

        <main>
        {/* Date + Today Total card — click to open calendar */}
        <div className="px-5 pb-4">
          <button
            onClick={() => setCalendarOpen(true)}
            className="w-full rounded-[22px] bg-white/85 backdrop-blur-xl shadow-[0_8px_24px_-14px_rgba(0,0,0,0.25)] border border-black/5 px-4 py-3 flex items-center justify-between text-left hover:bg-white transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-[14px] bg-black text-white flex items-center justify-center shrink-0 shadow-sm">
                <CalendarIcon size={18} />
        </div>
        <div className="px-6 pb-3"><StreakXpBadge /></div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40">{dayName}</div>
                <div className="text-[18px] font-bold text-black leading-tight">{dateStr}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40">
                {isToday ? "Today" : "Spent"}
              </div>
              <div
                className="text-[22px] font-bold text-black leading-tight"
                style={{ fontFamily: "'Courier New', monospace", letterSpacing: "-0.02em" }}
              >
                ₹{dayTotal}
              </div>
            </div>
          </button>
        </div>

        {/* Card grid */}
        <div className="px-5 grid grid-cols-2 gap-3 pb-40">
          {visible.length === 0 && (
            <div className="col-span-2 rounded-[22px] bg-white/85 p-6 text-center border border-black/5 text-black/50 text-sm">
              No expenses on this day. Tap <Plus className="inline" size={14} /> to add.
            </div>
          )}
          {visible.map((e) => (
            <ExpenseCard key={e.id} e={e} onImage={(img) => setImageOn(e.id, img)} />
          ))}
        </div>
        </main>
      </div>


      {/* Bottom dock */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[440px] px-5 pb-6 pt-4 z-40 pointer-events-none">
        <div className="pointer-events-auto">
          <BottomDock
            onVoice={() => setVoiceOpen(true)}
            onAdd={() => { setPrefillImage(undefined); setManualOpen(true); }}
            onScan={() => scanRef.current?.click()}
          />
        </div>
      </div>

      <input
        ref={scanRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={(e) => { handleScan(e.target.files?.[0]); e.target.value = ""; }}
      />

      {voiceOpen && (
        <VoiceModal
          onClose={() => setVoiceOpen(false)}
          onResult={(label, amount) => {
            addExpense(label, amount);
            setVoiceOpen(false);
          }}
        />
      )}

      {manualOpen && (
        <ManualModal
          prefillImage={prefillImage}
          onClose={() => { setManualOpen(false); setPrefillImage(undefined); }}
          onSubmit={(label, amount, image) => {
            addExpense(label, amount, image);
            setManualOpen(false);
            setPrefillImage(undefined);
          }}
        />
      )}

      {calendarOpen && (
        <CalendarModal
          selected={selectedDate}
          expenses={expenses}
          onPick={(ts) => { setSelectedDate(ts); setCalendarOpen(false); }}
          onClose={() => setCalendarOpen(false)}
        />
      )}
    </div>
  );
}

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000 * 20);
    return () => clearInterval(id);
  }, []);
  return <span suppressHydrationWarning>{now ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--"}</span>;
}

function ExpenseCard({ e, onImage }: { e: Expense; onImage: (img: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handlePick = async (file?: File) => {
    if (!file) return;
    const url = await fileToDataUrl(file);
    onImage(url);
  };

  return (
    <div
      className="relative rounded-[28px] p-4 aspect-[0.95] overflow-hidden shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]"
      style={{ background: e.gradient }}
    >
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[15px] font-bold text-black/90 leading-tight">{e.label}</div>
            <div className="text-[12px] text-black/50 -mt-0.5">{e.sub}</div>
          </div>

          <button
            onClick={() => fileRef.current?.click()}
            className="w-11 h-11 rounded-[14px] bg-white/55 backdrop-blur-sm border border-white/60 flex items-center justify-center overflow-hidden shrink-0 shadow-sm hover:bg-white/70 transition"
            aria-label="Add photo"
          >
            {e.image ? (
              <img src={e.image} alt={`Expense photo: ${e.label}`} className="w-full h-full object-cover" />
            ) : (
              <Camera size={16} className="text-black/55" />
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(ev) => handlePick(ev.target.files?.[0])}
            />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div
            className="font-bold text-black/85 leading-none"
            style={{ fontSize: 40, fontFamily: "'Courier New', monospace", letterSpacing: "-0.02em" }}
          >
            ₹{e.amount}
          </div>
        </div>

        <div className="text-[11px] font-semibold text-black/55 uppercase tracking-wider">
          {new Date(e.createdAt).toLocaleDateString("en-IN", { weekday: "short", day: "2-digit" })}
        </div>
      </div>
    </div>
  );
}

function BottomDock({ onVoice, onAdd, onScan }: { onVoice: () => void; onAdd: () => void; onScan: () => void }) {
  return (
    <>
      <div className="flex items-center justify-between gap-3 px-5 py-3 rounded-full bg-white/90 backdrop-blur-xl shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)] border border-black/5">
        <button
          onClick={onScan}
          className="w-11 h-11 rounded-full bg-white flex items-center justify-center text-black/70 shadow-sm hover:bg-black/5 transition"
          aria-label="Scan receipt"
        >
          <ScanLine size={20} />
        </button>

        <button
          onClick={onVoice}
          aria-label="Voice add expense"
          className="flex-1 flex items-center justify-center gap-1.5 h-11"
        >
          <WaveformIcon />
          <span className="sr-only">Voice Log</span>
        </button>

        <button
          onClick={onAdd}
          className="w-11 h-11 rounded-full bg-black flex items-center justify-center text-white shadow-sm hover:bg-black/80 transition"
          aria-label="Add expense"
        >
          <Plus size={20} />
        </button>
      </div>
      <div className="text-center mt-3 text-[11px] font-semibold text-black/40 uppercase tracking-wider">
        Scan · Voice · Text
      </div>
    </>
  );
}

function WaveformIcon() {
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
          }}
        />
      ))}
    </div>
  );
}

function ManualModal({
  onClose,
  onSubmit,
  prefillImage,
}: {
  onClose: () => void;
  onSubmit: (label: string, amount: number, image?: string) => void;
  prefillImage?: string;
}) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [image, setImage] = useState<string | undefined>(prefillImage);

  const canSave = label.trim().length > 0 && Number(amount) > 0;
  const submit = () => {
    if (!canSave) return;
    onSubmit(label.trim().replace(/\b\w/g, (c) => c.toUpperCase()), Number(amount), image);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-end sm:items-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] rounded-t-[28px] sm:rounded-[28px] sm:mb-6 p-5 pb-8"
        style={{ background: "#ECECEC" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-[18px] font-bold text-black">
            {prefillImage ? "Scan receipt" : "Add expense"}
          </div>
          <button
            onClick={onClose}
            aria-label="Close add expense"
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black/60 shadow-sm"
          >
            <X size={16} />
          </button>
        </div>

        {image && (
          <div className="rounded-[22px] overflow-hidden mb-3 bg-white/90 border border-black/5 shadow-sm aspect-[16/9]">
            <img src={image} alt="Receipt photo preview" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="rounded-[22px] bg-white/90 border border-black/5 shadow-sm px-4 py-3 mb-3">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40 mb-1">What</div>
          <input
            autoFocus
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Chai, Auto, Lunch"
            className="w-full bg-transparent outline-none text-[18px] font-bold text-black placeholder:text-black/30"
          />
        </div>

        <div className="rounded-[22px] bg-white/90 border border-black/5 shadow-sm px-4 py-3 mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40 mb-1">Amount ₹</div>
          <input
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d]/g, ""))}
            placeholder="0"
            className="w-full bg-transparent outline-none text-[26px] font-bold text-black placeholder:text-black/30"
            style={{ fontFamily: "'Courier New', monospace" }}
          />
        </div>

        <button
          onClick={submit}
          disabled={!canSave}
          className="w-full h-12 rounded-full bg-black text-white font-bold text-[15px] disabled:opacity-30 shadow-md"
        >
          Add expense
        </button>
      </div>
    </div>
  );
}

function CalendarModal({
  selected,
  expenses,
  onPick,
  onClose,
}: {
  selected: number;
  expenses: Expense[];
  onPick: (ts: number) => void;
  onClose: () => void;
}) {
  const [view, setView] = useState(() => {
    const d = new Date(selected);
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Map: day-of-month -> total
  const dayTotals = useMemo(() => {
    const m = new Map<number, number>();
    expenses.forEach((e) => {
      const d = new Date(e.createdAt);
      if (d.getFullYear() === year && d.getMonth() === month) {
        m.set(d.getDate(), (m.get(d.getDate()) || 0) + e.amount);
      }
    });
    return m;
  }, [expenses, year, month]);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const prevMonth = () => setView(new Date(year, month - 1, 1));
  const nextMonth = () => setView(new Date(year, month + 1, 1));

  const sel = new Date(selected);
  const isSelectedCell = (d: number) =>
    sel.getFullYear() === year && sel.getMonth() === month && sel.getDate() === d;
  const isTodayCell = (d: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === d;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end sm:items-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-[440px] rounded-t-[28px] sm:rounded-[28px] sm:mb-6 p-5 pb-7"
        style={{ background: "#ECECEC" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="text-[18px] font-bold text-black">Pick a day</div>
          <button onClick={onClose} aria-label="Close calendar" className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black/60 shadow-sm">
            <X size={16} />
          </button>
        </div>

        <div className="rounded-[24px] bg-white/95 border border-black/5 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <button onClick={prevMonth} aria-label="Previous month" className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-black/70">
              <ChevronLeft size={16} />
            </button>
            <div className="text-[15px] font-bold text-black">
              {view.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </div>
            <button onClick={nextMonth} aria-label="Next month" className="w-9 h-9 rounded-full bg-black/5 flex items-center justify-center text-black/70">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
              <div key={i} className="text-center text-[10px] font-bold uppercase text-black/40 py-1">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const has = dayTotals.has(d);
              const isSel = isSelectedCell(d);
              const isTod = isTodayCell(d);
              return (
                <button
                  key={i}
                  onClick={() => {
                    const picked = new Date(year, month, d, 12, 0, 0).getTime();
                    onPick(picked);
                  }}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center text-[13px] font-bold relative transition ${
                    isSel
                      ? "bg-black text-white"
                      : isTod
                      ? "bg-black/10 text-black"
                      : "text-black/80 hover:bg-black/5"
                  }`}
                >
                  <span>{d}</span>
                  {has && (
                    <span
                      className={`absolute bottom-1 w-1 h-1 rounded-full ${isSel ? "bg-white" : "bg-black"}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="text-center text-[11px] font-semibold uppercase tracking-wider text-black/40 mt-3">
          Dot = has expenses
        </div>
      </div>
    </div>
  );
}

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
      (typeof window !== "undefined" &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
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
        <div className="absolute inset-0 backdrop-blur-3xl" style={{ background: "rgba(255,255,255,0.04)" }} />

        <div className="relative flex items-center justify-between px-7 pt-4 pb-2 text-[13px] font-semibold text-white">
          <LiveClock />
          <button onClick={onClose} aria-label="Close voice input" className="text-white/70 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <div className="relative px-8 pt-12">
          <div className="text-white text-[28px] font-bold leading-tight tracking-tight drop-shadow-lg min-h-[120px] whitespace-pre-line">
            {transcript || "Say something like\n“chai 20” or\n“auto 85 rupees”"}
          </div>
        </div>

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

function parseExpense(text: string): { label: string; amount: number } | null {
  if (!text) return null;
  const numMatch = text.match(/(\d+(?:\.\d+)?)/);
  if (!numMatch) return null;
  const amount = Number(numMatch[1]);
  const cleaned = text
    .toLowerCase()
    .replace(/(\d+(?:\.\d+)?)/, " ")
    .replace(/\b(rupees|rupee|rs|inr|on|for|spent|paid|add|log|expense|kharcha|spendly)\b/g, " ")
    .replace(/[^\p{L}\s]/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
  const label = cleaned ? cleaned.replace(/\b\w/g, (c) => c.toUpperCase()) : "Expense";
  return { label, amount };
}
