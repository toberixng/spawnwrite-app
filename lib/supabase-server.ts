// lib/supabase-server.ts (updated for DB only)
import { createClient } from '@supabase/supabase-js';

export async function createSupabaseAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Add this to .env.local from Supabase > Settings > API
    { auth: { persistSession: false } }
  );
}