import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Bell } from "lucide-react";
import { Shell, SectionTitle, EmptyCard, Toast } from "./spend-dna";
import { useLocalState } from "@/lib/storage";

export const Route = createFileRoute("/subscriptions")({
  component: Subscriptions,
  head: () => ({
    meta: [
      { title: "Subscriptions — Track OTT and app renewals | Spendly" },
      { name: "description", content: "Track Netflix, Spotify, Hotstar, Prime and other recurring subscriptions in one place. Get cancel reminders before renewal with Spendly." },
      { property: "og:title", content: "Subscriptions — Track OTT and app renewals" },
      { property: "og:description", content: "One place for Netflix, Spotify, Hotstar and every recurring charge, with cancel reminders." },
      { property: "og:url", content: "https://spandly.lovable.app/subscriptions" },
    ],
    links: [{ rel: "canonical", href: "https://spandly.lovable.app/subscriptions" }],
  }),
});

type Sub = { id: number; name: string; amount: number; nextDebit: string; frequency: "Monthly" | "Yearly" | "Weekly"; color: string; emoji: string };

const PRESETS: Array<{ name: string; color: string; emoji: string; amount: number }> = [
  { name: "Netflix", color: "#E50914", emoji: "🎬", amount: 649 },
  { name: "Spotify", color: "#1DB954", emoji: "🎵", amount: 119 },
  { name: "Hotstar", color: "#1F80E0", emoji: "📺", amount: 299 },
  { name: "Prime", color: "#00A8E1", emoji: "📦", amount: 179 },
  { name: "YouTube", color: "#FF0000", emoji: "▶️", amount: 149 },
  { name: "Jio Fiber", color: "#0E4DA4", emoji: "📡", amount: 699 },
];

function daysUntil(iso: string): number {
  const d = new Date(iso); const diff = d.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86400000));
}

function Subscriptions() {
  const [subs, setSubs] = useLocalState<Sub[]>("spandly.subs", []);
  const [toast, setToast] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState<{ name: string; amount: string; date: string; color: string; emoji: string }>({ name: "", amount: "", date: "", color: "#1D9E75", emoji: "💳" });

  const monthly = subs.reduce((s, x) => s + (x.frequency === "Yearly" ? x.amount / 12 : x.frequency === "Weekly" ? x.amount * 4.33 : x.amount), 0);

  const addPreset = (p: typeof PRESETS[number]) => {
    const next = new Date(); next.setDate(next.getDate() + 30);
    setSubs((cur) => [{ id: Date.now(), name: p.name, amount: p.amount, nextDebit: next.toISOString().slice(0, 10), frequency: "Monthly", color: p.color, emoji: p.emoji }, ...cur]);
  };

  const addCustom = () => {
    if (!draft.name || !draft.amount || !draft.date) return;
    setSubs((cur) => [{ id: Date.now(), name: draft.name, amount: Number(draft.amount), nextDebit: draft.date, frequency: "Monthly", color: draft.color, emoji: draft.emoji }, ...cur]);
    setDraft({ name: "", amount: "", date: "", color: "#1D9E75", emoji: "💳" });
    setShowAdd(false);
  };

  const remove = (id: number) => setSubs((cur) => cur.filter((s) => s.id !== id));

  const reminder = (s: Sub) => {
    if (!("Notification" in window)) { setToast("Not supported"); setTimeout(() => setToast(null), 1500); return; }
    Notification.requestPermission().then((perm) => {
      if (perm !== "granted") { setToast("Permission denied"); setTimeout(() => setToast(null), 1500); return; }
      const days = daysUntil(s.nextDebit);
      const ms = Math.max(0, (days - 3) * 86400000);
      const id = window.setTimeout(() => { try { new Notification(`Cancel ${s.name}?`, { body: `₹${s.amount} debits in 3 days.` }); } catch {} }, ms);
      try { localStorage.setItem(`spandly.sub.reminder.${s.id}`, String(id)); } catch {}
      setToast(`Reminder set: 3 days before ${s.name}`); setTimeout(() => setToast(null), 2000);
    });
  };

  return (
    <Shell title="💳 Subscriptions">
      <div className="rounded-[24px] p-5 text-white shadow-md" style={{ background: "linear-gradient(135deg, #1D9E75 0%, #0c5d44 100%)" }}>
        <div className="text-[11px] uppercase tracking-wider opacity-80 font-bold">Monthly burn</div>
        <div className="text-[34px] font-bold leading-none mt-1">₹{Math.round(monthly).toLocaleString("en-IN")}<span className="text-[14px] opacity-70">/mo</span></div>
        <div className="text-[12px] opacity-90 mt-1">{subs.length} subscription{subs.length === 1 ? "" : "s"}</div>
      </div>

      <SectionTitle>Quick add</SectionTitle>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
        {PRESETS.map((p) => (
          <button key={p.name} onClick={() => addPreset(p)} className="shrink-0 px-3 h-10 rounded-full text-white text-[12px] font-bold inline-flex items-center gap-1.5" style={{ background: p.color }}>
            <span>{p.emoji}</span> {p.name}
          </button>
        ))}
      </div>

      <button onClick={() => setShowAdd(!showAdd)} className="h-11 rounded-full bg-black text-white font-bold text-[13px] inline-flex items-center justify-center gap-2"><Plus size={14}/> Add custom</button>

      {showAdd && (
        <div className="rounded-[20px] bg-white border border-black/5 p-4 space-y-2">
          <input placeholder="App name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-black/5 text-[14px] font-semibold" />
          <input placeholder="Amount (₹)" type="number" value={draft.amount} onChange={(e) => setDraft({ ...draft, amount: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-black/5 text-[14px] font-semibold" />
          <input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-black/5 text-[14px] font-semibold" />
          <input placeholder="Emoji" maxLength={2} value={draft.emoji} onChange={(e) => setDraft({ ...draft, emoji: e.target.value })} className="w-full h-10 px-3 rounded-xl bg-black/5 text-[14px] font-semibold" />
          <button onClick={addCustom} className="w-full h-10 rounded-full bg-black text-white text-[13px] font-bold">Save</button>
        </div>
      )}

      <SectionTitle>Active subscriptions</SectionTitle>
      {subs.length === 0 ? (
        <EmptyCard text="No subscriptions yet. Tap a preset above or add a custom one." />
      ) : (
        <div className="space-y-2">
          {subs.map((s) => {
            const days = daysUntil(s.nextDebit);
            return (
              <div key={s.id} className="rounded-[20px] bg-white border border-black/5 p-3 flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl text-white shrink-0" style={{ background: s.color }}>{s.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-bold text-black truncate">{s.name}</div>
                  <div className="text-[11px] text-black/50">₹{s.amount} · {s.frequency} · next in {days}d</div>
                </div>
                <button onClick={() => reminder(s)} className="w-9 h-9 rounded-full bg-black/5 inline-flex items-center justify-center text-black/70" aria-label="Set reminder"><Bell size={14}/></button>
                <button onClick={() => remove(s.id)} className="w-9 h-9 rounded-full bg-black/5 inline-flex items-center justify-center text-red-500" aria-label="Remove"><Trash2 size={14}/></button>
              </div>
            );
          })}
        </div>
      )}

      <SectionTitle>SMS auto-detect (info)</SectionTitle>
      <div className="rounded-[20px] bg-white border border-black/5 p-4 text-[12px] text-black/60 leading-snug">
        On Android with SMS access, Spendly looks for UPI debits with the same merchant + similar amount across 2+ months and suggests them as subscriptions. Web demo uses manual add.
      </div>

      {toast && <Toast text={toast} />}
    </Shell>
  );
}
