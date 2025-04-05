// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Client-side Supabase client (for browser use)
export const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Server-side Supabase client (for SSR and API routes)
export async function createSupabaseServerClient() {
  const cookieStore = await cookies(); // Await the promise

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // Get all cookies as an array
        getAll: () => {
          return cookieStore.getAll().map((cookie) => ({
            name: cookie.name,
            value: cookie.value,
          }));
        },
        // Set multiple cookies at once
        setAll: (cookieArray) => {
          cookieArray.forEach((cookie) => {
            cookieStore.set(cookie.name, cookie.value, {
              httpOnly: cookie.options?.httpOnly,
              secure: cookie.options?.secure,
              path: cookie.options?.path || '/',
              expires: cookie.options?.expires
                ? new Date(cookie.options.expires)
                : undefined,
              sameSite: cookie.options?.sameSite,
            });
          });
        },
      },
    }
  );
}

// Server-side client with service role (for admin tasks)
export const createSupabaseAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
};