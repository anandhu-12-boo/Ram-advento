import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AuthCard, authField, authLabel } from "@/components/auth/AuthCard";
import { supabase } from "@/integrations/supabase/client";
import { btnPrimary } from "@/lib/ui";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
  head: () => ({
    meta: [
      { title: "Reset your password | Ram Adventure" },
      {
        name: "description",
        content: "Request a password reset link for your Ram Adventure Munnar account.",
      },
      { property: "og:title", content: "Reset your password | Ram Adventure" },
      { property: "og:description", content: "We will email you a reset link." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (authError) {
      setError("We could not send the reset email. Please try again shortly.");
      return;
    }
    setSent(true);
  };

  return (
    <AuthCard
      title="Forgot password"
      subtitle="We'll email you a reset link"
      footer={
        <Link to="/login" className="text-sand hover:underline">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-mist/80">
          If an account uses {email}, a reset link is on its way. Check your inbox and spam folder.
        </p>
      ) : (
        <form onSubmit={submit} className="space-y-6">
          <div>
            <label className={authLabel} htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className={authField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className={`${btnPrimary} w-full justify-center disabled:opacity-60`}
          >
            {busy ? "Sending…" : "Send reset link"}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
