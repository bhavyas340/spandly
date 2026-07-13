import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { getExpenses, getMonthExpenses, getStreak, getPersona, type Persona } from "@/lib/spandlyStorage";

export const Route = createFileRoute("/spend-dna")({
  component: SpendDna,
  head: () => ({
    meta: [
      { title: "Spend DNA — Your monthly money personality | Spendly" },
      { name: "description", content: "See your Spend DNA — the traits, patterns and persona that shape how you spend each month. Powered by your Spendly history." },
      { property: "og:title", content: "Spend DNA — Your monthly money personality" },
      { property: "og:description", content: "The traits, patterns and persona that shape how you spend each month." },
      { property: "og:url", content: "https://spandly.lovable.app/spend-dna" },
    ],
    links: [{ rel: "canonical", href: "https://spandly.lovable.app/spend-dna" }],
  }),
});

type HistoryEntry = { month: number; year: number; persona: Persona };

function SpendDna() {
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const monthExp = mounted ? getMonthExpenses(month, year) : [];
  const streak = mounted ? getStreak() : 0;
  const persona = getPersona(streak, monthExp);
  const allExp = mounted ? getExpenses() : [];

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = localStorage.getItem("spandly_dna_history");
      const arr: HistoryEntry[] = raw ? JSON.parse(raw) : [];
      const exists = arr.some((h) => h.month === month && h.year === year);
      const next = exists ? arr : [...arr, { month, year, persona }];
      if (!exists) localStorage.setItem("spandly_dna_history", JSON.stringify(next));
      setHistory(next);
    } catch {
      setHistory([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted]);

  const weekDots = useMemo(() => {
    const today = new Date();
    const dow = (today.getDay() + 6) % 7; // Mon=0
    const monday = new Date(today);
    monday.setDate(today.getDate() - dow);
    monday.setHours(0, 0, 0, 0);
    const set = new Set(
      allExp.map((e) => {
        const d = new Date(Number(e.createdAt ?? e.date ?? 0));
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      })
    );
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const isToday = d.toDateString() === today.toDateString();
      const logged = set.has(key);
      const state: "logged" | "today" | "empty" = logged ? "logged" : isToday ? "today" : "empty";
      return { label: ["M", "T", "W", "T", "F", "S", "S"][i], state };
    });
  }, [allExp]);

  const share = async () => {
    const text = `My Spend DNA: I'm ${persona.name} 💸 Find yours → https://spandly.lovable.app`;
    if (navigator.share) {
      try { await navigator.share({ text }); return; } catch {}
    }
    try { await navigator.clipboard.writeText(text); setToast("Copied!"); setTimeout(() => setToast(null), 1800); } catch {}
  };

  const monthLabel = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const empty = mounted && allExp.length === 0;

  return (
    <Shell title="✦ Spend DNA">
      {empty ? (
        <div className="rounded-[24px] bg-white border-2 p-8 text-center shadow-sm" style={{ borderColor: "#1D9E75" }}>
          <div className="text-[56px] leading-none mb-3" aria-hidden>🧬</div>
          <div className="text-[16px] font-bold text-black">Your Spend DNA builds over 7 days of logging</div>
          <div className="text-[13px] text-black/60 mt-2">Once you log expenses, your unique money personality unlocks.</div>
          <Link to="/app" className="inline-block mt-5 h-11 px-6 leading-[44px] rounded-full bg-black text-white text-[13px] font-bold">
            Log your first expense →
          </Link>
        </div>
      ) : (
        <div className="rounded-[24px] bg-white border-2 p-5 shadow-sm" style={{ borderColor: "#1D9E75" }}>
          <div className="text-[11px] uppercase tracking-wider font-semibold text-black/40">Your Spend DNA</div>
          <div className="text-[24px] font-bold text-black mt-1">{persona.name}</div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {persona.traits.map((t, i) => (
              <span key={t} className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: ["#1D9E75", "#EF9F27", "#8B5CF6"][i % 3] }}>{t}</span>
            ))}
          </div>
          <div className="text-[13px] text-black/70 mt-3 leading-snug">{persona.verdict}</div>
          <div className="text-[11px] uppercase tracking-wider font-semibold text-black/40 mt-4">Valid for: {monthLabel}</div>
          <button onClick={share} className="mt-4 w-full h-11 rounded-full bg-black text-white font-bold text-[14px]">Share your DNA →</button>
        </div>
      )}

      <SectionTitle>This week's DNA pattern</SectionTitle>
      <div className="rounded-[20px] bg-white border border-black/5 p-4 flex items-center justify-between">
        {weekDots.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1.5">
            <span className="w-6 h-6 rounded-full" style={{ background: d.state === "logged" ? "#1D9E75" : d.state === "today" ? "#EF9F27" : "#888" }} />
            <span className="text-[10px] text-black/50 font-semibold">{d.label}</span>
          </div>
        ))}
      </div>

      <SectionTitle>Your DNA traits</SectionTitle>
      <div className="rounded-[20px] bg-white border border-black/5 divide-y divide-black/5">
        {persona.traits.map((t, i) => (
          <div key={t} className="flex items-center gap-3 p-3">
            <span className="text-xl">{["🧬", "🌱", "⚡"][i % 3]}</span>
            <div className="flex-1">
              <div className="text-[14px] font-bold text-black">{t}</div>
              <div className="text-[12px] text-black/50">A core part of your money personality.</div>
            </div>
          </div>
        ))}
      </div>

      <SectionTitle>Past personas</SectionTitle>
      {history.length === 0 ? (
        <EmptyCard text="Your persona history will build here each month." />
      ) : (
        <div className="rounded-[20px] bg-white border border-black/5 divide-y divide-black/5">
          {history.slice().reverse().map((h, i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <span className="w-3 h-3 rounded-full" style={{ background: ["#1D9E75", "#EF9F27", "#8B5CF6", "#FF7A3D"][i % 4] }} />
              <div className="text-[13px] font-semibold text-black flex-1">
                {new Date(h.year, h.month).toLocaleDateString("en-IN", { month: "long", year: "numeric" })} — {h.persona.name}
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast text={toast} />}
    </Shell>
  );
}

export function Shell({ title, children, right }: { title: string; children: React.ReactNode; right?: React.ReactNode }) {
  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#ECECEC" }}>
      <div className="w-full max-w-[480px] flex flex-col px-5 pb-12">
        <div className="flex items-center gap-3 pt-6 pb-4">
          <Link to="/app" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-black/70"><ArrowLeft size={18} /></Link>
          <h1 className="text-[22px] font-bold text-black flex-1">{title}</h1>
          {right}
        </div>
        <div className="flex flex-col gap-4">{children}</div>
      </div>
    </div>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-[11px] uppercase tracking-wider font-semibold text-black/50 mt-2">{children}</h2>;
}

export function EmptyCard({ text, cta }: { text: string; cta?: boolean }) {
  return (
    <div className="rounded-[20px] bg-white border border-black/5 p-5 text-center">
      <div className="text-[13px] text-black/60">{text}</div>
      {cta && <Link to="/app" className="inline-block mt-3 h-10 px-5 rounded-full bg-black text-white text-[13px] font-bold leading-10">Go to app →</Link>}
    </div>
  );
}

export function Toast({ text }: { text: string }) {
  return <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-[13px] font-semibold px-5 py-3 rounded-full shadow-lg z-50">{text}</div>;
}
