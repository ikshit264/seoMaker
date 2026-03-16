import { NextResponse } from 'next/server';
import prisma from '@/lib/platform-db';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // 1. Connect to our Central Platform DB to store the user
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
        }

        // 2. Hash password and save user
        const hashedPassword = await hashPassword(password);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        });

        // 3. Generate JWT
        const token = await generateToken({
            userId: newUser.id,
            email: newUser.email,
        });

        // 5. Set Cookie
        const response = NextResponse.json({ success: true, message: 'Account created successfully' });
        response.cookies.set({
            name: 'auth_token',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 // 7 days
        });

        return response;

    } catch (error: any) {
        console.error('Signup Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
