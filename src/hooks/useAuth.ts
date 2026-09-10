import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMyAccount } from "@/lib/account.functions";

export function useSupabaseSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session);
      setLoading(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setLoading(false);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading };
}

export function useAuth() {
  const { session, loading } = useSupabaseSession();
  const fetchAccount = useServerFn(getMyAccount);

  const account = useQuery({
    queryKey: ["account", session?.user.id ?? "anon"],
    enabled: Boolean(session),
    queryFn: () => fetchAccount(),
    staleTime: 30_000,
  });

  return {
    session,
    user: session?.user ?? null,
    loading: loading || (Boolean(session) && account.isLoading),
    profile: account.data?.profile ?? null,
    isAdmin: account.data?.isAdmin ?? false,
    displayName:
      account.data?.profile?.name ||
      session?.user.email?.split("@")[0] ||
      "Traveller",
  };
}
