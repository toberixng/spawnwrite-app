// app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { subject, body, subdomain, to } = await req.json();
  const providers = ['resend'];
  const emailQueue = [];

  try {
    const data = await resend.emails.send({
      from: `news@${subdomain}.spawnwrite.com`,
      to,
      subject,
      text: body,
    });
    console.log('Resend response:', data); // Log to see actual structure
    // Adjust based on actual response
    const emailId = 'id' in data ? data.id : (data as any).data?.id || 'unknown';
    return NextResponse.json({ id: emailId });
  } catch (error) {
    emailQueue.push({ subject, body, subdomain, to });
    return NextResponse.json({ error: 'Failed to send email', queued: true }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Retry not implemented' });
}