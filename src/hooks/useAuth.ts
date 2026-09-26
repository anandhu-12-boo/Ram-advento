import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyAccount } from "@/lib/account.functions";

export function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const finish = () => {
      if (active) setLoading(false);
    };

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session);
        finish();
      })
      .catch(() => finish());

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      finish();
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}

export function useAuth() {
  const { session: supabaseSession, loading: supabaseLoading } = useSupabaseSession();
  const [accountData, setAccountData] = useState<any>(null);

  const localAdminSession = typeof window !== "undefined" ? localStorage.getItem("admin_session") : null;
  const parsedAdminSession = localAdminSession ? JSON.parse(localAdminSession) : null;

  const localUserSession = typeof window !== "undefined" ? localStorage.getItem("user_session") : null;
  const parsedUserSession = localUserSession ? JSON.parse(localUserSession) : null;

  useEffect(() => {
    if (supabaseSession) {
      getMyAccount().then(setAccountData).catch(() => setAccountData(null));
    }
  }, [supabaseSession]);

  const activeSession = supabaseSession || (parsedAdminSession ? { user: parsedAdminSession.user } : parsedUserSession ? { user: parsedUserSession.user } : null);
  const isAdmin = Boolean(parsedAdminSession) || (Boolean(supabaseSession) && Boolean(accountData?.isAdmin)) || parsedUserSession?.role === "admin";

  return {
    session: activeSession,
    user: activeSession?.user ?? null,
    loading: supabaseLoading && !parsedAdminSession && !parsedUserSession,
    profile: accountData?.profile ?? null,
    isAdmin,
    displayName:
      parsedAdminSession?.user?.email?.split("@")[0] ||
      accountData?.profile?.name ||
      activeSession?.user?.email?.split("@")[0] ||
      "Traveller",
  };
}
