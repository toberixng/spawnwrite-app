import { NextResponse } from 'next/server';

type Provider = { name: string; apiKey: string; priority: number };
let providers: Provider[] = [{ name: 'Resend', apiKey: 're_xxxxxxxxxxxxxxxxxxxxxxxxxxxx', priority: 1 }];

export async function POST(request: Request) {
  const newProvider = await request.json();
  providers.push(newProvider);
  providers.sort((a, b) => a.priority - b.priority); // Sort by priority
  return NextResponse.json({ success: true, providers });
}

export async function GET() {
  return NextResponse.json({ providers });
}