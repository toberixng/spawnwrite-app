import { NextResponse } from 'next/server';
import { Resend } from 'resend';

type Provider = { name: string; apiKey: string; priority: number };
type QueuedEmail = { subject: string; body: string; subdomain: string; to: string[] };

let providers: Provider[] = [
  { name: 'Resend', apiKey: 're_8EeDKiH5_GF4wBA4eu1pWPMFY7X4mHt7q', priority: 1 }, // Replace with your Resend API key
];
let emailQueue: QueuedEmail[] = [];

const sendWithProvider = async (provider: Provider, email: QueuedEmail) => {
  if (provider.name === 'Resend') {
    const resend = new Resend(provider.apiKey);
    return resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email.to,
      subject: email.subject,
      text: email.body,
    });
  }
  throw new Error(`Provider ${provider.name} not implemented yet`);
};

export async function POST(request: Request) {
  const email = await request.json();
  const { subject, body, subdomain, to } = email;

  if (!to || !Array.isArray(to) || to.length === 0) {
    return NextResponse.json({ success: false, error: 'Invalid or missing recipient' }, { status: 400 });
  }

  for (const provider of providers) {
    try {
      const response = await sendWithProvider(provider, { subject, body, subdomain, to });
      return NextResponse.json({ success: true, data: response });
    } catch (error) {
      console.error(`Failed with ${provider.name}:`, error);
      if (provider.priority === providers[providers.length - 1].priority) {
        emailQueue.push({ subject, body, subdomain, to });
        return NextResponse.json(
          { success: false, error: 'All providers failed, email queued', queued: true },
          { status: 503 }
        );
      }
    }
  }
  return NextResponse.json({ success: false, error: 'Unexpected error' }, { status: 500 });
}

export async function GET() {
  const results = [];
  while (emailQueue.length > 0) {
    const email = emailQueue.shift();
    if (!email) break;

    for (const provider of providers) {
      try {
        const response = await sendWithProvider(provider, email);
        results.push({ success: true, email: email.subject, data: response });
        break;
      } catch (error) {
        console.error(`Retry failed with ${provider.name} for ${email.subject}:`, error);
        if (provider.priority === providers[providers.length - 1].priority) {
          emailQueue.unshift(email);
          results.push({ success: false, email: email.subject, error: String(error) });
        }
      }
    }
  }
  return NextResponse.json({ results, remaining: emailQueue.length });
}