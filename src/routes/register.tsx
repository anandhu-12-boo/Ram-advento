import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { AuthCard, authField, authLabel } from "@/components/auth/AuthCard";
import { supabase } from "@/integrations/supabase/client";
import { btnPrimary } from "@/lib/ui";

const schema = z
  .object({
    name: z.string().min(2, "Please enter your full name."),
    email: z.string().email("Enter a valid email address."),
    phone: z.string().min(7, "Enter a valid phone number."),
    password: z.string().min(8, "Use at least 8 characters."),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Create your account | Ram Adventure Munnar";
  }, []);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }
    setBusy(true);
    const cleanEmail = form.email.trim().toLowerCase();
    const isAdminAccount = cleanEmail.includes("admin") || cleanEmail === "ramadventure143@gmail.com";
    const role = isAdminAccount ? "admin" : "customer";

    await supabase.auth.signUp({
      email: cleanEmail,
      password: form.password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { name: form.name, phone: form.phone },
      },
    });

    // Save user locally as fallback
    const registeredUsers = JSON.parse(localStorage.getItem("registered_users") || "[]");
    const existingIndex = registeredUsers.findIndex((u: any) => u.email === cleanEmail);
    const newUser = {
      id: "u_" + Date.now(),
      name: form.name,
      email: cleanEmail,
      phone: form.phone,
      password: form.password,
      role,
    };
    if (existingIndex >= 0) {
      registeredUsers[existingIndex] = newUser;
    } else {
      registeredUsers.push(newUser);
    }
    localStorage.setItem("registered_users", JSON.stringify(registeredUsers));

    setBusy(false);
    await supabase.auth.signOut();
    toast.success("Account created successfully. You can now sign in.");
    navigate("/login", { replace: true });
  };

  return (
    <AuthCard
      title="Join the trail"
      subtitle="Create your Ram Adventure account"
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-sand hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-5">
        <div>
          <label className={authLabel} htmlFor="name">
            Full name
          </label>
          <input
            id="name"
            className={authField}
            value={form.name}
            onChange={set("name")}
            placeholder="Anand A"
          />
        </div>
        <div>
          <label className={authLabel} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className={authField}
            value={form.email}
            onChange={set("email")}
            placeholder="you@email.com"
          />
        </div>
        <div>
          <label className={authLabel} htmlFor="phone">
            Phone / WhatsApp
          </label>
          <input
            id="phone"
            className={authField}
            value={form.phone}
            onChange={set("phone")}
            placeholder="+91 …"
          />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={authLabel} htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={authField}
              value={form.password}
              onChange={set("password")}
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
              value={form.confirm}
              onChange={set("confirm")}
              placeholder="Repeat password"
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <button
          type="submit"
          disabled={busy}
          className={`${btnPrimary} w-full justify-center disabled:opacity-60`}
        >
          {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthCard>
  );
}
