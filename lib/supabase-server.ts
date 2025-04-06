// lib/supabase-server.ts
import { createClient } from '@supabase/supabase-js';

export async function createSupabaseAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase env vars missing:', { supabaseUrl, supabaseServiceKey });
    throw new Error('Supabase configuration missing');
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('Supabase admin client created');
  return supabase;
}