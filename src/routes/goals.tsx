import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, Mic, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { useLocalState, fileToDataUrl } from "@/lib/storage";

export const Route = createFileRoute("/goals")({
  component: GoalsPage,
  head: () => ({
    meta: [
      { title: "Spendly — Savings Goals" },
      { name: "description", content: "Create savings goals in Spendly with voice or text. Track progress toward trips, gadgets, and the things that matter — one rupee at a time." },
      { property: "og:title", content: "Spendly — Savings Goals" },
      { property: "og:description", content: "Create savings goals with voice or text and track progress toward what matters." },
      { property: "og:url", content: "https://spandly.lovable.app/goals" },
    ],
    links: [{ rel: "canonical", href: "https://spandly.lovable.app/goals" }],
  }),
});

type Goal = {
  id: number;
  title: string;
  target: number;
  saved: number;
  image?: string;
  gradient: string;
  createdAt: number;
};

const PALETTES = [
  "linear-gradient(160deg,#C8F08A 0%,#7BD3D1 60%,#FFD27A 100%)",
  "linear-gradient(160deg,#E8C5FF 0%,#F4A6C5 100%)",
  "linear-gradient(160deg,#FFB36B 0%,#FF7A3D 100%)",
  "linear-gradient(160deg,#B8E0FF 0%,#9B8BFF 100%)",
  "linear-gradient(160deg,#FFE08A 0%,#FF9B6B 100%)",
];

const seed: Goal[] = [
  { id: 1, title: "Goa Trip",   target: 25000, saved: 8400, gradient: PALETTES[0], createdAt: Date.now() },
  { id: 2, title: "iPhone 17",  target: 95000, saved: 21000, gradient: PALETTES[3], createdAt: Date.now() },
];

function GoalsPage() {
  const [goals, setGoals] = useLocalState<Goal[]>("kharcha.goals", seed);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editing, setEditing] = useState<Goal | null>(null);

  const openNew = () => { setEditing(null); setEditorOpen(true); };
  const openEdit = (g: Goal) => { setEditing(g); setEditorOpen(true); };

  const save = (g: Goal) => {
    setGoals((prev) => {
      const exists = prev.find((x) => x.id === g.id);
      return exists ? prev.map((x) => (x.id === g.id ? g : x)) : [g, ...prev];
    });
    setEditorOpen(false);
  };

  const remove = (id: number) => setGoals((p) => p.filter((g) => g.id !== id));

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#ECECEC" }}>
      <div className="w-full max-w-[440px] min-h-screen relative flex flex-col" style={{ background: "#ECECEC" }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-7 pt-4 pb-2 text-[13px] font-semibold text-black/90">
          <span>9:41</span>
          <Link to="/app" className="text-black/40 hover:text-black/70 transition">
            <ArrowLeft size={16} />
          </Link>
          <span className="tracking-tight">●●● ⌃ ▮</span>
        </div>

        {/* Header */}
        <div className="px-6 pt-2 pb-4 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40">Save toward</div>
            <h1 className="text-[34px] leading-none font-bold tracking-tight text-black">Goals</h1>
          </div>
          <button
            onClick={openNew}
            className="h-10 px-4 rounded-full bg-black text-white text-[13px] font-semibold flex items-center gap-1.5 shadow-md"
          >
            <Plus size={16} /> New
          </button>
        </div>

        <div className="px-5 grid grid-cols-1 gap-3 pb-32">
          {goals.length === 0 && (
            <div className="rounded-[22px] bg-white/85 p-6 text-center border border-black/5">
              <div className="text-black/60 text-sm">No goals yet. Tap “New” to create one.</div>
            </div>
          )}
          {goals.map((g) => (
            <GoalCard key={g.id} g={g} onEdit={() => openEdit(g)} onDelete={() => remove(g.id)} />
          ))}
        </div>

        <div className="flex-1" />
      </div>

      {editorOpen && (
        <GoalEditor
          initial={editing}
          onClose={() => setEditorOpen(false)}
          onSave={save}
        />
      )}
    </div>
  );
}

function GoalCard({ g, onEdit, onDelete }: { g: Goal; onEdit: () => void; onDelete: () => void }) {
  const pct = Math.min(100, Math.round((g.saved / Math.max(1, g.target)) * 100));
  return (
    <div
      className="relative rounded-[28px] p-4 overflow-hidden shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)]"
      style={{ background: g.gradient }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-16 h-16 rounded-[inherit] bg-white/55 border border-white/60 overflow-hidden shrink-0 flex items-center justify-center"
          style={{ borderRadius: 18 }}
        >
          {g.image ? (
            <img src={g.image} alt={g.title} className="w-full h-full object-cover" />
          ) : (
            <Camera size={20} className="text-black/55" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[17px] font-bold text-black/90 leading-tight truncate">{g.title}</div>
          <div className="text-[12px] text-black/55">
            ₹{g.saved.toLocaleString("en-IN")} of ₹{g.target.toLocaleString("en-IN")}
          </div>
          <div className="mt-2 h-2 rounded-full bg-black/15 overflow-hidden">
            <div className="h-full rounded-full bg-black/80" style={{ width: `${pct}%` }} />
          </div>
          <div className="text-[11px] font-semibold text-black/55 mt-1">{pct}%</div>
        </div>
        <div className="flex flex-col gap-1.5">
          <button onClick={onEdit} className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-black/70 shadow-sm">
            <Pencil size={14} />
          </button>
          <button onClick={onDelete} className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center text-black/60 shadow-sm">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

function GoalEditor({
  initial,
  onClose,
  onSave,
}: {
  initial: Goal | null;
  onClose: () => void;
  onSave: (g: Goal) => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [target, setTarget] = useState<string>(initial?.target ? String(initial.target) : "");
  const [saved, setSaved] = useState<string>(initial?.saved ? String(initial.saved) : "0");
  const [image, setImage] = useState<string | undefined>(initial?.image);
  const [listening, setListening] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const recogRef = useRef<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const startVoice = () => {
    const SR =
      (typeof window !== "undefined" &&
        ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition));
    if (!SR) { setErr("Voice not supported. Try Chrome."); return; }
    const r = new SR();
    r.lang = "en-IN";
    r.interimResults = true;
    r.continuous = false;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onerror = (ev: any) => { setErr(ev.error || "Error"); setListening(false); };
    r.onresult = (ev: any) => {
      let txt = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) txt += ev.results[i][0].transcript;
      const parsed = parseGoal(txt);
      if (parsed.title) setTitle(parsed.title);
      if (parsed.amount) setTarget(String(parsed.amount));
    };
    recogRef.current = r;
    try { r.start(); } catch {}
  };

  useEffect(() => () => { try { recogRef.current?.stop(); } catch {} }, []);

  const handlePick = async (file?: File) => {
    if (!file) return;
    setImage(await fileToDataUrl(file));
  };

  const canSave = title.trim().length > 0 && Number(target) > 0;

  const submit = () => {
    if (!canSave) return;
    const g: Goal = {
      id: initial?.id ?? Date.now(),
      title: title.trim(),
      target: Number(target),
      saved: Number(saved) || 0,
      image,
      gradient: initial?.gradient ?? PALETTES[Math.floor(Math.random() * PALETTES.length)],
      createdAt: initial?.createdAt ?? Date.now(),
    };
    onSave(g);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-[440px] min-h-screen relative flex flex-col"
        style={{ background: "#ECECEC" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-black/70 shadow-sm">
            <X size={18} />
          </button>
          <div className="text-[15px] font-bold text-black">{initial ? "Edit Goal" : "New Goal"}</div>
          <button
            onClick={submit}
            disabled={!canSave}
            className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center shadow-sm disabled:opacity-30"
          >
            <Check size={18} />
          </button>
        </div>

        <div className="px-5 space-y-3">
          {/* Image picker — large 2x2 style card */}
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-[24px] bg-white/90 border border-black/5 shadow-sm overflow-hidden aspect-[2/1] flex items-center justify-center"
          >
            {image ? (
              <img src={image} alt="goal" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center gap-1.5 text-black/50">
                <Camera size={22} />
                <span className="text-[12px] font-semibold">Add photo</span>
              </div>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(ev) => handlePick(ev.target.files?.[0])}
            />
          </button>

          {/* Title with voice */}
          <div className="rounded-[22px] bg-white/90 border border-black/5 shadow-sm px-4 py-3">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40 mb-1">Goal</div>
            <div className="flex items-center gap-2">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Goa Trip"
                className="flex-1 bg-transparent outline-none text-[18px] font-bold text-black placeholder:text-black/30"
              />
              <button
                onClick={startVoice}
                className={`w-9 h-9 rounded-full flex items-center justify-center shadow-sm transition ${
                  listening ? "bg-black text-white" : "bg-white text-black/70"
                }`}
                aria-label="Voice"
              >
                <Mic size={16} />
              </button>
            </div>
            {listening && <div className="text-[11px] text-black/40 mt-1">Listening… say e.g. “save 25000 for goa trip”</div>}
            {err && <div className="text-[11px] text-red-500 mt-1">{err}</div>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-[22px] bg-white/90 border border-black/5 shadow-sm px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40 mb-1">Target ₹</div>
              <input
                inputMode="numeric"
                value={target}
                onChange={(e) => setTarget(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="25000"
                className="w-full bg-transparent outline-none text-[20px] font-bold text-black placeholder:text-black/30"
                style={{ fontFamily: "'Courier New', monospace" }}
              />
            </div>
            <div className="rounded-[22px] bg-white/90 border border-black/5 shadow-sm px-4 py-3">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-black/40 mb-1">Saved ₹</div>
              <input
                inputMode="numeric"
                value={saved}
                onChange={(e) => setSaved(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="0"
                className="w-full bg-transparent outline-none text-[20px] font-bold text-black placeholder:text-black/30"
                style={{ fontFamily: "'Courier New', monospace" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function parseGoal(text: string): { title: string; amount: number | null } {
  const numMatch = text.match(/(\d[\d,]*)/);
  const amount = numMatch ? Number(numMatch[1].replace(/,/g, "")) : null;
  const cleaned = text
    .toLowerCase()
    .replace(/(\d[\d,]*)/, " ")
    .replace(/\b(rupees|rupee|rs|inr|for|to|save|goal|set|new|kharcha|of)\b/g, " ")
    .replace(/[^\p{L}\s]/gu, " ")
    .trim()
    .replace(/\s+/g, " ");
  const title = cleaned ? cleaned.replace(/\b\w/g, (c) => c.toUpperCase()) : "";
  return { title, amount };
}
