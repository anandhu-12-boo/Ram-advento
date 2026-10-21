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

    // Safety timeout to avoid hanging when Supabase is not in use
    const timeout = setTimeout(finish, 100);

    try {
      supabase.auth
        .getSession()
        .then(({ data }) => {
          if (!active) return;
          clearTimeout(timeout);
          setSession(data?.session || null);
          finish();
        })
        .catch(() => {
          clearTimeout(timeout);
          finish();
        });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, next) => {
        if (active) {
          setSession(next);
          finish();
        }
      });

      return () => {
        active = false;
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    } catch {
      finish();
    }
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

  const activeSession =
    supabaseSession ||
    (parsedAdminSession ? { user: parsedAdminSession.user } : parsedUserSession ? { user: parsedUserSession.user } : null);

  const isAdmin =
    Boolean(parsedAdminSession) ||
    (Boolean(supabaseSession) && Boolean(accountData?.isAdmin)) ||
    parsedUserSession?.role === "admin";

  const userDisplayName =
    parsedUserSession?.user?.name ||
    parsedAdminSession?.user?.name ||
    accountData?.profile?.name ||
    parsedAdminSession?.user?.email?.split("@")[0] ||
    activeSession?.user?.email?.split("@")[0] ||
    "Traveller";

  return {
    session: activeSession,
    user: activeSession?.user ?? null,
    loading: supabaseLoading && !parsedAdminSession && !parsedUserSession,
    profile: accountData?.profile ?? (parsedUserSession ? parsedUserSession.user : null),
    isAdmin,
    displayName: userDisplayName,
  };
}
