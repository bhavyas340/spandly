import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  { emoji: "⚡", title: "3-Second Voice Log", desc: "Say 'chai 20' and you're done. Hindi + English.", tag: "Core hook", color: "orange" },
  { emoji: "🔥", title: "Streak System", desc: "Log daily, keep the flame alive. Miss a day, lose it all.", tag: "Addiction loop", color: "orange" },
  { emoji: "📱", title: "UPI SMS Auto-Read", desc: "We read GPay, PhonePe, Paytm SMS automatically.", tag: "Zero friction", color: "orange" },
  { emoji: "😱", title: "9PM Shock Report", desc: "Daily notification: 'You spent ₹847 today. Yikes.'", tag: "Daily re-engagement", color: "orange" },
  { emoji: "📊", title: "Monthly Report Card", desc: "Shareable WhatsApp-ready spending wrap.", tag: "Viral growth", color: "orange" },
  { emoji: "🤖", title: "AI Spend Coach", desc: "Personalized nudges. 'Skip 2 Swiggys, save ₹600.'", tag: "Premium", color: "purple" },
  { emoji: "👥", title: "Group Trip Splits", desc: "Goa with the boys? Split bills in one tap.", tag: "Viral acquisition", color: "purple" },
  { emoji: "🎯", title: "Savings Goal Jar", desc: "Round up every expense into your iPhone fund.", tag: "Retention", color: "purple" },
];

const steps = [
  { n: "01", icon: "☕", title: "You spend", desc: "Chai, auto, lunch." },
  { n: "02", icon: "⚡", title: "Log in 3 sec", desc: "Voice or tap." },
  { n: "03", icon: "🔥", title: "Streak fires", desc: "Day +1. Don't break it." },
  { n: "04", icon: "😱", title: "9PM shock", desc: "Daily reality check." },
  { n: "05", icon: "📤", title: "Month-end share", desc: "Flex your report card." },
];

function Landing() {
  const [demoTab, setDemoTab] = useState<"home" | "report">("home");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="max-w-[1100px] mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="font-display font-extrabold text-xl tracking-tight">Kharcha</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#how" className="hover:text-foreground transition">How it works</a>
            <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
          </nav>
          <Link to="/app" className="px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition">
            Try App →
          </Link>
        </div>
      </header>

      <section className="max-w-[1100px] mx-auto px-5 pt-12 md:pt-20 pb-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-border text-xs text-muted-foreground mb-6">
              🇮🇳 Built for India · Hindi + UPI Native
            </div>
            <h1 className="font-display font-extrabold text-5xl md:text-7xl leading-[1.02] tracking-tight">
              Your daily <span className="text-gradient-orange">kharcha</span>, tracked in 3 seconds.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
              Say "chai 20" and you're done. Voice-first expense tracker with streaks, UPI auto-read, and a monthly shock report.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/app" className="px-6 py-3.5 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-[0_8px_30px_rgba(255,107,0,0.35)]">
                ⚡ Try the App
              </Link>
              <button className="px-6 py-3.5 rounded-full border border-border text-foreground font-semibold hover:bg-card transition">
                📲 Get on Android
              </button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span>₹0 to start</span>
              <span className="opacity-30">·</span>
              <span>3 sec to log</span>
              <span className="opacity-30">·</span>
              <span>🔥 daily streak</span>
            </div>
          </div>

          <div className="relative flex justify-center items-center h-[600px]">
            <div className="absolute top-8 left-0 md:left-4 z-20 animate-float-soft px-3 py-2 rounded-xl bg-card border border-border text-sm font-semibold shadow-lg">
              🔥 14-day streak!
            </div>
            <div className="absolute bottom-16 right-0 md:right-4 z-20 animate-float-soft px-3 py-2 rounded-xl bg-card border border-border text-sm font-semibold shadow-lg" style={{ animationDelay: "1s" }}>
              ✓ chai 20 — logged
            </div>
            <div className="animate-float">
              <PhoneMockup screen={demoTab} />
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/40">
        <div className="max-w-[1100px] mx-auto px-5 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[["25.5B","app downloads in India"],["683M","UPI transactions daily"],["₹0","ad spend needed"],["3 sec","to log an expense"]].map(([n,l]) => (
            <div key={l}>
              <div className="font-display font-extrabold text-2xl md:text-3xl">{n}</div>
              <div className="text-xs text-muted-foreground mt-1">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="features" className="max-w-[1100px] mx-auto px-5 py-20">
        <div className="max-w-2xl mb-12">
          <div className="text-sm font-semibold text-primary mb-3">FEATURES</div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">
            Built for the way Indians actually spend.
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition">
              <div className="text-4xl mb-4">{f.emoji}</div>
              <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{f.desc}</p>
              <span
                className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full"
                style={{
                  background: f.color === "orange" ? "rgba(255,107,0,0.12)" : "rgba(167,139,250,0.12)",
                  color: f.color === "orange" ? "#FF6B00" : "#A78BFA",
                }}
              >
                {f.tag}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="max-w-[1100px] mx-auto px-5 py-20">
        <div className="p-8 md:p-12 rounded-3xl bg-card border border-border">
          <div className="text-sm font-semibold text-primary mb-3">HOW IT WORKS</div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight mb-12">
            From spend to share in one day.
          </h2>
          <div className="grid md:grid-cols-5 gap-4 md:gap-2">
            {steps.map((s, i) => (
              <div key={s.n} className="relative">
                <div className="p-5 rounded-2xl bg-background border border-border">
                  <div className="text-xs font-mono text-muted-foreground mb-2">{s.n}</div>
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="font-display font-bold mb-1">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.desc}</div>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-3 text-primary text-2xl -translate-y-1/2 z-10">→</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-5 py-20">
        <div className="text-center mb-10">
          <div className="text-sm font-semibold text-primary mb-3">PREVIEW</div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">See it. Feel it.</h2>
        </div>
        <div className="flex justify-center gap-2 mb-10">
          <button onClick={() => setDemoTab("home")} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${demoTab === "home" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>🏠 Home</button>
          <button onClick={() => setDemoTab("report")} className={`px-5 py-2.5 rounded-full text-sm font-semibold transition ${demoTab === "report" ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground"}`}>📊 Report Card</button>
        </div>
        <div className="flex justify-center">
          <PhoneMockup screen={demoTab} />
        </div>
      </section>

      <section id="pricing" className="max-w-[1100px] mx-auto px-5 py-20">
        <div className="text-center mb-12">
          <div className="text-sm font-semibold text-primary mb-3">PRICING</div>
          <h2 className="font-display font-extrabold text-4xl md:text-5xl tracking-tight">Start free. Stay forever.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          <PriceCard name="Free" price="₹0" sub="forever" features={["Voice log", "Streak system", "9PM shock report", "UPI SMS auto-read", "3 months history"]} />
          <PriceCard highlight name="Plus" price="₹99" sub="/month" features={["AI spend coach", "Report card share", "Budget alerts", "Savings jar", "Unlimited history", "Streak shields", "CSV export"]} />
          <PriceCard name="Family" price="₹199" sub="/month" features={["Everything in Plus", "4 family members", "Shared budget", "Group splits", "Unlimited shields", "Tax summary"]} />
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-5 py-24 text-center">
        <h2 className="font-display font-extrabold text-5xl md:text-7xl tracking-tight">
          🔥 Your streak <br />starts today.
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/app" className="px-7 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition shadow-[0_8px_30px_rgba(255,107,0,0.35)]">⚡ Try the App</Link>
          <button className="px-7 py-4 rounded-full border border-border font-semibold hover:bg-card transition">📲 Get on Android</button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="max-w-[1100px] mx-auto px-5 py-8 flex flex-wrap justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>🔥</span>
            <span className="font-display font-bold text-foreground">Kharcha</span>
            <span className="opacity-50">· Built for India</span>
          </div>
          <div className="opacity-60">© 2026 Kharcha. Made with ❤️ in Bengaluru.</div>
        </div>
      </footer>
    </div>
  );
}

function PriceCard({ name, price, sub, features, highlight }: { name: string; price: string; sub: string; features: string[]; highlight?: boolean }) {
  return (
    <div className={`p-7 rounded-3xl border relative ${highlight ? "border-primary bg-gradient-to-b from-primary/10 to-transparent" : "border-border bg-card"}`}>
      {highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-wider">
          Most popular
        </div>
      )}
      <div className="font-display font-bold text-lg mb-2">{name}</div>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="font-display font-extrabold text-5xl">{price}</span>
        <span className="text-muted-foreground text-sm">{sub}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm">
            <span className="text-primary mt-0.5">✓</span>
            <span className="text-foreground/90">{f}</span>
          </li>
        ))}
      </ul>
      <Link to="/app" className={`block text-center py-3 rounded-full font-semibold text-sm transition ${highlight ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-card-2 border border-border hover:border-primary/50"}`}>
        {highlight ? "Get Plus →" : "Choose plan"}
      </Link>
    </div>
  );
}

function PhoneMockup({ screen }: { screen: "home" | "report" }) {
  return (
    <div
      className="relative"
      style={{
        width: 320,
        height: 640,
        borderRadius: 36,
        background: "#080808",
        border: "2px solid #2A2A2A",
        boxShadow: "0 0 0 8px #0e0e0e, 0 30px 80px rgba(255,107,0,0.15), 0 20px 60px rgba(0,0,0,0.6)",
        padding: 14,
        overflow: "hidden",
      }}
    >
      <div className="w-full h-full rounded-[26px] overflow-hidden bg-background relative">
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-full z-10" />
        <div className="h-full overflow-y-auto pt-8 px-4 pb-4">
          {screen === "home" ? <MiniHome /> : <MiniReport />}
        </div>
      </div>
    </div>
  );
}

function MiniHome() {
  return (
    <div className="space-y-3 text-xs">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-[10px] text-muted-foreground">Good morning</div>
          <div className="font-display font-bold text-sm">Aarav 👋</div>
        </div>
        <div className="px-2 py-1 rounded-full bg-primary/15 text-primary font-bold text-xs">🔥 14</div>
      </div>
      <div className="flex justify-between gap-1">
        {["M","T","W","T","F","S","S"].map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
              i < 4 ? "bg-primary text-primary-foreground" :
              i === 4 ? "bg-primary/20 text-primary animate-streak-pulse" :
              "bg-card border border-border text-muted-foreground"
            }`}>
              {i < 4 ? "✓" : i === 4 ? "🔥" : "·"}
            </div>
            <span className="text-[9px] text-muted-foreground">{d}</span>
          </div>
        ))}
      </div>
      <div className="p-3 rounded-2xl gradient-orange-tint border border-primary/20">
        <div className="text-[10px] text-muted-foreground">Today's kharcha</div>
        <div className="font-display font-extrabold text-2xl">₹864</div>
        <div className="text-[10px] text-muted-foreground">5 transactions</div>
        <div className="mt-2 text-[10px] text-foreground/80">💡 At this rate: ₹25,920 this month.</div>
      </div>
      <div className="space-y-1.5">
        {[["☕","Chai","08:12","₹20"],["🛺","Ola Auto","09:30","₹85"],["🍛","Thali","01:15","₹140"]].map((r,i) => (
          <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-card border border-border">
            <div className="text-base">{r[0]}</div>
            <div className="flex-1">
              <div className="font-semibold text-[11px]">{r[1]}</div>
              <div className="text-[9px] text-muted-foreground">{r[2]}</div>
            </div>
            <div className="font-bold text-[11px]">{r[3]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MiniReport() {
  const cats: Array<[string, number, string]> = [
    ["Food", 480, "#FF6B00"],
    ["Travel", 85, "#FFD60A"],
    ["Bills", 299, "#A78BFA"],
  ];
  const max = 480;
  return (
    <div className="space-y-3 text-xs">
      <div className="font-display font-extrabold text-base">April Report Card 📊</div>
      <div className="p-3 rounded-2xl gradient-orange-tint border border-primary/20">
        <div className="text-[10px] text-muted-foreground">Total spent</div>
        <div className="font-display font-extrabold text-2xl">₹24,580</div>
        <div className="text-[10px] text-muted-foreground">↑ 12% vs March</div>
      </div>
      <div className="space-y-2">
        {cats.map(([n,v,c]) => (
          <div key={n}>
            <div className="flex justify-between text-[10px] mb-1">
              <span>{n}</span><span className="font-bold">₹{v}</span>
            </div>
            <div className="h-2 rounded-full bg-card overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${(v/max)*100}%`, background: c }} />
            </div>
          </div>
        ))}
      </div>
      <div className="p-3 rounded-2xl bg-card border border-primary/40">
        <div className="text-[10px] text-primary font-bold mb-1">🤖 AI COACH</div>
        <div className="text-[10px] leading-relaxed">You spent 47% on food. Skip 2 Swiggys/week → save ₹2,400.</div>
      </div>
      <button className="w-full py-2.5 rounded-full bg-primary text-primary-foreground font-bold text-xs">
        📤 Share to WhatsApp
      </button>
    </div>
  );
}
