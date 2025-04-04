// lib/supabaseServerClient.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export function createSupabaseServerClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: { [key: string]: any }) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: { [key: string]: any }) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}