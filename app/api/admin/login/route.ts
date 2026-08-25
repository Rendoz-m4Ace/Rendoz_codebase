import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { validateAdminPassword, createSession, initializeAdmin } from '@/lib/auth';

const loginSchema = z.object({
  password: z.string().min(1, 'Password is required'),
});

export async function POST(request: NextRequest) {
  try {
    initializeAdmin();

    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: 'Password is required.' },
        { status: 400 }
      );
    }

    const { password } = result.data;

    if (!validateAdminPassword(password)) {
      return NextResponse.json(
        { success: false, message: 'Invalid password.' },
        { status: 401 }
      );
    }

    const sessionId = createSession();

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
    });

    response.cookies.set('admin_session', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'An error occurred' },
      { status: 500 }
    );
  }
}
