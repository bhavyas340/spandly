import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import { Shell, SectionTitle, EmptyCard, Toast } from "./spend-dna";
import { getExpenses, getStreak, getMonthExpenses } from "@/lib/spandlyStorage";

export const Route = createFileRoute("/xp")({
  component: XPPage,
  head: () => ({ meta: [{ title: "Spendly — XP & Levels" }] }),
});

const LEVELS = [
  { min: 0, max: 500, name: "Chai Tracker", emoji: "☕", color: "#EF9F27" },
  { min: 500, max: 2000, name: "Budget Beginner", emoji: "🌱", color: "#1D9E75" },
  { min: 2000, max: 5000, name: "Money Mindful", emoji: "🧘", color: "#8B5CF6" },
  { min: 5000, max: Infinity, name: "Crorepati Mode", emoji: "👑", color: "#FF7A3D" },
];

function levelFor(xp: number) {
  return LEVELS.find((l) => xp >= l.min && xp < l.max) || LEVELS[LEVELS.length - 1];
}

const ALL_BADGES = [
  { id: "7day", name: "7-Day Warrior", emoji: "⚔️", check: (s: number) => s >= 7 },
  { id: "14day", name: "14-Day Streaker", emoji: "🔥", check: (s: number) => s >= 14 },
  { id: "noSwiggy", name: "No Swiggy Week", emoji: "🍳", check: (_s: number, exp: { label?: string; category?: string; createdAt?: number }[]) => {
    const weekAgo = Date.now() - 7 * 86400000;
    return !exp.some((e) => (e.createdAt || 0) > weekAgo && /swiggy|zomato/i.test(`${e.label} ${e.category}`));
  }},
  { id: "saver", name: "Savings Starter", emoji: "💰", check: (_s: number, exp: { amount?: number }[]) => exp.length >= 10 },
  { id: "30day", name: "30-Day Legend", emoji: "🏆", check: (s: number) => s >= 30 },
];

function XPPage() {
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);

  const exp = mounted ? getExpenses() : [];
  const streak = mounted ? getStreak() : 0;
  const now = new Date();
  const monthExp = mounted ? getMonthExpenses(now.getMonth(), now.getFullYear()) : [];

  const xp = useMemo(() => {
    let total = exp.length * 10;
    total += streak * 50;
    // under-budget proxy: if month total < 15000 → +100 per recent week
    const monthTotal = monthExp.reduce((s, e) => s + Number(e.amount || 0), 0);
    if (monthTotal > 0 && monthTotal < 15000) total += 100;
    return total;
  }, [exp.length, streak, monthExp]);

  const lvl = levelFor(xp);
  const progress = lvl.max === Infinity ? 100 : ((xp - lvl.min) / (lvl.max - lvl.min)) * 100;

  const unlocked = ALL_BADGES.filter((b) => b.check(streak, exp));
  const weekly = { goal: 5, done: Math.min(5, streak) };

  const shareBadge = async () => {
    if (!badgeRef.current) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(badgeRef.current, { backgroundColor: null, scale: 2 });
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], "spendly-badge.png", { type: "image/png" });
        if (navigator.share && (navigator as Navigator & { canShare?: (d: { files: File[] }) => boolean }).canShare?.({ files: [file] })) {
          try { await navigator.share({ files: [file], text: `My Spendly level: ${lvl.name} ${lvl.emoji}` }); return; } catch {}
        }
        const link = document.createElement("a"); link.download = "spendly-badge.png"; link.href = canvas.toDataURL("image/png"); link.click();
        setToast("Badge saved!"); setTimeout(() => setToast(null), 1600);
      });
    } catch {}
  };

  if (mounted && exp.length === 0) {
    return <Shell title="⚡ XP & Levels"><EmptyCard text="Log expenses to start earning XP." cta /></Shell>;
  }

  return (
    <Shell title="⚡ XP & Levels">
      <div ref={badgeRef} className="rounded-[24px] p-6 text-white shadow-lg" style={{ background: `linear-gradient(135deg, ${lvl.color} 0%, #1a1a1a 110%)` }}>
        <div className="flex items-center gap-3">
          <div className="text-5xl">{lvl.emoji}</div>
          <div>
            <div className="text-[11px] uppercase tracking-wider opacity-80 font-bold">Current Level</div>
            <div className="text-[22px] font-bold">{lvl.name}</div>
          </div>
        </div>
        <div className="mt-5 text-[12px] uppercase tracking-wider opacity-80">XP</div>
        <div className="text-[36px] font-bold leading-none">{xp.toLocaleString("en-IN")}</div>
        <div className="mt-3 h-2.5 rounded-full bg-white/20 overflow-hidden">
          <div className="h-full bg-white" style={{ width: `${progress}%` }} />
        </div>
        <div className="text-[11px] opacity-80 mt-1.5">{lvl.max === Infinity ? "Max level reached" : `${(lvl.max - xp).toLocaleString("en-IN")} XP to next level`}</div>
      </div>

      <button onClick={shareBadge} className="h-11 rounded-full bg-black text-white font-bold text-[13px] inline-flex items-center justify-center gap-2"><Share2 size={14}/> Share badge</button>

      <SectionTitle>How XP works</SectionTitle>
      <div className="rounded-[20px] bg-white border border-black/5 divide-y divide-black/5 text-[13px]">
        <Row left="Every expense logged" right="+10 XP" />
        <Row left="Each streak day" right="+50 XP" />
        <Row left="Under monthly budget" right="+100 XP" />
      </div>

      <SectionTitle>This week's challenge</SectionTitle>
      <div className="rounded-[20px] bg-white border-2 p-4" style={{ borderColor: "#EF9F27" }}>
        <div className="text-[14px] font-bold text-black">Log every expense for 5 days</div>
        <div className="text-[12px] text-black/50 mt-0.5">Earn 200 bonus XP</div>
        <div className="mt-3 h-2 rounded-full bg-black/10 overflow-hidden">
          <div className="h-full" style={{ width: `${(weekly.done / weekly.goal) * 100}%`, background: "#EF9F27" }} />
        </div>
        <div className="text-[11px] text-black/40 mt-1">{weekly.done}/{weekly.goal} days</div>
      </div>

      <SectionTitle>Badges</SectionTitle>
      <div className="grid grid-cols-3 gap-3">
        {ALL_BADGES.map((b) => {
          const got = unlocked.some((u) => u.id === b.id);
          return (
            <div key={b.id} className={`rounded-[18px] p-3 text-center border ${got ? "bg-white border-black/10" : "bg-black/5 border-transparent"}`}>
              <div className={`text-3xl ${got ? "" : "grayscale opacity-40"}`}>{b.emoji}</div>
              <div className={`text-[11px] font-bold mt-1 ${got ? "text-black" : "text-black/40"}`}>{b.name}</div>
            </div>
          );
        })}
      </div>

      {toast && <Toast text={toast} />}
    </Shell>
  );
}

function Row({ left, right }: { left: string; right: string }) {
  return (
    <div className="flex justify-between items-center px-4 py-3">
      <span className="text-black/70">{left}</span>
      <span className="font-bold text-black">{right}</span>
    </div>
  );
}
