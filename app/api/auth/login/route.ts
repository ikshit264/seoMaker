import { NextResponse } from 'next/server';
import prisma from '@/lib/platform-db';
import { comparePassword, generateToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
        }

        // 1. Connect to Central Platform DB & Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // 2. Compare passwords
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
        }

        // 3. Generate JWT
        const token = await generateToken({
            userId: user.id,
            email: user.email
        });

        // 5. Set Cookie
        const response = NextResponse.json({ success: true, message: 'Logged in successfully' });
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        // 6. Log Session
        try {
            await prisma.sessionLog.create({
                data: {
                    userId: user.id,
                    status: 'SUCCESS',
                    ipAddress: req.headers.get('x-forwarded-for') || 'unknown',
                    userAgent: req.headers.get('user-agent') || 'unknown',
                }
            });
        } catch (logError) {
            console.error('Failed to log session:', logError);
            // Don't fail the login if logging fails, but we should know about it
        }

        return response;

    } catch (error: any) {
        console.error('Login Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
