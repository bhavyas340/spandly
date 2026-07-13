import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Shell, SectionTitle } from "./spend-dna";
import { getCategoryTotals, getMonthExpenses } from "@/lib/spandlyStorage";

export const Route = createFileRoute("/city-pulse")({
  component: CityPulse,
  head: () => ({
    meta: [
      { title: "City Pulse — How your city is spending this week | Spendly" },
      { name: "description", content: "See real-time spending trends across Mumbai, Delhi, Bengaluru, Pune and more Indian cities — food, auto, chai and bills — with Spendly City Pulse." },
      { property: "og:title", content: "City Pulse — How your city is spending this week" },
      { property: "og:description", content: "Weekly spending trends across major Indian cities — food, auto, chai and bills." },
      { property: "og:url", content: "https://spandly.lovable.app/city-pulse" },
    ],
    links: [{ rel: "canonical", href: "https://spandly.lovable.app/city-pulse" }],
  }),
});

const CITIES = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Ahmedabad", "Kolkata", "Jaipur", "Surat"];
const BENCH: Record<string, Record<string, number>> = {
  Pune:      { Food: 3200, Auto: 1800, Chai: 600, Shopping: 2400, Bills: 1200 },
  Mumbai:    { Food: 4100, Auto: 2600, Chai: 800, Shopping: 3200, Bills: 1800 },
  Bengaluru: { Food: 3800, Auto: 2200, Chai: 750, Shopping: 2900, Bills: 1500 },
  Delhi:     { Food: 3500, Auto: 1900, Chai: 650, Shopping: 2700, Bills: 1300 },
  Hyderabad: { Food: 2900, Auto: 1600, Chai: 550, Shopping: 2200, Bills: 1100 },
  Chennai:   { Food: 2800, Auto: 1500, Chai: 500, Shopping: 2000, Bills: 1000 },
  Ahmedabad: { Food: 2600, Auto: 1300, Chai: 450, Shopping: 1900, Bills: 900 },
  Kolkata:   { Food: 2500, Auto: 1200, Chai: 400, Shopping: 1800, Bills: 850 },
  Jaipur:    { Food: 2400, Auto: 1100, Chai: 380, Shopping: 1700, Bills: 800 },
  Surat:     { Food: 2700, Auto: 1400, Chai: 480, Shopping: 2100, Bills: 950 },
};
const ICONS: Record<string, string> = { Food: "🍱", Auto: "🛺", Chai: "☕", Shopping: "🛍️", Bills: "💡" };

const TRENDS: Record<string, string[]> = {
  Pune: [
    "🍕 Food delivery up 12% this week — long weekend effect",
    "🚗 Auto fares stable — good week to commute",
    "☕ Chai prices stable — ₹20–25 range holding",
    "🛒 Weekend shopping spike in Koregaon Park",
    "💡 Electricity bills up — summer peak",
  ],
  Mumbai: [
    "🍕 Swiggy orders up 15% — rain season delivery surge",
    "🚗 Auto fares up 8% — rain premium",
    "☕ Café spending up in Bandra — weekend crowd",
    "🛒 Mall footfall up — air-conditioned escape",
    "💡 AC bills spiking — Mumbai heat",
  ],
};
const fallbackTrends = (city: string) => [
  `🍕 Food delivery trending up in ${city} this week`,
  `🚗 Auto fares stable across ${city}`,
  `☕ Chai prices steady`,
  `🛒 Weekend shopping spike in central areas`,
  `💡 Bills up — seasonal peak`,
];

function CityPulse() {
  const [mounted, setMounted] = useState(false);
  const [city, setCity] = useState("Pune");
  const [picker, setPicker] = useState(false);

  useEffect(() => {
    setMounted(true);
    try { const c = localStorage.getItem("spandly_city"); if (c) setCity(c); } catch {}
  }, []);
  useEffect(() => { if (mounted) { try { localStorage.setItem("spandly_city", city); } catch {} } }, [city, mounted]);

  const now = new Date();
  const monthExp = mounted ? getMonthExpenses(now.getMonth(), now.getFullYear()) : [];
  const userTotals = useMemo(() => {
    const map: Record<string, number> = {};
    for (const { category, total } of getCategoryTotals(monthExp)) {
      const key = Object.keys(ICONS).find((k) => category.toLowerCase().includes(k.toLowerCase())) || category;
      map[key] = (map[key] || 0) + total;
    }
    return map;
  }, [monthExp]);

  const bench = BENCH[city];
  const cats = Object.keys(ICONS);
  const userSum = cats.reduce((s, c) => s + (userTotals[c] || 0), 0);
  const cityAvgSum = cats.reduce((s, c) => s + bench[c], 0);
  const ratio = cityAvgSum ? userSum / cityAvgSum : 0;
  const percentile = userSum === 0 ? "top 80%" : ratio < 0.6 ? "top 10%" : ratio < 0.8 ? "top 25%" : ratio < 1.0 ? "top 40%" : ratio < 1.2 ? "top 60%" : "top 80%";
  const trends = TRENDS[city] ?? fallbackTrends(city);

  const badgeFor = (u: number, avg: number) => {
    const r = avg ? u / avg : 0;
    if (u === 0) return { label: "No data", color: "#888", comment: "Log expenses to see your comparison." };
    if (r < 0.8) return { label: "Top saver 🌟", color: "#1D9E75", comment: "Bhai wallet pe control hai! 💪" };
    if (r <= 1) return { label: "Below avg ✓", color: "#1D9E75", comment: "Thoda achha chal raha hai ✓" };
    if (r <= 1.2) return { label: "Near avg", color: "#EF9F27", comment: "Theek hai yaar, normal hai" };
    return { label: "Above avg", color: "#EF4444", comment: "Zara dhyan do bhai 👀" };
  };

  return (
    <Shell title="🏙️ City Pulse">
      <div className="rounded-[24px] bg-white border border-black/5 p-5">
        <div className="text-[20px] font-bold text-black">📍 {city}</div>
        <button onClick={() => setPicker((v) => !v)} className="text-[12px] font-semibold text-[#1D9E75] mt-1">Change city</button>
        {picker && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            {CITIES.map((c) => (
              <button key={c} onClick={() => { setCity(c); setPicker(false); }} className={`h-10 rounded-full text-[13px] font-semibold border ${c === city ? "bg-black text-white border-black" : "bg-white text-black border-black/10"}`}>{c}</button>
            ))}
          </div>
        )}
      </div>

      <SectionTitle>Category benchmarks</SectionTitle>
      <div className="rounded-[20px] bg-white border border-black/5 divide-y divide-black/5">
        {cats.map((c) => {
          const u = userTotals[c] || 0;
          const avg = bench[c];
          const max = Math.max(u, avg) * 1.1;
          const b = badgeFor(u, avg);
          return (
            <div key={c} className="p-3">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-bold text-black flex items-center gap-2"><span>{ICONS[c]}</span>{c}</div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: b.color }}>{b.label}</span>
              </div>
              <div className="mt-2 space-y-1">
                <div className="h-2 rounded-full bg-black/10 relative overflow-hidden"><div className="absolute inset-y-0 left-0 bg-black/30" style={{ width: `${(avg / max) * 100}%` }} /></div>
                <div className="h-2 rounded-full bg-black/5 relative overflow-hidden"><div className="absolute inset-y-0 left-0" style={{ width: `${(u / max) * 100}%`, background: b.color }} /></div>
              </div>
              <div className="flex justify-between text-[11px] text-black/55 mt-1">
                <span>City avg ₹{avg}</span><span>You ₹{u}</span>
              </div>
              <div className="text-[11px] text-black/60 mt-1">{b.comment}</div>
            </div>
          );
        })}
      </div>

      <SectionTitle>City trends this week</SectionTitle>
      <div className="rounded-[20px] bg-white border border-black/5 divide-y divide-black/5">
        {trends.map((t, i) => (
          <div key={i} className="p-3 text-[13px] text-black">{t}</div>
        ))}
      </div>
      <div className="text-[10px] text-black/40 text-center">Powered by Spandly community data · Updated weekly</div>

      <SectionTitle>City rank</SectionTitle>
      <div className="rounded-[24px] bg-white border border-black/5 p-5">
        <div className="text-[15px] font-bold text-black">You rank in the {percentile} of savers in {city}</div>
        <div className="mt-3 h-2 rounded-full bg-black/10 overflow-hidden">
          <div className="h-full" style={{ width: `${Math.min(100, Math.max(8, (1 - Math.min(1.2, ratio || 1.2) / 1.5) * 100))}%`, background: "#1D9E75" }} />
        </div>
      </div>
    </Shell>
  );
}
