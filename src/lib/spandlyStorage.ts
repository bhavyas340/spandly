// Shared storage helpers for Spendly add-on pages.
// Reads from multiple possible localStorage keys to stay compatible.

export type AnyExpense = {
  id?: number | string;
  label?: string;
  category?: string;
  amount?: number;
  emoji?: string;
  createdAt?: number;
  date?: number | string;
};

const EXPENSE_KEYS = ["kharcha.expenses", "expenses", "spandly_expenses", "spandly-expenses", "spandly_data"];
const STREAK_KEYS = ["streak", "spandly_streak", "currentStreak"];

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try { return JSON.parse(raw) as T; } catch { return null; }
}

export function getExpenses(): AnyExpense[] {
  if (typeof window === "undefined") return [];
  for (const k of EXPENSE_KEYS) {
    const v = safeParse<unknown>(localStorage.getItem(k));
    if (Array.isArray(v)) return v as AnyExpense[];
  }
  return [];
}

export function getStreak(): number {
  if (typeof window === "undefined") return 0;
  for (const k of STREAK_KEYS) {
    const raw = localStorage.getItem(k);
    if (!raw) continue;
    const n = Number(raw);
    if (!Number.isNaN(n)) return n;
    const parsed = safeParse<number>(raw);
    if (typeof parsed === "number") return parsed;
  }
  // derive from expenses: consecutive days back from today
  const exps = getExpenses();
  if (exps.length === 0) return 0;
  const days = new Set(
    exps.map((e) => {
      const ts = Number(e.createdAt ?? e.date ?? 0);
      const d = new Date(ts);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    })
  );
  let streak = 0;
  const cur = new Date();
  while (true) {
    const key = `${cur.getFullYear()}-${cur.getMonth()}-${cur.getDate()}`;
    if (days.has(key)) { streak++; cur.setDate(cur.getDate() - 1); }
    else break;
  }
  return streak;
}

function expenseTs(e: AnyExpense): number {
  return Number(e.createdAt ?? e.date ?? 0);
}

export function getMonthExpenses(month: number, year: number): AnyExpense[] {
  return getExpenses().filter((e) => {
    const d = new Date(expenseTs(e));
    return d.getMonth() === month && d.getFullYear() === year;
  });
}

export function getTodayExpenses(): AnyExpense[] {
  const now = new Date();
  return getExpenses().filter((e) => {
    const d = new Date(expenseTs(e));
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
  });
}

export function getCategoryTotals(expenses: AnyExpense[]): { category: string; total: number }[] {
  const map = new Map<string, number>();
  for (const e of expenses) {
    const cat = (e.category || e.label || "Other").toString();
    map.set(cat, (map.get(cat) || 0) + Number(e.amount || 0));
  }
  return Array.from(map.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

export function isTodayLogged(): boolean {
  return getTodayExpenses().length > 0;
}

export type Persona = { name: string; traits: string[]; verdict: string };

export function getPersona(streak: number, monthExpenses: AnyExpense[]): Persona {
  if (monthExpenses.length === 0)
    return { name: "The Ghost", traits: ["Invisible", "Off-grid", "Mystery"], verdict: "No one knows what you spend. Not even you." };
  if (streak >= 14)
    return { name: "The Iron Saver", traits: ["Disciplined", "Streak Warrior", "Consistent"], verdict: "Your consistency is rare. Most people quit by day 3." };
  if (streak >= 7)
    return { name: "The Steady Hand", traits: ["Reliable", "Aware", "Building"], verdict: "Seven days logged. You're in the top 20% already." };
  if (streak >= 3)
    return { name: "The Rising Tracker", traits: ["Motivated", "Learning", "Improving"], verdict: "Three days in. The habit is forming." };
  return { name: "The Chai Ritualist", traits: ["Spontaneous", "Aware", "India-native"], verdict: "You log when you remember. That's more than most." };
}
