import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Zap, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Spendly — Speak it. Log it. Done." },
      { name: "description", content: "Voice-first daily expense tracker built for India. Say chai 20 and you're done." },
    ],
  }),
});

const PALETTES = [
  "linear-gradient(160deg,#C8F08A 0%,#7BD3D1 60%,#FFD27A 100%)",
  "linear-gradient(160deg,#E8C5FF 0%,#F4A6C5 100%)",
  "linear-gradient(160deg,#F5C7B0 0%,#C8839A 100%)",
  "linear-gradient(160deg,#FFB36B 0%,#FF7A3D 100%)",
  "linear-gradient(160deg,#B8E0FF 0%,#9B8BFF 100%)",
  "linear-gradient(160deg,#FFE08A 0%,#FF9B6B 100%)",
];

const features = [
  { title: "3-Sec Voice Log", desc: "Say chai 20. Done.", grad: PALETTES[0], tag: "Core" },
  { title: "Streak System", desc: "Daily log keeps the flame.", grad: PALETTES[3], tag: "Loop" },
  { title: "UPI Auto-Read", desc: "GPay & PhonePe SMS read.", grad: PALETTES[1], tag: "Zero work" },
  { title: "9PM Shock", desc: "Daily reality check ping.", grad: PALETTES[5], tag: "Re-engage" },
  { title: "Report Card", desc: "Share monthly to WhatsApp.", grad: PALETTES[2], tag: "Viral" },
  { title: "AI Coach", desc: "Skip 2 Swiggys, save ₹600.", grad: PALETTES[4], tag: "Premium" },
];

function Landing() {
  return (
    <div className="min-h-screen" style={{ background: "#ECECEC", color: "#0a0a0a", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Nav */}
      <header className="sticky top-0 z-40 backdrop-blur-xl" style={{ background: "rgba(236,236,236,0.75)" }}>
        <div className="max-w-[1100px] mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center text-sm font-bold">S</span>
            <span className="font-bold text-lg tracking-tight">Spendly</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm text-black/60">
            <a href="#features" className="hover:text-black transition">Features</a>
            <a href="#how" className="hover:text-black transition">How</a>
            <a href="#pricing" className="hover:text-black transition">Pricing</a>
          </nav>
          <Link
            to="/app"
            className="px-4 py-2 rounded-full bg-black text-white font-semibold text-sm hover:bg-black/85 transition flex items-center gap-1.5"
          >
            Open app <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-[1100px] mx-auto px-5 pt-14 md:pt-20 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-black/5 text-xs text-black/60 mb-6 shadow-sm">
              🇮🇳 Built for India · Voice + UPI native
            </div>
            <h1 className="font-bold text-5xl md:text-7xl leading-[1.02] tracking-tight text-black">
              Speak it.<br />
              <span className="italic font-serif" style={{ fontFamily: "'Instrument Serif', serif" }}>Log it.</span>{" "}
              Done.
            </h1>
            <p className="mt-6 text-lg text-black/60 max-w-md leading-relaxed">
              The voice-first expense tracker built for the way Indians actually spend. Chai, auto, lunch — logged in three seconds.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/app"
                className="px-6 py-3.5 rounded-full bg-black text-white font-semibold hover:bg-black/85 transition flex items-center gap-2 shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
              >
                <Zap size={16} /> Try the app
              </Link>
              <a
                href="#features"
                className="px-6 py-3.5 rounded-full bg-white/90 border border-black/5 text-black font-semibold hover:bg-white transition shadow-sm"
              >
                See features
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-black/50">
              <span>₹0 to start</span>
              <span className="opacity-30">·</span>
              <span>3 sec to log</span>
              <span className="opacity-30">·</span>
              <span>🔥 daily streak</span>
            </div>
          </div>

          {/* Phone mockup — light pastel */}
          <div className="relative flex justify-center items-center h-[640px]">
            <div className="absolute top-6 -left-2 md:left-4 z-20 animate-float-soft px-3 py-2 rounded-2xl bg-white border border-black/5 text-xs font-semibold shadow-lg">
              🔥 14-day streak
            </div>
            <div className="absolute bottom-20 -right-2 md:right-4 z-20 animate-float-soft px-3 py-2 rounded-2xl bg-white border border-black/5 text-xs font-semibold shadow-lg" style={{ animationDelay: "1s" }}>
              ✓ chai 20 — logged
            </div>
            <div className="animate-float">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="max-w-[1100px] mx-auto px-5 mb-20">
        <div className="rounded-[28px] bg-white/85 border border-black/5 shadow-sm px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[["25.5B", "app downloads in India"], ["683M", "UPI txns daily"], ["₹0", "ad spend needed"], ["3 sec", "to log an expense"]].map(([n, l]) => (
            <div key={l}>
              <div className="font-bold text-2xl md:text-3xl text-black" style={{ fontFamily: "'Courier New', monospace", letterSpacing: "-0.03em" }}>{n}</div>
              <div className="text-xs text-black/50 mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features — pastel card grid */}
      <section id="features" className="max-w-[1100px] mx-auto px-5 py-10">
        <div className="max-w-2xl mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-black/40 mb-3">Features</div>
          <h2 className="font-bold text-4xl md:text-5xl tracking-tight text-black">
            Built for the way Indians<br />actually spend.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div
              key={f.title}
              className="relative rounded-[28px] p-6 aspect-[1.4] overflow-hidden shadow-[0_8px_24px_-12px_rgba(0,0,0,0.25)] flex flex-col justify-between"
              style={{ background: f.grad }}
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/55 backdrop-blur-sm border border-white/60 text-black/70">
                  {f.tag}
                </span>
              </div>
              <div>
                <div className="font-bold text-2xl text-black leading-tight">{f.title}</div>
                <div className="text-[13px] text-black/60 mt-1">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How */}
      <section id="how" className="max-w-[1100px] mx-auto px-5 py-20">
        <div className="rounded-[32px] bg-white/85 border border-black/5 shadow-sm p-8 md:p-12">
          <div className="text-xs font-bold uppercase tracking-wider text-black/40 mb-3">How it works</div>
          <h2 className="font-bold text-4xl md:text-5xl tracking-tight text-black mb-10">
            From spend to share in one day.
          </h2>
          <div className="grid md:grid-cols-5 gap-3">
            {[
              { n: "01", t: "You spend", d: "Chai, auto, lunch." },
              { n: "02", t: "Log in 3s", d: "Voice or tap." },
              { n: "03", t: "Streak fires", d: "Day +1." },
              { n: "04", t: "9PM shock", d: "Reality check." },
              { n: "05", t: "Month share", d: "Flex it." },
            ].map((s, i) => (
              <div key={s.n} className="relative rounded-[22px] p-4 bg-[#ECECEC] border border-black/5">
                <div className="text-[11px] font-bold text-black/40" style={{ fontFamily: "'Courier New', monospace" }}>{s.n}</div>
                <div className="font-bold text-[15px] mt-2 text-black">{s.t}</div>
                <div className="text-[12px] text-black/55 mt-0.5">{s.d}</div>
                {i < 4 && <div className="hidden md:block absolute top-1/2 -right-2 -translate-y-1/2 text-black/30">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="max-w-[1100px] mx-auto px-5 py-20">
        <div className="text-center mb-12">
          <div className="text-xs font-bold uppercase tracking-wider text-black/40 mb-3">Pricing</div>
          <h2 className="font-bold text-4xl md:text-5xl tracking-tight text-black">Start free. Stay forever.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <PriceCard name="Free" price="₹0" sub="forever" features={["Voice log", "Streak system", "9PM shock report", "UPI SMS read", "3 months history"]} />
          <PriceCard highlight name="Plus" price="₹99" sub="/month" features={["AI spend coach", "Report card share", "Budget alerts", "Savings jar", "Unlimited history", "Streak shields"]} />
          <PriceCard name="Family" price="₹199" sub="/month" features={["Everything in Plus", "4 family members", "Shared budget", "Group splits", "Tax summary"]} />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1100px] mx-auto px-5 py-24">
        <div
          className="rounded-[36px] p-12 md:p-20 text-center relative overflow-hidden shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)]"
          style={{ background: PALETTES[3] }}
        >
          <h2 className="font-bold text-5xl md:text-7xl tracking-tight text-black leading-[1.05]">
            🔥 Your streak<br />starts today.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Link
              to="/app"
              className="px-7 py-4 rounded-full bg-black text-white font-semibold hover:bg-black/85 transition flex items-center gap-2 shadow-md"
            >
              <Zap size={16} /> Try the app
            </Link>
            <a
              href="#features"
              className="px-7 py-4 rounded-full bg-white/90 border border-black/5 text-black font-semibold hover:bg-white transition"
            >
              See features
            </a>
          </div>
        </div>
      </section>

      <footer className="max-w-[1100px] mx-auto px-5 py-10 flex flex-wrap justify-between gap-4 text-sm text-black/50">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center text-[10px] font-bold">S</span>
          <span className="font-bold text-black">Spendly</span>
          <span className="opacity-50">· Built for India</span>
        </div>
        <div className="opacity-70">© 2026 Spendly. Made with ❤️ in Bengaluru.</div>
      </footer>
    </div>
  );
}

function PriceCard({ name, price, sub, features, highlight }: { name: string; price: string; sub: string; features: string[]; highlight?: boolean }) {
  return (
    <div
      className={`p-7 rounded-[28px] relative border ${highlight ? "border-black bg-black text-white" : "border-black/5 bg-white/90 text-black"} shadow-sm`}
    >
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-wider shadow-md">
          Most popular
        </div>
      )}
      <div className="font-bold text-lg mb-2 opacity-90">{name}</div>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="font-bold text-5xl" style={{ fontFamily: "'Courier New', monospace", letterSpacing: "-0.04em" }}>{price}</span>
        <span className={`text-sm ${highlight ? "text-white/60" : "text-black/50"}`}>{sub}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <Check size={16} className={`mt-0.5 shrink-0 ${highlight ? "text-white" : "text-black"}`} />
            <span className={highlight ? "text-white/90" : "text-black/80"}>{f}</span>
          </li>
        ))}
      </ul>
      <Link
        to="/app"
        className={`block text-center py-3 rounded-full font-semibold text-sm transition ${
          highlight ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/85"
        }`}
      >
        {highlight ? "Get Plus" : "Choose plan"}
      </Link>
    </div>
  );
}

function PhoneMockup() {
  return (
    <div
      className="relative"
      style={{
        width: 320,
        height: 640,
        borderRadius: 44,
        background: "#0a0a0a",
        padding: 10,
        boxShadow: "0 30px 80px -20px rgba(0,0,0,0.4), 0 10px 30px -10px rgba(0,0,0,0.2)",
      }}
    >
      <div className="w-full h-full rounded-[36px] overflow-hidden relative flex flex-col" style={{ background: "#ECECEC" }}>
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-10" />

        <div className="flex items-center justify-between px-6 pt-3 pb-2 text-[11px] font-semibold text-black/80">
          <span>9:41</span>
          <span className="tracking-tight">●●● ⌃ ▮</span>
        </div>

        <div className="px-4 pt-1 pb-2 flex items-center justify-between">
          <h2 className="text-[22px] font-bold tracking-tight text-black">Spendly</h2>
          <span className="px-2 py-1 rounded-full bg-white/80 text-[9px] font-bold text-black/60">🔥 14</span>
        </div>

        <div className="px-3 pb-2">
          <div className="rounded-2xl bg-white/85 border border-black/5 shadow-sm px-3 py-2 flex items-center justify-between">
            <div>
              <div className="text-[8px] font-bold uppercase tracking-wider text-black/40">Today</div>
              <div className="text-[12px] font-bold text-black">Wed, 27 May</div>
            </div>
            <div className="text-[16px] font-bold text-black" style={{ fontFamily: "'Courier New', monospace" }}>₹864</div>
          </div>
        </div>

        <div className="px-3 grid grid-cols-2 gap-2 flex-1">
          {[
            { l: "Food", a: 460, g: PALETTES[0] },
            { l: "Auto", a: 85, g: PALETTES[1] },
            { l: "Bills", a: 299, g: PALETTES[2] },
            { l: "Shop", a: 320, g: PALETTES[3] },
          ].map((c) => (
            <div key={c.l} className="rounded-2xl p-2.5 aspect-[1] flex flex-col justify-between" style={{ background: c.g }}>
              <div className="text-[10px] font-bold text-black/85">{c.l}</div>
              <div className="text-[20px] font-bold text-black/90 text-center" style={{ fontFamily: "'Courier New', monospace" }}>
                ₹{c.a}
              </div>
              <div className="text-[8px] font-bold text-black/55 uppercase">Today</div>
            </div>
          ))}
        </div>

        <div className="px-3 py-3">
          <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-full bg-white/90 border border-black/5 shadow-sm">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center text-black/60">×</div>
            <div className="flex items-center gap-1 h-5">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="block bg-black rounded-full" style={{ width: 5, height: 12, animation: `wave-bar 1.${4 + i}s ease-in-out ${i * 0.12}s infinite` }} />
              ))}
            </div>
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center"><Plus size={12} /></div>
          </div>
        </div>
      </div>
    </div>
  );
}
