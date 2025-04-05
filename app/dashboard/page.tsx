// app/dashboard/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    return redirect('/auth/sign-in');
  }

  return <div>Welcome to your dashboard!</div>;
}