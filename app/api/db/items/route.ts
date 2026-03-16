import { NextResponse } from 'next/server';
import { listItems, createItem, updateItem, deleteItem, getItem } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const url = req.headers.get('x-db-url');
    if (!url) return NextResponse.json({ error: 'Database URL is required' }, { status: 400 });
    
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const id = searchParams.get('id');
    
    if (!section) return NextResponse.json({ error: 'Section is required' }, { status: 400 });
    
    if (id) {
      const item = await getItem(url, section, id);
      return NextResponse.json({ item });
    } else {
      const items = await listItems(url, section);
      return NextResponse.json({ items });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const url = req.headers.get('x-db-url');
    if (!url) return NextResponse.json({ error: 'Database URL is required' }, { status: 400 });
    
    const { section, data } = await req.json();
    if (!section || !data) return NextResponse.json({ error: 'Section and data are required' }, { status: 400 });
    
    const item = await createItem(url, section, data);
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const url = req.headers.get('x-db-url');
    if (!url) return NextResponse.json({ error: 'Database URL is required' }, { status: 400 });
    
    const { section, id, data } = await req.json();
    if (!section || !id || !data) return NextResponse.json({ error: 'Section, id, and data are required' }, { status: 400 });
    
    const item = await updateItem(url, section, id, data);
    return NextResponse.json({ success: true, item });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = req.headers.get('x-db-url');
    if (!url) return NextResponse.json({ error: 'Database URL is required' }, { status: 400 });
    
    const { searchParams } = new URL(req.url);
    const section = searchParams.get('section');
    const id = searchParams.get('id');
    
    if (!section || !id) return NextResponse.json({ error: 'Section and id are required' }, { status: 400 });
    
    await deleteItem(url, section, id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
