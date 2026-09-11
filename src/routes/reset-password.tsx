import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AuthCard, authField, authLabel } from "@/components/auth/AuthCard";
import { supabase } from "@/integrations/supabase/client";
import { btnPrimary } from "@/lib/ui";

export const Route = createFileRoute("/reset-password")({
  component: ResetPasswordPage,
  head: () => ({
    meta: [
      { title: "Set a new password | Ram Adventure" },
      { name: "description", content: "Choose a new password for your Ram Adventure account." },
      { property: "og:title", content: "Set a new password | Ram Adventure" },
      { property: "og:description", content: "Finish resetting your account password." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error: authError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (authError) {
      setError("This reset link has expired. Please request a new one.");
      return;
    }
    toast.success("Password updated.");
    navigate({ to: "/my-account", replace: true });
  };

  return (
    <AuthCard title="New password" subtitle="Set a new password for your account">
      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className={authLabel} htmlFor="password">
            New password
          </label>
          <input
            id="password"
            type="password"
            className={authField}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8+ characters"
          />
        </div>
        <div>
          <label className={authLabel} htmlFor="confirm">
            Confirm password
          </label>
          <input
            id="confirm"
            type="password"
            className={authField}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className={`${btnPrimary} w-full justify-center disabled:opacity-60`}
        >
          {busy ? "Saving…" : "Update password"}
        </button>
      </form>
    </AuthCard>
  );
}
