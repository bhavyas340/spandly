import { auth, defineMcp } from "@lovable.dev/mcp-js";
import logTransaction from "./tools/log-transaction";
import listTransactions from "./tools/list-transactions";
import spendSummary from "./tools/spend-summary";

// The OAuth issuer MUST be the direct Supabase host (RFC 8414 issuer match).
// VITE_SUPABASE_PROJECT_ID is inlined by Vite at build time.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "spendly-mcp",
  title: "Spendly",
  version: "0.1.0",
  instructions:
    "Tools for Spendly, a personal expense tracker for India. Use `log_transaction` to record an expense or income, `list_transactions` to read the user's recent entries, and `spend_summary` to get category totals over the last N days. All amounts are in INR.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [logTransaction, listTransactions, spendSummary],
});
