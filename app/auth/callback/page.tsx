// app/auth/callback/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function AuthCallback({
  searchParams,
}: {
  searchParams: { username?: string };
}) {
  const supabase = await createSupabaseServerClient();
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !sessionData.session) {
    return redirect('/auth/sign-in?error=Session not found');
  }

  const userId = sessionData.session.user.id;
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('username')
    .eq('id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows
    console.error('Fetch error:', fetchError);
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
      console.error('Insert error:', insertError);
      return redirect('/auth/sign-in?error=Database error saving new user');
    }
  }

  return redirect('/dashboard');
}