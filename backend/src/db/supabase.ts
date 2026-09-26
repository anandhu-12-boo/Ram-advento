import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { config } from "../config/env.js";

export const publicSupabaseClient = createClient(config.supabaseUrl, config.supabaseAnonKey);

export function createAuthenticatedSupabaseClient(token: string): SupabaseClient {
  return createClient(config.supabaseUrl, config.supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });
}
