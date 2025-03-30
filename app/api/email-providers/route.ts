import { NextResponse } from 'next/server';

export async function GET() {
  const providers = ['resend', 'mailgun'];
  return NextResponse.json({ providers });
}