import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Share2, Download } from "lucide-react";
import { Shell, SectionTitle, Toast } from "./spend-dna";
import { getMonthExpenses, getStreak, getCategoryTotals } from "@/lib/spandlyStorage";

export const Route = createFileRoute("/whatsapp-share")({
  component: WhatsAppShare,
  head: () => ({ meta: [{ title: "Spendly — Share on WhatsApp" }] }),
});

function WhatsAppShare() {
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const exp = mounted ? getMonthExpenses(now.getMonth(), now.getFullYear()) : [];
  const total = exp.reduce((s, e) => s + Number(e.amount || 0), 0);
  const top3 = getCategoryTotals(exp).slice(0, 3);
  const streak = mounted ? getStreak() : 0;

  const message = `📊 My Spendly ${monthLabel} Report\n💸 Total: ₹${total.toLocaleString("en-IN")}\n🔥 Streak: ${streak} days\n${top3.map((t, i) => `${["🥇","🥈","🥉"][i]} ${t.category}: ₹${t.total.toLocaleString("en-IN")}`).join("\n")}\n\nTrack yours → https://spandly.lovable.app`;

  const shareWA = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
      const link = document.createElement("a");
      link.download = `spendly-${monthLabel.replace(" ", "-")}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setToast("Image saved!"); setTimeout(() => setToast(null), 1600);
    } catch {
      setToast("Couldn't save image"); setTimeout(() => setToast(null), 1600);
    }
  };

  const enableReminder = () => {
    if (!("Notification" in window)) { setToast("Notifications not supported"); setTimeout(() => setToast(null), 1600); return; }
    Notification.requestPermission().then((p) => {
      if (p === "granted") {
        try { localStorage.setItem("spandly.wa_reminder", "1"); } catch {}
        setToast("Daily 9 PM reminder on"); setTimeout(() => setToast(null), 1800);
      } else { setToast("Permission denied"); setTimeout(() => setToast(null), 1600); }
    });
  };

  return (
    <Shell title="💬 Share on WhatsApp">
      <SectionTitle>Your shareable card</SectionTitle>
      <div ref={cardRef} className="rounded-[24px] p-6 text-white shadow-lg" style={{ background: "linear-gradient(135deg, #1D9E75 0%, #0d6e4f 60%, #064234 100%)" }}>
        <div className="text-[11px] uppercase tracking-[0.15em] font-bold opacity-80">Spendly Report</div>
        <div className="text-[26px] font-bold mt-1">{monthLabel}</div>
        <div className="mt-5 text-[12px] uppercase tracking-wider opacity-80">Total spent</div>
        <div className="text-[40px] font-bold leading-none">₹{total.toLocaleString("en-IN")}</div>
        <div className="mt-4 text-[12px] uppercase tracking-wider opacity-80">Top categories</div>
        {top3.length === 0 ? (
          <div className="text-[13px] opacity-70 mt-1">No data yet</div>
        ) : (
          <div className="mt-2 space-y-1.5">
            {top3.map((t, i) => (
              <div key={t.category} className="flex justify-between text-[14px] font-semibold">
                <span>{["🥇","🥈","🥉"][i]} {t.category}</span>
                <span>₹{t.total.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        )}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/20">
          <div className="text-[13px] font-bold">🔥 {streak}-day streak</div>
          <div className="text-[11px] opacity-80">spandly.lovable.app</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={shareWA} className="h-12 rounded-full bg-[#25D366] text-white font-bold text-[14px] inline-flex items-center justify-center gap-2"><Share2 size={16}/> WhatsApp</button>
        <button onClick={downloadCard} className="h-12 rounded-full bg-black text-white font-bold text-[14px] inline-flex items-center justify-center gap-2"><Download size={16}/> Save PNG</button>
      </div>

      <SectionTitle>Daily reminder</SectionTitle>
      <div className="rounded-[20px] bg-white border border-black/5 p-4 flex items-center gap-3">
        <span className="text-2xl">🔔</span>
        <div className="flex-1">
          <div className="text-[14px] font-bold text-black">9 PM daily nudge</div>
          <div className="text-[12px] text-black/50">Get reminded to log + share on WhatsApp.</div>
        </div>
        <button onClick={enableReminder} className="h-9 px-4 rounded-full bg-black text-white text-[12px] font-bold">Enable</button>
      </div>

      <SectionTitle>For developers (future)</SectionTitle>
      <div className="rounded-[20px] bg-white border border-black/5 p-4 text-[12px] text-black/60 leading-relaxed font-mono">
        WhatsApp Business API webhook → POST /api/wa/inbound<br/>
        body: {`{ from, text: "chai 20", timestamp }`}<br/>
        parser: regex /^(\w+)\s+(\d+)/ → label, amount<br/>
        auto-log under sender's linked Spendly account.
      </div>

      {toast && <Toast text={toast} />}
    </Shell>
  );
}
