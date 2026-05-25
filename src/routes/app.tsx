import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Home, BarChart3, Target, Bot, Send, Plus, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/app")({
  component: AppShell,
  head: () => ({
    meta: [
      { title: "Kharcha — App" },
      { name: "description", content: "Track your daily expenses in 3 seconds." },
    ],
  }),
});

type Tab = "home" | "report" | "goals" | "ai";
type Expense = { id: number; label: string; amount: number; cat: string; emoji: string; time: string };

const initialExpenses: Expense[] = [
  { id: 1, label: "Chai", amount: 20, cat: "Food", emoji: "☕", time: "08:12 AM" },
  { id: 2, label: "Ola Auto", amount: 85, cat: "Travel", emoji: "🛺", time: "09:30 AM" },
  { id: 3, label: "Lunch – Thali", amount: 140, cat: "Food", emoji: "🍛", time: "01:15 PM" },
  { id: 4, label: "Jio Recharge", amount: 299, cat: "Bills", emoji: "📱", time: "03:00 PM" },
  { id: 5, label: "Swiggy – dinner", amount: 320, cat: "Food", emoji: "🍕", time: "08:45 PM" },
];

const goalsInit = [
  { name: "Goa Trip 🏖️", target: 15000, saved: 8400 },
  { name: "iPhone 17 📱", target: 80000, saved: 22000 },
];

const week: Array<true | false | "today"> = [true, true, true, true, "today", false, false];

function AppShell() {
  const [tab, setTab] = useState<Tab>("home");
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <div className="w-full max-w-[420px] min-h-screen bg-background relative flex flex-col border-x border-border">
        <div className="flex-1 pb-24">
          {tab === "home" && <HomeTab expenses={expenses} setExpenses={setExpenses} />}
          {tab === "report" && <ReportTab expenses={expenses} />}
          {tab === "goals" && <GoalsTab />}
          {tab === "ai" && <AITab />}
        </div>
        <BottomNav tab={tab} setTab={setTab} />
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <div className="flex items-center justify-between mb-5">
      <Link to="/" className="w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition">
        <ArrowLeft size={16} />
      </Link>
      <div className="flex items-center gap-1.5">
        <span>🔥</span>
        <span className="font-display font-bold">Kharcha</span>
      </div>
      <div className="w-9 h-9 rounded-full gradient-orange-gold flex items-center justify-center text-xs font-bold text-black">A</div>
    </div>
  );
}

function HomeTab({ expenses, setExpenses }: { expenses: Expense[]; setExpenses: (e: Expense[]) => void }) {
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [logged, setLogged] = useState(false);

  const total = expenses.reduce((s, e) => s + e.amount, 0);

  const handleLog = (l?: string, a?: number) => {
    const lab = (l ?? label).trim();
    const amt = a ?? Number(amount);
    if (!lab || !amt) return;
    const next: Expense = {
      id: Date.now(),
      label: lab,
      amount: amt,
      cat: "Other",
      emoji: "💸",
      time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    };
    setExpenses([next, ...expenses]);
    setLabel(""); setAmount("");
    setLogged(true);
    setTimeout(() => setLogged(false), 2000);
  };

  const presets = [
    { e: "☕", l: "Chai", a: 20 },
    { e: "🚗", l: "Auto", a: 85 },
    { e: "🍛", l: "Lunch", a: 140 },
    { e: "📦", l: "Delivery", a: 399 },
  ];

  return (
    <div className="px-5 pt-6 animate-fade-up">
      <TopBar />

      <div className="flex justify-between items-center mb-5">
        <div>
          <div className="text-sm text-muted-foreground">Good morning</div>
          <div className="font-display font-extrabold text-2xl">Aarav 👋</div>
        </div>
        <div className="px-3 py-1.5 rounded-full bg-primary/15 text-primary font-bold flex items-center gap-1">
          <span className="animate-streak-pulse inline-block">🔥</span> 14
        </div>
      </div>

      <div className="flex justify-between gap-1.5 mb-6">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d, i) => {
          const state = week[i];
          return (
            <div key={d} className="flex flex-col items-center gap-1.5 flex-1">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                state === true ? "bg-primary text-primary-foreground" :
                state === "today" ? "bg-primary/20 text-primary border border-primary animate-streak-pulse" :
                "bg-card border border-border text-muted-foreground"
              }`}>
                {state === true ? "✓" : state === "today" ? "🔥" : "·"}
              </div>
              <span className="text-[10px] text-muted-foreground">{d}</span>
            </div>
          );
        })}
      </div>

      <div className="p-5 rounded-2xl gradient-orange-tint border border-primary/30 mb-5">
        <div className="text-xs text-muted-foreground">Today's kharcha</div>
        <div className="font-display font-extrabold text-4xl mt-1">₹{total.toLocaleString("en-IN")}</div>
        <div className="text-xs text-muted-foreground mt-1">{expenses.length} transactions</div>
        <div className="mt-3 p-3 rounded-xl bg-background/40 border border-primary/20 text-xs leading-relaxed">
          💡 At this rate: <span className="font-bold text-foreground">₹{(total * 30).toLocaleString("en-IN")}</span> this month. Time to breathe?
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-card border border-border mb-5">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Quick Log</div>
        <div className="flex gap-2 mb-3">
          <input
            value={label} onChange={(e) => setLabel(e.target.value)}
            placeholder="What?"
            className="flex-1 px-3 py-2.5 rounded-xl bg-input border border-border text-sm focus:outline-none focus:border-primary"
          />
          <input
            value={amount} onChange={(e) => setAmount(e.target.value)}
            placeholder="₹"
            type="number"
            className="w-20 px-3 py-2.5 rounded-xl bg-input border border-border text-sm focus:outline-none focus:border-primary"
          />
          <button
            onClick={() => handleLog()}
            className="px-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm hover:opacity-90 transition"
          >
            {logged ? "✓" : "Log"}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.l}
              onClick={() => handleLog(p.l, p.a)}
              className="px-3 py-1.5 rounded-full bg-card-2 border border-border text-xs hover:border-primary/50 transition"
            >
              {p.e} {p.l} {p.a}
            </button>
          ))}
        </div>
        {logged && (
          <div className="mt-3 text-center text-xs text-primary font-bold animate-fade-up">✓ Logged!</div>
        )}
      </div>

      <div className="mb-3 flex justify-between items-center">
        <div className="font-display font-bold">Recent</div>
        <div className="text-xs text-muted-foreground">{expenses.length} today</div>
      </div>
      <div className="space-y-2">
        {expenses.slice(0, 5).map((e) => (
          <div key={e.id} className="flex items-center gap-3 p-3 rounded-2xl bg-card border border-border">
            <div className="w-10 h-10 rounded-xl bg-card-2 flex items-center justify-center text-lg">{e.emoji}</div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm truncate">{e.label}</div>
              <div className="text-xs text-muted-foreground">{e.cat} · {e.time}</div>
            </div>
            <div className="font-display font-bold">₹{e.amount}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportTab({ expenses }: { expenses: Expense[] }) {
  const cats = ["Food", "Travel", "Shopping", "Bills", "Other"];
  const colors: Record<string, string> = {
    Food: "#FF6B00", Travel: "#FFD60A", Shopping: "#A78BFA", Bills: "#60A5FA", Other: "#34D399"
  };
  const totals = cats.map((c) => ({
    name: c,
    val: expenses.filter((e) => e.cat === c).reduce((s, e) => s + e.amount, 0),
  }));
  const max = Math.max(...totals.map((t) => t.val), 1);
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="px-5 pt-6 animate-fade-up">
      <TopBar />
      <h1 className="font-display font-extrabold text-3xl mb-5">April Report Card 📊</h1>

      <div className="p-5 rounded-2xl gradient-orange-tint border border-primary/30 mb-5">
        <div className="text-xs text-muted-foreground">Total spent today</div>
        <div className="font-display font-extrabold text-4xl mt-1">₹{total.toLocaleString("en-IN")}</div>
        <div className="text-xs text-muted-foreground mt-1">↑ 12% vs yesterday</div>
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border mb-5">
        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">By category</div>
        <div className="space-y-4">
          {totals.map((t) => (
            <div key={t.name}>
              <div className="flex justify-between text-sm mb-1.5">
                <span>{t.name}</span>
                <span className="font-bold">₹{t.val}</span>
              </div>
              <div className="h-2.5 rounded-full bg-card-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${(t.val / max) * 100}%`, background: colors[t.name] }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-5 rounded-2xl bg-card border-2 border-primary/40 mb-5">
        <div className="text-xs font-bold uppercase tracking-wider text-primary mb-2">🤖 AI COACH</div>
        <div className="text-sm leading-relaxed text-foreground/90">
          You're spending <span className="font-bold text-primary">47% on food</span>. Cooking just 2 meals/week at home could save you <span className="font-bold">₹2,400/month</span>. Want to set a food budget?
        </div>
      </div>

      <button className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition shadow-[0_8px_30px_rgba(255,107,0,0.35)]">
        📤 Share to WhatsApp
      </button>
    </div>
  );
}

function GoalsTab() {
  const [goals] = useState(goalsInit);
  return (
    <div className="px-5 pt-6 animate-fade-up">
      <TopBar />
      <h1 className="font-display font-extrabold text-3xl mb-2">Goals 🎯</h1>
      <p className="text-sm text-muted-foreground mb-6">Save little by little. Watch it grow.</p>

      <div className="space-y-4">
        {goals.map((g) => {
          const pct = Math.round((g.saved / g.target) * 100);
          return (
            <div key={g.name} className="p-5 rounded-2xl bg-card border border-border">
              <div className="flex justify-between items-baseline mb-1">
                <div className="font-display font-bold text-lg">{g.name}</div>
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                ₹{g.saved.toLocaleString("en-IN")} <span className="opacity-60">/ ₹{g.target.toLocaleString("en-IN")}</span>
              </div>
              <div className="h-3 rounded-full bg-card-2 overflow-hidden">
                <div className="h-full rounded-full gradient-orange-gold transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="mt-2 text-xs text-muted-foreground">{pct}% there</div>
            </div>
          );
        })}
      </div>

      <button className="mt-6 w-full py-4 rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition font-semibold flex items-center justify-center gap-2">
        <Plus size={18} /> Add Goal
      </button>
    </div>
  );
}

type Msg = { from: "ai" | "me"; text: string };

function AITab() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "ai", text: "Hey Aarav 👋 I noticed you've spent ₹2,140 on Swiggy this week. That's 38% of your food budget." },
    { from: "me", text: "Damn. What should I do?" },
    { from: "ai", text: "Easy win: cook dinner 3 nights/week. You'll save ~₹1,200 and your streak will love you 🔥" },
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMsgs((m) => [...m, { from: "me", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "ai", text: `Got it — "${userMsg}". Let me crunch your numbers and get back with a plan. 🧠` }]);
    }, 700);
  };

  return (
    <div className="px-5 pt-6 flex flex-col min-h-screen">
      <TopBar />
      <h1 className="font-display font-extrabold text-3xl mb-1">AI Coach 🤖</h1>
      <p className="text-sm text-muted-foreground mb-5">Your money therapist.</p>

      <div className="flex-1 space-y-3 mb-4">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} animate-fade-up`}>
            <div
              className={`max-w-[78%] px-4 py-2.5 text-sm leading-relaxed ${
                m.from === "me"
                  ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md"
                  : "bg-card-2 border border-border rounded-2xl rounded-bl-md"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 sticky bottom-24 pb-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="Ask anything…"
          className="flex-1 px-4 py-3 rounded-full bg-input border border-border text-sm focus:outline-none focus:border-primary"
        />
        <button
          onClick={send}
          className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

function BottomNav({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  const tabs: Array<{ id: Tab; label: string; Icon: typeof Home }> = [
    { id: "home", label: "Home", Icon: Home },
    { id: "report", label: "Report", Icon: BarChart3 },
    { id: "goals", label: "Goals", Icon: Target },
    { id: "ai", label: "AI", Icon: Bot },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto max-w-[420px] bg-background/90 backdrop-blur-xl border-t border-border">
      <div className="flex justify-around px-2 py-2">
        {tabs.map(({ id, label, Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl transition ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 2} />
              <span className={`text-[10px] font-semibold ${active ? "text-primary" : ""}`}>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
