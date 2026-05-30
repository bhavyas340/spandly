import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/challenges")({
  component: ChallengesPage,
  head: () => ({ meta: [{ title: "Spendly — Challenges" }] }),
});

type Challenge = { id: string; emoji: string; name: string; desc: string; days: number };

const CHALLENGES: Challenge[] = [
  { id: "swiggy", emoji: "🍕", name: "No Swiggy Week", desc: "Skip food delivery for 7 days.", days: 7 },
  { id: "chai", emoji: "☕", name: "Ghar Wali Chai", desc: "No chai from outside for 5 days.", days: 5 },
  { id: "walk", emoji: "🚗", name: "Walk It Off", desc: "No auto/cab for 3 days.", days: 3 },
  { id: "impulse", emoji: "🛒", name: "Zero Impulse", desc: "No unplanned shopping for 10 days.", days: 10 },
];

type ActiveMap = Record<string, number>; // id -> startedAt ms

function ChallengesPage() {
  const [active, setActive] = useLocalState<ActiveMap>("spendly.challenges", {});
  const [toast, setToast] = useState<string | null>(null);

  const start = (c: Challenge) => {
    setActive((prev) => ({ ...prev, [c.id]: Date.now() }));
    setToast("Challenge started! We'll remind you. 💪");
    setTimeout(() => setToast(null), 2200);
  };

  const activeList = useMemo(() => {
    const now = Date.now();
    return Object.entries(active)
      .map(([id, ts]) => {
        const c = CHALLENGES.find((x) => x.id === id);
        if (!c) return null;
        const elapsed = Math.floor((now - ts) / (1000 * 60 * 60 * 24));
        const remaining = Math.max(0, c.days - elapsed);
        return { ...c, remaining };
      })
      .filter(Boolean) as (Challenge & { remaining: number })[];
  }, [active]);

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#ECECEC" }}>
      <div className="w-full max-w-[440px] flex flex-col px-5 pb-12">
        <div className="flex items-center gap-3 pt-6 pb-4">
          <Link to="/app" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-black/70">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-[22px] font-bold text-black">🎯 Challenges</h1>
        </div>
        <div className="text-[14px] text-black/60 mb-5">Pick a challenge. Stay honest. Win bragging rights.</div>

        <div className="flex flex-col gap-3">
          {CHALLENGES.map((c) => {
            const isActive = !!active[c.id];
            return (
              <div key={c.id} className="rounded-[22px] bg-white border border-black/5 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{c.emoji}</span>
                      <span className="text-[16px] font-bold text-black">{c.name}</span>
                      {isActive && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-[13px] text-black/60 mt-1">{c.desc}</div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-black/40 mt-1">{c.days} days</div>
                  </div>
                  <button
                    onClick={() => start(c)}
                    disabled={isActive}
                    className="shrink-0 h-9 px-3 rounded-full bg-black text-white font-bold text-[12px] disabled:opacity-40"
                  >
                    {isActive ? "Started" : "Start Challenge"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-7">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-black/50 mb-2">Active Challenges</div>
          {activeList.length === 0 ? (
            <div className="rounded-[20px] bg-white/70 border border-black/5 p-4 text-[13px] text-black/50 text-center">
              No active challenges yet. Pick one above!
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {activeList.map((a) => (
                <div key={a.id} className="rounded-[18px] bg-white border border-black/5 p-3 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{a.emoji}</span>
                    <span className="text-[14px] font-bold text-black">{a.name}</span>
                  </div>
                  <span className="text-[12px] font-semibold text-black/60">
                    {a.remaining === 0 ? "Complete!" : `${a.remaining} day${a.remaining === 1 ? "" : "s"} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {toast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black text-white text-[13px] font-semibold px-5 py-3 rounded-full shadow-lg z-50">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
