import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Shell, SectionTitle, Toast } from "./spend-dna";
import { getStreak, isTodayLogged } from "@/lib/spandlyStorage";

export const Route = createFileRoute("/icon-status")({
  component: IconStatus,
  head: () => ({ meta: [{ title: "Spendly — App Icon" }] }),
});

type IconState = { id: string; emoji: string; bg: string; name: string; desc: string; trigger: string };
const STATES: IconState[] = [
  { id: "active", emoji: "🔥", bg: "#0F172A", name: "Active streak", desc: "Streak: 3+ days active", trigger: "When streak ≥ 3 and today logged" },
  { id: "risk", emoji: "💀", bg: "#EF9F27", name: "Streak at risk", desc: "Log before midnight!", trigger: "Streak active but today not logged yet" },
  { id: "cold", emoji: "⬛", bg: "#888888", name: "Cold streak", desc: "Restart your streak.", trigger: "When streak = 0" },
  { id: "milestone", emoji: "🏆", bg: "#D4AF37", name: "Milestone day", desc: "Milestone achieved!", trigger: "On 7/30/100 day milestones" },
];

function IconStatus() {
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  const streak = mounted ? getStreak() : 0;
  const todayLogged = mounted ? isTodayLogged() : false;
  let currentId = "cold";
  if (streak >= 3 && todayLogged) currentId = "active";
  else if (streak >= 1 && !todayLogged) currentId = "risk";
  else if (streak === 0) currentId = "cold";

  const current = STATES.find((s) => s.id === currentId)!;

  const install = () => {
    try {
      const w = window as unknown as { deferredPrompt?: { prompt: () => void } };
      if (w.deferredPrompt?.prompt) { w.deferredPrompt.prompt(); }
      else { setToast("Use the steps above to install from your browser menu."); setTimeout(() => setToast(null), 2500); }
      localStorage.setItem("spandly_install_prompted", "1");
    } catch {}
  };

  return (
    <Shell title="🔥 App Icon">
      <div className="rounded-[20px] bg-white border border-black/5 p-4 text-[13px] text-black">
        Your icon changes with your streak. Install Spandly as an app on your home screen to see your streak status before even opening the app.
      </div>

      <SectionTitle>Icon states</SectionTitle>
      <div className="grid grid-cols-2 gap-3">
        {STATES.map((s) => {
          const isCur = mounted && s.id === currentId;
          return (
            <div key={s.id} className="rounded-[18px] bg-white border border-black/5 p-3 relative">
              {isCur && <span className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#1D9E75" }}>CURRENT</span>}
              <div className="w-[60px] h-[60px] rounded-[16px] flex items-center justify-center text-3xl" style={{ background: s.bg }}>{s.emoji}</div>
              <div className="text-[13px] font-bold text-black mt-2">{s.name}</div>
              <div className="text-[11px] text-black/55">{s.desc}</div>
              <div className="text-[10px] text-black/40 mt-1">{s.trigger}</div>
            </div>
          );
        })}
      </div>

      <div className="rounded-[20px] bg-white border border-black/5 p-4 flex items-center justify-between">
        <span className="text-[13px] text-black/60">Your current icon state:</span>
        <span className="text-[14px] font-bold text-black flex items-center gap-2">{current.name} <span className="text-xl">{current.emoji}</span></span>
      </div>

      <SectionTitle>Add to home screen</SectionTitle>
      <div className="rounded-[20px] bg-white border border-black/5 p-4">
        <div className="text-[13px] font-bold text-black mb-2">On iOS (Safari) 🍎</div>
        <Steps items={["Tap the Share button (box+arrow) in Safari", "Scroll and tap \"Add to Home Screen\"", "Name it \"Spandly\" → tap Add", "Icon appears on your home screen!"]} />
      </div>
      <div className="rounded-[20px] bg-white border border-black/5 p-4">
        <div className="text-[13px] font-bold text-black mb-2">On Android (Chrome) 🤖</div>
        <Steps items={["Tap the 3-dot menu in Chrome", "Tap \"Add to Home Screen\" or \"Install App\"", "Tap Install / Add", "Spandly appears on your home screen!"]} />
      </div>

      <button onClick={install} className="w-full h-12 rounded-full bg-black text-white font-bold text-[14px]">Install Spandly App</button>
      {toast && <Toast text={toast} />}
    </Shell>
  );
}

function Steps({ items }: { items: string[] }) {
  return (
    <ol className="space-y-2">
      {items.map((s, i) => (
        <li key={i} className="flex gap-2 text-[12px] text-black/75">
          <span className="w-5 h-5 shrink-0 rounded-full bg-black text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
          {s}
        </li>
      ))}
    </ol>
  );
}
