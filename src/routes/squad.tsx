import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/squad")({
  component: SquadPage,
  head: () => ({
    meta: [
      { title: "Squad Battle — Track spending with friends | Spendly" },
      { name: "description", content: "Invite friends into a Squad Battle and see who saves more each week. A friendly kanjoos leaderboard, powered by Spendly." },
      { property: "og:title", content: "Squad Battle — Track spending with friends" },
      { property: "og:description", content: "A friendly weekly savings leaderboard with your friends." },
      { property: "og:url", content: "https://spandly.lovable.app/squad" },
    ],
    links: [{ rel: "canonical", href: "https://spandly.lovable.app/squad" }],
  }),
});

const SHARE_TEXT =
  "I'm tracking my spending on Spandly this week. Let's see who's more kanjoos 😂 Join: https://spandly.lovable.app";

function SquadPage() {
  const [toast, setToast] = useState<string | null>(null);

  const challenge = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Spandly Squad Battle", text: SHARE_TEXT });
        return;
      } catch {}
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(SHARE_TEXT)}`, "_blank");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const rows = [
    { rank: "🥇", name: "You", amount: 420, you: true },
    { rank: "🥈", name: "Rahul", amount: 680, you: false },
    { rank: "🥉", name: "Priya", amount: 890, you: false },
  ];

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#ECECEC" }}>
      <div className="w-full max-w-[440px] flex flex-col px-5 pb-12">
        <div className="flex items-center gap-3 pt-6 pb-4">
          <Link to="/app" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-black/70">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-[22px] font-bold text-black">⚔️ Squad Battle</h1>
        </div>
        <div className="text-[14px] text-black/60 mb-5">Who's the most kanjoos this week?</div>

        <div className="rounded-[24px] bg-white border border-black/5 shadow-sm overflow-hidden">
          {rows.map((r, i) => (
            <div
              key={r.name}
              className={`flex items-center justify-between px-5 py-4 ${i > 0 ? "border-t border-black/5" : ""} ${
                r.you ? "bg-[linear-gradient(160deg,#C8F08A_0%,#7BD3D1_60%,#FFD27A_100%)]" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{r.rank}</span>
                <div>
                  <div className="text-[15px] font-bold text-black">{r.name}</div>
                  {r.you && <div className="text-[11px] uppercase tracking-wider font-semibold text-black/50">You</div>}
                </div>
              </div>
              <div className="text-[18px] font-bold text-black" style={{ fontFamily: "'Courier New', monospace" }}>
                ₹{r.amount}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={challenge}
          className="mt-5 w-full h-12 rounded-full bg-black text-white font-bold text-[15px] shadow-md"
        >
          Challenge a Friend
        </button>
        <button
          onClick={() => showToast("Coming soon! Invite your squad.")}
          className="mt-3 w-full h-12 rounded-full bg-white text-black font-bold text-[15px] border border-black/10 shadow-sm"
        >
          New Challenge
        </button>

        <div className="text-center text-[12px] text-black/40 mt-6">
          Real-time squad battles coming soon. For now, settle it manually 😄
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
