// app/api/clerk-webhook/route.ts
import { createSupabaseAdminClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';
import { Webhook } from 'svix';

interface ClerkWebhookPayload {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string }[];
    first_name?: string;
    last_name?: string;
  };
}

export async function POST(request: Request) {
  console.log('Webhook endpoint hit'); // Initial log
  const body = await request.text();
  const headers = request.headers;

  const svixId = headers.get('svix-id');
  const svixTimestamp = headers.get('svix-timestamp');
  const svixSignature = headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error('Missing Svix headers:', { svixId, svixTimestamp, svixSignature });
    return NextResponse.json({ error: 'Invalid webhook request' }, { status: 400 });
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('CLERK_WEBHOOK_SECRET not set in environment');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  const wh = new Webhook(webhookSecret);
  let payload: ClerkWebhookPayload;

  try {
    payload = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkWebhookPayload;
    console.log('Webhook verified successfully:', payload);
  } catch (err) {
    console.error('Webhook verification failed:', err);
    return NextResponse.json({ error: 'Webhook verification failed' }, { status: 400 });
  }

  const { type, data } = payload;

  if (type === 'user.created') {
    const { id, email_addresses, first_name, last_name } = data;
    const email = email_addresses[0].email_address;
    console.log('Processing user.created event:', { id, email, first_name, last_name });

    const supabase = await createSupabaseAdminClient();
    console.log('Supabase client initialized');

    const { error } = await supabase.from('users').insert({
      id,
      email,
      username: `${first_name?.toLowerCase() || ''}${last_name?.toLowerCase() || ''}` || email.split('@')[0],
      first_name: first_name || 'Unknown',
      last_name: last_name || 'User',
      subscription_tier: 'free',
    });

    if (error) {
      console.error('Supabase insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log('User inserted successfully:', { id, email });
    return NextResponse.json({ success: true });
  }

  console.log('Event ignored:', type);
  return NextResponse.json({ message: 'Event ignored' });
}