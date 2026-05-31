import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, SectionTitle } from "./spend-dna";
import { getStreak } from "@/lib/spandlyStorage";

export const Route = createFileRoute("/streak-legacy")({
  component: StreakLegacy,
  head: () => ({ meta: [{ title: "Spendly — Streak Legacy" }] }),
});

const MILESTONES = [7, 14, 30, 60, 100, 200, 365];
const REWARDS: Record<number, string> = {
  7: "Bronze monument + DNA trait unlocked",
  14: "Silver monument + Streak Shield awarded",
  30: "Gold monument + Month persona locked in",
  60: "Platinum monument + City Pulse early access",
  100: "Diamond monument + Annual Kharcha Report",
  200: "Obsidian monument + Priority feature votes",
  365: "Legendary monument + Founding member badge",
};

type Monument = { milestone: number; date: string };

function StreakLegacy() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const streak = mounted ? getStreak() : 0;
  const [monuments, setMonuments] = useState<Monument[]>([]);

  useEffect(() => {
    if (!mounted) return;
    try {
      const raw = localStorage.getItem("spandly_monuments");
      const arr: Monument[] = raw ? JSON.parse(raw) : [];
      const reached = MILESTONES.filter((m) => streak >= m);
      let changed = false;
      for (const m of reached) {
        if (!arr.find((x) => x.milestone === m)) {
          arr.push({ milestone: m, date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) });
          changed = true;
        }
      }
      if (changed) localStorage.setItem("spandly_monuments", JSON.stringify(arr));
      setMonuments(arr);
    } catch { setMonuments([]); }
  }, [mounted, streak]);

  const nextMilestone = MILESTONES.find((m) => m > streak) ?? 365;
  const prev = [...MILESTONES].reverse().find((m) => m <= streak) ?? 0;
  const progress = nextMilestone === prev ? 100 : Math.min(100, Math.max(0, ((streak - prev) / (nextMilestone - prev)) * 100));

  const borderFor = (m: number) => (m >= 100 ? "#D4AF37" : m >= 30 ? "#8B5CF6" : "#1D9E75");

  return (
    <Shell title="🏆 Streak Legacy">
      {streak === 0 ? (
        <div className="rounded-[24px] bg-white border border-black/5 p-6 text-center">
          <div className="text-[15px] font-bold text-black">No active streak</div>
          <div className="text-[13px] text-black/60 mt-1">Start your streak on the main app to build your legacy.</div>
        </div>
      ) : (
        <div className="rounded-[24px] p-5 text-white shadow-md" style={{ background: "linear-gradient(160deg,#0F172A 0%,#1D9E75 100%)" }}>
          <div className="text-[11px] uppercase tracking-wider font-semibold text-white/60">Current streak</div>
          <div className="text-[56px] font-bold leading-none mt-1">{streak}</div>
          <div className="text-[12px] text-white/70 -mt-1">day streak</div>
          <div className="mt-4 h-2 rounded-full bg-white/15 overflow-hidden">
            <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-[12px] text-white/80 mt-2">Next milestone: {nextMilestone - streak} days → {nextMilestone} day monument</div>
        </div>
      )}

      <SectionTitle>Your monument wall</SectionTitle>
      <div className="text-[12px] text-black/50 -mt-2">Every streak milestone is preserved here forever.</div>

      {monuments.length === 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {[7, 30, 100].map((m) => (
            <div key={m} className="rounded-[18px] bg-white border border-black/5 p-4 opacity-50 blur-[0.5px]">
              <div className="text-2xl">🔒</div>
              <div className="text-[14px] font-bold text-black mt-2">{m} day streak</div>
              <div className="text-[11px] text-black/40 mt-0.5">Locked</div>
            </div>
          ))}
          <div className="col-span-2 text-[12px] text-black/50 text-center mt-1">Complete your first milestone to unlock a monument.</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {monuments.map((mn) => (
            <div key={mn.milestone} className="rounded-[18px] bg-white p-4 border-2" style={{ borderColor: borderFor(mn.milestone) }}>
              <div style={{ fontSize: 18 + Math.min(20, mn.milestone / 6) }}>🏆</div>
              <div className="text-[14px] font-bold text-black mt-1">{mn.milestone} day streak</div>
              <div className="text-[11px] text-black/50">Achieved {mn.date}</div>
              <div className="flex gap-1 mt-2">
                {Array.from({ length: 7 }).map((_, i) => (
                  <span key={i} className="w-3 h-3 rounded-sm" style={{ background: "#1D9E75" }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <SectionTitle>Milestone roadmap</SectionTitle>
      <div className="rounded-[20px] bg-white border border-black/5 divide-y divide-black/5">
        {MILESTONES.map((m) => {
          const status = streak >= m ? "done" : MILESTONES.find((x) => x > streak) === m ? "next" : "locked";
          const icon = status === "done" ? "✅" : status === "next" ? "🔥" : "🔒";
          return (
            <div key={m} className="flex items-start gap-3 p-3">
              <span className="text-lg">{icon}</span>
              <div className="flex-1">
                <div className="text-[14px] font-bold text-black">{m} day monument</div>
                <div className="text-[11px] text-black/55 leading-snug mt-0.5">{REWARDS[m]}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Shell>
  );
}
