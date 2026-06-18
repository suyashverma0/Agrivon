import { createClient } from "@supabase/supabase-js";

// Load values safely from Vite's import.meta.env
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

if (!isSupabaseConfigured) {
  console.warn(
    "⚠️ Supabase keys are not configured in .env. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable full database capabilities."
  );
}

// Fallback placeholder URL/Key prevents application crashes on build/load
export const supabase = createClient(
  supabaseUrl || "https://placeholder-url-please-configure-env.supabase.co",
  supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder"
);
