import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Share2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getExpenses, getCategoryTotals, getStreak, getMonthExpenses } from "@/lib/spandlyStorage";

export const Route = createFileRoute("/wrapped")({
  component: WrappedPage,
  head: () => ({
    meta: [
      { title: "My Wrapped — Your month in money | Spendly" },
      { name: "description", content: "Your monthly spending story in one shareable card. See where your money went and what changed with Spendly Wrapped." },
      { property: "og:title", content: "My Wrapped — Your month in money" },
      { property: "og:description", content: "Your monthly spending story in one shareable card." },
      { property: "og:url", content: "https://spandly.lovable.app/wrapped" },
    ],
    links: [{ rel: "canonical", href: "https://spandly.lovable.app/wrapped" }],
  }),
});

const CAT_EMOJI: Record<string, string> = {
  Food: "🍕", Travel: "🛺", Transport: "🚕", Bills: "💡", Shopping: "🛍️",
  Chai: "☕", Subscription: "📺", Groceries: "🛒", Health: "💊", Other: "💸",
};

function WrappedPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const now = new Date();
  const month = now.toLocaleDateString("en-IN", { month: "long" });

  const data = useMemo(() => {
    if (!mounted) return null;
    const all = getExpenses();
    if (all.length === 0) return null;
    const monthExp = getMonthExpenses(now.getMonth(), now.getFullYear());
    const total = monthExp.reduce((s, e) => s + Number(e.amount || 0), 0);
    const cats = getCategoryTotals(monthExp);
    const top = cats[0];
    const streak = getStreak();
    // worst day
    const dayMap = new Map<string, number>();
    for (const e of monthExp) {
      const d = new Date(Number(e.createdAt ?? e.date ?? 0));
      const k = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
      dayMap.set(k, (dayMap.get(k) || 0) + Number(e.amount || 0));
    }
    const worst = dayMap.size
      ? Array.from(dayMap.entries()).reduce((a, b) => (a[1] > b[1] ? a : b))
      : null;
    const persona =
      streak >= 14 ? "Iron Saver 🛡️" :
      streak >= 7 ? "Steady Hand ✋" :
      total > 0 ? "Chai Ritualist ☕" : "The Ghost 👻";
    return { total, top, streak, worst, persona, monthExp };
  }, [mounted]);

  const share = async () => {
    const text = data
      ? `My ${month} on Spendly 📊 ₹${data.total} spent · ${data.streak}-day streak · ${data.persona}. Check yours → https://spandly.lovable.app`
      : `Tracking my kharcha on Spendly 📊 https://spandly.lovable.app`;
    if (navigator.share) {
      try { await navigator.share({ title: "Spendly Wrapped", text }); return; } catch {}
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  const Row = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-white/15 last:border-0">
      <span className="text-[13px] text-white/70">{label}</span>
      <span className="text-[15px] font-bold text-white">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#ECECEC" }}>
      <div className="w-full max-w-[440px] flex flex-col px-5 pb-12">
        <div className="flex items-center gap-3 pt-6 pb-4">
          <Link to="/app" className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-black/70">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="text-[22px] font-bold text-black flex-1">📊 My Wrapped</h1>
          <button
            onClick={share}
            className="h-10 px-4 rounded-full bg-black text-white text-[13px] font-bold inline-flex items-center gap-1.5 shadow-sm"
            aria-label="Share Wrapped"
          >
            <Share2 size={14} /> Share
          </button>
        </div>

        {mounted && !data ? (
          <div
            className="rounded-[28px] p-6 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.4)] text-center"
            style={{ background: "linear-gradient(160deg,#1a1a1a 0%,#3a1f5c 60%,#FF7A3D 100%)" }}
          >
            <div className="text-[40px] mb-2">📭</div>
            <div className="text-[18px] font-bold text-white">Your Wrapped is empty</div>
            <div className="text-[13px] text-white/70 mt-2">Come back after a month of logging!</div>
            <Link to="/app" className="inline-block mt-5 h-11 px-5 leading-[44px] rounded-full bg-white text-black font-bold text-[13px]">
              Log your first expense →
            </Link>
          </div>
        ) : (
          <div
            className="rounded-[28px] p-6 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.4)]"
            style={{ background: "linear-gradient(160deg,#1a1a1a 0%,#3a1f5c 60%,#FF7A3D 100%)" }}
          >
            <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white/60">Spendly Wrapped</div>
            <div className="text-[32px] font-bold text-white leading-tight mt-1">Your {month} in ₹</div>

            <div className="mt-5">
              <Row
                label={`${data?.top ? CAT_EMOJI[data.top.category] || "•" : "🍕"} Top category`}
                value={data?.top ? `${data.top.category}  ₹${data.top.total}` : "—"}
              />
              <Row label="🔥 Streak" value={`${data?.streak ?? 0} days strong`} />
              <Row
                label="😬 Worst day"
                value={data?.worst ? `${data.worst[0]} · ₹${data.worst[1]}` : "—"}
              />
              <Row label="💸 Total spent" value={`₹${data?.total ?? 0}`} />
            </div>

            <div className="mt-5 rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/15">
              <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Personality</div>
              <div className="text-[20px] font-bold text-white mt-1">{data?.persona ?? "Chai Ritualist ☕"}</div>
            </div>
          </div>
        )}

        <button
          onClick={share}
          className="mt-5 w-full h-12 rounded-full bg-black text-white font-bold text-[15px] shadow-md inline-flex items-center justify-center gap-2"
        >
          <Share2 size={16} /> Share to Instagram / WhatsApp
        </button>
      </div>
    </div>
  );
}
