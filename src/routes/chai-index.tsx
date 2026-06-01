import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Share2, Download } from "lucide-react";
import { Shell, SectionTitle, EmptyCard, Toast } from "./spend-dna";
import { getMonthExpenses, getCategoryTotals } from "@/lib/spandlyStorage";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/chai-index")({
  component: ChaiIndex,
  head: () => ({ meta: [{ title: "Spendly — Chai Index" }] }),
});

// Anonymized city averages (₹/month per category) — illustrative benchmarks
const CITY_AVG: Record<string, Record<string, number>> = {
  Mumbai: { Food: 4200, Transport: 2800, Shopping: 3500, Groceries: 5200, Bills: 2400, Subscription: 800, Health: 1200, Other: 1500 },
  Delhi:  { Food: 3600, Transport: 2200, Shopping: 3200, Groceries: 4800, Bills: 2200, Subscription: 700, Health: 1100, Other: 1400 },
  Bengaluru: { Food: 4500, Transport: 2600, Shopping: 3400, Groceries: 5000, Bills: 2300, Subscription: 900, Health: 1300, Other: 1500 },
  Pune:   { Food: 2100, Transport: 1800, Shopping: 2400, Groceries: 3600, Bills: 1800, Subscription: 600, Health: 900,  Other: 1200 },
  Hyderabad: { Food: 2800, Transport: 1900, Shopping: 2700, Groceries: 3800, Bills: 1900, Subscription: 650, Health: 1000, Other: 1300 },
  Chennai: { Food: 2600, Transport: 1700, Shopping: 2500, Groceries: 3700, Bills: 1800, Subscription: 600, Health: 950,  Other: 1200 },
  Kolkata: { Food: 2300, Transport: 1500, Shopping: 2200, Groceries: 3400, Bills: 1600, Subscription: 500, Health: 850,  Other: 1100 },
  Ahmedabad:{Food: 2200, Transport: 1600, Shopping: 2300, Groceries: 3500, Bills: 1700, Subscription: 550, Health: 900,  Other: 1100 },
};
const CITIES = Object.keys(CITY_AVG);

const QUIPS = [
  (p: number, c: string, city: string) => p > 0 ? `You're ${p}% above ${city}'s average on ${c}. Tapri walla is sending you blessings 🙏` : `You're ${Math.abs(p)}% below ${city}'s average on ${c}. Aukaat mein rehna kya bolte hain 💪`,
  (p: number, c: string) => p > 30 ? `${c} is your weakness, boss. Maa ko mat batana 🤐` : `${c} controlled — ekdum chacha-approved 👍`,
];

function ChaiIndex() {
  const [mounted, setMounted] = useState(false);
  const [city, setCity] = useLocalState<string>("spandly.city", "Pune");
  const [toast, setToast] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  useEffect(() => setMounted(true), []);

  const now = new Date();
  const monthLabel = now.toLocaleDateString("en-IN", { month: "long" });
  const exp = mounted ? getMonthExpenses(now.getMonth(), now.getFullYear()) : [];
  const cats = getCategoryTotals(exp);

  const comparisons = useMemo(() => {
    const avgMap = CITY_AVG[city] || CITY_AVG.Pune;
    return cats.map((c) => {
      const avg = avgMap[c.category] || avgMap.Other;
      const pct = Math.round(((c.total - avg) / avg) * 100);
      return { ...c, avg, pct };
    });
  }, [cats, city]);

  const top = comparisons[0];

  const share = async () => {
    if (!top) return;
    const text = `🍛 My Chai Index — ${monthLabel}\n${top.category}: ₹${top.total.toLocaleString("en-IN")} (${city} avg: ₹${top.avg.toLocaleString("en-IN")})\nI'm ${top.pct > 0 ? top.pct + "% above" : Math.abs(top.pct) + "% below"} city average!\n\nGet yours → https://spandly.lovable.app`;
    if (navigator.share) { try { await navigator.share({ text }); return; } catch {} }
    try { await navigator.clipboard.writeText(text); setToast("Copied!"); setTimeout(() => setToast(null), 1600); } catch {}
  };

  const download = async () => {
    if (!cardRef.current) return;
    const { default: html2canvas } = await import("html2canvas");
    const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
    const link = document.createElement("a"); link.download = `chai-index-${monthLabel}.png`; link.href = canvas.toDataURL("image/png"); link.click();
    setToast("Saved!"); setTimeout(() => setToast(null), 1500);
  };

  return (
    <Shell title="🍛 Chai Index">
      <SectionTitle>Your city</SectionTitle>
      <div className="flex gap-2 flex-wrap">
        {CITIES.map((c) => (
          <button key={c} onClick={() => setCity(c)} className={`px-3 h-9 rounded-full text-[12px] font-bold ${city === c ? "bg-black text-white" : "bg-white border border-black/10 text-black"}`}>{c}</button>
        ))}
      </div>

      {exp.length === 0 ? (
        <EmptyCard text="Log expenses this month to see your Chai Index." cta />
      ) : (
        <>
          <div ref={cardRef} className="rounded-[24px] p-6 text-white shadow-lg relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FF7A3D 0%, #EF9F27 60%, #b85e1f 100%)" }}>
            <div className="absolute -top-6 -right-6 text-[120px] opacity-10">🍛</div>
            <div className="text-[11px] uppercase tracking-[0.15em] font-bold opacity-90">Chai Index · {monthLabel}</div>
            <div className="text-[22px] font-bold mt-1">{city} edition</div>
            {top && (
              <>
                <div className="mt-4 text-[12px] uppercase tracking-wider opacity-90">Top category</div>
                <div className="text-[28px] font-bold leading-tight">{top.category}</div>
                <div className="text-[14px] mt-1">You: <b>₹{top.total.toLocaleString("en-IN")}</b> · {city}: ₹{top.avg.toLocaleString("en-IN")}</div>
                <div className="mt-4 inline-block px-3 py-1.5 rounded-full bg-white/25 backdrop-blur text-[13px] font-bold">
                  {top.pct > 0 ? `↑ ${top.pct}% above` : `↓ ${Math.abs(top.pct)}% below`} city avg
                </div>
                <div className="text-[13px] mt-4 italic opacity-95">"{QUIPS[0](top.pct, top.category, city)}"</div>
              </>
            )}
            <div className="mt-5 pt-4 border-t border-white/20 text-[11px] opacity-80">spandly.lovable.app · anonymized</div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button onClick={share} className="h-11 rounded-full bg-black text-white font-bold text-[13px] inline-flex items-center justify-center gap-2"><Share2 size={14}/> Share</button>
            <button onClick={download} className="h-11 rounded-full bg-white border border-black/10 font-bold text-[13px] inline-flex items-center justify-center gap-2"><Download size={14}/> Save PNG</button>
          </div>

          <SectionTitle>All categories vs {city}</SectionTitle>
          <div className="rounded-[20px] bg-white border border-black/5 divide-y divide-black/5">
            {comparisons.map((c) => (
              <div key={c.category} className="px-4 py-3 flex items-center gap-3">
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-black">{c.category}</div>
                  <div className="text-[11px] text-black/50">You ₹{c.total.toLocaleString("en-IN")} · {city} ₹{c.avg.toLocaleString("en-IN")}</div>
                </div>
                <div className={`text-[12px] font-bold px-2 py-1 rounded-full ${c.pct > 0 ? "bg-red-50 text-red-600" : "bg-green-50 text-green-700"}`}>
                  {c.pct > 0 ? "+" : ""}{c.pct}%
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-black/40 px-2">City averages are anonymized aggregates. Individual data never stored server-side.</div>
        </>
      )}

      {toast && <Toast text={toast} />}
    </Shell>
  );
}
