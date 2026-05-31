import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Zap } from "lucide-react";
import { Shell, SectionTitle, Toast } from "./spend-dna";

export const Route = createFileRoute("/haptic-lab")({
  component: HapticLab,
  head: () => ({ meta: [{ title: "Spendly — Haptic Lab" }] }),
});

type Preset = { id: string; name: string; desc: string; pattern: number | number[] };
const PRESETS: Preset[] = [
  { id: "quick", name: "Quick Tap", desc: "One sharp tap. Clean and minimal.", pattern: 50 },
  { id: "double", name: "Double Confirm", desc: "Tap-pause-tap. Satisfying double hit.", pattern: [50, 50, 50] },
  { id: "register", name: "Cash Register", desc: "Old-school register feel.", pattern: [30, 20, 80, 20, 30] },
  { id: "iron", name: "Iron Saver", desc: "Heavy premium pulse. For serious trackers.", pattern: [100, 30, 100] },
];

function playFallback() {
  try {
    const Ctx = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine"; osc.frequency.value = 200;
    gain.gain.value = 0.2;
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start();
    setTimeout(() => { osc.stop(); ctx.close(); }, 80);
  } catch {}
}

function trigger(p: Preset) {
  try {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      const ok = navigator.vibrate(p.pattern as number | number[]);
      if (!ok) playFallback();
    } else { playFallback(); }
  } catch { playFallback(); }
}

function HapticLab() {
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState("quick");
  const [pulseId, setPulseId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const testRef = useRef<HTMLButtonElement>(null);
  const [testPulse, setTestPulse] = useState(false);

  useEffect(() => {
    setMounted(true);
    try { const s = localStorage.getItem("spandly_haptic_preset"); if (s) setSelected(s); } catch {}
  }, []);

  const pick = (p: Preset) => {
    setSelected(p.id);
    try { localStorage.setItem("spandly_haptic_preset", p.id); } catch {}
    trigger(p);
    setPulseId(p.id);
    setTimeout(() => setPulseId(null), 250);
    setToast("Haptic style saved!");
    setTimeout(() => setToast(null), 1500);
  };

  const test = () => {
    const p = PRESETS.find((x) => x.id === selected) || PRESETS[0];
    trigger(p);
    setTestPulse(true);
    setTimeout(() => setTestPulse(false), 250);
  };

  const selectedName = PRESETS.find((p) => p.id === (mounted ? selected : "quick"))?.name || "Quick Tap";

  return (
    <Shell title="💥 Haptic Lab">
      <div className="rounded-[20px] bg-white border border-black/5 p-4">
        <div className="text-[13px] text-black">Premium apps feel different. Haptic feedback makes every log feel real — not just visual.</div>
        <div className="text-[11px] text-black/45 mt-1">Works on Android. iPhone users get a sound substitute.</div>
      </div>

      <SectionTitle>Presets</SectionTitle>
      <div className="flex flex-col gap-2">
        {PRESETS.map((p) => {
          const isSel = mounted && selected === p.id;
          return (
            <div key={p.id} onClick={() => pick(p)} className={`rounded-[18px] bg-white p-4 border-2 transition cursor-pointer ${isSel ? "" : "border-black/5"}`} style={{ borderColor: isSel ? "#1D9E75" : undefined, transform: pulseId === p.id ? "scale(1.03)" : "scale(1)" }}>
              <div className="flex items-center justify-between">
                <div className="text-[15px] font-bold text-black">{p.name}</div>
                {isSel && <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: "#1D9E75" }}>✓ Selected</span>}
              </div>
              <div className="text-[12px] text-black/55 mt-0.5">{p.desc}</div>
              <button onClick={(e) => { e.stopPropagation(); trigger(p); }} className="mt-2 text-[12px] font-bold text-[#1D9E75]">Feel it →</button>
            </div>
          );
        })}
      </div>

      <SectionTitle>Test your haptic now</SectionTitle>
      <div className="flex flex-col items-center py-4">
        <button ref={testRef} onClick={test} className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-lg transition" style={{ background: "#1D9E75", transform: testPulse ? "scale(1.1)" : "scale(1)" }}>
          <Zap size={32} />
        </button>
        <div className="text-[12px] text-black/55 mt-2">Tap to feel</div>
      </div>

      <SectionTitle>Moments that trigger haptics</SectionTitle>
      <div className="rounded-[20px] bg-white border border-black/5 divide-y divide-black/5">
        <Row icon="✓" label="Expense logged" right={selectedName} />
        <Row icon="🔥" label="Streak milestone" right="Iron Saver pulse" />
        <Row icon="📅" label="9PM reminder" right="Quick Tap" />
        <Row icon="✦" label="Persona changes" right="Double Confirm" />
      </div>
      <div className="text-[11px] text-black/45 text-center">Full per-event customisation — coming in Plus plan.</div>

      {toast && <Toast text={toast} />}
    </Shell>
  );
}

function Row({ icon, label, right }: { icon: string; label: string; right: string }) {
  return (
    <div className="flex items-center justify-between p-3">
      <div className="flex items-center gap-2 text-[13px] text-black"><span>{icon}</span>{label}</div>
      <div className="text-[12px] font-semibold text-black/60">{right}</div>
    </div>
  );
}
