import { NextResponse } from 'next/server';
import { getTableStatus, migrateToCms } from '@/lib/db';

export async function GET(req: Request) {
    try {
        const url = req.headers.get('x-db-url');
        const { searchParams } = new URL(req.url);
        const table = searchParams.get('table');

        if (!url || !table) {
            return NextResponse.json({ error: 'DB URL and table name required' }, { status: 400 });
        }

        const { count } = await getTableStatus(url, table);
        return NextResponse.json({ count });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const url = req.headers.get('x-db-url');
        if (!url) return NextResponse.json({ error: 'DB URL required' }, { status: 400 });

        const { table, wipe } = await req.json();
        if (!table) return NextResponse.json({ error: 'Table name required' }, { status: 400 });

        await migrateToCms(url, table, !!wipe);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
