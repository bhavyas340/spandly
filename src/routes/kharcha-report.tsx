import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Shell, SectionTitle, Toast } from "./spend-dna";
import { getCategoryTotals, getExpenses, getMonthExpenses, getPersona, getStreak } from "@/lib/spandlyStorage";

export const Route = createFileRoute("/kharcha-report")({
  component: KharchaReport,
  head: () => ({ meta: [{ title: "Spendly — Kharcha Report" }] }),
});

const EMOJI: Record<string, string> = { Food: "🍱", Auto: "🛺", Chai: "☕", Shopping: "🛍️", Bills: "💡", Travel: "🛺" };

function KharchaReport() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<"month" | "year">("month");
  const [toast, setToast] = useState<string | null>(null);
  useEffect(() => setMounted(true), []);

  const now = new Date();
  const [viewMonth, setViewMonth] = useState({ month: now.getMonth(), year: now.getFullYear() });

  const allExp = mounted ? getExpenses() : [];
  const streak = mounted ? getStreak() : 0;
  const monthExp = useMemo(() => getMonthExpenses(viewMonth.month, viewMonth.year), [viewMonth, allExp.length]);
  const persona = getPersona(streak, monthExp);

  const total = monthExp.reduce((s, e) => s + Number(e.amount || 0), 0);
  const cats = getCategoryTotals(monthExp).slice(0, 5);

  // best/worst day
  const dayMap = new Map<string, number>();
  for (const e of monthExp) {
    const d = new Date(Number(e.createdAt ?? e.date ?? 0));
    const k = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    dayMap.set(k, (dayMap.get(k) || 0) + Number(e.amount || 0));
  }
  const dayArr = Array.from(dayMap.entries());
  const best = dayArr.length ? dayArr.reduce((a, b) => (a[1] < b[1] ? a : b)) : null;
  const worst = dayArr.length ? dayArr.reduce((a, b) => (a[1] > b[1] ? a : b)) : null;

  // year mode
  const yearTotals = useMemo(() => {
    const map = new Map<number, number>();
    for (const e of allExp) {
      const d = new Date(Number(e.createdAt ?? e.date ?? 0));
      if (d.getFullYear() !== viewMonth.year) continue;
      map.set(d.getMonth(), (map.get(d.getMonth()) || 0) + Number(e.amount || 0));
    }
    return map;
  }, [allExp, viewMonth.year]);
  const yearSum = Array.from(yearTotals.values()).reduce((s, v) => s + v, 0);
  const yearArr = Array.from(yearTotals.entries()).sort((a, b) => a[0] - b[0]);
  const bestMonth = yearArr.length ? yearArr.reduce((a, b) => (a[1] < b[1] ? a : b)) : null;
  const worstMonth = yearArr.length ? yearArr.reduce((a, b) => (a[1] > b[1] ? a : b)) : null;
  const monthName = (m: number) => new Date(viewMonth.year, m).toLocaleDateString("en-IN", { month: "long" });

  const monthLabel = new Date(viewMonth.year, viewMonth.month).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const share = async () => {
    const text = mode === "month"
      ? `My ${monthLabel} Kharcha Report: ₹${total} total. I'm ${persona.name}. https://spandly.lovable.app`
      : `My ${viewMonth.year} Kharcha Report: ₹${yearSum} for the year. https://spandly.lovable.app`;
    if (navigator.share) { try { await navigator.share({ text }); return; } catch {} }
    try { await navigator.clipboard.writeText(text); setToast("Copied!"); setTimeout(() => setToast(null), 1800); } catch {}
  };

  // history months
  const historyMonths = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of allExp) {
      const d = new Date(Number(e.createdAt ?? e.date ?? 0));
      const k = `${d.getFullYear()}-${d.getMonth()}`;
      map.set(k, (map.get(k) || 0) + Number(e.amount || 0));
    }
    return Array.from(map.entries())
      .map(([k, total]) => { const [y, m] = k.split("-").map(Number); return { year: y, month: m, total }; })
      .sort((a, b) => b.year - a.year || b.month - a.month);
  }, [allExp]);

  return (
    <Shell title="📄 Kharcha Report">
      <div className="flex gap-2">
        {(["month", "year"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)} className={`flex-1 h-10 rounded-full text-[13px] font-bold ${mode === m ? "bg-black text-white" : "bg-white text-black border border-black/10"}`}>
            {m === "month" ? "This Month" : "This Year"}
          </button>
        ))}
      </div>

      <div className="rounded-[18px] bg-white border border-black/10 p-5 shadow-sm" style={{ fontFamily: "'Courier New', monospace" }}>
        <div className="text-[10px] uppercase tracking-[0.2em] text-black/40">Kharcha Report</div>
        <div className="text-[13px] font-bold text-black mt-0.5">{mode === "month" ? `${monthLabel} / ${persona.name}` : `${viewMonth.year} / ${persona.name}`}</div>
        <div className="h-px bg-black/15 my-3" />

        {mode === "month" ? (
          <>
            <div className="text-[11px] text-black/50">Total spent</div>
            <div className="text-[28px] font-bold text-black leading-none">₹{total}</div>
            <div className="text-[11px] text-black/60 mt-2">Days logged: {dayMap.size} of {Math.min(now.getDate(), new Date(viewMonth.year, viewMonth.month + 1, 0).getDate())}</div>
            <div className="text-[11px] text-black/60">Current streak: {streak} days</div>

            <div className="h-px bg-black/10 my-3" />
            <div className="text-[10px] uppercase tracking-wider text-black/50 mb-1">Top categories</div>
            {cats.length === 0 ? <div className="text-[12px] text-black/40">—</div> : cats.map((c) => (
              <div key={c.category} className="text-[12px] text-black flex justify-between">
                <span>{EMOJI[c.category] || "•"} {c.category}</span>
                <span>₹{c.total} · {total ? Math.round((c.total / total) * 100) : 0}%</span>
              </div>
            ))}

            <div className="h-px bg-black/10 my-3" />
            <div className="text-[10px] uppercase tracking-wider text-black/50">Best day</div>
            <div className="text-[12px] text-black">{best ? `${best[0]} — ₹${best[1]}` : "—"}</div>
            <div className="text-[10px] uppercase tracking-wider text-black/50 mt-2">Worst day</div>
            <div className="text-[12px] text-black">{worst ? `${worst[0]} — ₹${worst[1]}` : "—"}</div>
          </>
        ) : (
          <>
            <div className="text-[11px] text-black/50">Total for {viewMonth.year}</div>
            <div className="text-[28px] font-bold text-black leading-none">₹{yearSum}</div>
            <div className="h-px bg-black/10 my-3" />
            {yearArr.length === 0 ? <div className="text-[12px] text-black/40">No data yet.</div> : yearArr.map(([m, v]) => (
              <div key={m} className="text-[12px] text-black flex justify-between"><span>{monthName(m)}</span><span>₹{v}</span></div>
            ))}
            <div className="h-px bg-black/10 my-3" />
            <div className="text-[12px] text-black">Best month: {bestMonth ? `${monthName(bestMonth[0])} — ₹${bestMonth[1]}` : "—"}</div>
            <div className="text-[12px] text-black">Worst month: {worstMonth ? `${monthName(worstMonth[0])} — ₹${worstMonth[1]}` : "—"}</div>
          </>
        )}

        <div className="h-px bg-black/10 my-3" />
        <div className="text-[10px] uppercase tracking-wider text-black/50">Financial character</div>
        <div className="text-[12px] text-black">{persona.verdict}</div>

        <div className="h-px bg-black/10 my-3" />
        <div className="text-[10px] text-black/40">Generated by Spandly · spandly.lovable.app</div>
      </div>

      <button onClick={share} className="w-full h-12 rounded-full bg-black text-white font-bold text-[14px]">Share Report 📤</button>
      <button onClick={() => { setToast("Screenshot this page to save your Kharcha Report!"); setTimeout(() => setToast(null), 2200); }} className="w-full h-12 rounded-full bg-white text-black font-bold text-[14px] border border-black/10">Download as Image 🖼️</button>

      <SectionTitle>Past reports</SectionTitle>
      {historyMonths.length === 0 ? (
        <div className="rounded-[20px] bg-white border border-black/5 p-4 text-[13px] text-black/50 text-center">Log expenses for a full month to generate your first report.</div>
      ) : (
        <div className="rounded-[20px] bg-white border border-black/5 divide-y divide-black/5">
          {historyMonths.map((h) => (
            <button key={`${h.year}-${h.month}`} onClick={() => { setMode("month"); setViewMonth({ month: h.month, year: h.year }); }} className="w-full p-3 flex items-center justify-between text-left hover:bg-black/5">
              <span className="text-[13px] font-semibold text-black">{new Date(h.year, h.month).toLocaleDateString("en-IN", { month: "long", year: "numeric" })} — ₹{h.total}</span>
              <span className="text-black/40">→</span>
            </button>
          ))}
        </div>
      )}
      {toast && <Toast text={toast} />}
    </Shell>
  );
}
