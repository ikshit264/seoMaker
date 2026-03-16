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

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        // First verify the application belongs to the current user
        const app = await prisma.application.findFirst({
            where: { 
                id,
                userId 
            }
        });

        if (!app) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        // Delete the application
        await prisma.application.delete({
            where: { id }
        });

        return NextResponse.json({ success: true, message: 'Application deleted' });
    } catch (error: any) {
        console.error('Error deleting application:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const userId = await getUserId();
    if (!userId) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        const { appName, cmsDbUrl } = await req.json();

        // First verify the application belongs to the current user
        const existingApp = await prisma.application.findFirst({
            where: { 
                id,
                userId 
            }
        });

        if (!existingApp) {
            return NextResponse.json({ error: 'Application not found' }, { status: 404 });
        }

        // Update the application
        const updatedApp = await prisma.application.update({
            where: { id },
            data: {
                ...(appName && { appName }),
                ...(cmsDbUrl && { cmsDbUrl })
            }
        });

        return NextResponse.json({ success: true, application: updatedApp });
    } catch (error: any) {
        console.error('Error updating application:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
