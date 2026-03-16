import { NextResponse } from 'next/server';
import { listSections, createSection } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const url = req.headers.get('x-db-url');
    if (!url) return NextResponse.json({ error: 'Database URL is required' }, { status: 400 });
    
    const sections = await listSections(url);
    return NextResponse.json({ sections });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const url = req.headers.get('x-db-url');
    if (!url) return NextResponse.json({ error: 'Database URL is required' }, { status: 400 });
    
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: 'Section name is required' }, { status: 400 });
    
    await createSection(url, name);
    return NextResponse.json({ success: true, section: name });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
