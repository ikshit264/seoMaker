import { NextResponse } from 'next/server';
import { verifyPasskey } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const url = req.headers.get('x-db-url');
    if (!url) return NextResponse.json({ error: 'Database URL is required' }, { status: 400 });
    
    const { passkey } = await req.json();
    if (!passkey) return NextResponse.json({ error: 'Passkey is required' }, { status: 400 });
    
    const isValid = await verifyPasskey(url, passkey);
    if (!isValid) {
      return NextResponse.json({ error: 'Invalid passkey' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
