import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Supabase's OAuth 2.1 authorization server redirects the user here to approve
// or deny an external client (Claude / ChatGPT / Codex etc.).
// TanStack file router escapes literal dots with `[.]`.

type OAuthLike = {
  getAuthorizationDetails: (id: string) => Promise<{ data?: AuthzDetails; error?: { message: string } | null }>;
  approveAuthorization: (id: string) => Promise<{ data?: AuthzResult; error?: { message: string } | null }>;
  denyAuthorization: (id: string) => Promise<{ data?: AuthzResult; error?: { message: string } | null }>;
};

type AuthzDetails = {
  client?: { name?: string; redirect_uri?: string };
  scopes?: string[];
  redirect_url?: string;
  redirect_to?: string;
};

type AuthzResult = { redirect_url?: string; redirect_to?: string };

function oauthClient(): OAuthLike {
  // The beta `auth.oauth` namespace isn't in the shipped types yet.
  const anySupa = supabase.auth as unknown as { oauth: OAuthLike };
  return anySupa.oauth;
}

export const Route = createFileRoute("/.lovable/oauth/consent")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>) => ({
    authorization_id: typeof s.authorization_id === "string" ? s.authorization_id : "",
  }),
  beforeLoad: async ({ search, location }) => {
    if (!search.authorization_id) {
      throw new Error("Missing authorization_id");
    }
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      const next = location.pathname + location.searchStr;
      throw redirect({ to: "/auth", search: { next } });
    }
  },
  loader: async ({ location }) => {
    const authorizationId = new URLSearchParams(location.search).get("authorization_id")!;
    const { data, error } = await oauthClient().getAuthorizationDetails(authorizationId);
    if (error) throw new Error(error.message);
    const immediate = data?.redirect_url ?? data?.redirect_to;
    if (immediate && !data?.client) {
      window.location.href = immediate;
    }
    return data ?? {};
  },
  component: Consent,
  errorComponent: ({ error }) => (
    <main className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white">
      <div className="max-w-md">
        <h1 className="text-xl font-semibold mb-2">Could not load this authorization request</h1>
        <p className="text-sm text-white/60">{String((error as Error)?.message ?? error)}</p>
      </div>
    </main>
  ),
});

function Consent() {
  const details = Route.useLoaderData() as AuthzDetails;
  const { authorization_id } = Route.useSearch();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clientName = details?.client?.name ?? "an app";
  const redirectUri = details?.client?.redirect_uri;

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error } = approve
      ? await oauthClient().approveAuthorization(authorization_id)
      : await oauthClient().denyAuthorization(authorization_id);
    if (error) {
      setBusy(false);
      setError(error.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-5 py-10"
      style={{ background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)" }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur text-white">
        <h1 className="text-xl font-bold mb-2">Connect {clientName} to Spendly</h1>
        <p className="text-sm text-white/70 mb-4">
          This lets <strong>{clientName}</strong> use Spendly as you — log transactions,
          list your entries, and read spending summaries on your behalf.
        </p>
        {redirectUri && (
          <p className="text-xs text-white/50 mb-4 break-all">
            Redirect: <span className="text-white/70">{redirectUri}</span>
          </p>
        )}
        <ul className="text-sm text-white/80 space-y-1 mb-5 list-disc pl-5">
          <li>Log new expenses / income</li>
          <li>Read your recent transactions</li>
          <li>Read category spending summaries</li>
        </ul>
        <p className="text-xs text-white/50 mb-5">
          This does not bypass Spendly's permissions — your data stays scoped to you.
        </p>

        {error && <p className="text-sm text-red-400 mb-3">{error}</p>}

        <div className="flex gap-2">
          <button
            onClick={() => decide(true)}
            disabled={busy}
            className="flex-1 rounded-lg bg-blue-500 hover:bg-blue-400 text-white font-medium py-2.5 disabled:opacity-50"
          >
            Approve
          </button>
          <button
            onClick={() => decide(false)}
            disabled={busy}
            className="flex-1 rounded-lg border border-white/15 text-white font-medium py-2.5 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </main>
  );
}
