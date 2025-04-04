// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix';
import { createSupabaseServerClient } from '../../../../lib/supabaseServerClient';

export async function POST(req: Request) {
  const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!CLERK_WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set');
    return new Response('Server configuration error', { status: 500 });
  }

  try {
    // Get the headers and body
    const headers = req.headers;
    const body = await req.text();

    // Verify the webhook
    const webhook = new Webhook(CLERK_WEBHOOK_SECRET);
    const evt = webhook.verify(body, {
      'svix-id': headers.get('svix-id')!,
      'svix-timestamp': headers.get('svix-timestamp')!,
      'svix-signature': headers.get('svix-signature')!,
    }) as any;

    // Handle the event
    if (evt.type === 'user.created') {
      const { id, email_addresses, username, first_name, last_name } = evt.data;
      const email = email_addresses[0]?.email_address;

      if (!id || !email) {
        console.error('Missing required fields in webhook payload:', evt.data);
        return new Response('Invalid webhook payload', { status: 400 });
      }

      const supabase = createSupabaseServerClient();
      const { error } = await supabase.from('users').insert({
        id,
        email,
        username: username || `user_${id.slice(0, 8)}`,
        first_name: first_name || '',
        last_name: last_name || '',
        subscription_tier: 'free',
      });

      if (error) {
        console.error('Error inserting user into Supabase:', error);
        return new Response('Error inserting user', { status: 500 });
      }

      return new Response('User created successfully', { status: 200 });
    }

    return new Response('Event not handled', { status: 200 });
  } catch (err) {
    console.error('Webhook processing failed:', err);
    return new Response('Webhook processing failed', { status: 400 });
  }
}