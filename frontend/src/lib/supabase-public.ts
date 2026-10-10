import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/**
 * Server-side publishable client for public read-only data.
 * Must only be called inside a server function handler / server route handler.
 */
export function createPublicServerClient() {
  const envProcess = typeof process !== "undefined" && process?.env ? process.env : undefined;
  const key = (envProcess?.["SUPABASE_PUBLISHABLE_KEY"] || import.meta.env?.["VITE_SUPABASE_PUBLISHABLE_KEY"] || "") as string;
  const url = (envProcess?.["SUPABASE_URL"] || import.meta.env?.["VITE_SUPABASE_URL"] || "") as string;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}
