import { NextResponse } from 'next/server';
import { testConnection } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'Database URL is required' }, { status: 400 });
    
    await testConnection(url);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
