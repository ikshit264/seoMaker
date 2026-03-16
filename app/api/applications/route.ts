import { NextResponse } from 'next/server';
import prisma from '@/lib/platform-db';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    try {
        const payload = await verifyToken(token);
        return payload?.userId as string || null;
    } catch (err) {
        return null;
    }
}

export async function GET() {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const applications = await prisma.application.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json({ success: true, applications });
    } catch (error: any) {
        console.error('Error fetching applications:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { appName, cmsDbUrl } = await req.json();

        if (!appName || !cmsDbUrl) {
            return NextResponse.json({ error: 'App name and Database URL are required' }, { status: 400 });
        }

        const newApp = await prisma.application.create({
            data: {
                appName,
                cmsDbUrl,
                userId
            }
        });

        return NextResponse.json({ success: true, application: newApp });
    } catch (error: any) {
        console.error('Error creating application:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
