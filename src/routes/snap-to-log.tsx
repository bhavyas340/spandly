import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, Check, RefreshCw } from "lucide-react";
import { Shell, SectionTitle, Toast } from "./spend-dna";
import { useLocalState, fileToDataUrl } from "@/lib/storage";

export const Route = createFileRoute("/snap-to-log")({
  component: SnapToLog,
  head: () => ({ meta: [{ title: "Spendly — Snap to Log" }] }),
});

type Expense = { id: number; label: string; category: string; amount: number; emoji: string; createdAt: number; image?: string };

const MERCHANT_MAP: Array<[RegExp, string, string]> = [
  [/swiggy|zomato|dominos|mcdonald|kfc|burger|pizza|cafe|restaurant|biryani|food/i, "Food", "🍔"],
  [/ola|uber|rapido|auto|metro|petrol|fuel|hpcl|iocl|bpcl/i, "Transport", "🚕"],
  [/amazon|flipkart|myntra|ajio|meesho|nykaa/i, "Shopping", "🛍️"],
  [/netflix|spotify|hotstar|prime|youtube|jio/i, "Subscription", "📺"],
  [/big ?bazaar|dmart|reliance|more|grocery|kirana|bigbasket|blinkit|zepto|instamart/i, "Groceries", "🛒"],
  [/medplus|apollo|pharmacy|hospital|clinic|medic/i, "Health", "💊"],
  [/electric|bill|water|gas|recharge|airtel|vi |bsnl/i, "Bills", "💡"],
];

function categorize(merchant: string): { category: string; emoji: string } {
  for (const [r, c, e] of MERCHANT_MAP) if (r.test(merchant)) return { category: c, emoji: e };
  return { category: "Other", emoji: "💸" };
}

function parseReceipt(text: string) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  // merchant: first meaningful line
  const merchant = lines.find((l) => /[A-Za-z]{3,}/.test(l) && !/total|amount|gst|tax|date|invoice|bill/i.test(l)) || lines[0] || "Unknown";
  // amount: look for "total" line first, else largest decimal
  let amount = 0;
  for (const l of lines) {
    if (/total|amount due|grand/i.test(l)) {
      const m = l.match(/(\d+[.,]?\d{0,2})/g);
      if (m) { amount = Math.max(amount, ...m.map((x) => parseFloat(x.replace(",", ".")))); }
    }
  }
  if (!amount) {
    const all = text.match(/\d+\.\d{2}/g) || [];
    if (all.length) amount = Math.max(...all.map(parseFloat));
  }
  // date
  const dm = text.match(/(\d{1,2}[\/\-.]\d{1,2}[\/\-.]\d{2,4})/);
  const date = dm ? dm[1] : new Date().toLocaleDateString();
  return { merchant: merchant.slice(0, 40), amount: Math.round(amount), date };
}

function SnapToLog() {
  const [, setExpenses] = useLocalState<Expense[]>("kharcha.expenses", []);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [draft, setDraft] = useState<{ merchant: string; amount: number; date: string; category: string; emoji: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [justLogged, setJustLogged] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File) => {
    const url = await fileToDataUrl(file);
    setImage(url);
    setLoading(true); setProgress(0); setDraft(null); setFailed(false);
    try {
      const { default: Tesseract } = await import("tesseract.js");
      const res = await Tesseract.recognize(url, "eng", {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") setProgress(Math.round(m.progress * 100));
        },
      });
      const text = res.data.text || "";
      const parsed = parseReceipt(text);
      if (!text.trim() || (!parsed.amount && parsed.merchant === "Unknown")) {
        setFailed(true);
      } else {
        const cat = categorize(parsed.merchant);
        setDraft({ ...parsed, ...cat });
      }
    } catch {
      setFailed(true);
    } finally { setLoading(false); }
  };

  const openManual = (prefill?: { merchant: string; amount: number }) => {
    setFailed(false);
    setDraft({
      merchant: prefill?.merchant || "",
      amount: prefill?.amount || 0,
      date: new Date().toLocaleDateString(),
      category: "Other",
      emoji: "💸",
    });
    setManualOpen(true);
  };

  const confirm = () => {
    if (!draft) return;
    const newExp: Expense = {
      id: Date.now(),
      label: draft.merchant || "Expense",
      category: draft.category,
      amount: draft.amount,
      emoji: draft.emoji,
      createdAt: Date.now(),
      image: image || undefined,
    };
    setExpenses((prev) => [newExp, ...prev]);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 1600);
    setImage(null); setDraft(null); setManualOpen(false);
  };


  return (
    <Shell title="📸 Snap to Log">
      <input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />

      {!image && !manualOpen && (
        <div className="rounded-[24px] bg-white border-2 p-6 text-center shadow-sm" style={{ borderColor: "#1D9E75" }}>
          <div className="text-[44px] mb-2">🧾</div>
          <div className="text-[18px] font-bold text-black">Snap your bill</div>
          <div className="text-[13px] text-black/60 mt-1">We'll extract merchant, amount, and category automatically.</div>
          <button onClick={() => inputRef.current?.click()} className="mt-5 w-full h-12 rounded-full bg-black text-white font-bold text-[14px] inline-flex items-center justify-center gap-2">
            <Camera size={16} /> Open Camera
          </button>
          <button onClick={() => openManual()} className="mt-2 w-full h-11 rounded-full bg-white text-black font-bold text-[13px] border border-black/15">
            Type manually
          </button>
        </div>
      )}

      {!image && manualOpen && draft && (
        <div className="rounded-[24px] bg-white border border-black/5 p-5 space-y-3">
          <SectionTitle>Add expense</SectionTitle>
          <Field label="Merchant" value={draft.merchant} onChange={(v) => setDraft({ ...draft, merchant: v, ...categorize(v) })} />
          <Field label="Amount (₹)" value={String(draft.amount)} onChange={(v) => setDraft({ ...draft, amount: Number(v) || 0 })} />
          <Field label="Date" value={draft.date} onChange={(v) => setDraft({ ...draft, date: v })} />
          <div className="flex gap-2 pt-2">
            <button onClick={() => { setDraft(null); setManualOpen(false); }} className="flex-1 h-11 rounded-full border border-black/15 font-bold text-[13px]">Cancel</button>
            <button onClick={confirm} className="flex-1 h-11 rounded-full bg-black text-white font-bold text-[13px] inline-flex items-center justify-center gap-1"><Check size={14}/> Log expense</button>
          </div>
        </div>
      )}


      {image && (
        <div className="rounded-[24px] bg-white border border-black/5 overflow-hidden">
          <img src={image} alt="Captured receipt preview ready to log as an expense" className="w-full max-h-[260px] object-cover" />
          {loading && (
            <div className="p-6 text-center">
              <div className="mx-auto w-10 h-10 rounded-full border-4 border-black/10 border-t-black animate-spin" aria-label="Loading" />
              <div className="text-[14px] font-bold text-black mt-3">Reading your receipt...</div>
              <div className="mt-3 h-2 rounded-full bg-black/10 overflow-hidden">
                <div className="h-full transition-all" style={{ width: `${progress}%`, background: "#1D9E75" }} />
              </div>
              <div className="text-[11px] text-black/40 mt-1">{progress}%</div>
            </div>
          )}
          {failed && !loading && (
            <div className="p-5 text-center">
              <div className="text-[28px]">😕</div>
              <div className="text-[14px] font-bold text-black mt-1">Couldn't read this one</div>
              <div className="text-[12px] text-black/60 mt-1">Try better lighting or type it in.</div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => { setImage(null); setFailed(false); }} className="flex-1 h-11 rounded-full border border-black/15 font-bold text-[13px] inline-flex items-center justify-center gap-1"><RefreshCw size={14}/> Retake</button>
                <button onClick={() => openManual()} className="flex-1 h-11 rounded-full bg-black text-white font-bold text-[13px]">Type manually</button>
              </div>
            </div>
          )}
          {draft && !loading && !failed && (
            <div className="p-5 space-y-3">
              <SectionTitle>{manualOpen ? "Add expense" : "Confirm details"}</SectionTitle>
              <Field label="Merchant" value={draft.merchant} onChange={(v) => setDraft({ ...draft, merchant: v, ...categorize(v) })} />
              <Field label="Amount (₹)" value={String(draft.amount)} onChange={(v) => setDraft({ ...draft, amount: Number(v) || 0 })} />
              <Field label="Date" value={draft.date} onChange={(v) => setDraft({ ...draft, date: v })} />
              <div className="flex items-center gap-2 text-[13px]">
                <span className="text-black/50">Category:</span>
                <span className="px-2.5 py-1 rounded-full text-white font-bold text-[11px]" style={{ background: "#1D9E75" }}>{draft.emoji} {draft.category}</span>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => { setImage(null); setDraft(null); setManualOpen(false); }} className="flex-1 h-11 rounded-full border border-black/15 font-bold text-[13px] inline-flex items-center justify-center gap-1"><RefreshCw size={14}/> Retake</button>
                <button onClick={confirm} className="flex-1 h-11 rounded-full bg-black text-white font-bold text-[13px] inline-flex items-center justify-center gap-1"><Check size={14}/> Confirm & Log</button>
              </div>
            </div>
          )}
        </div>
      )}

      <SectionTitle>How it works</SectionTitle>
      <div className="rounded-[20px] bg-white border border-black/5 p-4 text-[12px] text-black/60 leading-snug">
        1. Snap the receipt → 2. OCR extracts merchant + total → 3. Auto-categorize by merchant → 4. One-tap confirm.
      </div>

      {justLogged && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div
            className="bg-white rounded-3xl shadow-2xl px-8 py-6 flex flex-col items-center gap-2 border border-black/5"
            style={{ animation: "snapLoggedPop 0.4s ease-out" }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white"
              style={{ background: "#1D9E75", animation: "snapCheckIn 0.5s ease-out" }}
            >
              <Check size={36} strokeWidth={3} />
            </div>
            <div className="text-[18px] font-bold text-black">Logged!</div>
          </div>
          <style>{`
            @keyframes snapLoggedPop { 0%{transform:scale(.7);opacity:0} 100%{transform:scale(1);opacity:1} }
            @keyframes snapCheckIn { 0%{transform:scale(0) rotate(-45deg)} 60%{transform:scale(1.15) rotate(0deg)} 100%{transform:scale(1)} }
          `}</style>
        </div>
      )}

      {toast && <Toast text={toast} />}
    </Shell>
  );

}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider font-semibold text-black/40">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-xl bg-black/5 text-[14px] font-semibold text-black focus:outline-none focus:bg-black/10" />
    </label>
  );
}
