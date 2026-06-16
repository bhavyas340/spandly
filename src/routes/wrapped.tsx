import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

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

function WrappedPage() {
  const month = new Date().toLocaleDateString("en-IN", { month: "long" });
  const share = async () => {
    const text = `My ${month} spending wrapped 📊 Check yours on Spandly! https://spandly.lovable.app`;
    if (navigator.share) {
      try { await navigator.share({ title: "Spandly Wrapped", text }); return; } catch {}
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
          <h1 className="text-[22px] font-bold text-black">📊 My Wrapped</h1>
        </div>

        <div
          className="rounded-[28px] p-6 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.4)]"
          style={{ background: "linear-gradient(160deg,#1a1a1a 0%,#3a1f5c 60%,#FF7A3D 100%)" }}
        >
          <div className="text-[11px] uppercase tracking-[0.2em] font-semibold text-white/60">Spendly Wrapped</div>
          <div className="text-[32px] font-bold text-white leading-tight mt-1">Your {month} in ₹</div>

          <div className="mt-5">
            <Row label="🍕 Top category" value="Food  ₹2,400" />
            <Row label="🔥 Streak" value="14 days strong" />
            <Row label="😬 Worst day" value="May 12 · ₹890" />
            <Row label="💸 Total spent" value="₹8,640" />
          </div>

          <div className="mt-5 rounded-2xl bg-white/10 backdrop-blur p-4 border border-white/15">
            <div className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Personality</div>
            <div className="text-[20px] font-bold text-white mt-1">Chai Ritualist ☕</div>
          </div>
        </div>

        <button
          onClick={share}
          className="mt-5 w-full h-12 rounded-full bg-black text-white font-bold text-[15px] shadow-md"
        >
          Share to Instagram / WhatsApp
        </button>

        <div className="text-center text-[12px] text-black/40 mt-5">
          Personalized with your real data — coming soon!
        </div>
      </div>
    </div>
  );
}
