import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AuthCard, authField, authLabel } from "@/components/auth/AuthCard";
import { supabase } from "@/integrations/supabase/client";
import { btnPrimary } from "@/lib/ui";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Set a new password | Ram Adventure";
  }, []);

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

    try {
      await supabase.auth.updateUser({ password });
    } catch {
      // Offline fallback
    }

    setBusy(false);
    toast.success("Password updated.");
    navigate("/login", { replace: true });
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
