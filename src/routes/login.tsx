import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { AuthCard, authField, authLabel } from "@/components/auth/AuthCard";
import { supabase } from "@/integrations/supabase/client";
import { btnPrimary } from "@/lib/ui";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/login")({
  validateSearch: (search) => searchSchema.parse(search),
  component: LoginPage,
  head: () => ({
    meta: [
      { title: "Sign in | Ram Adventure Munnar" },
      {
        name: "description",
        content: "Sign in to your Ram Adventure account to book jeep safaris and track your trips.",
      },
      { property: "og:title", content: "Sign in | Ram Adventure Munnar" },
      { property: "og:description", content: "Access your bookings and adventures." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function safePath(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

function LoginPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(
        authError.message.toLowerCase().includes("invalid")
          ? "That email and password combination does not match an account."
          : "We could not sign you in. Please try again.",
      );
      setBusy(false);
      return;
    }
    toast.success("Welcome back.");
    const target = safePath(redirect) ?? "/my-account";
    navigate({ to: target, replace: true });
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your adventures"
      footer={
        <>
          New here?{" "}
          <Link to="/register" className="text-sand hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className={authLabel} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            className={authField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className={authLabel} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            className={authField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button type="submit" disabled={busy} className={`${btnPrimary} w-full justify-center disabled:opacity-60`}>
          {busy ? "Signing in…" : "Login"}
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link to="/register" className="tracking-[0.16em] text-mist/60 uppercase hover:text-sand">
            Register
          </Link>
          <Link to="/forgot-password" className="tracking-[0.16em] text-mist/60 uppercase hover:text-sand">
            Forgot password
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
