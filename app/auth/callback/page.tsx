// app/auth/callback/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AuthCallback({
  searchParams: searchParamsPromise, // Rename to indicate it’s a Promise
}: {
  searchParams: Promise<{ username?: string; error?: string; code?: string }>; // Type as Promise
}) {
  const cookieStore = await cookies();
  const supabase = await createSupabaseServerClient();
  const searchParams = await searchParamsPromise; // Await the Promise

  if (searchParams.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(searchParams.code);
    if (error) {
      console.error('Exchange code error:', error.message);
      return redirect('/auth/sign-in?error=Failed to process authentication code');
    }
  } else {
    console.error('No code provided in callback');
    return redirect('/auth/sign-in?error=No authentication code provided');
  }

  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    console.error('Session error:', sessionError?.message || 'No session found');
    return redirect('/auth/sign-in?error=Session not established - please try again');
  }

  const userId = sessionData.session.user.id;
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('username')
    .eq('id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Fetch error:', fetchError.message);
    return redirect('/auth/sign-in?error=Database fetch error');
  }

  if (!existingUser) {
    const username = searchParams.username || sessionData.session.user.email!.split('@')[0];
    const firstName = sessionData.session.user.user_metadata.first_name || 'Unknown';
    const lastName = sessionData.session.user.user_metadata.last_name || 'User';
    const email = sessionData.session.user.email!;

    const { error: insertError } = await supabase.from('users').insert({
      id: userId,
      email,
      username,
      first_name: firstName,
      last_name: lastName,
      subscription_tier: 'free',
    });

    if (insertError) {
      console.error('Insert error:', insertError.message);
      return redirect('/auth/sign-in?error=Database error saving new user');
    }
  }

  return redirect('/dashboard');
}