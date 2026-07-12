import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import type { ToolContext } from "@lovable.dev/mcp-js";

function db(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "spend_summary",
  title: "Spending summary",
  description:
    "Return total expense and income for the signed-in Spendly user over the last N days (default 30), grouped by category.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(30),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ days }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const since = new Date(Date.now() - days * 86400_000).toISOString();
    const { data, error } = await db(ctx)
      .from("transactions")
      .select("amount, kind, category")
      .gte("occurred_at", since);
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    let totalExpense = 0;
    let totalIncome = 0;
    const byCategory: Record<string, number> = {};
    for (const row of data ?? []) {
      const amt = Number(row.amount) || 0;
      if (row.kind === "income") totalIncome += amt;
      else {
        totalExpense += amt;
        const cat = row.category ?? "uncategorized";
        byCategory[cat] = (byCategory[cat] ?? 0) + amt;
      }
    }
    const summary = { days, totalExpense, totalIncome, byCategory };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
      structuredContent: summary,
    };
  },
});
