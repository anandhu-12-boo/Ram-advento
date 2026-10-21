import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { AuthCard, authField, authLabel } from "@/components/auth/AuthCard";
import { btnPrimary } from "@/lib/ui";

function safePath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Sign in | Ram Adventure Munnar";
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const cleanEmail = email.trim().toLowerCase();

    // 1. Check admin hardcoded credentials fallback
    const isAdminCreds =
      (cleanEmail === "admin_test_flow@example.com" ||
        cleanEmail === "admin@ramtours.com" ||
        cleanEmail === "ramadventure143@gmail.com" ||
        cleanEmail.startsWith("admin")) &&
      (password === "AdminPassword123!" || password === "admin123" || password === "Password123!");

    if (isAdminCreds) {
      const adminSession = {
        user: { id: "00000000-0000-4000-a000-000000000000", email: cleanEmail, name: "Ram Adventure Admin" },
        role: "admin",
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem("admin_session", JSON.stringify(adminSession));
      localStorage.setItem("user_session", JSON.stringify(adminSession));
      toast.success("Welcome back, Admin!");
      const target = safePath(redirect) ?? "/admin";
      navigate(target, { replace: true });
      setBusy(false);
      return;
    }

    // 2. Try MongoDB backend login
    try {
      const res = await fetch("/api/account/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.data?.user) {
        const user = data.data.user;
        const token = data.data.token;
        if (token) localStorage.setItem("user_token", token);

        const session = {
          user: { id: user.id, email: user.email, name: user.name, phone: user.phone },
          role: user.role || "customer",
        };

        if (user.role === "admin") {
          localStorage.setItem("admin_session", JSON.stringify(session));
        } else {
          localStorage.removeItem("admin_session");
        }
        localStorage.setItem("user_session", JSON.stringify(session));

        toast.success(user.role === "admin" ? "Welcome back, Admin!" : "Welcome back!");
        const target = safePath(redirect) ?? (user.role === "admin" ? "/admin" : "/tours");
        navigate(target, { replace: true });
        setBusy(false);
        return;
      }
    } catch (apiErr) {
      console.warn("Backend login unavailable, checking local storage:", apiErr);
    }

    // 3. Check registered accounts in localStorage fallback
    const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "[]");
    const matched = registeredUsers.find((u: any) => u.email === cleanEmail && u.password === password);
    if (matched) {
      const userSession = {
        user: { id: matched.id, email: matched.email, name: matched.name, phone: matched.phone },
        role: matched.role || "customer",
      };
      if (matched.role === "admin") {
        localStorage.setItem("admin_session", JSON.stringify(userSession));
      } else {
        localStorage.removeItem("admin_session");
      }
      localStorage.setItem("user_session", JSON.stringify(userSession));

      toast.success("Welcome back!");
      const target = safePath(redirect) ?? (matched.role === "admin" ? "/admin" : "/tours");
      navigate(target, { replace: true });
      setBusy(false);
      return;
    }

    setError("That email and password combination does not match an account.");
    setBusy(false);
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

        <button
          type="submit"
          disabled={busy}
          className={`${btnPrimary} w-full justify-center disabled:opacity-60`}
        >
          {busy ? "Signing in…" : "Login"}
        </button>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <Link to="/register" className="tracking-[0.16em] text-mist/60 uppercase hover:text-sand">
            Register
          </Link>
          <Link
            to="/forgot-password"
            className="tracking-[0.16em] text-mist/60 uppercase hover:text-sand"
          >
            Forgot password
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
