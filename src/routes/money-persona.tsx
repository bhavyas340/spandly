import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Share2, Download, RotateCcw, Copy, Check } from "lucide-react";

export const Route = createFileRoute("/money-persona")({
  component: MoneyPersonaPage,
  head: () => ({
    meta: [
      { title: "What's Your Money Persona? Indian Spending Quiz | Spendly" },
      {
        name: "description",
        content:
          "Find out your Indian money personality in 60 seconds. Are you a Chai Sultan, Swiggy Maharaja, or Iron Saver? Take the quiz and share with friends.",
      },
      { property: "og:title", content: "What's Your Money Persona? — Spendly Quiz" },
      {
        property: "og:description",
        content: "60-second quiz. 8 desi personas. Shareable card at the end. Find your money twin.",
      },
      { property: "og:url", content: "https://spandly.lovable.app/money-persona" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://spandly.lovable.app/money-persona" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Quiz",
          name: "What's Your Indian Money Persona?",
          about: "Personal finance personality quiz for Indian spenders",
          url: "https://spandly.lovable.app/money-persona",
          educationalLevel: "beginner",
          numberOfQuestions: 7,
        }),
      },
    ],
  }),
});

type Tag = "spender" | "saver" | "social" | "impulsive" | "planner" | "foodie" | "ritual";

type Q = { q: string; options: { text: string; emoji: string; tags: Tag[] }[] };

const QUESTIONS: Q[] = [
  {
    q: "It's 4 PM. The chai-wala calls. You:",
    options: [
      { text: "Already there. Third cup.", emoji: "☕", tags: ["ritual", "social"] },
      { text: "Skip — too many today", emoji: "🚫", tags: ["saver", "planner"] },
      { text: "One chai + samosa combo", emoji: "🥟", tags: ["foodie", "social"] },
      { text: "Order on Zomato instead", emoji: "📱", tags: ["impulsive", "foodie"] },
    ],
  },
  {
    q: "Friday night. Plans?",
    options: [
      { text: "Swiggy + Netflix. Bed by 11.", emoji: "🛋️", tags: ["foodie", "ritual"] },
      { text: "Out with the squad. Bill split chaos.", emoji: "🍻", tags: ["social", "spender"] },
      { text: "Stay in. Cook. Save.", emoji: "🍳", tags: ["saver", "planner"] },
      { text: "Surprise weekend trip booked 2 hrs ago", emoji: "✈️", tags: ["impulsive", "spender"] },
    ],
  },
  {
    q: "Your UPI history for today shows:",
    options: [
      { text: "12 transactions under ₹50", emoji: "🪙", tags: ["ritual", "spender"] },
      { text: "One big one — rent or bill", emoji: "🏠", tags: ["planner"] },
      { text: "Mostly food delivery", emoji: "🍱", tags: ["foodie", "impulsive"] },
      { text: "Zero. Cash-only day.", emoji: "💵", tags: ["saver"] },
    ],
  },
  {
    q: "Sale notification at 11 PM:",
    options: [
      { text: "Add to cart. Buy. Regret tomorrow.", emoji: "🛒", tags: ["impulsive", "spender"] },
      { text: "Wishlist. Sleep on it.", emoji: "📋", tags: ["planner", "saver"] },
      { text: "Forward to the group chat first", emoji: "💬", tags: ["social"] },
      { text: "Mute. Phone away.", emoji: "🔕", tags: ["saver", "ritual"] },
    ],
  },
  {
    q: "Salary hits the account. First move?",
    options: [
      { text: "Transfer to savings before I see it", emoji: "🔐", tags: ["saver", "planner"] },
      { text: "Treat dinner for everyone", emoji: "🎉", tags: ["social", "spender"] },
      { text: "Pay all EMIs same minute", emoji: "📅", tags: ["planner"] },
      { text: "Something nice for me. Earned it.", emoji: "🎁", tags: ["impulsive", "spender"] },
    ],
  },
  {
    q: "Your spending tracker would say:",
    options: [
      { text: "Food. So much food.", emoji: "🍔", tags: ["foodie"] },
      { text: "Tiny chai/auto/paan repeats", emoji: "🛺", tags: ["ritual"] },
      { text: "Bills, EMIs, rent — adulting", emoji: "📊", tags: ["planner"] },
      { text: "Random gifts, party tabs", emoji: "🎈", tags: ["social", "impulsive"] },
    ],
  },
  {
    q: "Best feeling in money?",
    options: [
      { text: "Watching FD interest tick up", emoji: "📈", tags: ["saver", "planner"] },
      { text: "Paying the whole table's bill", emoji: "💳", tags: ["social", "spender"] },
      { text: "Cashback notification", emoji: "💰", tags: ["planner", "saver"] },
      { text: "That first sip after a long day", emoji: "☕", tags: ["ritual", "foodie"] },
    ],
  },
];

type Persona = {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  power: string;
  kryptonite: string;
  gradient: string;
  textColor: string;
};

const PERSONAS: Record<string, Persona> = {
  "chai-sultan": {
    id: "chai-sultan",
    name: "The Chai Sultan",
    emoji: "☕👑",
    tagline: "Ruler of the ₹20 kingdom. Empire built one cup at a time.",
    power: "Never says no to chai. Knows every tapri in 2 km.",
    kryptonite: "Those ₹20s add up to ₹6,000/month and you'll act shocked",
    gradient: "linear-gradient(160deg,#FFB347 0%,#7B3F00 100%)",
    textColor: "#fff",
  },
  "swiggy-maharaja": {
    id: "swiggy-maharaja",
    name: "The Swiggy Maharaja",
    emoji: "🍱✨",
    tagline: "Royalty doesn't cook. Royalty orders.",
    power: "Knows the menu of 40+ restaurants by heart",
    kryptonite: "Delivery fees, packaging fees, surge fees. All of them.",
    gradient: "linear-gradient(160deg,#FC8019 0%,#B81D24 100%)",
    textColor: "#fff",
  },
  "iron-saver": {
    id: "iron-saver",
    name: "The Iron Saver",
    emoji: "🛡️🔒",
    tagline: "Auto-debit to savings before sunrise. Discipline level: unreal.",
    power: "FDs, RDs, SIPs — all on autopilot",
    kryptonite: "Friends call you 'kanjoos'. You secretly enjoy it.",
    gradient: "linear-gradient(160deg,#1F3A5F 0%,#0A1628 100%)",
    textColor: "#fff",
  },
  "weekend-warrior": {
    id: "weekend-warrior",
    name: "The Weekend Warrior",
    emoji: "🌃🍻",
    tagline: "Mon-Thu disciplined. Fri-Sun: chaos.",
    power: "Squad's favorite plan-maker. Always shows up.",
    kryptonite: "Sunday night UPI history brings physical pain",
    gradient: "linear-gradient(160deg,#FF6B9D 0%,#3D1E6D 100%)",
    textColor: "#fff",
  },
  "cashback-bandit": {
    id: "cashback-bandit",
    name: "The Cashback Bandit",
    emoji: "💳🥷",
    tagline: "Three credit cards, four wallets, zero forex on travel.",
    power: "Stacks offers. Maximizes every rupee.",
    kryptonite: "Forgets to actually redeem the points",
    gradient: "linear-gradient(160deg,#00D4AA 0%,#003D5B 100%)",
    textColor: "#fff",
  },
  "emi-emperor": {
    id: "emi-emperor",
    name: "The EMI Emperor",
    emoji: "📅👔",
    tagline: "iPhone in 24, sofa in 12, gym in 6. Everything on installment.",
    power: "Always has the latest stuff",
    kryptonite: "Salary day = EMI day. Account empty by the 3rd.",
    gradient: "linear-gradient(160deg,#6C5CE7 0%,#2D3436 100%)",
    textColor: "#fff",
  },
  "ghost-spender": {
    id: "ghost-spender",
    name: "The Ghost Spender",
    emoji: "👻💸",
    tagline: "Money disappears. Nobody knows where. Not even you.",
    power: "Mysterious. Untraceable. Vibes-based finance.",
    kryptonite: "Bank balance is always a surprise. Usually bad surprise.",
    gradient: "linear-gradient(160deg,#A8A8A8 0%,#1A1A2E 100%)",
    textColor: "#fff",
  },
  "budget-baba": {
    id: "budget-baba",
    name: "The Budget Baba",
    emoji: "📊🧘",
    tagline: "Spreadsheet for groceries. Pivot table for paan.",
    power: "Knows exact ₹ amount in every category",
    kryptonite: "Spontaneous plans give you mild panic",
    gradient: "linear-gradient(160deg,#FFD93D 0%,#6BCB77 100%)",
    textColor: "#1a1a1a",
  },
};

function pickPersona(tally: Record<Tag, number>): Persona {
  const top = (Object.entries(tally) as [Tag, number][]).sort((a, b) => b[1] - a[1]);
  const [a, b] = [top[0]?.[0], top[1]?.[0]];
  const has = (t: Tag) => tally[t] > 0;
  if (a === "ritual" && has("social")) return PERSONAS["chai-sultan"];
  if (a === "foodie") return PERSONAS["swiggy-maharaja"];
  if (a === "saver" && has("planner")) return PERSONAS["iron-saver"];
  if (a === "social" && has("spender")) return PERSONAS["weekend-warrior"];
  if (a === "planner" && has("saver")) return PERSONAS["cashback-bandit"];
  if (a === "spender" && b === "planner") return PERSONAS["emi-emperor"];
  if (a === "impulsive") return PERSONAS["ghost-spender"];
  if (a === "planner") return PERSONAS["budget-baba"];
  if (a === "saver") return PERSONAS["iron-saver"];
  if (a === "social") return PERSONAS["weekend-warrior"];
  if (a === "ritual") return PERSONAS["chai-sultan"];
  return PERSONAS["ghost-spender"];
}

function MoneyPersonaPage() {
  const [step, setStep] = useState(0);
  const [picks, setPicks] = useState<number[]>([]);
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const totalQ = QUESTIONS.length;
  const done = step >= totalQ;

  const persona = useMemo(() => {
    if (!done) return null;
    const tally: Record<Tag, number> = {
      spender: 0, saver: 0, social: 0, impulsive: 0, planner: 0, foodie: 0, ritual: 0,
    };
    picks.forEach((p, i) => {
      QUESTIONS[i].options[p].tags.forEach((t) => tally[t]++);
    });
    return pickPersona(tally);
  }, [done, picks]);

  // Lightly randomized social-proof count, stable per day
  const liveCount = useMemo(() => {
    const today = new Date();
    const seed = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate();
    return 8472 + ((seed * 137) % 4321);
  }, []);

  const pick = (i: number) => {
    setPicks((p) => [...p, i]);
    setStep((s) => s + 1);
  };

  const reset = () => {
    setPicks([]);
    setStep(0);
    setCopied(false);
  };

  const shareText = persona
    ? `I'm ${persona.name} ${persona.emoji} on Spendly's Money Persona quiz!\n\n"${persona.tagline}"\n\nFind your money twin in 60 sec 👉 https://spandly.lovable.app/money-persona`
    : "";

  const onShare = async () => {
    if (!persona) return;
    if (navigator.share) {
      try {
        await navigator.share({ title: persona.name, text: shareText });
        return;
      } catch {
        /* user cancelled */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank");
  };

  const onCopy = async () => {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const onDownload = async () => {
    if (!persona) return;
    const W = 1080, H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    // gradient bg
    const grad = ctx.createLinearGradient(0, 0, W, H);
    // parse our two stop colors
    const m = persona.gradient.match(/#([0-9A-Fa-f]{6})/g) || ["#000000", "#222222"];
    grad.addColorStop(0, m[0]);
    grad.addColorStop(1, m[1] || m[0]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
    // subtle circle
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath(); ctx.arc(W - 100, 180, 240, 0, Math.PI * 2); ctx.fill();
    // text
    ctx.fillStyle = persona.textColor;
    ctx.textAlign = "center";
    ctx.font = "600 36px -apple-system, system-ui, sans-serif";
    ctx.fillText("MY MONEY PERSONA", W / 2, 130);
    ctx.font = "200px -apple-system, system-ui, sans-serif";
    ctx.fillText(persona.emoji, W / 2, 360);
    ctx.font = "700 78px -apple-system, system-ui, sans-serif";
    ctx.fillText(persona.name, W / 2, 480);
    // tagline (wrap)
    ctx.font = "400 38px -apple-system, system-ui, sans-serif";
    wrapText(ctx, persona.tagline, W / 2, 580, W - 160, 52);
    // sections
    ctx.textAlign = "left";
    ctx.font = "700 32px -apple-system, system-ui, sans-serif";
    ctx.fillText("⚡ SUPERPOWER", 90, 880);
    ctx.font = "400 32px -apple-system, system-ui, sans-serif";
    wrapText(ctx, persona.power, 90, 930, W - 180, 44, "left");
    ctx.font = "700 32px -apple-system, system-ui, sans-serif";
    ctx.fillText("💀 KRYPTONITE", 90, 1080);
    ctx.font = "400 32px -apple-system, system-ui, sans-serif";
    wrapText(ctx, persona.kryptonite, 90, 1130, W - 180, 44, "left");
    // footer
    ctx.textAlign = "center";
    ctx.font = "600 30px -apple-system, system-ui, sans-serif";
    ctx.fillText("Take the quiz at spandly.lovable.app", W / 2, H - 60);

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `money-persona-${persona.id}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen flex justify-center" style={{ background: "#ECECEC" }}>
      <main className="w-full max-w-[460px] flex flex-col min-h-screen">
        <header className="flex items-center gap-3 px-5 pt-6 pb-3">
          <Link
            to="/"
            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-black/70"
            aria-label="Back to home"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="flex-1">
            <h1 className="text-[20px] font-bold text-black leading-tight">Money Persona Quiz</h1>
            <div className="text-[12px] text-black/50">
              {liveCount.toLocaleString("en-IN")} Indians took this • 60 sec
            </div>
          </div>
        </header>

        {!done && (
          <section className="flex-1 px-5 pb-10">
            <div className="h-1.5 w-full bg-black/10 rounded-full overflow-hidden mb-6">
              <div
                className="h-full bg-black rounded-full transition-all"
                style={{ width: `${(step / totalQ) * 100}%` }}
              />
            </div>
            <div className="text-[12px] uppercase tracking-wider text-black/40 mb-2">
              Question {step + 1} of {totalQ}
            </div>
            <h2 className="text-[26px] leading-tight font-bold text-black mb-6">
              {QUESTIONS[step].q}
            </h2>
            <div className="flex flex-col gap-3">
              {QUESTIONS[step].options.map((o, i) => (
                <button
                  key={i}
                  onClick={() => pick(i)}
                  className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white border border-black/5 shadow-sm text-left active:scale-[0.98] transition-transform"
                >
                  <span className="text-[26px] leading-none">{o.emoji}</span>
                  <span className="text-[15px] text-black font-medium">{o.text}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {done && persona && (
          <section className="flex-1 px-5 pb-10">
            <div
              ref={cardRef}
              className="rounded-[28px] p-7 shadow-lg relative overflow-hidden"
              style={{ background: persona.gradient, color: persona.textColor }}
            >
              <div className="text-[11px] uppercase tracking-[0.2em] opacity-70 text-center">
                My Money Persona
              </div>
              <div className="text-[80px] leading-none text-center mt-3">{persona.emoji}</div>
              <h2 className="text-[28px] font-extrabold text-center mt-3 leading-tight">
                {persona.name}
              </h2>
              <p className="text-[14px] text-center mt-3 opacity-90 leading-snug">
                {persona.tagline}
              </p>
              <div className="mt-6 space-y-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider opacity-70 font-bold">⚡ Superpower</div>
                  <div className="text-[13px] mt-1 opacity-95">{persona.power}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider opacity-70 font-bold">💀 Kryptonite</div>
                  <div className="text-[13px] mt-1 opacity-95">{persona.kryptonite}</div>
                </div>
              </div>
              <div className="mt-6 text-center text-[10px] opacity-60 tracking-wider">
                spandly.lovable.app
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5">
              <button
                onClick={onShare}
                className="col-span-2 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#25D366] text-white font-semibold shadow-sm active:scale-[0.98] transition-transform"
              >
                <Share2 size={18} /> Share on WhatsApp
              </button>
              <button
                onClick={onDownload}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-black text-white font-semibold active:scale-[0.98] transition-transform"
              >
                <Download size={16} /> Save card
              </button>
              <button
                onClick={onCopy}
                className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-white text-black font-semibold border border-black/10 active:scale-[0.98] transition-transform"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? "Copied!" : "Copy link"}
              </button>
              <button
                onClick={reset}
                className="col-span-2 flex items-center justify-center gap-2 py-3 rounded-2xl bg-transparent text-black/60 font-medium"
              >
                <RotateCcw size={14} /> Retake quiz
              </button>
            </div>

            <div className="mt-6 rounded-2xl p-4 bg-white border border-black/5 shadow-sm">
              <div className="text-[12px] font-semibold text-black/60 uppercase tracking-wider">
                Challenge 3 friends
              </div>
              <p className="text-[13px] text-black mt-1 leading-snug">
                Send this to your group chat. Whoever shares the most embarrassing persona buys
                next round of chai. ☕
              </p>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/app"
                className="inline-block text-[13px] underline text-black/60"
              >
                Track your spending in Spendly →
              </Link>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  align: CanvasTextAlign = "center",
) {
  ctx.textAlign = align;
  const words = text.split(" ");
  let line = "";
  let cursorY = y;
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + " ";
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, cursorY);
      line = words[n] + " ";
      cursorY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, cursorY);
}
