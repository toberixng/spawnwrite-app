// app/api/clerk-webhook/route.ts
import { createSupabaseAdminClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  console.log('Webhook received:', body); // Debug
  const { type, data } = body;

  if (type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = data;
    const email = email_addresses[0].email_address;
    const supabase = await createSupabaseAdminClient();

    const { error } = await supabase.from('users').insert({
      id,
      email,
      username: `${first_name?.toLowerCase() || ''}${last_name?.toLowerCase() || ''}` || email.split('@')[0], // Fallback to email prefix
      first_name: first_name || 'Unknown',
      last_name: last_name || 'User',
      subscription_tier: 'free',
    });

    if (error) {
      console.error('Supabase insert error:', error); // Debug
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('User inserted:', { id, email }); // Debug
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ message: 'Event ignored' });
}