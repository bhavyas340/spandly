import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Shell, SectionTitle } from "./spend-dna";
import { getMonthExpenses } from "@/lib/spandlyStorage";

export const Route = createFileRoute("/month-forecast")({
  component: MonthForecast,
  head: () => ({
    meta: [
      { title: "Month Forecast — Where you'll land this month | Spendly" },
      { name: "description", content: "Project your month-end total from your current pace and compare it to your usual monthly spend with Spendly's Month Forecast." },
      { property: "og:title", content: "Month Forecast — Where you'll land this month" },
      { property: "og:description", content: "Project your month-end total and compare it to your usual monthly spend." },
      { property: "og:url", content: "https://spandly.lovable.app/month-forecast" },
    ],
    links: [{ rel: "canonical", href: "https://spandly.lovable.app/month-forecast" }],
  }),
});

function MonthForecast() {
  const [mounted, setMounted] = useState(false);
  const [usual, setUsual] = useState(8000);
  useEffect(() => {
    setMounted(true);
    try { const v = localStorage.getItem("spandly_usual_monthly"); if (v) setUsual(Number(v) || 8000); } catch {}
  }, []);
  useEffect(() => { if (mounted) try { localStorage.setItem("spandly_usual_monthly", String(usual)); } catch {} }, [usual, mounted]);

  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  const dayOfMonth = now.getDate();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const exp = mounted ? getMonthExpenses(month, year) : [];
  const currentTotal = exp.reduce((s, e) => s + Number(e.amount || 0), 0);
  const dailyAvg = currentTotal / Math.max(1, dayOfMonth);
  const projected = Math.round((dailyAvg * daysInMonth) / 10) * 10;
  const delta = Math.abs(projected - usual);
  const daysRemaining = Math.max(0, daysInMonth - dayOfMonth);
  const perDayBudget = Math.max(0, Math.round((usual - currentTotal) / Math.max(1, daysRemaining)));
  const onTrack = projected <= usual;

  const verdict = useMemo(() => {
    if (dayOfMonth <= 5) return "Too early to call bhai. Log more days and come back.";
    if (projected <= usual * 0.8) return `Arre wah! At this pace you'll finish ₹${delta} under budget. ${daysRemaining} days bache hain — don't let your guard down.`;
    if (projected <= usual) return "Chal raha hai theek se. Just under your usual. Keep logging daily and close strong.";
    if (projected <= usual * 1.2) return `Zara dhyan do. On pace to go ₹${delta} over. ${daysRemaining} days left — cut 2–3 unnecessary spends to recover.`;
    return `Bhai, red flag. Projected overshoot: ₹${delta}. In ${daysRemaining} days spend under ₹${perDayBudget}/day to recover.`;
  }, [dayOfMonth, projected, usual, delta, daysRemaining, perDayBudget]);

  // per-day totals
  const perDay: number[] = Array.from({ length: daysInMonth }, () => 0);
  for (const e of exp) {
    const d = new Date(Number(e.createdAt ?? e.date ?? 0));
    perDay[d.getDate() - 1] += Number(e.amount || 0);
  }
  const maxBar = Math.max(...perDay, dailyAvg, 1);

  return (
    <Shell title="📅 Month Forecast">
      <div className="rounded-[24px] bg-white p-5 border-2" style={{ borderColor: onTrack ? "#1D9E75" : "#EF4444" }}>
        <div className="text-[11px] uppercase tracking-wider font-semibold text-black/40">Day {dayOfMonth} of {daysInMonth}</div>
        <div className="text-[42px] font-bold text-black leading-none mt-1" style={{ fontFamily: "'Courier New', monospace", letterSpacing: "-0.02em" }}>₹{projected}</div>
        <div className="text-[12px] text-black/55 mt-1">Your usual: ₹{usual}</div>
        <span className="inline-block mt-3 text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: onTrack ? "#1D9E75" : "#EF4444" }}>
          ₹{delta} {onTrack ? "under" : "over"}
        </span>
        <div className="mt-4 rounded-2xl bg-black/5 px-3 py-2 flex items-center gap-2">
          <span className="text-[12px] text-black/60">My usual monthly budget: ₹</span>
          <input value={usual} onChange={(e) => setUsual(Math.max(0, Number(e.target.value.replace(/[^\d]/g, "")) || 0))} inputMode="numeric" className="w-24 bg-transparent outline-none text-[14px] font-bold text-black" />
        </div>
      </div>

      <div className="rounded-[20px] p-4 text-[14px] text-black" style={{ background: "linear-gradient(160deg,#FFFFFF 0%,#FFE9D6 100%)", borderRadius: 20 }}>
        <div className="text-[11px] uppercase tracking-wider font-semibold text-black/40 mb-1">Spandly Bhai says</div>
        {verdict}
      </div>

      <SectionTitle>This month, day by day</SectionTitle>
      <div className="rounded-[20px] bg-white border border-black/5 p-3 overflow-x-auto">
        <div className="flex items-end gap-[3px] h-[100px]">
          {perDay.map((v, i) => {
            const isToday = i + 1 === dayOfMonth;
            const isFuture = i + 1 > dayOfMonth;
            const h = isFuture ? Math.max(4, (dailyAvg / maxBar) * 80) : Math.max(2, (v / maxBar) * 80);
            return (
              <div key={i} className="flex flex-col items-center" style={{ width: 14 }}>
                <div className="w-full rounded-t-sm" style={{
                  height: h,
                  background: isFuture ? "transparent" : isToday ? "#EF9F27" : "#1D9E75",
                  border: isFuture ? "1px dashed rgba(0,0,0,0.25)" : "none",
                }} />
                <div className="text-[8px] text-black/40 mt-1 h-3">{(i + 1) % 3 === 0 ? i + 1 : ""}</div>
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}
