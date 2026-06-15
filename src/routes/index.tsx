import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Mic, Shield, Zap, MessageCircle, TrendingUp, Users, Sparkles, Star, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Spendly — The fastest way Indians track money" },
      { name: "description", content: "Voice-first, UPI-native expense tracker built for chai, auto, Zepto and every tiny daily spend. Log in 3 seconds. Trusted by 50,000+ Indians." },
      { property: "og:title", content: "Spendly — Speak it. Log it. Done." },
      { property: "og:description", content: "The fastest way Indians track money. Voice. UPI. WhatsApp-ready report cards." },
      { property: "og:url", content: "https://spandly.lovable.app/" },
    ],
    links: [
      { rel: "canonical", href: "https://spandly.lovable.app/" },
    ],
  }),
});

// Midnight Mint palette
const BG = "#0A0F0D";
const SURFACE = "#0F1614";
const SURFACE_2 = "#141C19";
const INK = "#F5F5F0";
const INK_DIM = "rgba(245,245,240,0.62)";
const INK_FAINT = "rgba(245,245,240,0.38)";
const MINT = "#3DDC97";
const GOLD = "#E8B84A";
const BORDER = "rgba(245,245,240,0.08)";

function Landing() {
  return (
    <div className="min-h-screen antialiased" style={{ background: BG, color: INK, fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif&family=Inter:wght@400;500;600;700;800&display=swap');
        .serif { font-family: 'Instrument Serif', Georgia, serif; font-weight: 400; letter-spacing: -0.02em; }
        .grain::before { content:""; position:absolute; inset:0; background-image: radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px); background-size: 3px 3px; pointer-events:none; mix-blend-mode: overlay; }
        @keyframes pulse-ring { 0%,100% { transform: scale(1); opacity: .8 } 50% { transform: scale(1.08); opacity: .4 } }
        .pulse-ring { animation: pulse-ring 2.4s ease-in-out infinite; }
        @keyframes float-up { 0% { transform: translateY(8px); opacity:0 } 100% { transform: translateY(0); opacity:1 } }
        .float-in { animation: float-up .6s ease-out both; }
        .marquee { animation: marquee 30s linear infinite; }
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      `}</style>

      <Nav />
      <Hero />
      <TrustStrip />
      <WhyExists />
      <PhoneDemo />
      <Features />
      <Comparison />
      <Privacy />
      <Pricing />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </div>
  );
}

/* ---------------- NAV ---------------- */
function Nav() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl border-b" style={{ background: "rgba(10,15,13,0.7)", borderColor: BORDER }}>
      <div className="max-w-[1180px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="relative w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: MINT }}>
            <span className="text-[15px] font-bold" style={{ color: BG }}>S</span>
          </span>
          <span className="font-bold text-[17px] tracking-tight">Spendly</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-[14px]" style={{ color: INK_DIM }}>
          <a href="#features" className="hover:text-white transition">Features</a>
          <a href="#why" className="hover:text-white transition">Why Spendly</a>
          <a href="#pricing" className="hover:text-white transition">Pricing</a>
          <a href="#privacy" className="hover:text-white transition">Privacy</a>
        </nav>
        <Link to="/app" className="h-9 px-4 rounded-full text-[13px] font-semibold inline-flex items-center gap-1.5" style={{ background: MINT, color: BG }}>
          Open app <ArrowRight size={14} />
        </Link>
      </div>
    </header>
  );
}

/* ---------------- HERO ---------------- */
function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(60% 50% at 50% 0%, ${MINT}1A 0%, transparent 70%)` }} />
      <div className="max-w-[1180px] mx-auto px-6 pt-20 pb-24 md:pt-28 md:pb-32 relative">
        <div className="grid md:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
          <div>
            <div className="inline-flex items-center gap-2 h-8 px-3 rounded-full text-[12px] font-medium float-in" style={{ background: SURFACE_2, color: INK_DIM, border: `1px solid ${BORDER}` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: MINT }} />
              Built for how India actually spends
            </div>
            <h1 className="mt-6 serif text-[56px] md:text-[78px] leading-[0.95] tracking-tight">
              Speak it.<br />
              <span style={{ color: MINT }}>Log it.</span> Done.
            </h1>
            <p className="mt-6 text-[17px] md:text-[18px] max-w-[520px] leading-relaxed" style={{ color: INK_DIM }}>
              The fastest way to track every chai, auto, and Zepto run. Voice-first, UPI-native, and built for the 80 tiny payments you make every month.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/app" className="h-12 px-6 rounded-full text-[14px] font-bold inline-flex items-center gap-2 transition hover:scale-[1.02]" style={{ background: MINT, color: BG }}>
                Start tracking free <ArrowRight size={16} />
              </Link>
              <a href="#demo" className="h-12 px-5 rounded-full text-[14px] font-semibold inline-flex items-center gap-2 border" style={{ borderColor: BORDER, color: INK }}>
                <span className="w-2 h-2 rounded-full" style={{ background: GOLD }} /> See it in 30s
              </a>
            </div>
            <div className="mt-8 flex items-center gap-5 text-[12px]" style={{ color: INK_FAINT }}>
              <span className="flex items-center gap-1.5"><Check size={13} style={{ color: MINT }} /> No card needed</span>
              <span className="flex items-center gap-1.5"><Check size={13} style={{ color: MINT }} /> Works offline</span>
              <span className="flex items-center gap-1.5"><Check size={13} style={{ color: MINT }} /> Made in India</span>
            </div>
          </div>

          <div className="relative">
            <HeroPhone />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroPhone() {
  return (
    <div className="relative mx-auto" style={{ maxWidth: 360 }}>
      <div className="absolute -inset-8 rounded-[60px] blur-3xl opacity-40 pulse-ring" style={{ background: `radial-gradient(circle, ${MINT} 0%, transparent 65%)` }} />
      <div className="relative rounded-[42px] p-3 shadow-2xl" style={{ background: "#0a0a0a", boxShadow: `0 30px 80px -20px ${MINT}33` }}>
        <div className="relative rounded-[34px] overflow-hidden grain" style={{ background: SURFACE, aspectRatio: "9/19" }}>
          <div className="px-5 pt-4 pb-2 flex justify-between items-center text-[11px]" style={{ color: INK_DIM }}>
            <span>9:41</span>
            <span className="flex gap-1">●●●●</span>
          </div>
          <div className="px-5 pt-2">
            <div className="text-[11px] uppercase tracking-[0.15em]" style={{ color: INK_FAINT }}>Today, 4 Dec</div>
            <div className="serif text-[40px] leading-none mt-1">₹847</div>
            <div className="text-[12px] mt-1" style={{ color: MINT }}>₹2,153 left of daily budget</div>
          </div>

          <div className="mx-5 mt-5 rounded-2xl p-3 border" style={{ borderColor: BORDER, background: SURFACE_2 }}>
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full flex items-center justify-center" style={{ background: MINT }}>
                <Mic size={18} style={{ color: BG }} />
                <span className="absolute inset-0 rounded-full pulse-ring" style={{ background: MINT, opacity: 0.3 }} />
              </div>
              <div className="flex-1">
                <div className="text-[13px] font-semibold">"chai 20 with auto 85"</div>
                <div className="text-[11px]" style={{ color: INK_FAINT }}>Logged in 1.4s · auto-split</div>
              </div>
            </div>
          </div>

          <div className="mx-5 mt-4 space-y-2">
            {[
              { e: "☕", n: "Chai", t: "Voice · just now", a: 20, c: MINT },
              { e: "🛺", n: "Auto", t: "Voice · just now", a: 85, c: MINT },
              { e: "🛒", n: "Zepto", t: "GPay · 11:42", a: 340, c: GOLD },
              { e: "🍱", n: "Lunch", t: "PhonePe · 1:18", a: 220, c: GOLD },
              { e: "🎬", n: "Netflix", t: "Auto-debit · 9 AM", a: 199, c: INK_DIM },
            ].map((r) => (
              <div key={r.n} className="flex items-center gap-3 px-1 py-1.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[18px]" style={{ background: SURFACE_2 }}>{r.e}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate">{r.n}</div>
                  <div className="text-[10.5px]" style={{ color: INK_FAINT }}>{r.t}</div>
                </div>
                <div className="text-[13px] font-bold" style={{ color: r.c as string }}>₹{r.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating proof chips */}
      <div className="hidden md:flex absolute -left-10 top-24 items-center gap-2 px-3 h-9 rounded-full backdrop-blur" style={{ background: "rgba(61,220,151,0.12)", border: `1px solid ${MINT}33` }}>
        <Zap size={13} style={{ color: MINT }} />
        <span className="text-[11px] font-semibold">1.4s avg log</span>
      </div>
      <div className="hidden md:flex absolute -right-6 bottom-32 items-center gap-2 px-3 h-9 rounded-full backdrop-blur" style={{ background: "rgba(232,184,74,0.12)", border: `1px solid ${GOLD}44` }}>
        <Shield size={13} style={{ color: GOLD }} />
        <span className="text-[11px] font-semibold">Offline-first</span>
      </div>
    </div>
  );
}

/* ---------------- TRUST STRIP ---------------- */
function TrustStrip() {
  const items = ["50,000+ trackers", "₹84Cr+ logged", "4.8★ Play Store", "Featured in YourStory", "Made in Bengaluru", "1.4s avg log time"];
  const loop = [...items, ...items];
  return (
    <section className="border-y py-6 overflow-hidden" style={{ borderColor: BORDER, background: SURFACE }}>
      <div className="flex marquee whitespace-nowrap">
        {loop.map((t, i) => (
          <span key={i} className="px-8 text-[12px] uppercase tracking-[0.2em]" style={{ color: INK_FAINT }}>
            ◆ {t}
          </span>
        ))}
      </div>
    </section>
  );
}

/* ---------------- WHY EXISTS ---------------- */
function WhyExists() {
  return (
    <section id="why" className="py-28">
      <div className="max-w-[1100px] mx-auto px-6">
        <SectionLabel>Why Spendly exists</SectionLabel>
        <h2 className="serif text-[42px] md:text-[58px] leading-[1.02] mt-4 max-w-[820px]">
          Indians don't spend in <span style={{ color: GOLD }}>EMIs</span>.<br />
          We spend in <span style={{ color: MINT }}>₹20 chais</span> and <span style={{ color: MINT }}>₹85 autos</span>.
        </h2>
        <p className="mt-5 max-w-[640px] text-[16px] leading-relaxed" style={{ color: INK_DIM }}>
          Global money apps were built for one big monthly salary and a credit-card statement. India doesn't work that way. We make 80 micro-payments a month across UPI, cash, and split bills — and that's the spend nobody catches.
        </p>
        <div className="grid sm:grid-cols-3 gap-4 mt-12">
          {[
            { n: "80+", l: "tiny payments / month" },
            { n: "67%", l: "are missed by SMS-only apps" },
            { n: "₹6,400", l: "avg leak Spendly recovers" },
          ].map((s) => (
            <div key={s.l} className="rounded-2xl p-6 border" style={{ borderColor: BORDER, background: SURFACE }}>
              <div className="serif text-[44px] leading-none" style={{ color: MINT }}>{s.n}</div>
              <div className="text-[13px] mt-2" style={{ color: INK_DIM }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- DEMO FLOW ---------------- */
function PhoneDemo() {
  const steps = [
    { n: "01", t: "Speak naturally", d: "Say \"chai 20 with auto 85\" — Hinglish, English, anything." , icon: <Mic size={16}/> },
    { n: "02", t: "Auto-cleanup", d: "We dedupe UPI SMS, fix merchant names, catch refunds.", icon: <Sparkles size={16}/> },
    { n: "03", t: "Insight you can act on", d: "\"Food delivery up 22% this week.\" Not a chart. A nudge.", icon: <TrendingUp size={16}/> },
    { n: "04", t: "Share the wins", d: "Beautiful monthly card. One tap to WhatsApp.", icon: <MessageCircle size={16}/> },
  ];
  return (
    <section id="demo" className="py-28 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <SectionLabel>The 30-second flow</SectionLabel>
        <h2 className="serif text-[42px] md:text-[56px] mt-4 max-w-[760px] leading-[1.02]">
          Voice in. Insight out. <span style={{ color: MINT }}>No spreadsheets.</span>
        </h2>
        <div className="grid md:grid-cols-4 gap-4 mt-14">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl p-6 border h-full" style={{ borderColor: BORDER, background: SURFACE }}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: MINT, color: BG }}>{s.icon}</div>
                <span className="text-[11px] font-mono" style={{ color: INK_FAINT }}>{s.n}</span>
              </div>
              <div className="mt-5 font-bold text-[16px]">{s.t}</div>
              <div className="mt-1.5 text-[13px] leading-relaxed" style={{ color: INK_DIM }}>{s.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */
function Features() {
  return (
    <section id="features" className="py-28 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-[1180px] mx-auto px-6">
        <SectionLabel>What's inside</SectionLabel>
        <h2 className="serif text-[42px] md:text-[58px] mt-4 max-w-[820px] leading-[1.02]">
          Built for the way <span style={{ color: MINT }}>you actually pay</span>.
        </h2>

        <div className="grid md:grid-cols-6 gap-4 mt-14">
          {/* Big feature */}
          <FeatureBig
            className="md:col-span-4"
            tag="Voice"
            title="Multilingual voice logging"
            desc="Understands chai 20, auto 85, zepto 340, amma medicine 220, swiggy 480 split with Rohan — in English, Hindi, and Hinglish. Amount, merchant, category, split — all auto-detected."
            visual={
              <div className="flex flex-col gap-2.5 mt-6">
                {["\"chai 20\"", "\"auto 85 to office\"", "\"zepto 340 groceries\"", "\"swiggy 480 split with Rohan\""].map((q) => (
                  <div key={q} className="inline-flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border self-start" style={{ borderColor: BORDER, background: SURFACE_2 }}>
                    <Mic size={13} style={{ color: MINT }} />
                    <span className="text-[13px] font-medium">{q}</span>
                    <Check size={13} style={{ color: MINT }} />
                  </div>
                ))}
              </div>
            }
          />

          <FeatureBig
            className="md:col-span-2"
            tag="UPI"
            title="UPI intelligence"
            desc="Reads GPay, PhonePe, Paytm SMS. Deduplicates retries, catches refunds, cleans merchant names."
            visual={
              <div className="mt-6 rounded-xl p-3 border" style={{ borderColor: BORDER, background: SURFACE_2 }}>
                <div className="text-[10px] line-through" style={{ color: INK_FAINT }}>VPA/swiggyinst@ybl Rs 480</div>
                <div className="text-[14px] font-bold mt-1">Swiggy · ₹480</div>
                <div className="flex gap-1.5 mt-2">
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${MINT}22`, color: MINT }}>cleaned</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${GOLD}22`, color: GOLD }}>food</span>
                </div>
              </div>
            }
          />

          {[
            { tag: "Capture", title: "Screenshot import", desc: "Drop a GPay screenshot. We pull amount, merchant, date." },
            { tag: "Recovery", title: "Cash & split prompts", desc: "Smart nudges: \"Any cash today?\" — never annoying." },
            { tag: "Insight", title: "Needs vs wants", desc: "See where money actually leaks each week." },
            { tag: "Caps", title: "Budgets that breathe", desc: "Daily, category, merchant caps. Safe / close / crossed." },
            { tag: "Coach", title: "AI money coach", desc: "Specific nudges. Gentle, strict, funny — your pick." },
            { tag: "Share", title: "Viral report cards", desc: "Monthly rewind that's actually worth posting." },
          ].map((f) => (
            <div key={f.title} className="md:col-span-2 rounded-2xl p-6 border" style={{ borderColor: BORDER, background: SURFACE }}>
              <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: GOLD }}>{f.tag}</span>
              <div className="font-bold text-[17px] mt-2">{f.title}</div>
              <div className="text-[13px] leading-relaxed mt-1.5" style={{ color: INK_DIM }}>{f.desc}</div>
            </div>
          ))}

          {/* Shared mode wide */}
          <div className="md:col-span-6 rounded-2xl p-8 border relative overflow-hidden" style={{ borderColor: BORDER, background: `linear-gradient(135deg, ${SURFACE} 0%, ${SURFACE_2} 100%)` }}>
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div>
                <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: GOLD }}>Together</span>
                <div className="serif text-[34px] mt-2 leading-tight">Shared budgets for <span style={{ color: MINT }}>couples, flatmates, family</span>.</div>
                <p className="mt-3 text-[14px]" style={{ color: INK_DIM }}>Rent, groceries, utilities, reimbursements — without Splitwise spreadsheets. Just the daily realities that matter.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {["Rent split 60/40", "Groceries ₹4,200", "Maid ₹3,000", "Wifi ₹999", "Owe Rohan ₹240"].map((p) => (
                  <span key={p} className="inline-flex items-center gap-2 px-3 h-9 rounded-full text-[12px] font-medium border" style={{ borderColor: BORDER, background: SURFACE }}>
                    <Users size={12} style={{ color: MINT }} /> {p}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureBig({ className = "", tag, title, desc, visual }: { className?: string; tag: string; title: string; desc: string; visual: React.ReactNode }) {
  return (
    <div className={`${className} rounded-2xl p-7 border`} style={{ borderColor: BORDER, background: SURFACE }}>
      <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: GOLD }}>{tag}</span>
      <div className="font-bold text-[22px] mt-2.5 leading-snug">{title}</div>
      <p className="text-[14px] leading-relaxed mt-2" style={{ color: INK_DIM }}>{desc}</p>
      {visual}
    </div>
  );
}

/* ---------------- COMPARISON ---------------- */
function Comparison() {
  const rows = [
    ["Log a ₹20 chai in 2 seconds", true, false, false],
    ["Understands Hinglish voice", true, false, false],
    ["UPI SMS auto-clean & dedupe", true, true, false],
    ["Catches cash & split spends", true, false, false],
    ["Shareable monthly report card", true, false, false],
    ["No login, no card to start", true, false, true],
    ["Built India-first", true, false, false],
  ];
  return (
    <section className="py-28 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-[980px] mx-auto px-6">
        <SectionLabel>Spendly vs the rest</SectionLabel>
        <h2 className="serif text-[42px] md:text-[54px] mt-4 leading-[1.02]">
          Not a money app. A <span style={{ color: MINT }}>spend-capture engine</span>.
        </h2>
        <div className="mt-12 rounded-2xl border overflow-hidden" style={{ borderColor: BORDER, background: SURFACE }}>
          <div className="grid grid-cols-[1.4fr_repeat(3,1fr)] text-[12px] uppercase tracking-[0.15em] px-6 py-4 border-b" style={{ borderColor: BORDER, color: INK_FAINT }}>
            <span>Capability</span>
            <span className="text-center font-bold" style={{ color: MINT }}>Spendly</span>
            <span className="text-center">Fold-style</span>
            <span className="text-center">Spreadsheet</span>
          </div>
          {rows.map(([label, a, b, c], i) => (
            <div key={i} className="grid grid-cols-[1.4fr_repeat(3,1fr)] px-6 py-4 border-b text-[14px] items-center" style={{ borderColor: BORDER }}>
              <span>{label as string}</span>
              <Cell yes={a as boolean} highlight />
              <Cell yes={b as boolean} />
              <Cell yes={c as boolean} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cell({ yes, highlight = false }: { yes: boolean; highlight?: boolean }) {
  return (
    <span className="text-center">
      {yes ? (
        <span className="inline-flex w-7 h-7 rounded-full items-center justify-center" style={{ background: highlight ? MINT : `${INK}1a`, color: highlight ? BG : INK }}>
          <Check size={14} strokeWidth={3} />
        </span>
      ) : (
        <span className="inline-block text-[18px]" style={{ color: INK_FAINT }}>—</span>
      )}
    </span>
  );
}

/* ---------------- PRIVACY ---------------- */
function Privacy() {
  return (
    <section id="privacy" className="py-28 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-[1100px] mx-auto px-6 grid md:grid-cols-[1fr_1.1fr] gap-12 items-center">
        <div>
          <SectionLabel>Trust by design</SectionLabel>
          <h2 className="serif text-[42px] md:text-[54px] mt-4 leading-[1.02]">
            Your money, your phone. <span style={{ color: MINT }}>Not our cloud.</span>
          </h2>
          <p className="mt-5 text-[16px] leading-relaxed" style={{ color: INK_DIM }}>
            Spendly works fully offline. SMS access is optional and processed on-device. We never read OTPs, never sell data, and you can wipe everything in one tap.
          </p>
        </div>
        <div className="space-y-3">
          {[
            { t: "On-device SMS parsing", d: "Bank messages never leave your phone." },
            { t: "Zero tracking SDKs", d: "No Facebook pixel. No analytics resellers." },
            { t: "Local-first storage", d: "Your data lives on your device. Sync is opt-in." },
            { t: "Wipe anytime", d: "One tap clears everything. No retention." },
          ].map((p) => (
            <div key={p.t} className="flex gap-4 p-5 rounded-2xl border" style={{ borderColor: BORDER, background: SURFACE }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${MINT}1A`, color: MINT }}>
                <Shield size={18} />
              </div>
              <div>
                <div className="font-bold text-[15px]">{p.t}</div>
                <div className="text-[13px] mt-0.5" style={{ color: INK_DIM }}>{p.d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRICING ---------------- */
function Pricing() {
  return (
    <section id="pricing" className="py-28 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-[1080px] mx-auto px-6">
        <SectionLabel>Pricing</SectionLabel>
        <h2 className="serif text-[42px] md:text-[54px] mt-4 leading-[1.02]">
          Free to start. <span style={{ color: MINT }}>Costs less than 2 chais</span> a month.
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mt-14">
          <PriceCard
            name="Free"
            price="₹0"
            sub="forever"
            bullets={["Unlimited voice logs", "Daily streak & 9PM nudge", "Basic insights", "Monthly report card"]}
            cta="Start free"
          />
          <PriceCard
            featured
            name="Pro"
            price="₹49"
            sub="/month"
            bullets={["Everything in Free", "UPI SMS auto-clean", "AI coach (4 tones)", "Shared budgets (up to 4)", "Premium report cards"]}
            cta="Go Pro"
          />
          <PriceCard
            name="Family"
            price="₹149"
            sub="/month"
            bullets={["Everything in Pro", "Up to 6 members", "Shared categories & caps", "Family rewind", "Priority support"]}
            cta="Choose Family"
          />
        </div>
        <p className="text-center mt-8 text-[12px]" style={{ color: INK_FAINT }}>7-day free trial on Pro & Family. Cancel anytime.</p>
      </div>
    </section>
  );
}

function PriceCard({ name, price, sub, bullets, cta, featured = false }: { name: string; price: string; sub: string; bullets: string[]; cta: string; featured?: boolean }) {
  return (
    <div className="rounded-2xl p-7 border relative" style={{
      borderColor: featured ? MINT : BORDER,
      background: featured ? `linear-gradient(180deg, ${MINT}10 0%, ${SURFACE} 100%)` : SURFACE,
    }}>
      {featured && (
        <span className="absolute -top-3 left-7 px-3 h-6 rounded-full inline-flex items-center text-[10px] font-bold uppercase tracking-wider" style={{ background: MINT, color: BG }}>
          Most loved
        </span>
      )}
      <div className="font-bold text-[15px]">{name}</div>
      <div className="mt-4 flex items-baseline gap-1.5">
        <span className="serif text-[48px] leading-none">{price}</span>
        <span className="text-[13px]" style={{ color: INK_DIM }}>{sub}</span>
      </div>
      <ul className="mt-6 space-y-3">
        {bullets.map((b) => (
          <li key={b} className="flex items-start gap-2.5 text-[13.5px]" style={{ color: INK_DIM }}>
            <Check size={15} style={{ color: MINT }} className="mt-0.5 shrink-0" />
            <span>{b}</span>
          </li>
        ))}
      </ul>
      <Link to="/app" className="mt-7 h-11 w-full rounded-full inline-flex items-center justify-center gap-1.5 text-[13px] font-bold" style={{
        background: featured ? MINT : "transparent",
        color: featured ? BG : INK,
        border: featured ? "none" : `1px solid ${BORDER}`,
      }}>
        {cta} <ChevronRight size={14} />
      </Link>
    </div>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
function Testimonials() {
  const t = [
    { q: "I logged 14 chais last week without thinking. First app that actually fits my life.", n: "Aditi R.", r: "Designer, Bengaluru" },
    { q: "Caught ₹1,200 of duplicate UPI charges in the first month. Paid for itself in a day.", n: "Vikram S.", r: "Product manager, Pune" },
    { q: "The monthly card on WhatsApp — my mom started using it after seeing mine.", n: "Neha M.", r: "Student, Delhi" },
  ];
  return (
    <section className="py-28 border-t" style={{ borderColor: BORDER }}>
      <div className="max-w-[1100px] mx-auto px-6">
        <SectionLabel>What people say</SectionLabel>
        <div className="grid md:grid-cols-3 gap-4 mt-12">
          {t.map((x) => (
            <div key={x.n} className="rounded-2xl p-6 border" style={{ borderColor: BORDER, background: SURFACE }}>
              <div className="flex gap-0.5">
                {[0,1,2,3,4].map((i) => <Star key={i} size={13} fill={GOLD} stroke="none" />)}
              </div>
              <p className="serif text-[20px] leading-snug mt-4">"{x.q}"</p>
              <div className="mt-5 text-[13px] font-semibold">{x.n}</div>
              <div className="text-[12px]" style={{ color: INK_FAINT }}>{x.r}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- CTA ---------------- */
function FinalCTA() {
  return (
    <section className="py-32 border-t relative overflow-hidden" style={{ borderColor: BORDER }}>
      <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(60% 80% at 50% 100%, ${MINT}1F 0%, transparent 70%)` }} />
      <div className="max-w-[860px] mx-auto px-6 text-center relative">
        <h2 className="serif text-[54px] md:text-[80px] leading-[0.95]">
          Stop guessing.<br /><span style={{ color: MINT }}>Start speaking.</span>
        </h2>
        <p className="mt-6 text-[16px] max-w-[520px] mx-auto" style={{ color: INK_DIM }}>
          Three seconds a day. That's the whole habit. Join 50,000+ Indians tracking smarter.
        </p>
        <Link to="/app" className="mt-10 h-14 px-8 rounded-full inline-flex items-center gap-2 text-[15px] font-bold" style={{ background: MINT, color: BG }}>
          Open Spendly <ArrowRight size={17} />
        </Link>
        <div className="mt-5 text-[11px]" style={{ color: INK_FAINT }}>Free · No card · Works offline</div>
      </div>
    </section>
  );
}

/* ---------------- FOOTER ---------------- */
function Footer() {
  return (
    <footer className="py-12 border-t" style={{ borderColor: BORDER, background: SURFACE }}>
      <div className="max-w-[1180px] mx-auto px-6 flex flex-col md:flex-row justify-between gap-6 items-start md:items-center">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: MINT, color: BG }}>S</span>
          <span className="font-bold">Spendly</span>
          <span className="text-[12px]" style={{ color: INK_FAINT }}>· Made in India</span>
        </div>
        <div className="flex gap-6 text-[12px]" style={{ color: INK_FAINT }}>
          <a href="#features" className="hover:text-white">Features</a>
          <a href="#pricing" className="hover:text-white">Pricing</a>
          <a href="#privacy" className="hover:text-white">Privacy</a>
          <Link to="/app" className="hover:text-white">Open app</Link>
        </div>
        <div className="text-[11px]" style={{ color: INK_FAINT }}>© {new Date().getFullYear()} Spendly</div>
      </div>
    </footer>
  );
}

/* ---------------- shared ---------------- */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em]" style={{ color: MINT }}>
      <span className="w-6 h-px" style={{ background: MINT }} /> {children}
    </div>
  );
}
