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
  name: "log_transaction",
  title: "Log a transaction",
  description:
    "Record a new expense or income for the signed-in Spendly user. Amount in INR.",
  inputSchema: {
    amount: z.number().positive().describe("Amount in INR (positive)."),
    kind: z.enum(["expense", "income"]).default("expense"),
    category: z.string().optional().describe("e.g. food, chai, transport, salary"),
    note: z.string().optional().describe("Free-text note or merchant name."),
    occurred_at: z
      .string()
      .datetime()
      .optional()
      .describe("ISO timestamp; defaults to now."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async ({ amount, kind, category, note, occurred_at }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await db(ctx)
      .from("transactions")
      .insert({
        user_id: ctx.getUserId(),
        amount,
        kind,
        category: category ?? null,
        note: note ?? null,
        ...(occurred_at ? { occurred_at } : {}),
      })
      .select()
      .single();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: `Logged ${kind} of ₹${amount}${category ? ` (${category})` : ""}.` }],
      structuredContent: { transaction: data },
    };
  },
});
