import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeft, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LineChart,
  Line,
  Cell,
} from "recharts";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/analysis")({
  component: AnalysisPage,
  head: () => ({
    meta: [
      { title: "Spendly — Spending Analysis" },
      { name: "description", content: "Visualise your Spendly history with line and bar charts by day, week, month, quarter, half year and year — see exactly where your money goes." },
      { property: "og:title", content: "Spendly — Spending Analysis" },
      { property: "og:description", content: "Line and bar charts of your spending by day, week, month, quarter, half year, and year." },
      { property: "og:url", content: "https://spandly.lovable.app/analysis" },
    ],
    links: [{ rel: "canonical", href: "https://spandly.lovable.app/analysis" }],
  }),
});

type Expense = {
  id: number;
  label: string;
  amount: number;
  emoji: string;
  gradient: string;
  sub: string;
  image?: string;
  createdAt: number;
};

type Period = "day" | "week" | "month" | "quarter" | "half" | "year";

const PERIODS: { key: Period; label: string }[] = [
  { key: "day", label: "Day" },
  { key: "week", label: "Week" },
  { key: "month", label: "Month" },
  { key: "quarter", label: "Quarter" },
  { key: "half", label: "Half" },
  { key: "year", label: "Year" },
];

function bucketize(expenses: Expense[], period: Period) {
  const now = new Date();
  const data: { label: string; value: number }[] = [];

  if (period === "day") {
    // 24 hours of today
    for (let h = 0; h < 24; h += 3) {
      data.push({ label: `${h}h`, value: 0 });
    }
    expenses.forEach((e) => {
      const d = new Date(e.createdAt);
      if (
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate()
      ) {
        const idx = Math.floor(d.getHours() / 3);
        data[idx].value += e.amount;
      }
    });
  } else if (period === "week") {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      data.push({ label: days[d.getDay()], value: 0 });
    }
    expenses.forEach((e) => {
      const d = new Date(e.createdAt);
      const diff = Math.floor((now.getTime() - d.getTime()) / 86400000);
      if (diff >= 0 && diff < 7) {
        data[6 - diff].value += e.amount;
      }
    });
  } else if (period === "month") {
    const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= dim; i++) data.push({ label: String(i), value: 0 });
    expenses.forEach((e) => {
      const d = new Date(e.createdAt);
      if (d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth()) {
        data[d.getDate() - 1].value += e.amount;
      }
    });
  } else if (period === "quarter" || period === "half" || period === "year") {
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const monthsBack = period === "quarter" ? 3 : period === "half" ? 6 : 12;
    for (let i = monthsBack - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      data.push({ label: months[d.getMonth()], value: 0 });
    }
    expenses.forEach((e) => {
      const d = new Date(e.createdAt);
      const diff =
        (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth());
      if (diff >= 0 && diff < monthsBack) {
        data[monthsBack - 1 - diff].value += e.amount;
      }
    });
  }
  return data;
}

function AnalysisPage() {
  const [expenses] = useLocalState<Expense[]>("kharcha.expenses", []);
  const [period, setPeriod] = useState<Period>("year");

  const data = useMemo(() => bucketize(expenses, period), [expenses, period]);
  const total = data.reduce((s, d) => s + d.value, 0);
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const peakIdx = data.findIndex((d) => d.value === maxVal);

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#ECECEC" }}>
      <div className="w-full max-w-[440px] min-h-screen relative flex flex-col" style={{ background: "#ECECEC" }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-7 pt-4 pb-2 text-[13px] font-semibold text-black/90">
          <LiveClock />
          <Link to="/app" className="text-black/40 hover:text-black/70 transition">
            <ArrowLeft size={16} />
          </Link>
          <span className="tracking-tight">●●● ⌃ ▮</span>
        </div>

        {/* Header */}
        <div className="px-6 pt-2 pb-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40">Where it goes</div>
            <h1 className="text-[34px] leading-none font-bold tracking-tight text-black">Analysis</h1>
          </div>
          <div className="h-10 w-10 rounded-full bg-black text-white flex items-center justify-center shadow-md">
            <TrendingUp size={18} />
          </div>
        </div>

        {/* Period chips */}
        <div className="px-5 pb-3">
          <div className="flex gap-1.5 overflow-x-auto no-scrollbar">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3.5 h-9 rounded-full text-[12px] font-semibold whitespace-nowrap transition shadow-sm ${
                  period === p.key ? "bg-black text-white" : "bg-white/80 text-black/60"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Total summary card */}
        <div className="px-5 pb-4">
          <div className="rounded-[22px] bg-white/90 backdrop-blur-xl shadow-sm border border-black/5 px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40">Total spent</div>
              <div
                className="text-[26px] font-bold text-black leading-tight"
                style={{ fontFamily: "'Courier New', monospace", letterSpacing: "-0.02em" }}
              >
                ₹{total.toLocaleString("en-IN")}
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40">Peak</div>
              <div className="text-[15px] font-bold text-black">{data[peakIdx]?.label ?? "—"}</div>
              <div className="text-[12px] text-black/50">₹{maxVal.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </div>

        {/* Bar chart card */}
        <div className="px-5 pb-4">
          <div className="rounded-[28px] bg-white/95 border border-black/5 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.25)] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40 mb-2">By {period}</div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
                  <CartesianGrid stroke="#0000000A" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#0000007A", fontSize: 10, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                    interval={"preserveStartEnd"}
                  />
                  <YAxis tick={{ fill: "#0000005A", fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    cursor={{ fill: "#00000008" }}
                    contentStyle={{
                      borderRadius: 14,
                      border: "1px solid rgba(0,0,0,0.06)",
                      background: "rgba(255,255,255,0.95)",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                    formatter={(v: number) => [`₹${v}`, "Spent"]}
                  />
                  <Bar dataKey="value" radius={[10, 10, 4, 4]}>
                    {data.map((_, i) => (
                      <Cell key={i} fill={i === peakIdx ? "#0a0a0a" : "#D6D6D6"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Line chart card */}
        <div className="px-5 pb-10">
          <div
            className="rounded-[28px] p-4 shadow-[0_8px_24px_-14px_rgba(0,0,0,0.25)]"
            style={{ background: "linear-gradient(160deg,#B8E0FF 0%,#9B8BFF 100%)" }}
          >
            <div className="text-[11px] font-semibold uppercase tracking-wider text-black/55 mb-1">Trend</div>
            <div className="text-[18px] font-bold text-black mb-2">Spending flow</div>
            <div className="h-44">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
                  <CartesianGrid stroke="#0000001A" vertical={false} />
                  <XAxis dataKey="label" tick={{ fill: "#0000007A", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#0000005A", fontSize: 10 }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 14,
                      border: "1px solid rgba(0,0,0,0.06)",
                      background: "rgba(255,255,255,0.95)",
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                    formatter={(v: number) => [`₹${v}`, "Spent"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#0a0a0a"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: "#0a0a0a", strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#0a0a0a" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";
function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(id);
  }, []);
  return <span>{now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>;
}
